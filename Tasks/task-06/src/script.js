const themeToggleBtn = document.getElementById("theme-toggle");
const mobileThemeToggleBtn = document.getElementById("mobile-theme-toggle");
const darkIcon = document.getElementById("theme-toggle-dark-icon");
const lightIcon = document.getElementById("theme-toggle-light-icon");
const mobileDarkIcon = document.getElementById("mobile-theme-toggle-dark-icon");
const mobileLightIcon = document.getElementById(
  "mobile-theme-toggle-light-icon"
);

const btn = document.getElementById("mobile-menu-button");
const menu = document.getElementById("mobile-menu");

const themeCheck = () => {
  if (
    localStorage.getItem("color-theme") === "dark" ||
    (!("color-theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    updateIcons("dark");
  } else {
    document.documentElement.classList.remove("dark");
    updateIcons("light");
  }
};

const updateIcons = (theme) => {
  if (theme === "dark") {
    lightIcon.classList.remove("hidden");
    darkIcon.classList.add("hidden");

    mobileLightIcon.classList.remove("hidden");
    mobileDarkIcon.classList.add("hidden");
  } else {
    lightIcon.classList.add("hidden");
    darkIcon.classList.remove("hidden");

    mobileLightIcon.classList.add("hidden");
    mobileDarkIcon.classList.remove("hidden");
  }
};

const toggleTheme = () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("color-theme", "light");
    updateIcons("light");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("color-theme", "dark");
    updateIcons("dark");
  }
};

themeToggleBtn.addEventListener("click", toggleTheme);
if (mobileThemeToggleBtn) {
  mobileThemeToggleBtn.addEventListener("click", toggleTheme);
}

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

themeCheck();