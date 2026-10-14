/* Lightbox for case-study images: click any figure image to view it larger. */
(() => {
  const imgs = [...document.querySelectorAll('.cs-figure img, .cs-cover img')];
  if (!imgs.length) return;
  const lb = document.createElement('div');
  lb.className = 'lb'; lb.hidden = true;
  lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image viewer');
  lb.innerHTML = '<button class="lb-btn lb-close" aria-label="Close">✕</button><button class="lb-btn lb-prev" aria-label="Previous image">←</button><button class="lb-btn lb-next" aria-label="Next image">→</button><figure class="lb-fig"><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(lb);
  const big = lb.querySelector('img'), cap = lb.querySelector('figcaption'), fig = lb.querySelector('.lb-fig');
  let i = 0, last = null;
  const show = n => {
    i = (n + imgs.length) % imgs.length;
    const im = imgs[i], a = im.closest('a');
    big.src = (a && /\.(jpe?g|png|gif|webp)$/i.test(a.getAttribute('href') || '')) ? a.getAttribute('href') : (im.currentSrc || im.src);
    big.alt = im.alt;
    const fc = im.closest('figure')?.querySelector('figcaption');
    cap.textContent = fc ? fc.textContent.replace(/\s*Click to enlarge\.?/i, '') : '';
    cap.hidden = !cap.textContent;
    fig.classList.remove('zoom');
  };
  const open = n => { last = document.activeElement; show(n); lb.hidden = false; document.documentElement.style.overflow = 'hidden'; requestAnimationFrame(() => lb.classList.add('on')); lb.querySelector('.lb-close').focus(); };
  const close = () => { lb.classList.remove('on'); document.documentElement.style.overflow = ''; setTimeout(() => { lb.hidden = true; big.src = ''; }, 200); last && last.focus(); };
  imgs.forEach((im, n) => {
    im.classList.add('lb-zoomable');
    const target = im.closest('a') || im;
    if (target === im) { im.tabIndex = 0; im.setAttribute('role', 'button'); im.setAttribute('aria-label', 'View larger: ' + (im.alt || 'image')); }
    target.addEventListener('click', e => { e.preventDefault(); open(n); });
    target.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(n); } });
  });
  const multi = imgs.length > 1;
  lb.querySelector('.lb-prev').hidden = lb.querySelector('.lb-next').hidden = !multi;
  lb.querySelector('.lb-close').onclick = close;
  lb.querySelector('.lb-prev').onclick = e => { e.stopPropagation(); show(i - 1); };
  lb.querySelector('.lb-next').onclick = e => { e.stopPropagation(); show(i + 1); };
  lb.addEventListener('click', e => { if (e.target === lb || e.target === fig) close(); });
  big.addEventListener('click', e => { e.stopPropagation(); if (big.naturalWidth > big.clientWidth * 1.2) fig.classList.toggle('zoom'); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight' && multi) show(i + 1);
    else if (e.key === 'ArrowLeft' && multi) show(i - 1);
    else if (e.key === 'Tab') { const f = [...lb.querySelectorAll('button:not([hidden])')]; const k = f.indexOf(document.activeElement); e.preventDefault(); f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
  });
})();
