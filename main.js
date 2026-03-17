/* ── MATRIX CANVAS ── */
(function () {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    let cols, drops;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        cols  = Math.floor(canvas.width / 20);
        drops = Array(cols).fill(1);
    }

    function draw() {
        ctx.fillStyle = 'rgba(5,5,8,0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00d2ff';
        ctx.font = '14px JetBrains Mono, monospace';
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
        drops.forEach((y, i) => {
            const ch = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(ch, i * 20, y * 20);
            if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }

    resize();
    window.addEventListener('resize', resize);
    setInterval(draw, 60);
})();

/* ── TYPEWRITER ── */
(function () {
    const el = document.querySelector('.typed-text');
    const texts = [
        'Frontend & Fullstack Development Journey',
        'Building Extraordinary Web Experiences',
        'HTML · CSS · JavaScript · React Magic',
    ];
    let ti = 0, ci = 0, deleting = false;

    function tick() {
        const full = texts[ti];
        el.textContent = deleting ? full.slice(0, ci--) : full.slice(0, ci++);

        if (!deleting && ci > full.length) {
            deleting = true;
            setTimeout(tick, 1800);
            return;
        }
        if (deleting && ci < 0) {
            deleting = false;
            ti = (ti + 1) % texts.length;
            ci = 0;
            setTimeout(tick, 400);
            return;
        }
        setTimeout(tick, deleting ? 38 : 62);
    }
    setTimeout(tick, 800);
})();

/* ── ANIMATED COUNTERS ── */
(function () {
    const counters = document.querySelectorAll('.counter');
    const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    function animateCounter(el) {
        const target = +el.dataset.target;
        const duration = 1400;
        const start = performance.now();
        function step(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(ease(p) * target);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
    }

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animateCounter(e.target);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => obs.observe(c));
})();

/* ── CARD STAGGER REVEAL ── */
(function () {
    const cards = document.querySelectorAll('.card');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const idx = +e.target.dataset.index || 0;
                e.target.style.animationDelay = (idx % 4) * 80 + 'ms';
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(c => obs.observe(c));
})();

/* ── CARD MOUSE TILT ── */
(function () {
    document.querySelectorAll('.card:not(.card--disabled)').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width  - 0.5;
            const y = (e.clientY - r.top)  / r.height - 0.5;
            card.style.transform = `translateY(-10px) scale(1.01) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
            const glow = card.querySelector('.card-glow');
            const px = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
            const py = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
            glow.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(0,210,255,0.14), transparent 65%)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.querySelector('.card-glow').style.background = '';
        });
    });
})();
