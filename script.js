// script.js - Lógica de interatividade para o site Mundo Zera's Craft

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");

    // =====================================
    // Variáveis Globais de Áudio e Elementos
    // =====================================
    let hoverSound;
    let clickSound;
    let selectSound; // Adicionado
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
        { title: '⛏️ Moog City 2', src: 'assets/audios/musics/Moog-City-2.mp3' },
        { title: '⛏️ Sweden', src: 'assets/audios/musics/Sweden.mp3' },
        { title: '⛏️ Wet Hands', src: 'assets/audios/musics/Wet-Hands.mp3' },
        { title: '⛏️ Subwoofer Lullaby', src: 'assets/audios/musics/Subwoofer-Lullaby.mp3' },
        { title: '⛏️ Chris', src: 'assets/audios/musics/Chris.mp3' },
        { title: '⛏️ Dead Voxel', src: 'assets/audios/musics/Dead-Voxel.mp3' },
        { title: '⛏️ Haggstrom', src: 'assets/audios/musics/Haggstrom.mp3' },
    ];

    let currentMusicIndex = 0;
    let isPlaying = false;
    let musicStorageKey = 'minecraft-music-index';
    let volumeStorageKey = 'minecraft-music-volume';

    // =====================================
    // Funções de Utilitários
    // =====================================

    /**
     * Exibe uma mensagem flutuante no centro da tela.
     * @param {string} message - A mensagem a ser exibida.
     * @param {number} duration - Duração em milissegundos para a mensagem permanecer.
     */
    const showCentralMessage = (message, duration = 2000) => {
        const messageDiv = document.querySelector('.central-message');
        if (!messageDiv) {
            const newDiv = document.createElement('div');
            newDiv.classList.add('central-message');
            document.body.appendChild(newDiv);
        }
        document.querySelector('.central-message').textContent = message;
        document.querySelector('.central-message').classList.add('show');
        setTimeout(() => {
            document.querySelector('.central-message').classList.remove('show');
        }, duration);
    };

    /**
     * Salva o estado atual da música no LocalStorage.
     */
    const saveMusicState = () => {
        if (backgroundAudio) {
            localStorage.setItem(musicStorageKey, currentMusicIndex);
            localStorage.setItem(volumeStorageKey, backgroundAudio.volume);
        }
    };

    /**
     * Carrega o estado da música do LocalStorage.
     */
    const loadMusicState = () => {
        const savedIndex = localStorage.getItem(musicStorageKey);
        if (savedIndex !== null) {
            currentMusicIndex = parseInt(savedIndex, 10);
        }
        const savedVolume = localStorage.getItem(volumeStorageKey);
        if (savedVolume !== null) {
            backgroundAudio.volume = parseFloat(savedVolume);
        }
    };

    // =====================================
    // Lógica do Player de Áudio de Fundo
    // =====================================

    /**
     * Toca a música atual da playlist.
     */
    const playCurrentMusic = () => {
        if (!backgroundAudio || preparingNextMusic) return;

        preparingNextMusic = true;
        
        backgroundAudio.src = musicPlaylist[currentMusicIndex].src;
        backgroundAudio.title = musicPlaylist[currentMusicIndex].title;
        musicTitleDisplay.textContent = musicPlaylist[currentMusicIndex].title;

        backgroundAudio.load();
        
        // Espera o evento 'canplaythrough' para garantir que o áudio possa ser reproduzido
        backgroundAudio.addEventListener('canplaythrough', () => {
            backgroundAudio.play().then(() => {
                isPlaying = true;
                audioControlButton.querySelector('i').classList.remove('fa-play');
                audioControlButton.querySelector('i').classList.add('fa-pause');
                console.log(`Reproduzindo: ${musicPlaylist[currentMusicIndex].title}`);
                preparingNextMusic = false;
            }).catch(error => {
                console.error("Erro ao tentar reproduzir áudio:", error);
                preparingNextMusic = false;
            });
        }, { once: true });
    };

    const nextMusic = () => {
        if (preparingNextMusic) return;
        currentMusicIndex = (currentMusicIndex + 1) % musicPlaylist.length;
        playCurrentMusic();
        showCentralMessage(`Próxima: ${musicPlaylist[currentMusicIndex].title}`);
    };

    const togglePlayPause = () => {
        if (backgroundAudio.paused) {
            playCurrentMusic();
        } else {
            backgroundAudio.pause();
            isPlaying = false;
            audioControlButton.querySelector('i').classList.remove('fa-pause');
            audioControlButton.querySelector('i').classList.add('fa-play');
        }
    };

    // Atualiza o progresso do arco
    const updateAudioProgress = () => {
        if (!arcProgress) return;
        const progress = backgroundAudio.currentTime / backgroundAudio.duration;
        const offset = arcCircumference * (1 - progress);
        arcProgress.style.strokeDashoffset = offset;
    };

    // Event Listeners para os controles de áudio
    if (audioControlButton) {
        audioControlButton.addEventListener('click', togglePlayPause);
        audioNextButton.addEventListener('click', nextMusic);
    }
    
    if (backgroundAudio) {
        backgroundAudio.addEventListener('timeupdate', updateAudioProgress);
        backgroundAudio.addEventListener('ended', nextMusic);
    }
    
    // Configura o arco de progresso SVG
    if (arcProgress) {
        arcProgress.style.strokeDasharray = `${arcCircumference} ${arcCircumference}`;
        arcProgress.style.strokeDashoffset = arcCircumference;
    }

    // Carrega o estado da última sessão e inicia a música
    loadMusicState();
    if (backgroundAudio) {
        // Salva o estado ao sair da página
        window.addEventListener('beforeunload', saveMusicState);
        // Tenta tocar o áudio se não for o primeiro acesso
        if (localStorage.getItem('minecraft-music-state') === 'playing') {
             // Opcional: tentar auto-reproduzir se o usuário já interagiu
             // backgroundAudio.play().catch(e => console.log('Autoplay blocked.'));
        }
    }
    
    // =====================================
    // Lógica do Scroll e Animações
    // =====================================

    const scrollTopButton = document.getElementById('scrollTopButton');
    const scrollProgress = document.querySelector('.scroll-progress');
    const sections = document.querySelectorAll('.fade-in-section');

    const checkScroll = () => {
        // Botão Voltar ao Topo
        if (scrollTopButton) {
            if (window.scrollY > 300) {
                scrollTopButton.classList.add('show');
            } else {
                scrollTopButton.classList.remove('show');
            }
        }
        
        // Barra de Progresso de Rolagem
        if (scrollProgress) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }

        // Animação de Fade-in das seções
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight - 100) {
                section.classList.add('is-visible');
            }
        });
    };

    window.addEventListener('scroll', checkScroll);
    window.addEventListener('load', checkScroll); // Executa no carregamento da página

    if (scrollTopButton) {
        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =====================================
    // Efeito de Hover e Click (Opcional)
    // =====================================
    
    const elementsWithHoverEffects = document.querySelectorAll('a, button');
    
    // Carrega os sons, se existirem
    const loadAudioEffects = () => {
        try {
            hoverSound = new Audio('assets/audios/effects/hover.mp3');
            clickSound = new Audio('assets/audios/effects/click.mp3');
            selectSound = new Audio('assets/audios/effects/select.mp3'); // Adicionado
            hoverSound.volume = 0.5;
            clickSound.volume = 0.5;
            selectSound.volume = 0.5; // Adicionado
        } catch (e) {
            console.error("Erro ao carregar arquivos de áudio de efeitos:", e);
        }
    };
    
    // Ativa os efeitos de áudio, se estiverem carregados
    if (hoverSound) {
        elementsWithHoverEffects.forEach(el => {
            el.addEventListener('mouseenter', () => hoverSound.play());
            el.addEventListener('click', () => {
                clickSound.play();
                showCentralMessage("Clique! :)", 1000);
            });
        });
    }

    // Lógica para copiar texto para a área de transferência
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            showCentralMessage("Código Copiado!", 1500);
        }).catch(err => {
            console.error('Falha ao copiar:', err);
        });
    };

    const copyButtons = document.querySelectorAll('.copy-icon');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                copyToClipboard(targetElement.textContent.trim());
            }
        });
    });

    // =====================================
    // Galeria Lightbox
    // =====================================
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightboxOverlay = document.getElementById('myLightbox');
    const lightboxImage = document.getElementById('lightbox-image');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            lightboxImage.src = item.src;
            lightboxOverlay.classList.add('active');
        });
    });

    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                lightboxOverlay.classList.remove('active');
            }
        });
    }

    // =====================================
    // Modais
    // =====================================
    const modal = document.getElementById('modal-example');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    if (modal && modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Seção de Cards
    const cardGrid = document.querySelector('.card-grid'); // Adicionado para a lógica do som
    const filterButtons = document.querySelectorAll('.card-filter-btn');
    const searchInput = document.getElementById('cardSearch');
    const cardData = []; // Substitua com seus dados reais

    const renderCards = (cards) => {
        // Implemente a lógica de renderização
    };

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.dataset.filter;
                if (filter === 'all') {
                    renderCards(cardData);
                } else {
                    const filtered = cardData.filter(card => card.tags.includes(filter));
                    renderCards(filtered);
                }
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filterButtons.forEach(btn => btn.classList.remove('active'));
            const filteredCards = cardData.filter(card =>
                card.title.toLowerCase().includes(query) ||
                card.tags.some(tag => tag.toLowerCase().includes(query))
            );
            renderCards(filteredCards);
        });
    }

    // Evento de clique para abrir o modal
    cardGrid.addEventListener('click', (e) => {
        // Toca o som de seleção quando a parte do card é clicada
        if (selectSound && e.target.closest('.card')) {
            selectSound.play();
        }

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
    
    // =====================================
    // Lógica dos Novos Elementos
    // =====================================

    // Acordeão
    const accordionButtons = document.querySelectorAll('.accordion-button');

    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            
            // Fecha todos os outros acordeões
            accordionButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    otherButton.classList.remove('active');
                    otherButton.nextElementSibling.style.maxHeight = null;
                }
            });

            // Alterna a classe 'active' no botão clicado
            button.classList.toggle('active');

            // Alterna a altura do conteúdo
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Modal
    const newModal = document.getElementById('myModal');
    const newModalCloseBtn = newModal ? newModal.querySelector('.modal-close-btn') : null;

    if (newModalCloseBtn) {
        newModalCloseBtn.addEventListener('click', () => {
            newModal.classList.remove('active');
        });
    }

    if (newModal) {
        newModal.addEventListener('click', (e) => {
            if (e.target === newModal) {
                newModal.classList.remove('active');
            }
        });
    }

    // Formulário de Contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const statusDiv = contactForm.querySelector('.form-status');
            statusDiv.textContent = 'Enviando...';
            // Simulação de envio
            setTimeout(() => {
                statusDiv.textContent = 'Mensagem enviada com sucesso!';
                statusDiv.style.color = 'var(--cor-primaria)';
                contactForm.reset();
            }, 2000);
        });
    }

    // Galeria com Filtros
    const filterBtns = document.querySelectorAll('.btn-filter');
    const galleryImgs = document.querySelectorAll('.gallery-with-filters .gallery-img');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            galleryImgs.forEach(img => {
                if (filter === 'all' || img.dataset.tag === filter) {
                    img.style.display = 'block';
                } else {
                    img.style.display = 'none';
                }
            });
        });
    });

    // Counter Up (Estatísticas Animadas)
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-count');
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
        });
    };

    const counterSection = document.querySelector('.stats-grid');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (counterSection) {
        observer.observe(counterSection);
    }
    
    // Toast (Caixa de Alerta)
    const showToastBtn = document.getElementById('showToastBtn');
    const myToast = document.getElementById('myToast');

    if (showToastBtn) {
        showToastBtn.addEventListener('click', () => {
            myToast.classList.add('show');
            setTimeout(() => {
                myToast.classList.remove('show');
            }, 3000); // Esconde depois de 3 segundos
        });
    }

    // Efeito de Digitação de Texto
    const typingTextElement = document.querySelector('.typing-text');
    const textToType = 'Olá! Bem-vindo ao Mundo Zera\'s Craft.';
    let i = 0;

    function typeWriter() {
        if (i < textToType.length) {
            typingTextElement.textContent += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    if (typingTextElement) {
        typeWriter();
    }
    
    // Botão com Animação de Loading
    const loadingBtn = document.getElementById('loadingBtn');

    if (loadingBtn) {
        loadingBtn.addEventListener('click', () => {
            loadingBtn.classList.add('loading');
            setTimeout(() => {
                loadingBtn.classList.remove('loading');
                alert('Ação concluída!');
            }, 2000);
        });
    }

    // Scroll Spy
    const scrollSpyLinks = document.querySelectorAll('.scrollspy-nav a');
    const scrollSpySections = document.querySelectorAll('.section h3');

    const updateScrollSpy = () => {
        let currentActive = '';
        scrollSpySections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentActive = section.parentElement.id;
            }
        });

        scrollSpyLinks.forEach(link => {
            link.classList.remove('active');
            if (link.href.includes(currentActive)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateScrollSpy);
    updateScrollSpy(); // Inicia com a seção correta

});