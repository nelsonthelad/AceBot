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

document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.local.get(["aiResponse"], function(result) {
      const loggedInSection = document.getElementById('loggedInSection');
      const aiResponseSection = document.getElementById('aiResponse');

      if (result.aiResponse) {
          console.log("Displaying Answer");
          loggedInSection.style.display = 'none';
          aiResponseSection.style.display = 'block';
          document.getElementById("response").innerText = result.aiResponse;
      } else {
          aiResponseSection.style.display = 'none';
      }
  });
});

document.getElementById('clearKey').addEventListener('click', () => {
  chrome.storage.local.remove(['aiResponse'], () => {
    aiResponse.style.display = 'none';
    loggedInSection.style.display = 'block';
  });
});