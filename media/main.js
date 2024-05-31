(function() {
  if (typeof acquireVsCodeApi !== 'undefined') {
    const vscode = acquireVsCodeApi();

    const chatInput = document.getElementById('chat-input');
    const chatArea = document.getElementById('chat-area');
    const sendButton = document.getElementById('send-button');

    sendButton.addEventListener('click', sendMessage);

    chatInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        sendMessage();
      }
    });

    function sendMessage() {
      const userMessage = chatInput.value.trim();
      if (userMessage) {
        displayMessage('user', userMessage);
        chatInput.value = '';
        vscode.postMessage({ command: 'getResponse', text: userMessage });
      }
    }

    function displayMessage(sender, message) {
      const messageElement = document.createElement('div');
      messageElement.textContent = `${sender}: ${message}`;
      chatArea.appendChild(messageElement);
      chatArea.scrollTop = chatArea.scrollHeight;
    }

    window.addEventListener('message', event => {
      const message = event.data;
      switch (message.command) {
        case 'displayResponse':
          displayMessage('ai', message.text);
          break;
      }
    });
  }
})();