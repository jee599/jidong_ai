(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);

  if (btn) {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // Build TOC
  const toc = document.getElementById('toc');
  const content = document.querySelector('.post-content');
  if (toc && content) {
    const headings = content.querySelectorAll('h2, h3');
    if (!headings.length) {
      document.getElementById('tocBox')?.classList.add('hidden');
    } else {
      const ul = document.createElement('ul');
      headings.forEach((h, i) => {
        if (!h.id) h.id = `sec-${i + 1}`;
        const li = document.createElement('li');
        li.className = h.tagName.toLowerCase();
        const a = document.createElement('a');
        a.href = `#${h.id}`;
        a.textContent = h.textContent;
        li.appendChild(a);
        ul.appendChild(li);
      });
      toc.appendChild(ul);
    }
  }

  // Copy button for code blocks
  document.querySelectorAll('pre code').forEach((code) => {
    const pre = code.parentElement;
    const btn = document.createElement('button');
    btn.textContent = 'copy';
    btn.className = 'copy-btn';
    btn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(code.innerText);
      btn.textContent = 'copied';
      setTimeout(() => (btn.textContent = 'copy'), 1200);
    });
    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
})();
