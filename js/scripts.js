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
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    if (prefersReducedMotion || typeof gsap === "undefined") {
        revealItems.forEach((item) => {
            item.style.opacity = "1";
            item.style.transform = "none";
        });

        countItems.forEach((item) => {
            item.textContent = item.dataset.count || item.textContent;
        });

        if (scrollProgress) {
            scrollProgress.style.transform = "scaleX(1)";
        }

        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".site-nav", { y: -24, opacity: 0, duration: 0.8 })
        .from(".hero-copy > *", { y: 26, opacity: 0, stagger: 0.11, duration: 0.85 }, "-=0.35")
        .from(".hero-panel", { x: 30, opacity: 0, duration: 0.9 }, "-=0.55");

    if (scrollProgress) {
        gsap.to(scrollProgress, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.2
            }
        });
    }

    if (timelineProgress) {
        gsap.to(timelineProgress, {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
                trigger: timelineProgress.parentElement,
                start: "top 72%",
                end: "bottom 68%",
                scrub: 0.35
            }
        });
    }

    revealItems.forEach((item) => {
        const revealType = item.dataset.reveal;
        const fromVars = { opacity: 0, y: 32 };

        if (revealType === "left") {
            fromVars.x = -34;
            fromVars.y = 0;
        }

        gsap.fromTo(
            item,
            fromVars,
            {
                opacity: 1,
                x: 0,
                y: 0,
                duration: 0.85,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 84%"
                }
            }
        );
    });

    countItems.forEach((item) => {
        const endValue = Number(item.dataset.count || 0);
        const counter = { value: 0 };

        gsap.to(counter, {
            value: endValue,
            duration: 1.3,
            ease: "power2.out",
            scrollTrigger: {
                trigger: item.closest("[data-count-card]") || item,
                start: "top 88%",
                once: true
            },
            onUpdate: () => {
                item.textContent = String(Math.round(counter.value));
            }
        });
    });

    const heroPanel = document.querySelector(".hero-panel");
    if (heroPanel) {
        window.addEventListener("mousemove", (event) => {
            const xOffset = (event.clientX / window.innerWidth - 0.5) * 10;
            const yOffset = (event.clientY / window.innerHeight - 0.5) * 10;

            gsap.to(heroPanel, {
                x: xOffset,
                y: yOffset,
                duration: 1.1,
                ease: "power3.out",
                overwrite: "auto"
            });
        });
    }

    interactiveCards.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const bounds = card.getBoundingClientRect();
            const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 6;
            const rotateX = -((event.clientY - bounds.top) / bounds.height - 0.5) * 6;

            gsap.to(card, {
                rotateX,
                rotateY,
                transformPerspective: 900,
                transformOrigin: "center",
                duration: 0.35,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.45,
                ease: "power3.out",
                overwrite: "auto"
            });
        });
    });

    interactiveButtons.forEach((button) => {
        button.addEventListener("mousemove", (event) => {
            const bounds = button.getBoundingClientRect();
            const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
            const y = (event.clientY - bounds.top - bounds.height / 2) * 0.16;

            gsap.to(button, {
                x,
                y,
                duration: 0.25,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        button.addEventListener("mouseleave", () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.35,
                ease: "power3.out",
                overwrite: "auto"
            });
        });
    });
});
