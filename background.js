function createContextMenu() {
  chrome.contextMenus.create({
    id: "analyzeText",
    title: "Analyze with OpenAI",
    contexts: ["selection"]
  });
}
chrome.runtime.onInstalled.addListener(createContextMenu);

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "analyzeText") {
    const { apiKey } = await chrome.storage.local.get('apiKey');
    if (!apiKey) {
      console.log("No API Key")
      return;
    }
    
    try {
      const messages = [
        { role: "system", content: "You are a helpful assistant who is helping students answer quiz questions. Your replies should be short but they should convey the answer clearly" },
        { role: "user", content: info.selectionText },
      ];
      
      const completion = await fetchAIResponse(messages, apiKey);
      const answer = completion.choices[0].message.content
      console.log(answer);

      chrome.storage.local.set({ aiResponse: answer }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error storing answer:", chrome.runtime.lastError);
        } else {
          console.log("Storing Answer");
        }
      });

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { answer: answer });
      });

    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
});

async function fetchAIResponse(messages, apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        "messages": messages,
        "model": "gpt-4o-mini",
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Looks like your API key is incorrect. Please check your API key and try again.");
      } else {
        throw new Error(`Failed to fetch. Status code: ${response.status}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}