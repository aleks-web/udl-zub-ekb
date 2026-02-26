
function startLenta() {
    if (window.innerWidth <= 768) {
        const medalsContainer = document.querySelector('.main-section__medals');
        const medals = document.querySelectorAll('.medal-item');

        medalsContainer.style.pointerEvents = "none";

        clearLenta();
        medals.forEach(medal => {
            const clone = medal.cloneNode(true);
            clone.classList.add('cloned');
            medalsContainer.appendChild(clone);
        });

        let scrollAmount = 0;
        const scrollSpeed = 0.4;
        function scroll() {
            scrollAmount += scrollSpeed;
            medalsContainer.scrollLeft = scrollAmount;
            if (scrollAmount >= medalsContainer.scrollWidth / 2) {
                scrollAmount = 0;
            }
            requestAnimationFrame(scroll);
        }
        scroll();
    } else {
        clearLenta();
    }
}

function clearLenta() {
    document.querySelectorAll('.medal-item.cloned').forEach(el => {
        el.remove();
    });
}

window.addEventListener('resize', (e) => {
    startLenta();
});

startLenta();
