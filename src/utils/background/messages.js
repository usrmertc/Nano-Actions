/**
 * Stores file-related information (e.g., ID)
 * acording to fileType into chrome.storage for later use.
 * @param {string} text - For quickly trigger notification if desired.
 * @param {string} fileId - Id of the file
 * @param {string} fileTitle - Title of the file
 * @param {string} fileType - Type of the file (Document)
 */
export function storeInformation(fileType, fileId, fileTitle, text = null) {
  sendMessageToTab("storeInformation", { fileType, fileId, fileTitle, text });
}

/**
 * Sends a request to create a new file with the provided text, type, and language.
 * @param {string} text - The content of the file to create.
 * @param {string} textType - The type of processing to apply (e.g., "Translate", "Summarize").
 * @param {string} type - The type of the file (e.g., "Document").
 * @param {string} language - The language in which the file is being created.
 */
export function createGoogleFile(text, textType, type, language) {
  sendMessageToTab("createFile", { text, textType, type, language });
}

/**
 * Sends a request to add a file by processing the provided text.
 * @param {string} text - The text content to be added to the file.
 * @param {string} textType - The type of processing to apply (e.g., "Translate", "Summarize").
 * @param {string} type - The type of the file (e.g., "Document").
 * @param {string} id - The ID of existing file.
 * @param {string} language - The language for translation or processing, if applicable.
 */
export function addGoogleFile(text, textType, type, id, language){
  sendMessageToTab("addFile", { text, textType, type, id, language });
}

/**
 * Triggers notification with desired text.
 * @param {string} text - Message of the notification.
 * @param {string} type - Type of the notification. {e.g., "Danger"}
 */
export function triggerNotification(text, type = null){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action : "triggerNotification", text: text, type: type }
    );
  });
}



/**
 * Common function to query the active tab and send a message.
 * @param {string} action - The action to send.
 * @param {object} data - The data to send with the message.
 */
function sendMessageToTab(action, data) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: action, ...data }
        );
  });
}