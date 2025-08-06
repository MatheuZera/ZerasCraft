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

/** BARRA DE PROGRESSO */
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona todos os elementos que têm a classe 'counter'
    const counters = document.querySelectorAll('.counter');
    
    // Configura as opções do IntersectionObserver
    const observerOptions = {
        root: null, // O viewport
        threshold: 0.5, // A animação começa quando 50% do elemento está visível
    };

    // Função para iniciar a animação do contador
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // Duração da animação em milissegundos (2 segundos)
        let startTime = null;

        const easeOutQuad = t => t * (2 - t); // Função de easing para uma transição mais suave

        const updateCounter = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsedTime = timestamp - startTime;
            
            // Calcula o progresso da animação (0 a 1)
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Calcula o valor atual a ser exibido
            const value = Math.floor(easeOutQuad(progress) * target);
            
            counter.textContent = value;

            // Se o progresso não terminou, continua a animação
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        // Inicia a animação
        requestAnimationFrame(updateCounter);
    };

    // Cria uma nova instância do IntersectionObserver
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Verifica se o elemento está visível
            if (entry.isIntersecting) {
                // Inicia a animação
                animateCounter(entry.target);
                
                // Desconecta o observador para que a animação não se repita
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observa cada elemento counter
    counters.forEach(counter => {
        // Inicializa o valor com 0 para que a animação seja visível
        counter.textContent = '0';
        observer.observe(counter);
    });

});