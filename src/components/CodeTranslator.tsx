import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

const jsKeywordsRaw: Record<string, string> = {
  'متغير': 'let',
  'متغيّر': 'let',
  'دع': 'let',

  'ثابت': 'const',
  'ثابته': 'const',
  'ثوابت': 'const',

  'دالة': 'function',
  'وظيفة': 'function',
  'وظيفه': 'function',
  'داله': 'function',
  'تابع': 'function',

  'إذا': 'if',
  'لو': 'if',
  'اذا': 'if',
  'إذا ما': 'if',

  'وإلا': 'else',
  'وإلا_إذا': 'else if',
  'وإلا إذا': 'else if',

  'لـ': 'for',
  'لكل': 'for',
  'حلقة': 'for',
  'حلقه': 'for',

  'بينما': 'while',
  'أثناء': 'while',

  'إرجاع': 'return',
  'ارجاع': 'return',
  'ارجع': 'return',
  'إخراج': 'return',

  'جديد': 'new',

  'هذا': 'this',
  'هذه': 'this',

  'صحيح': 'true',
  'صح': 'true',
  'نعم': 'true',

  'خطأ': 'false',
  'غلط': 'false',
  'لا': 'false',

  'فارغ': 'null',
  'لاشيء': 'null',
  'لا شيء': 'null',
  'عدم': 'null',

  'غير_محدد': 'undefined',
  'غير محدد': 'undefined',
  'غير معرف': 'undefined',
  'غير معرفة': 'undefined',
  'مش معرف': 'undefined',

  'طباعة': 'console.log',
  'اطبع': 'console.log',
  'أطبع': 'console.log',
  'اكتب': 'console.log',
  'سجل': 'console.log',

  'تنبيه': 'alert',
  'إنذار': 'alert',

  'مصفوفة': 'Array',
  'مصفوفه': 'Array',
  'كائن': 'Object',
  'سلسلة': 'String',
  'سلسله': 'String',
  'نص': 'String',
  'نصي': 'String',
  'رقم': 'Number',
  'عدد': 'Number',
  'منطقي': 'Boolean',
  'خريطة': 'Map',
  'مجموعة': 'Set',
  'تاريخ': 'Date',

  'تجربة': 'try',
  'جرب': 'try',
  'جرّب': 'try',
  'حاول': 'try',

  'التقاط': 'catch',
  'أمسك': 'catch',

  'أخيرا': 'finally',
  'اخيرا': 'finally',
  'نهائيا': 'finally',
  'نهائيًا': 'finally',

  'رمي': 'throw',
  'ارم': 'throw',
  'إلق': 'throw',

  'كسر': 'break',
  'اخرج': 'break',
  'إكسر': 'break',
  'توقف': 'break',

  'استمرار': 'continue',
  'استمر': 'continue',

  'تبديل': 'switch',
  'بدل': 'switch',
  'التبديل': 'switch',
  'حالة': 'case',
  'قضية': 'case',
  'افتراضي': 'default',
  'افتراضيه': 'default',

  'فئة': 'class',
  'صف': 'class',
  'صنف': 'class',
  'كلاس': 'class',

  'توسيع': 'extends',
  'يمتد': 'extends',

  'تصدير': 'export',
  'صدّر': 'export',
  'تصدير افتراضي': 'export default',

  'استيراد': 'import',
  'استورد': 'import',

  'من': 'from',

  'غير_متزامن': 'async',
  'غير متزامن': 'async',
  'لا متزامن': 'async',

  'انتظار': 'await',
  'انتظر': 'await',

  'نوع': 'typeof',
  'مثيل': 'instanceof',
  'حذف': 'delete',

  'وعد': 'Promise',
  'الوعد': 'Promise',

  // Arithmetic operators (Arabic words -> JS symbols)
  'جمع': '+',
  'زائد': '+',
  'زايد': '+',
  'زيادة': '+',
  'اضافة': '+',
  'إضافة': '+',

  'طرح': '-',
  'ناقص': '-',
  'خصم': '-',
  'إنقاص': '-',
  'انقاص': '-',
  'سالب': '-',

  // Multiplication
  'ضرب': '*',
  'الضرب': '*',
  '×': '*',
  '✕': '*',

  // Division
  'قسمة': '/',
  'قسمه': '/',
  'القسمة': '/',
  'القسمه': '/',
  '÷': '/'
};


  const jsKeywords: Record<string, string> = Object.fromEntries(
    Object.entries(jsKeywordsRaw).map(([k, v]) => [normalizeArabic(k), v])
  );
const validateAndTranslate = (code: string) => {
  const lines = code.split('\n');
  const newErrors: TranslationError[] = [];
  const translatedLines: string[] = [];

  lines.forEach((line, index) => {
    const stringRanges = getStringRanges(line);

    const stripStrings = (s: string) => {
      let out = s;
      stringRanges.slice().reverse().forEach(r => {
        out = out.slice(0, r.start) + ' '.repeat(r.end - r.start) + out.slice(r.end);
      });
      return out;
    };

    const processSegment = (seg: string) => {
      let result = seg;
      const arabicWords = seg.match(/[\u0600-\u06FF_]+/g) || [];
      arabicWords.forEach((word) => {
        const cleanWord = word.trim();
        const normalized = normalizeArabic(cleanWord);
        const replacement = jsKeywords[normalized];

        if (replacement) {
          const safeWord = cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const re = new RegExp(safeWord, 'g');
          result = result.replace(re, replacement);
        } else if (cleanWord && /[\u0600-\u06FF]/.test(cleanWord)) {
          if (!['في','ال','الى','من','ان','هو','هي','و','ثم','على'].includes(normalized)) {
            newErrors.push({
              line: index + 1,
              message: `كلمة غير معروفة في JavaScript: ${cleanWord}`,
              word: cleanWord
            });
          }
        }
      });
      return result;
    };

    let translatedLine = '';
    if (stringRanges.length === 0) {
      translatedLine = processSegment(line);
    } else {
      let cursor = 0;
      stringRanges.forEach((r) => {
        const before = line.slice(cursor, r.start);
        translatedLine += processSegment(before);
        translatedLine += line.slice(r.start, r.end); // keep string literal intact
        cursor = r.end;
      });
      if (cursor < line.length) {
        translatedLine += processSegment(line.slice(cursor));
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
  });

  setErrors(newErrors);
  return translatedLines.join('\n');
};


  const handleTranslate = () => {
    if (!arabicCode.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate processing time
    setTimeout(() => {
      const translated = validateAndTranslate(arabicCode);
      setTranslatedCode(translated);
      setIsTranslating(false);
    }, 1000);
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


  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Arabic Input */}
      <Card className="bg-gradient-to-br from-arabic-blue/10 to-arabic-blue/5 border-arabic-blue/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-arabic-blue">
            <Code className="h-5 w-5" />
            الكود بالعربية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
<div className="relative" onClick={handleHighlighterClick}>
  <div
    ref={overlayRef}
    className="absolute inset-0 z-10 whitespace-pre-wrap font-mono text-right text-sm leading-6 px-3 py-2 rounded-md pointer-events-none"
    dir="rtl"
    dangerouslySetInnerHTML={{ __html: highlightErrors(arabicCode) }}
  />
  <Textarea
    ref={arabicTextareaRef}
    value={arabicCode}
    onChange={(e) => {
      setArabicCode(e.target.value);
      // Live validation to highlight errors as you type
      validateAndTranslate(e.target.value);
    }}
    placeholder="اكتب الكود بالعربية هنا...

مثال:
متغير اسم = 'أحمد'
دالة تحية() {
  طباعة('مرحبا ' + اسم)
}
تحية()"
    className="min-h-[300px] font-mono text-right bg-transparent border-arabic-blue/30 focus:border-arabic-blue text-transparent caret-transparent px-3 py-2 text-sm leading-6 resize-none overflow-hidden"
    dir="rtl"
    style={{ caretColor: 'hsl(var(--foreground))' }}
  />
</div>
          
          {errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-error-red flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                أخطاء في الكود:
              </h4>
              {errors.map((error, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  السطر {error.line}: {error.message}
                </Badge>
              ))}
            </div>
          )}
          
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
</div>
        </CardContent>
      </Card>

      {/* English Output */}
      <Card className="bg-gradient-to-br from-js-yellow/10 to-js-green/10 border-js-yellow/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-js-yellow">
            <Code className="h-5 w-5" />
            JavaScript Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          {translatedCode ? (
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  value={translatedCode}
                  readOnly
                  className="min-h-[300px] font-mono bg-background/50 border-js-yellow/30"
                />
                {errors.length === 0 && (
                  <Badge className="absolute top-2 right-2 bg-js-green text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    جاهز للتشغيل
                  </Badge>
                )}
              </div>
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
          ) : (
            <div className="min-h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Code className="h-12 w-12 mx-auto opacity-50" />
                <p>سيظهر الكود المترجم هنا</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeTranslator;