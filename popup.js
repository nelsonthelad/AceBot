document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['apiKey'], (result) => {
    const apiKeySection = document.getElementById('apiKeySection');
    const loggedInSection = document.getElementById('loggedInSection');
    
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
  const apiKey = document.getElementById('apiKey').value;
  chrome.storage.sync.set({ apiKey }, () => {
    const apiKeySection = document.getElementById('apiKeySection');
    const loggedInSection = document.getElementById('loggedInSection');
    apiKeySection.style.display = 'none';
    loggedInSection.style.display = 'block';
  });
});

document.getElementById('removeKey').addEventListener('click', () => {
  chrome.storage.sync.remove(['apiKey'], () => {
    const apiKeySection = document.getElementById('apiKeySection');
    const loggedInSection = document.getElementById('loggedInSection');
    apiKeySection.style.display = 'block';
    loggedInSection.style.display = 'none';
  });
});