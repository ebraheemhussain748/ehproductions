// Tiny script for the legal pages: mobile menu and current year.
const t = document.querySelector('.nav__toggle'), l = document.getElementById('nav-links');
t?.addEventListener('click', () => t.setAttribute('aria-expanded', l.classList.toggle('open')));
document.querySelectorAll('.year').forEach(n => { n.textContent = new Date().getFullYear(); });
