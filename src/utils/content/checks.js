/**
 * Checks if language is currently supported by the AI model or not.
 * @param {string} language 
 * @return {boolean | string} - Returns the language if supported, or false if not.
 */
function isLanguageSupported(language) {
  const supportedLanguages = [
      "es", "ja", "ar", "bn", "de", "fr", "hi", "it", "ko", "nl", "pl", "pt",
      "ru", "th", "tr", "vi", "zh", "zh-Hant", "bg", "cs", "da", "el", "fi", "hr",
      "hu", "id", "iw", "lt", "no", "ro", "sk", "sl", "sv", "uk", "en"
  ];

  return supportedLanguages.includes(language) ? language : false;
}