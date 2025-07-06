document.addEventListener("DOMContentLoaded", function () {
    const light = document.querySelector(".light");
    const cards = document.querySelectorAll(".card");
    let lightOn = true;
    let openCard = null;

    // 🖱️ Linterna sigue al mouse
    document.addEventListener("mousemove", function (e) {
        if (lightOn) {
            const lightX = e.clientX;
            const lightY = e.clientY;
            
            light.style.left = `${lightX}px`;
            light.style.top = `${lightY}px`;

            // Detectar si alguna tarjeta está dentro de la luz
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardX = rect.left + rect.width / 2;
                const cardY = rect.top + rect.height / 2;

                // Calcular distancia entre la linterna y la tarjeta
                const distance = Math.sqrt((lightX - cardX) ** 2 + (lightY - cardY) ** 2);
                
                // Si está dentro del radio de iluminación, se muestra parcialmente visible
                if (distance < 250) {
                    card.classList.add("illuminated");
                } else {
                    card.classList.remove("illuminated");
                }
            });
        }
    });

    // 🖱️ Click izquierdo para abrir tarjetas en pantalla completa
    document.addEventListener("click", function (e) {
        if (e.target.closest(".card") && !e.target.classList.contains("close-btn") && !e.target.classList.contains("minimize-btn")) {
            if (openCard) {
                openCard.classList.remove("open");
            }
            openCard = e.target.closest(".card");
            openCard.classList.add("open");

            // Eliminar botones anteriores si existen
            let existingCloseBtn = openCard.querySelector(".close-btn");
            let existingMinimizeBtn = openCard.querySelector(".minimize-btn");
            if (existingCloseBtn) existingCloseBtn.remove();
            if (existingMinimizeBtn) existingMinimizeBtn.remove();

            // Agregar botón de cierre y minimizar
            let closeBtn = document.createElement("button");
            closeBtn.classList.add("close-btn");
            closeBtn.innerText = "X";
            closeBtn.onclick = function () {
                openCard.classList.remove("open");
                openCard = null;
            };

            let minimizeBtn = document.createElement("button");
            minimizeBtn.classList.add("minimize-btn");
            minimizeBtn.innerText = "-";
            minimizeBtn.onclick = function () {
                openCard.classList.remove("open");
                openCard = null;
            };

            openCard.appendChild(closeBtn);
            openCard.appendChild(minimizeBtn);
        }
    });

    // 🖱️ Click derecho para apagar/encender la linterna
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        lightOn = !lightOn;
        light.style.display = lightOn ? "block" : "none";
    });
});
