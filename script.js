// script.js - Lógica de interatividade para o site Mundo Zera's Craft

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");

    // =====================================
    // Variáveis de Áudio e Elementos
    // =====================================
    let hoverSound;
    let clickSound;
    const backgroundAudio = document.getElementById('backgroundAudio');
    const audioEffects = {};

    const audioControlButton = document.getElementById('audioControlButton');
    const audioNextButton = document.getElementById('audioNextButton');
    const musicTitleDisplay = document.getElementById('musicTitleDisplay');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const arcProgress = audioProgressArc ? audioProgressArc.querySelector('.arc-progress') : null;

    const arcRadius = 27;
    const arcCircumference = 2 * Math.PI * arcRadius;

    let preparingNextMusic = false;

    const musicPlaylist = [
        { title: '✨ Aerie (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Aerie.mp3' },
        { title: '✨ Comforting Memories (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Comforting.mp3' },
        { title: '✨ Creator (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Creator.mp3' },
        { title: '✨ Infinite Amethyst (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Infinity.mp3' },
        { title: '✨ Left to Bloom (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Left.mp3' },
        { title: '✨ Otherside (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Otherside.mp3' },
        { title: '⛏️ Aria Math Lofi', src: 'assets/audios/musics/Aria-Math-Lofi.mp3' },
        { title: '⛏️ Aria Math', src: 'assets/audios/musics/Aria-Math.mp3' },
        { title: '⛏️ Beginning', src: 'assets/audios/musics/Beginning.mp3' },
        { title: '⛏️ Biome Fest', src: 'assets/audios/musics/Biome-Fest.mp3' },
        { title: '⛏️ Blind Spots', src: 'assets/audios/musics/Blind-Spots.mp3' },
        { title: '⛏️ Clark', src: 'assets/audios/musics/Clark.mp3' },
        { title: '⛏️ Danny', src: 'assets/audios/musics/Danny.mp3' },
        { title: '⛏️ Dreiton', src: 'assets/audios/musics/Dreiton.mp3' },
        { title: '⛏️ Dry Hands', src: 'assets/audios/musics/Dry-Hands.mp3' },
        { title: '⛏️ Floating Trees', src: 'assets/audios/musics/Floating-Trees.mp3' },
        { title: '⛏️ Haggstrom', src: 'assets/audios/musics/Haggstrom.mp3' },
        { title: '⛏️ Key', src: 'assets/audios/musics/Key.mp3' },
        { title: '⛏️ Living Mice', src: 'assets/audios/musics/Living-Mice.mp3' },
        { title: '⛏️ Mice On Venus', src: 'assets/audios/musics/Mice-On-Venus.mp3' },
        { title: '⛏️ Minecraft', src: 'assets/audios/musics/Minecraft.mp3' },
        { title: '⛏️ Moog City', src: 'assets/audios/musics/Moog-City.mp3' },
        { title: '⛏️ Mutation', src: 'assets/audios/musics/Mutation.mp3' },
        { title: '⛏️ Sweden', src: 'assets/audios/musics/Sweden.mp3' },
        { title: '⛏️ Taswell', src: 'assets/audios/musics/Taswell.mp3' },
        { title: '⛏️ Wet Hands', src: 'assets/audios/musics/Wet-Hands.mp3' },
        { title: '💿 Blocks', src: 'assets/audios/musics/records/Blocks.mp3' },
        { title: '💿 Cat', src: 'assets/audios/musics/records/Cat.mp3' },
        { title: '💿 Far', src: 'assets/audios/musics/records/Far.mp3' },
        { title: '💿 Mall', src: 'assets/audios/musics/records/Mall.mp3' },
        { title: '💿 Mellohi', src: 'assets/audios/musics/records/Mellohi.mp3' },
        { title: '💿 Otherside', src: 'assets/audios/musics/records/Otherside.mp3' },
        { title: '💿 Pingstep Master', src: 'assets/audios/musics/records/Pingstep_Master.mp3' },
        { title: '💿 Relic', src: 'assets/audios/musics/records/Relic.mp3' },
        { title: '💿 Stal', src: 'assets/audios/musics/records/Stal.mp3' },
        { title: '💿 Strad', src: 'assets/audios/musics/records/Strad.mp3' },
        { title: '💿 Wait', src: 'assets/audios/musics/records/Wait.mp3' },
        { title: '💿 Ward', src: 'assets/audios/musics/records/Ward.mp3' },
    ];
    let currentMusicIndex = -1;

    // =====================================
    // Funções Auxiliares de Áudio
    // =====================================

    const initializeAudioEffect = (name, path, volume = 0.5) => {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audio.volume = volume;
        audioEffects[name] = audio;
        return audio;
    };

    hoverSound = initializeAudioEffect('select', 'assets/audios/effects/select.mp3', 0.3);
    clickSound = initializeAudioEffect('click', 'assets/audios/effects/click.mp3', 0.7);

    const playEffectSoundInternal = (audioElement) => {
        if (audioElement) {
            const clonedAudio = audioElement.cloneNode();
            clonedAudio.volume = audioElement.volume;
            clonedAudio.play().catch(e => console.warn("Erro ao tentar tocar som de efeito:", e.message));
        }
    };

    const playEffectSound = (audioElement) => {
        setTimeout(() => {
            playEffectSoundInternal(audioElement);
        }, 10);
    };

    function showCentralMessage(message) {
        const centralMessageElement = document.getElementById('centralMessage');
        if (centralMessageElement) {
            centralMessageElement.textContent = message;
            centralMessageElement.classList.add('show');
            setTimeout(() => {
                centralMessageElement.classList.remove('show');
            }, 3000);
        } else {
            console.log(`[Mensagem Central] ${message}`);
        }
    }
    
    // =====================================
    // Lógica de Controle da Música de Fundo
    // =====================================
    const updateAudioButtonTitle = () => {
        if (musicTitleDisplay && currentMusicIndex !== -1 && musicPlaylist[currentMusicIndex]) {
            if (!backgroundAudio.paused) {
                musicTitleDisplay.textContent = `${musicPlaylist[currentMusicIndex].title}`;
                audioControlButton.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                musicTitleDisplay.textContent = 'Clique para Tocar';
                audioControlButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        } else if (musicTitleDisplay) {
            musicTitleDisplay.textContent = 'Nenhuma Música';
            audioControlButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    };

    const getRandomMusicIndex = () => {
        if (musicPlaylist.length === 0) return -1;
        let newIndex;
        if (musicPlaylist.length > 1) {
            do {
                newIndex = Math.floor(Math.random() * musicPlaylist.length);
            } while (newIndex === currentMusicIndex);
        } else {
            newIndex = 0;
        }
        return newIndex;
    };
    
    const playMusic = () => {
        if (!backgroundAudio || !backgroundAudio.src) {
            console.warn("Áudio não pronto para tocar.");
            return;
        }
        backgroundAudio.play().then(() => {
            if (audioControlButton) audioControlButton.classList.add('is-playing');
            showCentralMessage(`Tocando: ${musicPlaylist[currentMusicIndex].title}`);
            updateAudioButtonTitle();
            saveAudioState();
        }).catch(e => {
            console.error("Erro ao tentar tocar áudio (provavelmente autoplay bloqueado):", e.message);
            if (audioControlButton) audioControlButton.classList.remove('is-playing');
            showCentralMessage('Autoplay bloqueado. Clique para tocar.');
            updateAudioButtonTitle();
        });
    };
    
    const loadNewMusic = (playAfterLoad = false, specificIndex = -1) => {
        if (musicPlaylist.length === 0) {
            console.warn("Playlist vazia, não é possível carregar música.");
            preparingNextMusic = false;
            return;
        }
        if (preparingNextMusic) {
            console.log("Já está preparando a próxima música, abortando nova carga.");
            return;
        }
    
        preparingNextMusic = true;
        currentMusicIndex = (specificIndex !== -1) ? specificIndex : getRandomMusicIndex();
        const music = musicPlaylist[currentMusicIndex];
    
        if (currentMusicIndex === -1) {
            console.warn("Não foi possível obter um índice de música válido. Playlist vazia ou erro.");
            preparingNextMusic = false;
            return;
        }
    
        backgroundAudio.src = music.src;
        backgroundAudio.load();
    
        backgroundAudio.oncanplaythrough = () => {
            preparingNextMusic = false;
            if (playAfterLoad) {
                playMusic();
            } else {
                updateAudioButtonTitle();
            }
            backgroundAudio.oncanplaythrough = null;
            saveAudioState();
        };
    
        backgroundAudio.onerror = (e) => {
            console.error(`Erro ao carregar áudio: ${music.src}`, e);
            showCentralMessage('Erro ao carregar música. Pulando...');
            preparingNextMusic = false;
            backgroundAudio.onerror = null;
            setTimeout(() => loadNewMusic(playAfterLoad), 500);
        };
    };
    
    const updateProgressArc = () => {
        if (!arcProgress) return;
    
        if (backgroundAudio.duration > 0 && !isNaN(backgroundAudio.duration)) {
            const progress = (backgroundAudio.currentTime / backgroundAudio.duration);
            const offset = arcCircumference * (1 - progress);
            arcProgress.style.strokeDashoffset = offset;
        } else {
            arcProgress.style.strokeDashoffset = arcCircumference;
        }
    };
    
    const saveAudioState = () => {
        if (backgroundAudio) {
            const audioState = {
                currentTime: backgroundAudio.currentTime,
                currentMusicIndex: currentMusicIndex,
                paused: backgroundAudio.paused,
                volume: backgroundAudio.volume,
                userInteracted: localStorage.getItem('userInteractedWithAudio') === 'true'
            };
            localStorage.setItem('audioState', JSON.stringify(audioState));
        }
    };
    
    const restoreAudioState = () => {
        const savedState = localStorage.getItem('audioState');
        if (savedState) {
            const audioState = JSON.parse(savedState);
            currentMusicIndex = audioState.currentMusicIndex;
            backgroundAudio.volume = audioState.volume;
    
            if (currentMusicIndex !== -1 && musicPlaylist[currentMusicIndex]) {
                backgroundAudio.src = musicPlaylist[currentMusicIndex].src;
                backgroundAudio.load();
    
                backgroundAudio.onloadedmetadata = () => {
                    backgroundAudio.currentTime = audioState.currentTime;
                    updateProgressArc();
                    if (!audioState.paused && audioState.userInteracted) {
                        playMusic();
                    } else {
                        updateAudioButtonTitle();
                        if (audioControlButton) audioControlButton.classList.remove('is-playing');
                    }
                    backgroundAudio.onloadedmetadata = null;
                };
                backgroundAudio.onerror = (e) => {
                    console.error("Erro ao carregar música restaurada:", e);
                    showCentralMessage('Erro ao restaurar música. Pulando...');
                    loadNewMusic(true);
                };
            } else {
                loadNewMusic(false);
            }
        } else {
            loadNewMusic(false);
        }
    };
    
    // =====================================
    // 1. Menu Hambúrguer
    // =====================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.main-nav');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            playEffectSound(clickSound);
        });

        document.querySelectorAll('.main-nav a').forEach(item => {
            item.addEventListener('click', () => {
                setTimeout(() => {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }, 300);
                playEffectSound(clickSound);
            });
        });
    }

    // =====================================
    // 2. Funcionalidade de Copiar Texto
    // =====================================
    const copyButtons = document.querySelectorAll('.copy-button');

    if (copyButtons.length > 0) {
        copyButtons.forEach(button => {
            button.addEventListener('click', async () => {
                playEffectSound(clickSound);
                let textToCopy = '';
                let targetElementSelector = button.dataset.copyTarget;
                let originalButtonText = button.textContent;

                if (targetElementSelector) {
                    const parentContext = button.closest('.access-info') || document;
                    const selectors = targetElementSelector.split(',').map(s => s.trim());
                    let partsToCopy = [];

                    for (const selector of selectors) {
                        const targetElement = parentContext.querySelector(selector);
                        if (targetElement) {
                            partsToCopy.push(targetElement.textContent.trim());
                        }
                    }

                    if (selectors.includes('#serverIp') && selectors.includes('#serverPort') && partsToCopy.length === 2) {
                        textToCopy = `${partsToCopy[0]}:${partsToCopy[1]}`;
                    } else {
                        textToCopy = partsToCopy.join('');
                    }

                } else if (button.dataset.copyText) {
                    textToCopy = button.dataset.copyText;
                }

                if (textToCopy) {
                    try {
                        await navigator.clipboard.writeText(textToCopy);
                        showCentralMessage(`'${textToCopy}' copiado!`);
                        button.textContent = 'Copiado!';
                        button.classList.add('copied');
                        setTimeout(() => {
                            button.textContent = originalButtonText;
                            button.classList.remove('copied');
                        }, 2000);

                    } catch (err) {
                        console.error('Erro ao copiar: ', err);
                        showCentralMessage('Falha ao copiar.');
                    }
                } else {
                    showCentralMessage('Nada para copiar.');
                }
            });
        });
    }

    // =====================================
    // 3. Sistema de Áudio de Fundo
    // =====================================
    if (backgroundAudio) {
        if (arcProgress) {
            arcProgress.style.strokeDasharray = `${arcCircumference} ${arcCircumference}`;
            arcProgress.style.strokeDashoffset = arcCircumference;
            arcProgress.style.transition = 'stroke-dashoffset 1s linear';
        }

        restoreAudioState();

        backgroundAudio.addEventListener('timeupdate', updateProgressArc);
        backgroundAudio.addEventListener('ended', () => {
            if (audioControlButton) audioControlButton.classList.remove('is-playing');
            updateProgressArc();
            preparingNextMusic = false;
            loadNewMusic(true);
        });

        if (audioControlButton) {
            audioControlButton.addEventListener('click', () => {
                playEffectSound(clickSound);
                localStorage.setItem('userInteractedWithAudio', 'true');

                if (backgroundAudio.paused) {
                    if (currentMusicIndex === -1 || !backgroundAudio.src) {
                        loadNewMusic(true);
                    } else {
                        playMusic();
                    }
                } else {
                    backgroundAudio.pause();
                    if (audioControlButton) audioControlButton.classList.remove('is-playing');
                    updateAudioButtonTitle();
                }
            });
        }

        if (audioNextButton) {
            audioNextButton.addEventListener('click', () => {
                playEffectSound(clickSound);
                backgroundAudio.pause();
                if (audioControlButton) audioControlButton.classList.remove('is-playing');
                showCentralMessage('Próxima música...');
                preparingNextMusic = false;
                loadNewMusic(true);
            });
        }

        window.addEventListener('beforeunload', saveAudioState);
        window.addEventListener('pagehide', saveAudioState);
    }
    
    // =====================================
    // 4. Sistema de Sons para Interações (Hover e Click)
    // =====================================
    document.querySelectorAll('a, button, .custom-radio-btn').forEach(element => {
        element.addEventListener('mouseenter', () => playEffectSound(hoverSound));
        element.addEventListener('click', () => playEffectSound(clickSound));
    });
    
    document.querySelectorAll('.service-card, .role-category-card, .access-card, .community-card, .event-card, .partnership-card, .security-card, .faq-item, .info-card').forEach(card => {
        card.addEventListener('mouseenter', () => playEffectSound(hoverSound));
    });

    // =====================================
    // 5. Botão "Voltar ao Topo"
    // =====================================
    const scrollTopButton = document.getElementById('scrollTopButton');
    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopButton.classList.add('show');
            } else {
                scrollTopButton.classList.remove('show');
            }
        });
        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            playEffectSound(clickSound);
        });
    }

    // =====================================
    // 6. Atualizar Ano Atual no Rodapé
    // =====================================
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // =====================================
    // 7. Animações de Rolagem
    // =====================================
    const sections = document.querySelectorAll('.fade-in-section');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    sections.forEach(section => sectionObserver.observe(section));

    // =====================================
    // 8. Ativar Link da Navegação da Página Atual
    // =====================================
    const highlightActiveNavLink = () => {
        const currentPath = window.location.pathname.split('/').pop();
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            }
        });
    };
    highlightActiveNavLink();

//-----------------------------------------------------------------------------------------------------------

// =====================================
// Lógica para os novos elementos
// =====================================

// Botão de Copiar IP do Servidor
const copyIpBtn = document.querySelector('.copy-ip-btn');
if (copyIpBtn) {
    copyIpBtn.addEventListener('click', () => {
        const ip = copyIpBtn.getAttribute('data-ip');
        window.copyToClipboard(ip, 'IP copiado!');
    });
}

// Formulário de Contato
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulação de envio de formulário
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        
        // Simples validação
        if (name.length < 2) {
            formMessage.textContent = 'Por favor, insira um nome válido.';
            formMessage.classList.remove('success');
            formMessage.classList.add('error');
            formMessage.style.display = 'block';
            return;
        }

        // Simula o sucesso
        formMessage.textContent = 'Mensagem enviada com sucesso! Obrigado, ' + name + '!';
        formMessage.classList.remove('error');
        formMessage.classList.add('success');
        formMessage.style.display = 'block';
        contactForm.reset();
        
        // Esconde a mensagem depois de um tempo
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    });
}

// Lógica para o Modal Dinâmico (substituindo o antigo)
const dynamicModal = document.getElementById('dynamicModal');
const dynamicCloseBtn = document.querySelector('.dynamic-close-btn');
const dynamicModalImage = document.getElementById('dynamicModalImage');
const dynamicModalTitle = document.getElementById('dynamicModalTitle');
const dynamicModalDescription = document.getElementById('dynamicModalDescription');
const dynamicModalLink = document.getElementById('dynamicModalLink');
const cardGrid = document.querySelector('.news-grid');

// Dados de exemplo para os cards (você pode carregar isso de um JSON ou API)
const cardData = [
    { id: 'event1', title: 'Torneio de PvP', description: 'O grande torneio de PvP está chegando! Prepare suas armas e armaduras.', image: 'https://picsum.photos/400/250?random=1', link: '#' },
    { id: 'event2', title: 'Competição de Construção', description: 'O tema da competição deste mês é "Cidades Flutuantes". Participe!', image: 'https://picsum.photos/400/250?random=2', link: '#' },
    { id: 'event3', title: 'Invasão Zumbi', description: 'Sobreviva à noite mais longa no servidor. Prêmios para os mais resistentes.', image: 'https://picsum.photos/400/250?random=3', link: '#' },
];

if (cardGrid && dynamicModal) {
    cardGrid.addEventListener('click', (e) => {
        const cardLink = e.target.closest('.card-link.open-modal');
        if (cardLink) {
            e.preventDefault();
            const cardId = cardLink.getAttribute('data-id');
            const card = cardData.find(c => c.id === cardId);

            if (card) {
                dynamicModalImage.src = card.image;
                dynamicModalTitle.textContent = card.title;
                dynamicModalDescription.textContent = card.description;
                dynamicModalLink.href = card.link;
                
                dynamicModal.style.display = "block";
            }
        }
    });
    
    dynamicCloseBtn.addEventListener('click', () => {
        dynamicModal.style.display = "none";
    });
    
    window.addEventListener('click', (event) => {
        if (event.target == dynamicModal) {
            dynamicModal.style.display = "none";
        }
    });
}

//-----------------------------------------------------------------------------------------------------------

    // =====================================
    // 20. Aba de Pesquisa de Arquivos Gerais (Recursos)
    // =====================================
document.addEventListener('DOMContentLoaded', () => {
    // Exemplo de dados dos cards
    const cardData = [
        {
            id: '1',
            thumbnail: 'assets/images/addon1.jpg',
            title: 'Addon de Teleporte',
            description: 'Adiciona novos comandos de teletransporte para o servidor.',
            rating: 5,
            tags: ['Addon', 'Arquivos Gerais'],
            downloadLink: 'https://site-externo-1.com/download'
        },
        {
            id: '2',
            thumbnail: 'assets/images/mod1.jpg',
            title: 'Mod de Ferramentas Mágicas',
            description: 'Um mod que adiciona um conjunto de ferramentas com habilidades mágicas.',
            rating: 4,
            tags: ['Mod'],
            downloadLink: 'https://site-externo-2.com/download'
        },
        {
            id: '3',
            thumbnail: 'assets/images/skin1.png',
            title: 'Skin de Cavaleiro',
            description: 'Uma skin épica de cavaleiro para personalizar seu personagem.',
            rating: 5,
            tags: ['Skin'],
            downloadLink: 'https://site-externo-3.com/download'
        },
        {
            id: '4',
            thumbnail: 'assets/images/texturepack1.jpg',
            title: 'Pacote de Texturas RPG',
            description: 'Pacote de texturas que transforma o jogo em uma aventura de RPG.',
            rating: 4,
            tags: ['Arquivos Gerais'],
            downloadLink: 'https://site-externo-4.com/download'
        },
        {
            id: '5',
            thumbnail: 'assets/images/mod2.jpg',
            title: 'Mod de Decoração',
            description: 'Um mod com centenas de novos blocos e itens de decoração.',
            rating: 5,
            tags: ['Mod'],
            downloadLink: 'https://site-externo-5.com/download'
        },
    ];

    const cardGrid = document.getElementById('card-grid');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('download-modal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    // Função para renderizar as estrelas de avaliação
    const getStarRating = (rating) => {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars += '★';
            } else {
                stars += '☆';
            }
        }
        return stars;
    };

    // Função para renderizar todos os cards no HTML
    const renderCards = (cards) => {
        cardGrid.innerHTML = ''; // Limpa a grade antes de renderizar
        if (cards.length === 0) {
            cardGrid.innerHTML = '<p class="text-center">Nenhum resultado encontrado.</p>';
            return;
        }

        cards.forEach(card => {
            const cardItem = document.createElement('div');
            cardItem.classList.add('card-item');

            cardItem.innerHTML = `
                <img src="${card.thumbnail}" alt="${card.title}" class="card-thumbnail">
                <div>
                    <h3>${card.title}</h3>
                    <p class="card-description">${card.description}</p>
                </div>
                <div class="card-rating">${getStarRating(card.rating)}</div>
                <button class="card-download-btn" data-id="${card.id}">Baixar</button>
            `;
            cardGrid.appendChild(cardItem);
        });
    };

    // Função de filtro
    const filterCards = (filter) => {
        searchInput.value = ''; // Limpa a busca ao filtrar
        let filteredCards = cardData;

        if (filter !== 'all') {
            filteredCards = cardData.filter(card => card.tags.includes(filter));
        }
        renderCards(filteredCards);
    };

    // Evento de clique para os botões de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterCards(button.getAttribute('data-filter'));
        });
    });

    // Evento de busca no input
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filterButtons.forEach(btn => btn.classList.remove('active'));
        const filteredCards = cardData.filter(card => 
            card.title.toLowerCase().includes(query) ||
            card.tags.some(tag => tag.toLowerCase().includes(query))
        );
        renderCards(filteredCards);
    });

    // Evento de clique para abrir o modal
    cardGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('card-download-btn')) {
            const cardId = e.target.getAttribute('data-id');
            const card = cardData.find(c => c.id === cardId);

            if (card) {
                document.getElementById('modal-image').src = card.thumbnail;
                document.getElementById('modal-title').textContent = card.title;
                document.getElementById('modal-description').textContent = card.description;
                document.getElementById('modal-download-link').href = card.downloadLink;

                modal.classList.add('active');
            }
        }
    });

    // Evento para fechar o modal
    modalCloseBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Inicializa a grade com todos os cards
    renderCards(cardData);
});