document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['apiKey'], (result) => {
    const apiKeySection = document.getElementById('apiKeySection');
    const loggedInSection = document.getElementById('loggedInSection');
    
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
  
  chrome.storage.local.set({ apiKey: apiKey.value }, () => {
    apiKeySection.style.display = 'none';
    loggedInSection.style.display = 'block';
  });
});

document.getElementById('removeKey').addEventListener('click', () => {
  const apiKeySection = document.getElementById('apiKeySection');
  const loggedInSection = document.getElementById('loggedInSection');
  
  chrome.storage.local.remove(['apiKey'], () => {
    apiKeySection.style.display = 'block';
    loggedInSection.style.display = 'none';
    aiResponse.style.display = 'none';
  });
});

document.getElementById("solveKey").addEventListener("click", async () => {
  const questionsContainer = document.getElementById('questionsContainer');
  showContent('scanContentAnswers');
  console.log("Starting scan...");

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (!tabs[0]?.id) {
      questionsContainer.innerHTML = '<p style="color: red;">Cannot access this page</p>';
      return;
    }

    try {
      // First, ensure the content script is injected
      await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['scripts/content.js']
      });

      // Scan for questions
      console.log("Scanning for questions...");
      const response = await new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "scanQuestions" }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
      console.log("Scanning Complete...");
      console.log(response); // Log the response


      if (response.questions && response.questions.length > 0) {
        questionsContainer.innerHTML = ''; // Clear previous questions
        
        // Show the questions list container
        document.getElementById('questionsList').style.display = 'block';
        
        // Display each question
        response.questions.forEach(question => {
          const questionDiv = document.createElement('div');
          questionDiv.className = 'question-item';
          questionDiv.innerHTML = `
            <input type="checkbox" class="question-checkbox">
            <p class="question-text">${question}</p>
          `;
          questionsContainer.appendChild(questionDiv);
        });
      } else {
        questionsContainer.innerHTML = '<p>No questions found on this page</p>';
      }
    } catch (error) {
      console.error('Scanning error:', error);
      questionsContainer.innerHTML = `<p style="color: red;">Error scanning page: ${error.message}</p>`;
    }
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
  const contents = document.querySelectorAll('#infoContent, #apiContent, #scanContent, #scanContentAnswers');
  contents.forEach(content => {
    content.style.display = 'none';
  });
  
  const selectedContent = document.getElementById(contentId);
  if (selectedContent) {
    selectedContent.style.display = 'flex'; 
  }
}

// Only showing the modified section of popup.js
document.getElementById('solveQuestions').addEventListener('click', async () => {
  const selectedQuestions = Array.from(document.querySelectorAll('.question-checkbox:checked'))
    .map(checkbox => checkbox.nextElementSibling.textContent);
  
  console.log('Selected questions:', selectedQuestions);

  if (selectedQuestions.length === 0) {
    alert('Please select at least one question to solve');
    return;
  }

  // Show loading state
  showContent('aiAnswersContainer');
  const questionsContainer = document.getElementById('questionsAnswersContainer');
  questionsContainer.innerHTML = '<p style="text-align: center;">Processing questions...</p>';

  try {
    console.log("Sending to background.js...");
    const response = await chrome.runtime.sendMessage({
      action: "solveSelectedQuestions",
      questions: selectedQuestions
    });
    
    console.log('Response from background:', response);
    
    if (!response || !response.success) {
      throw new Error(response?.error || 'Failed to process questions');
    }

    // Get the answers from storage
    const result = await chrome.storage.local.get(['aiAnswers']);
    if (result.aiAnswers) {
      displayAnswers(result.aiAnswers);
    } else {
      throw new Error('No answers found in storage');
    }
  } catch (error) {
    console.error('Error:', error);
    questionsContainer.innerHTML = `<p style="color: red; text-align: center;">Error: ${error.message}</p>`;
  }
});

function displayAnswers(answers) {
  const questionsContainer = document.getElementById('questionsAnswersContainer');
  questionsContainer.innerHTML = '';
  
  answers.forEach(({question, answer}) => {
    const answerDiv = document.createElement('div');
    answerDiv.className = 'question-item';
    answerDiv.innerHTML = `
      <div class="question-text">${question}</div>
      <div class="answer-text">${answer}</div>
    `;
    questionsContainer.appendChild(answerDiv);
  });
};

document.getElementById('clearAnswers').addEventListener('click', () => {
  chrome.storage.local.remove(['aiAnswers'], () => {
    const questionsContainer = document.getElementById('questionsAnswersContainer');
    questionsContainer.innerHTML = '';
    document.getElementById('aiAnswersContainer').style.display = 'none';
    showContent('scanContentAnswers');
  });
});

