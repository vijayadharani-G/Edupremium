// script.js - General client-side interactivity for PHP E-Learning System

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auto-dismiss alerts after 4 seconds
    const alerts = document.querySelectorAll('.alert-dismissible');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
            if (bsAlert) {
                bsAlert.close();
            }
        }, 4000);
    });

    // 2. Client-side validation on forms
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // 3. Quiz interactivity helper (checks that at least one radio is selected)
    const quizForm = document.getElementById('quiz-submit-form');
    if (quizForm) {
        quizForm.addEventListener('submit', (e) => {
            const questions = quizForm.querySelectorAll('.quiz-question-card');
            let allAnswered = true;

            questions.forEach(card => {
                const radios = card.querySelectorAll('input[type="radio"]');
                let checked = false;
                radios.forEach(radio => {
                    if (radio.checked) checked = true;
                });
                if (!checked) {
                    allAnswered = false;
                    card.style.borderColor = '#ef4444';
                } else {
                    card.style.borderColor = '#e2e8f0';
                }
            });

            if (!allAnswered) {
                e.preventDefault();
                alert('Please select an option for each question before submitting.');
            }
        });
    }
});
