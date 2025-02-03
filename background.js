import { OpenAI } from './openai/lib/index.js';

function createContextMenu() {
  chrome.contextMenus.create({
    id: "analyzeText",
    title: "Analyze with OpenAI",
    contexts: ["selection"]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error creating context menu:', chrome.runtime.lastError);
    }
  });
}

chrome.runtime.onInstalled.addListener(createContextMenu);

createContextMenu();

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "analyzeText") {
    console.log("Analyzing Text");
    const { apiKey } = await chrome.storage.sync.get('apiKey');
    if (!apiKey) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'showError',
        message: 'Please set your OpenAI API key in the extension popup'
      });
      return;
    }
    try {
      const openai = new OpenAI({
        apiKey: apiKey,
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user", 
            content: info.selectionText,
          },
        ],
      });

      const answer = completion.choices[0].message;

      console.log(answer);

      // Check if tab exists before sending message
      const tabs = await chrome.tabs.query({active: true, currentWindow: true});
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'showAnswer',
          answer: answer
        });
      } else {
        console.error('No active tab found');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error appropriately
    }
  }
});
  