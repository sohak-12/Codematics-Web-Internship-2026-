# Task 07: Dev Toolkit (Glassmorphism UI & Logic)

## Overview
This task is a high-level integration of functional JavaScript logic and modern UI design. The goal was to build a **Dev Toolkit** that features a 
"Glassmorphism" aesthetic—using transparency, blur effects, and high-quality background imagery—while providing a suite of real-time utility tools.
This project demonstrates the seamless connection between complex CSS styling and dynamic JavaScript event handling.

---

## Key Features & Implementation
* **Modern UI/UX Design (Glassmorphism):**
    * **Visual Style:** Implemented a sophisticated glass effect using `backdrop-filter: blur(12px)` and semi-transparent backgrounds.
    * **Dynamic Layout:** Used **CSS Grid** with `repeat(auto-fit, minmax(320px, 1fr))` to create a fully responsive card-based system.
    * **Interactive Feedback:** Added lift effects and border color transitions on hover using `cubic-bezier` for a smooth user experience.
* **Functional Toolset Logic:**
    * **Date & Unit Converters:** Includes an **Age-to-Days** calculator (using date objects) and a real-time **Hours-to-Seconds** converter.
    * **Mathematical Utilities:** Features a **BMI Calculator** (with `.toFixed(2)` precision) and a **Dynamic Adder** that intelligently handles 
       `NaN` states during input.
    * **Logical Processing:** Implemented a **Next Number Finder** that handles both array-based searches and mathematical type-detection (Integer
       vs. Float).
* **String & Data Management:**
    * **Name Formatter:** Automatically sanitizes and capitalizes user input for consistent data display.
    * **Randomization:** A custom function that generates random arrays and extracts boundary elements (First/Last).

---

## Project Setup
Since this project is part of a larger repository, follow these steps to view it:

1. **Clone/Download:** Download the full repository ZIP or clone it via Git.
2. **Navigate:** Go to the directory: `task-07/src/`.
3. **Launch:** Open `index.html` in your browser. 
    * *Note: Ensure the `BG.jpeg` file is present in the `task-07` folder as the CSS uses `../BG.jpeg` to load the background.*

---

## Technologies Used
* **HTML5:** For structured input forms and semantic containerization.
* **CSS3:** For advanced glassmorphism, background overlays, and grid layouts.
* **JavaScript (ES6+):** For core algorithmic logic, event delegation, and real-time DOM updates.

---

## Lessons Learned
This task was a deep dive into **aesthetic logic**. It taught me how to maintain high readability in a transparent UI by using background 
overlays and contrasting colors. Technically, it reinforced my understanding of **Type Checking** (identifying floats vs. ints) and managing 
specific event triggers like `change` and `input`.

---

**Author:** **Soha Muzammil** *Intern at Codematics*
