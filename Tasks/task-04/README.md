# Task 04: Landing Page with Diagonal Cut Design 

## Overview
This project focuses on advanced CSS layout techniques,specifically the use of **Geometric Shapes** and **Pixel-Perfect Positioning**. The objective was 
to recreate a modern landing page featuring unique diagonal sections,requiring precise coordinate calculations tomatch the reference design exactly. The 
layout is built using a "fixed-width" approach to ensure every element—from the angled header to the club logo grids—aligns perfectly with the project
specifications.

---

## Key Features & Implementation
* **Diagonal Geometry:** Leveraged the CSS `clip-path: polygon()` property to create sharp, professional diagonal cuts on both the header and footer sections.
* **Club Directory Grid:**
    * Implemented a structured grid system to display five clubs per row.
    * Used a recurring icon system featuring a custom diagonal triangle element.
* **Clean Code Architecture:** * Used intuitive, human-readable class names (e.g., `.top`, `.grid`, `.clubs`) for a natural code structure.
    * Completely "pure" implementation—no external frameworks or libraries were used.
* **Branding & Assets:** * Integrated custom logos (BVB) and person icons using circular white backgrounds and specific padding to match the visual mockup.
    * Utilized relative pathing for a portable folder structure.

---

## HProject Setup
This task is located within the `src` directory of the Task 04 folder:

1.  **Download:** Access the main repository ZIP or clone it.
2.  **Navigate:** Go to `Tasks/Task 04 - 28 January 2026/src/`.
3.  **Launch:** Open `index.html` in your browser.
4.  **Note:** Ensure the `/Images` directory is present to load the favicon, club logos, and branding icons.

---

## Image Usage
The design uses three main images provided with the task:
* `favicon.png` – Red diagonal triangle (used for section icons and page favicon)
* `1.png` – BVB logo (used for club grid items)
* `logo.png` – Person icon (used in header)
  
All images are stored in the Images directory and are linked using relative paths to ensure the design works correctly after download.

---

## Technologies Used
* **HTML5:** For the structured document flow.
* **CSS3:** Featuring `clip-path` for shapes and **Flexbox** for the multi-row grid system.

---

## Lessons Learned
This was a challenging exercise in **mathematical CSS**. Learning how to manipulate the `clip-path` coordinate system allowed me to move beyond
"boxy" web design into more dynamic, angular layouts. It also reinforced the importance of using a consistent grid to manage large numbers of 
repetitive elements, like the club directory.

---

**Author:** **Soha Muzammil** *Intern at Codematics*
