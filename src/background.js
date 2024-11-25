import { addBaseMenu, expandBaseMenu } from "./utils/background/menus.js";
import { createGoogleFile, addGoogleFile} from "./utils/background/messages.js";
import { createGoogleDocumentService, addGoogleDocumentService } from "./api/googleDocs.js";

var documentId, documentTitle, language;

chrome.contextMenus.onClicked.addListener((info) => {
  const selectedText = info.selectionText || "";
  handleMenuAction(info.menuItemId, selectedText);
});


/**
 * Handles context menu actions based on the menu item ID.
 * @param {string} menuItemId - The ID of the clicked context menu item.
 * @param {string} selectedText - The selected text in the browser context.
 */
async function handleMenuAction(menuItemId, selectedText) {
  try {
    // Loading Animation
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action : "triggerLoading"}
      );
    });
    const [type, action, mode] = menuItemId.split("-");
    switch (type) {
      case "Docs":
        if(action === "Create") {
          const createFunc = createGoogleFile;
          await createFunc(selectedText, mode, type, language);
        } else if (action === "Add" && documentId){
          const addFunc = addGoogleFile;
          await addFunc(selectedText, mode, type, documentId, language);
        }
        break;
    }
  } catch (err) {
    console.error(`Error handling menu action (${menuItemId}):`, err);
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  try {
    if (message.action === "updateMenu"){
      chrome.contextMenus.removeAll();
      language = message.language;

      if(language === "outOfLength"){
        addBaseMenu("outOfLength", "Currently, Only Up To 4000 Characters Supported")
        return;
      }

      
      documentId = message.documentId;
      documentTitle = message.documentTitle;
        
      // Creating Base Menus
      addBaseMenu("Docs", "Google Docs");
      
      // Expanding Base Menus
      expandBaseMenu("Docs", "Document", documentTitle, language);

      return true;
    } else if (message.action == "createNewFile") {
      if (message.type === "Docs") 
        await createGoogleDocumentService(message.text, message.title);
      else 
        await createGooglePresentationService(message.text, message.title);
      return true;
    } else if (message.action == "addCreatedFile") {
      if (message.type === "Docs")
        await addGoogleDocumentService(message.text, documentId);
      else 
        await addGooglePresentationService(message.text, presentationId);
      return true;
    }

    return true;
  } catch (error) {
    console.error("Can't update menu:", error);
    return false;
  }
});