(function () {
  'use strict';

  var storageKey = 'william-xu-theme';
  var root = document.documentElement;
  var system = window.matchMedia('(prefers-color-scheme: dark)');
  var preference = null;
  var button;

  try {
    var saved = window.localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch (error) {
    // System preference and the switch still work when storage is unavailable.
  }

  function applyTheme() {
    var theme = preference || (system.matches ? 'dark' : 'light');
    root.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]').setAttribute(
      'content', theme === 'dark' ? '#1b2025' : '#ffffff'
    );
    if (button) button.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  // Run before the stylesheet is painted to avoid a flash of the wrong theme.
  applyTheme();

  document.addEventListener('DOMContentLoaded', function () {
    button = document.querySelector('.theme-toggle');
    if (!button) return;
    button.hidden = false;
    applyTheme();
    button.addEventListener('click', function () {
      preference = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(storageKey, preference);
      } catch (error) {
        // Keep the choice for this page even if it cannot be saved.
      }
      applyTheme();
    });
  });

  function followSystem() {
    if (!preference) applyTheme();
  }
  if (system.addEventListener) system.addEventListener('change', followSystem);
  else system.addListener(followSystem);

  window.addEventListener('storage', function (event) {
    if (event.key !== storageKey && event.key !== null) return;
    preference = event.newValue === 'dark' || event.newValue === 'light' ? event.newValue : null;
    applyTheme();
  });
}());
