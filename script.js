const envelopeButton = document.querySelector('#envelopeButton');
const letterMessage = document.querySelector('#letterMessage');
const letterPrompt = document.querySelector('#letterPrompt');
const secretButton = document.querySelector('#secretButton');
const secretButtonLabel = document.querySelector('#secretButtonLabel');
const secretMessage = document.querySelector('#secretMessage');
const replayButton = document.querySelector('#replayButton');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
setDisclosure(envelopeButton, letterMessage, false);
setDisclosure(secretButton, secretMessage, false);
secretButton.hidden = false;
document.documentElement.classList.add('js-ready');

function setDisclosure(button, panel, open) {
  button.setAttribute('aria-expanded', String(open));
  panel.setAttribute('aria-hidden', String(!open));
  panel.inert = !open;
  panel.classList.toggle('is-open', open);
}

envelopeButton.addEventListener('click', () => {
  const open = envelopeButton.getAttribute('aria-expanded') !== 'true';
  envelopeButton.classList.toggle('is-open', open);
  setDisclosure(envelopeButton, letterMessage, open);
  letterPrompt.classList.toggle('is-hidden', open);
  envelopeButton.setAttribute('aria-label', open ? 'Đóng lá thư dành cho Huyền' : 'Mở lá thư dành cho Huyền');
});

function setSecretOpen(open) {
  setDisclosure(secretButton, secretMessage, open);
  secretButtonLabel.textContent = open ? 'Cất món quà' : 'Mở món quà bí mật';
}
secretButton.addEventListener('click', () => setSecretOpen(secretButton.getAttribute('aria-expanded') !== 'true'));

replayButton.addEventListener('click', () => {
  if (secretButton.getAttribute('aria-expanded') === 'true') setSecretOpen(false);
  envelopeButton.classList.remove('is-open');
  envelopeButton.setAttribute('aria-label', 'Mở lá thư dành cho Huyền');
  setDisclosure(envelopeButton, letterMessage, false);
  letterPrompt.classList.remove('is-hidden');
  envelopeButton.focus({ preventScroll:true });
  window.scrollTo({ top:0, behavior:reduceMotion.matches ? 'auto' : 'smooth' });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); currentObserver.unobserve(entry.target); } });
  }, { threshold:.14, rootMargin:'0px 0px -35px 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else { revealItems.forEach((item) => item.classList.add('is-visible')); }

const pointerFine = window.matchMedia('(hover: hover) and (pointer: fine)');
if (pointerFine.matches && !reduceMotion.matches) {
  let frame = 0;
  window.addEventListener('pointermove', (event) => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
      frame = 0;
    });
  }, { passive:true });
}
