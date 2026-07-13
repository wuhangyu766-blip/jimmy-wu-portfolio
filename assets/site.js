const supportedLanguages = new Set(['zh', 'en']);
const supportedThemes = new Set(['light', 'dark']);
const root = document.documentElement;
const languageToggle = document.querySelector('[data-language-toggle]');
const themeToggle = document.querySelector('[data-theme-toggle]');

function getStoredPreference(key, supportedValues, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return supportedValues.has(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function savePreference(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Preference storage can be unavailable in private or restricted contexts.
  }
}

function renderLanguage(language) {
  const activeLanguage = supportedLanguages.has(language) ? language : 'zh';
  root.lang = activeLanguage === 'en' ? 'en' : 'zh-CN';
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = element.dataset[activeLanguage];
    if (value) element.textContent = value;
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    const value = element.dataset[activeLanguage];
    if (value) element.setAttribute('aria-label', value);
  });
  document.title = activeLanguage === 'en' ? 'Jimmy Wu | Investment Research and Quantitative Analysis' : 'Jimmy Wu | 金融研究与量化分析';
  languageToggle.textContent = activeLanguage === 'en' ? '中文' : 'EN';
  languageToggle.setAttribute('aria-label', activeLanguage === 'en' ? '切换至中文' : 'Switch to English');
  return activeLanguage;
}

function renderTheme(theme) {
  const activeTheme = supportedThemes.has(theme) ? theme : 'light';
  root.dataset.theme = activeTheme;
  themeToggle.setAttribute('aria-pressed', String(activeTheme === 'dark'));
  themeToggle.setAttribute('aria-label', activeTheme === 'dark' ? '切换至浅色模式' : '切换至深色模式');
  return activeTheme;
}

let activeLanguage = renderLanguage(getStoredPreference('portfolio-language', supportedLanguages, 'zh'));
let activeTheme = renderTheme(getStoredPreference('portfolio-theme', supportedThemes, 'light'));

languageToggle.addEventListener('click', () => {
  activeLanguage = renderLanguage(activeLanguage === 'zh' ? 'en' : 'zh');
  savePreference('portfolio-language', activeLanguage);
});

themeToggle.addEventListener('click', () => {
  activeTheme = renderTheme(activeTheme === 'light' ? 'dark' : 'light');
  savePreference('portfolio-theme', activeTheme);
});

const year = document.querySelector('[data-current-year]');
if (year) year.textContent = new Date().getFullYear();
