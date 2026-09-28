/**
 * Private Chocolate — Analytics & Consent
 * ────────────────────────────────────────
 * Consent Mode v2 → gtag.js → GA4 + Google Ads
 *
 * CONFIGURATION:
 */
var PC_CONFIG = {
  GA4_ID:          'G-XXXXXXXXXX',
  GADS_ID:         'AW-XXXXXXXXXX',
  GADS_CONV_LABEL: 'CONVERSION_LABEL',
  SHEETS_URL:      'GOOGLE_APPS_SCRIPT_URL',
};

/* ═══════════════════════════════════════════
   1. CONSENT MODE v2
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
   2. LOAD GTAG.JS
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
   3. COOKIE CONSENT — blocking overlay
   ═══════════════════════════════════════════ */
function _buildBanner() {
  try { if (localStorage.getItem('pc_consent')) return; } catch(e){}

  var isGR = document.documentElement.lang === 'el';

  var overlay = document.createElement('div');
  overlay.id = 'cookieOverlay';
  overlay.className = 'cookie-overlay';

  overlay.innerHTML =
    '<div class="cookie-box">' +
      '<div class="cookie-header">' +
        '<span class="cookie-title">' + (isGR ? 'Ρυθμίσεις Cookies' : 'Cookie Settings') + '</span>' +
      '</div>' +
      '<p class="cookie-desc">' +
        (isGR
          ? 'Χρησιμοποιούμε cookies για τη λειτουργία του ιστοτόπου, τη μέτρηση επισκεψιμότητας και τη βελτίωση της εμπειρίας σας.'
          : 'We use cookies to operate the site, measure traffic and improve your experience.') +
      '</p>' +

      // Necessary — always on
      '<div class="cookie-category">' +
        '<div class="cookie-cat-header">' +
          '<span class="cookie-cat-name">' + (isGR ? 'Απαραίτητα' : 'Necessary') + '</span>' +
          '<span class="cookie-cat-badge">' + (isGR ? 'Πάντα ενεργά' : 'Always active') + '</span>' +
        '</div>' +
        '<p class="cookie-cat-desc">' +
          (isGR
            ? 'Βασικά cookies για τη λειτουργία του ιστοτόπου, τη φόρμα επικοινωνίας και την αποθήκευση των προτιμήσεών σας.'
            : 'Essential cookies for site functionality, the contact form and storing your preferences.') +
        '</p>' +
      '</div>' +

      // Analytics & Ads — optional
      '<div class="cookie-category">' +
        '<div class="cookie-cat-header">' +
          '<span class="cookie-cat-name">' + (isGR ? 'Analytics & Διαφημίσεις' : 'Analytics & Advertising') + '</span>' +
        '</div>' +
        '<p class="cookie-cat-desc">' +
          (isGR
            ? 'Google Analytics για μέτρηση επισκεψιμότητας και Google Ads για μέτρηση αποτελεσματικότητας διαφημίσεων. Δεν συλλέγουμε προσωπικά δεδομένα.'
            : 'Google Analytics for traffic measurement and Google Ads for advertising performance. We do not collect personal data.') +
        '</p>' +
      '</div>' +

      '<div class="cookie-actions">' +
        '<button id="cookieReject" class="cookie-btn cookie-btn-reject">' +
          (isGR ? 'Μόνο Απαραίτητα' : 'Necessary Only') +
        '</button>' +
        '<button id="cookieAccept" class="cookie-btn cookie-btn-accept">' +
          (isGR ? 'Αποδοχή Όλων' : 'Accept All') +
        '</button>' +
      '</div>' +

      '<a href="' + (isGR ? 'privacy.html' : 'privacy.html') + '" class="cookie-privacy-link">' +
        (isGR ? 'Πολιτική Απορρήτου' : 'Privacy Policy') +
      '</a>' +
    '</div>';

  document.body.appendChild(overlay);
  setTimeout(function(){ overlay.classList.add('cookie-overlay-show'); }, 100);

  document.getElementById('cookieAccept').addEventListener('click', function(){
    _grantConsent();
    try { localStorage.setItem('pc_consent', 'granted'); } catch(e){}
    _hideOverlay();
  });

  document.getElementById('cookieReject').addEventListener('click', function(){
    _denyConsent();
    try { localStorage.setItem('pc_consent', 'denied'); } catch(e){}
    _hideOverlay();
  });
}

function _hideOverlay() {
  var o = document.getElementById('cookieOverlay');
  if (o) {
    o.classList.remove('cookie-overlay-show');
    setTimeout(function(){ o.remove(); }, 300);
  }
}

window.pcReopenConsent = function() {
  try { localStorage.removeItem('pc_consent'); } catch(e){}
  _buildBanner();
};

document.addEventListener('DOMContentLoaded', _buildBanner);

/* ═══════════════════════════════════════════
   4. EVENT TRACKING
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function(){

  // ── Quote form ──
  var quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function(e){
      e.preventDefault();
      _trackLead('quote_form');
      _submitToSheets(quoteForm, 'quote');
    });
  }

  // ── Call request modal ──
  var callForm = document.getElementById('callForm');
  if (callForm) {
    callForm.addEventListener('submit', function(e){
      e.preventDefault();
      _trackLead('call_request');
      _submitToSheets(callForm, 'call');
      var inner = document.getElementById('callFormInner');
      var success = document.getElementById('callSuccess');
      if (inner) inner.style.display = 'none';
      if (success) success.style.display = 'block';
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
   5. GOOGLE SHEETS SUBMISSION
   ═══════════════════════════════════════════ */
function _submitToSheets(form, formType) {
  // Honeypot check
  var hp = form.querySelector('.hp-field input');
  if (hp && hp.value) return;

  var data = new FormData(form);
  data.append('form_type', formType);
  data.append('page_lang', document.documentElement.lang || 'el');
  data.append('timestamp', new Date().toISOString());

  if (PC_CONFIG.SHEETS_URL && PC_CONFIG.SHEETS_URL !== 'GOOGLE_APPS_SCRIPT_URL') {
    fetch(PC_CONFIG.SHEETS_URL, { method: 'POST', body: data }).catch(function(){});
  }

  // Show success UI
  if (formType === 'quote') {
    var wrap = document.getElementById('quoteFormWrap');
    var success = document.getElementById('quoteSuccess');
    if (wrap) wrap.style.display = 'none';
    if (success) success.style.display = 'block';
    var section = document.getElementById('formSection');
    if (section) window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
  }
}
