// Background service worker for مُعين - Headless API Strategy (v3)
// - Loads and caches local JSON databases (Courses & Templates).
// - Serves data instantly to content.js.
// - Handles toolbar action click to toggle automation per-tab
// - Persists state in chrome.storage

importScripts('shared/constants.js');

const HADAR_API_BASE = (globalThis.Moeen2_CONFIG?.API_BASE_URL || 'https://api.haderedu.com/api').replace(/\/+$/, '');

async function callHadarApi(path, options, token, tokenType) {
  const response = await fetch(HADAR_API_BASE + path, {
    ...(options || {}),
    headers: {
      'Accept': 'application/json',
      ...((options && options.body) ? { 'Content-Type': 'application/json' } : {}),
      ...((options && options.headers) || {}),
      'Authorization': `${tokenType || 'Bearer'} ${token || ''}`
    }
  });
  let data = null;
  try { data = await response.json(); } catch (_) { }
  return { ok: response.ok, status: response.status, data };
}

async function callBrowserTicketApi(path, body) {
  const response = await fetch(HADAR_API_BASE + path, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {})
  });
  let data = null;
  try { data = await response.json(); } catch (_) { }
  return { ok: response.ok, status: response.status, data };
}

async function findMadrasatiTab(openIfMissing) {
  const tabs = await chrome.tabs.query({
    url: ['https://schools.madrasati.sa/*', 'https://external.madrasati.sa/*']
  });
  const isTeacherSchedule = (item) => /\/SchoolSchedule\/Schedule\/TeacherSchedule/i.test(String(item.url || ''));
  const tab = tabs.find((item) => item.id && item.status === 'complete' && isTeacherSchedule(item))
    || tabs.find((item) => item.id && isTeacherSchedule(item));
  if (tab) return { tab, opened: false };
  if (!openIfMissing) return { tab: null, opened: false };
  const targetUrl = 'https://schools.madrasati.sa/SchoolSchedule/Schedule/TeacherSchedule';
  const existing = tabs.find((item) => item.id);
  const opened = existing
    ? await chrome.tabs.update(existing.id, { url: targetUrl, active: true })
    : await chrome.tabs.create({ url: targetUrl, active: true });
  return { tab: opened, opened: true };
}

async function sendToTab(tabId, message) {
  return chrome.tabs.sendMessage(tabId, message, { frameId: 0 });
}

async function broadcastToHaderTabs(type, payload) {
  const tabs = await chrome.tabs.query({
    url: [
      'https://haderedu.com/*',
      'https://www.haderedu.com/*',
      'https://moeen.app/*',
      'https://*.moeen.app/*',
      'http://localhost:3000/*',
      'http://localhost:3001/*',
      'http://127.0.0.1:3000/*'
    ]
  });
  await Promise.allSettled(tabs.filter((tab) => tab.id).map((tab) =>
    chrome.tabs.sendMessage(tab.id, { type, payload })
  ));
}

async function ensureHaderBridgeInOpenTabs() {
  const tabs = await chrome.tabs.query({
    url: [
      'https://haderedu.com/*',
      'https://www.haderedu.com/*',
      'http://localhost:3000/*',
      'http://localhost:3001/*',
      'http://127.0.0.1:3000/*'
    ]
  });
  await Promise.allSettled(tabs.filter((tab) => tab.id).map(async (tab) => {
    try {
      const health = await chrome.tabs.sendMessage(tab.id, { action: 'HADER_BRIDGE_CONTENT_PING' });
      if (health?.success) return;
    } catch (_) { }
    await chrome.scripting.executeScript({
      target: { tabId: tab.id, frameIds: [0] },
      files: ['moeen_content.js']
    });
  }));
}

function isMadrasatiAuthCookie(name) {
  const normalized = String(name || '').trim().toLowerCase();
  return normalized === '.aspnetcore.cookies'
    || /^\.aspnetcore\.cookiesc\d+$/.test(normalized)
    || normalized === '.aspnetcore.identity.application'
    || /^\.aspnetcore\.identity\.applicationc\d+$/.test(normalized);
}

function isForwardableMadrasatiCookie(name, value) {
  const rawName = typeof name === 'string' ? name : '';
  const rawValue = typeof value === 'string' ? value : '';
  const lowerName = rawName.toLowerCase();
  return !!lowerName
    && rawName.length <= 128
    && !!rawValue
    && rawValue.length <= 16384
    && !lowerName.startsWith('_ga')
    && !lowerName.startsWith('_gid')
    && !lowerName.startsWith('_gat')
    && !lowerName.startsWith('_gcl')
    && !lowerName.startsWith('_fbp')
    && !lowerName.startsWith('_clck')
    && !lowerName.startsWith('_hj');
}

function getMadrasatiCookieUrls(preferredUrl) {
  const urls = [];
  try {
    const parsed = new URL(preferredUrl || '');
    if (
      parsed.protocol === 'https:'
      && (parsed.hostname === 'schools.madrasati.sa' || parsed.hostname === 'external.madrasati.sa')
    ) {
      urls.push(parsed.href);
      urls.push(parsed.origin + '/');
    }
  } catch (_) { }

  for (const url of ['https://schools.madrasati.sa/', 'https://external.madrasati.sa/']) {
    if (!urls.includes(url)) urls.push(url);
  }
  return urls;
}

async function readRequiredMadrasatiCookies(preferredUrl) {
  const attempts = [];
  let bestCookies = [];
  const queries = getMadrasatiCookieUrls(preferredUrl).map((url) => ({
    label: url,
    details: { url }
  }));

  // The updated Madrasati UI can scope HttpOnly authentication cookies to a
  // parent domain or a non-root path. Domain/all-permitted fallbacks catch
  // those cookies when a URL-only lookup does not.
  queries.push({ label: 'domain:madrasati.sa', details: { domain: 'madrasati.sa' } });
  queries.push({ label: 'all-permitted-madrasati', details: {} });

  for (const query of queries) {
    let allCookies = [];
    try {
      allCookies = await chrome.cookies.getAll(query.details);
    } catch (error) {
      attempts.push({ scope: query.label, count: 0, error: error?.message || String(error) });
      continue;
    }

    const byName = new Map();
    for (const cookie of allCookies) {
      const domain = String(cookie.domain || '').replace(/^\./, '').toLowerCase();
      if (domain !== 'madrasati.sa' && !domain.endsWith('.madrasati.sa')) continue;
      if (!isForwardableMadrasatiCookie(cookie.name, cookie.value)) continue;
      // chrome.cookies.getAll({url}) is already ordered by path specificity.
      // Preserve the first value for a duplicated cookie name.
      if (!byName.has(cookie.name)) {
        byName.set(cookie.name, { name: cookie.name, value: cookie.value });
      }
    }

    const cookies = Array.from(byName.values())
      .sort((left, right) => Number(isMadrasatiAuthCookie(right.name)) - Number(isMadrasatiAuthCookie(left.name)))
      .slice(0, 32);

    const authCookieNames = cookies
      .filter((cookie) => isMadrasatiAuthCookie(cookie.name))
      .map((cookie) => cookie.name)
      .slice(0, 8);
    attempts.push({
      scope: query.label,
      count: cookies.length,
      hasAuth: authCookieNames.length > 0,
      authCookieNames
    });

    if (authCookieNames.length > 0) {
      const merged = new Map();
      for (const cookie of [...cookies, ...bestCookies]) {
        if (!merged.has(cookie.name)) merged.set(cookie.name, cookie);
      }
      return {
        cookies: Array.from(merged.values()).slice(0, 32),
        recognizedAuthCookieNames: authCookieNames,
        attempts
      };
    }
    if (cookies.length > bestCookies.length) {
      bestCookies = cookies;
    }
  }

  if (bestCookies.length === 0) {
    const checked = attempts.map((attempt) => `${attempt.scope}:${attempt.count}`).join(', ');
    throw new Error(`لم تعثر الإضافة على أي كوكيز لمدرستي. أعد تحميل الصفحة وسجّل الدخول مجدداً. النطاقات المفحوصة: ${checked}`);
  }

  // Cookie names are an implementation detail owned by Madrasati and may
  // change without notice. Send the complete filtered set through the signed-
  // in extension bridge and let Madrasati validate it on the first live call.
  console.warn('[Hadar] Sending Madrasati cookie set with an unrecognized auth-cookie name.', {
    attempts,
    cookieNames: bestCookies.map((cookie) => cookie.name)
  });
  return {
    cookies: bestCookies,
    recognizedAuthCookieNames: [],
    attempts
  };
}

// ============================================================================
// 1. DATABASE MANAGER (The New Engine)
// ============================================================================
const dbCache = {
  courses: [],
  templates: null,
  flatTemplates: null,        // { introduction:[...], strategies:[...], closure:[...], ... }
  bySubjectId: new Map(),     // Map<string subjectId, course>
  bySubjectName: new Map(),   // Map<string normalizedName, course>
  isLoaded: false
};

// Normalize an Arabic subject name for tolerant lookup (strip diacritics, tatweel,
// duplicate whitespace, common لـ/الـ prefixes). Keeps Arabic letters intact.
function normalizeSubjectName(raw) {
  if (!raw) return '';
  return String(raw)
    .replace(/[ً-ْٰـ]/g, '') // diacritics + tatweel
    .replace(/[إأآا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// Pull the subject name out of a course's first lesson.  rawLessonsList[0].name
// is shaped like "<subject> -- <chapter> -- <lesson>".
function extractSubjectName(course) {
  const list = course && course.rawLessonsList;
  if (!Array.isArray(list) || !list.length) return '';
  const head = (list[0].name || '').split(' -- ')[0];
  return head.trim();
}

function buildSubjectIndex(courses) {
  const byId = new Map();
  const byName = new Map();
  for (const course of courses) {
    if (!course || course.subjectId == null) continue;
    byId.set(String(course.subjectId), course);
    const name = extractSubjectName(course);
    if (name) byName.set(normalizeSubjectName(name), course);
  }
  return { byId, byName };
}

// Flatten lesson_plan_sections.<key>.templates into a {<key>: [...strings]} map
// so content.js can read templates.introduction[0] etc. without walking the tree.
function flattenTemplates(raw) {
  const flat = {};
  const sections = raw && raw.lesson_plan_sections;
  if (sections && typeof sections === 'object') {
    for (const key of Object.keys(sections)) {
      const tpls = sections[key] && sections[key].templates;
      flat[key] = Array.isArray(tpls) ? tpls.slice() : [];
    }
  }
  return flat;
}

async function loadDatabases() {
  if (dbCache.isLoaded) return;

  try {
    console.log("[Background] Loading databases into memory...");

    const coursesUrl = chrome.runtime.getURL('madrasati_courses_clean.json');
    const coursesRes = await fetch(coursesUrl);
    if (!coursesRes.ok) {
      throw new Error(`Could not load course database (${coursesRes.status})`);
    }
    dbCache.courses = await coursesRes.json();

    // Templates improve generated lesson text, but they are not required for
    // course/lesson lookup. Keep the extension usable if this optional asset is
    // absent or damaged instead of failing the entire database initialization.
    try {
      const templatesUrl = chrome.runtime.getURL('ee10_lesson_templates.json');
      const templatesRes = await fetch(templatesUrl);
      if (!templatesRes.ok) {
        throw new Error(`Could not load lesson templates (${templatesRes.status})`);
      }
      dbCache.templates = await templatesRes.json();
    } catch (templateError) {
      console.warn("[Background] Lesson templates unavailable; continuing without them:", templateError);
      dbCache.templates = { lesson_plan_sections: {} };
    }

    const idx = buildSubjectIndex(dbCache.courses);
    dbCache.bySubjectId = idx.byId;
    dbCache.bySubjectName = idx.byName;
    dbCache.flatTemplates = flattenTemplates(dbCache.templates);

    dbCache.isLoaded = true;
    console.log(
      `[Background] Loaded ${dbCache.courses.length} subjects ` +
      `(${dbCache.bySubjectName.size} indexed by name) and ` +
      `${Object.keys(dbCache.flatTemplates).length} template sections.`
    );
  } catch (error) {
    console.error("[Background] Failed to load databases:", error);
  }
}

// Initialize databases when the service worker starts
loadDatabases();


// ============================================================================
// 2. STATE MANAGEMENT & BADGES (Preserved from old code)
// ============================================================================
const STATE_KEY = 'tabStates';
const START_DEBOUNCE_MS = 2000;

async function getStates() {
  const { [STATE_KEY]: states } = await chrome.storage.local.get(STATE_KEY);
  return states || {};
}

async function setStates(states) {
  await chrome.storage.local.set({ [STATE_KEY]: states });
}

async function setTabState(tabId, running) {
  const states = await getStates();
  states[String(tabId)] = { running, updatedAt: Date.now() };
  await setStates(states);
}

async function getTabState(tabId) {
  const states = await getStates();
  return states[String(tabId)]?.running || false;
}

async function markTabStarting(tabId) {
  const states = await getStates();
  const key = String(tabId);
  const previous = states[key];
  const now = Date.now();
  if (previous?.running && now - (previous.updatedAt || 0) < START_DEBOUNCE_MS) {
    return false;
  }
  states[key] = { running: true, updatedAt: now };
  await setStates(states);
  return true;
}

async function syncBadge(tabId, running) {
  const badgeOptions = tabId ? { tabId, text: running ? 'ON' : '' } : { text: running ? 'ON' : '' };
  const colorOptions = tabId ? { tabId, color: running ? '#0a0' : '#777' } : { color: running ? '#0a0' : '#777' };
  await chrome.action.setBadgeBackgroundColor(colorOptions);
  await chrome.action.setBadgeText(badgeOptions);
}

async function syncBadgeForStatus(tabId, status) {
  if (status === 'START') {
    await chrome.action.setBadgeBackgroundColor(tabId ? { tabId, color: '#0a0' } : { color: '#0a0' });
    await chrome.action.setBadgeText(tabId ? { tabId, text: 'ON' } : { text: 'ON' });
    return;
  }
  if (status === 'ERROR') {
    await chrome.action.setBadgeBackgroundColor(tabId ? { tabId, color: '#c0392b' } : { color: '#c0392b' });
    await chrome.action.setBadgeText(tabId ? { tabId, text: 'ERR' } : { text: 'ERR' });
    return;
  }
  await chrome.action.setBadgeBackgroundColor(tabId ? { tabId, color: '#777' } : { color: '#777' });
  await chrome.action.setBadgeText(tabId ? { tabId, text: '' } : { text: '' });
}

async function toggleForTab(tab) {
  if (!tab || !tab.id) return;
  const isRunning = await getTabState(tab.id);
  const next = !isRunning;
  await setTabState(tab.id, next);
  chrome.tabs.sendMessage(tab.id, { type: next ? 'START' : 'STOP', source: 'background' }, () => void chrome.runtime.lastError);
  await syncBadge(tab.id, next);
}

chrome.action.onClicked.addListener(async (tab) => {
  await toggleForTab(tab);
});

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.action.setBadgeText({ text: '' });
  await ensureHaderBridgeInOpenTabs();
});

void ensureHaderBridgeInOpenTabs();

// ============================================================================
// 3. MESSAGE LISTENER (API Router)
// ============================================================================
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg?.action === 'HADER_INJECT_HOMEWORK_PAGE_STATE') {
    (async () => {
      try {
        if (!sender.tab?.id) throw new Error('Madrasati tab is unavailable.');
        const injection = await chrome.scripting.executeScript({
          target: {
            tabId: sender.tab.id,
            frameIds: [Number.isInteger(sender.frameId) ? sender.frameId : 0]
          },
          world: 'MAIN',
          func: (payload) => {
            try {
              let list = null;
              if (typeof listOfAssignments !== 'undefined' && Array.isArray(listOfAssignments)) {
                list = listOfAssignments;
              } else if (Array.isArray(window.listOfAssignments)) {
                list = window.listOfAssignments;
              }
              if (list) {
                const exists = list.some((item) => String(item?.assignmentId) === String(payload.assignmentId));
                if (!exists) {
                  list.push({
                    assignmentId: payload.assignmentId,
                    grade: payload.grade,
                    assignmentName: payload.assignmentName,
                    startDateTime: payload.startDateTime,
                    endDateTime: payload.endDateTime,
                    startDateTimeHijri: payload.startDateTimeHijri,
                    endDateTimeHijri: payload.endDateTimeHijri,
                    isGradeBook: payload.isGradeBook,
                    assignmentIdEnc: payload.assignmentIdEnc,
                    assignmentType: payload.assignmentType,
                    DayCount: payload.dayCount,
                    TimeTableIds: payload.timeTableId
                      ? [{ timeTableId: payload.timeTableId, slot: '', date: '', classroom: '' }]
                      : []
                  });
                }
              }
              if (typeof loadAssignmentsList === 'function') loadAssignmentsList();
              return { success: true, listLength: list?.length ?? null };
            } catch (error) {
              return { success: false, error: error?.message || String(error) };
            }
          },
          args: [msg.payload || {}]
        });
        const result = injection?.[0]?.result || { success: false, error: 'No page-world result.' };
        sendResponse(result);
      } catch (error) {
        sendResponse({ success: false, error: error?.message || String(error) });
      }
    })();
    return true;
  }

  if (msg?.action === 'HADER_BRIDGE_PING') {
    sendResponse({ success: true, bridgeVersion: '2' });
    return true;
  }

  if (msg?.action === 'HADER_GET_SCHEDULE') {
    (async () => {
      try {
        const found = await findMadrasatiTab(false);
        if (!found.tab) {
          sendResponse({
            success: false,
            code: 'madrasati_tab_required',
            error: 'افتح جدول المعلم في مدرستي أولًا، ثم اضغط تحديث الجدول.'
          });
          return;
        }
        const result = await sendToTab(found.tab.id, { action: 'HADER_HARVEST_SCHEDULE' });
        sendResponse(result || { success: false, error: 'لم تُرجع صفحة مدرستي بيانات الجدول.' });
      } catch (error) {
        sendResponse({ success: false, error: error?.message || String(error) });
      }
    })();
    return true;
  }

  if (msg?.action === 'HADER_PREPARE_LESSONS') {
    (async () => {
      let claimedLessons = [];
      try {
        if (!msg.operationId || !msg.ticket) throw new Error('بيانات تفويض التحضير ناقصة.');
        const claim = await callBrowserTicketApi(
          '/extension/preparations/' + encodeURIComponent(msg.operationId) + '/claim',
          { ticket: msg.ticket }
        );
        if (!claim.ok || !claim.data?.success) {
          throw new Error(claim.data?.message || 'تعذر اعتماد عملية التحضير من الخادم.');
        }
        if (claim.data.already_completed) {
          await broadcastToHaderTabs('HADER_PREPARATION_DONE', claim.data);
          sendResponse({ success: true, alreadyCompleted: true, ...claim.data });
          return;
        }

        claimedLessons = Array.isArray(claim.data.lessons) ? claim.data.lessons : [];

        const found = await findMadrasatiTab(false);
        if (!found.tab) {
          throw new Error('افتح جدول المعلم في مدرستي أولًا، ثم أعد طلب التحضير.');
        }
        const accepted = await sendToTab(found.tab.id, {
          action: 'HADER_EXECUTE_BROWSER_PREPARATION',
          operationId: msg.operationId,
          ticket: msg.ticket,
          lessons: claimedLessons
        });
        if (!accepted?.success) throw new Error(accepted?.error || 'لم تقبل صفحة مدرستي عملية التحضير.');
        sendResponse({ success: true, accepted: true, operationId: msg.operationId });
      } catch (error) {
        // A claimed operation reserves the teacher's daily quota. If execution
        // cannot even start (closed tab, stale content script, or another run
        // in progress), finalize every claimed lesson as failed immediately so
        // the reservation is released instead of blocking retries for an hour.
        if (claimedLessons.length && msg.operationId && msg.ticket) {
          try {
            await callBrowserTicketApi(
              '/extension/preparations/' + encodeURIComponent(msg.operationId) + '/complete',
              {
                ticket: msg.ticket,
                results: claimedLessons.map((lesson) => ({
                  preparation_id: lesson.preparation_id,
                  status: 'error',
                  error: error?.message || String(error)
                }))
              }
            );
          } catch (completionError) {
            console.warn('[Hader] Could not release the failed browser preparation reservation.', completionError);
          }
        }
        sendResponse({ success: false, error: error?.message || String(error) });
      }
    })();
    return true;
  }

  if (msg?.action === 'HADER_BROWSER_PREPARATION_PROGRESS') {
    void broadcastToHaderTabs('HADER_PREPARATION_PROGRESS', msg.payload || {});
    sendResponse({ success: true });
    return true;
  }

  if (msg?.action === 'HADER_BROWSER_PREPARATION_RESULT') {
    (async () => {
      try {
        const completion = await callBrowserTicketApi(
          '/extension/preparations/' + encodeURIComponent(msg.operationId) + '/complete',
          { ticket: msg.ticket, results: msg.results || [] }
        );
        const payload = {
          success: completion.ok,
          status: completion.status,
          error: completion.ok ? undefined : 'تعذر تسجيل نتيجة التحضير في الخادم.',
          ...(completion.data || {})
        };
        await broadcastToHaderTabs('HADER_PREPARATION_DONE', payload);
        sendResponse({ success: completion.ok, ...payload });
      } catch (error) {
        const payload = { success: false, operation_id: msg.operationId, error: error?.message || String(error) };
        await broadcastToHaderTabs('HADER_PREPARATION_DONE', payload);
        sendResponse(payload);
      }
    })();
    return true;
  }

  // --- Cookie Sync between Madrasati and Moeen web app ---
  if (msg?.action === 'GET_MADRASATI_SESSION') {
    chrome.tabs.query({ url: ["https://schools.madrasati.sa/*", "https://external.madrasati.sa/*"] }, (tabs) => {
      if (tabs && tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "EXTRACT_COOKIES" }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn("[Background] Failed to send EXTRACT_COOKIES to Madrasati tab:", chrome.runtime.lastError.message);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            sendResponse(response);
          }
        });
      } else {
        sendResponse({ success: false, error: "No active Madrasati tab found." });
      }
    });
    return true; // Keep message channel open
  }

  if (msg?.action === 'PUSH_MADRASATI_SESSION') {
    chrome.tabs.query({ url: ["http://localhost:3000/*", "http://localhost:3001/*", "http://127.0.0.1:3000/*", "https://*.moeen.app/*", "https://moeen.app/*"] }, (tabs) => {
      if (tabs && tabs.length > 0) {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, {
            type: "MOEEN_MADRASATI_COOKIES_FOUND",
            session_cookie: msg.session_cookie,
            madrasati_school_id: msg.madrasati_school_id
          }, () => void chrome.runtime.lastError);
        });
      }
    });
    sendResponse({ success: true });
    return true;
  }

  // Content scripts inherit the page origin for CORS, so authenticated API
  // requests must be proxied through the extension service worker.
  if (msg?.action === 'SYNC_MADRASATI_SESSION_TO_BACKEND') {
    (async () => {
      let cookies = [];
      try {
        if (!msg.token || !/^[a-f0-9]{32}$/i.test(String(msg.schoolId || ''))) {
          throw new Error('Authenticated Hader session and a valid Madrasati school ID are required.');
        }
        const capture = await readRequiredMadrasatiCookies(msg.madrasatiUrl || msg.madrasatiOrigin);
        cookies = capture.cookies;
        const csrfToken = typeof msg.csrfToken === 'string' && msg.csrfToken.trim().length >= 10
          ? msg.csrfToken.trim()
          : null;
        const result = await callHadarApi('/madrasati/connect', {
          method: 'POST',
          headers: { 'X-Hader-Session-Bridge': 'extension-v1' },
          body: JSON.stringify({
            cookies,
            extension_cookie_capture: true,
            recognized_auth_cookie_names: capture.recognizedAuthCookieNames,
            csrf_token: csrfToken,
            madrasati_school_id: msg.schoolId
          })
        }, msg.token, msg.tokenType);
        sendResponse(result);
      } catch (error) {
        sendResponse({
          ok: false,
          status: 0,
          error: error?.message || String(error),
          diagnostics: error?.diagnostics || null
        });
      } finally {
        cookies.length = 0;
      }
    })();
    return true;
  }

  if (msg?.action === 'START_BACKEND_PREPARATION') {
    callHadarApi('/prepare/bulk', {
      method: 'POST',
      body: JSON.stringify(msg.payload || {})
    }, msg.token, msg.tokenType)
      .then(sendResponse)
      .catch((error) => sendResponse({ ok: false, status: 0, error: error?.message || String(error) }));
    return true;
  }

  if (msg?.action === 'GET_BACKEND_PREPARATION_STATUS') {
    callHadarApi('/prepare/' + encodeURIComponent(msg.preparationId) + '/status', {
      method: 'GET'
    }, msg.token, msg.tokenType)
      .then(sendResponse)
      .catch((error) => sendResponse({ ok: false, status: 0, error: error?.message || String(error) }));
    return true;
  }

  if (msg?.action === 'GET_SUBSCRIPTION_CURRENT') {
    fetch(HADAR_API_BASE + '/subscription/current', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `${msg.tokenType || 'Bearer'} ${msg.token || ''}`
      }
    })
      .then(async (response) => {
        let data = null;
        try { data = await response.json(); } catch (_) { }
        sendResponse({ ok: true, status: response.status, data });
      })
      .catch((error) => sendResponse({ ok: false, error: error?.message || String(error) }));
    return true;
  }

  if (msg?.action === 'LOG_LESSON_PREPARATION') {
    const apiBase = (globalThis.Moeen2_CONFIG?.API_BASE_URL || 'https://api.haderedu.com/api').replace(/\/+$/, '');
    fetch(apiBase + '/lesson-preparations/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `${msg.tokenType || 'Bearer'} ${msg.token || ''}`
      },
      body: JSON.stringify(msg.payload || {})
    })
      .then(async (response) => {
        let data = null;
        try { data = await response.json(); } catch (_) { }
        sendResponse({ ok: response.ok, status: response.status, data });
      })
      .catch((error) => sendResponse({ ok: false, error: error?.message || String(error) }));
    return true;
  }

  // --- A. Data Requests from content.js ---
  if (msg?.action === 'GET_LESSON_DATA' || msg?.action === 'GET_TEMPLATES') {
    if (!dbCache.isLoaded) {
      // If not loaded yet, wait for it then respond
      loadDatabases().then(() => handleDataRequest(msg, sendResponse));
    } else {
      // Serve instantly from memory
      handleDataRequest(msg, sendResponse);
    }
    return true; // Keep message channel open for async response
  }

  // --- B. State Management Requests ---
  if (msg?.type === 'START_ACTIVE_TAB') {
    sendResponse({ success: false, disabled: true });
    return true;
  }

  if (msg?.type === 'AUTOMATION_STATUS' && sender.tab?.id) {
    const status = msg.status || 'STOP';
    const running = status === 'START';
    setTabState(sender.tab.id, running)
      .then(() => syncBadgeForStatus(sender.tab.id, status))
      .then(() => sendResponse({ success: true }))
      .catch(() => sendResponse({ success: false }));
    return true;
  }

  if (msg?.type === 'STATUS' && sender.tab?.id) {
    const running = !!msg.running;
    setTabState(sender.tab.id, running)
      .then(() => syncBadge(sender.tab.id, running))
      .then(() => sendResponse({ success: true }))
      .catch(() => sendResponse({ success: false }));
    return true;
  }

  if (msg?.type === 'GET_RUNNING' && sender.tab?.id) {
    getTabState(sender.tab.id).then((running) => sendResponse({ running }));
    return true;
  }
});

// Helper function to serve data
function handleDataRequest(msg, sendResponse) {
  if (msg.action === 'GET_LESSON_DATA') {
    let course = null;
    if (msg.subjectId && msg.subjectId !== "null") {
      course = dbCache.bySubjectId.get(String(msg.subjectId)) || null;
    }
    if (!course && msg.subjectName) {
      const searchName = normalizeSubjectName(msg.subjectName);
      course = dbCache.courses.find(c => {
        let cName = '';
        // groups is an array-of-arrays: groups[chapter][lesson] = {id, info:{name,...}}.
        // Walk through to the first lesson that actually has an info.name.
        if (Array.isArray(c.groups) && c.groups.length > 0) {
          const firstHead = c.groups[0];
          let firstLesson = null;
          if (Array.isArray(firstHead)) {
            firstLesson = firstHead.find(l => l && l.info && l.info.name);
          } else if (firstHead && firstHead.info) {
            firstLesson = firstHead;
          }
          if (firstLesson && firstLesson.info && firstLesson.info.name) {
            cName = normalizeSubjectName(firstLesson.info.name.split('--')[0]);
          }
        }
        if (!cName && c.rawLessonsList && c.rawLessonsList.length > 0 && c.rawLessonsList[0].name) {
          cName = normalizeSubjectName(c.rawLessonsList[0].name.split('--')[0]);
        }
        return cName && (cName.includes(searchName) || searchName.includes(cName));
      });
    }
    sendResponse({ ok: true, data: course || null });
  }
  else if (msg.action === 'GET_TEMPLATES') {
    sendResponse({ ok: true, data: dbCache.templates });
  }
}
