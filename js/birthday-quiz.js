// =================================================================
// BIRTHDAY QUIZ LOGIC
// =================================================================

// Mehtap'ın doğum günü kontrolü
function isItMehtapsBirthday() {
    const today = new Date();
    return today.getMonth() === 4 && today.getDate() === 14; // May 14
}

// Doğum günü quiz'ini başlat
function initBirthdayQuiz() {
    const overlay = document.getElementById('birthday-quiz-overlay');
    if (!overlay) return;

    const quizSteps = document.querySelectorAll('.quiz-step');
    const optionButtons = document.querySelectorAll('.option-btn');
    let currentStepIndex = 0;
    let confettiInterval;

    // Sayfa scroll'unu engelle
    document.body.style.overflow = 'hidden';
    overlay.classList.add('visible');

    // Kalp şekli tanımla
    const heartShape = confetti.shapeFromPath({
        path: 'M0 20.25C0 13.5 6.75 0 15 0C23.25 0 30 13.5 30 20.25C30 30 15 45 15 45C15 45 0 30 0 20.25Z'
    });

    // Konfetti fonksiyonları
    function startConfetti() {
        if (confettiInterval) return;
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = {
            startVelocity: 25,
            spread: 360,
            ticks: 60,
            zIndex: 10001
        };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        confettiInterval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(confettiInterval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: {
                    x: randomInRange(0, 1),
                    y: Math.random() - 0.2
                },
                scalar: 0.8
            });
        }, 350);
    }

    function intensifyConfetti() {
        confetti({
            particleCount: 400,
            spread: 180,
            origin: { y: 0.6 },
            zIndex: 10001,
            angle: 90,
            gravity: 0.5
        });
    }

    function heartExplosion() {
        clearInterval(confettiInterval);
        const end = Date.now() + (8 * 1000);
        const colors = ['#ff4081', '#ff8a80', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 80,
                origin: { x: 0, y: 0.7 },
                colors: colors,
                shapes: [heartShape],
                scalar: 1.5,
                zIndex: 10001
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 80,
                origin: { x: 1, y: 0.7 },
                colors: colors,
                shapes: [heartShape],
                scalar: 1.5,
                zIndex: 10001
            });
            confetti({
                particleCount: 1,
                spread: 120,
                startVelocity: 35,
                origin: { x: 0.5, y: 0.2 },
                colors: colors,
                shapes: [heartShape],
                scalar: 1.2,
                zIndex: 10001
            });
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // Quiz adım yönetimi
    function showStep(index) {
        quizSteps.forEach(step => step.classList.remove('active'));
        if (quizSteps[index]) {
            quizSteps[index].classList.add('active');
            currentStepIndex = index;
        }
    }

    function handleCorrectAnswer() {
        intensifyConfetti();
        setTimeout(() => showStep(currentStepIndex + 1), 500);
    }

    function handleWrongAnswer(button) {
        const currentStepElement = quizSteps[currentStepIndex];
        optionButtons.forEach(btn => btn.disabled = true);
        currentStepElement.classList.add('fade-out-reset');

        setTimeout(() => {
            currentStepElement.classList.remove('active', 'fade-out-reset');
            setTimeout(() => {
                currentStepElement.classList.add('active');
                optionButtons.forEach(btn => btn.disabled = false);
            }, 100);
        }, 400);
    }

    // Event listeners
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isCorrect = button.getAttribute('data-correct') === 'true';
            if (isCorrect) {
                handleCorrectAnswer();
            } else {
                handleWrongAnswer(button);
            }
        });
    });

    // Slider fonksiyonları
    function runIntro() {
        const text1 = document.getElementById('intro-text-1');
        const text2 = document.getElementById('intro-text-2');

        showStep(0);
        setTimeout(() => text1.classList.add('visible'), 500);
        setTimeout(() => text1.style.opacity = '0', 2500);
        setTimeout(() => {
            text2.classList.add('visible');
            startConfetti();
            intensifyConfetti();
        }, 3300);
        setTimeout(() => showStep(1), 5300);
    }

    // Slider işlevselliği
    const sliderThumb = document.getElementById('love-slider-thumb');
    const sliderTrack = document.getElementById('love-slider-track');

    if (sliderThumb && sliderTrack) {
        let isDragging = false;

        function onDragStart(e) {
            isDragging = true;
            sliderThumb.style.cursor = 'grabbing';
            document.body.style.cursor = 'grabbing';
            e.preventDefault();
        }

        function onDragMove(e) {
            if (!isDragging) return;
            const clientX = e.clientX || e.touches[0].clientX;
            const trackRect = sliderTrack.getBoundingClientRect();
            const newX = clientX - trackRect.left;
            sliderThumb.style.left = `${newX}px`;

            if (clientX >= window.innerWidth - 50) {
                isDragging = false;
                handleSliderWin();
            }
        }

        function onDragEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            sliderThumb.style.cursor = 'grab';
            document.body.style.cursor = 'default';

            const thumbRect = sliderThumb.getBoundingClientRect();
            const trackRect = sliderTrack.getBoundingClientRect();

            if (thumbRect.right < trackRect.right + 20) {
                const currentStepElement = quizSteps[currentStepIndex];
                currentStepElement.classList.add('shake');
                sliderThumb.style.transition = 'left 0.3s ease';
                sliderThumb.style.left = '0px';

                setTimeout(() => {
                    currentStepElement.classList.remove('shake');
                    sliderThumb.style.transition = '';
                }, 500);
            }
        }

        function handleSliderWin() {
            document.removeEventListener('mousemove', onDragMove);
            document.removeEventListener('mouseup', onDragEnd);
            document.removeEventListener('touchmove', onDragMove);
            document.removeEventListener('touchend', onDragEnd);

            overlay.classList.add('hearts-bg');
            heartExplosion();
            setTimeout(() => showStep(8), 500);
            runFinalSequence();
        }

        // Slider event listeners
        sliderThumb.addEventListener('mousedown', onDragStart);
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        sliderThumb.addEventListener('touchstart', onDragStart);
        document.addEventListener('touchmove', onDragMove);
        document.addEventListener('touchend', onDragEnd);
    }

    // Final sequence
    function runFinalSequence() {
        const final1 = document.getElementById('final-text-1');
        const final2 = document.getElementById('final-text-2');
        const final3 = document.getElementById('final-text-3');

        setTimeout(() => final1.classList.add('visible'), 500);
        setTimeout(() => final1.style.opacity = '0', 2500);
        setTimeout(() => final2.classList.add('visible'), 3000);
        setTimeout(() => final2.style.opacity = '0', 5000);
        setTimeout(() => final3.classList.add('visible'), 5500);
        setTimeout(() => overlay.style.opacity = '0', 7500);
        setTimeout(() => {
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 8500);
    }

    // Quiz'i başlat
    runIntro();
}

// Global değişkenleri dışa aktar
export {
    isItMehtapsBirthday,
    initBirthdayQuiz
};
