chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "analyzeText",
      title: "Analyze with OpenAI",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "analyzeText") {
      const { apiKey } = await chrome.storage.sync.get('apiKey');
      if (!apiKey) {
        alert('Please set your OpenAI API key first!');
        return;
      }
  
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
              role: "user",
              content: info.selectionText
            }],
            max_tokens: 150
          })
        });
  
        const data = await response.json();
        const answer = data.choices[0].message.content;
        
        // Show answer in an alert (you could modify this to show in a more elegant way)
        alert(answer);
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  });
  