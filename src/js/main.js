/* Import scss */
import './../scss/style.scss';

/* Import Fonts */
import './../font/stylesheet.css';

import './../js/init/header.js';
import './../js/init/masks.js';
import './../js/init/modals.js';

document.addEventListener('DOMContentLoaded', () => {
   const calcEls = document.querySelectorAll('[data-goto-calc]');
   const calc = document.querySelector('.quiz');

   if (calc && calcEls.length) {
       calcEls.forEach(cEl => {

          cEl.onclick = (e) => {
              calc.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                  inline: 'nearest'
              });
          }

       });
   }
});