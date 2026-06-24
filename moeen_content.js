(function () {
  console.log("[Moeen Extension] Content script injected on Moeen Web App.");

  // Request cookies from background on load
  requestCookiesFromExtension();

  // Listen for messages from the webpage
  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (data && data.source === "MOEEN_WEB" && data.type === "MOEEN_MADRASATI_CONNECT_START") {
      console.log("[Moeen Extension] Web page requested connection start. Fetching cookies...");
      requestCookiesFromExtension();
    }
  });

  // Listen for messages from the extension background script
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === "MOEEN_MADRASATI_COOKIES_FOUND") {
      console.log("[Moeen Extension] Received cookies from extension background. Forwarding to page.");
      window.postMessage({
        source: "MOEEN_EXTENSION",
        type: "MOEEN_MADRASATI_COOKIES_FOUND",
        session_cookie: msg.session_cookie,
        madrasati_school_id: msg.madrasati_school_id
      }, window.location.origin);
    }
  });

  function requestCookiesFromExtension() {
    chrome.runtime.sendMessage({ action: "GET_MADRASATI_SESSION" }, (response) => {
      if (response && response.success && response.session_cookie) {
        console.log("[Moeen Extension] Successfully pulled cookies from active Madrasati tab.");
        window.postMessage({
          source: "MOEEN_EXTENSION",
          type: "MOEEN_MADRASATI_COOKIES_FOUND",
          session_cookie: response.session_cookie,
          madrasati_school_id: response.madrasati_school_id
        }, window.location.origin);
      } else {
        console.log("[Moeen Extension] No active Madrasati session found or failed to pull cookies.");
      }
    });
  }
})();
