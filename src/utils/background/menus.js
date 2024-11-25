/**
 * Creates a Chrome context menu item with optional parent association.
 * @param {string} id - The unique identifier for the context menu item.
 * @param {string} title - The label displayed for the menu item.
 * @param {string|null} [parentId=null] - The ID of the parent menu item (if nested).
 */
function createMenu(id, title, parentId = null){
  if(parentId)
    chrome.contextMenus.create({
      id: id,
      parentId: parentId,
      title: title,
      contexts: ["selection"]
    });
  else
    chrome.contextMenus.create({
      id: id,
      title: title,
      contexts: ["selection"]
    });
}

export function addBaseMenu(id, title){
    createMenu(id, title);
}

/**
 * Expands a base context menu with specific variants supported by the client AI model.
 * Variants include creating or adding selections to a document or presentation, 
 * with options for summarization, translation, or both.
 * @param {string} parentId - The ID of the parent menu to expand.
 * @param {string} fileTitle - The title of the file.
 * @param {string} title - The type of content (e.g., "Document", "Presentation").
 * @param {string} language - The language state of the selection:
 *  - `false` or `undefined`: No valid language detected.
 *  - else language code of supported language
 */
export function expandBaseMenu(parentId, title, fileTitle, language){
  createMenu(`${parentId}-Create`, `Create New ${title} with Selection`, parentId);

  if(language === "en")
    createMenu(`${parentId}-Create-Summarize`, `Create New ${title} with Summarized Selection`, parentId);

  if(language && language !== "en"){
    createMenu(`${parentId}-Create-Translate`, `Create New ${title} with Translated Selection`, parentId);
    createMenu(`${parentId}-Create-TranslateSummarize`, `Create New ${title} with Translated then Summarized Selection`, parentId);
  }

  if(fileTitle && fileTitle !== ""){
    createMenu(`${parentId}-Add`, `Add Selection to ${fileTitle}`, parentId);
    
    if(language === "en")
        createMenu(`${parentId}-Add-Summarize`, `Summarize and Add Selection to ${fileTitle}`, parentId);

    if(language && language !== "en"){
        createMenu(`${parentId}-Add-Translate`, `Translate and Add Selection to ${fileTitle}`, parentId);
        createMenu(`${parentId}-Add-TranslateSummarize`, `Translate then Summarize and Add Selection to ${fileTitle}`, parentId);
    }
  }
}

