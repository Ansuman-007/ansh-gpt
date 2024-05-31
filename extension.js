const vscode = require('vscode');
const path = require('path');

function activate(context) {
  const provider = new AnshGptViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('anshGptView', provider)
  );
}

class AnshGptViewProvider {
  constructor(_extensionUri) {
    this._extensionUri = _extensionUri;
  }

  resolveWebviewView(webviewView, context) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(message => {
      if (message.command === 'getResponse') {
        const response = this.mockAIResponse(message.text);
        webviewView.webview.postMessage({ command: 'displayResponse', text: response });
      }
    }, undefined, context.subscriptions);
  }

  _getHtmlForWebview(webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.file(
      path.join(this._extensionUri.fsPath, 'media', 'main.js')
    ));

    const styleUri = webview.asWebviewUri(vscode.Uri.file(
      path.join(this._extensionUri.fsPath, 'media', 'styles.css')
    ));

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AnshGPT Chat</title>
      <link rel="stylesheet" href="${styleUri}">
    </head>
    <body>
      <div id="chat-container">
        <div id="chat-area"></div>
        <div id="input-container">
          <input type="text" id="chat-input" placeholder="Type your message...">
          <button id="send-button">Send</button>
        </div>
      </div>
      <script src="${scriptUri}"></script>
    </body>
    </html>`;
  }

  mockAIResponse(message) {
    const mockResponses = {
      'What is the capital of France?': 'The capital of France is Paris.',
      'How many planets are in our solar system?': 'There are 8 planets in our solar system.',
      'What is the largest ocean on Earth?': 'The largest ocean on Earth is the Pacific Ocean.',
      'Who wrote the play "Hamlet"?': 'The play "Hamlet" was written by William Shakespeare.',
      'What is the square root of 144': 'The square root of 144 is 12.',
      'What makes the Antikythera mechanism an extraordinary artifact from ancient Greece?':'The Antikythera mechanism, dating to around 100 BC, is considered the worlds first analog computer. Its complex gear system predicted astronomical positions, eclipses, and tracked the ancient Olympic Games cycle, showcasing advanced engineering and astronomical knowledge far ahead of its time.'
    };

    return mockResponses[message] || `I'm sorry, I don't have a mock response for "${message}".`;
  }
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
}