const envelopeButton = document.querySelector('#envelopeButton');
const letterOpenButtons = document.querySelectorAll('[data-open-letter]');
const letterDialog = document.querySelector('#letterDialog');
const letterContent = document.querySelector('#letterContent');
const letterTitle = document.querySelector('#letter-title');
const secretButton = document.querySelector('#secretButton');
const secretButtonLabel = document.querySelector('#secretButtonLabel');
const secretMessage = document.querySelector('#secretMessage');
const replayButton = document.querySelector('#replayButton');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
// Keep one copy of the letter readable in the page when JavaScript is unavailable.
document.querySelector('#letterDialogContent').append(letterContent);
letterContent.classList.remove('letter-fallback', 'section-wrap');
letterTitle.setAttribute('autofocus', '');
setDisclosure(secretButton, secretMessage, false);
secretButton.hidden = false;
document.documentElement.classList.add('js-ready');

function setDisclosure(button, panel, open) {
  button.setAttribute('aria-expanded', String(open));
  panel.setAttribute('aria-hidden', String(!open));
  panel.inert = !open;
  panel.classList.toggle('is-open', open);
}

let letterOpener = envelopeButton;
let letterScrollPosition = { top:0, left:0 };

function openLetter(opener) {
  if (letterDialog.open) return;
  letterOpener = opener;
  letterScrollPosition = { top:window.scrollY, left:window.scrollX };
  document.documentElement.classList.add('letter-open');
  letterDialog.showModal();
  letterDialog.scrollTop = 0;
  envelopeButton.classList.add('is-open');
  letterOpenButtons.forEach((button) => button.setAttribute('aria-expanded', 'true'));
  letterTitle.focus({ preventScroll:true });
  window.scrollTo({ ...letterScrollPosition, behavior:'instant' });
}

letterOpenButtons.forEach((button) => button.addEventListener('click', () => openLetter(button)));
document.querySelector('[data-close-letter]').addEventListener('click', () => letterDialog.close());
letterDialog.addEventListener('close', () => {
  document.documentElement.classList.remove('letter-open');
  envelopeButton.classList.remove('is-open');
  letterOpenButtons.forEach((button) => button.setAttribute('aria-expanded', 'false'));
  letterOpener.focus({ preventScroll:true });
  window.scrollTo({ ...letterScrollPosition, behavior:'instant' });
});
letterDialog.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const controls = [...letterDialog.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]')];
  const first = controls[0];
  const last = controls[controls.length - 1];
  const active = document.activeElement;
  if (active === letterTitle || (!event.shiftKey && active === last) || (event.shiftKey && active === first)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  }
});

// Close only when both the press and the release happen on the backdrop.
function outsideLetter(event) {
  const bounds = letterDialog.getBoundingClientRect();
  return event.clientX < bounds.left || event.clientX > bounds.right ||
    event.clientY < bounds.top || event.clientY > bounds.bottom;
}
let pressedBackdrop = false;
letterDialog.addEventListener('pointerdown', (event) => {
  pressedBackdrop = event.target === letterDialog && outsideLetter(event);
});
letterDialog.addEventListener('click', (event) => {
  if (pressedBackdrop && event.target === letterDialog && outsideLetter(event)) letterDialog.close();
  pressedBackdrop = false;
});

function setSecretOpen(open) {
  setDisclosure(secretButton, secretMessage, open);
  secretButtonLabel.textContent = open ? 'Đóng bí mật' : 'Khám phá bí mật';
}
secretButton.addEventListener('click', () => setSecretOpen(secretButton.getAttribute('aria-expanded') !== 'true'));

replayButton.addEventListener('click', () => openLetter(replayButton));

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
