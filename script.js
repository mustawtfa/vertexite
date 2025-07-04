document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Not: Proje filtreleme işlevinin çalışması için 
  // HTML'deki proje kartlarına `data-category` niteliği ekledim.
  // Orijinal kodunuzda bu eksikti.
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Aktif butonu güncelle
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        // Kartın kategorisini `data-category`'den al
        const category = card.getAttribute('data-category');
        
        // Filtre 'all' ise veya kartın kategorisi filtre ile eşleşiyorsa göster
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          // Görünürlük için küçük bir gecikme
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          // Eşleşmiyorsa gizle
          card.style.opacity = '0';
          // Geçişin tamamlanması için bekle
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  themeToggleBtn.addEventListener('click', function() {
    document.body.classList.toggle('light-theme');
  });

  window.addEventListener('scroll', function() {
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
      if(entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateOnScrollElements.forEach(el => observer.observe(el));
});