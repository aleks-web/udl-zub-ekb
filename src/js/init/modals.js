document.addEventListener('DOMContentLoaded', () => {
    function fadeIn(el, opac = 1, display) {
        let opacity = 0;
        el.style.display = display || 'flex';
        el.style.zIndex = '100';
        let intervalID = setInterval(function() {
            if (opacity < opac) {
                opacity = opacity + 0.1
                el.style.opacity = opacity;
            } else {
                clearInterval(intervalID);
            }
        }, 30);
    }

    function fadeOut(el) {
        el.style.opacity = 1;
        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
                el.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    }


    const modals = document.querySelectorAll('.modal');
    const modalBg = document.querySelector('.modal-open-bg');

    const openModal = (name) => {

        modals.forEach(el => {
            const modalName = el.getAttribute('id');

            if (modalName === name) {
                fadeIn(el, 1, 'flex');
                fadeIn(modalBg, 0.5);
                document.body.classList.add('modal-open');
                el.classList.add('open');
            }
        });
    }

    const closeModal = () => {
        modals.forEach(el => {
            fadeOut(el);
            fadeOut(modalBg);
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