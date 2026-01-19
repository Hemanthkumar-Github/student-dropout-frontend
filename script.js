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

function addMessage(text, sender, typing = false) {
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

    if (sessionDone) {
        location.reload();
        return;
    }

    addMessage("You: " + msg, "user");
    input.value = "";

    const typingMsg = addMessage("Agent is typing...", "bot", true);

    try {
        const res = await fetch(
            "https://student-dropout-backend-upql.onrender.com/chat" +
            `?session_id=${session_id}&msg=${encodeURIComponent(msg)}`
        );

        // ⭐ THIS LINE FIXES THE ERROR
        const data = await res.json();

        typingMsg.remove();

        if (data.question) {
            addMessage("Agent: " + data.question, "bot");
        } else if (data.prediction) {
            addMessage(
                "Agent: " + data.prediction +
                " | Dropout Probability: " + data.dropout_probability,
                "bot"
            );
            sessionDone = true;
            addMessage("Session ended. Type anything for a new chat.", "bot");
        } else {
            addMessage("Agent: Unexpected response.", "bot");
        }

    } catch (error) {
        console.error(error);
        typingMsg.remove();
        addMessage("Agent temporarily unavailable. Please try again.", "bot");
    }
}