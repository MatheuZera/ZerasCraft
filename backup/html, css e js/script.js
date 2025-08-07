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

    // =====================================
    // 9. Funcionalidade do Acordeão
    // =====================================
    function setupAccordion() {
        const accordionItems = document.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
    }
    setupAccordion();

    // =====================================
    // 10. Funcionalidade do Modal
    // =====================================
    function setupModal() {
        const modal = document.getElementById('myModal');
        const openBtn = document.getElementById('openModalBtn');
        const closeBtn = modal ? modal.querySelector('.modal-close-btn') : null;
        
        if (openBtn && modal) {
            openBtn.addEventListener('click', () => {
                modal.classList.add('show');
            });
        }
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }
        if (modal) {
            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.classList.remove('show');
                }
            });
        }
    }
    setupModal();

    // =====================================
    // 11. Funcionalidade da Galeria e Lightbox
    // =====================================
    function setupLightbox() {
        const galleryItems = document.querySelectorAll('.gallery-item img');
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

        if (galleryItems.length > 0 && lightbox) {
            galleryItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    const imgSrc = e.target.getAttribute('data-src');
                    lightboxImage.src = imgSrc;
                    lightbox.classList.add('show');
                });
            });

            if(lightboxClose) {
                lightboxClose.addEventListener('click', () => {
                    lightbox.classList.remove('show');
                });
            }

            lightbox.addEventListener('click', (e) => {
                if (e.target.id === 'lightbox') {
                    lightbox.classList.remove('show');
                }
            });
        }
    }
    setupLightbox();

    // =====================================
    // 12. Funcionalidade das Tabs
    // =====================================
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        if (tabButtons.length > 0) {
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    
                    button.classList.add('active');
                    const tabId = button.getAttribute('data-tab');
                    const activeTabContent = document.getElementById(tabId);
                    if (activeTabContent) {
                        activeTabContent.classList.add('active');
                    }
                });
            });
        }
    }
    setupTabs();

    // =====================================
    // 13. Funcionalidade do Carrossel de Testemunhos
    // =====================================
    const carousel = document.querySelector('.testimonial-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (carousel && prevBtn && nextBtn) {
        const scrollWidth = carousel.scrollWidth / carousel.childElementCount;

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollWidth, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollWidth, behavior: 'smooth' });
        });
    }
});
    // =====================================
    // 14. Contador Animado
    // =====================================
    const counters = document.querySelectorAll('.counter');
    const observerOptionsCounters = { root: null, threshold: 0.5 };
    
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        let startTime = null;
        const easeOutQuad = t => t * (2 - t);
        
        const updateCounter = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsedTime = timestamp - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const value = Math.floor(easeOutQuad(progress) * target);
            counter.textContent = value;
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        requestAnimationFrame(updateCounter);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptionsCounters);
    
    counters.forEach(counter => {
        counter.textContent = '0';
        counterObserver.observe(counter);
    });

    // =====================================
    // 15. Bloco de Spoiler de Texto Expansível
    // =====================================
document.addEventListener('DOMContentLoaded', () => {
    const spoilerButton = document.querySelector('.spoiler-toggle');
    spoilerButton.addEventListener('click', () => {
        spoilerButton.parentElement.classList.toggle('active');
    });
});

    // =====================================
    // 16. Lista de Recursos com Animação de Marcador
    // =====================================
document.addEventListener('DOMContentLoaded', () => {
    const animatedList = document.querySelector('.animated-list');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (animatedList) {
        observer.observe(animatedList);
    }
});

    // =====================================
    // 17. Texto com Efeito Hover Interativo
    // =====================================
document.addEventListener('DOMContentLoaded', () => {
    const hoverText = document.querySelector('.hover-text');
    const hoverImage = document.querySelector('.hover-image');

    if (hoverText && hoverImage) {
        hoverText.addEventListener('mouseenter', () => {
            const imageUrl = hoverText.getAttribute('data-image');
            hoverImage.style.backgroundImage = `url(${imageUrl})`;
        });
    }
});

    // =====================================
    // 18. Bloco de Texto com Efeito de "Console"
    // =====================================
document.addEventListener('DOMContentLoaded', () => {
    const consoleTextElement = document.querySelector('.console-text');
    const textToType = 'minecraft@server:~$ /join zeracraft.com';
    let charIndex = 0;

    function typeConsole() {
        if (charIndex < textToType.length) {
            consoleTextElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeConsole, 70); // Velocidade da digitação
        } else {
            // Reinicia a animação ou para
        }
    }

    typeConsole();
});

    // =====================================
    // 19. Status de Estatísticas - Porcentagens
    // =====================================
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