document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("[data-header]");
    const navToggle = document.querySelector("[data-nav-toggle]");
    const navPanel = document.querySelector("[data-nav-panel]");
    const navLinks = document.querySelectorAll(".nav-panel a[href^='#']");
    const revealItems = document.querySelectorAll("[data-reveal]");
    const countItems = document.querySelectorAll("[data-count]");
    const scrollProgress = document.querySelector("[data-scroll-progress]");
    const timelineProgress = document.querySelector("[data-timeline-progress]");
    const interactiveCards = document.querySelectorAll(".metric-card, .principle-card, .expertise-card, .manifesto-card, .statement-card, .contact-copy, .contact-form");
    const interactiveButtons = document.querySelectorAll(".button, .contact-links a");
    const scrollExitCards = document.querySelectorAll("[data-scroll-exit]");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    root.classList.add("force-motion");

    const debugBadge = document.createElement("div");
    debugBadge.textContent = `JS OK | reduce=${prefersReducedMotion ? "on" : "off"} | motion forced`;
    Object.assign(debugBadge.style, {
        position: "fixed",
        top: "12px",
        right: "12px",
        zIndex: "99999",
        padding: "10px 12px",
        background: "#ff2d2d",
        color: "#ffffff",
        font: '700 12px/1.2 "IBM Plex Mono", monospace',
        borderRadius: "10px",
        boxShadow: "0 10px 28px rgba(0, 0, 0, 0.35)",
        letterSpacing: "0.04em",
        textTransform: "uppercase"
    });
    document.body.appendChild(debugBadge);

    const syncHeader = () => {
        if (!header) {
            return;
        }

        header.classList.toggle("is-scrolled", window.scrollY > 16);
    };

    const closeMenu = () => {
        if (!navToggle || !navPanel) {
            return;
        }

        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navPanel.classList.remove("is-open");
    };

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const revealAll = () => {
        revealItems.forEach((item) => {
            item.classList.add("is-visible");
        });

        countItems.forEach((item) => {
            item.textContent = item.dataset.count || item.textContent;
        });

        if (scrollProgress) {
            scrollProgress.style.transform = "scaleX(1)";
        }

        if (timelineProgress) {
            timelineProgress.style.transform = "scaleY(1)";
        }
    };

    if (navToggle && navPanel) {
        navToggle.addEventListener("click", () => {
            const isOpen = navToggle.classList.toggle("is-open");
            navPanel.classList.toggle("is-open", isOpen);
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });

    if (prefersReducedMotion && !root.classList.contains("force-motion")) {
        revealAll();
        return;
    }

    root.classList.add("motion-enabled");

    const animateCount = (item) => {
        const endValue = Number(item.dataset.count || 0);
        const duration = 1300;
        const start = performance.now();

        const tick = (now) => {
            const progress = clamp((now - start) / duration, 0, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            item.textContent = String(Math.round(endValue * eased));

            if (progress < 1) {
                window.requestAnimationFrame(tick);
            }
        };

        window.requestAnimationFrame(tick);
    };

    const animateElement = (element, keyframes, options) => {
        if (!element) {
            return;
        }

        if (typeof element.animate === "function") {
            element.animate(keyframes, { fill: "both", ...options });
            return;
        }

        const lastFrame = keyframes[keyframes.length - 1];
        Object.assign(element.style, lastFrame);
    };

    const playIntro = () => {
        animateElement(document.querySelector(".site-nav"), [
            { opacity: 0, transform: "translate3d(0, -24px, 0)" },
            { opacity: 1, transform: "translate3d(0, 0, 0)" }
        ], {
            duration: 800,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)"
        });

        document.querySelectorAll(".hero-copy > *").forEach((item, index) => {
            animateElement(item, [
                { opacity: 0, transform: "translate3d(0, 26px, 0)" },
                { opacity: 1, transform: "translate3d(0, 0, 0)" }
            ], {
                duration: 850,
                delay: 180 + index * 110,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)"
            });
        });

        animateElement(document.querySelector(".hero-panel"), [
            { opacity: 0, transform: "translate3d(30px, 0, 0)" },
            { opacity: 1, transform: "translate3d(0, 0, 0)" }
        ], {
            duration: 900,
            delay: 280,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)"
        });
    };

    const updateScrollProgress = () => {
        if (!scrollProgress) {
            return;
        }

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 1;
        scrollProgress.style.transform = `scaleX(${clamp(ratio, 0, 1)})`;
    };

    const updateTimelineProgress = () => {
        if (!timelineProgress || !timelineProgress.parentElement) {
            return;
        }

        const rect = timelineProgress.parentElement.getBoundingClientRect();
        const start = window.innerHeight * 0.72;
        const end = window.innerHeight * 0.68;
        const distance = rect.height + start - end;
        const progress = distance > 0 ? (start - rect.top) / distance : 1;
        timelineProgress.style.transform = `scaleY(${clamp(progress, 0, 1)})`;
    };

    const refreshScrollExitMetrics = () => {
        scrollExitCards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            card.classList.add("scroll-exit-card");
            card.dataset.baseTop = String(rect.top + window.scrollY);
            card.dataset.baseLeft = String(rect.left);
            card.dataset.baseHeight = String(rect.height);
        });
    };

    const updateScrollExitCards = () => {
        scrollExitCards.forEach((card) => {
            const baseTop = Number(card.dataset.baseTop || 0);
            const baseLeft = Number(card.dataset.baseLeft || 0);
            const baseHeight = Number(card.dataset.baseHeight || card.offsetHeight || 1);
            const naturalTop = baseTop - window.scrollY;
            const start = 88;
            const end = -baseHeight * 0.62;
            const rawProgress = (start - naturalTop) / (start - end);
            const progress = clamp(rawProgress, 0, 1);
            const eased = progress * progress * (3 - 2 * progress);
            const targetX = 14 - baseLeft;
            const targetY = 14 - naturalTop;
            const scale = 1 - eased * 0.84;
            const opacity = 1 - eased * 0.88;
            const blur = eased * 10;
            const rotate = -eased * 9;
            const shadowY = 24 - eased * 16;
            const shadowBlur = 60 - eased * 28;
            const shadowAlpha = 0.34 - eased * 0.16;

            card.style.setProperty("--exit-x", `${targetX * eased}px`);
            card.style.setProperty("--exit-y", `${targetY * eased}px`);
            card.style.setProperty("--exit-scale", String(scale));
            card.style.setProperty("--exit-opacity", String(clamp(opacity, 0, 1)));
            card.style.setProperty("--exit-blur", `${blur}px`);
            card.style.setProperty("--exit-rotate", `${rotate}deg`);
            card.style.setProperty("--exit-shadow", `0 ${shadowY}px ${shadowBlur}px rgba(2, 6, 23, ${clamp(shadowAlpha, 0.08, 0.34)})`);
            card.style.pointerEvents = progress > 0.92 ? "none" : "";
            card.style.zIndex = String(1000 - Math.round(progress * 100));
        });
    };

    const onScrollEffects = () => {
        updateScrollProgress();
        updateTimelineProgress();
        updateScrollExitCards();
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");

            const count = entry.target.querySelector("[data-count]");
            if (count && !count.dataset.countAnimated) {
                count.dataset.countAnimated = "true";
                animateCount(count);
            }

            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: "0px 0px -10% 0px"
    });

    revealItems.forEach((item) => {
        revealObserver.observe(item);
    });

    countItems.forEach((item) => {
        if (item.closest("[data-count-card]")) {
            return;
        }

        item.dataset.countAnimated = "true";
        animateCount(item);
    });

    refreshScrollExitMetrics();
    playIntro();
    onScrollEffects();
    window.addEventListener("scroll", onScrollEffects, { passive: true });
    window.addEventListener("resize", () => {
        refreshScrollExitMetrics();
        onScrollEffects();
    });

    const heroPanel = document.querySelector(".hero-panel");
    if (heroPanel) {
        window.addEventListener("mousemove", (event) => {
            const xOffset = (event.clientX / window.innerWidth - 0.5) * 10;
            const yOffset = (event.clientY / window.innerHeight - 0.5) * 10;
            heroPanel.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
        });
    }

    interactiveCards.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const bounds = card.getBoundingClientRect();
            const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 6;
            const rotateX = -((event.clientY - bounds.top) / bounds.height - 0.5) * 6;
            card.style.setProperty("--tilt-x", `${rotateX}deg`);
            card.style.setProperty("--tilt-y", `${rotateY}deg`);
        });

        card.addEventListener("mouseleave", () => {
            card.style.setProperty("--tilt-x", "0deg");
            card.style.setProperty("--tilt-y", "0deg");
        });
    });

    interactiveButtons.forEach((button) => {
        button.addEventListener("mousemove", (event) => {
            const bounds = button.getBoundingClientRect();
            const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
            const y = (event.clientY - bounds.top - bounds.height / 2) * 0.16;
            button.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "translate3d(0, 0, 0)";
        });
    });
});
