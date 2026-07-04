// This file is for getting the fingerprint of the user

// get operating system from a user agent string
function getOS(userAgent) {
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac OS")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS";
    return "Unknown";
}

// get whatever browser engine from a user agent string
function getEngine(userAgent) {
    if (userAgent.includes("Chrome") || userAgent.includes("Edg") || userAgent.includes("OPR")) {
        return "Blink (Chromium Based)";
    }
    if (userAgent.includes("Firefox")) return "Gecko (Usually Firefox)";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "WebKit (Usually Safari)";
    return "Unknown";
}


// combine all env fingerprint data and return it as an object
function collectFingerprint() {
    const ua = navigator.userAgent;

    const data = {
        os: getOS(ua),
        engine: getEngine(ua),
        userAgent: ua,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        devicePixelRatio: window.devicePixelRatio,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
    };

    return data;
}

// fill main page inner html with browser fingerprint data
function renderFingerprint() {
    const fp = collectFingerprint();
    const container = document.getElementById("fingerprint-output");

    container.innerHTML = `
OS: ${fp.os}
Browser Engine: ${fp.engine}
User-Agent: ${fp.userAgent}

Screen: ${fp.screenWidth} × ${fp.screenHeight}
Device Pixel Ratio: ${fp.devicePixelRatio}
Timezone: ${fp.timezone}
Language: ${fp.language}
    `;
}

renderFingerprint();