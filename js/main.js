/* ── HEADER SCROLL ── */
const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

/* ── MOBILE MENU ── */
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

/* ── LANGUAGE SWITCHER ── */
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll(`.lang-btn[data-lang="${btn.dataset.lang}"]`).forEach(b => b.classList.add('active'));
  });
});

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.faq-item').classList.toggle('open');
  });
});

/* ── INTEREST TOGGLES ── */
document.querySelectorAll('.interest-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.interest-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ── QUOTE FORM SUBMISSION ── */
const quoteForm = document.getElementById('quoteForm');
const quoteFormWrap = document.getElementById('quoteFormWrap');
const quoteSuccess = document.getElementById('quoteSuccess');

if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    quoteFormWrap.style.display = 'none';
    quoteSuccess.style.display = 'block';
    const formSection = document.getElementById('formSection');
    if (formSection) {
      window.scrollTo({ top: formSection.offsetTop - 100, behavior: 'smooth' });
    }
  });
}

/* ── CALL MODAL ── */
const callModal = document.getElementById('callModal');
const callForm = document.getElementById('callForm');
const callFormInner = document.getElementById('callFormInner');
const callSuccess = document.getElementById('callSuccess');

function openCallModal() {
  if (callModal) {
    callModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCallModal() {
  if (callModal) {
    callModal.classList.remove('open');
    document.body.style.overflow = '';
    // Reset form after close
    setTimeout(() => {
      if (callFormInner) callFormInner.style.display = '';
      if (callSuccess) callSuccess.style.display = 'none';
      if (callForm) callForm.reset();
    }, 300);
  }
}

if (callModal) {
  callModal.addEventListener('click', (e) => {
    if (e.target === callModal) closeCallModal();
  });
}

if (callForm) {
  callForm.addEventListener('submit', (e) => {
    e.preventDefault();
    callFormInner.style.display = 'none';
    callSuccess.style.display = 'block';
  });
}

/* ── SCROLL TO FORM ── */
function scrollToForm() {
  const formSection = document.getElementById('formSection');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ── ACTIVE NAV LINK ── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html')) {
    link.classList.add('active');
  }
});
