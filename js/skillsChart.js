let skillsChartInstance = null;

document.addEventListener("DOMContentLoaded", function () {
    function createSkillsChart() {
        const ctx = document.getElementById('skillsChart').getContext('2d');

        // Verifica si ya existe un gráfico y destruye la instancia previa
        if (skillsChartInstance) {
            skillsChartInstance.destroy();
        }

        // Crea un gráfico circular
        skillsChartInstance = new Chart(ctx, {
            type: 'pie', // Tipo de gráfico
            data: {
                labels: ['HTML', 'CSS', 'JavaScript', 'Blazor', '.NET', 'PHP', 'Symfony'],
                datasets: [{
                    label: 'Habilidades',
                    data: [95, 95, 85, 70, 85, 90,65],
                    backgroundColor: [
                        'rgba(236, 255, 248, 0.73)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 190, 25, 0.2)',
                        'rgba(255, 61, 245, 0.2)',
                        'rgba(95, 15, 255, 0.2)',
                        'rgba(9, 66, 255, 0.2)',
                        'rgba(96, 255, 82, 0.2)',
                    ],
                    borderColor: [
                        'rgb(255, 255, 255)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgb(255, 31, 244)',
                        'rgba(153, 102, 255, 1)',
                        'rgb(64, 153, 255)',
                        'rgb(84, 255, 92)',
                    ],
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#FFFFFF',
                            font: {
                                size: 14,
                            }
                        }
                    }
                },
            }
        });
    }

    // ScrollTrigger para cargar el gráfico
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
        trigger: "#skillsChart",
        start: "top 80%",
        onEnter: () => {
            createSkillsChart();
        },
        once: true,
    });
});
