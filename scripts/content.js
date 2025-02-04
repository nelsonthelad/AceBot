function scanForQuestions() {
  const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, div, span");
  const questions = [];

  elements.forEach(element => {
    const text = element.textContent.trim();
    
    if (text.endsWith('?') || 
        text.toLowerCase().startsWith('what') ||
        text.toLowerCase().startsWith('how') ||
        text.toLowerCase().startsWith('why') ||
        text.toLowerCase().startsWith('when') ||
        text.toLowerCase().startsWith('where') ||
        text.toLowerCase().startsWith('consider') ||
        text.toLowerCase().startsWith('which')) {
      questions.push(text);
    }
  });

  return questions;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scanQuestions") {
    try {
      const questions = scanForQuestions();
      sendResponse({ questions: questions });
    } catch (error) {
      console.error('Scanning error:', error);
      sendResponse({ error: error.message });
    }
    return true;
  }
});
