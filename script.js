document.addEventListener('DOMContentLoaded', function () {
  // ===================================================================
  // == GLOBAL CONSTANTS & VARIABLES
  // ===================================================================
  const year = new Date().getFullYear();
  let currentLanguage = localStorage.getItem('selectedLanguage') || 'tr';

  // ===================================================================
  // == DOM ELEMENT REFERENCES
  // ===================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const languageToggleBtn = document.getElementById('language-toggle-btn');
  const header = document.querySelector('header');
  const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');

  // ===================================================================
  // == TRANSLATIONS OBJECT
  // ===================================================================
  const translations = {
    tr: {
      'nav-home': 'Ana Sayfa', 'nav-about': 'Hakkımızda', 'nav-projects': 'Projeler', 'nav-vision': 'Vizyon', 'nav-team': 'Ekip', 'nav-contact': 'İletişim',
      'theme-toggle-dark': 'Karanlık Mod', 'theme-toggle-light': 'Aydınlık Mod', 'lang-toggle-en': 'English', 'lang-toggle-tr': 'Türkçe',
      'hero-title': 'Teknolojinin Zirvesi', 'hero-description': 'Türkiye\'nin en parlak genç yetenekleri tarafından ortalama 14 yaşında kurulmuş olan Vertex, teknolojinin geleceğini birçok alanda öncülük ediyor.', 'hero-btn-projects': 'Projeleri Keşfet', 'hero-btn-vision': 'Vizyonumuz',
      'about-title': 'Biz Kimiz', 'about-description': 'Haziran 2023\'te İstanbul\'da kurulan Vertex, Türkiye\'nin en genç girişimcilerini birleştirerek küresel teknoloji manzarasını yeniden tanımlayan ileri teknoloji şirketidir.', 'about-card1-title': 'Genç Yenilikçiler', 'about-card1-description': 'Ortalama 15 yaşındaki ekibimiz, sınırları zorlamaya ve devrim niteliğinde çözümler yaratmaya kendini adamış yeni nesil teknoloji vizyonerlerini temsil ediyor.', 'about-card2-title': 'Çok Alanlı Uzmanlık', 'about-card2-description': 'Yazılım geliştirmeden yapay zeka, oyun, müzik prodüksiyonu ve tarayıcı teknolojilerine kadar geniş beceri setimiz, birçok teknoloji alanında yenilik yapmamızı sağlıyor.', 'about-card3-title': 'Türkiye\'nin Teknoloji Geleceği', 'about-card3-description': 'Dünya standartlarında ürünler geliştirerek ve sınırlarımız içinde genç yetenekleri besleyerek Türkiye\'yi küresel teknoloji lideri konumuna getirmeye kendimizi adadık.',
      'projects-title': 'İleri Teknoloji Projelerimiz', 'projects-description': 'Birçok alanda geleceği şekillendiren yenilikçi teknoloji portföyümüzü keşfedin.', 'projects-tab-all': 'Tümü', 'projects-tab-software': 'Yazılım', 'projects-tab-ai': 'Yapay Zeka', 'projects-tab-gaming': 'Oyun', 'projects-tab-music': 'Müzik',
      'vision-title': '3-5 Yıllık Vizyonumuz', 'vision-description1': '2025 yılına kadar Vertex, Amerika, Avrupa ve Asya\'da küresel varlık kurarak platformlarımızda 5 milyon aktif kullanıcı hedeflemeyi ve küresel teknoloji endüstrisinde tanınan bir güç olmayı amaçlıyor.', 'vision-description2': 'Sürekli inovasyona, kendi işletim sistemimizi geliştirmeye, yapay zeka yeteneklerimizi genişletmeye ve çeşitli ürün portföyümüzle milyonlara ulaşmaya kendimizi adadık.', 'vision-stat1': 'Uygulamalarımız için dünya çapında hedef indirme sayısı', 'vision-stat2': 'Teknoloji ekosistemimizdeki aktif kullanıcı', 'vision-stat3': 'Polyhedron müzik etiketi için aylık dinleyici', 'vision-stat4': 'Küresel pazarlar - Amerika, Avrupa, Asya',
      'team-title': 'Önde Gelen Yenilikçilerimiz', 'team-description': 'Vertex\'ın arkasındaki parlak zihinler, Türkiye\'nin en genç teknoloji girişimcileri, bugün geleceği inşa ediyorlar.',
      'footer-description': 'Teknolojinin Zirvesi. 2023 yılında Türkiye\'nin en genç teknoloji girişimcileri tarafından kurulmuş, birçok alanda yenilik yoluyla geleceği yeniden şekillendiriyor.', 'footer-products': 'Ürünler', 'footer-company': 'Şirket', 'footer-legal': 'Yasal', 'footer-about': 'Hakkımızda', 'footer-vision': 'Vizyonumuz', 'footer-team': 'Ekip', 'footer-contact': 'İletişim', 'footer-vertex-privacy': 'Vertex Genel Gizlilik Politikası',
      'footer-vertex-terms': 'Vertex Genel Kullanım Koşulları', 'footer-solar-privacy': 'Solar Browser Gizlilik Politikası',
      'footer-solar-terms': 'Solar Browser Kullanım Koşulları',
      'footer-cortex-privacy': 'Cortex Gizlilik Politikası',
      'footer-cortex-terms': 'Cortex Kullanım Koşulları',
      'footer-allstar-privacy': 'All Star Gizlilik Politikası',
      'footer-allstar-terms': 'All Star Kullanım Koşulları',
      'footer-rights': '© {year} Vertex. Tüm hakları saklıdır.'
    },
    en: {
      'nav-home': 'Home', 'nav-about': 'About', 'nav-projects': 'Projects', 'nav-vision': 'Vision', 'nav-team': 'Team', 'nav-contact': 'Contact',
      'theme-toggle-dark': 'Dark Mode', 'theme-toggle-light': 'Light Mode', 'lang-toggle-en': 'English', 'lang-toggle-tr': 'Türkçe',
      'hero-title': 'The Peak of Technology', 'hero-description': 'Founded by Turkiye\'s brightest young minds with an average age of just 14, Vertex is pioneering the future of technology across multiple domains.', 'hero-btn-projects': 'Explore Projects', 'hero-btn-vision': 'Our Vision',
      'about-title': 'Who We Are', 'about-description': 'Started in June 2023 in Istanbul, Vertex is a cutting-edge technology company uniting Turkiye\'s youngest entrepreneurs to redefine the tech landscape globally.', 'about-card1-title': 'Young Innovators', 'about-card1-description': 'With an average age of just 15, our team represents the next generation of tech visionaries committed to pushing boundaries and creating revolutionary solutions.', 'about-card2-title': 'Multi-Domain Expertise', 'about-card2-description': 'From software development to AI, gaming, music production, and browser technologies, our diverse skill set allows us to innovate across multiple tech domains.', 'about-card3-title': 'Turkiye\'s Tech Future', 'about-card3-description': 'We\'re dedicated to positioning Turkiye as a global tech leader by developing world-class products and nurturing young talent within our borders.',
      'projects-title': 'Our Cutting-Edge Projects', 'projects-description': 'Explore our diverse portfolio of innovative technologies shaping the future across multiple domains.', 'projects-tab-all': 'All', 'projects-tab-software': 'Software', 'projects-tab-ai': 'AI', 'projects-tab-gaming': 'Gaming', 'projects-tab-music': 'Music',
      'vision-title': 'Our 3-5 Year Vision', 'vision-description1': 'By 2025, Vertex aims to establish a global presence across America, Europe, and Asia, targeting 5 million active users across our platforms and becoming a recognized force in the global tech industry.', 'vision-description2': 'We\'re committed to continuous innovation, developing our own operating system, expanding our AI capabilities, and reaching millions through our diverse portfolio of products.', 'vision-stat1': 'Target downloads for our applications worldwide', 'vision-stat2': 'Active users across our technology ecosystem', 'vision-stat3': 'Monthly listeners for Polyhedron music label', 'vision-stat4': 'Global markets - Americas, Europe, Asia',
      'team-title': 'Our Leading Innovators', 'team-description': 'The bright minds behind Vertex, Turkiye\'s youngest tech entrepreneurs, building the future today.',
      'footer-description': 'Peak of Technology. Founded in 2023 by Turkiye\'s youngest tech entrepreneurs, reshaping the future through innovation across multiple domains.', 'footer-products': 'Products', 'footer-company': 'Company', 'footer-legal': 'Legal', 'footer-about': 'About Us', 'footer-vision': 'Our Vision', 'footer-team': 'Team', 'footer-contact': 'Contact', 'footer-vertex-privacy': 'Vertex General Privacy Policy',
      'footer-vertex-terms': 'Vertex General Terms of Service',
      'footer-solar-privacy': 'Solar Browser Privacy Policy',
      'footer-solar-terms': 'Solar Browser Terms of Use',
      'footer-cortex-privacy': 'Cortex Privacy Policy',
      'footer-cortex-terms': 'Cortex Terms of Service',
      'footer-allstar-privacy': 'All Star Privacy Policy',
      'footer-allstar-terms': 'All Star Terms of Service',
      'footer-rights': '© {year} Vertex. All rights reserved.'
    }
  };

  // ===================================================================
  // == CORE FUNCTIONS
  // ===================================================================

  function applyTranslations(language) {
    document.documentElement.lang = language;
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
      const key = element.getAttribute('data-translate');
      if (translations[language]?.[key]) {
        const translatedText = translations[language][key].replace('{year}', year);
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translatedText;
        } else {
          element.textContent = translatedText;
        }
      }
    });
  }

  function updateButtonsText() {
    languageToggleBtn.textContent = currentLanguage === 'en' ? translations.en['lang-toggle-tr'] : translations.tr['lang-toggle-en'];
    const isLightTheme = document.body.classList.contains('light-theme');
    themeToggleBtn.textContent = isLightTheme ? translations[currentLanguage]['theme-toggle-dark'] : translations[currentLanguage]['theme-toggle-light'];
  }

  function toggleLanguage() {
    currentLanguage = (currentLanguage === 'en' ? 'tr' : 'en');
    localStorage.setItem('selectedLanguage', currentLanguage);
    applyTranslations(currentLanguage);
    updateButtonsText();
  }

  // ===================================================================
  // == EVENT LISTENERS & OBSERVERS
  // ===================================================================

  // Project Filtering
  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      const filter = this.getAttribute('data-filter');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const isVisible = (filter === 'all' || category === filter);
        card.style.display = isVisible ? 'block' : 'none';
        card.style.opacity = isVisible ? '1' : '0';
      });
    });
  });

  // Language & Theme Toggles
  languageToggleBtn.addEventListener('click', toggleLanguage);
  themeToggleBtn.addEventListener('click', function () {
    document.body.classList.toggle('light-theme');
    updateButtonsText();
  });

  // Scrolled Header
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Animate on Scroll
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  animateOnScrollElements.forEach(el => observer.observe(el));

  // ===================================================================
  // == INITIAL PAGE LOAD
  // ===================================================================
  applyTranslations(currentLanguage);
  updateButtonsText();

  // ===================================================================
  // == MEHTAP'S BIRTHDAY QUIZ LOGIC
  // ===================================================================
  function isItMehtapsBirthday() {
    const today = new Date();
    // HTML'de gerçek doğum günü 14 MAYIS (ay indeksi 4) olarak belirtilmiş.
    return today.getMonth() === 4 && today.getDate() === 14;
    // return true; // Test için bu satırı açabilirsiniz.
  }

  if (currentLanguage === 'tr' && isItMehtapsBirthday()) {
    initBirthdayQuiz();
  }

  function initBirthdayQuiz() {
    const overlay = document.getElementById('birthday-quiz-overlay');
    const quizSteps = document.querySelectorAll('.quiz-step');
    const optionButtons = document.querySelectorAll('.option-btn');
    let currentStepIndex = 0;
    let confettiInterval;
    document.body.style.overflow = 'hidden';
    overlay.classList.add('visible');
    const heartShape = confetti.shapeFromPath({ path: 'M0 20.25C0 13.5 6.75 0 15 0C23.25 0 30 13.5 30 20.25C30 30 15 45 15 45C15 45 0 30 0 20.25Z' });
    function startConfetti() { if (confettiInterval) return; const duration = 15 * 1000; const animationEnd = Date.now() + duration; const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 10001 }; function randomInRange(min, max) { return Math.random() * (max - min) + min; } confettiInterval = setInterval(function () { const timeLeft = animationEnd - Date.now(); if (timeLeft <= 0) return clearInterval(confettiInterval); const particleCount = 50 * (timeLeft / duration); confetti({ ...defaults, particleCount, origin: { x: randomInRange(0, 1), y: Math.random() - 0.2 }, scalar: 0.8 }); }, 350); }
    function intensifyConfetti() { confetti({ particleCount: 400, spread: 180, origin: { y: 0.6 }, zIndex: 10001, angle: 90, gravity: 0.5 }); }
    function heartExplosion() { clearInterval(confettiInterval); const end = Date.now() + (8 * 1000); const colors = ['#ff4081', '#ff8a80', '#ffffff']; (function frame() { confetti({ particleCount: 2, angle: 60, spread: 80, origin: { x: 0, y: 0.7 }, colors: colors, shapes: [heartShape], scalar: 1.5, zIndex: 10001 }); confetti({ particleCount: 2, angle: 120, spread: 80, origin: { x: 1, y: 0.7 }, colors: colors, shapes: [heartShape], scalar: 1.5, zIndex: 10001 }); confetti({ particleCount: 1, spread: 120, startVelocity: 35, origin: { x: 0.5, y: 0.2 }, colors: colors, shapes: [heartShape], scalar: 1.2, zIndex: 10001 }); if (Date.now() < end) { requestAnimationFrame(frame); } }()); }
    function showStep(index) { quizSteps.forEach(step => step.classList.remove('active')); if (quizSteps[index]) { quizSteps[index].classList.add('active'); currentStepIndex = index; } }
    function handleCorrectAnswer() { intensifyConfetti(); setTimeout(() => showStep(currentStepIndex + 1), 500); }
    function handleWrongAnswer(button) { const currentStepElement = quizSteps[currentStepIndex]; optionButtons.forEach(btn => btn.disabled = true); currentStepElement.classList.add('fade-out-reset'); setTimeout(() => { currentStepElement.classList.remove('active', 'fade-out-reset'); setTimeout(() => { currentStepElement.classList.add('active'); optionButtons.forEach(btn => btn.disabled = false); }, 100); }, 400); }
    optionButtons.forEach(button => { button.addEventListener('click', () => { const isCorrect = button.getAttribute('data-correct') === 'true'; if (isCorrect) { handleCorrectAnswer(); } else { handleWrongAnswer(button); } }); });
    function runIntro() { const text1 = document.getElementById('intro-text-1'); const text2 = document.getElementById('intro-text-2'); showStep(0); setTimeout(() => text1.classList.add('visible'), 500); setTimeout(() => text1.style.opacity = '0', 2500); setTimeout(() => { text2.classList.add('visible'); startConfetti(); intensifyConfetti(); }, 3300); setTimeout(() => showStep(1), 5300); }
    const sliderThumb = document.getElementById('love-slider-thumb'); const sliderTrack = document.getElementById('love-slider-track'); let isDragging = false;
    function onDragStart(e) { isDragging = true; sliderThumb.style.cursor = 'grabbing'; document.body.style.cursor = 'grabbing'; e.preventDefault(); }
    function onDragMove(e) { if (!isDragging) return; const clientX = e.clientX || e.touches[0].clientX; const trackRect = sliderTrack.getBoundingClientRect(); const newX = clientX - trackRect.left; sliderThumb.style.left = `${newX}px`; if (clientX >= window.innerWidth - 50) { isDragging = false; handleSliderWin(); } }
    function onDragEnd(e) { if (!isDragging) return; isDragging = false; sliderThumb.style.cursor = 'grab'; document.body.style.cursor = 'default'; const thumbRect = sliderThumb.getBoundingClientRect(); const trackRect = sliderTrack.getBoundingClientRect(); if (thumbRect.right < trackRect.right + 20) { const currentStepElement = quizSteps[currentStepIndex]; currentStepElement.classList.add('shake'); sliderThumb.style.transition = 'left 0.3s ease'; sliderThumb.style.left = '0px'; setTimeout(() => { currentStepElement.classList.remove('shake'); sliderThumb.style.transition = ''; }, 500); } }
    function handleSliderWin() { document.removeEventListener('mousemove', onDragMove); document.removeEventListener('mouseup', onDragEnd); document.removeEventListener('touchmove', onDragMove); document.removeEventListener('touchend', onDragEnd); overlay.classList.add('hearts-bg'); heartExplosion(); setTimeout(() => showStep(8), 500); runFinalSequence(); }
    sliderThumb.addEventListener('mousedown', onDragStart); document.addEventListener('mousemove', onDragMove); document.addEventListener('mouseup', onDragEnd); sliderThumb.addEventListener('touchstart', onDragStart); document.addEventListener('touchmove', onDragMove); document.addEventListener('touchend', onDragEnd);
    function runFinalSequence() { const final1 = document.getElementById('final-text-1'); const final2 = document.getElementById('final-text-2'); const final3 = document.getElementById('final-text-3'); setTimeout(() => final1.classList.add('visible'), 500); setTimeout(() => final1.style.opacity = '0', 2500); setTimeout(() => final2.classList.add('visible'), 3000); setTimeout(() => final2.style.opacity = '0', 5000); setTimeout(() => final3.classList.add('visible'), 5500); setTimeout(() => overlay.style.opacity = '0', 7500); setTimeout(() => { overlay.style.display = 'none'; document.body.style.overflow = 'auto'; }, 8500); }
    runIntro();
  }
});