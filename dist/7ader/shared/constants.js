(function initMoeen2Config(globalScope) {
  if (!globalScope) return;

  globalScope.Moeen2_CONFIG = Object.freeze({
    APP_NAME: 'حضر',
    VERSION: '10.1.7',
    API_BASE_URL: 'https://api.haderedu.com/api',
    API_ORIGIN: 'https://api.haderedu.com',
    AUTH_SESSION_KEY: 'HADAR_AUTH',
    STORAGE_KEYS: Object.freeze({
      AUTOMATION_STATE: 'automationState',
      DEFAULT_SELECTOR: 'defaultSelector',
      DEFAULT_INTERVAL: 'defaultInterval',
      DEFAULT_MAX_RETRIES: 'defaultMaxRetries',
      SITE_PROFILES: 'siteProfiles',
      DASHBOARD_SELECTIONS: 'dashboardSelections'
    }),
    AUTOCLICK_DEFAULTS: Object.freeze({
      interval: 1200,
      maxRetries: 20
    }),
    SETTINGS_DEFAULTS: Object.freeze({
      defaultSelector: '.submit-form-btn, #sub, a[href="#finish"]',
      siteProfiles: Object.freeze({
        'schools.madrasati.sa': Object.freeze({
          selector: '.submit-form-btn, #sub, a[href="#finish"]',
          interval: 1000,
          maxRetries: 30
        }),
        'external.madrasati.sa': Object.freeze({
          selector: '.submit-form-btn, #sub, a[href="#finish"]',
          interval: 1000,
          maxRetries: 30
        })
      })
    })
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
