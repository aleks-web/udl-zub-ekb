document.addEventListener('DOMContentLoaded', () => {
    const activeBtnClass = 'header__burger-btn_active';
    const activeMenuClass = 'mobile-header_active';
    const btn = document.querySelector('.header__burger-btn');
    const mobMenu = document.querySelector('.mobile-header');

    function toggleMenu() {
        if(btn?.classList?.contains(activeBtnClass)) {
            btn?.classList?.remove(activeBtnClass);
            mobMenu.classList.remove(activeMenuClass);
            document.body.classList.remove('menu-open');
        } else {
            btn?.classList?.add(activeBtnClass);
            mobMenu.classList.add(activeMenuClass);
            document.body.classList.add('menu-open');
        }
    }

    document.querySelector('.header__burger-btn')?.addEventListener('click', (e) => {
        toggleMenu();
    });

    window.addEventListener('resize', (e) => {

        if (window.innerWidth > 1200 && btn?.classList?.contains(activeBtnClass)) {
            toggleMenu();
        }

    });
});