document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    // Animación para las habilidades
    function animateSkills() {
        const skillsItems = document.querySelectorAll(".skills-list li");

        skillsItems.forEach((item, index) => {
            gsap.from(item, {
                opacity: 0,
                x: 200,
                rotate: 360,
                duration: 0.6,
                delay: index * 0.3,
                ease: "power2.out",
                onComplete: () => {
                    gsap.set(item, { clearProps: "all" });
                },
            });
        });
    }

    // ScrollTrigger para habilidades
    ScrollTrigger.create({
        trigger: ".skills-section",
        start: "top 80%",
        onEnter: () => animateSkills(),
    });

    // Animación para los elementos de experiencia
    function animateExperience() {
        gsap.from(".timeline-item", {
            scrollTrigger: {
                trigger: "#experiencia",
                start: "top 80%",
                toggleActions: "play none none reset", 
            },
            x: -200,
            opacity: 0,
            duration: 1,
            stagger: 0.3,
            ease: "power2.out",
        });
    }

    // Animación para los títulos de experiencia
    function animateExperienceTitles() {
        gsap.from(".timeline-item h3", {
            scrollTrigger: {
                trigger: "#experiencia",
                start: "top 80%",
                toggleActions: "play none none reset",
            },
            x: -200,
            opacity: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: "power2.out",
        });
    }

    // Animación para los enlaces del footer
    function animateFooterLinks() {
        gsap.from(".footer-link", {
            scrollTrigger: {
                trigger: ".footer",
                start: "top 20%",
                toggleActions: "play none none reset",
            },
            duration: 0.8,
            stagger: 0.3,
            ease: "power2.out",
        });
    }

    // Smooth scroll para los enlaces del menú de navegación
    function enableSmoothScroll() {
        document.querySelectorAll('.nav a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    animateSkills();
    animateExperience();
    animateExperienceTitles();
    animateFooterLinks();
    enableSmoothScroll();
});
