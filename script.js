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
//-----------------------------------------------------
// JS para o Modal Pop-up
document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('openModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (!openModalBtn || !modalOverlay || !modalCloseBtn) return;
    openModalBtn.addEventListener('click', () => {
        modalOverlay.classList.add('show');
    });
    modalCloseBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('show');
    });
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('show');
        }
    });
});



// JS para o Acordeão
document.addEventListener('DOMContentLoaded', () => {
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });
});


// JS para as Abas (Tabs)
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            const target = button.getAttribute('data-tab');
            button.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
});


// JS para o Carrossel
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-control.next');
        const prevButton = carousel.querySelector('.carousel-control.prev');
        let slideWidth = slides[0].getBoundingClientRect().width;
        let slideIndex = 0;
        
        const moveSlides = () => {
            track.style.transform = 'translateX(-' + (slideWidth * slideIndex) + 'px)';
        };

        nextButton.addEventListener('click', () => {
            slideIndex = (slideIndex + 1) % slides.length;
            moveSlides();
        });

        prevButton.addEventListener('click', () => {
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
            moveSlides();
        });

        window.addEventListener('resize', () => {
            slideWidth = slides[0].getBoundingClientRect().width;
            moveSlides();
        });
    });
});


// JS para o Lightbox (Galeria de Imagens)
document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
    if (!lightboxOverlay || !lightboxImage || !lightboxCloseBtn) return;
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imageUrl = item.getAttribute('data-src');
            lightboxImage.src = imageUrl;
            lightboxOverlay.classList.add('active');
        });
    });
    lightboxCloseBtn.addEventListener('click', () => {
        lightboxOverlay.classList.remove('active');
    });
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) {
            lightboxOverlay.classList.remove('active');
        }
    });
});


// JS para o Contador Animado
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    const updateCounter = counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / 200;
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => updateCounter(counter), 1);
        } else {
            counter.innerText = target;
        }
    };
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});



// JS para o Copiar para a Área de Transferência
document.addEventListener('DOMContentLoaded', () => {
    const centralMessage = document.getElementById('centralMessage');
    const showCentralMessage = (text) => {
        if (!centralMessage) return;
        centralMessage.textContent = text;
        centralMessage.classList.add('show');
        setTimeout(() => {
            centralMessage.classList.remove('show');
        }, 3000);
    };

    const setupCopyToClipboard = () => {
        const copyButtons = document.querySelectorAll('.copy-btn');
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    navigator.clipboard.writeText(targetElement.textContent.trim())
                        .then(() => {
                            showCentralMessage("Copiado com sucesso!");
                        })
                        .catch(err => {
                            console.error('Falha ao copiar:', err);
                        });
                }
            });
        });
    };

    setupCopyToClipboard();
});



// JS para Animação de Rolagem (Fade-in)
document.addEventListener('DOMContentLoaded', () => {
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    fadeInSections.forEach(section => {
        observer.observe(section);
    });
});




// JS para o Botão de Compartilhamento Social Flutuante
document.addEventListener('DOMContentLoaded', () => {
    const socialIcons = document.querySelectorAll('.social-icon');
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    socialIcons.forEach(icon => {
        let shareUrl = '';
        if (icon.classList.contains('facebook')) {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
        } else if (icon.classList.contains('twitter')) {
            shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
        } else if (icon.classList.contains('linkedin')) {
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
        } else if (icon.classList.contains('whatsapp')) {
            shareUrl = `whatsapp://send?text=${pageTitle}%20${pageUrl}`;
        }

        icon.setAttribute('href', shareUrl);
        icon.setAttribute('target', '_blank');
        icon.setAttribute('rel', 'noopener noreferrer');
    });
});




// JS para o Toggle de Tema
document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.body.classList.add(savedTheme);
        themeSwitcher.checked = savedTheme === 'light-theme';
    }

    themeSwitcher.addEventListener('change', () => {
        if (themeSwitcher.checked) {
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light-theme');
        } else {
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark-theme');
        }
    });
});


// JS para o Sistema de Notificações Toast
document.addEventListener('DOMContentLoaded', () => {
    const toastContainer = document.getElementById('toastContainer');
    const showToastBtn = document.getElementById('showToastBtn');

    const showToast = (message, duration = 3000) => {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        // Use requestAnimationFrame para garantir que a animação comece após o elemento ser adicionado
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.add('hide');
            toast.addEventListener('animationend', () => {
                toast.remove();
            }, { once: true });
        }, duration);
    };

    if (showToastBtn) {
        showToastBtn.addEventListener('click', () => {
            showToast('Item adicionado ao carrinho!', 3000);
        });
    }
});


// JS para o Botão de Ancoragem com Rolagem Suave
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});


// JS para o Menu "Hamburger" Animado
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('is-active');
            mobileMenu.classList.toggle('is-active');
        });
    }
});


// JS para a Barra de Progresso de Leitura
document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('reading-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / docHeight) * 100;
            progressBar.style.width = `${progress}%`;
        });
    }
});


// JS para Cartões de Conteúdo com Efeito Parallax
document.addEventListener('DOMContentLoaded', () => {
    const parallaxContainers = document.querySelectorAll('.parallax-container');
    parallaxContainers.forEach(container => {
        const bg = container.querySelector('.parallax-bg');
        if (bg) {
            window.addEventListener('scroll', () => {
                const scrollPosition = window.scrollY;
                const offset = scrollPosition - container.offsetTop;
                bg.style.transform = `translateY(${offset * 0.4}px)`;
            });
        }
    });
});


// JS para o Visualizador de Imagens 360 Graus
document.addEventListener('DOMContentLoaded', () => {
    const viewer = document.getElementById('image-viewer-360');
    if (!viewer) return;
    const image = viewer.querySelector('.viewer-360-image');
    let isDragging = false;
    let startX = 0;
    let rotation = 0;

    const images = [
        'https://picsum.photos/800/600?random=1',
        'https://picsum.photos/800/600?random=2',
        'https://picsum.photos/800/600?random=3',
        'https://picsum.photos/800/600?random=4',
        'https://picsum.photos/800/600?random=5',
        'https://picsum.photos/800/600?random=6',
        'https://picsum.photos/800/600?random=7',
        'https://picsum.photos/800/600?random=8'
    ];
    const imageCount = images.length;

    viewer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        viewer.style.cursor = 'grabbing';
    });

    viewer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dragDistance = e.pageX - startX;
        const indexChange = Math.floor(dragDistance / 20); // Ajuste a sensibilidade aqui
        if (indexChange !== 0) {
            rotation = (rotation - indexChange) % imageCount;
            if (rotation < 0) rotation += imageCount;
            image.src = images[rotation];
            startX = e.pageX;
        }
    });

    viewer.addEventListener('mouseup', () => {
        isDragging = false;
        viewer.style.cursor = 'grab';
    });

    viewer.addEventListener('mouseleave', () => {
        isDragging = false;
        viewer.style.cursor = 'grab';
    });
});


// JS para Validação de Formulário em Tempo Real
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    emailInput.addEventListener('input', () => {
        if (!validateEmail(emailInput.value)) {
            emailInput.classList.add('invalid');
            emailError.textContent = 'Por favor, insira um e-mail válido.';
        } else {
            emailInput.classList.remove('invalid');
            emailError.textContent = '';
        }
    });

    passwordInput.addEventListener('input', () => {
        if (!validatePassword(passwordInput.value)) {
            passwordInput.classList.add('invalid');
            passwordError.textContent = 'A senha deve ter pelo menos 8 caracteres.';
        } else {
            passwordInput.classList.remove('invalid');
            passwordError.textContent = '';
        }
    });
});


// JS para o Slider de Faixa de Preço
document.addEventListener('DOMContentLoaded', () => {
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const minValueSpan = document.getElementById('min-value');
    const maxValueSpan = document.getElementById('max-value');

    const updateSlider = () => {
        const minVal = parseInt(priceMin.value);
        const maxVal = parseInt(priceMax.value);

        if (minVal > maxVal) {
            [priceMin.value, priceMax.value] = [priceMax.value, priceMin.value];
        }

        minValueSpan.textContent = priceMin.value;
        maxValueSpan.textContent = priceMax.value;
    };

    priceMin.addEventListener('input', updateSlider);
    priceMax.addEventListener('input', updateSlider);
});



// JS para o Seletor de Data Personalizado
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-input');
    const datePicker = document.getElementById('date-picker');
    const now = new Date();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();

    const generateCalendar = (month, year) => {
        const firstDay = (new Date(year, month)).getDay();
        const daysInMonth = 32 - new Date(year, month, 32).getDate();
        
        datePicker.innerHTML = `
            <div class="date-picker-header">
                <button id="prev-month">&laquo;</button>
                <span>${new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button id="next-month">&raquo;</button>
            </div>
            <div class="date-picker-grid">
                <div class="day-of-week">Dom</div>
                <div class="day-of-week">Seg</div>
                <div class="day-of-week">Ter</div>
                <div class="day-of-week">Qua</div>
                <div class="day-of-week">Qui</div>
                <div class="day-of-week">Sex</div>
                <div class="day-of-week">Sáb</div>
            </div>
        `;
        const dateGrid = datePicker.querySelector('.date-picker-grid');
        for (let i = 0; i < firstDay; i++) {
            dateGrid.innerHTML += '<div></div>';
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            dayDiv.addEventListener('click', () => {
                const selectedDate = new Date(year, month, day);
                dateInput.value = selectedDate.toLocaleDateString();
                datePicker.style.display = 'none';
            });
            dateGrid.appendChild(dayDiv);
        }
    };

    dateInput.addEventListener('click', () => {
        datePicker.style.display = 'block';
        generateCalendar(currentMonth, currentYear);
    });

    datePicker.addEventListener('click', (e) => {
        if (e.target.id === 'prev-month') {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar(currentMonth, currentYear);
        } else if (e.target.id === 'next-month') {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar(currentMonth, currentYear);
        }
    });

    document.addEventListener('click', (e) => {
        if (!datePicker.contains(e.target) && e.target !== dateInput) {
            datePicker.style.display = 'none';
        }
    });
});



// JS para a Barra de Pesquisa com Autocompletar
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const suggestionsList = document.getElementById('suggestions');
    const data = ['Minecraft', 'Servidores de Minecraft', 'Mods', 'Plugins', 'Recursos', 'Texturas', 'Skins', 'Comandos', 'Tutorial'];

    const filterSuggestions = (query) => {
        return data.filter(item => item.toLowerCase().includes(query.toLowerCase()));
    };

    const renderSuggestions = (suggestions) => {
        suggestionsList.innerHTML = '';
        if (suggestions.length === 0) {
            suggestionsList.style.display = 'none';
            return;
        }
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            li.addEventListener('click', () => {
                searchInput.value = suggestion;
                suggestionsList.style.display = 'none';
            });
            suggestionsList.appendChild(li);
        });
        suggestionsList.style.display = 'block';
    };

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query.length > 0) {
            const filtered = filterSuggestions(query);
            renderSuggestions(filtered);
        } else {
            suggestionsList.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!suggestionsList.contains(e.target) && e.target !== searchInput) {
            suggestionsList.style.display = 'none';
        }
    });
});



// JS para o Efeito de Fundo com Partículas Animadas (usando a biblioteca particles.js)
// Você precisará incluir a biblioteca no seu projeto.
// Exemplo: <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
document.addEventListener('DOMContentLoaded', () => {
    if (window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": { "enable": true, "value_area": 800 }
                },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "repulse" } }
            }
        });
    }
});



// JS para a Animação de Digitação de Texto
document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.querySelector('.type-text');
    const textToType = "Olá! Bem-vindo ao Mundo Zera's Craft.";
    let i = 0;
    let speed = 100; // velocidade da digitação em ms

    function typeWriter() {
        if (i < textToType.length) {
            textElement.textContent += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }

    if (textElement) {
        typeWriter();
    }
});



// JS para o Layout de Grade com Efeito de Filtro
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const gridItems = document.querySelectorAll('.grid-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            gridItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.remove('hidden');
                    }, 10);
                } else {
                    item.classList.add('hidden');
                    item.addEventListener('transitionend', () => {
                        if (item.classList.contains('hidden')) {
                            item.style.display = 'none';
                        }
                    }, { once: true });
                }
            });
        });
    });
});
//-----------------------------------------------------
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