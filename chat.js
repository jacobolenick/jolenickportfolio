/**
 * Site chat - answers questions from a knowledge base built from
 * content on jacobolenick.com (work, career, sports, about, etc.).
 */
(function initSiteChat() {
    const EXPERIENCE = [
        {
            company: 'Creative People (placed on Eli Lilly)',
            aliases: ['lilly', 'eli lilly', 'creative people', 'current', 'present', 'now'],
            role: 'Senior Product Designer, Design Systems (Super IC)',
            dates: 'April 26 - Present',
            detail: 'Helps design and build the Lilly Design System across numerous sites and pages.'
        },
        {
            company: 'DesignOps Studio',
            aliases: ['designops', 'design ops', 'studio', 'freelance'],
            role: 'Founder',
            dates: '2025 - Present',
            detail: 'Builds plugins, tools, UI kits, and resources for the design community, plus Design Systems client work.'
        },
        {
            company: 'CVS Health',
            aliases: ['cvs', 'cvshealth', 'cvs health', 'pharmacy', 'rhythm'],
            role: 'Lead Product Designer, Design Systems Advocate',
            dates: '2024 - March 2026',
            detail: 'Built the design system for the pharmacist application and designed the pharmacy experience (Rhythm Design System advocacy).'
        },
        {
            company: 'Adobe',
            aliases: ['adobe', 'behance', 'adobe portfolio'],
            role: 'Product Design Consultant',
            dates: '2024 - 2025',
            detail: 'Independent consultant for ~11 months on Adobe Portfolio and an integrated Behance + Adobe Portfolio experience.'
        },
        {
            company: 'Credit One Bank',
            aliases: ['credit one', 'c1b', 'credit card', 'bank'],
            role: 'Lead Product Designer and Design Systems',
            dates: '2023 - 2024',
            detail: 'Led a comprehensive design system for internal banking software - 281 Figma components across 5 workspaces.'
        },
        {
            company: 'Cisco',
            aliases: ['cisco', 'cybersecurity', 'cyber'],
            role: 'Senior Product Designer (AI)',
            dates: '2023',
            detail: 'Designed an AI dashboard for cybersecurity.'
        },
        {
            company: 'Wells Fargo',
            aliases: ['wells fargo', 'wells', 'fargo', 'vantage'],
            role: 'Senior Lead Product Designer',
            dates: '2022 - 2023',
            detail: 'Designed the Vantage product for Wells Fargo.'
        },
        {
            company: 'Paramount+',
            aliases: ['paramount', 'paramount+', 'streaming'],
            role: 'Senior Product Designer',
            dates: '2022',
            detail: 'Designed the Paramount+ main experience and contributed to the design system.'
        },
        {
            company: 'AXS',
            aliases: ['axs', 'ticketing'],
            role: 'Product Designer',
            dates: '2021',
            detail: 'Designed the design system and B2B (white-label) experience for AXS.'
        }
    ];

    const KNOWLEDGE = [
        {
            id: 'who',
            keywords: ['who is jacob', 'who is he', 'about jacob', 'bio', 'introduction'],
            answer: 'Jacob Olenick is a Product Designer focused on Design Systems. He lives in Las Vegas, NV, currently works on the Lilly Design System through Creative People, and runs DesignOps Studio on the side.'
        },
        {
            id: 'role',
            keywords: ['what does he do', 'what do you do', 'his role', 'job title', 'product designer'],
            answer: 'Jacob is a Senior Product Designer / Super IC focused on Design Systems. Right now he helps design and build the Lilly Design System through Creative People (placed on Eli Lilly).'
        },
        {
            id: 'location',
            keywords: ['where does he live', 'where do you live', 'based in', 'lives in', 'las vegas', 'location'],
            answer: 'Jacob is based in Las Vegas, NV. His home office is Vegas sports themed, and he\'s a season ticket holder for Las Vegas Lights FC.'
        },
        {
            id: 'sports',
            keywords: ['sport', 'sports', 'team', 'teams', 'soccer', 'football', 'fan', 'favorite team'],
            answer: 'Jacob loves soccer (football). He\'s a season ticket holder for Las Vegas Lights FC, supports Inter Miami CF, is a Manchester United fan, and loves Real Madrid. He also follows AC Milan, the Vegas Golden Knights, Las Vegas Aces, the Athletics, and the Las Vegas Raiders. More on the About page.'
        },
        {
            id: 'soccer-detail',
            keywords: ['manchester', 'united', 'real madrid', 'inter miami', 'messi', 'lights fc', 'ac milan'],
            answer: 'For soccer: Las Vegas Lights FC (season tickets), Inter Miami CF, Manchester United, Real Madrid, and AC Milan. Off the pitch he also cheers for Vegas Golden Knights, Las Vegas Aces, the Athletics, and the Raiders.'
        },
        {
            id: 'vegas-teams',
            keywords: ['raiders', 'aces', 'golden knights', 'athletics', 'hockey', 'wnba', 'nfl', 'mlb'],
            answer: 'Local / Vegas sports he follows include Las Vegas Lights FC, Vegas Golden Knights, Las Vegas Aces, the Athletics, and the Las Vegas Raiders.'
        },
        {
            id: 'personal',
            keywords: ['dog', 'cat', 'pet', 'pets', 'husband', 'family', 'doodle', 'kombucha'],
            answer: 'Outside of design, Jacob watches soccer with kombucha or coffee, builds digital products and experiments with interior design. He\'s a husband and a proud dog and cat dad - a golden doodle and a tuxedo cat.'
        },
        {
            id: 'contact',
            keywords: ['contact', 'email', 'reach out', 'hire', 'linkedin', 'twitter', 'threads'],
            answer: 'You can find Jacob on LinkedIn (@jacobmolenick), X (@urdesignfriend), Threads (@espressodesigner), and Figma (@jacobolenick). DesignOps Studio is at designops.studio.'
        },
        {
            id: 'projects',
            keywords: ['portfolio projects', 'case study', 'case studies', 'featured work'],
            answer: 'Featured work includes design systems and product design for Paramount+, Credit One Bank (C1B), Orgspace, Visual App / Wasai, AXS Ticketing, Publix, and Wells Fargo Vantage. Side projects include Espresso UI, Espresso Terminal, and Coffee Order. Browse Work on the home page.'
        },
        {
            id: 'orgspace',
            keywords: ['orgspace'],
            answer: 'Orgspace was about modernizing an enterprise platform - redesigning key workflows and establishing a scalable design system for organizational planning.'
        },
        {
            id: 'wasai',
            keywords: ['wasai', 'visual app'],
            answer: 'Visual App (Wasai) is a design system Jacob built for an AI image generation platform.'
        },
        {
            id: 'publix',
            keywords: ['publix', 'grocery'],
            answer: 'Publix work focused on the digital design system and grocery e-commerce / delivery experience across web and mobile platforms.'
        },
        {
            id: 'espresso-terminal',
            keywords: ['espresso terminal'],
            answer: 'Espresso Terminal is a side project Jacob designed and developed - a terminal for designers that\'s less intimidating and more designer-friendly. Live at espressoterminal.com.'
        },
        {
            id: 'coffee-order',
            keywords: ['coffee order', 'coffeeorder'],
            answer: 'Coffee Order turns meetings into clean, structured notes. It listens to calls (Zoom, Meet, Teams) and uses AI to generate headings, todos, callouts, and quotes. See coffeeorderai.com.'
        },
        {
            id: 'espresso-ui',
            keywords: ['espresso ui', 'espressoui', 'shadcn', 'figma library', 'agentic design system'],
            answer: 'Espresso UI is Jacob\'s free Figma design library for SaaS founders, freelancers, and solopreneurs. He built it in about two months on the shadcn framework after founders and designers asked for a library they could use - and because he needed one for his own projects. Live at espressoui.com.'
        },
        {
            id: 'plugins',
            keywords: ['plugin', 'plugins', 'figma plugin', 'textorize', 'tokenizely', 'colorize'],
            answer: 'Jacob builds Figma plugins and widgets under DesignOps Studio - including Textorize It, Shadow It, Colorize It, DS Checklist, Tokenizely, Page-Generator, Design Tasks, and UpVote. See Figma Plugins on the About page.'
        },
        {
            id: 'designops',
            keywords: ['designops studio', 'design ops studio'],
            answer: 'DesignOps Studio is Jacob\'s freelance practice (designops.studio), founded in 2025. He designs UI kits, builds Figma plugins, and takes on Design Systems client work.'
        },
        {
            id: 'stack',
            keywords: ['stack', 'tools', 'claude', 'cursor', 'what tools'],
            answer: 'Jacob\'s stack centers on Figma (libraries & Make), Claude Code, Cursor, and Figma MCP - plus Miro, ChatGPT, Material Design, Tailwind UI, Shadcn, HIG, Notion, Jira, and more.'
        },
        {
            id: 'notes',
            keywords: ['notes', 'blog', 'writing'],
            answer: 'Jacob shares short notes on the Notes page - recent ones cover his first week at Lilly and building Espresso UI.'
        }
    ];

    const GREETINGS = /^(hi|hello|hey|howdy|yo|sup|good (morning|afternoon|evening))\b/i;
    const THANKS = /^(thanks|thank you|thx|ty|cheers)\b/i;
    const HELP = /\b(help|what can you|what do you know|topics)\b/i;

    function normalize(text) {
        return String(text)
            .toLowerCase()
            .replace(/[’']/g, "'")
            .replace(/[^a-z0-9+#.\s-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function formatJob(job) {
        return `${job.company} - ${job.role} (${job.dates}). ${job.detail}`;
    }

    function formatTimeline() {
        return (
            'Here\'s where Jacob has worked (most recent first):\n\n' +
            EXPERIENCE.map((job) => `• ${job.company}: ${job.role} · ${job.dates}`).join('\n') +
            '\n\nAsk about a company for more detail, or see the Experience page.'
        );
    }

    function findJobs(query) {
        const q = normalize(query);
        return EXPERIENCE.filter((job) => {
            const company = normalize(job.company);
            if (q.includes(company) || company.split(' ').some((w) => w.length > 3 && q.includes(w))) {
                return true;
            }
            return job.aliases.some((alias) => q.includes(normalize(alias)));
        });
    }

    function isWorkHistoryQuestion(q) {
        const n = normalize(q);
        return (
            /\b(where (did|have|has)|who (did|have) .+ work|worked (at|for|with)|previous (jobs?|roles?|companies)|work history|career (path|history)|experience|resume|employers?|companies)\b/.test(n) ||
            /\b(list|show).*(jobs?|roles?|companies|experience)\b/.test(n) ||
            /\b(past|previous|former).*(work|job|role|company)\b/.test(n) ||
            /\bwhere .+ work/.test(n)
        );
    }

    function isWhenQuestion(q) {
        const n = normalize(q);
        return /\b(when|what year|which years?|how long|dates?|timeline)\b/.test(n);
    }

    function scoreEntry(query, entry) {
        const q = normalize(query);
        let score = 0;
        for (const keyword of entry.keywords) {
            const k = normalize(keyword);
            if (!k) continue;
            if (q.includes(k)) {
                score += k.length > 10 ? 5 : k.includes(' ') ? 4 : 2;
            } else {
                const parts = k.split(' ').filter((p) => p.length > 2);
                if (parts.length > 1 && parts.every((p) => q.includes(p))) {
                    score += 3;
                }
            }
        }
        return score;
    }

    function answerQuestion(query) {
        const q = query.trim();
        if (!q) return 'Ask me anything about Jacob\'s work, career, sports teams, or projects.';

        if (GREETINGS.test(q)) {
            return 'Hey - ask about where Jacob worked, when he was at a company, DesignOps Studio, projects, or sports teams.';
        }
        if (THANKS.test(q)) {
            return 'You\'re welcome. Ask another question anytime.';
        }
        if (HELP.test(q) || /^(what|who) are you\??$/i.test(q)) {
            return 'I answer from this site\'s content. Try “Where has Jacob worked?”, “When was he at CVS?”, “What does he do at Lilly?”, or “What teams does he support?”';
        }

        const matchedJobs = findJobs(q);
        const wantsWhen = isWhenQuestion(q);
        const wantsHistory = isWorkHistoryQuestion(q);

        // Full work history / “where has he worked” takes priority over a single company hit
        if (wantsHistory) {
            return formatTimeline();
        }

        // Specific company (+ optional when)
        if (matchedJobs.length === 1) {
            const job = matchedJobs[0];
            if (wantsWhen) {
                return `Jacob was at ${job.company} as ${job.role} from ${job.dates}. ${job.detail}`;
            }
            return formatJob(job);
        }

        if (matchedJobs.length > 1) {
            return matchedJobs.map(formatJob).join('\n\n');
        }

        // Current role shortcuts
        if (/\b(current(ly)?|right now|today|present)\b/i.test(q) && /\b(work|job|role|company)\b/i.test(q)) {
            return formatJob(EXPERIENCE[0]);
        }

        if (wantsWhen && /\b(work|job|career|experience|company|companies)\b/i.test(q)) {
            return formatTimeline();
        }

        const ranked = KNOWLEDGE
            .map((entry) => ({ entry, score: scoreEntry(q, entry) }))
            .filter((r) => r.score > 0)
            .sort((a, b) => b.score - a.score);

        if (!ranked.length) {
            return 'I\'m not sure from what\'s on the site. Try “Where has Jacob worked?”, “When was he at Adobe?”, “Lilly”, or “sports teams”.';
        }

        return ranked[0].entry.answer;
    }

    function el(tag, className, attrs) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (attrs) {
            Object.entries(attrs).forEach(([key, value]) => {
                if (key === 'text') node.textContent = value;
                else node.setAttribute(key, value);
            });
        }
        return node;
    }

    function buildUI() {
        if (document.getElementById('site-chat')) return;

        const root = el('div', 'site-chat', { id: 'site-chat' });

        const panel = el('div', 'site-chat__panel', {
            id: 'site-chat-panel',
            hidden: 'true',
            role: 'dialog',
            'aria-label': 'Ask about Jacob'
        });

        const header = el('div', 'site-chat__header');
        header.appendChild(el('p', 'site-chat__title', { text: 'Ask about Jacob' }));
        header.appendChild(el('p', 'site-chat__subtitle', { text: 'Work history, projects, sports, and more' }));
        const closeBtn = el('button', 'site-chat__close', {
            type: 'button',
            'aria-label': 'Close chat'
        });
        closeBtn.innerHTML = '<span class="material-icons" aria-hidden="true">close</span>';
        header.appendChild(closeBtn);

        const messages = el('div', 'site-chat__messages', {
            id: 'site-chat-messages',
            role: 'log',
            'aria-live': 'polite'
        });

        const form = el('form', 'site-chat__form', { id: 'site-chat-form' });
        const input = el('input', 'site-chat__input', {
            id: 'site-chat-input',
            type: 'text',
            name: 'question',
            placeholder: 'e.g. When was he at CVS?',
            autocomplete: 'off',
            maxlength: '240'
        });
        const send = el('button', 'site-chat__send', {
            type: 'submit',
            'aria-label': 'Send'
        });
        send.innerHTML = '<span class="material-icons" aria-hidden="true">arrow_upward</span>';
        form.appendChild(input);
        form.appendChild(send);

        panel.appendChild(header);
        panel.appendChild(messages);
        panel.appendChild(form);

        const toggle = el('button', 'site-chat__toggle', {
            type: 'button',
            id: 'site-chat-toggle',
            'aria-expanded': 'false',
            'aria-controls': 'site-chat-panel'
        });
        toggle.innerHTML =
            '<span class="material-icons site-chat__toggle-icon" aria-hidden="true">auto_awesome</span>' +
            '<span class="site-chat__toggle-label">Ask about Jacob\'s work</span>';

        root.appendChild(panel);
        root.appendChild(toggle);
        document.body.appendChild(root);
        document.body.classList.add('has-site-chat');

        function addMessage(text, role) {
            const bubble = el('div', `site-chat__bubble site-chat__bubble--${role}`);
            bubble.textContent = text;
            messages.appendChild(bubble);
            messages.scrollTop = messages.scrollHeight;
        }

        function openChat() {
            panel.hidden = false;
            toggle.setAttribute('aria-expanded', 'true');
            root.classList.add('site-chat--open');
            if (!messages.childElementCount) {
                addMessage(
                    'Hi - ask where Jacob worked, when he was at a company, or about projects and sports teams.',
                    'bot'
                );
            }
            window.setTimeout(() => input.focus(), 50);
        }

        function closeChat() {
            panel.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
            root.classList.remove('site-chat--open');
        }

        toggle.addEventListener('click', () => {
            if (panel.hidden) openChat();
            else closeChat();
        });
        closeBtn.addEventListener('click', closeChat);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const question = input.value.trim();
            if (!question) return;
            addMessage(question, 'user');
            input.value = '';
            window.setTimeout(() => {
                addMessage(answerQuestion(question), 'bot');
            }, 180);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !panel.hidden) closeChat();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildUI);
    } else {
        buildUI();
    }
})();
