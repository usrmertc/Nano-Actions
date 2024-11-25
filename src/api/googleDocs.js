import { getAuthToken } from "./auth.js";
import {
  storeInformation,
  triggerNotification
} from "../utils/background/messages.js";

/**
 * Creates a Google Document and inserts the selected text.
 * @param {string} text - Text to be added to the document.
 * @param {string} [type] - Optional operation type: "Translate", "Summarize", "TranslateSummarize".
 * @param {string} [language] - Optional language code.
 * @return {string} - Returns the document's ID.
 */
export async function createGoogleDocumentService(text, title) {
  try {
    if (!text) throw new Error("Text is required to create a document.");
    if (!title) throw new Error("Title is required to create a document.");

    const documentId = await createDocument(title);

    await updateDocumentContent(documentId, text);
    await storeInformation(
      "Document",
      documentId, 
      title,
       `Google Document created with this title { ${title} }.`);
  } catch (error) {
    console.error("Error creating Google Document:", error.message);
    triggerNotification("Can't create Google Document.", "Danger");
  }
}

/**
 * Adds content to an existing Google Document.
 * @param {string} text - Text to be added to the document.
 * @param {string} documentId - ID of the Google Document to update.
 * @param {string} [type] - Optional operation type: "Translate", "Summarize", "TranslateSummarize".
 */
export async function addGoogleDocumentService(text, documentId) {
  try {
    if (!text) throw new Error("Text is required to add to the document.");
    if (!documentId) throw new Error("Document ID is required.");

    await updateDocumentContent(documentId, text);

    triggerNotification("Google Document updated.")
  } catch (error) {
    console.error("Error adding content to Google Document:", error.message);
    triggerNotification("Can't update Google Document.", "Danger")
  }
}

/**
 * Creates a new Google Document.
 * @returns {Promise<string>} - Returns the document ID.
 */
async function createDocument(title) {
  try {
    const authToken = await getAuthToken();
    const response = await fetch("https://docs.googleapis.com/v1/documents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create Google Document: ${errorText}`);
    }

    const data = await response.json();
    return data.documentId;
  } catch (error) {
    console.error("Error creating Google Document:", error.message);
    throw error;
  }
}

/**
 * Updates an existing Google Document with new content.
 * @param {string} documentId - ID of the document to update.
 * @param {string} text - Content to add to the document.
 * @returns {Promise<void>} - Resolves when the content is added.
 */
async function updateDocumentContent(documentId, text) {
  try {
    const authToken = await getAuthToken();
    const response = await fetch(
      `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                text: `\n\n${text}`,
                endOfSegmentLocation: {},
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update document content: ${errorText}`);
    }
  } catch (error) {
    console.error("Error updating Google Document:", error.message);
    throw error;
  }
}
