import axios from 'axios';

const libreTranslateUrl = 'https://libretranslate.com/translate';

export const translateWithLibre = async (text: string, source: string, target: string) => {
  try {
    const response = await axios.post(libreTranslateUrl, {
      q: text,
      source: source,
      target: target,
    });
    return response.data.translatedText;
  } catch (error) {
    console.error('Error translating with LibreTranslate:', error);
    return null;
  }
};
