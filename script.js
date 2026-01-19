console.log("script.js loaded");

let session_id = crypto.randomUUID();
let sessionDone = false;

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("input");
    const sendBtn = document.getElementById("sendBtn");

    sendBtn.addEventListener("click", send);

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            send();
        }
    });
});

function addMessage(text, sender, typing=false) {
    const chatBox = document.getElementById("chat-box");
    const msg = document.createElement("div");
    msg.className = sender;
    msg.innerText = text;

    if (typing && sender === "bot") msg.classList.add("typing");

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg;
}

async function send() {
    const input = document.getElementById("input");
    const msg = input.value.trim();
    if (!msg) return;

    // Full refresh if previous session ended
    if (sessionDone) {
        location.reload();
        return;
    }

    addMessage("You: " + msg, "user");
    input.value = "";

    // Typing animation
    const typingMsg = addMessage("Agent is typing", "bot", true);

    try {
        const BACKEND_URL = "https://student-dropout-backend-upql.onrender.com";

        const res = await fetch(
            `${BACKEND_URL}/chat?session_id=${session_id}&msg=${msg}`
        );


        typingMsg.remove();

        if (data.question) {
            addMessage("Agent: " + data.question, "bot");
        } else {
            addMessage(
                "Agent: " + data.prediction + " | " + data.dropout_probability,
                "bot"
            );
            sessionDone = true;
            addMessage(
              "Session ended. Type anything to start a new chat.",
              "bot"
            );
        }
    } catch (error) {
        console.error(error);
        typingMsg.remove();
        addMessage("Agent temporarily unavailable. Please try again.", "bot");
    }
}
