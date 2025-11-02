document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");
    // ===================================================================
    // 6. Sistema de arquivos.html
    // ===================================================================

    // Filter Buttons for Arquivos (addons.html)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cardGrid = document.getElementById('card-grid');

    const downloadItems = [
        {
            title: 'Addon de Magia Épica',
            category: 'Addon',
            description: 'Adiciona novos feitiços, varinhas e dimensões mágicas ao jogo.',
            imageUrl: 'https://placehold.co/400x225/4CAF50/FFFFFF?text=Magia+Addon',
            version: '1.2.0',
            size: '5.3 MB',
            downloadLink: '#'
        },
        {
            title: 'Mod de Criaturas Lendárias',
            category: 'Mod',
            description: 'Enfrente bosses lendários e domestique novas criaturas para te acompanhar.',
            imageUrl: 'https://placehold.co/400x225/388E3C/FFFFFF?text=Criaturas+Mod',
            version: '2.1.0',
            size: '12.8 MB',
            downloadLink: '#'
        },
        {
            title: 'Skin Pack: Heróis do Pixel',
            category: 'Skin',
            description: 'Pacote com 10 skins exclusivas de heróis em estilo pixel art.',
            imageUrl: 'https://placehold.co/400x225/2E7D32/FFFFFF?text=Skins+Herois',
            version: '1.0.0',
            size: '2.1 MB',
            downloadLink: '#'
        },
        {
            title: 'Arquivos de Servidor - Config Básico',
            category: 'Arquivos Gerais',
            description: 'Configurações básicas para iniciar seu próprio servidor Zera\'s Craft.',
            imageUrl: 'https://placehold.co/400x225/1A1A1A/FFFFFF?text=Server+Configs',
            version: '1.0.0',
            size: '1.5 MB',
            downloadLink: '#'
        },
        {
            title: 'Addon de Ferramentas Avançadas',
            category: 'Addon',
            description: 'Novas ferramentas e máquinas para automatizar suas construções e mineração.',
            imageUrl: 'https://placehold.co/400x225/4CAF50/FFFFFF?text=Ferramentas+Addon',
            version: '1.1.0',
            size: '7.0 MB',
            downloadLink: '#'
        },
        {
            title: 'Mod de Decoração Moderna',
            category: 'Mod',
            description: 'Adicione móveis, blocos e elementos decorativos para casas modernas.',
            imageUrl: 'https://placehold.co/400x225/388E3C/FFFFFF?text=Decoracao+Mod',
            version: '1.5.0',
            size: '8.1 MB',
            downloadLink: '#'
        },
        {
            title: 'Skin: Cavaleiro das Sombras',
            category: 'Skin',
            description: 'Uma skin sombria e imponente para os aventureiros mais corajosos.',
            imageUrl: 'https://placehold.co/400x225/2C3E50/FFFFFF?text=Skin+Cavaleiro',
            version: '1.0.0',
            size: '0.8 MB',
            downloadLink: '#'
        },
        {
            title: 'Pastas Essenciais do Jogo',
            category: 'Arquivos Gerais',
            description: 'Coleção de pastas e arquivos indispensáveis para o bom funcionamento do Minecraft.',
            imageUrl: 'https://placehold.co/400x225/1A1A1A/FFFFFF?text=Pastas+Jogo',
            version: '1.0.0',
            size: '3.2 MB',
            downloadLink: '#'
        }
    ];

    // ===============================
    // Card de Download
    // ===============================
    const generateDownloadCard = (item) => {
        const card = document.createElement('div');
        card.classList.add('card', 'download-card');
        card.dataset.category = item.category;

        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}" class="card-image responsive-image">
            <div class="card-content">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-description">${item.description}</p>
                <div class="card-meta">
                    <span class="card-version">Versão: ${item.version}</span>
                    <span class="card-size">Tamanho: ${item.size}</span>
                </div>
                <button class="btn-primary card-download-btn"
                        data-title="${item.title}"
                        data-description="${item.description}"
                        data-image="${item.imageUrl}"
                        data-version="${item.version}"
                        data-size="${item.size}"
                        data-download-link="${item.downloadLink}">
                    Detalhes & Baixar
                </button>
            </div>
        `;
        return card;
    };

    // ===============================
    // Visualizar Itens de Download
    // ===============================
    const renderDownloadItems = (filter = 'all') => {
        if (!cardGrid) return;
        cardGrid.innerHTML = ''; // Limpa o grid atual

        const filteredItems = filter === 'all'
            ? downloadItems
            : downloadItems.filter(item => item.category === filter);

        if (filteredItems.length === 0) {
            cardGrid.innerHTML = '<p class="text-center">Nenhum item encontrado nesta categoria.</p>';
            return;
        }

        filteredItems.forEach(item => {
            cardGrid.appendChild(generateDownloadCard(item));
        });

        // Adiciona event listeners aos novos botões de download
        document.querySelectorAll('.card-download-btn').forEach(button => {
            button.addEventListener('click', () => {
                const modal = document.getElementById('download-modal');
                const modalImage = document.getElementById('modal-image');
                const modalTitle = document.getElementById('modal-title');
                const modalDescription = document.getElementById('modal-description');
                const modalVersion = document.getElementById('modal-version');
                const modalSize = document.getElementById('modal-size');
                const modalDownloadLink = document.getElementById('modal-download-link');

                modalImage.src = button.dataset.image;
                modalImage.alt = button.dataset.title;
                modalTitle.textContent = button.dataset.title;
                modalDescription.textContent = button.dataset.description;
                if (modalVersion) modalVersion.textContent = button.dataset.version;
                if (modalSize) modalSize.textContent = button.dataset.size;
                modalDownloadLink.href = button.dataset.downloadLink;

                modal.classList.add('active');
                playEffectSound(clickSound);
            });
        });
    };

    if (filterButtons.length > 0 && cardGrid) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.dataset.filter;
                renderDownloadItems(filter);
                playEffectSound(clickSound);
            });
        });
        renderDownloadItems('all'); // Renderiza todos os itens na carga inicial
    }

    // ===============================
    // Modal de Detalhes & Baixar
    // ===============================
    // Modal de Download (do arquivos.html)
    const downloadModal = document.getElementById('download-modal');
    const downloadModalCloseBtn = downloadModal ? downloadModal.querySelector('.modal-close-btn') : null;

    if (downloadModalCloseBtn && downloadModal) {
        downloadModalCloseBtn.addEventListener('click', () => {
            downloadModal.classList.remove('active');
            playEffectSound(clickSound);
        });
        downloadModal.addEventListener('click', (e) => {
            if (e.target === downloadModal) {
                downloadModal.classList.remove('active');
            }
        });
    }

    // ===============================
    // Sistema de Busca
    // ===============================
    // Search Input for Downloads/Arquivos
    const searchInput = document.getElementById('search-input'); // Para arquivos.html
    const downloadSearchInput = document.getElementById('download-search-input'); // Para downloads.html

    const filterCardsBySearch = (searchTerm) => {
        const currentFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        const filteredByCat = currentFilter === 'all'
            ? downloadItems
            : downloadItems.filter(item => item.category === currentFilter);

        const finalFilteredItems = filteredByCat.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (cardGrid) {
            cardGrid.innerHTML = '';
            if (finalFilteredItems.length === 0) {
                cardGrid.innerHTML = '<p class="text-center">Nenhum item encontrado com este termo de pesquisa.</p>';
            } else {
                finalFilteredItems.forEach(item => {
                    cardGrid.appendChild(generateDownloadCard(item));
                });
            }
            // Re-bind click handlers for dynamically added cards
            document.querySelectorAll('.card-download-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const modal = document.getElementById('download-modal');
                    const modalImage = document.getElementById('modal-image');
                    const modalTitle = document.getElementById('modal-title');
                    const modalDescription = document.getElementById('modal-description');
                    const modalVersion = document.getElementById('modal-version');
                    const modalSize = document.getElementById('modal-size');
                    const modalDownloadLink = document.getElementById('modal-download-link');

                    modalImage.src = button.dataset.image;
                    modalImage.alt = button.dataset.title;
                    modalTitle.textContent = button.dataset.title;
                    modalDescription.textContent = button.dataset.description;
                    if (modalVersion) modalVersion.textContent = button.dataset.version;
                    if (modalSize) modalSize.textContent = button.dataset.size;
                    modalDownloadLink.href = button.dataset.downloadLink;

                    modal.classList.add('active');
                    playEffectSound(clickSound);
                });
            });
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            filterCardsBySearch(event.target.value);
        });
    }
    if (downloadSearchInput) {
        downloadSearchInput.addEventListener('input', (event) => {
            filterCardsBySearch(event.target.value);
        });
    }
});