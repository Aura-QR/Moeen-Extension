/**
 * Moeen-2 - Madrasati response capture helper
 *
 * Paste this in DevTools console on schools.madrasati.sa BEFORE triggering a
 * manual lesson save flow. It intercepts fetch + XMLHttpRequest in the current
 * page, same-origin iframes, and same-origin popups.
 *
 * Captures only these target endpoints:
 *   1. POST /Teacher/Assignments/AddQuestionListPaging
 *   2. POST /Teacher/Exams/ExamQuestionSettings
 *   3. POST /Teacher/LectureTools/GetAssignmentsList
 *   4. POST /Teacher/LectureTools/GetExamsList
 *   5. POST /Teacher/LectureTools/AddAssignment
 *   6. POST /Teacher/LectureTools/AddAssignmentToLecture
 *   7. GET/POST /Teacher/Assignments/Manage
 *   8. POST /LearningResources/MangeResources/GetGoalLessonSubject
 *   9. POST /LearningResources/MangeResources/Create
 *  10. POST /Teacher/LectureTools/AddActivity
 *  11. POST /Teacher/LectureTools/AddActivityToLecture
 *
 * Console helpers after install:
 *   __Moeen-2_CAPTURE.status()
 *   __Moeen-2_CAPTURE.downloadAll()
 *   __Moeen-2_CAPTURE.copyAll()
 *   __Moeen-2_CAPTURE.reset()
 */
(function Moeen-2CaptureInstaller() {
  'use strict';

  var INSTALL_KEY = '__Moeen-2_CAPTURE_INSTALLED_V4__';
  var API_KEY = '__Moeen-2_CAPTURE';
  var XHR_META_KEY = '__Moeen-2_CAPTURE_XHR_META_V4__';
  var STORAGE_KEY = 'Moeen-2_CAPTURE_RESPONSES_V4';
  var LOG_PREFIX = '[CAPTURE]';
  var PREVIEW_CHARS = 900;
  var REQUEST_BODY_CHARS = 12000;
  var NEAR_MISS_PREFIXES = [
    '/teacher/assignments/',
    '/teacher/exams/',
    '/teacher/lecturetools/',
    '/learningresources/'
  ];

  var TARGETS = [
    {
      key: 'AddQuestionListPaging',
      path: '/Teacher/Assignments/AddQuestionListPaging',
      expectedMethod: 'POST',
      extension: 'html'
    },
    {
      key: 'ExamQuestionSettings',
      path: '/Teacher/Exams/ExamQuestionSettings',
      expectedMethod: 'POST',
      extension: 'html'
    },
    {
      key: 'GetAssignmentsList',
      path: '/Teacher/LectureTools/GetAssignmentsList',
      expectedMethod: 'POST',
      extension: 'html'
    },
    {
      key: 'GetExamsList',
      path: '/Teacher/LectureTools/GetExamsList',
      expectedMethod: 'POST',
      extension: 'html'
    },
    {
      key: 'AddAssignment',
      path: '/Teacher/LectureTools/AddAssignment',
      expectedMethod: 'POST',
      extension: 'html'
    },
    {
      key: 'AddAssignmentToLecture',
      path: '/Teacher/LectureTools/AddAssignmentToLecture',
      expectedMethod: 'POST',
      extension: 'html'
    },
    {
      key: 'AssignmentsManage',
      path: '/Teacher/Assignments/Manage',
      expectedMethod: 'GET/POST',
      extension: 'html'
    },
    {
      key: 'MangeResourcesGoals',
      path: '/LearningResources/MangeResources/GetGoalLessonSubject',
      expectedMethod: 'POST',
      extension: 'json'
    },
    {
      key: 'MangeResourcesCreate',
      path: '/LearningResources/MangeResources/Create',
      expectedMethod: 'POST',
      extension: 'html'
    },
    {
      key: 'AddActivity',
      path: '/Teacher/LectureTools/AddActivity',
      expectedMethod: 'POST',
      extension: 'json'
    },
    {
      key: 'AddActivityToLecture',
      path: '/Teacher/LectureTools/AddActivityToLecture',
      expectedMethod: 'POST',
      extension: 'json'
    }
  ];

  var TOP = getTopWindow();
  var state = TOP[API_KEY] && TOP[API_KEY]._state ? TOP[API_KEY]._state : {
    captures: [],
    counts: {},
    nearMissSeen: {},
    seen: {},
    contexts: [],
    installedAt: new Date().toISOString()
  };

  state.captures = state.captures || [];
  state.counts = state.counts || {};
  state.nearMissSeen = state.nearMissSeen || {};
  state.seen = state.seen || {};
  state.contexts = state.contexts || [];

  TARGETS.forEach(function (target) {
    if (!state.counts[target.key]) state.counts[target.key] = 0;
  });

  function getTopWindow() {
    try {
      return window.top || window;
    } catch (_) {
      return window;
    }
  }

  function safeLog(method) {
    var args = Array.prototype.slice.call(arguments, 1);
    try {
      (console[method] || console.log).apply(console, args);
    } catch (_) {}
  }

  function normalizePath(url, contextWindow) {
    if (url && typeof url === 'object' && typeof url.url === 'string') {
      url = url.url;
    }
    var raw = String(url || '');
    try {
      return new contextWindow.URL(raw, contextWindow.location.href).pathname.toLowerCase();
    } catch (_) {
      return raw.split('?')[0].toLowerCase();
    }
  }

  function findTarget(url, contextWindow) {
    var path = normalizePath(url, contextWindow || window);
    for (var i = 0; i < TARGETS.length; i += 1) {
      if (path === TARGETS[i].path.toLowerCase() || path.indexOf(TARGETS[i].path.toLowerCase()) !== -1) {
        return TARGETS[i];
      }
    }
    return null;
  }

  function noteNearMiss(transport, method, url, contextWindow) {
    var path = normalizePath(url, contextWindow || window);
    var isRelevantArea = NEAR_MISS_PREFIXES.some(function (prefix) {
      return path.indexOf(prefix) === 0;
    });
    if (!isRelevantArea) return;

    var looksUseful = /(question|assignment|exam|lecturetools|paging|settings|manage|list)/i.test(path);
    if (!looksUseful) return;

    var key = transport + '|' + method + '|' + path;
    if (state.nearMissSeen[key]) return;
    state.nearMissSeen[key] = true;

    safeLog(
      'log',
      '%c' + LOG_PREFIX + ' Ignored related URL (not one of the watched targets): ' + transport + ' ' + method + ' ' + path,
      'color:#b58900;font-weight:bold'
    );
  }

  function requestUrl(input, contextWindow) {
    if (input && typeof input === 'object' && typeof input.url === 'string') return input.url;
    try {
      return new contextWindow.URL(String(input || ''), contextWindow.location.href).href;
    } catch (_) {
      return String(input || '');
    }
  }

  function requestMethod(input, init, fallback) {
    if (init && init.method) return String(init.method).toUpperCase();
    if (input && typeof input === 'object' && input.method) return String(input.method).toUpperCase();
    return fallback || 'GET';
  }

  function shortBody(body) {
    try {
      if (body == null) return '';
      if (typeof body === 'string') return body.slice(0, REQUEST_BODY_CHARS);
      if (body instanceof URLSearchParams) return body.toString().slice(0, REQUEST_BODY_CHARS);
      if (typeof FormData !== 'undefined' && body instanceof FormData) {
        var parts = [];
        body.forEach(function (value, key) {
          parts.push(key + '=' + (value && value.name ? '[File:' + value.name + ']' : String(value)));
        });
        return parts.join('&').slice(0, REQUEST_BODY_CHARS);
      }
      return Object.prototype.toString.call(body);
    } catch (err) {
      return '[unreadable body: ' + (err && err.message ? err.message : err) + ']';
    }
  }

  function headersToObject(headers) {
    var out = {};
    try {
      if (!headers || !headers.forEach) return out;
      headers.forEach(function (value, key) {
        out[key] = value;
      });
    } catch (_) {}
    return out;
  }

  function parseRawHeaders(raw) {
    var out = {};
    String(raw || '').trim().split(/\r?\n/).forEach(function (line) {
      var idx = line.indexOf(':');
      if (idx > 0) out[line.slice(0, idx).trim().toLowerCase()] = line.slice(idx + 1).trim();
    });
    return out;
  }

  function nowStamp() {
    var d = new Date();
    function pad(n, len) {
      return String(n).padStart(len || 2, '0');
    }
    return (
      d.getFullYear() +
      pad(d.getMonth() + 1) +
      pad(d.getDate()) +
      '_' +
      pad(d.getHours()) +
      pad(d.getMinutes()) +
      pad(d.getSeconds()) +
      '_' +
      pad(d.getMilliseconds(), 3)
    );
  }

  function makeFilename(capture) {
    return [
      'CAPTURE',
      capture.transport,
      capture.targetKey,
      capture.sequence,
      capture.status || 'status',
      nowStamp()
    ].join('_') + '.' + capture.extension;
  }

  function saveToLocalStorage() {
    try {
      TOP.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.captures.slice(-25)));
    } catch (err) {
      safeLog('warn', LOG_PREFIX, 'Could not persist captures to localStorage:', err && err.message ? err.message : err);
    }
  }

  function download(filename, text, mime) {
    try {
      var blob = new Blob([text == null ? '' : String(text)], { type: mime || 'text/plain;charset=utf-8' });
      var a = TOP.document.createElement('a');
      a.href = TOP.URL.createObjectURL(blob);
      a.download = filename;
      a.style.display = 'none';
      TOP.document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        try {
          TOP.URL.revokeObjectURL(a.href);
          a.remove();
        } catch (_) {}
      }, 1000);
      safeLog('log', '%c' + LOG_PREFIX + ' Downloaded: ' + filename, 'color:lime;font-weight:bold');
    } catch (err) {
      safeLog('warn', LOG_PREFIX, 'Download failed. The capture is still stored in __Moeen-2_CAPTURE.', err);
    }
  }

  function responseTextFromJsonMaybe(text) {
    return text == null ? '' : String(text);
  }

  function recordCapture(capture) {
    if (!capture || !capture.targetKey) return;

    var fingerprint = [
      capture.transport,
      capture.targetKey,
      capture.status,
      capture.url,
      capture.bodyText.length,
      capture.bodyText.slice(0, 160)
    ].join('|');

    var lastSeen = state.seen[fingerprint] || 0;
    var now = Date.now();
    if (now - lastSeen < 750) return;
    state.seen[fingerprint] = now;

    state.counts[capture.targetKey] = (state.counts[capture.targetKey] || 0) + 1;
    capture.sequence = state.counts[capture.targetKey];
    capture.capturedAt = new Date().toISOString();
    capture.filename = makeFilename(capture);

    state.captures.push(capture);
    saveToLocalStorage();

    safeLog(
      'log',
      '%c' + LOG_PREFIX + ' ' + capture.transport + ' ' + capture.method + ' ' + capture.targetKey +
        ' -> ' + capture.status + ' (' + capture.bodyText.length + ' chars)',
      'color:cyan;font-weight:bold'
    );
    if (capture.requestBodyPreview) {
      safeLog('log', LOG_PREFIX + ' request body preview:', capture.requestBodyPreview);
    }
    safeLog('log', responseTextFromJsonMaybe(capture.bodyText).slice(0, PREVIEW_CHARS));

    download(capture.filename, capture.bodyText, capture.mime);
    printStatus();
  }

  function textFromXhr(xhr) {
    try {
      var type = xhr.responseType || '';
      if (!type || type === 'text') return xhr.responseText || '';
      if (type === 'json') return JSON.stringify(xhr.response, null, 2);
      if (type === 'document') return new XMLSerializer().serializeToString(xhr.responseXML || xhr.response);
      if (type === 'blob') return '[Blob response: ' + (xhr.response && xhr.response.size ? xhr.response.size : 0) + ' bytes]';
      if (type === 'arraybuffer') return '[ArrayBuffer response: ' + (xhr.response && xhr.response.byteLength ? xhr.response.byteLength : 0) + ' bytes]';
      return String(xhr.response || '');
    } catch (err) {
      return '[unreadable XHR response: ' + (err && err.message ? err.message : err) + ']';
    }
  }

  function installInto(contextWindow, label) {
    if (!contextWindow) return false;

    try {
      if (contextWindow[INSTALL_KEY]) return false;
      contextWindow[INSTALL_KEY] = true;
    } catch (_) {
      return false;
    }

    state.contexts.push(label || contextWindow.location.href);

    try {
      var originalFetch = contextWindow.fetch;
      if (typeof originalFetch === 'function') {
        contextWindow.fetch = function Moeen-2CaptureFetch(input, init) {
          var url = requestUrl(input, contextWindow);
          var target = findTarget(url, contextWindow);
          var method = requestMethod(input, init);
          var requestBodyPreview = init && init.body ? shortBody(init.body) : '';
          if (!target) noteNearMiss('FETCH', method, url, contextWindow);

          return originalFetch.apply(this, arguments).then(function (response) {
            if (!target) return response;

            var clone;
            try {
              clone = response.clone();
            } catch (err) {
              safeLog('warn', LOG_PREFIX, 'Could not clone fetch response for', target.key, err);
              return response;
            }

            clone.text().then(function (text) {
              recordCapture({
                transport: 'FETCH',
                targetKey: target.key,
                targetPath: target.path,
                method: method,
                expectedMethod: target.expectedMethod,
                url: url,
                status: response.status,
                statusText: response.statusText,
                responseHeaders: headersToObject(response.headers),
                requestBodyPreview: requestBodyPreview,
                bodyText: text || '',
                extension: target.extension,
                mime: 'text/plain;charset=utf-8',
                frame: label || contextWindow.location.href
              });
            }).catch(function (err) {
              safeLog('warn', LOG_PREFIX, 'Could not read fetch response for ' + target.key + ':', err);
            });

            return response;
          });
        };
      }
    } catch (err) {
      safeLog('warn', LOG_PREFIX, 'Fetch patch failed for ' + label + ':', err);
    }

    try {
      var XHR = contextWindow.XMLHttpRequest;
      if (XHR && XHR.prototype) {
        var originalOpen = XHR.prototype.open;
        var originalSend = XHR.prototype.send;

        XHR.prototype.open = function Moeen-2CaptureXhrOpen(method, url) {
          this[XHR_META_KEY] = {
            method: requestMethod(null, { method: method }, method),
            url: requestUrl(url, contextWindow),
            target: findTarget(url, contextWindow)
          };
          return originalOpen.apply(this, arguments);
        };

        XHR.prototype.send = function Moeen-2CaptureXhrSend(body) {
          var meta = this[XHR_META_KEY];
          if (meta && meta.target) {
            meta.requestBodyPreview = shortBody(body);
            this.addEventListener('loadend', function () {
              recordCapture({
                transport: 'XHR',
                targetKey: meta.target.key,
                targetPath: meta.target.path,
                method: meta.method || 'GET',
                expectedMethod: meta.target.expectedMethod,
                url: meta.url,
                status: this.status,
                statusText: this.statusText,
                responseHeaders: parseRawHeaders(this.getAllResponseHeaders && this.getAllResponseHeaders()),
                requestBodyPreview: meta.requestBodyPreview,
                bodyText: textFromXhr(this),
                extension: meta.target.extension,
                mime: 'text/plain;charset=utf-8',
                frame: label || contextWindow.location.href
              });
            });
          } else if (meta) {
            noteNearMiss('XHR', meta.method || 'GET', meta.url, contextWindow);
          }
          return originalSend.apply(this, arguments);
        };
      }
    } catch (err) {
      safeLog('warn', LOG_PREFIX, 'XHR patch failed for ' + label + ':', err);
    }

    return true;
  }

  function installExistingFrames(rootWindow) {
    try {
      var frames = rootWindow.document.querySelectorAll('iframe, frame');
      Array.prototype.forEach.call(frames, function (frame, idx) {
        try {
          if (frame.contentWindow && frame.contentWindow.location.origin === rootWindow.location.origin) {
            installInto(frame.contentWindow, 'frame#' + idx + ' ' + frame.contentWindow.location.href);
          }
        } catch (_) {}
      });
    } catch (_) {}
  }

  function watchFutureFrames(rootWindow) {
    try {
      var observer = new rootWindow.MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          Array.prototype.forEach.call(mutation.addedNodes || [], function (node) {
            if (!node || node.nodeType !== 1) return;
            var frames = [];
            if (/^(iframe|frame)$/i.test(node.tagName)) frames.push(node);
            if (node.querySelectorAll) {
              frames = frames.concat(Array.prototype.slice.call(node.querySelectorAll('iframe, frame')));
            }
            frames.forEach(function (frame) {
              frame.addEventListener('load', function () {
                try {
                  if (frame.contentWindow && frame.contentWindow.location.origin === rootWindow.location.origin) {
                    installInto(frame.contentWindow, 'future-frame ' + frame.contentWindow.location.href);
                  }
                } catch (_) {}
              });
              try {
                if (frame.contentWindow && frame.contentWindow.location.origin === rootWindow.location.origin) {
                  installInto(frame.contentWindow, 'future-frame ' + frame.contentWindow.location.href);
                }
              } catch (_) {}
            });
          });
        });
      });
      observer.observe(rootWindow.document.documentElement || rootWindow.document.body, {
        childList: true,
        subtree: true
      });
      state.frameObserver = observer;
    } catch (err) {
      safeLog('warn', LOG_PREFIX, 'Could not watch future iframes:', err);
    }
  }

  function patchWindowOpen(rootWindow) {
    try {
      if (rootWindow.__Moeen-2_CAPTURE_WINDOW_OPEN_PATCHED__) return;
      rootWindow.__Moeen-2_CAPTURE_WINDOW_OPEN_PATCHED__ = true;
      var originalOpen = rootWindow.open;
      if (typeof originalOpen !== 'function') return;

      rootWindow.open = function Moeen-2CaptureWindowOpen() {
        var child = originalOpen.apply(this, arguments);
        if (!child) return child;

        var attempts = 0;
        var timer = rootWindow.setInterval(function () {
          attempts += 1;
          try {
            if (child.closed) {
              rootWindow.clearInterval(timer);
              return;
            }
            if (child.location && child.location.origin === rootWindow.location.origin) {
              installInto(child, 'popup ' + child.location.href);
              installExistingFrames(child);
              watchFutureFrames(child);
              rootWindow.clearInterval(timer);
            }
          } catch (_) {}
          if (attempts > 40) rootWindow.clearInterval(timer);
        }, 250);

        return child;
      };
    } catch (err) {
      safeLog('warn', LOG_PREFIX, 'window.open patch failed:', err);
    }
  }

  function missingKeys() {
    return TARGETS.filter(function (target) {
      return !state.counts[target.key];
    }).map(function (target) {
      return target.key;
    });
  }

  function printStatus() {
    var rows = TARGETS.map(function (target) {
      return {
        endpoint: target.key,
        count: state.counts[target.key] || 0,
        path: target.path
      };
    });
    safeLog('table', rows);
    var missing = missingKeys();
    if (missing.length) {
      safeLog('log', '%c' + LOG_PREFIX + ' Missing so far: ' + missing.join(', '), 'color:orange;font-weight:bold');
    } else {
      safeLog('log', '%c' + LOG_PREFIX + ' All watched target endpoints captured.', 'color:lime;font-weight:bold');
    }
  }

  function downloadAll() {
    if (!state.captures.length) {
      safeLog('warn', LOG_PREFIX, 'No captures yet.');
      return;
    }
    state.captures.forEach(function (capture) {
      download(capture.filename || makeFilename(capture), capture.bodyText || '', capture.mime);
    });
  }

  function copyAll() {
    var payload = JSON.stringify(state.captures.map(function (capture) {
      return {
        targetKey: capture.targetKey,
        method: capture.method,
        url: capture.url,
        status: capture.status,
        capturedAt: capture.capturedAt,
        requestBodyPreview: capture.requestBodyPreview,
        bodyText: capture.bodyText
      };
    }), null, 2);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(payload).then(function () {
        safeLog('log', '%c' + LOG_PREFIX + ' Copied all captures to clipboard.', 'color:lime;font-weight:bold');
      }).catch(function (err) {
        safeLog('warn', LOG_PREFIX, 'Clipboard write failed. Returning payload:', err);
        safeLog('log', payload);
      });
    } else {
      safeLog('log', payload);
    }
    return payload;
  }

  function reset() {
    state.captures = [];
    state.counts = {};
    state.nearMissSeen = {};
    state.seen = {};
    TARGETS.forEach(function (target) {
      state.counts[target.key] = 0;
    });
    try {
      TOP.localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
    safeLog('log', '%c' + LOG_PREFIX + ' Reset capture state.', 'color:lime;font-weight:bold');
    printStatus();
  }

  TOP[API_KEY] = {
    _state: state,
    targets: TARGETS.slice(),
    status: printStatus,
    downloadAll: downloadAll,
    copyAll: copyAll,
    reset: reset
  };

  installInto(window, 'top ' + window.location.href);
  installExistingFrames(window);
  watchFutureFrames(window);
  patchWindowOpen(window);

  safeLog('log', '%c' + LOG_PREFIX + ' Interceptor active. Watching for:', 'color:lime;font-weight:bold', TARGETS.map(function (t) { return t.path; }));
  safeLog('log', '%c' + LOG_PREFIX + ' Patched contexts: ' + state.contexts.length + '. Run __Moeen-2_CAPTURE.status() anytime.', 'color:lime');
  printStatus();
})();
