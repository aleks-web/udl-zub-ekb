/* Import scss */
import './../scss/style.scss';

/* Import Fonts */
import './../font/stylesheet.css';

import './../js/init/header.js';
import './../js/init/masks.js';
import './../js/init/modals.js';
import './../js/init/quiz.js';

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

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('quiz:step_5', (e) => {
        const stepElement = e.detail.step;
        const bar = stepElement.querySelector('.progress-calc__persent');

        let total = 0;
        function updateProgressBar() {
            const randomNumber = Math.floor(Math.random() * 10) + 1;
            total += randomNumber;
            if (total > 100) {
                total = 100;
            }

            bar.dataset.persent = total;

            if (total < 100) {
                setTimeout(updateProgressBar, 100);
            } else {
                document.querySelector('.progress-calc__title').innerText = 'Готово! Стоимость рассчитана!';

                setTimeout(() => {
                    window.quiz.setStep(6);
                }, 1000);
            }
        }

        updateProgressBar();

    });
});