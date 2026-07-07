/**
 * popup.js — لوحة تحكم امتداد حضر
 * يدير تسجيل الدخول والإعدادات المحلية الخاصة بالامتداد.
 */

(function () {
    'use strict';

    // ── Config ────────────────────────────────────────────────────────────
    const CONFIG = globalThis.Moeen2_CONFIG || {};
    const STORAGE_KEYS = CONFIG.STORAGE_KEYS || {};
    const AUTOCLICK_DEFAULTS = CONFIG.AUTOCLICK_DEFAULTS || { interval: 1200, maxRetries: 20 };
    const SETTINGS_DEFAULTS = CONFIG.SETTINGS_DEFAULTS || {
        defaultSelector: '.submit-form-btn, #sub, a[href="#finish"]',
        siteProfiles: {
            'schools.madrasati.sa': {
                selector: '.submit-form-btn, #sub, a[href="#finish"]',
                interval: 1000,
                maxRetries: 30
            },
            'external.madrasati.sa': {
                selector: '.submit-form-btn, #sub, a[href="#finish"]',
                interval: 1000,
                maxRetries: 30
            }
        }
    };

    const AUTH_SESSION_KEY = CONFIG.AUTH_SESSION_KEY || 'HADAR_AUTH';
    const API_BASE_URL = CONFIG.API_BASE_URL || 'https://librechat-assiut-moeen-backend.tfgpna.easypanel.host/api';
    const API_ORIGIN = CONFIG.API_ORIGIN || API_BASE_URL.replace(/\/api\/?$/, '');
    const REQUEST_TIMEOUT_MS = 15000;

    const LEGACY_LOCAL_KEYS = ['token', 'quota'];
    const LEGACY_SYNC_KEYS = ['apiHost', 'offlineMode'];

    // ── DOM refs ─────────────────────────────────────────────────────────────
    // Settings elements (inside dashboard screen)
    const defaultSelectorInput = document.getElementById('defaultSelector');
    const siteProfilesTextarea  = document.getElementById('siteProfiles');
    const jsonErrMsg            = document.getElementById('jsonErrMsg');
    const saveBtn               = document.getElementById('saveBtn');
    const statusEl              = document.getElementById('status');

    // Auth / login elements
    const loginEmailEl     = document.getElementById('loginEmail');
    const loginPasswordEl  = document.getElementById('loginPassword');
    const loginErrorEl     = document.getElementById('loginError');
    const loginBtn         = document.getElementById('loginBtn');
    const passwordToggle   = document.getElementById('passwordToggle');
    const backendStatusEl  = document.getElementById('backendStatus');
    const logoutBtn        = document.getElementById('logoutBtn');

    // User info display
    const userNameDisplay  = document.getElementById('userNameDisplay');
    const userEmailDisplay = document.getElementById('userEmailDisplay');

    // ── Screen management ────────────────────────────────────────────────────
    function showScreen(name) {
        document.getElementById('screen-login').style.display     = name === 'login'     ? 'block' : 'none';
        document.getElementById('screen-dashboard').style.display = name === 'dashboard' ? 'block' : 'none';
    }

    async function apiFetch(path, options = {}) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        try {
            return await fetch(`${API_BASE_URL}${path}`, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    ...(options.headers || {})
                }
            });
        } finally {
            clearTimeout(timer);
        }
    }

    function normalizeAuthResponse(data) {
        const token = data && (data.token || data.accessToken || data.access_token);
        const tokenType = (data && (data.tokenType || data.token_type)) || 'Bearer';
        const user = data && (data.user || data.data?.user || data.profile);
        return { token, tokenType, user };
    }

    function setBackendStatus(state, text) {
        if (!backendStatusEl) return;
        backendStatusEl.className = `backend-status ${state}`;
        backendStatusEl.textContent = text;
    }

    // ── Auth storage helpers ─────────────────────────────────────────────────
    function getAuthSession() {
        return new Promise(r => chrome.storage.local.get(AUTH_SESSION_KEY, d => r(d[AUTH_SESSION_KEY] || null)));
    }

    function saveAuthSession(data) {
        return new Promise(r => chrome.storage.local.set({ [AUTH_SESSION_KEY]: data }, r));
    }

    function clearAuthSession() {
        return new Promise(r => chrome.storage.local.remove(AUTH_SESSION_KEY, r));
    }

    // ── Login error helper ───────────────────────────────────────────────────
    function showLoginError(msg) {
        loginErrorEl.textContent = msg;
        loginErrorEl.style.display = 'block';
    }

    function clearLoginError() {
        loginErrorEl.textContent = '';
        loginErrorEl.style.display = 'none';
    }

    function setLoginLoading(isLoading) {
        loginBtn.disabled = isLoading;
        loginBtn.classList.toggle('loading', isLoading);
        loginBtn.textContent = isLoading ? 'جاري التحقق' : 'تسجيل الدخول';
    }

    // ── Populate user display ────────────────────────────────────────────────
    function populateUserDisplay(session) {
        if (!session || !session.user) return;
        if (userNameDisplay)  userNameDisplay.textContent  = session.user.name  || '—';
        if (userEmailDisplay) userEmailDisplay.textContent = session.user.email || '—';
    }

    // ── Login handler ────────────────────────────────────────────────────────
    async function handleLogin() {
        clearLoginError();

        const email    = loginEmailEl.value.trim();
        const password = loginPasswordEl.value;

        if (!email || !password) {
            showLoginError('⚠️ يرجى إدخال البريد الإلكتروني وكلمة المرور');
            return;
        }

        setLoginLoading(true);

        try {
            const resp = await apiFetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            let data;
            try { data = await resp.json(); } catch (_) { data = {}; }

            if (!resp.ok) {
                const errMsg = data.message || data.error || 'فشل تسجيل الدخول. تحقق من بياناتك.';
                showLoginError(`❌ ${errMsg}`);
                return;
            }

            const auth = normalizeAuthResponse(data);
            if (!auth.token || !auth.user) {
                showLoginError('❌ استجابة غير متوقعة من الخادم. حاول مجدداً.');
                return;
            }

            const session = {
                isAuthenticated: true,
                token: auth.token,
                tokenType: auth.tokenType,
                user: {
                    id:    auth.user.id,
                    name:  auth.user.name || auth.user.fullName || auth.user.email,
                    email: auth.user.email,
                    role:  auth.user.role
                },
                sessionCreatedAt: Date.now()
            };

            await saveAuthSession(session);
            populateUserDisplay(session);
            loginPasswordEl.value = '';
            loginEmailEl.value    = '';
            showScreen('dashboard');
            loadSettings();

        } catch (err) {
            const message = err && err.name === 'AbortError'
                ? '❌ انتهت مهلة الاتصال بالخادم. حاول مرة أخرى.'
                : '❌ تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.';
            showLoginError(message);
            console.error('[Moeen popup] Login error:', err);
        } finally {
            setLoginLoading(false);
        }
    }

    // ── Logout handler ───────────────────────────────────────────────────────
    async function handleLogout() {
        // Fire-and-forget logout call
        try {
            const session = await getAuthSession();
            if (session && session.token) {
                apiFetch('/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${session.tokenType || 'Bearer'} ${session.token}`
                    }
                }).catch(() => { /* ignore */ });
            }
        } catch (_) { /* ignore */ }

        await clearAuthSession();
        showScreen('login');
    }

    // ── Token validation ─────────────────────────────────────────────────────
    async function validateToken(session) {
        try {
            const resp = await apiFetch('/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `${session.tokenType || 'Bearer'} ${session.token}`
                }
            });
            if (resp.status === 401) {
                await clearAuthSession();
                return false;
            }
            // On success, optionally refresh user data
            if (resp.ok) {
                try {
                    const data = await resp.json();
                    const user = data && (data.user || data.data?.user || data);
                    if (user && (user.name || user.fullName || user.email)) {
                        // Update stored user info if server returns fresh data
                        const updated = {
                            ...session,
                            user: {
                                id:    user.id    || session.user.id,
                                name:  user.name  || user.fullName || session.user.name,
                                email: user.email || session.user.email,
                                role:  user.role  || session.user.role
                            }
                        };
                        await saveAuthSession(updated);
                        return updated;
                    }
                } catch (_) { /* use existing session data */ }
            }
            return session;
        } catch (_) {
            // Network error: allow session to continue (offline tolerance)
            return session;
        }
    }

    // ── Startup auth check ───────────────────────────────────────────────────
    async function initAuth() {
        checkBackendHealth();
        const session = await getAuthSession();

        if (session && session.isAuthenticated && session.token) {
            // Validate with the server
            const validSession = await validateToken(session);
            if (validSession) {
                populateUserDisplay(validSession === true ? session : validSession);
                showScreen('dashboard');
                loadSettings();
                return;
            }
        }

        showScreen('login');
    }

    async function checkBackendHealth() {
        setBackendStatus('checking', 'جاري فحص الخادم');
        try {
            const resp = await fetch(API_ORIGIN, { method: 'GET', cache: 'no-store' });
            if (resp.ok) {
                setBackendStatus('online', 'الخادم متصل');
            } else {
                setBackendStatus('warning', 'الخادم يستجيب بصعوبة');
            }
        } catch (_) {
            setBackendStatus('offline', 'الخادم غير متاح');
        }
    }

    // ── Password toggle ──────────────────────────────────────────────────────
    if (passwordToggle) {
        passwordToggle.addEventListener('click', () => {
            if (loginPasswordEl.type === 'password') {
                loginPasswordEl.type = 'text';
                passwordToggle.textContent = '🙈';
                passwordToggle.title = 'إخفاء كلمة المرور';
            } else {
                loginPasswordEl.type = 'password';
                passwordToggle.textContent = '👁️';
                passwordToggle.title = 'إظهار كلمة المرور';
            }
        });
    }

    // ── Auth event listeners ─────────────────────────────────────────────────
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }

    if (loginPasswordEl) {
        loginPasswordEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }

    if (loginEmailEl) {
        loginEmailEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') loginPasswordEl && loginPasswordEl.focus();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // ════════════════════════════════════════════════════════════════════════
    // SETTINGS LOGIC (unchanged from original)
    // ════════════════════════════════════════════════════════════════════════

    function showStatus(message, type = 'info', duration = 3500) {
        statusEl.textContent = message;
        statusEl.className = `status ${type}`;
        if (duration > 0) {
            setTimeout(() => {
                statusEl.className = 'status';
            }, duration);
        }
    }

    function setLoading(isLoading) {
        [saveBtn].forEach((btn) => {
            if (!btn) return;
            btn.disabled = isLoading;
            btn.classList.toggle('loading', isLoading);
        });
    }

    function validateSiteProfiles(raw) {
        const text = raw.trim();
        if (!text) return {};

        try {
            const parsed = JSON.parse(text);

            for (const [host, cfg] of Object.entries(parsed)) {
                if (typeof cfg !== 'object' || cfg === null) {
                    throw new Error(`قيمة "${host}" يجب أن تكون كائناً`);
                }
                if (!cfg.selector || typeof cfg.selector !== 'string') {
                    throw new Error(`"${host}" يفتقر إلى حقل selector صالح`);
                }
                if (cfg.interval !== undefined && typeof cfg.interval !== 'number') {
                    throw new Error(`"${host}".interval يجب أن يكون رقماً`);
                }
                if (cfg.maxRetries !== undefined && typeof cfg.maxRetries !== 'number') {
                    throw new Error(`"${host}".maxRetries يجب أن يكون رقماً`);
                }
            }

            if (jsonErrMsg) jsonErrMsg.style.display = 'none';
            if (siteProfilesTextarea) siteProfilesTextarea.classList.remove('json-error');
            return parsed;
        } catch (error) {
            if (jsonErrMsg) {
                jsonErrMsg.textContent = `❌ JSON غير صالح: ${error.message}`;
                jsonErrMsg.style.display = 'block';
            }
            if (siteProfilesTextarea) siteProfilesTextarea.classList.add('json-error');
            return null;
        }
    }

    function cloneDefaultProfiles() {
        return JSON.parse(JSON.stringify(SETTINGS_DEFAULTS.siteProfiles || {}));
    }

    function formatProfiles(profiles) {
        return JSON.stringify(profiles || {}, null, 2);
    }

    function loadSettings() {
        chrome.storage.local.remove(LEGACY_LOCAL_KEYS, () => void chrome.runtime.lastError);
        chrome.storage.sync.remove(LEGACY_SYNC_KEYS, () => void chrome.runtime.lastError);

        chrome.storage.sync.get(
            [
                STORAGE_KEYS.DEFAULT_SELECTOR || 'defaultSelector',
                STORAGE_KEYS.SITE_PROFILES    || 'siteProfiles'
            ],
            (syncResult) => {
                const defaultSelector   = syncResult[STORAGE_KEYS.DEFAULT_SELECTOR || 'defaultSelector'];
                const siteProfiles      = syncResult[STORAGE_KEYS.SITE_PROFILES    || 'siteProfiles'];
                const resolvedDefaultSelector = defaultSelector || SETTINGS_DEFAULTS.defaultSelector || '';
                const resolvedProfiles  = siteProfiles && Object.keys(siteProfiles).length > 0
                    ? siteProfiles
                    : cloneDefaultProfiles();

                if (defaultSelectorInput) defaultSelectorInput.value = resolvedDefaultSelector;

                try {
                    if (siteProfilesTextarea) siteProfilesTextarea.value = formatProfiles(resolvedProfiles);
                } catch (_) {
                    if (siteProfilesTextarea) siteProfilesTextarea.value = formatProfiles(cloneDefaultProfiles());
                }

                if (!defaultSelector || !siteProfiles || Object.keys(siteProfiles).length === 0) {
                    chrome.storage.sync.set({
                        [STORAGE_KEYS.DEFAULT_SELECTOR  || 'defaultSelector']:  resolvedDefaultSelector,
                        [STORAGE_KEYS.DEFAULT_INTERVAL  || 'defaultInterval']:  AUTOCLICK_DEFAULTS.interval,
                        [STORAGE_KEYS.DEFAULT_MAX_RETRIES || 'defaultMaxRetries']: AUTOCLICK_DEFAULTS.maxRetries,
                        [STORAGE_KEYS.SITE_PROFILES     || 'siteProfiles']:     resolvedProfiles
                    }, () => void chrome.runtime.lastError);
                }
            }
        );
    }

    function saveSettings() {
        if (!defaultSelectorInput || !siteProfilesTextarea) return;

        const defaultSelector = defaultSelectorInput.value.trim();
        const profilesRaw     = siteProfilesTextarea.value.trim();
        const parsedProfiles  = validateSiteProfiles(profilesRaw);

        if (parsedProfiles === null) {
            showStatus('⚠️ يوجد خطأ في صيغة JSON — راجع الحقل أدناه', 'error');
            siteProfilesTextarea.focus();
            return;
        }

        setLoading(true);
        showStatus('💾 جاري حفظ الإعدادات...', 'info', 0);

        chrome.storage.sync.set({
            [STORAGE_KEYS.DEFAULT_SELECTOR  || 'defaultSelector']:  defaultSelector,
            [STORAGE_KEYS.DEFAULT_INTERVAL  || 'defaultInterval']:  AUTOCLICK_DEFAULTS.interval,
            [STORAGE_KEYS.DEFAULT_MAX_RETRIES || 'defaultMaxRetries']: AUTOCLICK_DEFAULTS.maxRetries,
            [STORAGE_KEYS.SITE_PROFILES     || 'siteProfiles']:     parsedProfiles
        }, () => {
            chrome.storage.local.remove(LEGACY_LOCAL_KEYS, () => void chrome.runtime.lastError);
            chrome.storage.sync.remove(LEGACY_SYNC_KEYS,  () => void chrome.runtime.lastError);
            setLoading(false);
            showStatus('✅ تم حفظ الإعدادات المحلية بنجاح', 'success');
        });
    }

    // ── Settings event listeners ─────────────────────────────────────────────
    let jsonDebounceTimer = null;
    if (siteProfilesTextarea) {
        siteProfilesTextarea.addEventListener('input', () => {
            clearTimeout(jsonDebounceTimer);
            jsonDebounceTimer = setTimeout(() => {
                validateSiteProfiles(siteProfilesTextarea.value);
            }, 600);
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }

    if (defaultSelectorInput) {
        defaultSelectorInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') saveSettings();
        });
    }

    // ── Debug helper ─────────────────────────────────────────────────────────
    window._Moeen2Debug = () => {
        chrome.storage.local.get(null, (data) => console.log('[local]', data));
        chrome.storage.sync.get(null,  (data) => console.log('[sync]',  data));
    };

    // ── Boot ─────────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => { /* already at DOMContentLoaded via defer */ });
    initAuth();

})();
