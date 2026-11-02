#!/usr/bin/env python3
"""Generate individual note pages from notes data."""

import os

NOTES = [
    {
        "slug": "great-first-week-lilly-creative-people",
        "title": "Great first week at my new gig with Lilly through Creative People.",
        "date": "Apr 23, 2026",
        "description": "Week one on the Lilly Design System - already impressed by the team and grateful I chose this offer.",
        "image": "note-lilly-first-week.png",
        "image_alt": "Jacob Olenick smiling in his home office with soccer memorabilia and a peace sign",
        "hero_class": "",
        "body": """
                        <p>I started my new gig this Wednesday with Eli Lilly through Creative People. I'm so impressed with the team already and feel so blessed and thankful and happy I took this offer over others.</p>
                        <p>I'm excited to be designing the Lilly Design System and have a say and to be able to contribute to the look and feel of Lilly sites and products.</p>
                        <p>Week 1 down and many more to go.</p>
                        <figure>
                            <img src="../../images/note-lilly-first-week.png" alt="Jacob Olenick smiling in his home office with soccer memorabilia and a peace sign" width="768" height="1024" loading="lazy" decoding="async">
                        </figure>""",
    },
    {
        "slug": "espresso-ui-agentic-design-system",
        "title": "I'm building a free product. An Agentic Design System called Espresso UI.",
        "date": "Apr 6, 2026",
        "description": "Giving back, growing the brand, and shipping a Figma-first system with Claude Code and Figma MCP - alongside students from Design XP.",
        "image": "espresso-ui-cover.png",
        "image_alt": "Espresso UI logo",
        "hero_class": " note-page-hero--espresso-logo",
        "body": """
                        <p>Why would I build this for free! I want to give back and build my brand up. This has been a dream of mine since 2020. My pal, Joey Banks inspired me. Now in 2026 I'm working on it with a few students from Design XP and design school that helps give students real world experience.</p>
                        <p>We are building this from scratch in Figma and using Claude Code and Figma MCP to translate it into an Agentic Design System.</p>
                        <figure>
                            <img src="../../images/espresso-ui-note-screenshot.png" alt="Espresso UI documentation site showing overview, foundations, and components" width="1200" height="675" loading="lazy" decoding="async">
                        </figure>""",
    },
    {
        "slug": "design-systems-studio",
        "title": "I'm starting something new",
        "date": "Apr 4, 2026",
        "description": "A Design Systems Studio - 0 → 1 systems for startups, from Figma to production-ready agentic design systems with Claude.",
        "image": "designops-studio-note.png",
        "image_alt": "DesignOps Studio branding portrait",
        "hero_class": "",
        "body": """
                        <p>We're building a first of its kind Design Systems Studio.</p>
                        <p>0 → 1 Design Systems for Startups.</p>
                        <p>We start in Figma and then implement it into a production-ready Agentic Design Systems using Claude.</p>
                        <p>Then, anyone on your team can ship production-ready UI with ease using your company's own custom Design System.</p>""",
    },
    {
        "slug": "lilly-design-system-role",
        "title": "I'm stepping into a new design system role at Lilly",
        "date": "Apr 2, 2026",
        "description": "From CVS Health and the Rhythm Design System to Creative People, placed on Eli Lilly - Super IC and Senior Product Designer on the Lilly Design System.",
        "image": "logos/creative-people.png",
        "image_alt": "Creative People logo",
        "hero_class": "",
        "body": """
                        <p>After spending a year and a half at CVS Health working on the Rhythm Design System and the Pharmacy software, I'm now stepping into a new season of my career as a Super IC, Senior Product Designer working on building and maintaining the Lilly Design System through Creative People (placed on Eli Lilly).</p>
                        <p>I'm very excited for this next chapter of my career and to continue to work on the healthcare space of tech.</p>""",
    },
    {
        "slug": "design-systems-advocate",
        "title": "I've Stepped into a New Role as a Design Systems Advocate at Work",
        "date": "Feb 12, 2026",
        "description": "Bridge for product designers and the design system - still designing screens and UX flows while advocating for the Rhythm Design System.",
        "image": "design-systems-advocate.png",
        "image_alt": "Jacob Olenick at his workspace",
        "hero_class": "",
        "body": """
                        <p>I'm excited to be the bridge for our product designers and our design system. Although I'm in this new role, I'm still in the field designing screens and UX flows.</p>
                        <p>My new role I'm not only on our Product Design team, I'm also back on our Design Systems team.</p>
                        <p>I'll be the liaison between the two teams. I'll be advocating for the use of our Rhythm Design System and making sure the system is being used properly.</p>""",
    },
    {
        "slug": "colorize-it",
        "title": "I've Built a Figma Plugin that Allows Me to Create Variables in a Second From Top UI Libraries.",
        "date": "Feb 12, 2026",
        "description": "Building Colorize It to add color variables from Tailwind, Shadcn, Bootstrap, and more - with one click and automatic dark mode variables.",
        "image": "colorize-it-cover.png",
        "image_alt": "Colorize It - Color and variable generator based on popular UI frameworks",
        "hero_class": "",
        "body": """
                        <p>I've built Colorize It out of a need. I couldn't find a plugin that did exactly what I needed it to do in order to save so much time in my design system builds.</p>
                        <p>So I built it.</p>
                        <p>I made a feature where you can choose between a few of the top most popular UI libraries like, Tailwind, Shadcn, Bootstrap, etc.</p>
                        <p>With a click of a button you can add the previewed colors to your variables table and what's cool is they automatically create the dark mode variables as well.</p>
                        <p><a href="https://www.figma.com/community/plugin/1602001831211544731/colorize-it" target="_blank" rel="noopener noreferrer" class="note-content-link">Give Colorize It a try →</a></p>""",
    },
    {
        "slug": "figma-make-components",
        "title": "Building Figma Make Components for Others",
        "date": "Feb 11, 2026",
        "description": "Exploring how to turn Espresso UI components into Figma Make components for the community, plus interactive components like maps for designers to use.",
        "image": "figma-make-map.png",
        "image_alt": "Figma Make interactive map component",
        "hero_class": "",
        "body": """
                        <p>I've recently been exploring how to turn my components from my UI Kit Espresso UI, I'm currently in the process of designing into components others can use in Figma Make.</p>
                        <p>I've successfully made some of the components and have them on my Figma Community page for remixing. Check it out here: <a href="https://www.figma.com/community/file/1603566277366835066/interactive-location-map" target="_blank" rel="noopener noreferrer" class="note-content-link">Interactive Location Map on Figma Community →</a>.</p>
                        <p>I've also played with making cool interactive components like this map that designers could place into their websites.</p>
                        <p>I'm starting to really enjoy Figma Make and I feel it's the future of design systems. I know many teams, including my own, that are having their design systems designers use AI - like Make, V0, and Cursor.</p>""",
    },
    {
        "slug": "free-ui-kit",
        "title": "I Got Better as a Design Systems Designer When I Built Free UI Kit",
        "date": "Feb 11, 2026",
        "description": "How building UI kits in my free time made me an expert in Figma and a better teacher for my product design team.",
        "image": "work/design-systems-ui-kit.png",
        "image_alt": "Design workspace",
        "hero_class": "",
        "body": """
                        <p>I really started understanding Figma much more and really became an expert of the tool once I started designing and building my own UI kits in my free time.</p>
                        <p>I was able to push the limits of Figma, try new things without guardrails and design for what I would need.</p>
                        <p>It made me perform better at work and be able to teach other designers on my product design team as a whole how to use our components, and build their screens with precision.</p>""",
    },
    {
        "slug": "scalable-design-systems",
        "title": "Building Scalable Design Systems",
        "date": "Nov 15, 2025",
        "description": "Exploring the key principles and best practices for creating design systems that can grow with your organization.",
        "image": "design-systems-alert-dialog.png",
        "image_alt": "Espresso UI Alert Dialog component in Figma",
        "hero_class": "",
        "body": """
                        <p>Creating a design system that scales requires thoughtful planning and a deep understanding of your organization's needs. It's not just about building components - it's about creating a living ecosystem that evolves with your product.</p>
                        <p>One of the most important lessons I've learned is to start small and iterate. Don't try to build everything at once. Focus on the most commonly used components and patterns first, then expand as you understand how teams are actually using the system.</p>""",
    },
]

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Jacob Olenick</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="../../styles.css?v=71">
    <link rel="stylesheet" href="../note.css?v=2">
</head>
<body>
    <header>
        <nav class="nav-container">
            <div class="nav-content">
                <a href="/notes/" class="back-link">
                    <span class="material-icons">arrow_back</span>
                    Back
                </a>
                <div class="nav-theme-controls">
                    <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">
                        <span class="material-icons theme-icon">dark_mode</span>
                    </button>
                </div>
            </div>
        </nav>
    </header>

    <main class="container note-container">
        <article>
            <time class="note-page-date" datetime="{datetime}">{date}</time>
            <h1 class="note-page-title">{title}</h1>
            <div class="note-page-hero{hero_class}">
                <img src="../../images/{image}" alt="{image_alt}">
            </div>
            <div class="note-page-body">
{body}
            </div>
        </article>

        <nav class="note-navigation" aria-label="Note navigation">
{prev_nav}
{next_nav}
        </nav>
    </main>

    <script src="../../script.js?v=39"></script>
</body>
</html>
"""

REDIRECT = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=/notes/{slug}/">
    <link rel="canonical" href="/notes/{slug}/">
    <title>Redirecting...</title>
</head>
<body><p>Redirecting to <a href="/notes/{slug}/">{title}</a>...</p>
</body>
</html>
"""


def short_title(title: str, max_words: int = 5) -> str:
    words = title.split()
    if len(words) <= max_words:
        return title
    return " ".join(words[:max_words]) + "…"


def nav_link(note, direction: str) -> str:
    label = "Previous Note" if direction == "prev" else "Next Note"
    css = f"note-nav {direction}"
    title = short_title(note["title"])
    if direction == "prev":
        arrow_title = f"← {title}"
    else:
        arrow_title = f"{title} →"
    return f"""            <a href="/notes/{note['slug']}/" class="{css}">
                <span class="note-nav-label">{label}</span>
                <span class="note-nav-title">{arrow_title}</span>
            </a>"""


def build_nav(i: int) -> tuple[str, str]:
    if i == 0:
        prev_nav = """            <a href="/notes/" class="note-nav prev">
                <span class="note-nav-label">Back</span>
                <span class="note-nav-title">← All Notes</span>
            </a>"""
    else:
        prev_nav = nav_link(NOTES[i - 1], "prev")

    if i < len(NOTES) - 1:
        next_nav = nav_link(NOTES[i + 1], "next")
    else:
        next_nav = """            <div class="note-nav-spacer" aria-hidden="true"></div>"""

    return prev_nav, next_nav


def main():
    root = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(root)

    for i, note in enumerate(NOTES):
        prev_nav, next_nav = build_nav(i)
        html = TEMPLATE.format(
            title=note["title"],
            date=note["date"],
            datetime=note["date"],
            image=note["image"],
            image_alt=note["image_alt"],
            hero_class=note["hero_class"],
            body=note["body"],
            prev_nav=prev_nav,
            next_nav=next_nav,
        )

        note_dir = os.path.join(root, note["slug"])
        os.makedirs(note_dir, exist_ok=True)
        with open(os.path.join(note_dir, "index.html"), "w", encoding="utf-8") as f:
            f.write(html)

        redirect_path = os.path.join(repo_root, "notes", f"{note['slug']}.html")
        with open(redirect_path, "w", encoding="utf-8") as f:
            f.write(REDIRECT.format(slug=note["slug"], title=short_title(note["title"], 8)))

    print(f"Generated {len(NOTES)} note pages")


if __name__ == "__main__":
    main()
