(function initHomeSkeleton() {
    if (!document.getElementById('home')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.body.classList.add('skeleton-loading');
    window.setTimeout(() => {
        document.body.classList.remove('skeleton-loading');
    }, 750);
})();

/** Mega footer: reveal when bottom sentinel is in view; scale name to viewport width */
(function initMegaNameFooter() {
    const mega = document.querySelector('.mega-name-footer');
    const el = document.querySelector('.mega-name-footer__text');
    const sentinel = document.querySelector('.mega-name-scroll-sentinel');
    if (!mega || !el || !sentinel) return;

    function viewportWidth() {
        return document.documentElement.clientWidth;
    }

    function apply() {
        if (document.body.classList.contains('skeleton-loading')) return;
        if (!mega.classList.contains('mega-name-footer--visible')) return;
        const vw = viewportWidth();
        if (vw < 2) return;

        el.style.fontSize = '100px';
        const measured = el.scrollWidth;
        if (!measured) return;

        const px = (100 * vw) / measured;
        el.style.fontSize = `${px}px`;
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
const specToggle = document.getElementById('spec-toggle');
const htmlElement = document.documentElement;

// Legacy: remove color-palette state
localStorage.removeItem('palette');
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
        refreshSpecPanelTokens();
    });
}

function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
}

// Design spec overlay — CSS variables panel + hover inspector
const SPEC_TOKEN_VARS = [
    '--primary-text',
    '--secondary-text',
    '--border-color',
    '--background',
    '--hover-bg',
    '--accent-color',
    '--heading-font',
    '--body-font',
    '--grid-dot-color',
    '--header-bg',
    '--skeleton-base',
    '--skeleton-shine'
];

let specTooltip = null;
let specPanel = null;
let specLastEl = null;
let specMoveHandler = null;

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function clearSpecHighlight() {
    if (specLastEl && specLastEl.classList) {
        specLastEl.classList.remove('spec-mode-highlight');
    }
    specLastEl = null;
}

function hideSpecTooltip() {
    if (specTooltip) specTooltip.style.display = 'none';
}

function showSpecTooltip(x, y, text) {
    if (!specTooltip) return;
    specTooltip.textContent = text;
    specTooltip.style.display = 'block';
    const pad = 14;
    const tw = specTooltip.offsetWidth;
    const th = specTooltip.offsetHeight;
    let left = x + pad;
    let top = y + pad;
    if (left + tw > window.innerWidth - 8) left = x - tw - pad;
    if (top + th > window.innerHeight - 8) top = y - th - pad;
    if (left < 8) left = 8;
    if (top < 8) top = 8;
    specTooltip.style.left = `${left}px`;
    specTooltip.style.top = `${top}px`;
}

function getClassSuffix(el) {
    if (!el.className) return '';
    const raw =
        typeof el.className === 'string'
            ? el.className
            : el.className.baseVal != null
              ? String(el.className.baseVal)
              : '';
    const parts = raw.trim().split(/\s+/).filter(Boolean).slice(0, 4);
    return parts.length ? `.${parts.join('.')}` : '';
}

function buildSpecTooltipText(el) {
    if (!el || el.nodeType !== 1) return '';
    const cs = getComputedStyle(el);
    const cls = getClassSuffix(el);
    const tag = el.tagName.toLowerCase();
    return [
        `${tag}${cls}`,
        '',
        `font-size: ${cs.fontSize}`,
        `line-height: ${cs.lineHeight}`,
        `font-weight: ${cs.fontWeight}`,
        `letter-spacing: ${cs.letterSpacing}`,
        '',
        `padding: ${cs.padding}`,
        `margin: ${cs.margin}`,
        `border-radius: ${cs.borderRadius}`,
        `border: ${cs.borderWidth} ${cs.borderStyle} ${cs.borderColor}`,
        '',
        `width: ${cs.width} | height: ${cs.height}`,
        `color: ${cs.color}`
    ].join('\n');
}

function buildSpecPanelHtml() {
    const root = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    let rows = '';
    SPEC_TOKEN_VARS.forEach((name) => {
        const v = root.getPropertyValue(name).trim();
        rows += `<dt>${escapeHtml(name)}</dt><dd>${escapeHtml(v)}</dd>`;
    });
    const ffShort = bodyStyle.fontFamily.split(',')[0].replace(/"/g, '');
    return `
<div class="spec-panel-inner">
<h3>Design tokens</h3>
<h4>CSS variables (:root)</h4>
<dl>${rows}</dl>
<h4>Typography (body)</h4>
<ul>
<li>font-size: ${escapeHtml(bodyStyle.fontSize)}</li>
<li>line-height: ${escapeHtml(bodyStyle.lineHeight)}</li>
<li>font-family: ${escapeHtml(ffShort)}…</li>
</ul>
<h4>Spacing scale (site)</h4>
<ul>
<li>4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 80px — gaps / padding</li>
<li>Background grid: 24px × 24px dot grid</li>
</ul>
<h4>Border radius</h4>
<ul>
<li>6px, 8px, 12px, 16px, 999px (pills)</li>
</ul>
</div>`;
}

function refreshSpecPanelTokens() {
    if (specPanel && document.body.classList.contains('spec-mode')) {
        specPanel.innerHTML = buildSpecPanelHtml();
    }
}

function setSpecMode(on) {
    document.body.classList.toggle('spec-mode', on);
    localStorage.setItem('specMode', on ? 'on' : 'off');
    if (specToggle) {
        specToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
        specToggle.setAttribute(
            'aria-label',
            on ? 'Turn off design spec overlay' : 'Turn on design spec overlay'
        );
        specToggle.setAttribute('title', on ? 'Hide tokens & inspector' : 'Show tokens & inspector');
    }
    if (on) {
        if (!specTooltip) {
            specTooltip = document.createElement('div');
            specTooltip.id = 'spec-mode-tooltip';
            specTooltip.style.display = 'none';
            document.body.appendChild(specTooltip);
        }
        if (!specPanel) {
            specPanel = document.createElement('aside');
            specPanel.id = 'spec-mode-panel';
            specPanel.setAttribute('aria-label', 'Design tokens');
            document.body.appendChild(specPanel);
        }
        specPanel.innerHTML = buildSpecPanelHtml();
        specMoveHandler = (e) => {
            if (!document.body.classList.contains('spec-mode')) return;
            if (specPanel && specPanel.contains(e.target)) {
                clearSpecHighlight();
                hideSpecTooltip();
                return;
            }
            if (e.target.closest && e.target.closest('header')) {
                clearSpecHighlight();
                hideSpecTooltip();
                return;
            }
            const el = e.target;
            if (el.nodeType !== 1) return;
            clearSpecHighlight();
            specLastEl = el;
            el.classList.add('spec-mode-highlight');
            showSpecTooltip(e.clientX, e.clientY, buildSpecTooltipText(el));
        };
        document.addEventListener('mousemove', specMoveHandler, true);
    } else {
        clearSpecHighlight();
        hideSpecTooltip();
        if (specMoveHandler) {
            document.removeEventListener('mousemove', specMoveHandler, true);
            specMoveHandler = null;
        }
        if (specPanel) {
            specPanel.remove();
            specPanel = null;
        }
        if (specTooltip) {
            specTooltip.remove();
            specTooltip = null;
        }
    }
}

if (specToggle) {
    specToggle.addEventListener('click', () => {
        setSpecMode(!document.body.classList.contains('spec-mode'));
    });
}

if (localStorage.getItem('specMode') === 'on') {
    setSpecMode(true);
}

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (document.body.classList.contains('spec-mode')) {
        setSpecMode(false);
    }
});

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

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveNavLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);
window.addEventListener('load', setActiveNavLink);

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

// Figma Plugin tabs (run when DOM is ready)
function initPluginTabs() {
    const section = document.getElementById('case-studies');
    const projectList = document.querySelector('#case-studies .project-list');
    const pluginTabs = document.querySelectorAll('.plugin-tab');
    if (!section || !projectList || !pluginTabs.length) return;

    function setPluginTab(category) {
        projectList.setAttribute('data-active-category', category);
        pluginTabs.forEach(tab => {
            const isActive = tab.getAttribute('data-category') === category;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });
    }

    function handleTabSelect(tab) {
        const category = tab.getAttribute('data-category');
        if (category) setPluginTab(category);
    }

    // Delegate to section so taps on tabs always hit this (mobile-friendly)
    section.addEventListener('click', (e) => {
        const tab = e.target.closest('.plugin-tab');
        if (tab) {
            e.preventDefault();
            e.stopPropagation();
            handleTabSelect(tab);
        }
    });
    section.addEventListener('touchend', (e) => {
        const tab = e.target.closest('.plugin-tab');
        if (tab) {
            e.preventDefault();
            e.stopPropagation();
            handleTabSelect(tab);
        }
    }, { passive: false });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPluginTabs);
} else {
    initPluginTabs();
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

