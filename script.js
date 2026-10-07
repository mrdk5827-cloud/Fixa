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
// FIXA VOICE OUTPUT
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
// CLEAN PHONE NUMBER
// =====================================

function cleanNumber(number) {

    return number
        .replace(/\s+/g, "")
        .replace(/-/g, "")
        .replace(/\(/g, "")
        .replace(/\)/g, "");
}


// =====================================
// OPEN PHONE DIALER
// =====================================

function openDialer(number) {

    number = cleanNumber(number);

    terminal("OPENING PHONE");

    window.location.href =
        "tel:" + number;
}


// =====================================
// OPEN SMS
// =====================================

function openSMS(number, message) {

    number = cleanNumber(number);

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

    number = cleanNumber(number);

    // India number को international format में बदलना
    if (
        number.startsWith("0") &&
        number.length === 11
    ) {
        number =
            "91" +
            number.substring(1);
    }

    if (
        number.length === 10 &&
        !number.startsWith("91")
    ) {
        number =
            "91" + number;
    }

    terminal("OPENING WHATSAPP");

    const url =
        "https://wa.me/" +
        number +
        "?text=" +
        encodeURIComponent(message);

    window.open(url, "_blank");
}


// =====================================
// OPEN WEBSITE
// =====================================

function openWebsite(url, name) {

    reply(
        "हाँ, " + name + " खोल रहा हूँ।"
    );

    setTimeout(function () {

        window.open(
            url,
            "_blank"
        );

    }, 500);
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

        const now =
            new Date();

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
    // DATE
    // =================================

    if (
        lower.includes("आज की तारीख") ||
        lower.includes("तारीख") ||
        lower.includes("date")
    ) {

        const now =
            new Date();

        const date =
            now.toLocaleDateString(
                "hi-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

        reply(
            "आज " +
            date +
            " है।"
        );

        return;
    }


    // =================================
    // GOOGLE
    // =================================

    if (
        lower.includes("google") ||
        lower.includes("गूगल")
    ) {

        terminal(
            "OPENING GOOGLE"
        );

        openWebsite(
            "https://www.google.com",
            "Google"
        );

        return;
    }


    // =================================
    // YOUTUBE
    // =================================

    if (
        lower.includes("youtube") ||
        lower.includes("यूट्यूब")
    ) {

        terminal(
            "OPENING YOUTUBE"
        );

        openWebsite(
            "https://www.youtube.com",
            "YouTube"
        );

        return;
    }


    // =================================
    // INSTAGRAM
    // =================================

    if (
        lower.includes("instagram") ||
        lower.includes("इंस्टाग्राम")
    ) {

        openWebsite(
            "https://www.instagram.com",
            "Instagram"
        );

        return;
    }


    // =================================
    // FACEBOOK
    // =================================

    if (
        lower.includes("facebook") ||
        lower.includes("फेसबुक")
    ) {

        openWebsite(
            "https://www.facebook.com",
            "Facebook"
        );

        return;
    }


    // =================================
    // CALL
    // =================================

    if (
        lower.startsWith("call ") ||
        lower.startsWith("कॉल ")
    ) {

        let number;

        if (lower.startsWith("call ")) {

            number =
                command
                    .substring(5)
                    .trim();

        } else {

            number =
                command
                    .substring(5)
                    .trim();
        }

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
    //
    // Format:
    // sms 9876543210 hello
    // =================================

    if (
        lower.startsWith("sms ")
    ) {

        const data =
            command.substring(4).trim();

        const parts =
            data.split(/\s+/);

        const number =
            parts.shift();

        const message =
            parts.join(" ");

        if (
            !number ||
            !message
        ) {

            reply(
                "इस तरह लिखें: sms 9876543210 hello"
            );

            return;
        }

        reply(
            "SMS तैयार कर रहा हूँ।"
        );

        setTimeout(function () {

            openSMS(
                number,
                message
            );

        }, 500);

        return;
    }


    // =================================
    // WHATSAPP NUMBER + MESSAGE
    //
    // Example:
    // whatsapp 9876543210 hello
    // =================================

    if (
        lower.startsWith("whatsapp ")
    ) {

        const data =
            command.substring(9).trim();

        const parts =
            data.split(/\s+/);

        const number =
            parts.shift();

        const message =
            parts.join(" ");

        if (
            !number ||
            !message
        ) {

            reply(
                "इस तरह लिखें: whatsapp 9876543210 hello"
            );

            return;
        }

        reply(
            "WhatsApp में message तैयार कर रहा हूँ।"
        );

        setTimeout(function () {

            openWhatsApp(
                number,
                message
            );

        }, 500);

        return;
    }


    // =================================
    // WHATSAPP OPEN
    // =================================

    if (
        lower.includes("whatsapp") ||
        lower.includes("व्हाट्सऐप") ||
        lower.includes("व्हाट्सएप")
    ) {

        openWebsite(
            "https://web.whatsapp.com/",
            "WhatsApp"
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
        lower === "hi" ||
        lower.includes("हेलो") ||
        lower.includes("नमस्ते") ||
        lower.includes("नमस्कार")
    ) {

        reply(
            "नमस्ते! मैं FIXA हूँ। बताइए, मैं आपके लिए क्या करूँ?"
        );

        return;
    }


    // =================================
    // WHO ARE YOU
    // =================================

    if (
        lower.includes("तुम कौन हो") ||
        lower.includes("तुम कौन") ||
        lower.includes("who are you") ||
        lower.includes("what are you")
    ) {

        reply(
            "मैं FIXA हूँ, आपका personal AI assistant।"
        );

        return;
    }


    // =================================
    // HELP
    // =================================

    if (
        lower.includes("help") ||
        lower.includes("मदद") ||
        lower.includes("क्या कर सकते हो")
    ) {

        reply(
            "मैं अभी समय बता सकता हूँ, Google, YouTube और दूसरी websites खोल सकता हूँ, phone dialer खोल सकता हूँ और WhatsApp या SMS message तैयार कर सकता हूँ।"
        );

        return;
    }


    // =================================
    // CLEAR COMMAND
    // =================================

    if (
        lower === "clear" ||
        lower === "clear terminal" ||
        lower === "क्लियर"
    ) {

        terminalText.innerHTML = "";

        response.innerText =
            "Terminal साफ कर दिया गया।";

        status.innerText =
            "READY";

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
            "\"। इस action को अभी FIXA में जोड़ना बाकी है।"
        );

    }, 500);
}


// =====================================
// SEND BUTTON
// =====================================

if (sendButton) {

    sendButton.addEventListener(
        "click",
        function () {

            processCommand(
                commandInput.value
            );

        }
    );

}


// =====================================
// ENTER KEY
// =====================================

if (commandInput) {

    commandInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                processCommand(
                    commandInput.value
                );

            }

        }
    );

}


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
// FIXA VOICE RECOGNITION
// =====================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (!SpeechRecognition) {

    micButton.onclick = function () {

        response.innerText =
            "इस browser में voice recognition उपलब्ध नहीं है।";

        terminal(
            "VOICE API NOT AVAILABLE"
        );

    };

} else {

    const recognition =
        new SpeechRecognition();

    recognition.lang =
        "hi-IN";

    recognition.continuous =
        false;

    recognition.interimResults =
        false;

    recognition.maxAlternatives =
        1;


    micButton.onclick = function () {

        if (
            navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia
        ) {

            navigator.mediaDevices
                .getUserMedia({
                    audio: true
                })

                .then(function () {

                    terminal(
                        "MIC PERMISSION OK"
                    );

                    try {

                        recognition.start();

                    } catch (error) {

                        console.log(error);

                    }

                })

                .catch(function (error) {

                    console.log(error);

                    response.innerText =
                        "Microphone permission नहीं मिली। Chrome की site permission check करें।";

                    terminal(
                        "MIC PERMISSION ERROR: " +
                        error.name
                    );

                });

        } else {

            try {

                recognition.start();

            } catch (error) {

                console.log(error);

            }

        }

    };


    recognition.onstart =
        function () {

            micButton.classList.add(
                "listening"
            );

            status.innerText =
                "LISTENING";

            response.innerText =
                "🎙️ FIXA सुन रहा है...";

            terminal(
                "LISTENING..."
            );

        };


    recognition.onresult =
        function (event) {

            const text =
                event
                    .results[0][0]
                    .transcript;

            commandInput.value =
                text;

            terminal(
                "VOICE: " + text
            );

            micButton.classList.remove(
                "listening"
            );

            processCommand(
                text
            );

        };


    recognition.onerror =
        function (event) {

            console.log(
                "Speech error:",
                event.error
            );

            micButton.classList.remove(
                "listening"
            );

            status.innerText =
                "READY";

            terminal(
                "SPEECH ERROR: " +
                event.error
            );


            if (
                event.error ===
                "not-allowed"
            ) {

                response.innerText =
                    "Chrome ने FIXA की voice service को अनुमति नहीं दी।";

            }

            else if (
                event.error ===
                "service-not-allowed"
            ) {

                response.innerText =
                    "इस device/browser में speech service उपलब्ध नहीं है।";

            }

            else if (
                event.error ===
                "no-speech"
            ) {

                response.innerText =
                    "आवाज़ सुनाई नहीं दी। फिर से बोलिए।";

            }

            else {

                response.innerText =
                    "Voice error: " +
                    event.error;

            }

        };


    recognition.onend =
        function () {

            micButton.classList.remove(
                "listening"
            );

            status.innerText =
                "READY";

        };

}


// =====================================
// FIXA READY
// =====================================

terminal(
    "FIXA SYSTEM ONLINE"
);

terminal(
    "COMMAND MODULE READY"
);

status.innerText =
    "READY";
