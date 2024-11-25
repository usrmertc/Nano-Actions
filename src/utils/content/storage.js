/**
 * Stores file-related information into chrome.storage based on the fileType.
 * @param {string} fileId - The unique identifier of the file.
 * @param {string} fileTitle - Title of created file
 * @param {string} fileType - The type of the file (e.g., "Document" or "Slide").
 */
function storeFileInformation(fileId, fileTitle, fileType) {
  let storageKey = "", fileData = "";  
  if ( fileType === "Document") {
    storageKey = "googleDocsInfo";
    fileData = { documentId: fileId, documentTitle: fileTitle };
  }

  chrome.storage.sync.set({ [storageKey]: fileData }, (result) => {
  });
}

/**
 * Retrieves file-related information (documentId)
 * from chrome.storage. If data is missing, it returns an empty string.
 * @returns {Object} - Resolves with the stored file information or rejects with an error.
 */
async function getFileInformation() {
  let documentId, documentTitle;

  const googleDocsInfo = await new Promise((resolve) => {
    chrome.storage.sync.get(["googleDocsInfo"], (result) => {
      resolve(result.googleDocsInfo || {});
    });
  });


  if (googleDocsInfo) {
    documentId = googleDocsInfo.documentId || "";
    documentTitle = googleDocsInfo.documentTitle || "";
  }

  return {
    documentId,
    documentTitle
  };
}
