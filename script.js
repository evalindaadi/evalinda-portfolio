"use strict";

/* =====================================
   1. SETTINGS
===================================== */

// Must match the mobile menu breakpoint in style.css
const MOBILE_BREAKPOINT = 800;

const THEME_STORAGE_KEY = "portfolio-theme";
const COPY_MESSAGE_DURATION = 4000;

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

/* =====================================
   2. PROJECT DATA
===================================== */

const projects = [
    {
        title: "SENADA Language Learning App",
        category: "UI/UX",
        description:
            "SENADA is a mobile app prototype for reviving Sarawak Malay in the digital era, designed around SDG 4 (Quality Education). Learners practise speaking through AI voice chat in real-life scenarios, revise phrases with audio flashcards, and keep motivated with daily streaks and Culture Coins.",
        type: "BorNEO HackWknd - Top 20 Finalist",
        tools: "Figma",
        contribution:
            "Designed the sign up, forgot password, AI voice chat, flashcards and streaks screens in Figma, and helped prepare the presentation slides.",
        link: "https://www.figma.com/proto/tomiU3OqhCkOg5jDS0BWGS/STDGX-FIGMA-PROTOTYPE?node-id=0-1&t=VqFMvObro8beeh29-1",
        linkLabel: "View Figma prototype",
        image: "images/senada.webp",
        imageAlt: "Three Figma screens of the SENADA app: an AI voice chat in a restaurant scenario, a flashcard for the greeting 'Apa khabar kitak?', and a 5-day learning streak.",
        cover: "linear-gradient(135deg, #e5d7ff, #f9c9e0)"
    },
    {
        title: "ART Transport App",
        category: "UI/UX",
        description:
            "A mobile app prototype for Kuching's Autonomous Rapid Transit (ART) system, designed in Figma. Its main feature is an interactive map where users can filter places of interest and view route details. The app also suggests the nearest stations and lets users book tickets.",
        type: "Group project - UI/UX course",
        tools: "Figma",
        contribution:
            "Designed the screen for filtering places of interest on the map in Figma and prepared the final report.",
        link: "https://www.figma.com/proto/hPwjDmrZ3k6cUIwG5VZcGQ/TMT-2073---Project?node-id=0-1&t=c8rLA6J70jd6CEQQ-1",
        linkLabel: "View Figma prototype",
        image: "images/art.webp",
        imageAlt: "Three Figma screens of the ART app: the interactive map, the filter for places of interest, and ticket booking.",
        cover: "linear-gradient(135deg, #d8ecff, #c8f1e5)"
    },
    {
        title: "Health Education Application",
        category: "Java",
        description:
            "A desktop application built in Java for SDG 3 (Health Education), helping users learn about health through quizzes and interactive learning activities.",
        type: "Group project - Java Programming course",
        tools: "Visual Studio Code and UML",
        contribution:
            "A Java desktop application developed to promote health education through interactive quizzes. It includes a quiz engine that evaluates users' answers, calculates scores and supports learning through health-related questions.",
        image: "images/healthquiz.webp",
        imageAlt: "Screenshot of the Health Quiz desktop application showing a quiz question and scoring.",
        cover: "linear-gradient(135deg, #ffd9ec, #ffebd4)"
    },
    {
        title: "Sarawak Heritage Online Auction (SHAA)",
        category: "Database",
        description:
            "SHAA is a database-driven auction management system for Sarawak heritage items. It manages auction items, users and categories, while providing reports on bidding records, completed orders and popular auction items using PHP and MySQL.",
        type: "Group project - Database Concept and Design course",
        tools: "PHP, MySQL, phpMyAdmin",
        contribution:
            "Worked on the database and system features for managing users, auction items, categories, and reports.",
        image: "images/shaa-auction-items.webp",
        imageAlt: "SHAA auction item management page showing item names, sellers, categories, current prices, statuses, and update and delete actions.",
        cover: "linear-gradient(135deg, #f3dfbd, #c9a879)"
    },
    {
        title: "Stickman Environmental Quest",
        category: "Game Development",
        description:
            "Stickman Environmental Quest is a 2D retro-inspired game developed for the Computer Graphics course. Built using C/C++ and OpenGL, the game focuses on environmental conservation and features player controls, enemies, a scoring system, health indicators, and game levels.",
        type: "Group project - Computer Graphics course",
        tools: "C/C++, OpenGL",
        contribution:
            "Contributed to coding the game using C/C++ and OpenGL, and participated in preparing and delivering the project presentation.",
        image: "images/stickman-environmental-quest.webp",
        imageAlt: "Stickman Environmental Quest gameplay showing the player character, enemies, score, health indicators, and Level 1 in a forest environment.",
        cover: "linear-gradient(135deg, #c8e6c9, #81c784)"
    }
];

// Current filter state, shared by the category buttons and the search box
const projectFilters = {
    category: "All",
    query: ""
};

/* =====================================
   3. FEATURE: FOOTER YEAR
===================================== */

function initFooterYear() {
    const yearElement = document.getElementById("current-year");

    if (!yearElement) return;

    yearElement.textContent = new Date().getFullYear();
}

/* =====================================
   4. FEATURE: MOBILE NAVIGATION
===================================== */

function initMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!menuToggle || !navLinks) return;

    function setMenuOpen(isOpen) {
        navLinks.classList.toggle("open", isOpen);

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
        menuToggle.textContent = isOpen ? "✕" : "☰";
    }

    menuToggle.addEventListener("click", function () {
        setMenuOpen(!navLinks.classList.contains("open"));
    });

    // Close the menu after choosing a link
    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            setMenuOpen(false);
        });
    });

    // Close the menu when the screen becomes wider than the mobile breakpoint
    window.addEventListener("resize", function () {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
            setMenuOpen(false);
        }
    });
}

/* =====================================
   5. FEATURES: PROJECT CARDS, FILTER AND SEARCH
===================================== */

function createProjectCard(project, index) {
    const card = document.createElement("article");
    card.className = "project-card";

    // Coloured cover (used when the project has no screenshot, or the screenshot fails to load)
    const cover = document.createElement("div");
    cover.className = "project-cover";
    cover.style.background = project.cover;

    const number = document.createElement("span");
    number.className = "project-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const icon = document.createElement("span");
    icon.className = "project-cover-icon";
    icon.textContent = project.icon;
    icon.setAttribute("aria-hidden", "true");

    cover.append(number, icon);

    // Text content
    const content = document.createElement("div");
    content.className = "project-content";

    const category = document.createElement("span");
    category.className = "project-category";
    category.textContent = project.category;

    const title = document.createElement("h3");
    title.textContent = project.title;

    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.description;

    const meta = document.createElement("div");
    meta.className = "project-meta";

    const groupLabel = document.createElement("strong");
    groupLabel.textContent = project.type;

    const toolsLabel = document.createElement("span");
    toolsLabel.textContent = "Tools: " + project.tools;

    meta.append(groupLabel, toolsLabel);

    if (project.contribution) {
        const contributionBox = document.createElement("p");
        contributionBox.className = "project-contribution";

        const label = document.createElement("strong");
        label.textContent = "My Contribution: ";

        const details = document.createElement("span");
        details.textContent = project.contribution;

        contributionBox.append(label, details);
        meta.appendChild(contributionBox);
    }

    content.append(category, title, description, meta);

    // Optional link (only shown if the project has one)
    if (project.link) {
        const linkText = project.linkLabel || "View project";

        const projectLink = document.createElement("a");
        projectLink.className = "project-link";
        projectLink.href = project.link;
        projectLink.target = "_blank";
        projectLink.rel = "noopener noreferrer";
        projectLink.textContent = linkText + " ↗";
        projectLink.setAttribute(
            "aria-label",
            linkText + " for " + project.title + " (opens in a new tab)"
        );

        content.appendChild(projectLink);
    }

    // Use the screenshot if the project has one, otherwise the coloured cover
    let top = cover;

    if (project.image) {
        const screenshot = document.createElement("img");
        screenshot.className = "project-image";
        screenshot.src = project.image;
        screenshot.alt = project.imageAlt || project.title;
        screenshot.width = 900;
        screenshot.height = 644;
        screenshot.loading = "lazy";

        // Error handling: if the screenshot cannot load, show the coloured cover instead
        screenshot.addEventListener("error", function () {
            screenshot.replaceWith(cover);
        });

        top = screenshot;
    }

    card.append(top, content);

    return card;
}

function displayProjects(projectItems) {
    const projectList = document.getElementById("project-list");

    if (!projectList) return;

    projectList.replaceChildren();

    if (projectItems.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "project-empty";
        emptyMessage.textContent =
            "No projects found. Try another search or category.";

        projectList.appendChild(emptyMessage);
        return;
    }

    projectItems.forEach(function (project, index) {
        projectList.appendChild(createProjectCard(project, index));
    });
}

function getFilteredProjects() {
    const query = projectFilters.query.toLowerCase();

    return projects.filter(function (project) {
        const matchesCategory =
            projectFilters.category === "All" ||
            project.category === projectFilters.category;

        const searchableText = [
            project.title,
            project.category,
            project.description,
            project.type,
            project.tools
        ].join(" ").toLowerCase();

        return matchesCategory && searchableText.includes(query);
    });
}

function updateFilterButtons() {
    document.querySelectorAll(".filter-btn").forEach(function (button) {
        const isActive = button.dataset.category === projectFilters.category;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

function updateFilterStatus(resultCount) {
    const filterStatus = document.getElementById("filter-status");

    if (!filterStatus) return;

    filterStatus.textContent =
        "Showing " + resultCount +
        (resultCount === 1 ? " project" : " projects") +
        (projectFilters.category === "All"
            ? ""
            : " in " + projectFilters.category) +
        (projectFilters.query
            ? ' matching "' + projectFilters.query + '"'
            : "") +
        ".";
}

function updateProjects() {
    const filteredProjects = getFilteredProjects();

    displayProjects(filteredProjects);
    updateFilterButtons();
    updateFilterStatus(filteredProjects.length);
}

function initProjects() {
    const searchInput = document.getElementById("project-search-input");

    document.querySelectorAll(".filter-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            projectFilters.category = button.dataset.category;
            updateProjects();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            projectFilters.query = searchInput.value.trim();
            updateProjects();
        });
    }

    updateProjects();
}

/* =====================================
   6. FEATURE: SCROLL REVEAL
===================================== */

function initScrollReveal() {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

    const revealElements = document.querySelectorAll(
        ".section-label, .section h2, .project-card, .about-section h3"
    );

    const observer = new IntersectionObserver(
        function (entries, revealObserver) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealElements.forEach(function (element) {
        element.classList.add("reveal");
        observer.observe(element);
    });
}

/* =====================================
   7. FEATURE: ACTIVE NAVIGATION LINK
===================================== */

function initActiveNavLink() {
    const pageSections = document.querySelectorAll("main section[id]");
    const navigationLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    if (pageSections.length === 0 || navigationLinks.length === 0) return;

    // Marks one nav link as the current one
    function setCurrentLink(sectionId) {
        navigationLinks.forEach(function (link) {
            const isCurrent = link.getAttribute("href") === "#" + sectionId;

            if (isCurrent) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        setCurrentLink(entry.target.id);
                    }
                });
            },
            { rootMargin: "-30% 0px -60% 0px" }
        );

        pageSections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    // The Contact section is short, so it may never reach the observer band.
    // When the user is at the very bottom of the page, highlight Contact.
    window.addEventListener("scroll", function () {
        const atBottom =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 5;

        if (atBottom) {
            setCurrentLink("contact");
        }
    }, { passive: true });
}

/* =====================================
   8. FEATURE: THEME TOGGLE (SAVED WITH LOCALSTORAGE)
===================================== */

// localStorage can be blocked (for example in private mode), so every access uses try/catch
function readSavedTheme() {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
        console.warn("The theme could not be saved:", error);
    }
}

function initTheme() {
    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    const themeButton = document.createElement("button");
    themeButton.type = "button";
    themeButton.className = "theme-toggle";
    navbar.appendChild(themeButton);

    function applyTheme(isDark) {
        document.body.classList.toggle("dark-theme", isDark);

        themeButton.textContent = isDark ? "☀️ Light mode" : "🌙 Dark mode";
        themeButton.setAttribute("aria-pressed", String(isDark));
        themeButton.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    // Restore the theme the visitor chose last time
    applyTheme(readSavedTheme() === "dark");

    themeButton.addEventListener("click", function () {
        const isDark = !document.body.classList.contains("dark-theme");

        applyTheme(isDark);
        saveTheme(isDark ? "dark" : "light");
    });
}

/* =====================================
   9. FEATURE: BACK-TO-TOP BUTTON
===================================== */

function initBackToTop() {
    const backToTop = document.querySelector(".back-to-top");

    if (!backToTop) return;

    function updateVisibility() {
        backToTop.classList.toggle("visible", window.scrollY > 300);
    }

    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();
}

/* =====================================
   10. FEATURE: TYPING EFFECT
===================================== */

function initTypingEffect() {
    const coverRole = document.querySelector(".cover-role");

    if (!coverRole || prefersReducedMotion) return;

    const roleText = coverRole.textContent.trim();
    let characterIndex = 0;

    // Screen readers read the full text instead of the partial typing
    coverRole.setAttribute("aria-label", roleText);
    coverRole.textContent = "";

    function typeNextCharacter() {
        if (characterIndex < roleText.length) {
            coverRole.textContent += roleText.charAt(characterIndex);
            characterIndex++;

            window.setTimeout(typeNextCharacter, 45);
        }
    }

    window.setTimeout(typeNextCharacter, 400);
}

/* =====================================
   11. FEATURE: COPY EMAIL BUTTON
===================================== */

function initCopyEmail() {
    const copyButton = document.getElementById("copy-email");
    const copyStatus = document.getElementById("copy-status");

    if (!copyButton || !copyStatus) return;

    let clearTimer;

    // Shows a message for a few seconds (the status area is aria-live, so screen readers announce it)
    function showMessage(message) {
        copyStatus.textContent = message;

        window.clearTimeout(clearTimer);
        clearTimer = window.setTimeout(function () {
            copyStatus.textContent = "";
        }, COPY_MESSAGE_DURATION);
    }

    copyButton.addEventListener("click", async function () {
        const email = copyButton.dataset.email;

        try {
            if (!navigator.clipboard) {
                throw new Error("Clipboard is not available");
            }

            await navigator.clipboard.writeText(email);
            showMessage("Email copied: " + email);
        } catch (error) {
            showMessage("Could not copy automatically. Please copy it manually: " + email);
        }
    });
}

/* =====================================
   12. START EVERYTHING
===================================== */

// Start all portfolio features after the page is ready
function init() {
     // List of features used in my portfolio
    const features = [
        initFooterYear,
        initMobileMenu,
        initProjects,
        initScrollReveal,
        initActiveNavLink,
        initTheme,
        initBackToTop,
        initTypingEffect,
        initCopyEmail
    ];

    features.forEach(function (feature) {
        try {
            feature();
        } catch (error) {
            console.error("Feature failed: " + feature.name, error);
        }
    });
}

document.addEventListener("DOMContentLoaded", init);