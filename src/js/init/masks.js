import IMask from 'imask';

document.addEventListener('DOMContentLoaded', (e) => {
    const phoneElements = document.querySelectorAll('[data-mask-phone]');
    const maskOptions = {
        mask: '+{7} (000) 000-00-00'
    };

    window.imasks = [];
    phoneElements.forEach(phoneEl => {
        const mask = IMask(phoneEl, maskOptions);
        window.imasks.push(mask);
    });
});