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
                return currentPath === '/' || currentPath === '/experience';
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

// Nav dropdown menus (Work & Notes)
(function initNavDropdowns() {
    const WORK_ITEMS = [
        {
            href: '/projects/c1b/',
            image: '/images/work/c1b-design-system-cover.png',
            title: 'Design System and Product for a large Credit Card Company',
            description: 'I designed the design system and the product for a large credit card company.'
        },
        {
            href: '/projects/wasai/',
            image: '/images/work/wasai-visual-app-cover.png',
            title: 'Visual App Design System',
            description: 'Design system for an AI image generation platform'
        },
        {
            href: '/projects/axs/',
            image: '/images/work/axs-4x3.png',
            title: 'AXS Ticketing',
            description: 'Event ticketing and seat selection platform'
        },
        {
            href: '/projects/paramount/',
            image: '/images/work/paramount-streaming-cover.png',
            title: 'Paramount+',
            description: 'Streaming platform experience design'
        },
        {
            href: '/projects/publix/',
            image: '/images/work/publix-design-system-cover.png',
            title: 'Publix',
            description: 'Grocery e-commerce and delivery experience'
        }
    ];

    const SIDE_PROJECTS = [
        {
            href: 'https://espressoterminal.com/',
            image: '/images/work/espresso-terminal-light.png',
            title: 'Espresso Terminal',
            description: 'A terminal for designers that\'s less intimidating and more designer friendly.',
            external: true
        },
        {
            href: 'https://coffeeorderai.com/',
            image: '/images/work/coffee-order-cover.png',
            title: 'Coffee Order',
            description: 'Your meetings, turned into clean, structured notes.',
            external: true
        }
    ];

    const NOTES_ITEMS = [
        {
            href: '/notes/#great-first-week-lilly-creative-people',
            image: '/images/note-lilly-first-week.png',
            title: 'Great first week at my new gig with Lilly through Creative People.',
            description: 'Week one on the Lilly Design System—already impressed by the team and grateful I chose this offer.'
        },
        {
            href: '/notes/#espresso-ui-agentic-design-system',
            image: '/images/espresso-ui-cover.png',
            title: 'I\'m building a free product. An Agentic Design System called Espresso UI.',
            description: 'Giving back, growing the brand, and shipping a Figma-first system with Claude Code and Figma MCP.',
            logoThumb: true
        },
        {
            href: '/notes/#design-systems-studio',
            image: '/images/designops-studio-note.png',
            title: 'I\'m starting something new',
            description: 'A Design Systems Studio—0 → 1 systems for startups, from Figma to production-ready agentic design systems.'
        },
        {
            href: '/notes/#lilly-design-system-role',
            image: '/images/logos/creative-people.png',
            title: 'I\'m stepping into a new design system role at Lilly',
            description: 'From CVS Health and the Rhythm Design System to Creative People, placed on Eli Lilly.',
            logoThumb: true
        }
    ];

    function createMenuItem(item) {
        const link = document.createElement('a');
        link.href = item.href;
        link.className = 'nav-menu-item';
        link.setAttribute('role', 'menuitem');

        if (item.external) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }

        const thumbWrap = document.createElement('div');
        thumbWrap.className = 'nav-menu-thumb-wrap' + (item.logoThumb ? ' nav-menu-thumb-wrap--logo' : '');

        const img = document.createElement('img');
        img.className = 'nav-menu-thumb';
        img.src = item.image;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        thumbWrap.appendChild(img);

        const text = document.createElement('div');
        text.className = 'nav-menu-text';

        const title = document.createElement('span');
        title.className = 'nav-menu-title';
        title.textContent = item.title;

        const desc = document.createElement('span');
        desc.className = 'nav-menu-desc';
        desc.textContent = item.description;

        text.appendChild(title);
        text.appendChild(desc);
        link.appendChild(thumbWrap);
        link.appendChild(text);

        return link;
    }

    function createMenuList(items) {
        const list = document.createElement('ul');
        list.className = 'nav-menu-list';
        list.setAttribute('role', 'none');

        items.forEach(item => {
            const li = document.createElement('li');
            li.setAttribute('role', 'none');
            li.appendChild(createMenuItem(item));
            list.appendChild(li);
        });

        return list;
    }

    function createColumn(label, items) {
        const col = document.createElement('div');
        col.className = 'nav-menu-col';

        const labelEl = document.createElement('p');
        labelEl.className = 'nav-menu-col-label';
        labelEl.textContent = label;

        col.appendChild(labelEl);
        col.appendChild(createMenuList(items));

        return col;
    }

    function buildWorkMenu() {
        const menu = document.createElement('div');
        menu.className = 'nav-menu nav-menu--work';
        menu.setAttribute('role', 'menu');
        menu.setAttribute('aria-label', 'Work');

        const panel = document.createElement('div');
        panel.className = 'nav-menu-panel';

        const columns = document.createElement('div');
        columns.className = 'nav-menu-columns';
        columns.appendChild(createColumn('Recent Work', WORK_ITEMS));
        columns.appendChild(createColumn('Side Projects', SIDE_PROJECTS));

        panel.appendChild(columns);
        menu.appendChild(panel);

        return menu;
    }

    function buildNotesMenu() {
        const menu = document.createElement('div');
        menu.className = 'nav-menu nav-menu--notes';
        menu.setAttribute('role', 'menu');
        menu.setAttribute('aria-label', 'Notes');

        const panel = document.createElement('div');
        panel.className = 'nav-menu-panel';
        panel.appendChild(createMenuList(NOTES_ITEMS));

        menu.appendChild(panel);

        return menu;
    }

    function wrapNavLink(link, menu) {
        const wrapper = document.createElement('div');
        wrapper.className = 'nav-item nav-item--has-menu';

        link.parentNode.insertBefore(wrapper, link);
        wrapper.appendChild(link);
        wrapper.appendChild(menu);

        let closeTimer = null;

        function openMenu() {
            window.clearTimeout(closeTimer);
            wrapper.classList.add('is-open');
        }

        function scheduleClose() {
            window.clearTimeout(closeTimer);
            closeTimer = window.setTimeout(() => {
                wrapper.classList.remove('is-open');
            }, 120);
        }

        wrapper.addEventListener('mouseenter', openMenu);
        wrapper.addEventListener('mouseleave', scheduleClose);
        wrapper.addEventListener('focusin', openMenu);
        wrapper.addEventListener('focusout', (event) => {
            if (!wrapper.contains(event.relatedTarget)) {
                scheduleClose();
            }
        });

        menu.querySelectorAll('.nav-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                wrapper.classList.remove('is-open');
            });
        });
    }

    const workLink = document.querySelector('header .nav-link[href="/"], header .nav-link[href="#home"]');
    const notesLink = document.querySelector('header .nav-link[href="/notes/"]');

    if (workLink) {
        wrapNavLink(workLink, buildWorkMenu());
    }

    if (notesLink) {
        wrapNavLink(notesLink, buildNotesMenu());
    }
})();

/** Poké Ball easter egg: shake, throw, reveal Pikachu (home only) */
(function initPokeballWidget() {
    const widget = document.getElementById('pokeball-widget');
    const btn = document.getElementById('pokeball-btn');
    const reveal = document.getElementById('pokeball-reveal');
    if (!widget || !btn || !reveal) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isAnimating = false;
    let isOpen = false;

    function resetClasses() {
        widget.classList.remove('is-active', 'is-shaking', 'is-throwing', 'is-revealing', 'is-visible');
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

    function openReveal() {
        reveal.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        hideBall();
        widget.classList.add('is-active', 'is-revealing');

        window.setTimeout(() => {
            widget.classList.add('is-visible');
            widget.classList.remove('is-revealing');
            isAnimating = false;
            isOpen = true;
        }, reducedMotion ? 50 : 900);
    }

    function closeReveal() {
        isOpen = false;
        isAnimating = false;
        resetClasses();
        reveal.hidden = true;
        showBall();

        const pikachu = reveal.querySelector('.pikachu-reveal');
        const caption = reveal.querySelector('.pikachu-reveal__caption');
        if (pikachu) {
            pikachu.style.animation = 'none';
            pikachu.style.opacity = '';
            pikachu.style.transform = '';
        }
        if (caption) {
            caption.style.animation = 'none';
            caption.style.opacity = '';
        }
    }

    function playCatchSequence() {
        if (isAnimating) return;
        if (isOpen) {
            closeReveal();
            return;
        }

        isAnimating = true;
        widget.classList.add('is-active', 'is-shaking');

        window.setTimeout(() => {
            widget.classList.remove('is-shaking');
            widget.classList.add('is-throwing');
        }, reducedMotion ? 0 : 650);

        window.setTimeout(() => {
            openReveal();
        }, reducedMotion ? 80 : 1100);
    }

    btn.addEventListener('click', (event) => {
        event.stopPropagation();
        playCatchSequence();
    });

    reveal.addEventListener('click', () => {
        if (isOpen && !isAnimating) closeReveal();
    });

    document.addEventListener('click', (event) => {
        if (!isOpen || isAnimating) return;
        if (!widget.contains(event.target)) closeReveal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen && !isAnimating) closeReveal();
    });
})();

