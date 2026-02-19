document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal');

    const openModal = () => {
        modal.classList.add('open');
        document.body.classList.add('modal-open');
    }

    const closeModal = () => {
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
    }

    document.querySelectorAll('[data-open-modal]').forEach(btn => {
        btn.onclick = (e) => {
            openModal();
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
    });

    document.addEventListener('keydown', e => {
        if (e.key === "Escape") closeModal();
    });

});