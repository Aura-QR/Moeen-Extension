(function () {
  'use strict';

  const PAGE_SOURCE = 'HADER_WEB';
  const EXTENSION_SOURCE = 'HADER_EXTENSION';
  const ALLOWED_ORIGINS = new Set([
    'https://haderedu.com',
    'https://www.haderedu.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000'
  ]);

  function isAllowedOrigin(origin) {
    return ALLOWED_ORIGINS.has(origin)
      || /^https:\/\/([a-z0-9-]+\.)?moeen\.app$/i.test(origin);
  }

  function post(type, payload) {
    window.postMessage({ source: EXTENSION_SOURCE, type, ...(payload || {}) }, window.location.origin);
  }

  function replyFor(type) {
    if (type === 'HADER_GET_SCHEDULE') return 'HADER_SCHEDULE_RESULT';
    if (type === 'HADER_PREPARE_LESSONS') return 'HADER_PREPARATION_ACCEPTED';
    return 'HADER_BRIDGE_RESULT';
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window || !isAllowedOrigin(event.origin)) return;
    const data = event.data;
    if (!data || data.source !== PAGE_SOURCE) return;
    if (!['HADER_BRIDGE_PING', 'HADER_GET_SCHEDULE', 'HADER_PREPARE_LESSONS'].includes(data.type)) return;

    chrome.runtime.sendMessage({
      action: data.type,
      requestId: data.requestId,
      operationId: data.operationId,
      ticket: data.ticket
    }, (response) => {
      const error = chrome.runtime.lastError;
      post(replyFor(data.type), {
        requestId: data.requestId,
        ...(response || {}),
        ...(error ? { success: false, error: error.message } : {})
      });
    });
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.action === 'HADER_BRIDGE_CONTENT_PING') {
      sendResponse({ success: true, bridgeVersion: '2' });
      return true;
    }
    if (!message || !['HADER_PREPARATION_PROGRESS', 'HADER_PREPARATION_DONE'].includes(message.type)) return;
    post(message.type, message.payload || {});
  });

  post('HADER_EXTENSION_READY', { success: true, version: '2' });
})();
