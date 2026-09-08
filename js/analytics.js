/**
 * Private Chocolate — Analytics & Consent
 * ────────────────────────────────────────
 * Single file: Consent Mode v2 → gtag.js → GA4 + Google Ads + reCAPTCHA v3
 *
 * CONFIGURATION — change these when you have real IDs:
 */
var PC_CONFIG = {
  GA4_ID:             'G-XXXXXXXXXX',
  GADS_ID:            'AW-XXXXXXXXXX',
  GADS_CONV_LABEL:    'CONVERSION_LABEL',
  RECAPTCHA_SITEKEY:  'RECAPTCHA_SITE_KEY',
  SHEETS_URL:         'GOOGLE_APPS_SCRIPT_URL',
};

/* ═══════════════════════════════════════════
   1. CONSENT MODE v2 — runs BEFORE gtag loads
   ═══════════════════════════════════════════ */
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
  analytics_storage:    'denied',
  ad_storage:           'denied',
  ad_user_data:         'denied',
  ad_personalization:   'denied',
  wait_for_update:      500
});

// Restore saved consent
(function(){
  var saved = null;
  try { saved = localStorage.getItem('pc_consent'); } catch(e){}
  if (saved === 'granted') _grantConsent();
})();

function _grantConsent() {
  gtag('consent', 'update', {
    analytics_storage:  'granted',
    ad_storage:         'granted',
    ad_user_data:       'granted',
    ad_personalization: 'granted'
  });
  _loadRecaptcha();
}

function _denyConsent() {
  gtag('consent', 'update', {
    analytics_storage:  'denied',
    ad_storage:         'denied',
    ad_user_data:       'denied',
    ad_personalization: 'denied'
  });
}

/* ═══════════════════════════════════════════
   2. LOAD GTAG.JS — single tag, async
   ═══════════════════════════════════════════ */
(function(){
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + PC_CONFIG.GA4_ID;
  document.head.appendChild(s);
})();

gtag('js', new Date());
gtag('config', PC_CONFIG.GA4_ID, { send_page_view: true });
gtag('config', PC_CONFIG.GADS_ID);

/* ═══════════════════════════════════════════
   3. reCAPTCHA v3 — loads ONLY after consent
   ═══════════════════════════════════════════ */
var _recaptchaReady = false;

function _loadRecaptcha() {
  if (_recaptchaReady) return;
  if (PC_CONFIG.RECAPTCHA_SITEKEY === 'RECAPTCHA_SITE_KEY') return;
  // Only load on pages with forms
  if (!document.getElementById('quoteForm') && !document.getElementById('callForm')) return;

  var s = document.createElement('script');
  s.src = 'https://www.google.com/recaptcha/api.js?render=' + PC_CONFIG.RECAPTCHA_SITEKEY;
  s.async = true;
  s.onload = function(){ _recaptchaReady = true; };
  document.head.appendChild(s);
}

function _getRecaptchaToken(action, callback) {
  if (!_recaptchaReady || typeof grecaptcha === 'undefined') {
    callback(''); // No token — form still works, server decides
    return;
  }
  grecaptcha.ready(function(){
    grecaptcha.execute(PC_CONFIG.RECAPTCHA_SITEKEY, { action: action })
      .then(function(token){ callback(token); })
      .catch(function(){ callback(''); });
  });
}

/* ═══════════════════════════════════════════
   4. COOKIE CONSENT BANNER
   ═══════════════════════════════════════════ */
function _buildBanner() {
  try { if (localStorage.getItem('pc_consent')) return; } catch(e){}

  var isGR = document.documentElement.lang === 'el';
  var banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.className = 'cookie-banner';
  banner.innerHTML =
    '<div class="cookie-inner">' +
      '<p class="cookie-text">' +
        (isGR
          ? 'Χρησιμοποιούμε cookies για analytics και διαφημίσεις. '
          : 'We use cookies for analytics and advertising. ') +
        '<a href="' + (isGR ? 'privacy.html' : 'privacy.html') + '" class="cookie-link">' +
          (isGR ? 'Πολιτική Απορρήτου' : 'Privacy Policy') +
        '</a>' +
      '</p>' +
      '<div class="cookie-buttons">' +
        '<button id="cookieReject" class="cookie-btn cookie-btn-reject">' +
          (isGR ? 'Απόρριψη' : 'Reject') +
        '</button>' +
        '<button id="cookieAccept" class="cookie-btn cookie-btn-accept">' +
          (isGR ? 'Αποδοχή' : 'Accept') +
        '</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(banner);
  setTimeout(function(){ banner.classList.add('cookie-banner-show'); }, 300);

  document.getElementById('cookieAccept').addEventListener('click', function(){
    _grantConsent();
    try { localStorage.setItem('pc_consent', 'granted'); } catch(e){}
    _hideBanner();
  });

  document.getElementById('cookieReject').addEventListener('click', function(){
    _denyConsent();
    try { localStorage.setItem('pc_consent', 'denied'); } catch(e){}
    _hideBanner();
  });
}

function _hideBanner() {
  var b = document.getElementById('cookieBanner');
  if (b) {
    b.classList.remove('cookie-banner-show');
    setTimeout(function(){ b.remove(); }, 300);
  }
}

// Public: reopen consent
window.pcReopenConsent = function() {
  try { localStorage.removeItem('pc_consent'); } catch(e){}
  _buildBanner();
};

document.addEventListener('DOMContentLoaded', _buildBanner);

/* ═══════════════════════════════════════════
   5. EVENT TRACKING
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function(){

  // ── Quote form ──
  var quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function(e){
      e.preventDefault();
      _getRecaptchaToken('quote_form', function(token){
        _trackLead('quote_form');
        _submitToSheets(quoteForm, 'quote', token);
      });
    });
  }

  // ── Call request modal form ──
  var callForm = document.getElementById('callForm');
  if (callForm) {
    callForm.addEventListener('submit', function(e){
      e.preventDefault();
      _getRecaptchaToken('call_request', function(token){
        _trackLead('call_request');
        _submitToSheets(callForm, 'call', token);
        var inner = document.getElementById('callFormInner');
        var success = document.getElementById('callSuccess');
        if (inner) inner.style.display = 'none';
        if (success) success.style.display = 'block';
      });
    });
  }

  // ── Click-to-email ──
  document.querySelectorAll('a[href^="mailto:"]').forEach(function(el){
    el.addEventListener('click', function(){
      gtag('event', 'click_to_email', { event_category: 'contact' });
    });
  });

  // ── Click-to-phone ──
  document.querySelectorAll('a[href^="tel:"]').forEach(function(el){
    el.addEventListener('click', function(){
      gtag('event', 'click_to_phone', { event_category: 'contact' });
    });
  });

  // ── Click-to-WhatsApp ──
  document.querySelectorAll('a[href*="wa.me"]').forEach(function(el){
    el.addEventListener('click', function(){
      gtag('event', 'click_to_whatsapp', { event_category: 'contact' });
    });
  });
});

function _trackLead(formName) {
  gtag('event', 'generate_lead', {
    event_category: 'form',
    event_label: formName
  });
  gtag('event', 'conversion', {
    send_to: PC_CONFIG.GADS_ID + '/' + PC_CONFIG.GADS_CONV_LABEL,
    event_category: 'form',
    event_label: formName
  });
}

/* ═══════════════════════════════════════════
   6. GOOGLE SHEETS SUBMISSION
   ═══════════════════════════════════════════ */
function _submitToSheets(form, formType, recaptchaToken) {
  var data = new FormData(form);
  data.append('form_type', formType);
  data.append('page_lang', document.documentElement.lang || 'el');
  data.append('timestamp', new Date().toISOString());
  if (recaptchaToken) data.append('recaptcha_token', recaptchaToken);

  if (PC_CONFIG.SHEETS_URL && PC_CONFIG.SHEETS_URL !== 'GOOGLE_APPS_SCRIPT_URL') {
    fetch(PC_CONFIG.SHEETS_URL, { method: 'POST', body: data }).catch(function(){});
  }

  // Show success UI (quote form)
  if (formType === 'quote') {
    var wrap = document.getElementById('quoteFormWrap');
    var success = document.getElementById('quoteSuccess');
    if (wrap) wrap.style.display = 'none';
    if (success) success.style.display = 'block';
    var section = document.getElementById('formSection');
    if (section) window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
  }
}
