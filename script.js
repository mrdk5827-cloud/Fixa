// @ts-nocheck

const commandInput = document.getElementById("command");
const sendButton = document.getElementById("send");
const micButton = document.getElementById("mic");

const response = document.getElementById("response");
const status = document.getElementById("status");
const terminalText = document.getElementById("terminalText");


// =====================================
// TERMINAL MESSAGE
// =====================================

function terminal(message) {
    const p = document.createElement("p");

    p.innerHTML = "<b>></b> " + message;

    terminalText.appendChild(p);

    terminalText.scrollTop =
        terminalText.scrollHeight;
}


// =====================================
// FIXA VOICE
// =====================================

function speak(text) {

    if (!("speechSynthesis" in window)) {
        return;
    }

    speechSynthesis.cancel();

    const voice =
        new SpeechSynthesisUtterance(text);

    voice.lang = "hi-IN";
    voice.rate = 0.95;

    speechSynthesis.speak(voice);
}


// =====================================
// FIXA RESPONSE
// =====================================

function reply(text) {

    response.innerText = text;

    speak(text);

    status.innerText = "READY";

    terminal("TASK COMPLETED");
}


// =====================================
// OPEN PHONE DIALER
// =====================================

function openDialer(number) {

    terminal("OPENING PHONE");

    window.location.href =
        "tel:" + number;
}


// =====================================
// OPEN SMS
// =====================================

function openSMS(number, message) {

    terminal("OPENING SMS");

    const url =
        "sms:" +
        number +
        "?body=" +
        encodeURIComponent(message);

    window.location.href = url;
}


// =====================================
// OPEN WHATSAPP
// =====================================

function openWhatsApp(number, message) {

    terminal("OPENING WHATSAPP");

    const url =
        "https://wa.me/" +
        number +
        "?text=" +
        encodeURIComponent(message);

    window.open(url, "_blank");
}


// =====================================
// COMMAND PROCESSOR
// =====================================

function processCommand(command) {

    command = command.trim();

    if (command === "") {

        reply(
            "पहले कोई command दीजिए।"
        );

        return;
    }


    status.innerText = "PROCESSING";

    terminal("COMMAND RECEIVED");

    terminal(
        command.toUpperCase()
    );


    const lower =
        command.toLowerCase();


    // =================================
    // TIME
    // =================================

    if (
        lower.includes("समय") ||
        lower.includes("टाइम") ||
        lower.includes("time")
    ) {

        const now = new Date();

        const time =
            now.toLocaleTimeString(
                "hi-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        reply(
            "अभी समय " +
            time +
            " है।"
        );

        return;
    }


    // =================================
    // GOOGLE
    // =================================

    if (
        lower.includes("google")
    ) {

        terminal(
            "OPENING GOOGLE"
        );

        reply(
            "हाँ, Google खोल रहा हूँ।"
        );

        setTimeout(function () {

            window.open(
                "https://www.google.com",
                "_blank"
            );

        }, 500);

        return;
    }


    // =================================
    // PHONE NUMBER CALL
    // =================================

    if (
        lower.startsWith("call ")
    ) {

        const number =
            command.substring(5).trim();

        if (number === "") {

            reply(
                "कृपया phone number बताइए।"
            );

            return;
        }

        reply(
            "Phone dialer खोल रहा हूँ।"
        );

        setTimeout(function () {

            openDialer(number);

        }, 500);

        return;
    }


    // =================================
    // SMS
    // =================================

    if (
        lower.startsWith("sms ")
    ) {

        reply(
            "SMS के लिए अभी number और message को अलग-अलग देना होगा।"
        );

        return;
    }


    // =================================
    // WHATSAPP
    // =================================

    if (
        lower.includes("whatsapp")
    ) {

        reply(
            "WhatsApp action के लिए contact का phone number चाहिए।"
        );

        terminal(
            "WHATSAPP MODULE READY"
        );

        return;
    }


    // =================================
    // CONTACTS
    // =================================

    if (
        lower.includes("contact") ||
        lower.includes("contacts") ||
        lower.includes("कॉन्टैक्ट") ||
        lower.includes("कांटेक्ट")
    ) {

        reply(
            "Contacts पढ़ने के लिए Android Contacts permission और native module चाहिए।"
        );

        terminal(
            "ANDROID CONTACT ACCESS REQUIRED"
        );

        return;
    }


    // =================================
    // GREETING
    // =================================

    if (
        lower.includes("hello") ||
        lower.includes("hi") ||
        lower.includes("हेलो") ||
        lower.includes("नमस्ते")
    ) {

        reply(
            "नमस्ते! मैं FIXA हूँ। बताइए, मैं आपके लिए क्या करूँ?"
        );

        return;
    }


    // =================================
    // HELP
    // =================================

    if (
        lower.includes("help") ||
        lower.includes("मदद")
    ) {

        reply(
            "आप मुझे time, Google, call या WhatsApp जैसी commands दे सकते हैं।"
        );

        return;
    }


    // =================================
    // UNKNOWN COMMAND
    // =================================

    terminal(
        "ANALYZING COMMAND"
    );

    setTimeout(function () {

        reply(
            "मैंने आपकी command समझी: \"" +
            command +
            "\"। इस action के लिए अभी Android module जोड़ना बाकी है।"
        );

    }, 500);
}


// =====================================
// SEND BUTTON
// =====================================

sendButton.addEventListener(
    "click",
    function () {

        processCommand(
            commandInput.value
        );

    }
);


// =====================================
// ENTER KEY
// =====================================

commandInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            processCommand(
                commandInput.value
            );

        }

    }
);


// =====================================
// QUICK COMMANDS
// =====================================

document
    .querySelectorAll(".quick button")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const command =
                    button.dataset.command;

                commandInput.value =
                    command;

                processCommand(
                    command
                );

            }
        );

    });


// =====================================
// VOICE RECOGNITION
// =====================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (!SpeechRecognition) {

    micButton.disabled = false;

    micButton.onclick = function () {

        response.innerText =
            "इस Preview में voice recognition उपलब्ध नहीं है। FIXA को Chrome में खोलकर देखें।";

        terminal(
            "VOICE RECOGNITION NOT SUPPORTED"
        );

    };

} else {

    const recognition =
        new SpeechRecognition();

    recognition.lang = "hi-IN";

    recognition.continuous = false;

    recognition.interimResults = false;


    micButton.onclick = function () {

        try {

            recognition.start();

            micButton.classList.add(
                "listening"
            );

            status.innerText =
                "LISTENING";

            response.innerText =
                "🎙️ FIXA सुन रहा है...";

            terminal(
                "MICROPHONE STARTED"
            );

        } catch (error) {

            console.log(error);

            response.innerText =
                "Microphone start नहीं हो पाया।";

        }

    };


    recognition.onstart = function () {

        micButton.classList.add(
            "listening"
        );

        status.innerText =
            "LISTENING";

        terminal(
            "LISTENING..."
        );

    };


    recognition.onresult = function (event) {

        const text =
            event.results[0][0].transcript;

        commandInput.value =
            text;

        terminal(
            "VOICE: " + text
        );

        micButton.classList.remove(
            "listening"
        );

        processCommand(text);

    };


    recognition.onerror = function (event) {

        micButton.classList.remove(
            "listening"
        );

        status.innerText =
            "READY";

        terminal(
            "MIC ERROR: " + event.error
        );

        if (event.error === "not-allowed") {

            response.innerText =
                "FIXA को microphone permission नहीं मिली।";

        } else if (event.error === "no-speech") {

            response.innerText =
                "मुझे आपकी आवाज़ सुनाई नहीं दी। फिर से बोलिए।";

        } else {

            response.innerText =
                "Microphone error: " +
                event.error;

        }

    };


    recognition.onend = function () {

        micButton.classList.remove(
            "listening"
        );

        status.innerText =
            "READY";

    };

      }
