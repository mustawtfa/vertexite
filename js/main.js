// =================================================================
// MAIN APPLICATION LOGIC
// =================================================================

// DOM element references
let tabButtons, projectCards, themeToggleBtn, languageDropdown,
    languageToggleBtn, languageMenu, currentLangText, header,
    animateOnScrollElements, newsContainer;

function initializeDOMReferences() {
    tabButtons = document.querySelectorAll('.tab-btn');
    projectCards = document.querySelectorAll('.project-card');
    themeToggleBtn = document.getElementById('theme-toggle-btn');
    languageDropdown = document.querySelector('.language-dropdown');
    languageToggleBtn = document.getElementById('language-toggle-btn');
    languageMenu = document.getElementById('language-menu');
    currentLangText = document.getElementById('current-lang-text');
    header = document.querySelector('header');
    animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    newsContainer = document.getElementById('news-container');
}

// Event listeners ve observers
function initializeEventListeners(allTranslations, currentLanguage, newsDataCache, fetchNews, renderNews, changeLanguage) {

    // Dil butonuna basınca menüyü açıp kapatma
    if (languageToggleBtn) {
        languageToggleBtn.addEventListener('click', function(event) {
            languageMenu.classList.toggle('show');
            event.stopPropagation();
        });
    }

    // Menü içindeki herhangi bir dil butonuna basıldığında
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', function() {
            const newLang = this.getAttribute('data-lang');
            changeLanguage(newLang, allTranslations, newsDataCache, fetchNews, renderNews);
            languageMenu.classList.remove('show');
        });
    });

    // Menünün dışında herhangi bir yere tıklanırsa menüyü kapatma
    document.addEventListener('click', function(event) {
        if (languageDropdown && !languageDropdown.contains(event.target)) {
            languageMenu.classList.remove('show');
        }
    });

    // Proje tab'ları
    if (tabButtons) {
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
    }

    // Tema değiştirme - YENİ SİSTEM İLE UYUMLU
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            // Mevcut temayı al
            const isDarkTheme = document.body.classList.contains('dark-theme');
            const newTheme = isDarkTheme ? 'light' : 'dark';
            
            // Tema sistemini çağır (main.js dışından)
            if (typeof window.applyTheme === 'function') {
                window.applyTheme(newTheme);
            } else {
                // Fallback: Manuel tema değişimi
                if (newTheme === 'dark') {
                    document.body.classList.remove('light-theme', 'theme-loading');
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme', 'theme-loading');
                    document.body.classList.add('light-theme');
                }
                localStorage.setItem('selectedTheme', newTheme);
            }
            
            // Buton metnini güncelle
            updateCurrentLanguageText(allTranslations, currentLanguage);
            
            console.log('🔄 Tema manuel olarak değiştirildi:', newTheme);
        });
    }

    // Scroll efekti
    window.addEventListener('scroll', function () {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // Animasyon observer
    if (animateOnScrollElements) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animateOnScrollElements.forEach(el => observer.observe(el));
    }
}

// Tema yönetimi - MODERN THEME TOGGLE SİSTEMİ

// 🌌 Kullanıcının sistem tema tercihini algıla
function detectSystemTheme() {
    try {
        // 1. Kullanıcının sistem tema tercihini kontrol et
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

        console.log('🎨 System theme detection:');
        console.log('  - Prefers dark:', prefersDark);
        console.log('  - Prefers light:', prefersLight);

        // 2. localStorage'dan kullanıcının önceki tercihini kontrol et
        const savedTheme = localStorage.getItem('selectedTheme');
        console.log('  - Saved theme:', savedTheme);

        // 3. Tema kararı ver
        let detectedTheme;
        if (savedTheme) {
            // Kullanıcının kaydedilmiş tercihi var
            detectedTheme = savedTheme;
            console.log('🔄 Using saved theme:', detectedTheme);
        } else if (prefersDark) {
            // Sistem karanlık mod tercih ediyor
            detectedTheme = 'dark';
            console.log('🌙 System prefers dark theme');
        } else if (prefersLight) {
            // Sistem açık mod tercih ediyor
            detectedTheme = 'light';
            console.log('☀️ System prefers light theme');
        } else {
            // Varsayılan açık mod
            detectedTheme = 'light';
            console.log('🌅 Defaulting to light theme');
        }

        return detectedTheme;

    } catch (error) {
        console.error('❌ Theme detection error:', error);
        return 'light'; // Hata durumunda varsayılan açık mod
    }
}

function applyTheme(theme) {
    const body = document.body;
    const isDark = theme === 'dark';

    if (isDark) {
        body.classList.remove('light-theme', 'theme-loading');
        body.classList.add('dark-theme');
        console.log('🌙 Applied dark theme');
    } else {
        body.classList.remove('dark-theme', 'theme-loading');
        body.classList.add('light-theme');
        console.log('☀️ Applied light theme');
    }

    // Tema tercihini kaydet
    localStorage.setItem('selectedTheme', theme);
}

// Tema fonksiyonunu global olarak erişilebilir yap
window.applyTheme = applyTheme;

function initializeTheme() {
    const detectedTheme = detectSystemTheme();
    applyTheme(detectedTheme);

    // Sistem tema değişikliklerini dinle
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        const savedTheme = localStorage.getItem('selectedTheme');
        // Eğer kullanıcı manuel bir seçim yapmamışsa, sistem değişikliğini takip et
        if (!savedTheme) {
            const newTheme = e.matches ? 'dark' : 'light';
            console.log('🔄 System theme changed to:', newTheme);
            applyTheme(newTheme);
        }
    });
}

// 🎨 MODERN THEME TOGGLE SİSTEMİ
function initializeModernTheme(allTranslations, currentLanguage) {
    const desktopThemeCheckbox = document.getElementById('theme-toggle-checkbox');
    const mobileThemeCheckbox = document.getElementById('mobile-theme-checkbox');

    // Mevcut tema durumunu checkboxlara yansıt
    const isDarkTheme = document.body.classList.contains('dark-theme');

    console.log('🎨 Initializing Modern Theme System...');
    console.log('Desktop checkbox:', !!desktopThemeCheckbox);
    console.log('Mobile checkbox:', !!mobileThemeCheckbox);
    console.log('Current theme:', isDarkTheme ? 'dark' : 'light');

    // Debug: Check if elements exist
    if (!desktopThemeCheckbox) {
        console.error('❌ Desktop theme checkbox not found!');
    }
    if (!mobileThemeCheckbox) {
        console.error('❌ Mobile theme checkbox not found!');
    }

    if (desktopThemeCheckbox) {
        desktopThemeCheckbox.checked = isDarkTheme;
        console.log('✅ Desktop theme checkbox event listener attached');
        desktopThemeCheckbox.addEventListener('change', function() {
            console.log('🖥️ Desktop theme toggle clicked!');
            const newTheme = this.checked ? 'dark' : 'light';
            console.log('🖥️ Desktop theme changed to:', newTheme);

            if (typeof window.applyTheme === 'function') {
                window.applyTheme(newTheme);
            } else {
                // Manual fallback
                if (newTheme === 'dark') {
                    document.body.classList.remove('light-theme');
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                    document.body.classList.add('light-theme');
                }
                localStorage.setItem('selectedTheme', newTheme);
            }
            updateCurrentLanguageText(allTranslations, currentLanguage);

            // Mobile checkbox'ı da senkronize et
            if (mobileThemeCheckbox) {
                mobileThemeCheckbox.checked = this.checked;
            }
        });
    }

    if (mobileThemeCheckbox) {
        mobileThemeCheckbox.checked = isDarkTheme;
        // Mobile theme checkbox event listener zaten mobile menu'de tanımlı
    }
}

// Sayfa yüklendiğinde çalıştırılacak fonksiyonlar
async function initializePage(allTranslations, currentLanguage, newsDataCache, fetchNews, renderNews, changeLanguage) {
    initializeDOMReferences();
    initializeEventListeners(allTranslations, currentLanguage, newsDataCache, fetchNews, renderNews, changeLanguage);
    initializeTheme();
    initializeModernTheme(allTranslations, currentLanguage);
    initializeMobileMenu();
}

// Helper function for updating language text
function updateCurrentLanguageText(allTranslations, currentLanguage) {
    if (!allTranslations[currentLanguage]) return;

    const currentLangText = document.getElementById('current-lang-text');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    // O anki dilin adını çeviri dosyasından alıp butona yazıyoruz.
    const langNameKey = 'lang-toggle-' + currentLanguage;
    if (currentLangText) {
        currentLangText.textContent = allTranslations[currentLanguage][langNameKey];
    }

    // Tema değiştirme butonunun metnini de güncelliyoruz.
    if (themeToggleBtn) {
        const isLightTheme = document.body.classList.contains('light-theme');
        themeToggleBtn.textContent = isLightTheme ?
            allTranslations[currentLanguage]['theme-toggle-dark'] :
            allTranslations[currentLanguage]['theme-toggle-light'];
    }
}

// 🍔 MOBİL HAMBURGER MENU SİSTEMİ
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!mobileMenuToggle || !mobileNavOverlay) return;

    // Hamburger menu toggle
    mobileMenuToggle.addEventListener('click', function() {
        const isActive = mobileMenuToggle.classList.contains('active');
        console.log('🍔 Mobile menu toggle clicked. Active?', isActive);

        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close button
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileMenu);
    }

    // Close on overlay click
    mobileNavOverlay.addEventListener('click', function(e) {
        if (e.target === mobileNavOverlay) {
            closeMobileMenu();
        }
    });

    // Close on navigation link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
            // Smooth scroll için delay
            setTimeout(() => {
                const target = this.getAttribute('href');
                if (target.startsWith('#')) {
                    const element = document.querySelector(target);
                    if (element) {
                        element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            }, 300);
        });
    });

    // ESC key ile kapatma
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Mobile language buttons
    const mobileLangButtons = document.querySelectorAll('.mobile-lang-btn');
    mobileLangButtons.forEach(button => {
        button.addEventListener('click', function() {
            const newLang = this.getAttribute('data-lang');

            // Active state güncelle
            mobileLangButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Dil değiştir (mobil optimized fonksiyonu kullan)
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                changeMobileLanguage(newLang);
            }

            // Menu'yu kapat
            setTimeout(closeMobileMenu, 500);
        });
    });

    // Mobile theme toggle
    const mobileThemeCheckbox = document.getElementById('mobile-theme-checkbox');
    if (mobileThemeCheckbox) {
        console.log('✅ Mobile theme checkbox found and event listener attached');
        // Mevcut tema durumunu checkbox'a yansıt
        const isDarkTheme = document.body.classList.contains('dark-theme');
        mobileThemeCheckbox.checked = isDarkTheme;

        mobileThemeCheckbox.addEventListener('change', function() {
            console.log('📱 Mobile theme toggle clicked!');
            const newTheme = this.checked ? 'dark' : 'light';
            console.log('📱 Mobile theme changed to:', newTheme);
            if (typeof window.applyTheme === 'function') {
                window.applyTheme(newTheme);
            }
            updateCurrentLanguageText(allTranslations, currentLanguage);
        });
    } else {
        console.error('❌ Mobile theme checkbox not found in mobile menu!');
    }
}

function openMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const headerEl = document.querySelector('header');

    mobileMenuToggle.classList.add('active');
    mobileNavOverlay.classList.add('active');
    // Fail-safe: force display in case of CSS specificity issues
    mobileNavOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    if (headerEl) headerEl.classList.add('menu-open');

    // Accessibility
    mobileNavOverlay.setAttribute('aria-hidden', 'false');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
}

function closeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const headerEl = document.querySelector('header');

    mobileMenuToggle.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    // Revert inline style display if set
    mobileNavOverlay.style.display = '';
    document.body.style.overflow = '';
    if (headerEl) headerEl.classList.remove('menu-open');

    // Accessibility
    mobileNavOverlay.setAttribute('aria-hidden', 'true');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
}

function changeMobileLanguage(newLang) {
    // Mobile için optimize edilmiş dil değişimi
    console.log('📱 Changing mobile language to:', newLang);

    currentLanguage = newLang;
    localStorage.setItem('selectedLanguage', currentLanguage);

    // URL güncelle
    const newUrl = window.location.origin + `/vertexite-main/${newLang}/`;
    window.history.pushState({language: newLang}, '', newUrl);

    // Çevirileri uygula
    if (allTranslations && allTranslations[currentLanguage]) {
        applyTranslations(allTranslations, currentLanguage);
    }
    updateCurrentLanguageText(allTranslations, currentLanguage);

    console.log('📱 Mobile language changed to:', newLang);
}

// Global değişkenleri dışa aktar
export {
    initializePage,
    initializeDOMReferences,
    initializeEventListeners,
    initializeTheme,
    initializeModernTheme,
    initializeMobileMenu,
    detectSystemTheme,
    applyTheme,
    updateCurrentLanguageText
};
