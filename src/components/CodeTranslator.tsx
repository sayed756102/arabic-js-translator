import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LineNumberedTextarea from './LineNumberedTextarea';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { jsKeywordsDatabase } from '@/data/translationDatabase';
import { smartTranslate } from '@/services/translationService';
import JSZip from 'jszip';

interface TranslationError {
  line: number;
  message: string;
  word: string;
}

const CodeTranslator = () => {
  const [arabicCode, setArabicCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  const [errors, setErrors] = useState<TranslationError[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  const arabicTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = arabicTextareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [arabicCode]);

// Arabic to English JavaScript keywords mapping (expanded + normalization)
const normalizeArabic = (s: string) => s
  .replace(/\u0640/g, '') // remove tatweel
  .replace(/[\u064B-\u065F]/g, '') // remove diacritics
  .replace(/[أإآا]/g, 'ا') // normalize alef
  .replace(/ى/g, 'ي') // normalize alif maqsura to ya
  .replace(/ة/g, 'ه') // normalize ta marbuta to ha (approx.)
  .trim();

// Find string literal ranges in a single line to avoid translating/highlighting inside them
const getStringRanges = (line: string) => {
  const ranges: Array<{ start: number; end: number }> = [];
  let quote: string | null = null;
  let start = -1;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '\\') { i++; continue; }
    if (quote) {
      if (ch === quote) {
        ranges.push({ start, end: i + 1 });
        quote = null;
        start = -1;
      }
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      start = i;
    }
  }
  return ranges;
};

// Use the imported JavaScript keywords database
const jsKeywords = Object.fromEntries(
  Object.entries(jsKeywordsDatabase).map(([arabic, english]) => [
    normalizeArabic(arabic),
    english
  ])
);
const validateAndTranslate = async (code: string) => {
  const lines = code.split('\n');
  const newErrors: TranslationError[] = [];
  const translatedLines: string[] = [];

  for (const [index, line] of lines.entries()) {
    const stringRanges = getStringRanges(line);

    const stripStrings = (s: string) => {
      let out = s;
      stringRanges.slice().reverse().forEach(r => {
        out = out.slice(0, r.start) + ' '.repeat(r.end - r.start) + out.slice(r.end);
      });
      return out;
    };

    const processSegment = async (seg: string) => {
      let result = seg;
      const arabicWords = seg.match(/[\u0600-\u06FF_]+/g) || [];
      
      for (const word of arabicWords) {
        const cleanWord = word.trim();
        const normalized = normalizeArabic(cleanWord);
        let replacement = jsKeywords[normalized];

        if (replacement) {
          // استخدام قاعدة البيانات المحلية للكلمات المحجوزة
          const safeWord = cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const re = new RegExp(safeWord, 'g');
          result = result.replace(re, replacement);
        } else if (cleanWord && /[\u0600-\u06FF]/.test(cleanWord)) {
          // تجاهل الكلمات العامة
          if (!['في','ال','الى','من','ان','هو','هي','و','ثم','على','كل','كله','الكل'].includes(normalized)) {
            // استخدام خدمة الترجمة المفتوحة المصدر للكلمات غير المحجوزة
            try {
              const translationResult = await smartTranslate(cleanWord);
              if (translationResult.success && translationResult.translatedText !== cleanWord) {
                replacement = translationResult.translatedText.toLowerCase().replace(/\s+/g, '_');
                const safeWord = cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const re = new RegExp(safeWord, 'g');
                result = result.replace(re, replacement);
              } else {
                newErrors.push({
                  line: index + 1,
                  message: `كلمة غير معروفة: ${cleanWord} - ${translationResult.error || 'لم تترجم'}`,
                  word: cleanWord
                });
              }
            } catch (error) {
              newErrors.push({
                line: index + 1,
                message: `كلمة غير معروفة: ${cleanWord}`,
                word: cleanWord
              });
            }
          }
        }
      }
      return result;
    };

    let translatedLine = '';
    if (stringRanges.length === 0) {
      translatedLine = await processSegment(line);
    } else {
      let cursor = 0;
      for (const r of stringRanges) {
        const before = line.slice(cursor, r.start);
        translatedLine += await processSegment(before);
        translatedLine += line.slice(r.start, r.end); // keep string literal intact
        cursor = r.end;
      }
      if (cursor < line.length) {
        translatedLine += await processSegment(line.slice(cursor));
      }
    }

    // Simple syntax checks ignoring strings
    const lineNoStrings = stripStrings(line);

    if (lineNoStrings.includes('(') && !lineNoStrings.includes(')')) {
      newErrors.push({
        line: index + 1,
        message: 'قوس مفتوح غير مغلق',
        word: '('
      });
    }

    if (
      lineNoStrings.includes('{') &&
      !lineNoStrings.includes('}') &&
      !lines.slice(index + 1).some(l => l.includes('}'))
    ) {
      newErrors.push({
        line: index + 1,
        message: 'قوس معقوف مفتوح غير مغلق',
        word: '{'
      });
    }

    translatedLines.push(translatedLine);
  }

  setErrors(newErrors);
  return translatedLines.join('\n');
};


  const handleTranslate = async () => {
    if (!arabicCode.trim()) return;
    
    setIsTranslating(true);
    
    try {
      const translated = await validateAndTranslate(arabicCode);
      setTranslatedCode(translated);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

const highlightErrors = (code: string) => {
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;')
     .replace(/</g, '&lt;')
     .replace(/>/g, '&gt;');

  const lines = code.split('\n');

  const isInRanges = (idx: number, ranges: Array<{ start: number; end: number }>) =>
    ranges.some(r => idx >= r.start && idx < r.end);

  const resultLines = lines.map((line, i) => {
    const lineIndex = i + 1;
    const lineErrors = errors.filter(e => e.line === lineIndex);
    if (lineErrors.length === 0) return escapeHtml(line);

    const ranges = getStringRanges(line);
    type Marker = { start: number; end: number; message: string };
    const markers: Marker[] = [];

    const addMarkersForWord = (word: string, message: string) => {
      if (!word) return;
      let from = 0;
      while (from < line.length) {
        const at = line.indexOf(word, from);
        if (at === -1) break;
        const end = at + word.length;
        if (!isInRanges(at, ranges)) {
          markers.push({ start: at, end, message });
        }
        from = end;
      }
    };

    lineErrors.forEach(err => addMarkersForWord(err.word, err.message));

    // Sort and de-duplicate overlapping markers
    markers.sort((a, b) => a.start - b.start);
    const merged: Marker[] = [];
    markers.forEach(m => {
      const last = merged[merged.length - 1];
      if (!last || m.start >= last.end) merged.push(m);
    });

    let out = '';
    let cursor = 0;
    const escapeAttr = (s: string) => (s || '').replace(/'/g, '&#39;').replace(/"/g, '&quot;');

    merged.forEach(m => {
      if (cursor < m.start) out += escapeHtml(line.slice(cursor, m.start));
      const rawWord = line.slice(m.start, m.end);
      out += `<span class="bg-error-red/20 text-error-red rounded-sm box-decoration-clone cursor-help" data-error-message='${escapeAttr(m.message)}'>${escapeHtml(rawWord)}</span>`;
      cursor = m.end;
    });

    if (cursor < line.length) out += escapeHtml(line.slice(cursor));
    return out;
  });

  return resultLines.join('\n');
};

const handleHighlighterClick = (e: React.MouseEvent) => {
  const ov = overlayRef.current;
  if (!ov) return;
  const prev = ov.style.pointerEvents;
  ov.style.pointerEvents = 'auto';
  const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
  ov.style.pointerEvents = prev || 'none';
  const hit = el?.closest('[data-error-message]') as HTMLElement | null;
  if (hit) {
    const message = hit.getAttribute('data-error-message') || 'خطأ غير محدد';
    toast({
      title: 'تفاصيل الخطأ',
      description: message,
    });
  }
  };

  const handleDownloadZip = async () => {
    if (!arabicCode.trim() && !translatedCode.trim()) {
      toast({
        title: 'لا يوجد محتوى للتحميل',
        description: 'يرجى كتابة كود أولاً',
      });
      return;
    }

    const zip = new JSZip();
    
    if (arabicCode.trim()) {
      zip.file('arabic_code.txt', arabicCode);
    }
    
    if (translatedCode.trim()) {
      zip.file('translated_code.js', translatedCode);
    }

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'zas_code.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'تم التحميل بنجاح',
        description: 'تم تحميل الملف المضغوط',
      });
    } catch (error) {
      toast({
        title: 'خطأ في التحميل',
        description: 'حدث خطأ أثناء إنشاء الملف المضغوط',
      });
    }
  };

  return (
    <div>      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Arabic Input */}
        <Card className="bg-gradient-to-br from-arabic-blue/10 to-arabic-blue/5 border-arabic-blue/20 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
            <CardTitle className="flex items-center gap-2 text-sm font-mono">
              <Code className="h-4 w-4" />
              Arabic Code Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-slate-900 text-green-400 font-mono text-sm overflow-auto">
              <LineNumberedTextarea
                ref={arabicTextareaRef}
                value={arabicCode}
                onChange={(e) => {
                  setArabicCode(e.target.value);
                  // Live validation to highlight errors as you type (without translation service for performance)
                  const quickValidate = (code: string) => {
                    const lines = code.split('\n');
                    const newErrors: TranslationError[] = [];
                    
                    lines.forEach((line, index) => {
                      const arabicWords = line.match(/[\u0600-\u06FF_]+/g) || [];
                      arabicWords.forEach((word) => {
                        const cleanWord = word.trim();
                        const normalized = normalizeArabic(cleanWord);
                        const replacement = jsKeywords[normalized];

                        if (!replacement && cleanWord && /[\u0600-\u06FF]/.test(cleanWord)) {
                          if (!['في','ال','الى','من','ان','هو','هي','و','ثم','على','كل','كله','الكل'].includes(normalized)) {
                            newErrors.push({
                              line: index + 1,
                              message: `كلمة تحتاج ترجمة: ${cleanWord}`,
                              word: cleanWord
                            });
                          }
                        }
                      });
                    });
                    setErrors(newErrors);
                  };
                  quickValidate(e.target.value);
                }}
                placeholder="اكتب الكود بالعربية هنا...

مثال:
متغير اسم = 'أحمد'
دالة تحية() {
  طباعة('مرحبا ' + اسم)
}
تحية()"
                className="min-h-[400px] w-full bg-slate-900 text-green-400 border-0 resize-none font-mono text-sm overflow-x-auto whitespace-nowrap"
                style={{ wordBreak: 'keep-all', whiteSpace: 'pre' }}
                dir="rtl"
                overlayContent={highlightErrors(arabicCode)}
                onOverlayClick={handleHighlighterClick}
                overlayRef={overlayRef}
              />
            </div>
            
            {errors.length > 0 && (
              <div className="p-4 space-y-2 bg-red-900/20 border-t border-red-500/20">
                <h4 className="text-sm font-medium text-red-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  أخطاء في الكود:
                </h4>
                {errors.map((error, index) => (
                  <Badge key={index} variant={error.message.includes('تحتاج ترجمة') ? 'secondary' : 'destructive'} className="text-xs">
                    السطر {error.line}: {error.message}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="p-4 bg-slate-800 border-t border-slate-700">
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  onClick={handleTranslate} 
                  disabled={!arabicCode.trim() || isTranslating}
                  className="w-full bg-arabic-blue hover:bg-arabic-blue/90"
                >
                  {isTranslating ? (
                    'جاري الترجمة...'
                  ) : (
                    <>
                      ترجم إلى JavaScript
                      <ArrowRight className="mr-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(arabicCode);
                      toast({ title: 'تم النسخ', description: 'تم نسخ النص العربي.' });
                    }}
                    variant="outline"
                    className="w-full border-arabic-blue/30 hover:bg-arabic-blue/10"
                  >
                    نسخ المكتوب
                  </Button>
                  <Button 
                    onClick={handleDownloadZip}
                    variant="outline"
                    className="w-full border-green-500/30 hover:bg-green-500/10 gap-2"
                  >
                    <Download className="h-4 w-4" />
                    تحميل ZIP
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* English Output */}
        <Card className="bg-gradient-to-br from-js-yellow/10 to-js-green/10 border-js-yellow/20 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
            <CardTitle className="flex items-center gap-2 text-sm font-mono">
              <Code className="h-4 w-4" />
              JavaScript Output
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {translatedCode ? (
              <div>
                <div className="relative bg-slate-900">
                  <LineNumberedTextarea
                    value={translatedCode}
                    readOnly
                    className="min-h-[400px] w-full bg-slate-900 text-blue-300 border-0 resize-none font-mono text-sm overflow-x-auto whitespace-nowrap"
                    style={{ wordBreak: 'keep-all', whiteSpace: 'pre' }}
                  />
                  {errors.length === 0 && (
                    <Badge className="absolute top-2 right-2 bg-js-green text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      جاهز للتشغيل
                    </Badge>
                  )}
                </div>
                <div className="p-4 bg-slate-800 border-t border-slate-700">
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(translatedCode);
                      toast({ title: 'تم النسخ', description: 'تم نسخ الناتج النهائي (JavaScript).' });
                    }}
                    variant="outline"
                    className="w-full border-js-yellow/30 hover:bg-js-yellow/10"
                  >
                    نسخ الناتج النهائي
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center text-muted-foreground min-h-[400px] bg-slate-900">
                <div className="text-center space-y-2">
                  <Code className="h-12 w-12 mx-auto opacity-50" />
                  <p>سيظهر الكود المترجم هنا</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeTranslator;