(function initHomeSkeleton() {
    if (!document.getElementById('home')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.body.classList.add('skeleton-loading');
    window.setTimeout(() => {
        document.body.classList.remove('skeleton-loading');
    }, 750);
})();

/** Mega footer: reveal when bottom sentinel is in view; scale dotted outline name to viewport width */
(function initMegaNameFooter() {
    const mega = document.querySelector('.mega-name-footer');
    const svg = document.querySelector('.mega-name-footer__svg');
    const el = document.querySelector('.mega-name-footer__text');
    const sentinel = document.querySelector('.mega-name-scroll-sentinel');
    if (!mega || !svg || !el || !sentinel) return;

    function viewportWidth() {
        return document.documentElement.clientWidth;
    }

    function apply() {
        if (document.body.classList.contains('skeleton-loading')) return;
        if (!mega.classList.contains('mega-name-footer--visible')) return;
        const vw = viewportWidth();
        if (vw < 2) return;

        el.setAttribute('font-size', '100');
        el.setAttribute('x', '0');
        el.setAttribute('y', '80');

        let bbox;
        try {
            bbox = el.getBBox();
        } catch (e) {
            return;
        }
        if (!bbox || !bbox.width) return;

        const px = (100 * vw) / bbox.width;
        const y = px * 0.78;
        const stroke = Math.max(1.25, px * 0.007);
        const dash = Math.max(2, px * 0.01);
        const gap = Math.max(3, px * 0.018);

        el.setAttribute('font-size', String(px));
        el.setAttribute('y', String(y));
        el.setAttribute('stroke-width', String(stroke));
        el.setAttribute('stroke-dasharray', `${dash} ${gap}`);

        svg.setAttribute('viewBox', `0 0 ${vw} ${px}`);
        svg.setAttribute('width', String(vw));
        svg.setAttribute('height', String(px));
    }

    function run() {
        window.requestAnimationFrame(apply);
    }

    function refreshFromSentinel() {
        if (document.body.classList.contains('skeleton-loading')) return;
        const r = sentinel.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const inView = r.top < vh && r.bottom > 0;
        mega.classList.toggle('mega-name-footer--visible', inView);
        if (inView) {
            run();
            window.setTimeout(run, 50);
        }
    }

    let scrollRaf = false;
    function onScrollOrResize() {
        if (scrollRaf) return;
        scrollRaf = true;
        window.requestAnimationFrame(() => {
            scrollRaf = false;
            refreshFromSentinel();
        });
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    function afterFonts() {
        refreshFromSentinel();
        window.setTimeout(run, 100);
        window.setTimeout(run, 900);
    }

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(afterFonts);
    } else {
        afterFonts();
    }

    const moBody = new MutationObserver(() => {
        if (!document.body.classList.contains('skeleton-loading')) {
            refreshFromSentinel();
        }
    });
    moBody.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const htmlElement = document.documentElement;

// Legacy: remove color-palette state
localStorage.removeItem('palette');
localStorage.removeItem('specMode');
htmlElement.removeAttribute('data-palette');

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', () => {
        const current = htmlElement.getAttribute('data-theme');
        const newTheme = current === 'light' ? 'dark' : 'light';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link — scroll on home, pathname match elsewhere
const headerNavLinks = document.querySelectorAll('header .nav-link');

if (headerNavLinks.length) {
    function normalizeNavPath(pathname) {
        if (!pathname || pathname === '/') return '/';
        return pathname
            .replace(/\/index\.html$/, '')
            .replace(/\.html$/, '')
            .replace(/\/$/, '') || '/';
    }

    function navLinkMatchesCurrentPage(link) {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#')) return false;

        try {
            const linkPath = normalizeNavPath(new URL(href, window.location.origin).pathname);
            const currentPath = normalizeNavPath(window.location.pathname);

            if (linkPath === '/') {
                return currentPath === '/';
            }

            return currentPath === linkPath || currentPath.startsWith(`${linkPath}/`);
        } catch {
            return false;
        }
    }

    const isHomeWithHashNav = Boolean(document.querySelector('header .nav-link[href="#home"]'));

    function setActiveNavLinkByScroll() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';

        sections.forEach(section => {
            if (window.pageYOffset >= section.offsetTop - 200) {
                current = section.getAttribute('id');
            }
        });

        headerNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                link.classList.toggle('active', href === `#${current}`);
            }
        });
    }

    function setActiveNavLinkByPath() {
        headerNavLinks.forEach(link => {
            link.classList.toggle('active', navLinkMatchesCurrentPage(link));
        });
    }

    if (isHomeWithHashNav) {
        window.addEventListener('scroll', setActiveNavLinkByScroll);
        window.addEventListener('load', setActiveNavLinkByScroll);
    } else {
        setActiveNavLinkByPath();
    }
}

// Add hover effect to post cards
const postCards = document.querySelectorAll('.post-card');
postCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.opacity = '0.8';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.opacity = '1';
    });
});

// Optional: fade-in on scroll (delayed on home until skeleton state ends)
function initSectionFadeIn() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section:not(.section--no-reveal)').forEach((section) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

const skipSkeletonDelay =
    !document.getElementById('home') ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (skipSkeletonDelay) {
    initSectionFadeIn();
} else {
    window.setTimeout(initSectionFadeIn, 750);
}

// Read More functionality for notes
document.querySelectorAll('.read-more-btn').forEach(button => {
    button.addEventListener('click', function() {
        const content = this.previousElementSibling;
        const readMoreText = this.querySelector('.read-more-text');
        
        this.classList.toggle('expanded');
        content.classList.toggle('expanded');
        
        if (content.classList.contains('expanded')) {
            readMoreText.textContent = 'Read less';
        } else {
            readMoreText.textContent = 'Read more';
        }
    });
});

// Category tabs (Work + Figma Plugins)
function initCategoryTabs(sectionId, listSelector, tabSelector) {
    const section = document.getElementById(sectionId);
    const list = section ? section.querySelector(listSelector) : null;
    const tabs = section ? section.querySelectorAll(tabSelector) : [];
    if (!section || !list || !tabs.length) return;

    function setTab(category) {
        list.setAttribute('data-active-category', category);
        tabs.forEach(tab => {
            const isActive = tab.getAttribute('data-category') === category;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });
    }

    function handleTabSelect(tab) {
        const category = tab.getAttribute('data-category');
        if (category) setTab(category);
    }

    section.addEventListener('click', (e) => {
        const tab = e.target.closest(tabSelector);
        if (tab && section.contains(tab)) {
            e.preventDefault();
            e.stopPropagation();
            handleTabSelect(tab);
        }
    });
    section.addEventListener('touchend', (e) => {
        const tab = e.target.closest(tabSelector);
        if (tab && section.contains(tab)) {
            e.preventDefault();
            e.stopPropagation();
            handleTabSelect(tab);
        }
    }, { passive: false });
}

function initPluginTabs() {
    initCategoryTabs('figma-plugins', '.project-list', '.plugin-tab');
}

function initWorkTabs() {
    initCategoryTabs('work', '.posts-grid', '.plugin-tab');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initPluginTabs();
        initWorkTabs();
    });
} else {
    initPluginTabs();
    initWorkTabs();
}

/** Figma-style drifting cursors on home hero (index only) */
(function initFigmaCursors() {
    const root = document.querySelector('.figma-cursors');
    if (!root) return;

    const cursorEls = root.querySelectorAll('.figma-cursor');
    if (!cursorEls.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speeds = [0.016, 0.012];
    /* Keep movement in the upper band so cursor art (extends below anchor) isn’t clipped */
    const yMin = 0.06;
    const yMax = 0.42;

    function placeStatic() {
        const w = root.clientWidth || 1;
        const h = root.clientHeight || 1;
        const spots = [
            { x: 0.12, y: 0.22 },
            { x: 0.68, y: 0.32 },
        ];
        cursorEls.forEach((el, i) => {
            const s = spots[i] || spots[0];
            el.style.transform = `translate(${s.x * w}px, ${s.y * h}px)`;
        });
    }

    if (reducedMotion) {
        placeStatic();
        window.addEventListener('resize', placeStatic);
        return;
    }

    const state = Array.from(cursorEls).map((el, i) => ({
        el,
        x: 0.08 + Math.random() * 0.84,
        y: yMin + Math.random() * (yMax - yMin),
        tx: 0.5,
        ty: 0.25,
        speed: speeds[i] ?? 0.014,
    }));

    function randomTarget(s) {
        s.tx = 0.05 + Math.random() * 0.9;
        s.ty = yMin + Math.random() * (yMax - yMin);
    }
    state.forEach(randomTarget);

    function tick() {
        const w = root.clientWidth;
        const h = root.clientHeight;
        if (w < 8 || h < 8) {
            requestAnimationFrame(tick);
            return;
        }
        state.forEach((s) => {
            s.x += (s.tx - s.x) * s.speed;
            s.y += (s.ty - s.y) * s.speed;
            if (Math.hypot(s.tx - s.x, s.ty - s.y) < 0.018) {
                randomTarget(s);
            }
            s.el.style.transform = `translate(${s.x * w}px, ${s.y * h}px)`;
        });
        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
})();

// Video Card Controls
const vantageVideo = document.getElementById('vantage-video');
if (vantageVideo) {
    const videoContainer = vantageVideo.closest('.video-container');
    const playBtn = videoContainer.querySelector('.play-btn');
    const muteBtn = videoContainer.querySelector('.mute-btn');
    const playIcon = playBtn.querySelector('.material-icons');
    const muteIcon = muteBtn.querySelector('.material-icons');

    // Play/Pause toggle
    playBtn.addEventListener('click', function() {
        if (vantageVideo.paused) {
            vantageVideo.play();
            playIcon.textContent = 'pause';
        } else {
            vantageVideo.pause();
            playIcon.textContent = 'play_arrow';
        }
    });

    // Mute/Unmute toggle
    muteBtn.addEventListener('click', function() {
        if (vantageVideo.muted) {
            vantageVideo.muted = false;
            muteIcon.textContent = 'volume_up';
        } else {
            vantageVideo.muted = true;
            muteIcon.textContent = 'volume_off';
        }
    });

    // Update play button when video ends
    vantageVideo.addEventListener('ended', function() {
        playIcon.textContent = 'play_arrow';
    });
}

/** Poké Ball easter egg: shake, throw, play Ash & Pikachu video (home only) */
(function initPokeballWidget() {
    const widget = document.getElementById('pokeball-widget');
    const btn = document.getElementById('pokeball-btn');
    const modal = document.getElementById('pokeball-video-modal');
    const backdrop = document.getElementById('pokeball-video-backdrop');
    const video = document.getElementById('pokeball-video');
    const playBtn = document.getElementById('pokeball-video-play');
    const muteBtn = document.getElementById('pokeball-video-mute');
    const closeBtn = document.getElementById('pokeball-video-close');
    const seek = document.getElementById('pokeball-video-seek');
    const currentTimeEl = document.getElementById('pokeball-video-current');
    const durationEl = document.getElementById('pokeball-video-duration');
    if (!widget || !btn || !modal || !video || !playBtn || !muteBtn || !closeBtn || !seek || !currentTimeEl || !durationEl) return;

    const playIcon = playBtn.querySelector('.material-icons');
    const muteIcon = muteBtn.querySelector('.material-icons');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isAnimating = false;
    let isOpen = false;
    let isSeeking = false;

    function formatTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    }

    function updateSeekAccessibility() {
        const current = Number(seek.value) || 0;
        const max = Number(seek.max) || 0;
        seek.setAttribute('aria-valuenow', String(Math.round(current)));
        seek.setAttribute('aria-valuemax', String(Math.round(max)));
        seek.setAttribute('aria-valuetext', `${formatTime(current)} of ${formatTime(max)}`);
    }

    function setDuration() {
        if (!Number.isFinite(video.duration)) return;
        seek.max = String(video.duration);
        durationEl.textContent = formatTime(video.duration);
        updateSeekAccessibility();
    }

    function updateTimeline() {
        if (isSeeking || !Number.isFinite(video.duration)) return;
        seek.value = String(video.currentTime);
        currentTimeEl.textContent = formatTime(video.currentTime);
        updateSeekAccessibility();
    }

    function resetTimeline() {
        seek.value = '0';
        seek.max = '0';
        currentTimeEl.textContent = '0:00';
        durationEl.textContent = '0:00';
        updateSeekAccessibility();
    }

    function resetClasses() {
        widget.classList.remove('is-active', 'is-shaking', 'is-throwing');
    }

    function showBall() {
        btn.hidden = false;
        btn.setAttribute('aria-expanded', 'false');
        const ball = btn.querySelector('.pokeball-btn__ball');
        if (ball) {
            ball.style.animation = 'none';
            ball.style.opacity = '';
            ball.style.transform = '';
        }
    }

    function hideBall() {
        btn.hidden = true;
    }

    function updatePlayButton() {
        const isPlaying = !video.paused && !video.ended;
        playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
        if (playIcon) playIcon.textContent = isPlaying ? 'pause' : 'play_arrow';
    }

    function updateMuteButton() {
        const isMuted = video.muted;
        muteBtn.setAttribute('aria-label', isMuted ? 'Unmute' : 'Mute');
        if (muteIcon) muteIcon.textContent = isMuted ? 'volume_off' : 'volume_up';
    }

    function openVideoModal() {
        modal.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        hideBall();
        document.body.classList.add('pokeball-video-open');
        video.currentTime = 0;
        video.muted = false;
        updateMuteButton();
        setDuration();
        updateTimeline();
        video.play().then(updatePlayButton).catch(updatePlayButton);
        isAnimating = false;
        isOpen = true;
    }

    function closeVideoModal() {
        isOpen = false;
        isAnimating = false;
        isSeeking = false;
        video.pause();
        video.currentTime = 0;
        modal.hidden = true;
        document.body.classList.remove('pokeball-video-open');
        resetClasses();
        resetTimeline();
        showBall();
        updatePlayButton();
    }

    function playCatchSequence() {
        if (isAnimating) return;
        if (isOpen) {
            closeVideoModal();
            return;
        }

        isAnimating = true;
        widget.classList.add('is-active', 'is-shaking');

        window.setTimeout(() => {
            widget.classList.remove('is-shaking');
            widget.classList.add('is-throwing');
        }, reducedMotion ? 0 : 650);

        window.setTimeout(() => {
            resetClasses();
            openVideoModal();
        }, reducedMotion ? 80 : 1100);
    }

    btn.addEventListener('click', (event) => {
        event.stopPropagation();
        playCatchSequence();
    });

    playBtn.addEventListener('click', () => {
        if (video.paused || video.ended) {
            if (video.ended) video.currentTime = 0;
            video.play().catch(() => {});
        } else {
            video.pause();
        }
        updatePlayButton();
    });

    muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        updateMuteButton();
    });

    closeBtn.addEventListener('click', closeVideoModal);
    backdrop.addEventListener('click', closeVideoModal);

    seek.addEventListener('pointerdown', () => {
        isSeeking = true;
    });

    seek.addEventListener('input', () => {
        const nextTime = Number(seek.value);
        video.currentTime = nextTime;
        currentTimeEl.textContent = formatTime(nextTime);
        updateSeekAccessibility();
    });

    seek.addEventListener('change', () => {
        video.currentTime = Number(seek.value);
        isSeeking = false;
        updateTimeline();
    });

    seek.addEventListener('pointerup', () => {
        isSeeking = false;
    });

    video.addEventListener('play', updatePlayButton);
    video.addEventListener('pause', updatePlayButton);
    video.addEventListener('ended', updatePlayButton);
    video.addEventListener('timeupdate', updateTimeline);
    video.addEventListener('loadedmetadata', setDuration);
    video.addEventListener('durationchange', setDuration);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen && !isAnimating) closeVideoModal();
    });
})();

