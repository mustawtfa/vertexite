// =================================================================
// 1. INITIALIZATION & FIREBASE SETUP (YENİ VE MODÜLER)
// =================================================================
//
// Firebase v9+ modüler SDK'sından gerekli fonksiyonları içe aktarın.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-functions.js";


// =================================================================
// 🌍 OTOMATIK DİL ALGILAMA SİSTEMİ
// =================================================================

// 🎯 Kullanıcının browser dili ve konumuna göre otomatik dil tespiti
function detectUserLanguage() {
    try {
        // 1. Tarayıcının dil ayarlarını kontrol et
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.toLowerCase().substring(0, 2);
        
        console.log('🌍 Browser language detected:', browserLang, '→', langCode);
        
        // 2. Desteklenen dillere göre mapping
        const languageMapping = {
            'tr': 'tr',    // Türkçe
            'en': 'en',    // İngilizce
            'hi': 'hi',    // Hintçe
            'de': 'en',    // Almanca → İngilizce
            'fr': 'en',    // Fransızca → İngilizce
            'es': 'en',    // İspanyolca → İngilizce
            'it': 'en',    // İtalyanca → İngilizce
            'ru': 'en',    // Rusça → İngilizce
            'ar': 'en',    // Arapça → İngilizce
            'ja': 'en',    // Japonca → İngilizce
            'ko': 'en',    // Korece → İngilizce
            'zh': 'en',    // Çince → İngilizce
            'pt': 'en',    // Portekizce → İngilizce
            'nl': 'en',    // Hollandaca → İngilizce
            'sv': 'en',    // İsveççe → İngilizce
            'da': 'en',    // Danca → İngilizce
            'no': 'en',    // Norveççe → İngilizce
            'fi': 'en',    // Fince → İngilizce
            'pl': 'en',    // Lehçe → İngilizce
            'cs': 'en',    // Çekçe → İngilizce
            'sk': 'en',    // Slovakça → İngilizce
            'hu': 'en',    // Macarca → İngilizce
            'ro': 'en',    // Rumence → İngilizce
            'bg': 'en',    // Bulgarca → İngilizce
            'hr': 'en',    // Hırvatça → İngilizce
            'sr': 'en',    // Sırpça → İngilizce
            'sl': 'en',    // Slovence → İngilizce
            'et': 'en',    // Estonca → İngilizce
            'lv': 'en',    // Letonca → İngilizce
            'lt': 'en',    // Litvanca → İngilizce
            'mt': 'en',    // Maltaca → İngilizce
            'ga': 'en',    // İrlanda Galcesi → İngilizce
            'cy': 'en',    // Galce → İngilizce
            'eu': 'en',    // Baskça → İngilizce
            'ca': 'en',    // Katalanca → İngilizce
            'gl': 'en',    // Galicyaca → İngilizce
            'ur': 'hi',    // Urduca → Hintçe
            'bn': 'hi',    // Bengalce → Hintçe
            'ta': 'hi',    // Tamilce → Hintçe
            'te': 'hi',    // Telugu → Hintçe
            'ml': 'hi',    // Malayalam → Hintçe
            'kn': 'hi',    // Kannada → Hintçe
            'gu': 'hi',    // Gujarati → Hintçe
            'pa': 'hi',    // Punjabi → Hintçe
            'or': 'hi',    // Odia → Hintçe
            'as': 'hi',    // Assamese → Hintçe
            'mr': 'hi',    // Marathi → Hintçe
            'ne': 'hi',    // Nepalce → Hintçe
            'si': 'hi',    // Sinhalese → Hintçe
            'my': 'hi',    // Myanmar → Hintçe
            'th': 'en',    // Tayca → İngilizce
            'vi': 'en',    // Vietnamca → İngilizce
            'id': 'en',    // Endonezce → İngilizce
            'ms': 'en',    // Malayca → İngilizce
            'tl': 'en',    // Filipino → İngilizce
            'sw': 'en',    // Swahili → İngilizce
            'am': 'en',    // Amharic → İngilizce
            'he': 'en',    // İbranice → İngilizce
            'fa': 'en',    // Farsça → İngilizce
            'az': 'tr',    // Azerice → Türkçe
            'kk': 'en',    // Kazakça → İngilizce
            'ky': 'en',    // Kırgızca → İngilizce
            'uz': 'en',    // Özbekçe → İngilizce
            'tk': 'tr',    // Türkmence → Türkçe
            'mn': 'en',    // Moğolca → İngilizce
        };
        
        const detectedLang = languageMapping[langCode] || 'en'; // Varsayılan İngilizce
        
        console.log('🎯 Language mapped:', langCode, '→', detectedLang);
        
        // 3. Timezone bazlı tahmin (backup)
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log('🕐 Timezone detected:', timezone);
        
        if (timezone.includes('Istanbul') || timezone.includes('Turkey')) {
            console.log('🇹🇷 Timezone suggests Turkish');
            return 'tr';
        } else if (timezone.includes('Kolkata') || timezone.includes('Delhi') || timezone.includes('Mumbai')) {
            console.log('🇮🇳 Timezone suggests Hindi');
            return 'hi';
        }
        
        return detectedLang;
        
    } catch (error) {
        console.error('❌ Language detection error:', error);
        return 'en'; // Hata durumunda varsayılan İngilizce
    }
}

// 📍 Konum bazlı dil tespiti (Geolocation API)
function detectLocationBasedLanguage() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.log('📍 Geolocation not supported');
            resolve(null);
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log('📍 User location detected:', lat, lon);
                
                // Konum bazlı dil mapping (yaklaşık bölgeler)
                if (lat >= 35 && lat <= 42 && lon >= 25 && lon <= 45) {
                    console.log('🇹🇷 Location suggests Turkish (Turkey/Cyprus region)');
                    resolve('tr');
                } else if (lat >= 6 && lat <= 37 && lon >= 68 && lon <= 97) {
                    console.log('🇮🇳 Location suggests Hindi (India region)');
                    resolve('hi');
                } else if (lat >= 24 && lat <= 49 && lon >= -125 && lon <= -66) {
                    console.log('🇺🇸 Location suggests English (USA region)');
                    resolve('en');
                } else if (lat >= 49 && lat <= 61 && lon >= -141 && lon <= -52) {
                    console.log('🇨🇦 Location suggests English (Canada region)');
                    resolve('en');
                } else if (lat >= 50 && lat <= 60 && lon >= -8 && lon <= 2) {
                    console.log('🇬🇧 Location suggests English (UK region)');
                    resolve('en');
                } else if (lat >= 35 && lat <= 71 && lon >= -25 && lon <= 40) {
                    console.log('🇪🇺 Location suggests English (Europe region)');
                    resolve('en');
                } else {
                    console.log('🌍 Location not matched, using browser language');
                    resolve(null);
                }
            },
            function(error) {
                console.log('📍 Geolocation error:', error.message);
                resolve(null);
            },
            { 
                timeout: 3000, 
                enableHighAccuracy: false,
                maximumAge: 600000 // 10 dakika cache
            }
        );
    });
}

// 💬 Dil tespit mesajı göster
function showLanguageDetectionMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.id = 'language-detection-message';
    messageDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 10, 10, 0.95);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: 'Inter', sans-serif;
    `;
    
    messageDiv.innerHTML = `
        <div style="text-align: center; max-width: 400px; padding: 40px;">
            <div style="font-size: 48px; margin-bottom: 20px;">🌍</div>
            <h2 style="font-size: 24px; margin-bottom: 16px; font-weight: 600;">
                Detecting Your Language
            </h2>
            <p style="font-size: 16px; opacity: 0.8; margin-bottom: 20px;">
                Dilinizi tespit ediyoruz...<br>
                भाषा का पता लगाया जा रहा है...<br>
                Detecting your preferred language...
            </p>
            <div style="width: 40px; height: 40px; border: 3px solid #333; border-top: 3px solid #fff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(messageDiv);
    
    // 3 saniye sonra mesajı kaldır (güvenlik için)
    setTimeout(() => {
        if (document.getElementById('language-detection-message')) {
            document.getElementById('language-detection-message').remove();
        }
    }, 3000);
}

// 📱 Mobil dil değiştirme loading indicator'ı
function showLanguageLoadingIndicator() {
    // Zaten varsa eski loading indicator'ı kaldır
    const existingIndicator = document.getElementById('mobile-lang-loading');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'mobile-lang-loading';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-family: 'Inter', sans-serif;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;
    
    loadingDiv.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 32px; margin-bottom: 15px;">⚡</div>
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">
                Switching Language...
            </div>
            <div style="width: 30px; height: 30px; border: 2px solid #333; border-top: 2px solid #fff; border-radius: 50%; animation: fastSpin 0.8s linear infinite; margin: 0 auto;"></div>
        </div>
        <style>
            @keyframes fastSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(loadingDiv);
    
    // Animasyon için küçük delay
    setTimeout(() => {
        loadingDiv.style.opacity = '1';
    }, 10);
}

function hideLanguageLoadingIndicator() {
    const loadingDiv = document.getElementById('mobile-lang-loading');
    if (loadingDiv) {
        loadingDiv.style.opacity = '0';
        setTimeout(() => {
            if (loadingDiv.parentNode) {
                loadingDiv.parentNode.removeChild(loadingDiv);
            }
        }, 200);
    }
}

// 🚀 Otomatik dil yönlendirme - ana sayfadaysa dil klasörüne yönlendir
async function autoRedirectToLanguage() {
    const currentPath = window.location.pathname;
    const isMainPage = currentPath === '/' || 
                      currentPath === '/vertexite-main/' || 
                      currentPath.endsWith('/vertexite-main') ||
                      currentPath === '/vertexite-main/index.html';
    
    // Sadece ana sayfadaysa ve daha önce ziyaret edilmediyse yönlendir
    if (isMainPage && !localStorage.getItem('hasVisited')) {
        
        // Yükleme mesajı göster
        showLanguageDetectionMessage();
        
        // 1. Önce browser dil tespiti
        let detectedLang = detectUserLanguage();
        
        // 2. Konum bazlı tespiti de dene (asynchronous)
        try {
            const locationLang = await detectLocationBasedLanguage();
            if (locationLang) {
                detectedLang = locationLang;
                console.log('🎯 Final language from location:', detectedLang);
            }
        } catch (error) {
            console.log('📍 Location detection failed, using browser language');
        }
        
        console.log('🚀 Auto-redirecting to language:', detectedLang);
        
        // İlk ziyaret kaydı
        localStorage.setItem('hasVisited', 'true');
        localStorage.setItem('selectedLanguage', detectedLang);
        
        // Dil klasörüne yönlendir
        const baseUrl = window.location.origin;
        let redirectUrl;
        
        switch(detectedLang) {
            case 'tr':
                redirectUrl = baseUrl + '/vertexite-main/tr/';
                break;
            case 'en':
                redirectUrl = baseUrl + '/vertexite-main/en/';
                break;
            case 'hi':
                redirectUrl = baseUrl + '/vertexite-main/hi/';
                break;
            default:
                redirectUrl = baseUrl + '/vertexite-main/en/';
        }
        
        // 1 saniye delay ile yönlendir (mesaj göstermek için)
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
        
        return true; // Yönlendirme yapıldı
    }
    
    return false; // Yönlendirme yapılmadı
}

// =================================================================
// 🎨 OTOMATIK TEMA ALGILAMA SİSTEMİ
// =================================================================

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

// Global değişkenler ve sabitler, her fonksiyonun erişebilmesi için en başta tanımlanır.
const CACHE_KEY = 'newsDataCache';
const CACHE_EXPIRY_TIME_MS = 12 * 60 * 60 * 1000; // 12 saat
let newsDataCache = null;
let currentLanguage = localStorage.getItem('selectedLanguage') || detectUserLanguage();
let allTranslations = {};

// Sayfa yüklendiğinde otomatik dil algılama çalıştır
autoRedirectToLanguage().then(redirected => {
    if (redirected) {
        return; // Yönlendirme yapıldı, diğer kodları çalıştırma
    }
    // Normal sayfa yükleme devam eder
});

document.addEventListener('DOMContentLoaded', function () {
    // Önce tema algılama sistemi başlat
    initializeTheme();
    
    // ===================================================================
    // == Firebase SDK Entegrasyonu
    // ===================================================================
    const firebaseConfig = {
        apiKey: "AIzaSyBEp_LYyZWnvdhdJzvRf_h8U6rEEq2Iyp4",
        authDomain: "vertex-ai-1618.firebaseapp.com",
        projectId: "vertex-ai-1618",
        storageBucket: "vertex-ai-1618.firebasestorage.app",
        messagingSenderId: "561391430514",
        appId: "1:561391430514:web:d054fc78e6a243a3b10beb",
        measurementId: "G-QZG6X309RB"
    };

    // Firebase'i başlat
    const app = initializeApp(firebaseConfig);
    // Cloud Functions hizmetine referans al
    const functions = getFunctions(app, 'europe-west1'); // Fonksiyon bölgenizi kontrol edin
    const getNewsCacheUrl = httpsCallable(functions, 'getNewsCacheUrl');


    // ===================================================================
    // == DOM ELEMENT REFERENCES
    // ===================================================================
    const year = new Date().getFullYear();
    const tabButtons = document.querySelectorAll('.tab-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const themeToggleBtn = document.getElementById('theme-toggle-btn') || document.querySelector('.theme-toggle-btn');
    const languageDropdown = document.querySelector('.language-dropdown');
    const languageToggleBtn = document.getElementById('language-toggle-btn');
    const languageMenu = document.getElementById('language-menu');
    const currentLangText = document.getElementById('current-lang-text');
    const header = document.querySelector('header');
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    const newsContainer = document.getElementById('news-container');

    // ===================================================================
    // == TRANSLATIONS (ADVANCED CACHING SYSTEM)
    // ===================================================================
    const TRANSLATION_CACHE_KEY = 'vertexTranslationsCache';
    const TRANSLATION_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 saat
    
    // 🚀 Gelişmiş çeviri cache sistemi
    async function loadTranslations() {
        try {
            // Önce cache'ten kontrol et
            const cachedTranslations = getCachedTranslations();
            if (cachedTranslations) {
                allTranslations = cachedTranslations;
                applyTranslations(currentLanguage);
                updateCurrentLanguageText();
                console.log("📦 Çeviri dosyaları cache'ten yüklendi (hızlı)");
                
                // Background'da güncel çevirileri kontrol et
                updateTranslationsInBackground();
                return;
            }
            
            // Cache yoksa normal yükleme
            console.log("🌐 Çeviri dosyaları sunucudan indiriliyor...");
            const [trResponse, enResponse, hiResponse] = await Promise.all([
                fetch('./lang/tr.json'),
                fetch('./lang/en.json'),
                fetch('./lang/hi.json')
            ]);

            const trData = await trResponse.json();
            const enData = await enResponse.json();
            const hiData = await hiResponse.json();

            allTranslations = {
                'tr': trData,
                'en': enData,
                'hi': hiData
            };

            // Cache'e kaydet
            cacheTranslations(allTranslations);
            
            applyTranslations(currentLanguage);
            updateCurrentLanguageText();
            console.log("✅ Çeviri dosyaları başarıyla yüklendi ve cache'lendi.");

        } catch (error) {
            console.error("❌ Çeviri dosyaları yüklenirken bir hata oluştu:", error);
            
            // Hata durumunda eski cache'i dene
            const cachedTranslations = getCachedTranslations(true); // Force load even expired
            if (cachedTranslations) {
                allTranslations = cachedTranslations;
                applyTranslations(currentLanguage);
                updateCurrentLanguageText();
                console.log("⚠️ Eski cache'ten çeviri dosyaları yüklendi");
            }
        }
    }
    
    // Cache'ten çeviri dosyalarını al
    function getCachedTranslations(forceLoad = false) {
        try {
            const cached = localStorage.getItem(TRANSLATION_CACHE_KEY);
            if (!cached) return null;
            
            const { timestamp, data } = JSON.parse(cached);
            const isExpired = Date.now() - timestamp > TRANSLATION_CACHE_EXPIRY;
            
            if (isExpired && !forceLoad) return null;
            
            return data;
        } catch (error) {
            console.error("Cache okuma hatası:", error);
            return null;
        }
    }
    
    // Çevirileri cache'e kaydet
    function cacheTranslations(translations) {
        try {
            const cacheData = {
                timestamp: Date.now(),
                data: translations
            };
            localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
            console.error("Cache kaydetme hatası:", error);
        }
    }
    
    // Background'da çevirileri güncelle
    async function updateTranslationsInBackground() {
        try {
            const [trResponse, enResponse, hiResponse] = await Promise.all([
                fetch('./lang/tr.json'),
                fetch('./lang/en.json'),
                fetch('./lang/hi.json')
            ]);

            const trData = await trResponse.json();
            const enData = await enResponse.json();
            const hiData = await hiResponse.json();

            const newTranslations = {
                'tr': trData,
                'en': enData,
                'hi': hiData
            };
            
            // Yeni veriler farklıysa güncelle
            if (JSON.stringify(newTranslations) !== JSON.stringify(allTranslations)) {
                allTranslations = newTranslations;
                cacheTranslations(allTranslations);
                console.log("🔄 Çeviri dosyaları background'da güncellendi");
            }
            
        } catch (error) {
            console.log("Background güncelleme sessizce başarısız oldu");
        }
    }

    // ===================================================================
    // == CORE FUNCTIONS
    // ===================================================================

    function applyTranslations(language) {
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

    function updateCurrentLanguageText() {
        if (!allTranslations[currentLanguage]) return;

        // O anki dilin adını çeviri dosyasından alıp butona yazıyoruz.
        const langNameKey = 'lang-toggle-' + currentLanguage;
        currentLangText.textContent = allTranslations[currentLanguage][langNameKey];
        
        // Tema değiştirme butonunun metnini de güncelliyoruz.
        const isLightTheme = document.body.classList.contains('light-theme');
        themeToggleBtn.textContent = isLightTheme ? allTranslations[currentLanguage]['theme-toggle-dark'] : allTranslations[currentLanguage]['theme-toggle-light'];
    }

    // ===================================================================
    // == EVENT LISTENERS & OBSERVERS
    // ===================================================================

    // Dil butonuna basınca menüyü açıp kapatma
    languageToggleBtn.addEventListener('click', function(event) {
        languageMenu.classList.toggle('show');
        event.stopPropagation(); // Butona tıklayınca sayfa geneline yayılmasını engeller
    });

    // 🚀 MOBİL OPTİMİZE EDİLMİŞ DİL DEĞİŞTİRME SİSTEMİ
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', function() {
            const newLang = this.getAttribute('data-lang');
            const isMobile = window.innerWidth <= 768;
            
            // Dropdown menüsünü kapat
            languageMenu.classList.remove('show');
            
            // Mobilde hızlı geçiş, desktop'ta yönlendirme
            if (isMobile) {
                // 📱 MOBİL: Sayfa yenileme OLMADAN hızlı dil değişimi
                
                // Performance timing başlat
                if (window.langSwitchPerformance) {
                    window.langSwitchPerformance.start = performance.now();
                }
                
                showLanguageLoadingIndicator();
                
                // Content fade efekti başlat
                document.body.classList.add('mobile-lang-switching');
                const mainContent = document.querySelector('main') || document.body;
                mainContent.classList.add('mobile-content-fade');
                
                // Dil değişikliğini hemen uygula
                currentLanguage = newLang;
                localStorage.setItem('selectedLanguage', currentLanguage);
                
                // URL'i güncelle (sayfa yenileme olmadan)
                const newUrl = window.location.origin + `/vertexite-main/${newLang}/`;
                window.history.pushState({language: newLang}, '', newUrl);
                
                // Kısa delay ile çevirileri uygula (smooth transition için)
                setTimeout(() => {
                    applyTranslations(currentLanguage);
                    updateCurrentLanguageText();
                    
                    // Haberleri yeniden render et
                    if (newsDataCache) {
                        renderNews(newsDataCache, currentLanguage);
                    } else {
                        fetchNews();
                    }
                    
                    // Content fade efektini tamamla
                    mainContent.classList.add('completed');
                    
                    // Loading indicator'ı kaldır
                    setTimeout(() => {
                        hideLanguageLoadingIndicator();
                        document.body.classList.remove('mobile-lang-switching');
                        mainContent.classList.remove('mobile-content-fade', 'completed');
                        
                        // Performance timing bitir
                        if (window.langSwitchPerformance) {
                            window.langSwitchPerformance.end = performance.now();
                            window.langSwitchPerformance.measure();
                        }
                    }, 200);
                }, 100);
                
            } else {
                // 🖥️ DESKTOP: Geleneksel yönlendirme (daha az kritik)
                setTimeout(() => {
                    const baseUrl = window.location.origin;
                    
                    switch(newLang) {
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
                            currentLanguage = newLang;
                            localStorage.setItem('selectedLanguage', currentLanguage);
                            applyTranslations(currentLanguage);
                            updateCurrentLanguageText();
                    }
                }, 100);
            }
        });
    });

    // Menünün dışında herhangi bir yere tıklanırsa menüyü kapatma
    document.addEventListener('click', function(event) {
        if (!languageDropdown.contains(event.target)) {
            languageMenu.classList.remove('show');
        }
    });

    // Bu kısımlar aynı kalabilir
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

    // ESKİ TEMA BUTONU - Eğer varsa
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            // Mevcut temayı al
            const isDarkTheme = document.body.classList.contains('dark-theme');
            const newTheme = isDarkTheme ? 'light' : 'dark';
            
            // Yeni temayı uygula
            applyTheme(newTheme);
            
            // Buton metnini güncelle
            updateCurrentLanguageText();
            
            console.log('🔄 Theme manually changed to:', newTheme);
        });
    }

    window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // 🚀 Browser geri/ileri butonları için popstate dinleyicisi
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.language) {
            const newLang = event.state.language;
            
            // Sessizce dil değiştir (URL zaten değişti)
            currentLanguage = newLang;
            localStorage.setItem('selectedLanguage', currentLanguage);
            applyTranslations(currentLanguage);
            updateCurrentLanguageText();
            
            // Haberleri yeniden render et
            if (newsDataCache) {
                renderNews(newsDataCache, currentLanguage);
            } else {
                fetchNews();
            }
            
            console.log('🔄 Browser navigation: Language changed to', newLang);
        }
    });

    // 🍔 MOBİL HAMBURGER MENU SİSTEMİ
    initializeMobileMenu();

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
    loadTranslations();
    fetchNews();
    
    // 🐛 Mobil dil geçiş performans testi (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        console.log('🚀 Mobil dil geçiş optimizasyonu aktif');
        console.log('📱 Mevcut cihaz genişliği:', window.innerWidth + 'px');
        console.log('🔧 Cache durumu:', !!getCachedTranslations());
        
        // Performance timing
        const langSwitchPerformance = {
            start: null,
            end: null,
            measure: function() {
                if (this.start && this.end) {
                    const duration = this.end - this.start;
                    console.log(`⚡ Dil geçiş süresi: ${duration}ms`);
                    return duration;
                }
            }
        };
        
        // Global olarak erişilebilir yap
        window.langSwitchPerformance = langSwitchPerformance;
    }

    // ===================================================================
    // == 🍔 MOBİL HAMBURGER MENU SİSTEMİ - v2.0.1
    // ===================================================================
    console.log('🚀 Mobile Navigation System v2.0.1 Loading...');
    console.log('Screen width:', window.innerWidth + 'px');
    console.log('Is mobile?', window.innerWidth <= 768);
    
    // Force mobile check
    if (window.innerWidth <= 768) {
        console.log('📱 MOBILE MODE DETECTED - Forcing mobile navigation...');
        document.body.classList.add('mobile-mode');
    }
    
    function initializeMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        const mobileNavClose = document.getElementById('mobile-nav-close');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        
        if (!mobileMenuToggle || !mobileNavOverlay) return;
        
        // Hamburger menu toggle
        mobileMenuToggle.addEventListener('click', function() {
            const isActive = mobileMenuToggle.classList.contains('active');
            
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
                updateCurrentLanguageText();
            });
        } else {
            console.error('❌ Mobile theme checkbox not found in mobile menu!');
        }
    }
    
    function openMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        
        mobileMenuToggle.classList.add('active');
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Accessibility
        mobileNavOverlay.setAttribute('aria-hidden', 'false');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }
    
    function closeMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        
        mobileMenuToggle.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Accessibility
        mobileNavOverlay.setAttribute('aria-hidden', 'true');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
    
    function changeMobileLanguage(newLang) {
        // Mobile için optimize edilmiş dil değişimi
        showLanguageLoadingIndicator();
        
        currentLanguage = newLang;
        localStorage.setItem('selectedLanguage', currentLanguage);
        
        // URL güncelle
        const newUrl = window.location.origin + `/vertexite-main/${newLang}/`;
        window.history.pushState({language: newLang}, '', newUrl);
        
        // Çevirileri uygula
        applyTranslations(currentLanguage);
        updateCurrentLanguageText();
        
        // Haberleri yeniden render et
        if (newsDataCache) {
            renderNews(newsDataCache, currentLanguage);
        } else {
            fetchNews();
        }
        
        // Loading indicator'ı kaldır
        setTimeout(() => {
            hideLanguageLoadingIndicator();
        }, 300);
        
        console.log('📱 Mobile language changed to:', newLang);
    }

    // ===================================================================
    // == 🎨 MODERN THEME TOGGLE SİSTEMİ
    // ===================================================================
    
    function initializeModernTheme() {
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
                updateCurrentLanguageText();

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
    
    // Modern theme sistemi başlat
    initializeModernTheme();

    // Debug: Add global test functions for theme toggle
    window.testThemeToggle = function(theme) {
        console.log('🧪 Testing theme toggle with:', theme);
        if (typeof window.applyTheme === 'function') {
            window.applyTheme(theme);
            console.log('✅ Theme applied successfully');
        } else {
            console.error('❌ applyTheme function not available');
        }
    };

    // Debug: Add click test for checkboxes
    window.testDesktopThemeToggle = function() {
        const checkbox = document.getElementById('theme-toggle-checkbox');
        if (checkbox) {
            console.log('🧪 Testing desktop theme checkbox click');
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        } else {
            console.error('❌ Desktop theme checkbox not found');
        }
    };

    if (currentLanguage === 'tr' && isItMehtapsBirthday()) {
        initBirthdayQuiz();
    }

    // ===================================================================
    // == MEHTAP'S BIRTHDAY QUIZ LOGIC
    // ===================================================================
    function isItMehtapsBirthday() {
        const today = new Date();
        return today.getMonth() === 4 && today.getDate() === 14;
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
    // ===================================================================
    // == HABERLER BÖLÜMÜ
    // ===================================================================
    
    async function fetchNews() {
        if (typeof functions === 'undefined') {
            console.error("Firebase Functions SDK bulunamadığı için haberler çekilemiyor.");
            if (newsContainer) {
                newsContainer.innerHTML = "<h2>Haberler şu anda yüklenemiyor.</h2>";
            }
            return;
        }

        try {
            const cachedData = localStorage.getItem(CACHE_KEY);
            let newsData;
    
            if (cachedData) {
                const { timestamp, data } = JSON.parse(cachedData);
                if (Date.now() - timestamp < CACHE_EXPIRY_TIME_MS) {
                    console.log('Haberler önbellekten yükleniyor.');
                    newsData = data;
                    newsDataCache = newsData;
                    renderNews(newsData, currentLanguage);
                    return;
                }
            }
    
            console.log('Haberler Firebase Cloud Function\'dan çekiliyor.');
            
            // Cloud Function'dan imzalı URL'yi al
            const result = await getNewsCacheUrl();
            const signedUrl = result.data.signedUrl;
    
            if (!signedUrl) {
                throw new Error("Güvenli URL alınamadı.");
            }
    
            // İmzalı URL ile JSON dosyasını çek
            const newsResponse = await fetch(signedUrl);
            if (!newsResponse.ok) {
                throw new Error('Haber verisi alınamadı.');
            }
            newsData = await newsResponse.json();
            newsDataCache = newsData;
    
            // Haber verisini önbelleğe kaydet
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                data: newsData
            }));
            
            renderNews(newsData, currentLanguage);
    
        } catch (error) {
            console.error("Haberler yüklenirken bir hata oluştu:", error);
            if (newsContainer) {
                const noNewsText = allTranslations[currentLanguage]?.['no-news-found'] || "Haberler şu anda yüklenemiyor.";
                newsContainer.innerHTML = `<h2>${noNewsText}</h2>`;
            }
        }
    }
    
    function renderNews(newsData, language) {
        if (!newsContainer) return;
    
        newsContainer.innerHTML = '';
    
        if (!newsData || newsData.length === 0) {
            const noNewsText = allTranslations[language]?.['no-news-found'] || "Henüz yayınlanmış bir haber bulunmuyor.";
            newsContainer.innerHTML = `<h2>${noNewsText}</h2>`;
            return;
        }
    
        // Tarihe göre en yeniyi en üste gelecek şekilde sırala
        newsData.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
        newsData.forEach(newsItem => {
            const articleDiv = document.createElement('div');
            articleDiv.className = 'news-article';
            articleDiv.dataset.aos = "fade-up";
    
            // Haber başlığı ve özetini seçili dile göre al.
            const titleText = newsItem.title[language] || newsItem.title['tr'] || 'Başlık Yok';
            const contentText = newsItem.summary[language] || newsItem.summary['tr'] || 'Özet Yok';
    
            // Kapak resmi varsa ekle
            if (newsItem.cover && newsItem.cover[language]) {
                const coverImg = document.createElement('img');
                coverImg.src = newsItem.cover[language];
                coverImg.alt = titleText + ' Kapak Resmi';
                coverImg.className = 'news-cover-img';
                articleDiv.appendChild(coverImg);
            }
    
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'news-content-wrapper';
    
            const title = document.createElement('h3');
            title.textContent = titleText;
    
            const content = document.createElement('p');
            content.textContent = contentText;
    
            contentWrapper.appendChild(title);
            contentWrapper.appendChild(content);
    
            articleDiv.appendChild(contentWrapper);
            newsContainer.appendChild(articleDiv);
        });
    }
});