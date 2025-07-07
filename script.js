document.addEventListener('DOMContentLoaded', function () {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  themeToggleBtn.addEventListener('click', function () {
    document.body.classList.toggle('light-theme');
    // Tema değiştirme butonunun metnini güncelle
    if (document.body.classList.contains('light-theme')) {
      themeToggleBtn.textContent = translations[currentLanguage]['theme-toggle-dark'];
    } else {
      themeToggleBtn.textContent = translations[currentLanguage]['theme-toggle-light'];
    }
  });

  window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateOnScrollElements.forEach(el => observer.observe(el));


  // Dil çevirileri
  const translations = {
    tr: {
      // Navigasyon
      'nav-home': 'Ana Sayfa',
      'nav-about': 'Hakkımızda',
      'nav-projects': 'Projeler',
      'nav-vision': 'Vizyon',
      'nav-team': 'Ekip',
      'nav-contact': 'İletişim',
      'theme-toggle-dark': 'Karanlık Mod',
      'theme-toggle-light': 'Aydınlık Mod',
      'lang-toggle-en': 'English', // İngilizce buton metni (Türkçe aktifken)
      'lang-toggle-tr': 'Türkçe', // Türkçe buton metni (İngilizce aktifken)

      // Hero Bölümü
      'hero-title': 'Teknolojinin Zirvesi',
      'hero-description': 'Türkiye\'nin en parlak genç yetenekleri tarafından ortalama 15 yaşında kurulmuş olan Vertex, teknolojinin geleceğini birçok alanda öncülük ediyor.',
      'hero-btn-projects': 'Projeleri Keşfet',
      'hero-btn-vision': 'Vizyonumuz',

      // Hakkımızda Bölümü
      'about-title': 'Biz Kimiz',
      'about-description': 'Haziran 2023\'te İstanbul\'da kurulan Vertex Corporation, Türkiye\'nin en genç girişimcilerini birleştirerek küresel teknoloji manzarasını yeniden tanımlayan ileri teknoloji şirketidir.',
      'about-card1-title': 'Genç Yenilikçiler',
      'about-card1-description': 'Ortalama 15 yaşındaki ekibimiz, sınırları zorlamaya ve devrim niteliğinde çözümler yaratmaya kendini adamış yeni nesil teknoloji vizyonerlerini temsil ediyor.',
      'about-card2-title': 'Çok Alanlı Uzmanlık',
      'about-card2-description': 'Yazılım geliştirmeden yapay zeka, oyun, müzik prodüksiyonu ve tarayıcı teknolojilerine kadar geniş beceri setimiz, birçok teknoloji alanında yenilik yapmamızı sağlıyor.',
      'about-card3-title': 'Türkiye\'nin Teknoloji Geleceği',
      'about-card3-description': 'Dünya standartlarında ürünler geliştirerek ve sınırlarımız içinde genç yetenekleri besleyerek Türkiye\'yi küresel teknoloji lideri konumuna getirmeye kendimizi adadık.',

      // Projeler Bölümü
      'projects-title': 'İleri Teknoloji Projelerimiz',
      'projects-description': 'Birçok alanda geleceği şekillendiren yenilikçi teknoloji portföyümüzü keşfedin.',
      'projects-tab-all': 'Tümü',
      'projects-tab-software': 'Yazılım',
      'projects-tab-ai': 'Yapay Zeka',
      'projects-tab-gaming': 'Oyun',
      'projects-tab-music': 'Müzik',
      'project-ai-platform-title': 'Yapay Zeka Platformu',
      'project-ai-platform-description': 'Gelişmiş yeteneklere sahip devrim niteliğinde çevrimiçi ve çevrimdışı yapay zeka platformu.',

      'project-programming-language-title': 'Yenilikçi Programlama Dili',
      'project-programming-language-description': 'Geliştiricilere çok yönlü ve verimli kodlama araçları sunmak üzere tasarlanmış yenilikçi programlama dilimiz.',

      'project-web-browser-title': 'Sıfırdan Web Tarayıcı',
      'project-web-browser-description': 'Gelişmiş performans ve gizlilik için Chromium bağımlılıkları olmadan sıfırdan oluşturulmuş son teknoloji web tarayıcısı.',

      'project-mobile-game-title': 'Mobil Oyunumuz',
      'project-mobile-game-description': 'Sıfır pazarlama bütçesiyle sadece 48 saatte 5 milyondan fazla kişiye ve 20.000\'den fazla indirmeye ulaşan ilk mobil oyunumuz.',

      'project-anti-cheat-title': 'Gelişmiş Hile Karşıtı Teknoloji',
      'project-anti-cheat-description': 'Oyun platformlarında adil oyun ortamları sağlayan gelişmiş hile karşıtı teknolojisi.',

      'project-music-label-title': 'Müzik Şirketimiz',
      'project-music-label-description': 'Halihazırda platformlarda 5.000\'den fazla aylık dinleyiciye ulaşan genç sanatçıları güçlendiren müzik şirketimiz.',


      // Vizyon Bölümü
      'vision-title': '3-5 Yıllık Vizyonumuz',
      'vision-description1': '2025 yılına kadar Vertex, Amerika, Avrupa ve Asya\'da küresel varlık kurarak platformlarımızda 5 milyon aktif kullanıcı hedeflemeyi ve küresel teknoloji endüstrisinde tanınan bir güç olmayı amaçlıyor.',
      'vision-description2': 'Sürekli inovasyona, kendi işletim sistemimizi geliştirmeye, yapay zeka yeteneklerimizi genişletmeye ve çeşitli ürün portföyümüzle milyonlara ulaşmaya kendimizi adadık.',
      'vision-stat1': 'Uygulamalarımız için dünya çapında hedef indirme sayısı',
      'vision-stat2': 'Teknoloji ekosistemimizdeki aktif kullanıcı',
      'vision-stat3': 'Polyhedron müzik etiketi için aylık dinleyici',
      'vision-stat4': 'Küresel pazarlar - Amerika, Avrupa, Asya',

      // Ekip Bölümü
      'team-title': 'Önde Gelen Yenilikçilerimiz',
      'team-description': 'Vertex Corporation\'ın arkasındaki parlak zihinler, Türkiye\'nin en genç teknoloji girişimcileri, bugün geleceği inşa ediyorlar.',

      // İletişim Bölümü
      'contact-title': 'İletişime Geçin',
      'contact-description': 'Teknolojilerimiz veya potansiyel işbirlikleri konusunda ilginiz mi var? Ekibimizle iletişime geçin.',
      'contact-form-name': 'İsim',
      'contact-form-email': 'E-posta',
      'contact-form-subject': 'Konu',
      'contact-form-message': 'Mesaj',
      'contact-form-submit': 'Mesaj Gönder',
      'contact-info-title': 'İletişim Bilgileri',
      'contact-info-location': 'Konum',
      'contact-info-email': 'E-posta',
      'contact-info-social': 'Sosyal Medya',
      'contact-placeholder-name': 'Adınız',
      'contact-placeholder-email': 'E-posta adresiniz',
      'contact-placeholder-subject': 'Konu başlığı',
      'contact-placeholder-message': 'Mesajınız',

      // Alt Bilgi
      'footer-description': 'Teknolojinin Zirvesi. 2023 yılında Türkiye\'nin en genç teknoloji girişimcileri tarafından kurulmuş, birçok alanda yenilik yoluyla geleceği yeniden şekillendiriyor.',
      'footer-products': 'Ürünler',
      'footer-company': 'Şirket',
      'footer-legal': 'Yasal',
      'footer-about': 'Hakkımızda',
      'footer-vision': 'Vizyonumuz',
      'footer-team': 'Ekip',
      'footer-careers': 'Kariyer',
      'footer-contact': 'İletişim',
      'footer-privacy': 'Gizlilik Politikası',
      'footer-terms': 'Hizmet Şartları',
      'footer-cookies': 'Çerez Politikası',
      'footer-rights': '© 2025 Vertex Corporation. Tüm hakları saklıdır.'
    },

    en: {
      // Navigation
      'nav-home': 'Home',
      'nav-about': 'About',
      'nav-projects': 'Projects',
      'nav-vision': 'Vision',
      'nav-team': 'Team',
      'nav-contact': 'Contact',
      'theme-toggle-dark': 'Dark Mode',
      'theme-toggle-light': 'Light Mode',
      'lang-toggle-en': 'English',
      'lang-toggle-tr': 'Türkçe',

      // Hero Section
      'hero-title': 'The Peak of Technology',
      'hero-description': 'Founded by Turkiye\'s brightest young minds with an average age of just 15, Vertex is pioneering the future of technology across multiple domains.',
      'hero-btn-projects': 'Explore Projects',
      'hero-btn-vision': 'Our Vision',

      // About Section
      'about-title': 'Who We Are',
      'about-description': 'Started in June 2023 in Istanbul, Vertex Corporation is a cutting-edge technology company uniting Turkiye\'s youngest entrepreneurs to redefine the tech landscape globally.',
      'about-card1-title': 'Young Innovators',
      'about-card1-description': 'With an average age of just 15, our team represents the next generation of tech visionaries committed to pushing boundaries and creating revolutionary solutions.',
      'about-card2-title': 'Multi-Domain Expertise',
      'about-card2-description': 'From software development to AI, gaming, music production, and browser technologies, our diverse skill set allows us to innovate across multiple tech domains.',
      'about-card3-title': 'Turkiye\'s Tech Future',
      'about-card3-description': 'We\'re dedicated to positioning Turkiye as a global tech leader by developing world-class products and nurturing young talent within our borders.',

      // Projects Section
      'projects-title': 'Our Cutting-Edge Projects',
      'projects-description': 'Explore our diverse portfolio of innovative technologies shaping the future across multiple domains.',
      'projects-tab-all': 'All',
      'projects-tab-software': 'Software',
      'projects-tab-ai': 'AI',
      'projects-tab-gaming': 'Gaming',
      'projects-tab-music': 'Music',
      'project-ai-platform-title': 'AI Platform',
      'project-ai-platform-description': 'Revolutionary online and offline artificial intelligence platform with advanced capabilities.',

      'project-programming-language-title': 'Innovative Programming Language',
      'project-programming-language-description': 'Our innovative programming language designed to empower developers with versatile and efficient coding tools.',

      'project-web-browser-title': 'Cutting-Edge Web Browser',
      'project-web-browser-description': 'Cutting-edge web browser built from scratch without Chromium dependencies for enhanced performance and privacy.',

      'project-mobile-game-title': 'Our Debut Mobile Game',
      'project-mobile-game-description': 'Our debut mobile game that reached 5M+ people and 20,000+ downloads in just 48 hours with zero marketing budget.',

      'project-anti-cheat-title': 'Advanced Anti-Cheating Technology',
      'project-anti-cheat-description': 'Advanced anti-cheating technology ensuring fair gameplay environments across gaming platforms.',

      'project-music-label-title': 'Our Music Label',
      'project-music-label-description': 'Our music label empowering young artists that has already achieved 5,000+ monthly listeners across platforms.',


      // Vision Section
      'vision-title': 'Our 3-5 Year Vision',
      'vision-description1': 'By 2025, Vertex aims to establish a global presence across America, Europe, and Asia, targeting 5 million active users across our platforms and becoming a recognized force in the global tech industry.',
      'vision-description2': 'We\'re committed to continuous innovation, developing our own operating system, expanding our AI capabilities, and reaching millions through our diverse portfolio of products.',
      'vision-stat1': 'Target downloads for our applications worldwide',
      'vision-stat2': 'Active users across our technology ecosystem',
      'vision-stat3': 'Monthly listeners for Polyhedron music label',
      'vision-stat4': 'Global markets - Americas, Europe, Asia',

      // Team Section
      'team-title': 'Our Leading Innovators',
      'team-description': 'The bright minds behind Vertex Corporation, Turkiye\'s youngest tech entrepreneurs, building the future today.',

      // Contact Section
      'contact-title': 'Get In Touch',
      'contact-description': 'Interested in our technologies or potential collaborations? Reach out to our team.',
      'contact-form-name': 'Name',
      'contact-form-email': 'Email',
      'contact-form-subject': 'Subject',
      'contact-form-message': 'Message',
      'contact-form-submit': 'Send Message',
      'contact-info-title': 'Contact Information',
      'contact-info-location': 'Location',
      'contact-info-email': 'Email',
      'contact-info-social': 'Social',
      'contact-placeholder-name': 'Your name',
      'contact-placeholder-email': 'Your email',
      'contact-placeholder-subject': 'Subject',
      'contact-placeholder-message': 'Your message',

      // Footer
      'footer-description': 'Peak of Technology. Founded in 2023 by Turkiye\'s youngest tech entrepreneurs, reshaping the future through innovation across multiple domains.',
      'footer-products': 'Products',
      'footer-company': 'Company',
      'footer-legal': 'Legal',
      'footer-about': 'About Us',
      'footer-vision': 'Our Vision',
      'footer-team': 'Team',
      'footer-careers': 'Careers',
      'footer-contact': 'Contact',
      'footer-privacy': 'Privacy Policy',
      'footer-terms': 'Terms of Service',
      'footer-cookies': 'Cookie Policy',
      'footer-rights': '© 2025 Vertex Corporation. All rights reserved.'
    }
  };

  // Dil değişikliği fonksiyonu
  let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';

  function applyTranslations(language) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
      const key = element.getAttribute('data-translate');
      if (translations[language] && translations[language][key]) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translations[language][key];
        } else {
          element.textContent = translations[language][key];
        }
      }
    });

    // Navigasyon linklerini ayrıca güncelle
    document.querySelector('nav ul li a[href="#home"]').textContent = translations[language]['nav-home'];
    document.querySelector('nav ul li a[href="#about"]').textContent = translations[language]['nav-about'];
    document.querySelector('nav ul li a[href="#projects"]').textContent = translations[language]['nav-projects'];
    document.querySelector('nav ul li a[href="#vision"]').textContent = translations[language]['nav-vision'];
    document.querySelector('nav ul li a[href="#team"]').textContent = translations[language]['nav-team'];
    document.querySelector('nav ul li a[href="#contact"]').textContent = translations[language]['nav-contact'];

    document.documentElement.lang = language;
  }

  const languageToggleBtn = document.getElementById('language-toggle-btn');

  function toggleLanguage() {
    currentLanguage = (currentLanguage === 'en' ? 'tr' : 'en');
    localStorage.setItem('selectedLanguage', currentLanguage);
    applyTranslations(currentLanguage);

    // Dil değiştirme butonunun metnini ve bayrağını güncelle
    if (currentLanguage === 'en') {
      languageToggleBtn.innerHTML = translations[currentLanguage]['lang-toggle-tr'];
    } else {
      languageToggleBtn.innerHTML = translations[currentLanguage]['lang-toggle-en'];
    }

    // Tema değiştirme butonunun metnini de güncelleyin
    if (document.body.classList.contains('light-theme')) {
      themeToggleBtn.textContent = translations[currentLanguage]['theme-toggle-dark'];
    } else {
      themeToggleBtn.textContent = translations[currentLanguage]['theme-toggle-light'];
    }
  }

  // Sayfa yüklendiğinde başlangıç dilini ve buton metnini ayarla
  applyTranslations(currentLanguage);
  // script.js dosyanızda toggleLanguage fonksiyonu içinde
  if (currentLanguage === 'en') {
    // Türkçe aktifken İngilizce ikonu göster
    languageToggleBtn.innerHTML = translations[currentLanguage]['lang-toggle-tr']; // Örnek olarak bir dünya ikonu
  } else {
    // İngilizce aktifken Türkçe ikonu göster
    languageToggleBtn.innerHTML = translations[currentLanguage]['lang-toggle-en']; // Örnek olarak bir dil ikonu
  }
  languageToggleBtn.addEventListener('click', toggleLanguage);

  // Başlangıç teması için tema buton metnini ayarla
  if (document.body.classList.contains('light-theme')) {
    themeToggleBtn.textContent = translations[currentLanguage]['theme-toggle-dark'];
  } else {
    themeToggleBtn.textContent = translations[currentLanguage]['theme-toggle-light'];
  }
}); // Bu parantez, dosyanın başındaki 'DOMContentLoaded' fonksiyonunu kapatır.