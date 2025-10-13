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
    // Dil değişikliğini hemen uygula
    currentLanguage = newLanguage;
    localStorage.setItem('selectedLanguage', currentLanguage);

    // URL'i güncelle (sayfa yenileme ile)
    const basePath = window.location.pathname.includes('/vertexite-main/') ? '/vertexite-main' : '';
    const redirectUrl = `${window.location.origin}${basePath}/${newLanguage}/`;
    window.location.href = redirectUrl; // Tam sayfa yenileme ile yönlendir
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
