# Task 06: Portfolio Website

## Overview
This project involved the development of a comprehensive, high-performance **Portfolio Website**. The goal was to move beyond static layouts by creating
a dynamic user experience featuring a fully functional **Light Mode toggle**, persistent theme storage, and a complex, multi-section responsive structure.
The design is built with a "pixel-perfect" mindset, replicating a professional developer's portfolio that highlights technical skills, professional 
history, and social proof through a modern, clean interface.

---

## Key Features & Implementation
* **Dynamic Theme Switching:** * Built a robust **Light Mode** using Tailwind’s `Light:` variants.
    * Integrated `localStorage` and system preference detection to ensure the user's theme choice persists across browser sessions.
* **Sticky & Adaptive Navigation:** * A sticky navbar that remains accessible during scrolling.
    * Features a custom mobile hamburger menu and a dedicated "Download CV" action button.
* **Interactive Project & Skills Showcase:** * **Skills Grid:** Displays a library of technology icons with smooth hover-scale animations.
    * **Project Cards:** A structured layout featuring technology badges and specific image-text alignment.
* **Professional Timeline:** * A clean, responsive work experience section that adapts from a multi-column desktop view to a stacked mobile view for
    smaller devices.
* **Social Proof & Contact:** * Includes a grid-based testimonials section and a focused contact area with real-time availability status and social
    links.

---

## How to Run the Project
This project is located within the `src` directory of the Task 06 folder:
1. **Clone/Download:** Download the full repository ZIP or clone it via Git.
2. **Navigate:** Go to the directory: `Tasks/Task 06/src/`.
3. **Launch:** Open `index.html` in your browser. 
    * *Note: Ensure the `Images-6` directory (located at the parent level of `src`) is present to load the favicon, club logos, and branding icons
       correctly.*

---

## Technologies Used
* **HTML5:** For the semantic core of the portfolio.
* **Tailwind CSS (via CDN):** Utilized for rapid utility styling and dark mode configuration.
* **Vanilla JavaScript:** Implemented for theme toggling logic, mobile menu transitions, and data persistence.
* **Google Fonts:** Integrated the *Inter* font family for a sleek, modern aesthetic.

---

## Lessons Learned
This task was a significant step forward as it introduced **logic-based styling**. Learning how to sync JavaScript with Tailwind CSS to manage a 
global theme state was incredibly rewarding. It also reinforced the importance of "Mobile-First Design"—ensuring that complex grids and timelines 
remain readable and interactive on everything from a large monitor to a smartphone.

**Author:** **Soha Muzammil** *Intern at Codematics*
