const CONFIG = globalThis.Moeen2_CONFIG || {};
const STORAGE_KEYS = CONFIG.STORAGE_KEYS || {};
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
const DEFAULTS = {
  interval: (CONFIG.AUTOCLICK_DEFAULTS && CONFIG.AUTOCLICK_DEFAULTS.interval) || 1200,
  maxRetries: (CONFIG.AUTOCLICK_DEFAULTS && CONFIG.AUTOCLICK_DEFAULTS.maxRetries) || 20,
  defaultSelector: SETTINGS_DEFAULTS.defaultSelector || ''
};

function cloneDefaultProfiles() {
  return JSON.parse(JSON.stringify(SETTINGS_DEFAULTS.siteProfiles || {}));
}

function checkChromeStorage() {
  if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.sync) {
    throw new Error('chrome.storage غير متاح. تأكد من فتح الصفحة كملحق وليس كملف عادي.');
  }
}

async function load() {
  checkChromeStorage();
  const syncData = await chrome.storage.sync.get([
    STORAGE_KEYS.DEFAULT_INTERVAL || 'defaultInterval',
    STORAGE_KEYS.DEFAULT_MAX_RETRIES || 'defaultMaxRetries',
    STORAGE_KEYS.DEFAULT_SELECTOR || 'defaultSelector',
    STORAGE_KEYS.SITE_PROFILES || 'siteProfiles'
  ]);

  const interval = syncData[STORAGE_KEYS.DEFAULT_INTERVAL || 'defaultInterval'];
  const maxRetries = syncData[STORAGE_KEYS.DEFAULT_MAX_RETRIES || 'defaultMaxRetries'];
  const defaultSelector = syncData[STORAGE_KEYS.DEFAULT_SELECTOR || 'defaultSelector'];
  const profiles = syncData[STORAGE_KEYS.SITE_PROFILES || 'siteProfiles'];

  document.getElementById('interval').value = interval ?? DEFAULTS.interval;
  document.getElementById('maxRetries').value = maxRetries ?? DEFAULTS.maxRetries;
  document.getElementById('defaultSelector').value = defaultSelector || DEFAULTS.defaultSelector;

  const p = profiles && Object.keys(profiles).length > 0 ? profiles : cloneDefaultProfiles();
  document.getElementById('profiles').value = JSON.stringify(p, null, 2);
}

async function save() {
  const status = document.getElementById('status');
  status.textContent = '';
  try {
    checkChromeStorage();
    const interval = parseInt(document.getElementById('interval').value, 10) || DEFAULTS.interval;
    const maxRetries = parseInt(document.getElementById('maxRetries').value, 10) || DEFAULTS.maxRetries;
    const defaultSelector = (document.getElementById('defaultSelector').value || '').trim();
    const profilesText = document.getElementById('profiles').value || '{}';
    const profiles = JSON.parse(profilesText);

    await chrome.storage.sync.set({
      [STORAGE_KEYS.DEFAULT_INTERVAL || 'defaultInterval']: interval,
      [STORAGE_KEYS.DEFAULT_MAX_RETRIES || 'defaultMaxRetries']: maxRetries,
      [STORAGE_KEYS.DEFAULT_SELECTOR || 'defaultSelector']: defaultSelector,
      [STORAGE_KEYS.SITE_PROFILES || 'siteProfiles']: profiles
    });
    status.textContent = 'تم الحفظ';
    setTimeout(() => status.textContent = '', 1500);
  } catch (e) {
    console.error(e);
    status.textContent = 'خطأ في الحفظ: ' + (e?.message || e);
  }
}

async function reset() {
  checkChromeStorage();
  await chrome.storage.sync.set({
    [STORAGE_KEYS.DEFAULT_INTERVAL || 'defaultInterval']: DEFAULTS.interval,
    [STORAGE_KEYS.DEFAULT_MAX_RETRIES || 'defaultMaxRetries']: DEFAULTS.maxRetries,
    [STORAGE_KEYS.DEFAULT_SELECTOR || 'defaultSelector']: DEFAULTS.defaultSelector,
    [STORAGE_KEYS.SITE_PROFILES || 'siteProfiles']: cloneDefaultProfiles()
  });
  await load();
  const status = document.getElementById('status');
  status.textContent = 'تمت إعادة التعيين';
  setTimeout(() => status.textContent = '', 1500);
}

document.getElementById('save').addEventListener('click', save);
document.getElementById('reset').addEventListener('click', reset);

document.addEventListener('DOMContentLoaded', load);
