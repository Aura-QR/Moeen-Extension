/**
 * popup.js — لوحة تحكم إضافة مُعين-2
 * يدير الإعدادات المحلية الخاصة بالامتداد فقط.
 */

(function () {
    'use strict';

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

    const defaultSelectorInput = document.getElementById('defaultSelector');
    const siteProfilesTextarea = document.getElementById('siteProfiles');
    const jsonErrMsg = document.getElementById('jsonErrMsg');
    const saveBtn = document.getElementById('saveBtn');
    const startWeekBtn = document.getElementById('startWeekBtn');
    const statusEl = document.getElementById('status');
    const LEGACY_LOCAL_KEYS = ['token', 'quota'];
    const LEGACY_SYNC_KEYS = ['apiHost', 'offlineMode'];

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
        [saveBtn, startWeekBtn].forEach((btn) => {
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

            jsonErrMsg.style.display = 'none';
            siteProfilesTextarea.classList.remove('json-error');
            return parsed;
        } catch (error) {
            jsonErrMsg.textContent = `❌ JSON غير صالح: ${error.message}`;
            jsonErrMsg.style.display = 'block';
            siteProfilesTextarea.classList.add('json-error');
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
                STORAGE_KEYS.SITE_PROFILES || 'siteProfiles'
            ],
            (syncResult) => {
                const defaultSelector = syncResult[STORAGE_KEYS.DEFAULT_SELECTOR || 'defaultSelector'];
                const siteProfiles = syncResult[STORAGE_KEYS.SITE_PROFILES || 'siteProfiles'];
                const resolvedDefaultSelector = defaultSelector || SETTINGS_DEFAULTS.defaultSelector || '';
                const resolvedProfiles = siteProfiles && Object.keys(siteProfiles).length > 0
                    ? siteProfiles
                    : cloneDefaultProfiles();

                defaultSelectorInput.value = resolvedDefaultSelector;

                try {
                    siteProfilesTextarea.value = formatProfiles(resolvedProfiles);
                } catch (_) {
                    siteProfilesTextarea.value = formatProfiles(cloneDefaultProfiles());
                }

                if (!defaultSelector || !siteProfiles || Object.keys(siteProfiles).length === 0) {
                    chrome.storage.sync.set({
                        [STORAGE_KEYS.DEFAULT_SELECTOR || 'defaultSelector']: resolvedDefaultSelector,
                        [STORAGE_KEYS.DEFAULT_INTERVAL || 'defaultInterval']: AUTOCLICK_DEFAULTS.interval,
                        [STORAGE_KEYS.DEFAULT_MAX_RETRIES || 'defaultMaxRetries']: AUTOCLICK_DEFAULTS.maxRetries,
                        [STORAGE_KEYS.SITE_PROFILES || 'siteProfiles']: resolvedProfiles
                    }, () => void chrome.runtime.lastError);
                }
            }
        );
    }

    function saveSettings() {
        const defaultSelector = defaultSelectorInput.value.trim();
        const profilesRaw = siteProfilesTextarea.value.trim();
        const parsedProfiles = validateSiteProfiles(profilesRaw);

        if (parsedProfiles === null) {
            showStatus('⚠️ يوجد خطأ في صيغة JSON — راجع الحقل أدناه', 'error');
            siteProfilesTextarea.focus();
            return;
        }

        setLoading(true);
        showStatus('💾 جاري حفظ الإعدادات...', 'info', 0);

        chrome.storage.sync.set({
            [STORAGE_KEYS.DEFAULT_SELECTOR || 'defaultSelector']: defaultSelector,
            [STORAGE_KEYS.DEFAULT_INTERVAL || 'defaultInterval']: AUTOCLICK_DEFAULTS.interval,
            [STORAGE_KEYS.DEFAULT_MAX_RETRIES || 'defaultMaxRetries']: AUTOCLICK_DEFAULTS.maxRetries,
            [STORAGE_KEYS.SITE_PROFILES || 'siteProfiles']: parsedProfiles
        }, () => {
            chrome.storage.local.remove(LEGACY_LOCAL_KEYS, () => void chrome.runtime.lastError);
            chrome.storage.sync.remove(LEGACY_SYNC_KEYS, () => void chrome.runtime.lastError);
            setLoading(false);
            showStatus('✅ تم حفظ الإعدادات المحلية بنجاح', 'success');
        });
    }

    let jsonDebounceTimer = null;
    siteProfilesTextarea.addEventListener('input', () => {
        clearTimeout(jsonDebounceTimer);
        jsonDebounceTimer = setTimeout(() => {
            validateSiteProfiles(siteProfilesTextarea.value);
        }, 600);
    });

    saveBtn.addEventListener('click', saveSettings);
    startWeekBtn.addEventListener('click', () => {
        setLoading(true);
        showStatus('🚀 جاري إرسال أمر البدء للصفحة الحالية...', 'info', 0);
        chrome.runtime.sendMessage({ type: 'START_ACTIVE_TAB' }, (resp) => {
            setLoading(false);
            if (chrome.runtime.lastError || !(resp && resp.success)) {
                showStatus('❌ تعذر بدء التحضير على الصفحة الحالية', 'error');
                return;
            }
            showStatus(
                resp.alreadyStarting
                    ? '⏳ التحضير قيد البدء بالفعل'
                    : '🚀 تم إرسال أمر البدء للصفحة الحالية',
                'success'
            );
        });
    });

    defaultSelectorInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            saveSettings();
        }
    });

    loadSettings();

    window._Moeen2Debug = () => {
        chrome.storage.local.get(null, (data) => console.log('[local]', data));
        chrome.storage.sync.get(null, (data) => console.log('[sync]', data));
    };
})();
