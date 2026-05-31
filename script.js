/* ════════════════════════════════════════
   FOR NANCY — script.js
════════════════════════════════════════ */

/* ══════════════════════════════
   🔐 LOGIN SETTINGS
══════════════════════════════ */
const SECRET_NAME     = 'nancy';
const SECRET_PASSWORD = 'mylove';

/* ══ Generate login stars ══ */
const lsStars = document.getElementById('lsStars');
for (let i = 0; i < 100; i++) {
  const s = document.createElement('div');
  s.className = 'ls-star';
  const sz = Math.random() * 2.5 + 0.5;
  s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;animation-duration:${2+Math.random()*4}s;animation-delay:${Math.random()*5}s;`;
  lsStars.appendChild(s);
}

/* ══ Floating hearts ══ */
const lhWrap   = document.getElementById('lHearts');
const hSymbols = ['💙','🩵','✦','·','❄'];
for (let i = 0; i < 14; i++) {
  const h = document.createElement('div');
  h.className = 'lheart';
  h.textContent = hSymbols[Math.floor(Math.random()*hSymbols.length)];
  h.style.cssText = `left:${Math.random()*100}%;bottom:-5%;animation-duration:${8+Math.random()*10}s;animation-delay:${Math.random()*10}s;font-size:${0.8+Math.random()*1.2}rem;`;
  lhWrap.appendChild(h);
}

/* ══ Login logic ══ */
const loginBtn  = document.getElementById('loginBtn');
const loginErr  = document.getElementById('loginError');
const loginCard = document.querySelector('.login-card');

function tryLogin() {
  const name = document.getElementById('loginName').value.trim().toLowerCase();
  const pass = document.getElementById('loginPassword').value.trim().toLowerCase();

  if (name === SECRET_NAME && pass === SECRET_PASSWORD) {
    loginErr.textContent = '';
    document.getElementById('loginScreen').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('mainSite').classList.add('visible');
      initMainSite();
    }, 900);
  } else {
    loginErr.textContent = '✦ Hmm, that doesn\'t seem right. Try again, love.';
    loginCard.classList.remove('shake');
    void loginCard.offsetWidth;
    loginCard.classList.add('shake');
  }
}

loginBtn.addEventListener('click', tryLogin);
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('loginScreen').style.display !== 'none') {
    tryLogin();
  }
});

/* ══════════════════════════════
   MAIN SITE
══════════════════════════════ */
function initMainSite() {

  /* ── Hero stars ── */
  const starsEl = document.getElementById('stars');
  for (let i = 0; i < 120; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;animation-duration:${2+Math.random()*4}s;animation-delay:${Math.random()*5}s;`;
    starsEl.appendChild(s);
  }

  /* ── Floating particles ── */
  const ptcWrap = document.getElementById('particles');
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 3;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;animation-duration:${10+Math.random()*14}s;animation-delay:${Math.random()*12}s;`;
    ptcWrap.appendChild(p);
  }

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  const observer  = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));

  /* ══ MUSIC PLAYER ══ */
  const audio      = document.getElementById('audioPlayer');
  const playBtn    = document.getElementById('playBtn');
  const backBtn    = document.getElementById('backBtn');
  const loopBtn    = document.getElementById('loopBtn');
  const fill       = document.getElementById('progressFill');
  const progressBg = document.getElementById('progressBg');
  const curTime    = document.getElementById('currentTime');
  const totTime    = document.getElementById('totalTime');
  const songArt    = document.getElementById('songArt');
  let isPlaying    = false;

  const fmt = s => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;

  /* Play / Pause */
  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      playBtn.textContent = '▶';
      songArt.classList.remove('playing');
    } else {
      audio.play()
        .then(() => {
          isPlaying = true;
          playBtn.textContent = '⏸';
          songArt.classList.add('playing');
        })
        .catch(err => console.warn('Playback error:', err));
    }
  });

  /* Restart */
  backBtn.addEventListener('click', () => {
    audio.currentTime = 0;
    if (!isPlaying) {
      audio.play().then(() => {
        isPlaying = true;
        playBtn.textContent = '⏸';
        songArt.classList.add('playing');
      });
    }
  });

  /* Loop */
  loopBtn.addEventListener('click', () => {
    audio.loop = !audio.loop;
    loopBtn.style.color = audio.loop ? 'var(--gold)' : 'var(--blue-light)';
  });

  /* Progress */
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
    curTime.textContent = fmt(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    totTime.textContent = fmt(audio.duration);
  });

  audio.addEventListener('ended', () => {
    if (!audio.loop) {
      isPlaying = false;
      playBtn.textContent = '▶';
      songArt.classList.remove('playing');
      audio.currentTime = 0;
      fill.style.width = '0%';
      curTime.textContent = '0:00';
    }
  });

  /* Seek */
  progressBg.addEventListener('click', e => {
    if (!audio.duration) return;
    const r = progressBg.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });

} // end initMainSite