chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "solveSelectedQuestions") {
    
    handleQuestions(request.questions)
      .then(result => {
        sendResponse({ success: true });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    
    return true;
  }
});

async function handleQuestions(questions) {
  const { apiKey } = await chrome.storage.local.get('apiKey');
  
  if (!apiKey) {
    throw new Error('API key not found');
  }

  const answers = [];
  
  for (const question of questions) {
    try {
      const messages = [
        { role: "system", content: "Answer the following question concisely and accurately." },
        { role: "user", content: question }
      ];
      
      const completion = await fetchAIResponse(messages, apiKey);
      
      answers.push({
        question,
        answer: completion.choices[0].message.content
      });
    } catch (error) {
      console.error('Error processing question:', error);
      answers.push({
        question,
        answer: `Error: ${error.message}`
      });
    }
  }
  
  await chrome.storage.local.set({ aiAnswers: answers });
  return answers;
}

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
        throw new Error("Invalid API key. Please check your API key and try again.");
      } else {
        throw new Error(`API request failed. Status code: ${response.status}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}