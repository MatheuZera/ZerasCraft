// assets/js/addons.js

// Dados de exemplo para os addons
const addonsData = [
    {
        id: 'addon1',
        banner: 'assets/images/addon_banner_1.png',
        title: 'Tech Gadgets Mod',
        description: 'Adiciona uma variedade de gadgets tecnológicos e ferramentas futuristas ao seu mundo Minecraft, como teletransportadores, geradores de energia avançados e armaduras com habilidades especiais.',
        downloads: '1.2M',
        versions: ['1.16.5', '1.17.1', '1.18.2', '1.19.4', '1.20.1'],
        screenshots: [
            'assets/images/addon_screenshot_1_1.png',
            'assets/images/addon_screenshot_1_2.png',
            'assets/images/addon_screenshot_1_3.png'
        ],
        downloadLink: 'https://example.com/download/tech-gadgets-mod.zip'
    },
    {
        id: 'addon2',
        banner: 'assets/images/addon_banner_2.png',
        title: 'Magic Spells & Rituals',
        description: 'Explore um mundo de magia antiga com novos feitiços, rituais poderosos, varinhas encantadas e dimensões místicas. Cuidado com as criaturas sombrias!',
        downloads: '850K',
        versions: ['1.16.5', '1.17.1', '1.18.2', '1.19.4'],
        screenshots: [
            'assets/images/addon_screenshot_2_1.png',
            'assets/images/addon_screenshot_2_2.png'
        ],
        downloadLink: 'https://example.com/download/magic-spells-mod.zip'
    },
    {
        id: 'addon3',
        banner: 'assets/images/addon_banner_3.png',
        title: 'Dungeon Explorer Pack',
        description: 'Gere masmorras complexas e cheias de armadilhas, tesouros e novos inimigos. Perfeito para quem busca um desafio de exploração.',
        downloads: '500K',
        versions: ['1.18.2', '1.19.4', '1.20.1'],
        screenshots: [
            'assets/images/addon_screenshot_3_1.png',
            'assets/images/addon_screenshot_3_2.png',
            'assets/images/addon_screenshot_3_3.png',
            'assets/images/addon_screenshot_3_4.png'
        ],
        downloadLink: 'https://example.com/download/dungeon-pack.zip'
    },
    {
        id: 'addon4',
        banner: 'assets/images/addon_banner_4.png',
        title: 'Realistic Seasons',
        description: 'Experimente as quatro estações do ano com mudanças climáticas, vegetação e até mesmo a vida selvagem reagindo às estações. Uma imersão sem precedentes!',
        downloads: '1.5M',
        versions: ['1.19.4', '1.20.1'],
        screenshots: [
            'assets/images/addon_screenshot_4_1.png',
            'assets/images/addon_screenshot_4_2.png'
        ],
        downloadLink: 'https://example.com/download/realistic-seasons.zip'
    }
    // Adicione mais addons aqui
];

const addonListContainer = document.getElementById('addon-list-container');
const addonSearchInput = document.getElementById('addon-search');
const searchButton = document.getElementById('search-button');
const detailModal = document.getElementById('addon-detail-modal');
const closeModalButton = document.getElementById('close-modal-button');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.getElementById('detail-description');
const detailVersions = document.getElementById('detail-versions');
const detailDownloadButton = document.getElementById('detail-download-button');
const detailCarouselImages = document.getElementById('detail-carousel-images');
const carouselPrevButton = document.querySelector('.carousel-prev');
const carouselNextButton = document.querySelector('.carousel-next');

let currentCarouselIndex = 0;
let currentAddonScreenshots = [];

function renderAddonCards(addonsToRender) {
    addonListContainer.innerHTML = '';
    if (addonsToRender.length === 0) {
        addonListContainer.innerHTML = '<p class="no-results">Nenhum addon encontrado com sua pesquisa.</p>';
        return;
    }

    addonsToRender.forEach(addon => {
        const card = document.createElement('div');
        card.classList.add('addon-card');
        card.setAttribute('data-addon-id', addon.id);

        card.innerHTML = `
            <img src="${addon.banner}" alt="${addon.title} Banner" class="addon-card-banner">
            <div class="addon-card-content">
                <h3>${addon.title}</h3>
                <p>${addon.description.substring(0, 120)}...</p>
                <div class="addon-card-footer">
                    <span>DOWNLOADS: ${addon.downloads}</span>
                    <button class="btn-details">DETALHES</button>
                </div>
            </div>
        `;
        addonListContainer.appendChild(card);
    });

    document.querySelectorAll('.addon-card .btn-details').forEach(button => {
        button.addEventListener('click', (event) => {
            const addonId = event.target.closest('.addon-card').dataset.addonId;
            openAddonDetailModal(addonId);
        });
    });
}

function openAddonDetailModal(addonId) {
    const addon = addonsData.find(a => a.id === addonId);
    if (!addon) return;

    detailTitle.textContent = addon.title;
    detailDescription.textContent = addon.description;
    detailDownloadButton.href = addon.downloadLink;

    detailVersions.innerHTML = '';
    addon.versions.forEach(version => {
        const li = document.createElement('li');
        li.textContent = version;
        detailVersions.appendChild(li);
    });

    currentAddonScreenshots = addon.screenshots;
    currentCarouselIndex = 0;
    renderCarouselImages();

    detailModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function renderCarouselImages() {
    detailCarouselImages.innerHTML = '';
    currentAddonScreenshots.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Addon Screenshot';
        detailCarouselImages.appendChild(img);
    });
    detailCarouselImages.scrollLeft = currentCarouselIndex * (300 + 15);
}

carouselPrevButton.addEventListener('click', () => {
    currentCarouselIndex = (currentCarouselIndex - 1 + currentAddonScreenshots.length) % currentAddonScreenshots.length;
    renderCarouselImages();
});

carouselNextButton.addEventListener('click', () => {
    currentCarouselIndex = (currentCarouselIndex + 1) % currentAddonScreenshots.length;
    renderCarouselImages();
});

function closeAddonDetailModal() {
    detailModal.classList.add('hidden');
    document.body.style.overflow = '';
}

closeModalButton.addEventListener('click', closeAddonDetailModal);
detailModal.addEventListener('click', (event) => {
    if (event.target === detailModal) {
        closeAddonDetailModal();
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !detailModal.classList.contains('hidden')) {
        closeAddonDetailModal();
    }
});

addonSearchInput.addEventListener('input', () => {
    filterAddons();
});
searchButton.addEventListener('click', () => {
    filterAddons();
});

function filterAddons() {
    const searchTerm = addonSearchInput.value.toLowerCase();
    const filteredAddons = addonsData.filter(addon =>
        addon.title.toLowerCase().includes(searchTerm) ||
        addon.description.toLowerCase().includes(searchTerm)
    );
    renderAddonCards(filteredAddons);
}

document.addEventListener('DOMContentLoaded', () => {
    renderAddonCards(addonsData);
});