// Replace 'YOUR_OPENAI_API_KEY' with your actual API key from OpenAI
const openAiApiKey = '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';

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function appendMessage(message, isUser) {
    const msgContainer = document.createElement('div');
    msgContainer.classList.add(isUser ? 'msgCon1' : 'msgCon2');

    const msgContent = document.createElement('div');
    msgContent.classList.add(isUser ? 'right' : 'left');
    msgContent.textContent = message;

    const timestamp = document.createElement('div');
    timestamp.classList.add('timestamp');
    timestamp.textContent = getCurrentTime();

    msgContainer.appendChild(msgContent);
    msgContainer.appendChild(timestamp);

    document.getElementById('msg').appendChild(msgContainer);

    scrollChat();
}

function init() {
    const welcomeMessage = "Hello, I'm ChatBot! How can I assist you?";
    appendMessage(welcomeMessage, false);
}

function scrollChat() {
    const chatContainer = document.getElementById('msg');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function processUserMessage(userMessage) {
    appendMessage(userMessage, true);

    const openAiApiEndpoint = 'https://api.openai.com/v1/engines/text-davinci-003/completions';
    try {
        const response = await axios.post(
            openAiApiEndpoint,
            {
                prompt: userMessage,
                max_tokens: 100,
                n: 1,
                stop: '\n'
            },
            {
                headers: {
                    'Authorization': `Bearer ${openAiApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(response);
        const botResponse = response.data.choices[0].text;
        appendMessage(botResponse, false);
    } catch (error) {
        console.error("Error fetching bot response:", error);
        appendMessage("Sorry, there was an error processing your request.", false);
    }
}

document.getElementById('reply').addEventListener("click", () => {
    const inputElement = document.getElementById('msg_send');
    const userMessage = inputElement.value.trim();
    inputElement.value = "";

    processUserMessage(userMessage);
});

document.getElementById('msg_send').addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const inputElement = document.getElementById('msg_send');
        const userMessage = inputElement.value.trim();
        inputElement.value = "";

        processUserMessage(userMessage);
    }
});