chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'showAnswer') {
      console.log('Received answer:', message.answer);
    } else if (message.type === 'showError') {
      console.error('Received error:', message.error);
    }
  });