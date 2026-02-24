document.addEventListener('DOMContentLoaded', () => {

    function fadeIn(element, duration, targetOpacity, display = 'block') {
        element.style.opacity = 0;
        element.style.display = display || 'block';
        let startTime = null;

        function animation(currentTime) {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;

            const progress = Math.min(elapsed / duration, 1);
            element.style.opacity = progress * targetOpacity;

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    function fadeOut(element, duration) {
        element.style.opacity = element.style.opacity ? element.style.opacity : 1;
        let opacityStart = Number(element.style.opacity);
        let startTime = null;

        function animation(currentTime) {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;

            const progress = Math.min(elapsed / duration, opacityStart);
            element.style.opacity = opacityStart - progress;

            if (progress < opacityStart) {
                requestAnimationFrame(animation);
            } else {
                element.style.display = 'none';
            }
        }

        requestAnimationFrame(animation);
    }


    const modals = document.querySelectorAll('.modal');
    const modalBg = document.querySelector('.modal-open-bg');

    const openModal = (name) => {

        modals.forEach(el => {
            const modalName = el.getAttribute('id');

            if (modalName === name) {
                fadeIn(el, 400, 1, 'flex');
                fadeIn(modalBg, 200, 0.5);
                document.body.classList.add('modal-open');
                el.classList.add('open');
            }
        });
    }

    const closeModal = () => {
        modals.forEach(el => {
            fadeOut(el, 300);
            fadeOut(modalBg, 300);
            el.classList.remove('open');
            document.dispatchEvent(new CustomEvent('closeModal', { detail: { modal: el } }));
        });
        document.body.classList.remove('modal-open');
    }

    document.querySelectorAll('[data-open-modal]').forEach(btn => {
        btn.onclick = (e) => {
            const modalName = e.target.closest('[data-open-modal]').dataset.openModal;
            openModal(modalName);
        }
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.onclick = (e) => {
            closeModal();
        }
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') && e.target.classList.contains('open')) {
            closeModal();
        }

        const md = e.target.closest('#lb_widget-wrapper');
        if(md) {
            const close = md.querySelector('#lb_exit');
            if (!md.style.display) {
                close.dispatchEvent(new Event('click'));
            }
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === "Escape") closeModal();
    });


    function openOrderModal() {
        if(!document.querySelector('.modal.open') && !localStorage.getItem('modal-order-close') && document.getElementById('lb_widget-wrapper').style.display === 'none') {
            openModal('modal-order');
            clearInterval(openOrderModal);
        } else {
            setInterval(openOrderModal, 3000);
        }
    }

    setTimeout(openOrderModal, 3000);

    document.addEventListener('closeModal', (e) => {
       let modalName = e.detail.modal.getAttribute('id');

       if (modalName === 'modal-order') {
           localStorage.setItem('modal-order-close', "1");
       }
    });

});