// =================================================================
// TRANSLATIONS MANAGEMENT
// =================================================================

// Global değişkenler
let allTranslations = {};
let currentLanguage = localStorage.getItem('selectedLanguage') || 'tr';

// Çeviri dosyalarını yükle
async function loadTranslations(langPath = './lang/') {
    try {
        const [trResponse, enResponse, hiResponse] = await Promise.all([
            fetch(langPath + 'tr.json'),
            fetch(langPath + 'en.json'),
            fetch(langPath + 'hi.json')
        ]);

        const trData = await trResponse.json();
        const enData = await enResponse.json();
        const hiData = await hiResponse.json();

        allTranslations = {
            'tr': trData,
            'en': enData,
            'hi': hiData
        };

        console.log("Çeviri dosyaları başarıyla yüklendi.");
        return allTranslations;

    } catch (error) {
        console.error("Çeviri dosyaları yüklenirken bir hata oluştu:", error);
        return {};
    }
}

// Çevirileri uygula
function applyTranslations(language, year = new Date().getFullYear()) {
    if (!allTranslations[language]) return;

    document.documentElement.lang = language;
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (allTranslations[language]?.[key]) {
            const translatedText = allTranslations[language][key].replace('{year}', year);
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translatedText;
            } else {
                element.textContent = translatedText;
            }
        }
    });
}

// Dil metnini güncelle
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

// 🚀 MOBİL OPTİMİZE EDİLMİŞ DİL DEĞİŞTİRME SİSTEMİ
function changeLanguage(newLanguage, allTranslations, newsDataCache, fetchNews, renderNews) {
    const isMobile = window.innerWidth <= 768;
    
    // Dropdown menüsünü kapat
    const languageMenu = document.getElementById('language-menu');
    if (languageMenu) {
        languageMenu.classList.remove('show');
    }
    
    // Mobilde hızlı geçiş, desktop'ta yönlendirme
    if (isMobile) {
        // 📱 MOBİL: Sayfa yenileme OLMADAN hızlı dil değişimi
        if (typeof showLanguageLoadingIndicator === 'function') {
            showLanguageLoadingIndicator();
        }
        
        // Dil değişikliğini hemen uygula
        currentLanguage = newLanguage;
        localStorage.setItem('selectedLanguage', currentLanguage);
        
        // URL'i güncelle (sayfa yenileme olmadan)
        const baseUrl = window.location.origin;
        const newUrl = baseUrl + `/vertexite-main/${newLanguage}/`;
        window.history.pushState({language: newLanguage}, '', newUrl);
        
        // Çevirileri anında uygula
        applyTranslations(currentLanguage);
        updateCurrentLanguageText(allTranslations, currentLanguage);
        
        // Haberleri yeniden render et
        if (newsDataCache) {
            renderNews(newsDataCache, currentLanguage, allTranslations);
        } else {
            fetchNews(currentLanguage, allTranslations);
        }
        
        // Loading indicator'ı kaldır
        setTimeout(() => {
            if (typeof hideLanguageLoadingIndicator === 'function') {
                hideLanguageLoadingIndicator();
            }
        }, 300);
        
    } else {
        // 🖥️ DESKTOP: Geleneksel yönlendirme (daha az kritik)
        setTimeout(() => {
            const currentPath = window.location.pathname;
            const baseUrl = window.location.origin;
            
            // Mevcut dil klasörü kontrolü
            if (currentPath.includes('/tr/') || currentPath.includes('/en/') || currentPath.includes('/hi/')) {
                // Zaten bir dil klasöründeyse, o klasöre yönlendir
                switch(newLanguage) {
                    case 'tr':
                        window.location.href = baseUrl + '/vertexite-main/tr/';
                        break;
                    case 'en':
                        window.location.href = baseUrl + '/vertexite-main/en/';
                        break;
                    case 'hi':
                        window.location.href = baseUrl + '/vertexite-main/hi/';
                        break;
                }
                return;
            }
            
            // Ana sayfadaysa da dil klasörlerine yönlendir
            switch(newLanguage) {
                case 'tr':
                    window.location.href = baseUrl + '/vertexite-main/tr/';
                    break;
                case 'en':
                    window.location.href = baseUrl + '/vertexite-main/en/';
                    break;
                case 'hi':
                    window.location.href = baseUrl + '/vertexite-main/hi/';
                    break;
                default:
                    // Eski davranış (sayfa yenileme olmadan)
                    currentLanguage = newLanguage;
                    localStorage.setItem('selectedLanguage', currentLanguage);
                    applyTranslations(currentLanguage);
                    updateCurrentLanguageText(allTranslations, currentLanguage);

                    // Dil değiştiğinde haberleri yeniden render et
                    if (newsDataCache) {
                        renderNews(newsDataCache, currentLanguage, allTranslations);
                    } else {
                        fetchNews(currentLanguage, allTranslations);
                    }
            }
        }, 100);
    }
}

// Dil bilgilerini al
function getCurrentLanguage() {
    return currentLanguage;
}

function getAllTranslations() {
    return allTranslations;
}

function setCurrentLanguage(language) {
    currentLanguage = language;
    localStorage.setItem('selectedLanguage', currentLanguage);
}

// Global değişkenleri dışa aktar
export {
    loadTranslations,
    applyTranslations,
    updateCurrentLanguageText,
    changeLanguage,
    getCurrentLanguage,
    getAllTranslations,
    setCurrentLanguage
};
