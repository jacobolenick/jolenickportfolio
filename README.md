# Portfolio Website

A clean, minimalist portfolio website inspired by modern design principles.

## Features

- 🎨 Clean and minimal design
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Smooth scrolling navigation
- 🎯 Active navigation indicators
- 💫 Subtle animations and transitions
- 🔍 SEO-friendly structure
- 🔤 Apple Garamond font for elegant headings

## Sections

1. **Hero** - Introduction and profile
2. **Resume** - Work experience
3. **Posts** - Portfolio items/case studies
4. **Stack** - Tools and technologies
5. **Past Projects** - Previous work
6. **Contact** - Get in touch section

## Customization Guide

### 1. Update Personal Information

In `index.html`, replace the placeholder text:

- `[Your Name]` - Your full name
- `[Your Role]` - Your job title (e.g., "Product Designer")
- `[Company]` - Your current company
- `[Project]` - Your side project or notable work
- `[X]+` - Number of years of experience
- `your.email@gmail.com` - Your actual email

### 2. Add Your Profile Picture

Replace the profile picture URL:
```html
<img src="https://via.placeholder.com/80" alt="Profile Picture">
```

Change to your actual image:
```html
<img src="path/to/your-photo.jpg" alt="Your Name">
```

### 3. Customize Posts/Portfolio Items

Edit the `.post-card` sections to showcase your work:
- Update the `post-image` background gradients
- Change post titles and descriptions
- Add your own images or designs

### 4. Update Stack/Tools

Modify the tags in the Stack section to reflect your actual tools:
```html
<span class="tag">Your Tool</span>
```

### 5. Add Your Projects

Update the Past Projects section with your actual projects:
- Change project titles
- Update descriptions
- Link to live projects or case studies

### 6. Social Links

Update social media links in the Contact section:
```html
<a href="https://twitter.com/yourhandle" class="social-link">𝕏</a>
<a href="https://linkedin.com/in/yourprofile" class="social-link">in</a>
<a href="https://dribbble.com/yourprofile" class="social-link">○</a>
```

## Color Customization

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-text: #1a1a1a;      /* Main text color */
    --secondary-text: #666666;     /* Secondary text color */
    --border-color: #e5e5e5;       /* Border color */
    --background: #ffffff;          /* Background color */
    --hover-bg: #f5f5f5;           /* Hover state background */
    --accent-color: #0066ff;        /* Accent color */
}
```

## Adding New Sections

To add a new section:

1. Add the HTML in `index.html`:
```html
<section id="new-section" class="new-section">
    <h3 class="section-label">New Section</h3>
    <!-- Your content here -->
</section>
```

2. Add a navigation link:
```html
<a href="#new-section" class="nav-link">New Section</a>
```

3. Style it in `styles.css`:
```css
.new-section {
    margin-bottom: 80px;
}
```

## Font Setup

The site uses **Apple Garamond** for all headings (h1, h2, h3, h4). 

### Option 1: Add Apple Garamond Font Files

Place your Apple Garamond font files in the `fonts/` directory:
- `AppleGaramond.woff2`, `AppleGaramond.woff`, `AppleGaramond.ttf`
- `AppleGaramond-Bold.woff2`, `AppleGaramond-Bold.woff`, `AppleGaramond-Bold.ttf` (optional)

### Option 2: Use a Free Alternative

If you don't have Apple Garamond, use EB Garamond (free Google Font):

1. Add to the top of `styles.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600&display=swap');
```

2. Update the CSS variable:
```css
--heading-font: 'EB Garamond', Georgia, serif;
```

3. Remove or comment out the `@font-face` declarations

See `fonts/README.md` for more details.

## Running Locally

Simply open `index.html` in your web browser. No build process required!

For a local server (recommended):

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (requires npx)
npx serve
```

Then visit `http://localhost:8000` in your browser.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Tips

1. **Images**: Use high-quality images for your portfolio items
2. **Content**: Keep descriptions concise and impactful
3. **Performance**: Optimize images before uploading (use WebP format when possible)
4. **Testing**: Test on multiple devices and screen sizes
5. **Accessibility**: Add proper alt text to all images

## License

Feel free to use this template for your personal portfolio!

## Credits

Design inspired by modern portfolio best practices and minimal design principles.

