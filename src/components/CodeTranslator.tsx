import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, AlertCircle, CheckCircle } from 'lucide-react';

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

  // Arabic to English JavaScript keywords mapping
  const jsKeywords = {
    'متغير': 'let',
    'ثابت': 'const',
    'دالة': 'function',
    'إذا': 'if',
    'وإلا': 'else',
    'وإلا_إذا': 'else if',
    'لـ': 'for',
    'بينما': 'while',
    'إرجاع': 'return',
    'جديد': 'new',
    'هذا': 'this',
    'صحيح': 'true',
    'خطأ': 'false',
    'فارغ': 'null',
    'غير_محدد': 'undefined',
    'طباعة': 'console.log',
    'تنبيه': 'alert',
    'مصفوفة': 'Array',
    'كائن': 'Object',
    'سلسلة': 'String',
    'رقم': 'Number',
    'منطقي': 'Boolean',
    'تجربة': 'try',
    'التقاط': 'catch',
    'أخيرا': 'finally',
    'رمي': 'throw',
    'كسر': 'break',
    'استمرار': 'continue',
    'تبديل': 'switch',
    'حالة': 'case',
    'افتراضي': 'default',
    'فئة': 'class',
    'توسيع': 'extends',
    'تصدير': 'export',
    'استيراد': 'import',
    'من': 'from',
    'غير_متزامن': 'async',
    'انتظار': 'await',
    'وعد': 'Promise'
  };

  const validateAndTranslate = (code: string) => {
    const lines = code.split('\n');
    const newErrors: TranslationError[] = [];
    const translatedLines: string[] = [];

    lines.forEach((line, index) => {
      let translatedLine = line;
      let hasError = false;

      // Check for basic syntax errors
      const arabicWords = line.match(/[\u0600-\u06FF_]+/g) || [];
      
      arabicWords.forEach(word => {
        const cleanWord = word.trim();
        
        if (jsKeywords[cleanWord]) {
          translatedLine = translatedLine.replace(cleanWord, jsKeywords[cleanWord]);
        } else if (cleanWord && /[\u0600-\u06FF]/.test(cleanWord)) {
          // Check if it's an unknown Arabic word
          if (!['في', 'الـ', 'إلى', 'من', 'أن', 'هو', 'هي'].includes(cleanWord)) {
            newErrors.push({
              line: index + 1,
              message: `كلمة غير معروفة في JavaScript: ${cleanWord}`,
              word: cleanWord
            });
            hasError = true;
          }
        }
      });

      // Check for common syntax issues
      if (line.includes('(') && !line.includes(')')) {
        newErrors.push({
          line: index + 1,
          message: 'قوس مفتوح غير مغلق',
          word: '('
        });
        hasError = true;
      }

      if (line.includes('{') && !line.includes('}') && !lines.slice(index + 1).some(l => l.includes('}'))) {
        newErrors.push({
          line: index + 1,
          message: 'قوس معقوف مفتوح غير مغلق',
          word: '{'
        });
        hasError = true;
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
    if (errors.length === 0) return code;
    
    let highlightedCode = code;
    errors.forEach(error => {
      const lines = highlightedCode.split('\n');
      if (lines[error.line - 1]) {
        lines[error.line - 1] = lines[error.line - 1].replace(
          error.word,
          `<span class="bg-error-red/20 text-error-red font-bold">${error.word}</span>`
        );
      }
      highlightedCode = lines.join('\n');
    });
    
    return highlightedCode;
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
          <Textarea
            value={arabicCode}
            onChange={(e) => setArabicCode(e.target.value)}
            placeholder="اكتب الكود بالعربية هنا...

مثال:
متغير اسم = 'أحمد'
دالة تحية() {
  طباعة('مرحبا ' + اسم)
}
تحية()"
            className="min-h-[300px] font-mono text-right bg-background/50 border-arabic-blue/30 focus:border-arabic-blue"
            dir="rtl"
          />
          
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
                onClick={() => navigator.clipboard.writeText(translatedCode)}
                variant="outline"
                className="w-full border-js-yellow/30 hover:bg-js-yellow/10"
              >
                نسخ الكود
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