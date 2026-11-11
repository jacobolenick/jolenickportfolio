(function initHomeSkeleton() {
    if (!document.getElementById('home')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.body.classList.add('skeleton-loading');
    window.setTimeout(() => {
        document.body.classList.remove('skeleton-loading');
    }, 750);
})();

/** Hero line grid: hidden until hover; spotlight reveals grid near the cursor */
(function initHeroGrid() {
    const hero = document.querySelector('.hero-section');
    const grid = document.querySelector('.hero-grid');
    if (!hero || !grid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const spotlightRadius = 220;
    const spotlightFalloff = 0.45;
    const maxOpacity = 0.9;

    function clearSpotlight() {
        grid.style.opacity = '0';
        grid.style.webkitMaskImage = 'none';
        grid.style.maskImage = 'none';
    }

    function setSpotlight(clientX, clientY) {
        const rect = grid.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const mask = `radial-gradient(circle ${spotlightRadius}px at ${x}px ${y}px, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, ${spotlightFalloff}) 42%, transparent 72%)`;

        grid.style.opacity = String(maxOpacity);
        grid.style.webkitMaskImage = mask;
        grid.style.maskImage = mask;
    }

    hero.addEventListener('mouseenter', (event) => {
        setSpotlight(event.clientX, event.clientY);
    });

    hero.addEventListener('mousemove', (event) => {
        setSpotlight(event.clientX, event.clientY);
    });

    hero.addEventListener('mouseleave', clearSpotlight);

    clearSpotlight();
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

// Theme (light / dark)
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const htmlElement = document.documentElement;

localStorage.removeItem('palette');
localStorage.removeItem('specMode');
htmlElement.removeAttribute('data-palette');

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
        if (typeof window.__statementPaint === 'function') {
            window.__statementPaint();
        }
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

// Active navigation link - scroll on home, pathname match elsewhere
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

// Cursor-following "View project" label + Vantage video lightbox
function initHomeWorkInteractions() {
    initWorkCardCursor();
    initVantageVideoLightbox();
}

function initWorkCardCursor() {
    const items = document.querySelectorAll('.posts-grid .work-item');
    if (!items.length) return;

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    items.forEach((item) => {
        const cursor = document.createElement('div');
        cursor.className = 'post-card-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        cursor.innerHTML =
            '<span class="post-card-cursor-label">View project</span>' +
            '<span class="material-icons post-card-cursor-arrow" aria-hidden="true">arrow_forward</span>';
        item.appendChild(cursor);

        const moveCursor = (event) => {
            const rect = item.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;
        };

        item.addEventListener('mouseenter', (event) => {
            item.classList.add('is-hovering');
            moveCursor(event);
        });

        if (!prefersReducedMotion) {
            item.addEventListener('mousemove', moveCursor);
        }

        item.addEventListener('mouseleave', () => {
            item.classList.remove('is-hovering');
        });

        cursor.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            item.click();
        });
    });
}

function initVantageVideoLightbox() {
    const grid = document.querySelector('.posts-grid');
    const modal = document.getElementById('vantage-video-modal');
    const backdrop = document.getElementById('vantage-video-backdrop');
    const closeBtn = document.getElementById('vantage-video-close');
    const previewVideo = document.getElementById('vantage-video');
    const modalVideo = document.getElementById('vantage-modal-video');
    if (!grid || !modal || !backdrop || !closeBtn || !previewVideo || !modalVideo) return;

    let isOpen = false;
    let lastFocusedElement = null;

    function openModal() {
        if (isOpen) return;
        isOpen = true;
        lastFocusedElement = document.activeElement;
        previewVideo.pause();
        modal.hidden = false;
        modal.classList.add('is-open');
        document.body.classList.add('video-lightbox-open');
        modalVideo.currentTime = 0;
        modalVideo.play().catch(() => {});
        closeBtn.focus();
    }

    function closeModal() {
        if (!isOpen) return;
        isOpen = false;
        modal.classList.remove('is-open');
        modal.hidden = true;
        document.body.classList.remove('video-lightbox-open');
        modalVideo.pause();
        modalVideo.currentTime = 0;
        previewVideo.play().catch(() => {});
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    grid.addEventListener('click', (event) => {
        const card = event.target.closest('.video-card--lightbox');
        if (!card || !grid.contains(card)) return;
        if (event.target.closest('.video-controls')) return;
        event.preventDefault();
        openModal();
    });

    grid.addEventListener('keydown', (event) => {
        const card = event.target.closest('.video-card--lightbox');
        if (!card || !grid.contains(card)) return;
        if (event.target.closest('.video-controls')) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openModal();
        }
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen) closeModal();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomeWorkInteractions);
} else {
    initHomeWorkInteractions();
}

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
    button.addEventListener('click', function(e) {
        e.stopPropagation();
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

// Legacy note hash URLs → individual note pages
(function redirectLegacyNoteHash() {
    const hash = window.location.hash.slice(1);
    if (!hash || !document.querySelector('.notes-list-section')) return;
    window.location.replace(`/notes/${hash}/`);
})();

// Notes page: Posts vs List view toggle
(function initNotesViewToggle() {
    const section = document.querySelector('.notes-list-section');
    const tabs = document.querySelectorAll('.notes-view-tab');
    if (!section || !tabs.length) return;

    const STORAGE_KEY = 'notes-view';

    function setView(view) {
        section.setAttribute('data-notes-view', view);
        tabs.forEach(tab => {
            const isActive = tab.getAttribute('data-view') === view;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });
        try {
            localStorage.setItem(STORAGE_KEY, view);
        } catch (_) {}
    }

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'posts' || saved === 'grid') setView('grid');
        else if (saved === 'list') setView('list');
    } catch (_) {}

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const view = tab.getAttribute('data-view');
            if (view) setView(view);
        });
    });
})();

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
        if (sectionId === 'work' && typeof list._syncWorkStack === 'function') {
            requestAnimationFrame(() => list._syncWorkStack());
        }
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
    initCategoryTabs('work', '.posts-grid', '.work-tabs .plugin-tab');
    initCategoryTabs('figma-plugins', '.project-list', '.plugin-tab');
}

function initWorkStackOnHome() {
    initWorkStack();
}

function getWorkStackSurface(item) {
    if (item.classList.contains('post-card')) return item;
    return item.querySelector('.post-card');
}

function initWorkStack() {
    const section = document.getElementById('work');
    const list = section ? section.querySelector('.posts-grid') : null;
    if (!list) return;

    if (!list.dataset.stackTrackReady) {
        const track = document.createElement('div');
        track.className = 'work-stack-track';
        const items = [...list.querySelectorAll(':scope > .work-item')];
        items.forEach((item, index) => {
            track.appendChild(item);
            if (index < items.length - 1) {
                const spacer = document.createElement('div');
                spacer.className = 'work-stack-spacer';
                spacer.setAttribute('aria-hidden', 'true');
                track.appendChild(spacer);
            }
        });
        list.appendChild(track);
        list.dataset.stackTrackReady = 'true';
    }

    const header = document.querySelector('header');

    function syncOffset() {
        const height = header ? Math.ceil(header.getBoundingClientRect().height) : 64;
        const offset = `${height + 10}px`;
        document.documentElement.style.setProperty('--work-stack-offset', offset);
        list.style.setProperty('--work-stack-offset', offset);
    }

    function isWorkItemVisible(item) {
        return getComputedStyle(item).display !== 'none';
    }

    function syncIndexes() {
        let index = 0;
        list.querySelectorAll('.work-item').forEach((item) => {
            if (!isWorkItemVisible(item)) return;
            item.style.setProperty('--stack-index', String(index));
            item.style.marginBottom = '';
            index += 1;
        });
    }

    function syncSpacers() {
        const track = list.querySelector('.work-stack-track');
        if (!track) return;
        const children = [...track.children];
        children.forEach((el, i) => {
            if (!el.classList.contains('work-stack-spacer')) return;
            let prev = null;
            let next = null;
            for (let j = i - 1; j >= 0; j -= 1) {
                if (children[j].classList.contains('work-item')) {
                    prev = children[j];
                    break;
                }
            }
            for (let j = i + 1; j < children.length; j += 1) {
                if (children[j].classList.contains('work-item')) {
                    next = children[j];
                    break;
                }
            }
            const show = prev && next && isWorkItemVisible(prev) && isWorkItemVisible(next);
            el.style.display = show ? '' : 'none';
        });
    }

    function paintDepth() {
        const track = list.querySelector('.work-stack-track');
        if (!track) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const peek = parseFloat(getComputedStyle(list).getPropertyValue('--work-stack-peek')) || 12;
        const items = [...track.children].filter(
            (el) => el.classList.contains('work-item') && isWorkItemVisible(el)
        );

        items.forEach((item, index) => {
            const surface = getWorkStackSurface(item);
            if (!surface) return;

            if (reducedMotion) {
                surface.style.removeProperty('--stack-scale');
                surface.style.removeProperty('--stack-tz');
                surface.style.removeProperty('--stack-ty');
                surface.style.removeProperty('--stack-opacity');
                return;
            }

            const baseRect = item.getBoundingClientRect();
            let depth = 0;

            for (let j = index + 1; j < items.length; j += 1) {
                const overTop = items[j].getBoundingClientRect().top;
                const separation = overTop - baseRect.top;
                const stackedSep = (j - index) * peek;
                const looseSep = Math.max(baseRect.height * 0.88, 300);
                if (looseSep <= stackedSep + 1) continue;

                if (separation <= stackedSep + 6) {
                    depth = j - index;
                    continue;
                }

                const t = Math.max(0, Math.min(1, (looseSep - separation) / (looseSep - stackedSep)));
                if (t > 0.001) {
                    depth = (j - index - 1) + t;
                    break;
                }
            }

            depth = Math.min(depth, 4);
            const scale = Math.max(0.86, 1 - depth * 0.045);
            const tz = -depth * 72;
            const ty = depth * 10;
            const opacity = Math.max(0.62, 1 - depth * 0.09);

            surface.style.setProperty('--stack-scale', scale.toFixed(4));
            surface.style.setProperty('--stack-tz', `${tz.toFixed(1)}px`);
            surface.style.setProperty('--stack-ty', `${ty.toFixed(1)}px`);
            surface.style.setProperty('--stack-opacity', opacity.toFixed(4));
        });
    }

    let depthRaf = false;
    function scheduleDepthPaint() {
        if (depthRaf) return;
        depthRaf = true;
        requestAnimationFrame(() => {
            depthRaf = false;
            paintDepth();
        });
    }

    function syncAll() {
        syncOffset();
        syncIndexes();
        syncSpacers();
        paintDepth();
    }

    syncAll();
    window.addEventListener('resize', syncAll);
    window.addEventListener('load', syncAll);
    window.addEventListener('scroll', scheduleDepthPaint, { passive: true });
    list._syncWorkStack = syncAll;
}

function initStatementFill() {
    const blocks = document.querySelectorAll('[data-statement]');
    if (!blocks.length) return;

    const words = [];
    blocks.forEach((block) => {
        const text = block.textContent.trim().replace(/\s+/g, ' ');
        block.textContent = '';
        text.split(' ').forEach((word, index, list) => {
            const span = document.createElement('span');
            span.className = 'statement-word';
            span.textContent = word;
            block.appendChild(span);
            words.push(span);
            if (index < list.length - 1) {
                block.appendChild(document.createTextNode(' '));
            }
        });
    });

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
        words.forEach((word) => {
            word.style.color = 'var(--primary-text)';
        });
        return;
    }

    function parseColor(input) {
        const value = input.trim();
        if (!value) return { r: 214, g: 214, b: 214, a: 1 };

        if (value.startsWith('rgba')) {
            const parts = value.match(/[\d.]+/g);
            if (parts && parts.length >= 4) {
                return {
                    r: Number(parts[0]),
                    g: Number(parts[1]),
                    b: Number(parts[2]),
                    a: Number(parts[3]),
                };
            }
        }

        if (value.startsWith('rgb')) {
            const parts = value.match(/\d+/g);
            if (parts && parts.length >= 3) {
                return { r: Number(parts[0]), g: Number(parts[1]), b: Number(parts[2]), a: 1 };
            }
        }

        if (value.startsWith('#')) {
            let hex = value.slice(1);
            if (hex.length === 3) {
                hex = hex.split('').map((c) => c + c).join('');
            }
            const num = parseInt(hex, 16);
            return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: 1 };
        }

        return { r: 214, g: 214, b: 214, a: 1 };
    }

    function readStatementPalette() {
        const rootStyle = getComputedStyle(document.documentElement);
        return {
            from: parseColor(rootStyle.getPropertyValue('--statement-scroll-muted')),
            to: parseColor(rootStyle.getPropertyValue('--statement-scroll-active')),
        };
    }

    function mixColor(from, to, progress) {
        const t = Math.min(1, Math.max(0, progress));
        const r = Math.round(from.r + (to.r - from.r) * t);
        const g = Math.round(from.g + (to.g - from.g) * t);
        const b = Math.round(from.b + (to.b - from.b) * t);
        const a = from.a + (to.a - from.a) * t;
        if (a < 0.999) {
            return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
        }
        return `rgb(${r}, ${g}, ${b})`;
    }

    function paint() {
        const { from, to } = readStatementPalette();
        const start = window.innerHeight * 0.68;
        const end = window.innerHeight * 0.4;
        const range = start - end || 1;
        words.forEach((word) => {
            const top = word.getBoundingClientRect().top;
            const progress = Math.min(1, Math.max(0, (start - top) / range));
            word.style.color = mixColor(from, to, progress);
        });
    }

    window.__statementPaint = paint;
    paint();
    window.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
}

function initAboutPhotoCarousel() {
    const root = document.querySelector('[data-about-photo-carousel]');
    if (!root) return;

    const track = root.querySelector('.about-photo-carousel__track');
    const status = document.querySelector('[data-about-photo-status]');
    const prevBtn = root.querySelector('.about-photo-carousel__arrow--prev');
    const nextBtn = root.querySelector('.about-photo-carousel__arrow--next');
    const slides = track ? [...track.querySelectorAll('.about-photo-carousel__slide')] : [];
    if (!track || !slides.length) return;

    function currentIndex() {
        const slideWidth = track.clientWidth || 1;
        return Math.round(track.scrollLeft / slideWidth);
    }

    function updateUi() {
        const index = currentIndex();
        const total = slides.length;
        if (status) {
            status.textContent = total > 1 ? `Photo ${index + 1} of ${total}` : '';
        }
        if (prevBtn) prevBtn.disabled = index <= 0;
        if (nextBtn) nextBtn.disabled = index >= total - 1;
    }

    function scrollBySlide(direction) {
        track.scrollBy({ left: track.clientWidth * direction, behavior: 'smooth' });
    }

    prevBtn?.addEventListener('click', () => scrollBySlide(-1));
    nextBtn?.addEventListener('click', () => scrollBySlide(1));
    track.addEventListener('scroll', updateUi, { passive: true });
    window.addEventListener('resize', updateUi);

    track.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            scrollBySlide(-1);
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            scrollBySlide(1);
        }
    });

    updateUi();
}

function initHorizontalFeedCarousel(section, { track, status, feedUrl, emptyMessage, loadErrorMessage, renderItems }) {
    if (!section || !track || !status) return;

    const prevBtn = section.querySelector('.social-feed-carousel__arrow--prev');
    const nextBtn = section.querySelector('.social-feed-carousel__arrow--next');

    function setStatus(message) {
        status.textContent = message || '';
    }

    function updateArrows() {
        if (!prevBtn || !nextBtn) return;
        const maxScroll = track.scrollWidth - track.clientWidth;
        prevBtn.disabled = track.scrollLeft <= 4;
        nextBtn.disabled = track.scrollLeft >= maxScroll - 4;
    }

    function scrollByPage(direction) {
        const card = track.querySelector('a');
        const gap = 16;
        const delta = card ? (card.offsetWidth + gap) * 2 * direction : track.clientWidth * 0.85 * direction;
        track.scrollBy({ left: delta, behavior: 'smooth' });
    }

    prevBtn?.addEventListener('click', () => scrollByPage(-1));
    nextBtn?.addEventListener('click', () => scrollByPage(1));
    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);

    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollByPage(-1);
        }
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            scrollByPage(1);
        }
    });

    fetch(feedUrl, { cache: 'no-cache' })
        .then((res) => {
            if (!res.ok) throw new Error(`Feed HTTP ${res.status}`);
            return res.json();
        })
        .then((data) => {
            const items = renderItems(data);
            if (!items.length) {
                setStatus(emptyMessage);
                return;
            }

            track.replaceChildren();
            items.forEach((node) => track.appendChild(node));

            section.hidden = false;
            setStatus('');
            requestAnimationFrame(updateArrows);
        })
        .catch(() => {
            setStatus(loadErrorMessage);
        });
}

function getSocialFeedHost(carouselEl) {
    return carouselEl.closest('.social-feed-section') || carouselEl.parentElement;
}

function resolveSiteFeedUrl(rawUrl, fallbackPath) {
    const fallback = fallbackPath || '/data/youtube-shorts.json';
    if (!rawUrl) return fallback;
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
    try {
        return new URL(rawUrl, window.location.href).pathname;
    } catch {
        return rawUrl.startsWith('/') ? rawUrl : `/${rawUrl.replace(/^\//, '')}`;
    }
}

function initYoutubeShortsCarousels() {
    document.querySelectorAll('[data-shorts-carousel]').forEach((section) => {
        const track = section.querySelector('[data-shorts-track]');
        const status = getSocialFeedHost(section)?.querySelector('[data-shorts-status]');
        const feedUrl = resolveSiteFeedUrl(track?.dataset.shortsFeed, '/data/youtube-shorts.json');
        initHorizontalFeedCarousel(section, {
            track,
            status,
            feedUrl,
            emptyMessage: 'No Shorts to show yet.',
            loadErrorMessage: 'Shorts couldn\u2019t load right now. Try again later or visit @jacobtalks-baseball on YouTube.',
            renderItems(data) {
                const shorts = Array.isArray(data?.shorts) ? data.shorts : [];
                return shorts.filter((short) => short?.id).map((short) => {
                    const link = document.createElement('a');
                    link.className = 'shorts-card social-feed-card';
                    link.href = short.url || `https://www.youtube.com/shorts/${short.id}`;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.setAttribute('aria-label', short.title || 'Watch on YouTube');

                    const img = document.createElement('img');
                    img.src = short.thumbnail || `https://i.ytimg.com/vi/${short.id}/hq2.jpg`;
                    img.alt = '';
                    img.loading = 'lazy';
                    img.decoding = 'async';
                    link.appendChild(img);

                    const play = document.createElement('span');
                    play.className = 'shorts-card__play social-feed-card__badge';
                    play.setAttribute('aria-hidden', 'true');
                    play.innerHTML = '<span class="material-icons">play_arrow</span>';
                    link.appendChild(play);

                    return link;
                });
            },
        });
    });
}

function initInstagramCarousels() {
    document.querySelectorAll('[data-instagram-carousel]').forEach((section) => {
        const track = section.querySelector('[data-instagram-track]');
        const status = getSocialFeedHost(section)?.querySelector('[data-instagram-status]');
        const feedUrl = resolveSiteFeedUrl(track?.dataset.instagramFeed, '/data/instagram-posts.json');
        initHorizontalFeedCarousel(section, {
            track,
            status,
            feedUrl,
            emptyMessage: 'No Instagram posts to show yet.',
            loadErrorMessage: 'Instagram couldn\u2019t load right now. Try again later or visit @jacobtalksbaseball on Instagram.',
            renderItems(data) {
                const posts = Array.isArray(data?.posts) ? data.posts : [];
                return posts.filter((post) => post?.id && post?.thumbnail).map((post) => {
                    const link = document.createElement('a');
                    const captionText = (post.caption || '').trim();
                    link.className = 'instagram-card';
                    link.href = post.url || `https://www.instagram.com/p/${post.id}/`;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.setAttribute('aria-label', captionText || 'View on Instagram');

                    const media = document.createElement('div');
                    media.className = 'instagram-card__media social-feed-card';

                    const img = document.createElement('img');
                    const thumb = post.thumbnail;
                    img.src = thumb.startsWith('http') ? thumb : `/${thumb.replace(/^\//, '')}`;
                    img.alt = '';
                    img.loading = 'lazy';
                    img.decoding = 'async';
                    media.appendChild(img);

                    if (post.mediaType === 'reel') {
                        const badge = document.createElement('span');
                        badge.className = 'instagram-card__reel social-feed-card__badge';
                        badge.setAttribute('aria-hidden', 'true');
                        badge.innerHTML = '<span class="material-icons">movie</span>';
                        media.appendChild(badge);
                    }

                    link.appendChild(media);

                    if (captionText) {
                        const caption = document.createElement('p');
                        caption.className = 'instagram-card__caption';
                        caption.textContent = captionText;
                        link.appendChild(caption);
                    }

                    return link;
                });
            },
        });
    });
}

function initXPostsCarousels() {
    document.querySelectorAll('[data-x-carousel]').forEach((section) => {
        const track = section.querySelector('[data-x-track]');
        const status = getSocialFeedHost(section)?.querySelector('[data-x-status]');
        const feedUrl = resolveSiteFeedUrl(track?.dataset.xFeed, '/data/x-posts.json');
        initHorizontalFeedCarousel(section, {
            track,
            status,
            feedUrl,
            emptyMessage: 'No posts on X yet.',
            loadErrorMessage: 'Posts from X couldn\u2019t load right now. Try again later or visit @jtalksbaseball on X.',
            renderItems(data) {
                const posts = Array.isArray(data?.posts) ? data.posts : [];
                return posts.filter((post) => post?.id && post?.text).map((post) => {
                    const link = document.createElement('a');
                    link.className = 'x-post-card';
                    link.href = post.url || `https://x.com/jtalksbaseball/status/${post.id}`;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.setAttribute('aria-label', post.text.slice(0, 120));

                    const textEl = document.createElement('p');
                    textEl.className = 'x-post-card__text';
                    textEl.textContent = post.text;
                    link.appendChild(textEl);

                    if (post.media) {
                        const mediaWrap = document.createElement('div');
                        mediaWrap.className = 'x-post-card__media';
                        const img = document.createElement('img');
                        const src = post.media.startsWith('http')
                            ? post.media
                            : `/${post.media.replace(/^\//, '')}`;
                        img.src = src;
                        img.alt = '';
                        img.loading = 'lazy';
                        img.decoding = 'async';
                        mediaWrap.appendChild(img);

                        if (post.hasVideo) {
                            const badge = document.createElement('span');
                            badge.className = 'x-post-card__video social-feed-card__badge';
                            badge.setAttribute('aria-hidden', 'true');
                            badge.innerHTML = '<span class="material-icons">play_arrow</span>';
                            mediaWrap.appendChild(badge);
                        }

                        link.appendChild(mediaWrap);
                    }

                    return link;
                });
            },
        });
    });
}

function initProjectImageLightbox() {
    const container = document.querySelector('.project-container');
    if (!container) return;

    const selector = [
        '.project-hero-image img',
        '.project-hero-block img',
        '.section-image img',
        '.image-section img',
        '.project-gallery img',
        '.gallery-grid img',
    ].join(', ');

    const thumbEls = [...container.querySelectorAll(selector)].filter((img) => {
        const w = img.naturalWidth || img.width;
        return w === 0 || w >= 80;
    });
    if (!thumbEls.length) return;

    const items = thumbEls.map((img) => ({
        src: img.currentSrc || img.src,
        alt: img.getAttribute('alt') || '',
        caption: img.closest('figure')?.querySelector('figcaption')?.textContent?.trim() || '',
    }));

    let modal = document.getElementById('project-image-lightbox');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'project-image-lightbox';
        modal.className = 'project-image-lightbox';
        modal.hidden = true;
        modal.innerHTML = `
            <div class="project-image-lightbox__backdrop" data-project-lightbox-close></div>
            <button type="button" class="project-image-lightbox__close" aria-label="Close gallery">
                <span class="material-icons" aria-hidden="true">close</span>
            </button>
            <button type="button" class="project-image-lightbox__nav project-image-lightbox__nav--prev" aria-label="Previous image">
                <span class="material-icons" aria-hidden="true">chevron_left</span>
            </button>
            <button type="button" class="project-image-lightbox__nav project-image-lightbox__nav--next" aria-label="Next image">
                <span class="material-icons" aria-hidden="true">chevron_right</span>
            </button>
            <div class="project-image-lightbox__dialog" role="dialog" aria-modal="true" aria-label="Project image gallery">
                <figure class="project-image-lightbox__figure">
                    <img class="project-image-lightbox__img" src="" alt="">
                </figure>
                <p class="project-image-lightbox__caption" hidden></p>
                <p class="project-image-lightbox__counter"></p>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const imgEl = modal.querySelector('.project-image-lightbox__img');
    const captionEl = modal.querySelector('.project-image-lightbox__caption');
    const counterEl = modal.querySelector('.project-image-lightbox__counter');
    const prevBtn = modal.querySelector('.project-image-lightbox__nav--prev');
    const nextBtn = modal.querySelector('.project-image-lightbox__nav--next');
    const closeBtn = modal.querySelector('.project-image-lightbox__close');
    const backdrop = modal.querySelector('[data-project-lightbox-close]');
    const dialog = modal.querySelector('.project-image-lightbox__dialog');

    let index = 0;
    let lastFocus = null;
    let wheelLock = false;

    function render() {
        const item = items[index];
        imgEl.src = item.src;
        imgEl.alt = item.alt;
        if (item.caption) {
            captionEl.textContent = item.caption;
            captionEl.hidden = false;
        } else {
            captionEl.textContent = '';
            captionEl.hidden = true;
        }
        counterEl.textContent = `${index + 1} / ${items.length}`;
        const single = items.length <= 1;
        prevBtn.disabled = single;
        nextBtn.disabled = single;
        dialog.setAttribute('aria-label', item.alt || `Project image ${index + 1} of ${items.length}`);
    }

    function open(at) {
        lastFocus = document.activeElement;
        index = at;
        render();
        modal.hidden = false;
        modal.classList.add('is-open');
        document.body.classList.add('project-image-lightbox-open');
        closeBtn.focus();
    }

    function close() {
        modal.classList.remove('is-open');
        modal.hidden = true;
        document.body.classList.remove('project-image-lightbox-open');
        imgEl.removeAttribute('src');
        if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus();
        }
    }

    function step(delta) {
        if (items.length <= 1) return;
        index = (index + delta + items.length) % items.length;
        render();
    }

    thumbEls.forEach((thumb, i) => {
        thumb.classList.add('project-image-zoomable');
        if (!thumb.hasAttribute('tabindex')) {
            thumb.tabIndex = 0;
        }
        thumb.setAttribute('role', 'button');
        const openAt = () => open(i);
        thumb.addEventListener('click', openAt);
        thumb.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openAt();
            }
        });
    });

    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    prevBtn.addEventListener('click', () => step(-1));
    nextBtn.addEventListener('click', () => step(1));

    modal.addEventListener('wheel', (event) => {
        if (modal.hidden || items.length <= 1) return;
        event.preventDefault();
        if (wheelLock) return;
        wheelLock = true;
        step(event.deltaY > 0 ? 1 : -1);
        window.setTimeout(() => {
            wheelLock = false;
        }, 220);
    }, { passive: false });

    document.addEventListener('keydown', (event) => {
        if (modal.hidden) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            close();
        }
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            step(-1);
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            step(1);
        }
    });
}

const SITE_FOOTER_FIGMA_ICON = '<svg class="site-footer__social-icon" width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.00005 2.04999H5.52505C4.71043 2.04999 4.05005 2.71037 4.05005 3.52499C4.05005 4.33961 4.71043 4.99999 5.52505 4.99999H7.00005V2.04999ZM7.00005 1.04999H8.00005H9.47505C10.842 1.04999 11.95 2.15808 11.95 3.52499C11.95 4.33163 11.5642 5.04815 10.9669 5.49999C11.5642 5.95184 11.95 6.66836 11.95 7.475C11.95 8.8419 10.842 9.95 9.47505 9.95C8.92236 9.95 8.41198 9.76884 8.00005 9.46266V9.95L8.00005 11.425C8.00005 12.7919 6.89195 13.9 5.52505 13.9C4.15814 13.9 3.05005 12.7919 3.05005 11.425C3.05005 10.6183 3.43593 9.90184 4.03317 9.44999C3.43593 8.99814 3.05005 8.28163 3.05005 7.475C3.05005 6.66836 3.43594 5.95184 4.03319 5.5C3.43594 5.04815 3.05005 4.33163 3.05005 3.52499C3.05005 2.15808 4.15814 1.04999 5.52505 1.04999H7.00005ZM8.00005 2.04999V4.99999H9.47505C10.2897 4.99999 10.95 4.33961 10.95 3.52499C10.95 2.71037 10.2897 2.04999 9.47505 2.04999H8.00005ZM5.52505 8.94998H7.00005L7.00005 7.4788L7.00005 7.475L7.00005 7.4712V6H5.52505C4.71043 6 4.05005 6.66038 4.05005 7.475C4.05005 8.28767 4.70727 8.94684 5.5192 8.94999L5.52505 8.94998ZM4.05005 11.425C4.05005 10.6123 4.70727 9.95315 5.5192 9.94999L5.52505 9.95H7.00005L7.00005 11.425C7.00005 12.2396 6.33967 12.9 5.52505 12.9C4.71043 12.9 4.05005 12.2396 4.05005 11.425ZM8.00005 7.47206C8.00164 6.65879 8.66141 6 9.47505 6C10.2897 6 10.95 6.66038 10.95 7.475C10.95 8.28962 10.2897 8.95 9.47505 8.95C8.66141 8.95 8.00164 8.29121 8.00005 7.47794V7.47206Z" fill="currentColor"/></svg>';

function siteFooterSocialIconSvg(name) {
    const paths = {
        linkedin: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
        threads: '<path d="M17.743 11.123a8.547 8.547 0 00-.315-.142c-.185-3.414-2.05-5.368-5.182-5.388h-.042c-1.874 0-3.431.8-4.39 2.255l1.722 1.181c.716-1.087 1.84-1.319 2.669-1.319h.028c1.031.007 1.81.307 2.313.892.367.425.612 1.014.733 1.756a13.176 13.176 0 00-2.96-.143c-2.977.172-4.892 1.908-4.763 4.321.065 1.224.675 2.277 1.717 2.965.88.582 2.015.866 3.195.802 1.557-.086 2.778-.68 3.63-1.766.648-.825 1.057-1.894 1.238-3.241.742.448 1.292 1.037 1.596 1.745.517 1.205.547 3.184-1.068 4.797-1.415 1.414-3.116 2.025-5.686 2.044-2.851-.02-5.008-.935-6.41-2.717-1.313-1.67-1.991-4.08-2.016-7.165.025-3.085.703-5.496 2.016-7.165 1.402-1.782 3.558-2.696 6.41-2.717 2.871.02 5.065.94 6.521 2.73.714.879 1.252 1.983 1.607 3.27l2.018-.538c-.43-1.585-1.107-2.95-2.027-4.083C18.43 1.2 15.7.024 12.185 0h-.014C8.66.024 5.963 1.205 4.15 3.51c-1.614 2.05-2.446 4.905-2.474 8.482v.016c.028 3.578.86 6.431 2.473 8.482 1.813 2.305 4.512 3.486 8.022 3.51h.014c3.12-.022 5.319-.839 7.13-2.649 2.371-2.368 2.3-5.336 1.518-7.158-.56-1.307-1.629-2.368-3.09-3.07zm-5.387 5.065c-1.305.074-2.66-.512-2.728-1.766-.05-.93.662-1.969 2.808-2.092.246-.015.487-.021.724-.021.78 0 1.508.075 2.171.22-.247 3.088-1.697 3.59-2.975 3.66z"/>',
        instagram: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.881.001 1.44 1.44 0 012.881-.001z"/>',
        tiktok: '<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.5a8.28 8.28 0 004.8 1.52v-3.44a4.85 4.85 0 01-1.05-.09z"/>',
        facebook: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
        x: '<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83-9.032-11.863h7.59l5.243 6.932 6.026-6.932zm-1.291 19.494h2.039L7.486 3.24H5.316l12.294 17.407z"/>',
    };
    const body = paths[name];
    if (!body) return '';
    return `<svg class="site-footer__social-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
}

function getSiteFooterSocialLinksHtml() {
    const items = [
        ['https://linkedin.com/in/jacobmolenick', 'LinkedIn', siteFooterSocialIconSvg('linkedin')],
        ['https://www.figma.com/@jacobolenick', 'Figma', SITE_FOOTER_FIGMA_ICON],
        ['https://www.threads.com/@jacobtalksbaseball', 'Threads', siteFooterSocialIconSvg('threads')],
        ['https://www.instagram.com/jacobtalksbaseball', 'Instagram', siteFooterSocialIconSvg('instagram')],
        ['https://www.tiktok.com/@jacobtalksbaseball', 'TikTok', siteFooterSocialIconSvg('tiktok')],
        ['https://www.facebook.com/profile.php?id=61595596657892', 'Facebook', siteFooterSocialIconSvg('facebook')],
        ['https://x.com/jtalksbaseball', 'X', siteFooterSocialIconSvg('x')],
    ];
    return items
        .map(
            ([href, label, icon]) =>
                `<a href="${href}" class="site-footer__social-link" aria-label="${label}" target="_blank" rel="noopener noreferrer">${icon}</a>`
        )
        .join('');
}

function getSiteFooterMarkup() {
    return (
        '<div class="site-footer__inner">' +
        '<div class="site-footer__top">' +
        '<div class="site-footer__lead">' +
        '<a href="https://www.youtube.com/@jacobtalks-baseball" class="site-footer__cta site-footer__cta--lead" target="_blank" rel="noopener noreferrer">' +
        'I create Baseball content online around the MLB and MiLB.' +
        '<span class="site-footer__cta-arrow" aria-hidden="true">↗</span></a></div>' +
        '<nav class="site-footer__nav" aria-label="Footer">' +
        '<a href="/">Home</a>' +
        '<a href="/#work">Projects</a>' +
        '<a href="/experience.html">Professional path</a>' +
        '<a href="/about/">About</a>' +
        '</nav>' +
        `<div class="site-footer__social" aria-label="Social links">${getSiteFooterSocialLinksHtml()}</div>` +
        '</div>' +
        '<div class="site-footer__meta">' +
        '<p>© 2026 Jacob Olenick. All rights reserved.</p>' +
        '<p>Designed &amp; built with care.</p>' +
        '</div>' +
        '<p class="site-footer__wordmark" aria-hidden="true">Jacob Olenick</p>' +
        '</div>'
    );
}

function initSiteFooter() {
    const existing = document.querySelector('.site-footer');
    if (existing) {
        const social = existing.querySelector('.site-footer__social');
        if (social) social.innerHTML = getSiteFooterSocialLinksHtml();
        return;
    }

    const main = document.querySelector('main');
    if (!main) return;

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = getSiteFooterMarkup();
    main.insertAdjacentElement('afterend', footer);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initPluginTabs();
        initWorkStackOnHome();
        initStatementFill();
        initAboutPhotoCarousel();
        initYoutubeShortsCarousels();
        initXPostsCarousels();
        initProjectImageLightbox();
        initSiteFooter();
    });
} else {
    initPluginTabs();
    initWorkStackOnHome();
    initStatementFill();
    initAboutPhotoCarousel();
    initYoutubeShortsCarousels();
    initXPostsCarousels();
    initProjectImageLightbox();
    initSiteFooter();
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

/** Baseball card easter egg — site-wide floating button + spinning chrome card modal */
(function initBaseballCardWidget() {
    if (document.getElementById('baseball-card-widget')) return;

    function assetUrl(relativePath) {
        const path = relativePath.replace(/^\//, '');
        const segments = window.location.pathname.split('/').filter(Boolean);
        if (segments.length && /\.[a-z0-9]+$/i.test(segments[segments.length - 1])) {
            segments.pop();
        }
        const prefix = segments.length ? `${'../'.repeat(segments.length)}` : '';
        return `${prefix}${path}`;
    }

    const widget = document.createElement('div');
    widget.id = 'baseball-card-widget';
    widget.className = 'baseball-card-widget';
    widget.innerHTML = `
        <button type="button" class="baseball-card-widget__btn" id="baseball-card-trigger" aria-label="Open Jacob Olenick baseball card" aria-haspopup="dialog">
            ⚾
        </button>
    `;

    const modal = document.createElement('div');
    modal.id = 'baseball-card-modal';
    modal.className = 'baseball-card-modal';
    modal.hidden = true;
    modal.innerHTML = `
        <div class="baseball-card-modal__backdrop" data-baseball-card-close></div>
        <div class="baseball-card-modal__dialog" role="dialog" aria-modal="true" aria-label="Jacob Olenick Topps Chrome baseball card">
            <button type="button" class="baseball-card-modal__close" data-baseball-card-close aria-label="Close baseball card">
                <span class="material-icons" aria-hidden="true">close</span>
            </button>
            <div class="baseball-card-scene">
                <div class="baseball-card-stage">
                    <div class="baseball-card-spin-wrap" aria-hidden="true">
                        <div class="baseball-card-spin">
                            <div class="baseball-card-face baseball-card-face--front">
                                <img src="" alt="Jacob Olenick baseball card front" width="1000" height="1400" decoding="async">
                                <span class="baseball-card-shine" aria-hidden="true"></span>
                            </div>
                            <div class="baseball-card-face baseball-card-face--back">
                                <img src="" alt="Jacob Olenick baseball card back with bio" width="1000" height="1400" decoding="async">
                                <span class="baseball-card-shine" aria-hidden="true"></span>
                            </div>
                        </div>
                    </div>
                    <div class="baseball-pack-wrapper" aria-hidden="true">
                        <div class="baseball-pack-wrapper__sealed-layer">
                            <img class="baseball-pack-wrapper__sealed" src="" alt="" width="598" height="655" decoding="async">
                            <span class="baseball-pack-wrapper__shine" aria-hidden="true"></span>
                        </div>
                        <div class="baseball-pack-wrapper__rip">
                            <div class="baseball-pack-wrapper__half baseball-pack-wrapper__half--left">
                                <img src="" alt="" width="598" height="655" decoding="async">
                            </div>
                            <div class="baseball-pack-wrapper__half baseball-pack-wrapper__half--right">
                                <img src="" alt="" width="598" height="655" decoding="async">
                            </div>
                        </div>
                    </div>
                    <div class="baseball-card-burst" aria-hidden="true">
                        <span class="baseball-card-burst__rays" aria-hidden="true"></span>
                        <span class="baseball-card-burst__ring" aria-hidden="true"></span>
                        <span class="baseball-card-burst__core" aria-hidden="true"></span>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(widget);
    document.body.appendChild(modal);

    const trigger = document.getElementById('baseball-card-trigger');
    const frontImg = modal.querySelector('.baseball-card-face--front img');
    const backImg = modal.querySelector('.baseball-card-face--back img');
    const packWrapperUrl = assetUrl('images/baseball-pack-wrapper.png');
    modal.querySelectorAll('.baseball-pack-wrapper img').forEach((img) => {
        img.src = packWrapperUrl;
    });

    const cardSpinWrap = modal.querySelector('.baseball-card-spin-wrap');
    const packWrapper = modal.querySelector('.baseball-pack-wrapper');
    const cardDialog = modal.querySelector('.baseball-card-modal__dialog');

    const CARD_VARIANTS = [
        {
            front: 'images/baseball-card-topps-front.png',
            back: 'images/baseball-card-topps-back.png',
            frontAlt: 'Jacob Olenick Topps baseball card front',
            backAlt: 'Jacob Olenick Topps baseball card back with bio',
            dialogLabel: 'Jacob Olenick Topps baseball card',
        },
        {
            front: 'images/baseball-card-heritage-front.png',
            back: 'images/baseball-card-heritage-back.png',
            frontAlt: 'Jacob Olenick Topps Heritage baseball card front',
            backAlt: 'Jacob Olenick Topps Heritage baseball card back with bio',
            dialogLabel: 'Jacob Olenick Topps Heritage baseball card',
        },
    ];

    let lastCardIndex = -1;

    function pickCardVariant() {
        if (CARD_VARIANTS.length === 1) return CARD_VARIANTS[0];
        let index = Math.floor(Math.random() * CARD_VARIANTS.length);
        if (CARD_VARIANTS.length > 1) {
            while (index === lastCardIndex) {
                index = Math.floor(Math.random() * CARD_VARIANTS.length);
            }
        }
        lastCardIndex = index;
        return CARD_VARIANTS[index];
    }

    function loadCardVariant(variant) {
        frontImg.src = assetUrl(variant.front);
        backImg.src = assetUrl(variant.back);
        frontImg.alt = variant.frontAlt;
        backImg.alt = variant.backAlt;
        if (cardDialog) {
            cardDialog.setAttribute('aria-label', variant.dialogLabel);
        }
    }

    CARD_VARIANTS.forEach((variant) => {
        [variant.front, variant.back].forEach((path) => {
            const preload = new Image();
            preload.src = assetUrl(path);
        });
    });

    let isOpen = false;
    let isAnimating = false;
    let lastFocus = null;
    let revealTimers = [];

    function playRipSound() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        let ctx;
        try {
            ctx = new AudioCtx();
        } catch {
            return;
        }

        const now = ctx.currentTime;
        const master = ctx.createGain();
        master.gain.setValueAtTime(0, now);
        master.gain.linearRampToValueAtTime(0.28, now + 0.01);
        master.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        master.connect(ctx.destination);

        const length = Math.floor(ctx.sampleRate * 0.35);
        const noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const samples = noiseBuffer.getChannelData(0);
        for (let i = 0; i < length; i += 1) {
            const t = i / length;
            samples[i] = (Math.random() * 2 - 1) * (1 - t) ** 0.85;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(900, now);
        filter.frequency.exponentialRampToValueAtTime(4200, now + 0.12);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.22, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(master);
        noise.start(now);
        noise.stop(now + 0.45);

        window.setTimeout(() => {
            ctx.close().catch(() => {});
        }, 600);
    }

    function playBurstSound() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        let ctx;
        try {
            ctx = new AudioCtx();
        } catch {
            return;
        }

        const now = ctx.currentTime;
        const master = ctx.createGain();
        master.gain.setValueAtTime(0, now);
        master.gain.linearRampToValueAtTime(0.38, now + 0.02);
        master.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
        master.connect(ctx.destination);

        const sweep = ctx.createOscillator();
        const sweepGain = ctx.createGain();
        sweep.type = 'sine';
        sweep.frequency.setValueAtTime(220, now);
        sweep.frequency.exponentialRampToValueAtTime(2400, now + 0.35);
        sweepGain.gain.setValueAtTime(0, now);
        sweepGain.gain.linearRampToValueAtTime(0.2, now + 0.04);
        sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
        sweep.connect(sweepGain);
        sweepGain.connect(master);
        sweep.start(now);
        sweep.stop(now + 0.8);

        [1047, 1319, 1760, 2093].forEach((freq, i) => {
            const t = now + 0.08 + i * 0.04;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.08, t + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
            osc.connect(gain);
            gain.connect(master);
            osc.start(t);
            osc.stop(t + 0.6);
        });

        window.setTimeout(() => {
            ctx.close().catch(() => {});
        }, 1200);
    }

    function playRevealSound() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        let ctx;
        try {
            ctx = new AudioCtx();
        } catch {
            return;
        }

        const now = ctx.currentTime;
        const master = ctx.createGain();
        master.gain.setValueAtTime(0, now);
        master.gain.linearRampToValueAtTime(0.32, now + 0.015);
        master.gain.exponentialRampToValueAtTime(0.001, now + 1.35);
        master.connect(ctx.destination);

        [660, 880, 1175, 1568, 2093].forEach((freq, i) => {
            const t = now + i * 0.055;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.11, t + 0.035);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
            osc.connect(gain);
            gain.connect(master);
            osc.start(t);
            osc.stop(t + 0.5);
        });

        const length = Math.floor(ctx.sampleRate * 0.22);
        const noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const samples = noiseBuffer.getChannelData(0);
        for (let i = 0; i < length; i += 1) {
            samples[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 1.4;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2800, now);
        filter.Q.value = 1.2;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.07, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(master);
        noise.start(now);
        noise.stop(now + 0.3);

        window.setTimeout(() => {
            ctx.close().catch(() => {});
        }, 1500);
    }

    function clearRevealTimers() {
        revealTimers.forEach((id) => window.clearTimeout(id));
        revealTimers = [];
    }

    function scheduleReveal(fn, delay) {
        revealTimers.push(window.setTimeout(fn, delay));
    }

    function resetRevealState() {
        clearRevealTimers();
        modal.classList.remove('is-ripping', 'is-burst', 'is-revealed');
        isAnimating = false;
        if (cardSpinWrap) cardSpinWrap.setAttribute('aria-hidden', 'true');
        if (packWrapper) packWrapper.setAttribute('aria-hidden', 'true');
    }

    function finishRevealFocus() {
        isAnimating = false;
        if (cardSpinWrap) cardSpinWrap.setAttribute('aria-hidden', 'false');
        if (packWrapper) packWrapper.setAttribute('aria-hidden', 'true');
        modal.querySelector('.baseball-card-modal__close')?.focus();
    }

    function openModal() {
        if (isOpen || isAnimating) return;

        lastFocus = document.activeElement;
        resetRevealState();
        loadCardVariant(pickCardVariant());
        isAnimating = true;
        modal.hidden = false;
        modal.classList.add('is-open');
        document.body.classList.add('baseball-card-open');
        isOpen = true;

        if (packWrapper) packWrapper.setAttribute('aria-hidden', 'false');

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) {
            modal.classList.add('is-revealed');
            finishRevealFocus();
            return;
        }

        scheduleReveal(() => {
            modal.classList.add('is-ripping');
            playRipSound();
        }, 420);

        scheduleReveal(() => {
            modal.classList.add('is-burst');
            playBurstSound();
        }, 960);

        scheduleReveal(() => {
            playRevealSound();
            modal.classList.add('is-revealed');
        }, 1580);

        scheduleReveal(finishRevealFocus, 2200);
    }

    function closeModal() {
        resetRevealState();
        modal.classList.remove('is-open', 'is-revealed', 'is-ripping', 'is-burst');
        modal.hidden = true;
        document.body.classList.remove('baseball-card-open');
        isOpen = false;
        if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus();
        }
    }

    trigger.addEventListener('click', openModal);
    modal.querySelectorAll('[data-baseball-card-close]').forEach((el) => {
        el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen) {
            event.preventDefault();
            closeModal();
        }
    });
})();

