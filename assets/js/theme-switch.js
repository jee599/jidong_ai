(function () {
  function applyTone(tone) {
    document.documentElement.setAttribute('data-tone', tone);
    try { localStorage.setItem('tone', tone); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-tone]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTone(btn.getAttribute('data-tone'));
      });
    });
  });
})();
