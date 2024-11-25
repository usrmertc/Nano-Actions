var detector;

window.onload = async function () {
  detector = await translation.createDetector();
};

document.addEventListener("selectionchange", async () => {
  const selectedText = window.getSelection().toString().trim();

  if (!selectedText) return;

  if (selectedText.length > 4000) {
    chrome.runtime.sendMessage({
      action: "updateMenu",
      language: "outOfLength",
    });
    return;
  }

   try {
    const language = await detectLanguage(selectedText, detector);
    
    const fileInfo = await getFileInformation();

    chrome.runtime.sendMessage({
        action: "updateMenu",
        language: language,
        documentId: fileInfo.documentId,
        documentTitle: fileInfo.documentTitle
    });
  } catch (error) {
    console.error("Error handling selection change:", error.message);
  }
});

chrome.runtime.onMessage.addListener(async function (message) {
  if (message.action === "triggerLoading") {  
    initiliazeNotification();
    loadingBar();
  } else if (message.action === "createFile") {
    try {
      const text = await processText(
        message.text,
        message.textType,
        message.language
      );
      const title = await createTitle(text);
      updateNotificationWithPrompt(
        `Here's your result do you want to create new file with it?`,
        text,
        "createFile",
        message.type,
        null,
        title
      );
    } catch (error) {
      console.error(error);
    }
  } else if (message.action === "storeInformation") {
    storeFileInformation(
      message.fileId, 
      message.fileTitle,
      message.fileType
    );
    updateNotification(message.text);
  } else if (message.action === "addFile") {
    try {
      const text = await processText(
        message.text,
        message.textType,
        message.language
      );
      const result = await updateNotificationWithPrompt(
        `Here's your result do you want to add it?`,
        text,
        "addFile",
        message.type,
        message.id
      );
    } catch (error) {
      console.error(error);
    }
  } else if (message.action === "triggerNotification") {
    if (message.type === "Danger") {
      updateNotificationWithAlert(message.text);
    } else {
      updateNotification(message.text);
    }
  }

  return true;
});