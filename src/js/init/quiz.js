import sender from "./../sender";

class Quiz {
    #quizName = null;
    #currentStep = 1;
    #stepElements = null;
    #progressBarElements = null;
    #stepNumElements = null;
    #btnNextElements = null;
    #btnPrevElements = null;
    #questionElements = null;
    #resultQuiz = {};

    constructor(quizName) {
        this.#quizName = quizName;
    }

    setStepElsBySelector(selector) {
        this.#stepElements = document.querySelectorAll(selector);
        this.initChoise();
        return this;
    }

    initChoise() {
        this.#stepElements.forEach((el) => {
            const options = JSON.parse(el.dataset.stepOptions);
            const stepType = options.type;
            const choiseElements = el.querySelectorAll('[data-value]');


            const radioHandler = (choise) => {
                const resetChoises = () => {
                    choiseElements.forEach(el => {
                        el.classList.remove('active');
                    });
                }

                if (choise.currentTarget.classList.contains('active')) {
                    choise.currentTarget.classList.remove('active');
                } else {
                    resetChoises();
                    choise.currentTarget.classList.add('active');
                    this.stepNext();
                }
            }

            const checkHandler = (choise) => {
                choise.currentTarget.classList.add('active');
            }

            choiseElements.forEach(choise => {
                choise.onclick = stepType === 'radio' ? (e) => { radioHandler(e); this.updateQuiz(); } : (e) => { checkHandler(e); this.updateQuiz(); }
            });

        });
    }

    hasActiveChoiseInStep(stepId) {
        let activeEls = [];
        this.#stepElements.forEach((el) => {
            const options = JSON.parse(el.dataset.stepOptions);
            if (stepId === options.step_id) {
                activeEls = el.querySelectorAll('.sc-radio-img.active');
            }
        });

        return !!activeEls.length;
    }

    setQuestionElsBySelector(selector) {
        this.#questionElements = document.querySelectorAll(selector);
        return this;
    }

    setBtnNextElsBySelector(selector) {
        this.#btnNextElements = document.querySelectorAll(selector);
        this.setHandlerToAllElements(selector, 'click', () => {
            this.stepNext();
        });
        return this;
    }

    setBtnPrevElsSelector(selector) {
        this.#btnPrevElements = document.querySelectorAll(selector);
        this.setHandlerToAllElements(selector, 'click', () => {
            this.stepPrev();
        });
        return this;
    }

    setProgressBarElsBySelector(selector) {
        this.#progressBarElements = document.querySelectorAll(selector);
        return this;
    }

    setStepNumElsSelector(selector) {
        this.#stepNumElements = document.querySelectorAll(selector);
        return this;
    }

    endSetSelectors() {
        this.updateQuiz();
        return this;
    }

    stepNext() {
        const nextStep = this.#currentStep + 1;

        if (nextStep > this.#stepElements.length) {
            return;
        }

        this.setStep(nextStep);
    }

    stepPrev() {
        const prevStep = this.#currentStep - 1;

        if (prevStep < 1) {
            return;
        }

        this.setStep(prevStep);
    }

    setStep(stepNum) {
        this.#stepElements.forEach(el => {
            const options = JSON.parse(el.dataset.stepOptions);

            el.classList.remove('active');

            if (+options.step_id === +stepNum) {
                el.classList.add('active');
            }
        });

        this.#currentStep = stepNum;
        this.updateQuiz();
        const { options, step } = this.getStepDataByStepId(stepNum);

        const userLoggedInEvent = new CustomEvent('quiz:step_' + stepNum, { detail: { options, step } });
        document.dispatchEvent(userLoggedInEvent);
    }

    updateProgressBar() {
        const countSteps = this.#stepElements.length;
        const percent = this.#currentStep * 100 / countSteps;

        this.#progressBarElements.forEach(el => {
            el.setAttribute('style', '--progress-width: ' + percent + '%');
        });
    }

    updateQuestion() {
        const { options } = this.getStepDataByStepId(this.#currentStep);
        this.#questionElements.forEach(qEl => {
            if (options.question) {
                qEl.innerText = options.question;
            } else {
                qEl.innerText = '';
            }
        });
    }

    getStepDataByStepId(stepId) {
        const stepOptions = Array.from(this.#stepElements).filter(stepContent => {
            const options = JSON.parse(stepContent.dataset.stepOptions);
            if (options.step_id == stepId) {
                return true;
            }
            return false;
        }).map(stepContent => {
            const options = JSON.parse(stepContent.dataset.stepOptions);
            return {step: stepContent, options: options};
        });

        if (stepOptions[0]) {
            return stepOptions[0];
        }
    }

    updateBtns() {

        const hasActiveChoises = this.hasActiveChoiseInStep(this.#currentStep);

        if (this.#currentStep >= this.#stepElements.length) {
            this.#btnNextElements.forEach(btn => {
                btn.classList.add('disable');
            });
        } else {
            this.#btnNextElements.forEach(btn => {
                btn.classList.remove('disable');
            });
        }

        if (this.#currentStep <= 1) {
            this.#btnPrevElements.forEach(btn => {
                btn.classList.add('disable');
            });
        } else {
            this.#btnPrevElements.forEach(btn => {
                btn.classList.remove('disable');
            });
        }

        if (!hasActiveChoises) {
            this.#btnNextElements.forEach(btn => {
                btn.classList.add('disable');
            });
        }
    }

    updateStepNum() {
        this.#stepNumElements.forEach((nEl) => {
            nEl.innerText = this.#currentStep;
        });
    }

    updateResults() {
        this.#stepElements.forEach(step => {
            const options = JSON.parse(step.dataset.stepOptions);
            const stepName = 'question' + options.step_id;
            const stepQuestion = options.question;

            const choiseElements = Array.from(step.querySelectorAll('[data-value]'));
            const choiseValues = choiseElements.filter((choise) => {
                if (choise.classList.contains('active')) {
                    return true;
                }
                return false;
            }).map(choise => {
                return choise.dataset.value;
            });

            if (choiseValues.length) {
                this.#resultQuiz[stepName] = stepQuestion + ': ' + choiseValues.join(',');
            }
        });
    }

    updateHideElements() {
        let countSteps = this.#stepElements.length;
        while (countSteps !== 0) {
            const { options } = this.getStepDataByStepId(countSteps);

            if (options.hide_elements && Array.isArray(options.hide_elements) && options.step_1 != this.#currentStep) {
                options.hide_elements.forEach(el => {
                    el = document.querySelector(el);
                    el.style.display = 'flex';
                });
            }

            --countSteps;
        }

        const { options } = this.getStepDataByStepId(this.#currentStep);
        if (options.hide_elements && Array.isArray(options.hide_elements)) {
            options.hide_elements.forEach(hide => {
                hide = document.querySelector(hide);
                hide.style.display = 'none';
            });
        }

    }

    updateShowElements() {
        let countSteps = this.#stepElements.length;
        while (countSteps !== 0) {
            const { options } = this.getStepDataByStepId(countSteps);

            if (options.show_elements && Array.isArray(options.show_elements) && options.step_1 != this.#currentStep) {
                options.show_elements.forEach(el => {
                    el = document.querySelector(el);
                    el.style.display = 'none';
                });
            }

            --countSteps;
        }

        const { options } = this.getStepDataByStepId(this.#currentStep);
        if (options.show_elements && Array.isArray(options.show_elements)) {
            options.show_elements.forEach(show => {
                show = document.querySelector(show);
                show.style.display = 'flex';
            });
        }
    }

    updateQuiz() {
        this.updateHideElements();
        this.updateShowElements();
        this.updateQuestion();
        this.updateStepNum();
        this.updateProgressBar();
        this.updateBtns();
        this.updateResults();
    }

    setHandlerToAllElements(elementsSelector, eventName, handler) {
        if (!elementsSelector || !eventName || !handler || typeof handler !== 'function') {
            return false;
        }

        document.querySelectorAll(elementsSelector).forEach((e) => {
            e.addEventListener(eventName, handler);
        });
    }

    getResult() {
        return this.#resultQuiz;
    };
}

window.quiz = new Quiz()
    .setStepElsBySelector('.qz__step-content')
    .setStepNumElsSelector('.qz__steps-num')
    .setBtnNextElsBySelector('.qz__btn_next')
    .setBtnPrevElsSelector('.qz__btn_back')
    .setProgressBarElsBySelector('.qz .progress')
    .setQuestionElsBySelector('.qz__question')
    .endSetSelectors();

document.querySelectorAll('form.form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let quizResult = window.quiz.getResult();
        quizResult.phone =  '+' + e.currentTarget.querySelector('input[name="phone"]').value.replace(/\D/g, '');
        sender(quizResult);
    });
});