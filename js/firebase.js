// =================================================================
// FIREBASE CONFIGURATION & NEWS FUNCTIONS
// =================================================================

// Firebase v9+ modüler SDK'sından gerekli fonksiyonları içe aktarın.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-functions.js";

// Global değişkenler ve sabitler
const CACHE_KEY = 'newsDataCache';
const CACHE_EXPIRY_TIME_MS = 12 * 60 * 60 * 1000; // 12 saat
let newsDataCache = null;
let functions = null;
let getNewsCacheUrl = null;

// Firebase'i başlat
function initializeFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyBEp_LYyZWnvdhdJzvRf_h8U6rEEq2Iyp4",
        authDomain: "vertex-ai-1618.firebaseapp.com",
        projectId: "vertex-ai-1618",
        storageBucket: "vertex-ai-1618.firebasestorage.app",
        messagingSenderId: "561391430514",
        appId: "1:561391430514:web:d054fc78e6a243a3b10beb",
        measurementId: "G-QZG6X309RB"
    };

    const app = initializeApp(firebaseConfig);
    functions = getFunctions(app, 'europe-west1');
    getNewsCacheUrl = httpsCallable(functions, 'getNewsCacheUrl');

    console.log("Firebase başarıyla başlatıldı.");
    return { functions, getNewsCacheUrl };
}

// Firebase functions'ları kontrol et
function checkFirebaseAvailability() {
    return typeof functions !== 'undefined' && functions !== null;
}

// Haber verilerini çek
async function fetchNews(currentLanguage, allTranslations) {
    if (!checkFirebaseAvailability()) {
        console.error("Firebase Functions SDK bulunamadığı için haberler çekilemiyor.");
        const newsContainer = document.getElementById('news-container');
        if (newsContainer) {
            const noNewsText = allTranslations[currentLanguage]?.['no-news-found'] || "Haberler şu anda yüklenemiyor.";
            newsContainer.innerHTML = `<h2>${noNewsText}</h2>`;
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
                renderNews(newsData, currentLanguage, allTranslations);
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

        renderNews(newsData, currentLanguage, allTranslations);

    } catch (error) {
        console.error("Haberler yüklenirken bir hata oluştu:", error);
        const newsContainer = document.getElementById('news-container');
        if (newsContainer) {
            const noNewsText = allTranslations[currentLanguage]?.['no-news-found'] || "Haberler şu anda yüklenemiyor.";
            newsContainer.innerHTML = `<h2>${noNewsText}</h2>`;
        }
    }
}

// Haber verilerini render et
function renderNews(newsData, language, allTranslations) {
    const newsContainer = document.getElementById('news-container');
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

// Global değişkenleri dışa aktar
export {
    initializeFirebase,
    fetchNews,
    renderNews,
    newsDataCache,
    CACHE_KEY,
    CACHE_EXPIRY_TIME_MS
};
