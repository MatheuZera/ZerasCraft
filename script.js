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

document.addEventListener('DOMContentLoaded', () => {

    // =====================================
    // 1. Sistema de Abas (Tabs)
    // =====================================
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões e painéis
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Adiciona a classe 'active' ao botão clicado e ao painel correspondente
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // =====================================
    // 2. Carrossel de Imagens (Swiper)
    // =====================================
    const carouselTrack = document.querySelector('.image-carousel-track');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    let carouselIndex = 0;

    if (carouselTrack) {
        nextBtn.addEventListener('click', () => {
            carouselIndex++;
            const images = carouselTrack.querySelectorAll('img');
            if (carouselIndex >= images.length) {
                carouselIndex = 0;
            }
            const offset = images[0].offsetWidth * carouselIndex;
            carouselTrack.style.transform = `translateX(-${offset}px)`;
        });

        prevBtn.addEventListener('click', () => {
            carouselIndex--;
            const images = carouselTrack.querySelectorAll('img');
            if (carouselIndex < 0) {
                carouselIndex = images.length - 1;
            }
            const offset = images[0].offsetWidth * carouselIndex;
            carouselTrack.style.transform = `translateX(-${offset}px)`;
        });
    }

    // =====================================
    // 3. Acordeão (FAQ)
    // =====================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            header.classList.toggle('active');

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // =====================================
    // 4. Modal/Lightbox
    // =====================================
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('myModal');

    if (openModalBtn && modal && closeModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });

        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // =====================================
    // 5. Contador Animado (Counter Up)
    // =====================================
    const counters = document.querySelectorAll('.counter-number');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'), 10);
                let currentCount = 0;
                const duration = 2000;
                const increment = target / (duration / 16);

                const updateCounter = () => {
                    currentCount += increment;
                    if (currentCount < target) {
                        counter.textContent = Math.ceil(currentCount);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // =====================================
    // 6. Barra de Progresso Animada
    // =====================================
    const progressBars = document.querySelectorAll('.progress-bar-fill');
    const progressBarObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress');
                bar.style.width = `${progress}%`;
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        progressBarObserver.observe(bar);
    });
    
    // =====================================
    // 7. Galeria com Filtro e Pesquisa
    // =====================================
    const galleryData = [
        { id: '1', title: 'Torneio PVP', tags: ['pvp', 'torneio'], img: 'https://via.placeholder.com/400x300/388E3C/FFFFFF?text=PVP+Event+1' },
        { id: '2', title: 'Concurso de Construção', tags: ['construcao', 'concurso'], img: 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Build+Comp+1' },
        { id: '3', title: 'Festa de Lançamento', tags: ['festas'], img: 'https://via.placeholder.com/400x300/2E7D32/FFFFFF?text=Launch+Party' },
        { id: '4', title: 'Batalha de Chefão', tags: ['pvp'], img: 'https://via.placeholder.com/400x300/388E3C/FFFFFF?text=Boss+Battle' },
        { id: '5', title: 'Construção da Comunidade', tags: ['construcao'], img: 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Community+Build' },
    ];
    const galleryContainer = document.getElementById('gallery-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('gallery-search');

    function renderGallery(items) {
        galleryContainer.innerHTML = '';
        items.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.setAttribute('data-tags', item.tags.join(' '));
            galleryItem.innerHTML = `
                <img src="${item.img}" alt="${item.title}">
                <div class="gallery-item-caption">
                    <h4>${item.title}</h4>
                </div>
            `;
            galleryContainer.appendChild(galleryItem);
        });
    }

    // Inicializa a galeria
    renderGallery(galleryData);

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            searchInput.value = '';

            const filter = e.target.getAttribute('data-filter');
            if (filter === 'all') {
                renderGallery(galleryData);
            } else {
                const filtered = galleryData.filter(item => item.tags.includes(filter));
                renderGallery(filtered);
            }
        });
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filterButtons.forEach(btn => btn.classList.remove('active'));
        const filtered = galleryData.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.tags.some(tag => tag.toLowerCase().includes(query))
        );
        renderGallery(filtered);
    });

    // =====================================
    // 8. Efeito de Hover Avançado para Imagem
    // =====================================
    // O CSS já lida com a maior parte do efeito de hover.
    // Nenhum JS adicional é necessário para este elemento, apenas a estrutura HTML/CSS.

    // =====================================
    // 9. Timeline de Eventos
    // =====================================
    // Nenhum JS adicional é necessário para este elemento, a animação é feita via CSS.

    // =====================================
    // 10. Tabela de Preços (Ranking)
    // =====================================
    // Nenhum JS adicional é necessário para este elemento, a animação é feita via CSS.

    // =====================================
    // 11. Formulário de Contato Dinâmico
    // =====================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Simulação de envio
            formStatus.style.display = 'block';
            formStatus.classList.remove('success', 'error');
            formStatus.textContent = 'Enviando...';

            setTimeout(() => {
                if (name && email && message) {
                    formStatus.classList.add('success');
                    formStatus.textContent = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
                    contactForm.reset();
                } else {
                    formStatus.classList.add('error');
                    formStatus.textContent = 'Por favor, preencha todos os campos.';
                }
            }, 1000);
        });
    }

    // =====================================
    // 12. Toast/Notificação Pop-up
    // =====================================
    const showToastBtn = document.getElementById('showToastBtn');
    const toast = document.getElementById('toastNotification');

    if (showToastBtn && toast) {
        showToastBtn.addEventListener('click', () => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        });
    }

    // =====================================
    // 13. Seção de Testemunhos (Sliders)
    // =====================================
    const testimonialsContainer = document.querySelector('.testimonials-slider-container');
    const testimonialsTrack = testimonialsContainer ? testimonialsContainer.querySelector('.testimonials-track') : null;
    const pagination = testimonialsContainer ? testimonialsContainer.querySelector('.testimonials-pagination') : null;
    let testimonialIndex = 0;

    if (testimonialsTrack && pagination) {
        const slides = testimonialsTrack.querySelectorAll('.testimonial-card');
        slides.forEach(() => {
            const dot = document.createElement('span');
            dot.classList.add('testimonials-pagination-dot');
            pagination.appendChild(dot);
        });
        const dots = pagination.querySelectorAll('.testimonials-pagination-dot');
        dots[0].classList.add('active');

        function updateSlider() {
            const slideWidth = slides[0].offsetWidth;
            testimonialsTrack.style.transform = `translateX(-${slideWidth * testimonialIndex}px)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[testimonialIndex].classList.add('active');
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                testimonialIndex = index;
                updateSlider();
            });
        });

        setInterval(() => {
            testimonialIndex++;
            if (testimonialIndex >= slides.length) {
                testimonialIndex = 0;
            }
            updateSlider();
        }, 5000);
    }
    
    // =====================================
    // 14. Botão de Compartilhar Personalizado
    // =====================================
    const shareButtons = document.querySelectorAll('.share-btn');
    const pageUrl = encodeURIComponent(window.location.href);

    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.getAttribute('data-platform');
            let shareUrl = '';
            
            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${encodeURIComponent('Venha jogar no Mundo Zera\'s Craft! O melhor servidor de Minecraft para uma experiência incrível.')}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent('Dê uma olhada no Mundo Zera\'s Craft, o servidor de Minecraft mais incrível! Junte-se à diversão: ')} ${pageUrl}`;
                    break;
            }
            window.open(shareUrl, '_blank');
        });
    });

    // =====================================
    // 15. Campo de IP/Porta Copiável (Aprimorado)
    // =====================================
    const copyButton = document.querySelector('.copy-button');
    const copyTarget = document.querySelector('.copy-target');

    if (copyButton && copyTarget) {
        copyButton.addEventListener('click', () => {
            const textToCopy = copyTarget.textContent;
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    copyButton.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copiar';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Falha ao copiar:', err);
                    copyButton.innerHTML = '<i class="fas fa-times"></i> Erro!';
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copiar';
                    }, 2000);
                });
        });
    }

});

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