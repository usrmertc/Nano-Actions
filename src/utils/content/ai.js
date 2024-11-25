/**
 * Detects the language of the given text.
 * @param {string} text - Text whose language needs to be detected.
 * @param {translation.detector} detector - Detector instance.
 * @returns {string} - Detected language.
 */
async function detectLanguage(text, detector) {
  try {
    const results = await detector.detect(text);
    const result = isLanguageSupported(results[0].detectedLanguage);
    return result;
  } catch (error) {
    console.error("Error detecting language:", error.message);
    throw error;
  }
}

/**
 * Translates the given text to English.
 * @param {string} text - Text to be translated.
 * @param {string} sourceLanguage - Language of the input text.
 * @returns {string} - Translated text.
 */
async function translate(text, sourceLanguage) {
  try {
    const translator = await translation.createTranslator({
      sourceLanguage,
      targetLanguage: "en",
    });

    const translatedText = await translator.translate(text);
    return translatedText;
  } catch (error) {
    console.error("Error translating text:", error.message);
    updateNotificationWithAlert("The text can not be translated by the current AI model.");
    throw error;
  }
}

/**
 * Summarizes the given text.
 * @param {string} text - Text to be summarized.
 * @returns {string} - Summarized text.
 */
async function summarize(text) {
  try {
    const summarizer = await ai.summarizer.create( { type: "tl;dr", length: "medium" } );
    const summary = await summarizer.summarize(text);
    summarizer.destroy();
    return summary;
  } catch (error) {
    console.error("Error summarizing text:", error.message);
    updateNotificationWithAlert("The text has been translated or in language of english, but the AI model was unable to summarize it.");
    throw error;
  }
}

/**
 * Generates a title for the provided text using an AI language model.
 * The function ensures that the returned title contains only three words.
 * @param {string} text - The input text for which a title needs to be generated.
 * @returns {string} - A three-word title, or "New File" in case of an error.
 */
async function createTitle(text) {
  try { 
    const prompter = await ai.languageModel.create();
    const title = await prompter.prompt(`Generate a title from the "${text}". The title must contain between 2 and 3 words and just return with one title without description.
`);
    prompter.destroy();
    const check = title.split(" ");
    if (check.length > 3)
      return `${check[0]} ${check[1]} ${check[2]}`;
    else
     return title;
  } catch (error) { 
    console.error("Error creating title:", error.message);
    return "New File";
  }
}


/**
 * Processes text based on the specified type and language.
 * @param {string} text - Text to process.
 * @param {string} [type=null] - Type of processing: "Translate", "Summarize", "TranslateSummarize", or null.
 * @param {string} [language=null] - Language to be used for translation, if applicable.
 * @returns {string} - Returns the processed text.
 */
async function processText(text, type = null, language = null) {
  switch (type) {
    case "Translate":
      return await translate(text, language);
    case "Summarize":
      return await summarize(text);
    case "TranslateSummarize":
      const translatedText = await translate(text, language);
      return await summarize(translatedText);
    case null:
      return text;
    default:
      throw new Error(`Unsupported processing type: ${type}`);
  }
}
