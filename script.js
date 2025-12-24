// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
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

// Optional: Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to sections (optional - can be removed if not desired)
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

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

