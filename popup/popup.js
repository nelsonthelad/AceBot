document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['apiKey'], (result) => {
    const apiKeySection = document.getElementById('apiKeySection');
    const loggedInSection = document.getElementById('loggedInSection');
    
    if (!apiKeySection || !loggedInSection) {
      console.error('Required elements not found. Make sure apiKeySection and loggedInSection exist in popup.html');
      return;
    }
    
    if (result.apiKey) {
      apiKeySection.style.display = 'none';
      loggedInSection.style.display = 'block';
    } else {
      apiKeySection.style.display = 'block';
      loggedInSection.style.display = 'none';
    }
  });
});

document.getElementById('save').addEventListener('click', () => {
  const apiKey = document.getElementById('apiKey');
  const apiKeySection = document.getElementById('apiKeySection');
  const loggedInSection = document.getElementById('loggedInSection');
  
  if (!apiKey || !apiKeySection || !loggedInSection) {
    console.error('Required elements not found. Make sure apiKey, apiKeySection, and loggedInSection exist in popup.html');
    return;
  }
  
  chrome.storage.local.set({ apiKey: apiKey.value }, () => {
    apiKeySection.style.display = 'none';
    loggedInSection.style.display = 'block';
  });
});

document.getElementById('removeKey').addEventListener('click', () => {
  const apiKeySection = document.getElementById('apiKeySection');
  const loggedInSection = document.getElementById('loggedInSection');
  
  if (!apiKeySection || !loggedInSection) {
    console.error('Required elements not found. Make sure apiKeySection and loggedInSection exist in popup.html');
    return;
  }
  
  chrome.storage.local.remove(['apiKey'], () => {
    apiKeySection.style.display = 'block';
    loggedInSection.style.display = 'none';
  });
});