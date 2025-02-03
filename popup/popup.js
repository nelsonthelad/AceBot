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

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentSite = document.getElementById('currentSite');
      if (tabs[0]) {
        const url = new URL(tabs[0].url);
        currentSite.innerText = `Current Site: ${url.hostname}`;
      }
    });
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
    aiResponse.style.display = 'none';
  });
});

document.getElementById("solveKey").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["/scripts/content.js"]
    });
  });
});

document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.local.get(["aiResponse"], function(result) {
      const aiResponseSection = document.getElementById('aiResponse');

      if (result.aiResponse) {
          console.log("Displaying Answer");
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

document.getElementById('info').addEventListener('click', () => {
  showContent('infoContent');
});

document.getElementById('scan').addEventListener('click', () => {
  showContent('scanContent');
});

document.getElementById('api').addEventListener('click', () => {
  showContent('apiContent');
});

function showContent(contentId) {
  const contents = document.querySelectorAll('.loggedInStatus, #infoContent, #apiContent, #scanContent');
  contents.forEach(content => {
    content.style.display = 'none'; // Hide all content divs
  });
  
  // Show the selected content
  const selectedContent = document.getElementById(contentId);
  if (selectedContent) {
    selectedContent.style.display = 'flex'; // Ensure the selected content is displayed
  }
}

