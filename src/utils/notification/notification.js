/**
 * Initiliazes the notification.
 */
function initiliazeNotification() {
  const notification = document.createElement('div');
  notification.classList.add('nano-actions-notification');
  
  document.body.appendChild(notification);
}


/**
 * Removes notification.
 */
function destroyNotification(){
  const notification = document.querySelector(".nano-actions-notification");
  notification.remove();
}

/**
 * Adds loading bar to notification
 */
function loadingBar(){
  const notification = document.querySelector(".nano-actions-notification");

  const loadingBar = document.createElement('div');
  loadingBar.classList.add('nano-actions-loading-bar');
  
  const loadingBarInner = document.createElement('div');
  loadingBarInner.classList.add('nano-actions-loading-bar-inner');
  loadingBar.appendChild(loadingBarInner);

  notification.appendChild(loadingBar);
}

/**
 * Removes all elements inside of notifcation.
 */
function clearInsideOfNotifcation() {
  const loadingBar = document.querySelector(".nano-actions-loading-bar");
  if (loadingBar) 
    loadingBar.remove();

  const message = document.querySelector(".nano-actions-message");
  if (message)
    message.remove();

  const textareaWrapper =  document.querySelector(".nano-actions-textarea-wrapper");
  if (textareaWrapper) 
    textareaWrapper.remove();

  const buttonContainer = document.querySelector(".nano-actions-buttons");
  if (buttonContainer)
    buttonContainer.remove();
}

/**
 * Adds elements to notification with prompt include.
 * @param {string} messageText - Message for the user 
 * @param {string} text - Prompt
 */
function updateNotificationWithPrompt(messageText, text, type, fileType, id = null, title = null) {
  clearInsideOfNotifcation();
  const notification = document.querySelector(".nano-actions-notification");

  const message = document.createElement("div");
  message.className = "nano-actions-message";
  message.textContent = messageText;

  const textareaWrapper = document.createElement("div");
  textareaWrapper.classList.add("nano-actions-textarea-wrapper");

  const textarea = document.createElement("textarea");
  textarea.classList.add("nano-actions-textarea");
  textarea.textContent = text;
  textarea.readOnly = true;

  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("nano-actions-buttons");

  const cancelButton = document.createElement("button");
  cancelButton.classList.add("nano-actions-button", "nano-actions-cancel-button");
  cancelButton.textContent = "Cancel";

  cancelButton.onclick = function() { updateNotificationWithAlert("Canceled") };

  const addButton = document.createElement("div");
  addButton.classList.add("nano-actions-button", "nano-actions-add-button");
  addButton.textContent = "Add";

  addButton.onclick = function() { 
    loadingBar();
    if(type == "addFile")
      chrome.runtime.sendMessage({ action: "addCreatedFile", text: text, id: id, type: fileType });
    else
      chrome.runtime.sendMessage({ action: "createNewFile", text: text, title: title, type: fileType });
  }

  notification.appendChild(message);

  textareaWrapper.appendChild(textarea);
  notification.append(textareaWrapper);

  buttonWrapper.appendChild(cancelButton);
  buttonWrapper.appendChild(addButton);
  notification.appendChild(buttonWrapper);
}

/**
 * Adds message element for notification.
 * @param {string} messageText - Message for the user
 */
function updateNotification(messageText) {
  clearInsideOfNotifcation();
  const notification = document.querySelector(".nano-actions-notification");


  const message = document.createElement("div");
  message.className = "nano-actions-message";
  message.textContent = messageText;

  notification.appendChild(message);


  setTimeout(() => {
    notification.remove();
  }, 2000);
}

/**
 * Adds message element for notification but changes text and background color.
 * @param {string} messageText 
 */
function updateNotificationWithAlert(messageText) {
  clearInsideOfNotifcation();
  const notification = document.querySelector(".nano-actions-notification");



  const message = document.createElement("div");
  message.className = "nano-actions-message";
  message.textContent = messageText;
  notification.style.backgroundColor = "#D32F2F";
  message.style.color = "#ffffff";
  notification.appendChild(message);
  setTimeout(() => {
    notification.remove();
  }, 2000);
}