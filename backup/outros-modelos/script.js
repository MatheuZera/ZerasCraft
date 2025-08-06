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

    /**
     * Atualiza as barras de status de forma proporcional.
     * A barra com o valor mais alto terá 100% da largura.
     * As outras serão calculadas em relação a ela.
     */
    function updateServerStatus() {
        // Seleciona todos os itens da barra de status
        const statusBars = document.querySelectorAll('.status-bar-item');
        if (statusBars.length === 0) {
            return;
        }

        // 1. Encontra o valor mais alto entre todos os itens
        let maxStatusValue = 0;
        statusBars.forEach(item => {
            const value = parseInt(item.getAttribute('data-value'), 10);
            if (value > maxStatusValue) {
                maxStatusValue = value;
            }
        });

        // 2. Calcula e aplica a nova largura e o texto para cada item
        statusBars.forEach(item => {
            const value = parseInt(item.getAttribute('data-value'), 10);
            
            // Calcula a largura proporcional. Se o max for 0, evita divisão por zero.
            const proportionalWidth = maxStatusValue > 0 ? (value / maxStatusValue) * 100 : 0;
            
            // Seleciona os elementos internos
            const fillBar = item.querySelector('.progress-bar-fill');
            const percentageSpan = item.querySelector('.status-percentage');

            // Aplica a nova largura (que será animada pelo CSS)
            fillBar.style.width = `${proportionalWidth}%`;

            // Atualiza o texto da porcentagem
            percentageSpan.textContent = `${value}%`;
        });
    }

    // Chama a função de atualização quando a página carregar
    updateServerStatus();
});