// خدمة الترجمة مفتوحة المصدر
export interface TranslationResult {
  translatedText: string;
  success: boolean;
  error?: string;
}

// خدمة ترجمة مجانية باستخدام MyMemory (مفتوحة المصدر)
export const translateText = async (text: string, fromLang = 'ar', toLang = 'en'): Promise<TranslationResult> => {
  try {
    // استخدام MyMemory API - مجانية ومفتوحة المصدر
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`
    );
    
    if (!response.ok) {
      throw new Error('فشل في الاتصال بخدمة الترجمة');
    }
    
    const data = await response.json();
    
    if (data.responseData && data.responseData.translatedText) {
      return {
        translatedText: data.responseData.translatedText,
        success: true
      };
    } else {
      throw new Error('لم يتم العثور على ترجمة');
    }
  } catch (error) {
    console.error('Translation error:', error);
    return {
      translatedText: text, // إرجاع النص الأصلي في حالة الخطأ
      success: false,
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    };
  }
};

// خدمة ترجمة احتياطية باستخدام LibreTranslate
export const translateWithLibreTranslate = async (text: string): Promise<TranslationResult> => {
  try {
    // استخدام خادم LibreTranslate المجاني
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'ar',
        target: 'en',
        format: 'text'
      })
    });
    
    if (!response.ok) {
      throw new Error('فشل في الاتصال بخدمة LibreTranslate');
    }
    
    const data = await response.json();
    
    return {
      translatedText: data.translatedText,
      success: true
    };
  } catch (error) {
    console.error('LibreTranslate error:', error);
    return {
      translatedText: text,
      success: false,
      error: error instanceof Error ? error.message : 'خطأ في LibreTranslate'
    };
  }
};

// دالة ترجمة ذكية محسنة تحاول عدة خدمات مع سياق أفضل للمتغيرات
export const smartTranslate = async (
  text: string, 
  isVariable: boolean = false
): Promise<TranslationResult> => {
  // تنظيف النص أولاً
  const cleanText = text.trim();
  
  // إضافة سياق أفضل للمتغيرات
  let contextualText = cleanText;
  if (isVariable) {
    contextualText = `programming variable: ${cleanText}`;
  }
  
  // تجربة MyMemory مع السياق المحسن
  let result = await translateText(contextualText);
  
  if (result.success && result.translatedText) {
    let translatedText = result.translatedText;
    
    // تنظيف وتحسين الترجمة للمتغيرات
    if (isVariable) {
      // إزالة السياق المضاف
      translatedText = translatedText.replace(/^(programming variable|variable):\s*/i, '');
      translatedText = translatedText.replace(/^(the|a|an|to|for|of|in|on|at|by)\s+/gi, '');
      translatedText = translatedText.replace(/\s+(the|a|an|to|for|of|in|on|at|by)$/gi, '');
      
      // تنظيف عام للترجمة
      translatedText = translatedText
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // إزالة علامات الترقيم
        .replace(/\s+/g, '_') // استبدال المسافات بشرطة سفلية
        .replace(/^_+|_+$/g, '') // إزالة الشرطات السفلية من البداية والنهاية
        .replace(/_+/g, '_'); // تقليل الشرطات المتعددة إلى شرطة واحدة

      // التأكد من أن النتيجة صالحة كمعرف JavaScript
      if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(translatedText)) {
        // إصلاح المعرف ليكون صالح
        translatedText = translatedText.replace(/^[^a-zA-Z_$]/, 'var_');
        translatedText = translatedText.replace(/[^a-zA-Z0-9_$]/g, '_');
        
        // إذا كان لا يزال غير صالح، استخدم معرف عام
        if (!translatedText || !/^[a-zA-Z_$]/.test(translatedText)) {
          translatedText = `arabicVar_${Math.random().toString(36).substr(2, 5)}`;
        }
      }
    }
    
    return {
      translatedText: translatedText || result.translatedText,
      success: true
    };
  }
  
  // في حالة الفشل، تجربة LibreTranslate
  result = await translateWithLibreTranslate(isVariable ? contextualText : text);
  
  if (result.success && isVariable && result.translatedText) {
    // تطبيق نفس التنظيف لـ LibreTranslate
    let translatedText = result.translatedText
      .replace(/^(programming variable|variable):\s*/i, '')
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_')
      .replace(/^_+|_+$/g, '')
      .replace(/_+/g, '_');
      
    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(translatedText)) {
      translatedText = translatedText.replace(/^[^a-zA-Z_$]/, 'var_');
      translatedText = translatedText.replace(/[^a-zA-Z0-9_$]/g, '_');
      
      if (!translatedText || !/^[a-zA-Z_$]/.test(translatedText)) {
        translatedText = `arabicVar_${Math.random().toString(36).substr(2, 5)}`;
      }
    }
    
    return {
      translatedText,
      success: true
    };
  }
  
  return result;
};