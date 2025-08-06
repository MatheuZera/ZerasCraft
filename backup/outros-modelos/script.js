// Funcionalidade do Acordeão
function setupAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
}
// Chame a função quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', setupAccordion);

// Funcionalidade do Modal
function setupModal() {
  const modal = document.getElementById('myModal');
  const openBtn = document.getElementById('openModalBtn');
  const closeBtn = modal.querySelector('.modal-close-btn');
  
  openBtn.addEventListener('click', () => {
    modal.classList.add('show');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });
  
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.remove('show');
    }
  });
}
// Chame a função quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', setupModal);

// Funcionalidade da Galeria e Lightbox
function setupLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const imgSrc = e.target.getAttribute('data-src');
      lightboxImage.src = imgSrc;
      lightbox.classList.add('show');
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('show');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
      lightbox.classList.remove('show');
    }
  });
}
document.addEventListener('DOMContentLoaded', setupLightbox);

// Funcionalidade das Tabs
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}
document.addEventListener('DOMContentLoaded', setupTabs);

// Funcionalidade do Carrossel de Testemunhos
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.testimonial-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const scrollWidth = carousel.scrollWidth / carousel.childElementCount;

    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: scrollWidth, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -scrollWidth, behavior: 'smooth' });
    });
});

// Indicador de Progresso da Rolagem
document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;
        const progress = (scrollPosition / totalHeight) * 100;
        progressBar.style.width = progress + '%';
    });
});

// Contador de Estatísticas Animado
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const startCounter = (counter) => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    };

    const counterSection = document.querySelector('.stats-grid');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => startCounter(counter));
                observer.unobserve(counterSection); // Para a observação depois de animar
            }
        });
    }, { threshold: 0.5 }); // Inicia a animação quando 50% da seção está visível

    if (counterSection) {
        observer.observe(counterSection);
    }
});