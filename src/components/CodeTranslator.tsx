import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LineNumberedTextarea from './LineNumberedTextarea';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, AlertCircle, CheckCircle, Download, Wand2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { jsKeywordsDatabase, variableTranslations } from '@/data/translationDatabase';
import { smartTranslate } from '@/services/translationService';
import JSZip from 'jszip';

interface TranslationError {
  line: number;
  message: string;
  word: string;
}

interface CodeError {
  line: number;
  message: string;
  severity: 'error' | 'warning';
  suggestion: string;
  type: string;
}

const CodeTranslator = () => {
  const [arabicCode, setArabicCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  const [errors, setErrors] = useState<TranslationError[]>([]);
  const [codeErrors, setCodeErrors] = useState<CodeError[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  const arabicTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = arabicTextareaRef.current;
    if (!el) return;
    
    // Auto-resize height based on content
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    
    // Auto-scroll horizontally to follow cursor position
    const cursorPosition = el.selectionStart;
    const textBeforeCursor = el.value.substring(0, cursorPosition);
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines[lines.length - 1];
    
    // Calculate approximate character position
    const charWidth = 8; // Approximate character width
    const scrollPosition = Math.max(0, (currentLine.length * charWidth) - (el.clientWidth * 0.7));
    
    // Smooth scroll to follow typing
    el.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
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

// Enhanced translation dictionaries
const jsKeywords = Object.fromEntries(
  Object.entries(jsKeywordsDatabase).map(([arabic, english]) => [
    normalizeArabic(arabic),
    english
  ])
);

const variableKeywords = Object.fromEntries(
  Object.entries(variableTranslations).map(([arabic, english]) => [
    normalizeArabic(arabic),
    english
  ])
);

// Combined translation function with priority for variables
const getTranslation = (word: string): string | null => {
  const normalized = normalizeArabic(word);
  
  // Check variable translations first (higher priority)
  if (variableKeywords[normalized]) {
    return variableKeywords[normalized];
  }
  
  // Then check JS keywords
  if (jsKeywords[normalized]) {
    return jsKeywords[normalized];
  }
  
  return null;
};
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
      
      // مرحلة 1: ترجمة الكلمات المحجوزة من القاعدة المحلية أولاً
      const localTranslations = new Map<string, string>();
      const remainingWords: string[] = [];
      
      for (const word of arabicWords) {
        const cleanWord = word.trim();
        const localTranslation = getTranslation(cleanWord);
        
        if (localTranslation) {
          localTranslations.set(cleanWord, localTranslation);
        } else if (cleanWord && /[\u0600-\u06FF]/.test(cleanWord)) {
          // تجاهل الكلمات العامة والحروف
          const normalized = normalizeArabic(cleanWord);
          const commonWords = ['في','ال','الى','من','ان','هو','هي','و','ثم','على','كل','كله','الكل','مع','بدون','عند','لدى','حول','ضد','نحو','بين','أمام','خلف','فوق','تحت','يمين','يسار'];
          
          if (!commonWords.includes(normalized)) {
            remainingWords.push(cleanWord);
          }
        }
      }
      
      // تطبيق الترجمات المحلية أولاً
      for (const [original, translation] of localTranslations) {
        const safeWord = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(safeWord, 'g');
        result = result.replace(re, translation);
      }
      
      // مرحلة 2: ترجمة الكلمات المتبقية باستخدام الترجمة الخارجية
      for (const word of remainingWords) {
        try {
          const translationResult = await smartTranslate(word, true);
          if (translationResult.success && translationResult.translatedText !== word) {
            const replacement = translationResult.translatedText;
            const safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const re = new RegExp(safeWord, 'g');
            result = result.replace(re, replacement);
          } else {
            // استخدام اسم متغير عام مع رقم تسلسلي
            const replacement = `arabicVar${Math.random().toString(36).substr(2, 5)}`;
            const safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const re = new RegExp(safeWord, 'g');
            result = result.replace(re, replacement);
            
            newErrors.push({
              line: index + 1,
              message: `ترجمة تلقائية للكلمة: ${word} → ${replacement}`,
              word: word
            });
          }
        } catch (error) {
          // في حالة فشل الترجمة الخارجية، استخدام اسم عام
          const replacement = `arabicVar${Math.random().toString(36).substr(2, 5)}`;
          const safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const re = new RegExp(safeWord, 'g');
          result = result.replace(re, replacement);
          
          newErrors.push({
            line: index + 1,
            message: `فشل في ترجمة: ${word} → ${replacement}`,
            word: word
          });
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
      
      // Auto-validate the translated code
      setTimeout(() => {
        const detectedErrors = validateJavaScriptCode(translated);
        setCodeErrors(detectedErrors);
      }, 100);
      
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

// ESLint configuration for JavaScript validation
const eslintConfig = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    // Syntax rules
    'no-undef': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'no-var': 'error',
    'prefer-const': 'warn',
    
    // Best practices
    'eqeqeq': 'error',
    'no-eval': 'error',
    'no-implied-globals': 'error',
    'no-new-func': 'error',
    'no-unreachable': 'error',
    'no-duplicate-case': 'error',
    
    // Style rules
    'indent': ['error', 2],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': 'error'
  }
};

// Prettier configuration for code formatting
const prettierConfig = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'none',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  printWidth: 80
};

// Prettier-like code formatter
const formatJavaScriptCode = (code: string): string => {
  if (!code.trim()) return code;

  const lines = code.split('\n');
  const formattedLines: string[] = [];
  let indentLevel = 0;
  let inMultilineComment = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Handle empty lines
    if (!line) {
      formattedLines.push('');
      continue;
    }

    // Handle multiline comments
    if (line.includes('/*') && !line.includes('*/')) {
      inMultilineComment = true;
    }
    if (inMultilineComment) {
      formattedLines.push('  '.repeat(indentLevel) + line);
      if (line.includes('*/')) {
        inMultilineComment = false;
      }
      continue;
    }

    // Skip single line comments formatting
    if (line.startsWith('//')) {
      formattedLines.push('  '.repeat(indentLevel) + line);
      continue;
    }

    // Decrease indent for closing brackets
    if (line.startsWith('}') || line.startsWith(']') || line.startsWith(')')||
        line === 'else' || line.startsWith('} else') || line.startsWith('} catch') || 
        line.startsWith('} finally')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Format the line with proper spacing
    let formattedLine = line;

    // Add spaces around operators (Prettier style)
    formattedLine = formattedLine
      .replace(/([^=!<>])=([^=])/g, '$1 = $2')        // assignment operators
      .replace(/([^=!<>])==([^=])/g, '$1 == $2')      // comparison operators
      .replace(/([^=])===([^=])/g, '$1 === $2')       // strict equality
      .replace(/([^!])!=([^=])/g, '$1 != $2')         // not equal
      .replace(/([^!])!==([^=])/g, '$1 !== $2')       // strict not equal
      .replace(/([^<>])<=([^=])/g, '$1 <= $2')        // less than or equal
      .replace(/([^<>])>=([^=])/g, '$1 >= $2')        // greater than or equal
      .replace(/([^+])\+([^+=])/g, '$1 + $2')         // addition
      .replace(/([^-])-([^-=])/g, '$1 - $2')          // subtraction
      .replace(/([^*])\*([^*=])/g, '$1 * $2')         // multiplication
      .replace(/([^\/])\/([^\/=])/g, '$1 / $2')       // division
      .replace(/([^%])%([^=])/g, '$1 % $2')           // modulo
      .replace(/&&/g, ' && ')                          // logical AND
      .replace(/\|\|/g, ' || ')                        // logical OR
      .replace(/([^!])!([^=])/g, '$1! $2');           // logical NOT

    // Fix double spaces
    formattedLine = formattedLine.replace(/\s+/g, ' ');

    // Add spaces after commas (Prettier style)
    formattedLine = formattedLine.replace(/,(?!\s)/g, ', ');

    // Add spaces after semicolons in for loops
    formattedLine = formattedLine.replace(/;(?!\s|$)/g, '; ');

    // Format function declarations and calls
    formattedLine = formattedLine
      .replace(/function\s*\(/g, 'function (')
      .replace(/\)\s*{/g, ') {')
      .replace(/}\s*else\s*{/g, '} else {')
      .replace(/}\s*catch\s*\(/g, '} catch (')
      .replace(/}\s*finally\s*{/g, '} finally {');

    // Format if, for, while statements
    formattedLine = formattedLine
      .replace(/if\s*\(/g, 'if (')
      .replace(/for\s*\(/g, 'for (')
      .replace(/while\s*\(/g, 'while (')
      .replace(/switch\s*\(/g, 'switch (');

    // Format object literals
    formattedLine = formattedLine
      .replace(/{(?!\s)/g, '{ ')
      .replace(/(?<!\s)}/g, ' }')
      .replace(/\[(?!\s)/g, '[ ')
      .replace(/(?<!\s)\]/g, ' ]');

    // Add proper indentation
    const indent = '  '.repeat(indentLevel);
    formattedLine = indent + formattedLine;

    // Increase indent for opening brackets
    if (line.includes('{') && !line.includes('}')) {
      indentLevel++;
    }
    if ((line.includes('[') && !line.includes(']')) ||
        line.startsWith('if') || line.startsWith('for') || line.startsWith('while') ||
        line.startsWith('function') || line.includes('else if')) {
      // Only increase indent if there's no opening brace on the same line
      if (!line.includes('{')) {
        indentLevel++;
      }
    }

    formattedLines.push(formattedLine);
  }

  // Add final newline (Prettier style)
  let result = formattedLines.join('\n');
  if (result && !result.endsWith('\n')) {
    result += '\n';
  }

  return result;
};

const validateJavaScriptCode = (code: string): CodeError[] => {
  const errors: CodeError[] = [];
  const lines = code.split('\n');

  // Basic syntax validation
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*')) {
      return;
    }

    // Check for syntax errors with ESLint-like rules
    
    // Missing semicolons (semi rule)
    if (trimmedLine && 
        !trimmedLine.endsWith(';') && 
        !trimmedLine.endsWith('{') && 
        !trimmedLine.endsWith('}') && 
        !trimmedLine.endsWith(',') && 
        !trimmedLine.endsWith('(') &&
        !trimmedLine.endsWith(')') && 
        !trimmedLine.includes('if') && 
        !trimmedLine.includes('else') && 
        !trimmedLine.includes('for') &&
        !trimmedLine.includes('while') && 
        !trimmedLine.includes('function') &&
        (trimmedLine.includes('=') || trimmedLine.includes('return') || 
         trimmedLine.includes('console.') || trimmedLine.includes('alert('))) {
      errors.push({
        line: lineNumber,
        message: 'مفقود فاصلة منقوطة (ESLint: semi)',
        severity: 'error',
        suggestion: 'أضف ; في نهاية السطر',
        type: 'ESLint-syntax'
      });
    }

    // Check for var usage (no-var rule)
    if (trimmedLine.includes('var ')) {
      errors.push({
        line: lineNumber,
        message: 'استخدم let أو const بدلاً من var (ESLint: no-var)',
        severity: 'error',
        suggestion: 'استبدل var بـ let أو const',
        type: 'ESLint-best-practice'
      });
    }

    // Check for double quotes (quotes rule)
    if (trimmedLine.includes('"') && !trimmedLine.includes("'")) {
      errors.push({
        line: lineNumber,
        message: 'استخدم علامات اقتباس مفردة (ESLint: quotes)',
        severity: 'error',
        suggestion: "استبدل \" بـ '",
        type: 'ESLint-style'
      });
    }

    // Check for == instead of === (eqeqeq rule)
    if (trimmedLine.includes('==') && !trimmedLine.includes('===') && !trimmedLine.includes('!==')) {
      errors.push({
        line: lineNumber,
        message: 'استخدم === بدلاً من == (ESLint: eqeqeq)',
        severity: 'error',
        suggestion: 'استبدل == بـ ===',
        type: 'ESLint-best-practice'
      });
    }

    // Check for eval usage (no-eval rule)
    if (trimmedLine.includes('eval(')) {
      errors.push({
        line: lineNumber,
        message: 'تجنب استخدام eval() (ESLint: no-eval)',
        severity: 'error',
        suggestion: 'استخدم طرق أخرى آمنة بدلاً من eval',
        type: 'ESLint-security'
      });
    }

    // Check for console.log without parentheses
    if (trimmedLine.includes('console.log') && !trimmedLine.includes('console.log(')) {
      errors.push({
        line: lineNumber,
        message: 'خطأ في صيغة console.log (ESLint: syntax-error)',
        severity: 'error',
        suggestion: 'استخدم console.log() مع أقواس',
        type: 'ESLint-syntax'
      });
    }

    // Check for unmatched brackets
    const openBrackets = (line.match(/\{/g) || []).length;
    const closeBrackets = (line.match(/\}/g) || []).length;
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;

    if (openBrackets > closeBrackets && !lines.slice(index + 1).some(l => l.includes('}'))) {
      errors.push({
        line: lineNumber,
        message: 'قوس معقوف مفتوح غير مغلق (ESLint: syntax-error)',
        severity: 'error',
        suggestion: 'أضف } لإغلاق القوس',
        type: 'ESLint-syntax'
      });
    }

    if (openParens > closeParens) {
      errors.push({
        line: lineNumber,
        message: 'قوس عادي مفتوح غير مغلق (ESLint: syntax-error)',
        severity: 'error',
        suggestion: 'أضف ) لإغلاق القوس',
        type: 'ESLint-syntax'
      });
    }

    // Check for unused variables pattern
    if (trimmedLine.includes('let ') || trimmedLine.includes('const ')) {
      const varMatch = trimmedLine.match(/(let|const)\s+(\w+)/);
      if (varMatch) {
        const varName = varMatch[2];
        const restOfCode = lines.slice(index + 1).join('\n');
        if (!restOfCode.includes(varName) && !code.substring(0, lines.slice(0, index).join('\n').length).includes(varName)) {
          errors.push({
            line: lineNumber,
            message: `متغير غير مستخدم: ${varName} (ESLint: no-unused-vars)`,
            severity: 'warning',
            suggestion: 'احذف المتغير أو استخدمه في الكود',
            type: 'ESLint-warning'
          });
        }
      }
    }

    // Check for function without parentheses
    if (trimmedLine.includes('function') && !trimmedLine.includes('()') && !trimmedLine.includes('(')) {
      errors.push({
        line: lineNumber,
        message: 'دالة بدون أقواس (ESLint: syntax-error)',
        severity: 'error',
        suggestion: 'أضف () بعد اسم الدالة',
        type: 'ESLint-syntax'
      });
    }

    // Check for trailing spaces (no-trailing-spaces rule)
    if (line !== line.trimEnd()) {
      errors.push({
        line: lineNumber,
        message: 'مسافات زائدة في نهاية السطر (ESLint: no-trailing-spaces)',
        severity: 'warning',
        suggestion: 'احذف المسافات الزائدة من نهاية السطر',
        type: 'ESLint-style'
      });
    }

    // Check for indentation (basic check)
    if (trimmedLine && line.startsWith(' ') && line.match(/^ +/)?.[0].length % 2 !== 0) {
      errors.push({
        line: lineNumber,
        message: 'مشكلة في المحاذاة - استخدم مسافتين (ESLint: indent)',
        severity: 'warning',
        suggestion: 'استخدم مسافتين للمحاذاة',
        type: 'ESLint-style'
      });
    }

    // Check for potential runtime errors
    if (trimmedLine.includes('.length') && !trimmedLine.includes('if') && !trimmedLine.includes('&&')) {
      errors.push({
        line: lineNumber,
        message: 'تحقق من وجود المصفوفة قبل استخدام .length (ESLint: best-practice)',
        severity: 'warning',
        suggestion: 'استخدم if أو && للتحقق من وجود المصفوفة أولاً',
        type: 'ESLint-runtime'
      });
    }

    // Check for undefined variables (basic check)
    const words = trimmedLine.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g) || [];
    const jsKeywords = ['var', 'let', 'const', 'function', 'if', 'else', 'for', 'while', 'do', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'switch', 'case', 'default', 'true', 'false', 'null', 'undefined', 'console', 'alert', 'document', 'window'];
    
    words.forEach(word => {
      if (!jsKeywords.includes(word) && !code.includes(`let ${word}`) && !code.includes(`const ${word}`) && !code.includes(`var ${word}`) && !code.includes(`function ${word}`)) {
        // Only flag if it's not a property access or method call
        if (!trimmedLine.includes(`.${word}`) && !trimmedLine.includes(`${word}(`)) {
          errors.push({
            line: lineNumber,
            message: `متغير غير معرف: ${word} (ESLint: no-undef)`,
            severity: 'error',
            suggestion: `تأكد من تعريف المتغير ${word} قبل استخدامه`,
            type: 'ESLint-error'
          });
        }
      }
    });
  });

  return errors;
};

const handleCodeValidation = () => {
  if (!translatedCode.trim()) {
    toast({
      title: 'لا يوجد كود للفحص',
      description: 'يرجى ترجمة الكود أولاً',
    });
    return;
  }

  const detectedErrors = validateJavaScriptCode(translatedCode);
  setCodeErrors(detectedErrors);

  if (detectedErrors.length === 0) {
    toast({
      title: '✅ الكود سليم',
      description: 'لا توجد أخطاء في الكود - جاهز للنشر!',
    });
  } else {
    toast({
      title: `⚠️ تم العثور على ${detectedErrors.length} خطأ`,
      description: 'يرجى مراجعة الأخطاء أدناه',
    });
  }
};

const handleCodeFormatting = () => {
  if (!translatedCode.trim()) {
    toast({
      title: 'لا يوجد كود للتنسيق',
      description: 'يرجى ترجمة الكود أولاً',
    });
    return;
  }

  try {
    const formattedCode = formatJavaScriptCode(translatedCode);
    setTranslatedCode(formattedCode);
    
    // Re-validate after formatting to ensure no conflicts
    setTimeout(() => {
      const detectedErrors = validateJavaScriptCode(formattedCode);
      setCodeErrors(detectedErrors);
    }, 100);

    toast({
      title: '✅ تم تنسيق الكود',
      description: 'تم تنسيق الكود وفقاً لمعايير Prettier',
    });
  } catch (error) {
    toast({
      title: '❌ خطأ في التنسيق',
      description: 'حدث خطأ أثناء تنسيق الكود',
    });
  }
};

const handleDownloadZip = async () => {
  if (!translatedCode.trim()) {
    toast({
      title: 'لا يوجد كود نهائي للتحميل',
      description: 'يرجى ترجمة الكود أولاً',
    });
    return;
  }

  const zip = new JSZip();
  
  // Add the main JavaScript file
  zip.file('main.js', translatedCode);
  
  // Add a basic HTML file to test the code
  const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مشروع ZAS Code</title>
</head>
<body>
    <h1>مشروع ZAS Code</h1>
    <script src="main.js"></script>
</body>
</html>`;
  zip.file('index.html', htmlContent);
  
  // Add error report if there are errors
  if (codeErrors.length > 0) {
    const errorReport = codeErrors.map(err => 
      `السطر ${err.line}: ${err.message} - ${err.suggestion}`
    ).join('\n');
    zip.file('error_report.txt', errorReport);
  }

  try {
    const content = await zip.generateAsync({ type: 'blob' });
    const url = window.URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'zas_project.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: 'تم التحميل بنجاح',
      description: 'تم تحميل المشروع كاملاً مع ملف HTML للتجريب',
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
        <Card className="bg-gradient-to-br from-arabic-blue/10 to-arabic-blue/5 border-arabic-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-right">
              <Code className="h-4 w-4" />
              كتابة الكود بالعربية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
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
                      const replacement = getTranslation(cleanWord);

                      if (!replacement && cleanWord && /[\u0600-\u06FF]/.test(cleanWord)) {
                        const commonWords = ['في','ال','الى','من','ان','هو','هي','و','ثم','على','كل','كله','الكل','مع','بدون','عند','لدى','حول','ضد','نحو','بين','أمام','خلف','فوق','تحت','يمين','يسار'];
                        if (!commonWords.includes(normalized)) {
                          newErrors.push({
                            line: index + 1,
                            message: `كلمة تحتاج ترجمة محسنة: ${cleanWord}`,
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
              className="min-h-[400px] resize-none"
              style={{ 
                overflow: 'auto',
                whiteSpace: 'nowrap',
                wordWrap: 'normal',
                overflowWrap: 'normal',
                textWrap: 'nowrap',
                wordBreak: 'keep-all'
              }}
              dir="rtl"
              overlayContent={highlightErrors(arabicCode)}
              onOverlayClick={handleHighlighterClick}
              overlayRef={overlayRef}
            />
            
            
            {errors.length > 0 && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                <h4 className="text-sm font-medium text-destructive flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  أخطاء في الكود:
                </h4>
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <Badge key={index} variant={error.message.includes('تحتاج ترجمة') ? 'secondary' : 'destructive'} className="text-xs">
                      السطر {error.line}: {error.message}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 space-y-2">
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
                  className="w-full"
                >
                  نسخ المكتوب
                </Button>
                <Button 
                  onClick={handleDownloadZip}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Download className="h-4 w-4" />
                  تحميل ZIP
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* English Output */}
        <Card className="bg-gradient-to-br from-js-yellow/10 to-js-green/10 border-js-yellow/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              الناتج النهائي (JavaScript)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {translatedCode ? (
                <div className="space-y-4">
                  <div className="relative">
                    <LineNumberedTextarea
                      value={translatedCode}
                      readOnly
                      className="min-h-[400px] overflow-x-auto resize-none"
                      style={{ 
                        wordBreak: 'keep-all', 
                        whiteSpace: 'nowrap', 
                        overflowWrap: 'normal',
                        textWrap: 'nowrap'
                      }}
                    />
                    {errors.length === 0 && codeErrors.length === 0 && (
                      <Badge className="absolute top-2 right-2 bg-js-green text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        جاهز للتشغيل
                      </Badge>
                    )}
                    {codeErrors.length > 0 && (
                      <Badge className="absolute top-2 right-2 bg-destructive text-white">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {codeErrors.length} خطأ
                      </Badge>
                    )}
                  </div>

                  {/* Code Errors Display */}
                  {codeErrors.length > 0 && (
                    <div className="p-3 bg-destructive/10 rounded-md border border-destructive/20">
                      <h4 className="text-sm font-medium text-destructive flex items-center gap-2 mb-3">
                        <AlertCircle className="h-4 w-4" />
                        أخطاء في الكود النهائي:
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {codeErrors.map((error, index) => (
                          <div key={index} className="p-2 bg-background/50 rounded-sm border-r-2 border-r-destructive">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <Badge 
                                  variant={error.severity === 'error' ? 'destructive' : 'secondary'} 
                                  className="text-xs mb-1"
                                >
                                  السطر {error.line} - {error.type}
                                </Badge>
                                <p className="text-sm text-destructive font-medium">{error.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">💡 {error.suggestion}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(translatedCode);
                        toast({ title: 'تم النسخ', description: 'تم نسخ الناتج النهائي (JavaScript).' });
                      }}
                      variant="outline"
                      className="w-full text-xs"
                    >
                      نسخ الكود
                    </Button>
                    <Button 
                      onClick={handleCodeValidation}
                      variant="outline"
                      className="w-full gap-1 text-xs"
                    >
                      <AlertCircle className="h-3 w-3" />
                      فحص ESLint
                    </Button>
                    <Button 
                      onClick={handleCodeFormatting}
                      variant="outline"
                      className="w-full gap-1 text-xs"
                    >
                      <Wand2 className="h-3 w-3" />
                      تنسيق Prettier
                    </Button>
                  </div>
                </div>
            ) : (
              <div className="flex items-center justify-center text-muted-foreground min-h-[400px]">
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