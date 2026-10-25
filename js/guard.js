// Stops other websites from showing our pages inside a hidden frame (clickjacking).
// GitHub Pages cannot send the X-Frame-Options header, so this is done in the page.
if (window.top !== window.self) {
  document.documentElement.style.visibility = 'hidden';
  try { window.top.location.replace(window.location.href); } catch { /* sandboxed frame: stay hidden */ }
}
