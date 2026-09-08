/* ── HEADER SCROLL ── */
var header = document.querySelector('.header');
var hamburger = document.querySelector('.hamburger');
var mobileMenu = document.querySelector('.mobile-menu');

window.addEventListener('scroll', function() {
  if (window.scrollY > 80) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

/* ── MOBILE MENU ── */
if (hamburger) {
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-question').forEach(function(btn) {
  btn.addEventListener('click', function() {
    btn.closest('.faq-item').classList.toggle('open');
  });
});

/* ── INTEREST TOGGLES (multi-select) ── */
document.querySelectorAll('.interest-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    btn.classList.toggle('active');
  });
});

/* ── CALL MODAL ── */
function openCallModal() {
  var m = document.getElementById('callModal');
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeCallModal() {
  var m = document.getElementById('callModal');
  if (m) {
    m.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function() {
      var inner = document.getElementById('callFormInner');
      var success = document.getElementById('callSuccess');
      var form = document.getElementById('callForm');
      if (inner) inner.style.display = '';
      if (success) success.style.display = 'none';
      if (form) form.reset();
    }, 300);
  }
}
var callModal = document.getElementById('callModal');
if (callModal) {
  callModal.addEventListener('click', function(e) {
    if (e.target === callModal) closeCallModal();
  });
}

/* ── SCROLL TO FORM ── */
function scrollToForm() {
  var f = document.getElementById('formSection');
  if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── ACTIVE NAV LINK ── */
var page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link, .mobile-menu a:not(.btn)').forEach(function(link) {
  if (link.getAttribute('href') === page) link.classList.add('active');
});
