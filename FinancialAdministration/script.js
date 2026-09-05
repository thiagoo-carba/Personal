const chart = new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
        labels: historial.map(item => item.fecha),
        datasets: [{
            data: historial.map(item => item.saldo),
            borderColor: "#A855F7",
            borderWidth: 4,
            pointRadius: 0,
            tension: 0.45,
            fill: true,
            backgroundColor: "rgba(168,85,247,0.15)"
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
        },
        scales: {
            x: { display: false },
            y: { display: false }
        }
    }
});