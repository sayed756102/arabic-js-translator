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

// دالة ترجمة ذكية تحاول عدة خدمات
export const smartTranslate = async (text: string): Promise<TranslationResult> => {
  // تجربة MyMemory أولاً
  let result = await translateText(text);
  
  if (result.success) {
    return result;
  }
  
  // في حالة الفشل، تجربة LibreTranslate
  result = await translateWithLibreTranslate(text);
  
  return result;
};