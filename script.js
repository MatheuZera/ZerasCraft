// script.js - Lógica de interatividade para o site Mundo Zera's Craft

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!"); [cite: 1]

    // =====================================
    // Variáveis Globais de Áudio e Elementos
    // =====================================
    let hoverSound; [cite: 1]
    let clickSound; [cite: 1]
    const backgroundAudio = document.getElementById('backgroundAudio'); [cite: 1]
    const audioEffects = {}; [cite: 1]

    const audioControlButton = document.getElementById('audioControlButton'); [cite: 1]
    const audioNextButton = document.getElementById('audioNextButton'); [cite: 1]
    const musicTitleDisplay = document.getElementById('musicTitleDisplay'); [cite: 1]
    const audioProgressArc = document.getElementById('audioProgressArc'); [cite: 1]
    const arcProgress = audioProgressArc ? audioProgressArc.querySelector('.arc-progress') : null; [cite: 2]

    const arcRadius = 27; [cite: 2]
    const arcCircumference = 2 * Math.PI * arcRadius; [cite: 2]

    let preparingNextMusic = false; [cite: 2]

    const musicPlaylist = [
        { title: '✨ Aerie (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Aerie.mp3' }, [cite: 3]
        { title: '✨ Comforting Memories (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Comforting.mp3' }, [cite: 3]
        { title: '✨ Creator (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Creator.mp3' }, [cite: 3]
        { title: '✨ Infinite Amethyst (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Infinity.mp3' }, [cite: 3]
        { title: '✨ Left to Bloom (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Left.mp3' }, [cite: 3]
        { title: '✨ Otherside (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Otherside.mp3' }, [cite: 3]
        { title: '⛏️ Aria Math Lofi', src: 'assets/audios/musics/Aria-Math-Lofi.mp3' }, [cite: 3]
        { title: '⛏️ Aria Math', src: 'assets/audios/musics/Aria-Math.mp3' }, [cite: 3]
        { title: '⛏️ Beginning', src: 'assets/audios/musics/Beginning.mp3' }, [cite: 3]
        { title: '⛏️ Biome Fest', src: 'assets/audios/musics/Biome-Fest.mp3' }, [cite: 4]
        { title: '⛏️ Blind Spots', src: 'assets/audios/musics/Blind-Spots.mp3' }, [cite: 4]
        { title: '⛏️ Clark', src: 'assets/audios/musics/Clark.mp3' }, [cite: 4]
        { title: '⛏️ Danny', src: 'assets/audios/musics/Danny.mp3' }, [cite: 4]
        { title: '⛏️ Dreiton', src: 'assets/audios/musics/Dreiton.mp3' }, [cite: 4]
        { title: '⛏️ Dry Hands', src: 'assets/audios/musics/Dry-Hands.mp3' }, [cite: 4]
        { title: '⛏️ Floating Trees', src: 'assets/audios/musics/Floating-Trees.mp3' }, [cite: 4]
        { title: '⛏️ Haggstrom', src: 'assets/audios/musics/Haggstrom.mp3' }, [cite: 5]
        { title: '⛏️ Key', src: 'assets/audios/musics/Key.mp3' }, [cite: 5]
        { title: '⛏️ Living Mice', src: 'assets/audios/musics/Living-Mice.mp3' }, [cite: 5]
        { title: '⛏️ Mice On Venus', src: 'assets/audios/musics/Mice-On-Venus.mp3' }, [cite: 5]
        { title: '⛏️ Minecraft', src: 'assets/audios/musics/Minecraft.mp3' }, [cite: 5]
        { title: '⛏️ Moog City', src: 'assets/audios/musics/Moog-City.mp3' }, [cite: 5]
        { title: '⛏️ Mutation', src: 'assets/audios/musics/Mutation.mp3' }, [cite: 5]
        { title: '⛏️ Sweden', src: 'assets/audios/musics/Sweden.mp3' }, [cite: 6]
        { title: '⛏️ Taswell', src: 'assets/audios/musics/Taswell.mp3' }, [cite: 6]
        { title: '⛏️ Wet Hands', src: 'assets/audios/musics/Wet-Hands.mp3' }, [cite: 6]
        { title: '💿 Blocks', src: 'assets/audios/musics/records/Blocks.mp3' }, [cite: 6]
        { title: '💿 Cat', src: 'assets/audios/musics/records/Cat.mp3' }, [cite: 6]
        { title: '💿 Far', src: 'assets/audios/musics/records/Far.mp3' }, [cite: 6]
        { title: '💿 Mall', src: 'assets/audios/musics/records/Mall.mp3' }, [cite: 6]
        { title: '💿 Mellohi', src: 'assets/audios/musics/records/Mellohi.mp3' }, [cite: 7]
        { title: '💿 Otherside', src: 'assets/audios/musics/records/Otherside.mp3' }, [cite: 7]
        { title: '💿 Pingstep Master', src: 'assets/audios/musics/records/Pingstep_Master.mp3' }, [cite: 7]
        { title: '💿 Relic', src: 'assets/audios/musics/records/Relic.mp3' }, [cite: 7]
        { title: '💿 Stal', src: 'assets/audios/musics/records/Stal.mp3' }, [cite: 7]
        { title: '💿 Strad', src: 'assets/audios/musics/records/Strad.mp3' }, [cite: 7]
        { title: '💿 Wait', src: 'assets/audios/musics/records/Wait.mp3' }, [cite: 7]
        { title: '💿 Ward', src: 'assets/audios/musics/records/Ward.mp3' }, [cite: 8]
    ];
    let currentMusicIndex = -1; [cite: 8, 9]

    // =====================================
    // Funções Auxiliares de Áudio
    // =====================================
    const initializeAudioEffect = (name, path, volume = 0.5) => {
        const audio = new Audio(path); [cite: 10]
        audio.preload = 'auto'; [cite: 10]
        audio.volume = volume; [cite: 10]
        audioEffects[name] = audio; [cite: 10]
        return audio; [cite: 10]
    };

    hoverSound = initializeAudioEffect('select', 'assets/audios/effects/select.mp3', 0.3); [cite: 11]
    clickSound = initializeAudioEffect('click', 'assets/audios/effects/click.mp3', 0.7); [cite: 11]

    const playEffectSoundInternal = (audioElement) => {
        if (audioElement) { [cite: 12]
            const clonedAudio = audioElement.cloneNode(); [cite: 12]
            clonedAudio.volume = audioElement.volume; [cite: 12]
            clonedAudio.play().catch(e => console.warn("Erro ao tentar tocar som de efeito:", e.message)); [cite: 12]
        }
    }; [cite: 12]

    const playEffectSound = (audioElement) => {
        setTimeout(() => { [cite: 13]
            playEffectSoundInternal(audioElement); [cite: 13]
        }, 10); [cite: 14]
    }; [cite: 14]

    function showCentralMessage(message) {
        const centralMessageElement = document.getElementById('centralMessage'); [cite: 15]
        if (centralMessageElement) { [cite: 15]
            centralMessageElement.textContent = message; [cite: 15]
            centralMessageElement.classList.add('show'); [cite: 16]
            setTimeout(() => { [cite: 16]
                centralMessageElement.classList.remove('show'); [cite: 17]
            }, 3000); [cite: 17]
        } else {
            console.log(`[Mensagem Central] ${message}`); [cite: 17, 18]
        }
    }

    // =====================================
    // Lógica de Controle da Música de Fundo
    // =====================================
    const updateAudioButtonTitle = () => {
        if (musicTitleDisplay && currentMusicIndex !== -1 && musicPlaylist[currentMusicIndex]) { [cite: 19]
            if (!backgroundAudio.paused) { [cite: 19]
                musicTitleDisplay.textContent = `${musicPlaylist[currentMusicIndex].title}`; [cite: 19]
                audioControlButton.innerHTML = '<i class="fas fa-pause"></i>'; [cite: 19]
            } else {
                musicTitleDisplay.textContent = 'Clique para Tocar'; [cite: 20]
                audioControlButton.innerHTML = '<i class="fas fa-play"></i>'; [cite: 20]
            }
        } else if (musicTitleDisplay) {
            musicTitleDisplay.textContent = 'Nenhuma Música'; [cite: 21]
            audioControlButton.innerHTML = '<i class="fas fa-play"></i>'; [cite: 21]
        }
    }; [cite: 22]

    const getRandomMusicIndex = () => {
        if (musicPlaylist.length === 0) return -1; [cite: 23]
        let newIndex; [cite: 23]
        if (musicPlaylist.length > 1) { [cite: 23]
            do {
                newIndex = Math.floor(Math.random() * musicPlaylist.length); [cite: 24]
            } while (newIndex === currentMusicIndex); [cite: 24]
        } else {
            newIndex = 0; [cite: 25]
        }
        return newIndex; [cite: 25]
    };

    const playMusic = () => {
        if (!backgroundAudio || !backgroundAudio.src) { [cite: 26]
            console.warn("Áudio não pronto para tocar."); [cite: 27]
            return; [cite: 27]
        }
        backgroundAudio.play().then(() => { [cite: 27]
            if (audioControlButton) audioControlButton.classList.add('is-playing'); [cite: 27]
            showCentralMessage(`Tocando: ${musicPlaylist[currentMusicIndex].title}`); [cite: 27]
            updateAudioButtonTitle(); [cite: 27]
            saveAudioState(); [cite: 27]
        }).catch(e => {
            console.error("Erro ao tentar tocar áudio (provavelmente autoplay bloqueado):", e.message); [cite: 28]
            if (audioControlButton) audioControlButton.classList.remove('is-playing'); [cite: 28]
            showCentralMessage('Autoplay bloqueado. Clique para tocar.'); [cite: 28]
            updateAudioButtonTitle(); [cite: 28]
        });
    }; [cite: 29]

    const loadNewMusic = (playAfterLoad = false, specificIndex = -1) => {
        if (musicPlaylist.length === 0) {
            console.warn("Playlist vazia, não é possível carregar música."); [cite: 30]
            preparingNextMusic = false; [cite: 30]
            return; [cite: 30]
        }
        if (preparingNextMusic) {
            console.log("Já está preparando a próxima música, abortando nova carga."); [cite: 31]
            return; [cite: 31]
        }

        preparingNextMusic = true; [cite: 32]
        currentMusicIndex = (specificIndex !== -1) ? specificIndex : getRandomMusicIndex(); [cite: 32]
        const music = musicPlaylist[currentMusicIndex]; [cite: 33]
        if (currentMusicIndex === -1) {
            console.warn("Não foi possível obter um índice de música válido. Playlist vazia ou erro."); [cite: 34]
            preparingNextMusic = false; [cite: 34]
            return; [cite: 34]
        }

        backgroundAudio.src = music.src; [cite: 34]
        backgroundAudio.load(); [cite: 35]
        backgroundAudio.oncanplaythrough = () => {
            preparingNextMusic = false; [cite: 36]
            if (playAfterLoad) { [cite: 36]
                playMusic(); [cite: 37]
            } else {
                updateAudioButtonTitle(); [cite: 38]
            }
            backgroundAudio.oncanplaythrough = null; [cite: 38]
            saveAudioState(); [cite: 38]
        }; [cite: 39]

        backgroundAudio.onerror = (e) => {
            console.error(`Erro ao carregar áudio: ${music.src}`, e); [cite: 40]
            showCentralMessage('Erro ao carregar música. Pulando...'); [cite: 40]
            preparingNextMusic = false; [cite: 40]
            backgroundAudio.onerror = null; [cite: 40]
            setTimeout(() => loadNewMusic(playAfterLoad), 500); [cite: 40]
        }; [cite: 41]
    };

    const updateProgressArc = () => {
        if (!arcProgress) return; [cite: 42]
        if (backgroundAudio.duration > 0 && !isNaN(backgroundAudio.duration)) { [cite: 42]
            const progress = (backgroundAudio.currentTime / backgroundAudio.duration); [cite: 43]
            const offset = arcCircumference * (1 - progress); [cite: 43]
            arcProgress.style.strokeDashoffset = offset; [cite: 44]
        } else {
            arcProgress.style.strokeDashoffset = arcCircumference; [cite: 44, 45]
        }
    }; [cite: 45]

    const saveAudioState = () => {
        if (backgroundAudio) { [cite: 46]
            const audioState = {
                currentTime: backgroundAudio.currentTime, [cite: 46]
                currentMusicIndex: currentMusicIndex, [cite: 46]
                paused: backgroundAudio.paused, [cite: 46]
                volume: backgroundAudio.volume, [cite: 46]
                userInteracted: localStorage.getItem('userInteractedWithAudio') === 'true' [cite: 46]
            }; [cite: 47]
            localStorage.setItem('audioState', JSON.stringify(audioState)); [cite: 47]
        }
    }; [cite: 47]

    const restoreAudioState = () => {
        const savedState = localStorage.getItem('audioState'); [cite: 48]
        if (savedState) { [cite: 48]
            const audioState = JSON.parse(savedState); [cite: 49]
            currentMusicIndex = audioState.currentMusicIndex; [cite: 49]
            backgroundAudio.volume = audioState.volume; [cite: 49]

            if (currentMusicIndex !== -1 && musicPlaylist[currentMusicIndex]) { [cite: 49]
                backgroundAudio.src = musicPlaylist[currentMusicIndex].src; [cite: 50]
                backgroundAudio.load(); [cite: 50]

                backgroundAudio.onloadedmetadata = () => {
                    backgroundAudio.currentTime = audioState.currentTime; [cite: 51]
                    updateProgressArc(); [cite: 51]
                    if (!audioState.paused && audioState.userInteracted) { [cite: 51]
                        playMusic(); [cite: 52]
                    } else {
                        updateAudioButtonTitle(); [cite: 53]
                        if (audioControlButton) audioControlButton.classList.remove('is-playing'); [cite: 53]
                    }
                    backgroundAudio.onloadedmetadata = null; [cite: 54]
                }; [cite: 54]
                backgroundAudio.onerror = (e) => {
                    console.error("Erro ao carregar música restaurada:", e); [cite: 55]
                    showCentralMessage('Erro ao restaurar música. Pulando...'); [cite: 55]
                    loadNewMusic(true); [cite: 55]
                };
            } else {
                loadNewMusic(false); [cite: 56]
            }
        } else {
            loadNewMusic(false); [cite: 57]
        }
    };

    // =====================================
    // 1. Menu Hambúrguer
    // =====================================
    const menuToggle = document.querySelector('.menu-toggle'); [cite: 58]
    const navMenu = document.querySelector('.main-nav'); [cite: 58]

    if (menuToggle && navMenu) { [cite: 58]
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active'); [cite: 58]
            menuToggle.classList.toggle('active'); [cite: 58]
            playEffectSound(clickSound); [cite: 58]
        });
        document.querySelectorAll('.main-nav a').forEach(item => {
            item.addEventListener('click', () => { [cite: 59]
                setTimeout(() => {
                    navMenu.classList.remove('active'); [cite: 59]
                    menuToggle.classList.remove('active'); [cite: 59]
                }, 300);
                playEffectSound(clickSound); [cite: 60]
            });
        }); [cite: 61]
    }

    // =====================================
    // 2. Funcionalidade de Copiar Texto
    // =====================================
    const copyButtons = document.querySelectorAll('.copy-button'); [cite: 62]
    if (copyButtons.length > 0) { [cite: 62]
        copyButtons.forEach(button => {
            button.addEventListener('click', async () => {
                playEffectSound(clickSound); [cite: 62]
                let textToCopy = ''; [cite: 62]
                let targetElementSelector = button.dataset.copyTarget; [cite: 63]
                let originalButtonText = button.textContent; [cite: 63]

                if (targetElementSelector) { [cite: 63]
                    const parentContext = button.closest('.access-info') || document; [cite: 63]
                    const selectors = targetElementSelector.split(',').map(s => s.trim()); [cite: 64]
                    let partsToCopy = []; [cite: 64]

                    for (const selector of selectors) { [cite: 64]
                        const targetElement = parentContext.querySelector(selector); [cite: 64]
                        if (targetElement) { [cite: 65]
                            partsToCopy.push(targetElement.textContent.trim()); [cite: 65]
                        }
                    }

                    if (selectors.includes('#serverIp') && selectors.includes('#serverPort') && partsToCopy.length === 2) { [cite: 65, 66]
                        textToCopy = `${partsToCopy[0]}:${partsToCopy[1]}`; [cite: 66]
                    } else {
                        textToCopy = partsToCopy.join(''); [cite: 67]
                    }
                } else if (button.dataset.copyText) {
                    textToCopy = button.dataset.copyText; [cite: 68]
                }

                if (textToCopy) {
                    try {
                        await navigator.clipboard.writeText(textToCopy); [cite: 69]
                        showCentralMessage(`'${textToCopy}' copiado!`); [cite: 69]
                        button.textContent = 'Copiado!'; [cite: 69]
                        button.classList.add('copied'); [cite: 69]
                        setTimeout(() => {
                            button.textContent = originalButtonText; [cite: 70]
                            button.classList.remove('copied'); [cite: 70]
                        }, 2000); [cite: 70]
                    } catch (err) {
                        console.error('Erro ao copiar: ', err); [cite: 71]
                        showCentralMessage('Falha ao copiar.'); [cite: 71]
                    }
                } else {
                    showCentralMessage('Nada para copiar.'); [cite: 72]
                }
            });
        }); [cite: 73]
    }

    // =====================================
    // 3. Sistema de Áudio de Fundo
    // =====================================
    if (backgroundAudio) { [cite: 73]
        if (arcProgress) { [cite: 74]
            arcProgress.style.strokeDasharray = `${arcCircumference} ${arcCircumference}`; [cite: 74]
            arcProgress.style.strokeDashoffset = arcCircumference; [cite: 74]
            arcProgress.style.transition = 'stroke-dashoffset 1s linear'; [cite: 74]
        }

        restoreAudioState(); [cite: 74]

        backgroundAudio.addEventListener('timeupdate', updateProgressArc); [cite: 75]
        backgroundAudio.addEventListener('ended', () => {
            if (audioControlButton) audioControlButton.classList.remove('is-playing'); [cite: 75]
            updateProgressArc(); [cite: 75]
            preparingNextMusic = false; [cite: 75]
            loadNewMusic(true); [cite: 75]
        }); [cite: 76]

        if (audioControlButton) {
            audioControlButton.addEventListener('click', () => { [cite: 76]
                playEffectSound(clickSound); [cite: 76]
                localStorage.setItem('userInteractedWithAudio', 'true'); [cite: 76]

                if (backgroundAudio.paused) {
                    if (currentMusicIndex === -1 || !backgroundAudio.src) { [cite: 77]
                        loadNewMusic(true); [cite: 77]
                    } else {
                        playMusic(); [cite: 77]
                    }
                } else {
                    backgroundAudio.pause(); [cite: 78]
                    if (audioControlButton) audioControlButton.classList.remove('is-playing'); [cite: 78]
                    updateAudioButtonTitle(); [cite: 78]
                }
            });
        } [cite: 79]

        if (audioNextButton) {
            audioNextButton.addEventListener('click', () => {
                playEffectSound(clickSound); [cite: 79]
                backgroundAudio.pause(); [cite: 79]
                if (audioControlButton) audioControlButton.classList.remove('is-playing'); [cite: 79]
                showCentralMessage('Próxima música...'); [cite: 80]
                preparingNextMusic = false; [cite: 80]
                loadNewMusic(true); [cite: 80]
            });
        } [cite: 81]

        window.addEventListener('beforeunload', saveAudioState); [cite: 81]
        window.addEventListener('pagehide', saveAudioState); [cite: 82]
    }

    // =====================================
    // 4. Sistema de Sons para Interações (Hover e Click)
    // =====================================
    document.querySelectorAll('a, button, .custom-radio-btn').forEach(element => { [cite: 82]
        element.addEventListener('mouseenter', () => playEffectSound(hoverSound)); [cite: 82]
        element.addEventListener('click', () => playEffectSound(clickSound)); [cite: 83]
    });
    document.querySelectorAll('.service-card, .role-category-card, .access-card, .community-card, .event-card, .partnership-card, .security-card, .faq-item, .info-card').forEach(card => {
        card.addEventListener('mouseenter', () => playEffectSound(hoverSound)); [cite: 83]
    }); [cite: 84]

    // =====================================
    // 5. Botão "Voltar ao Topo"
    // =====================================
    const scrollTopButton = document.getElementById('scrollTopButton'); [cite: 85]
    if (scrollTopButton) { [cite: 85]
        window.addEventListener('scroll', () => { [cite: 85]
            if (window.scrollY > 300) { [cite: 85]
                scrollTopButton.classList.add('show'); [cite: 85]
            } else {
                scrollTopButton.classList.remove('show'); [cite: 86]
            }
        }); [cite: 86]
        scrollTopButton.addEventListener('click', () => { [cite: 86]
            window.scrollTo({ top: 0, behavior: 'smooth' }); [cite: 87]
            playEffectSound(clickSound); [cite: 87]
        });
    } [cite: 87]

    // =====================================
    // 6. Atualizar Ano Atual no Rodapé
    // =====================================
    const currentYearSpan = document.getElementById('currentYear'); [cite: 88]
    if (currentYearSpan) { [cite: 88]
        currentYearSpan.textContent = new Date().getFullYear(); [cite: 89]
    } [cite: 89]

    // =====================================
    // 7. Animações de Rolagem
    // =====================================
    const sections = document.querySelectorAll('.fade-in-section'); [cite: 90]
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 }; [cite: 91]
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => { [cite: 91]
            if (entry.isIntersecting) { [cite: 91]
                entry.target.classList.add('is-visible'); [cite: 91]
                observer.unobserve(entry.target); [cite: 92]
            }
        }); [cite: 92]
    }, observerOptions); [cite: 92]
    sections.forEach(section => sectionObserver.observe(section)); [cite: 92]

    // =====================================
    // 8. Ativar Link da Navegação da Página Atual
    // =====================================
    const highlightActiveNavLink = () => {
        const currentPath = window.location.pathname.split('/').pop(); [cite: 93]
        document.querySelectorAll('.main-nav a').forEach(link => { [cite: 93]
            link.classList.remove('active'); [cite: 93]
            if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'index.html')) { [cite: 93]
                link.classList.add('active'); [cite: 93]
            }
        }); [cite: 94]
    }; [cite: 94]
    highlightActiveNavLink(); [cite: 94]

    // 9. Acordeão (Accordion)
    const accordionHeaders = document.querySelectorAll('.accordion-header'); [cite: 94]
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => { [cite: 94]
            const item = header.parentElement; [cite: 94]
            item.classList.toggle('active'); [cite: 94]
        });
    });

    // 10. Modal (Popup)
    const openModalBtn = document.getElementById('openModalBtn'); [cite: 95]
    const closeModalBtn = document.getElementById('closeModalBtn'); [cite: 95]
    const modal = document.getElementById('myModal'); [cite: 95]

    if (openModalBtn) { [cite: 95]
        openModalBtn.addEventListener('click', () => { [cite: 95]
            modal.classList.add('show'); [cite: 95]
        });
    }

    if (closeModalBtn) { [cite: 95]
        closeModalBtn.addEventListener('click', () => { [cite: 95]
            modal.classList.remove('show'); [cite: 95]
        });
    }

    if (modal) { [cite: 95]
        modal.addEventListener('click', (e) => { [cite: 96]
            if (e.target === modal) { [cite: 96]
                modal.classList.remove('show'); [cite: 97]
            }
        });
    } [cite: 97]

    // 11. Galeria de Imagens & Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item'); [cite: 98]
    const lightboxOverlay = document.getElementById('myLightbox'); [cite: 98]
    const lightboxImage = document.getElementById('lightbox-image'); [cite: 98]

    galleryItems.forEach(item => { [cite: 98]
        item.addEventListener('click', () => { [cite: 98]
            const imageUrl = item.querySelector('img').src; [cite: 98]
            lightboxImage.src = imageUrl; [cite: 98]
            lightboxOverlay.classList.add('show'); [cite: 98]
        });
    }); [cite: 99]

    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => { [cite: 99]
            if (e.target === lightboxOverlay) { [cite: 99]
                lightboxOverlay.classList.remove('show'); [cite: 99]
            }
        }); [cite: 100]
    } [cite: 100]

    // 13. Tabs de Conteúdo
    const tabButtons = document.querySelectorAll('.tab-button'); [cite: 101]
    const tabContents = document.querySelectorAll('.tab-content'); [cite: 101]
    tabButtons.forEach(button => { [cite: 101]
        button.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões e conteúdos
            tabButtons.forEach(btn => btn.classList.remove('active')); [cite: 101]
            tabContents.forEach(content => content.classList.remove('active')); [cite: 102]

            // Adiciona a classe 'active' no botão e conteúdo corretos
            const targetId = button.getAttribute('data-tab-target'); [cite: 102]
            const targetContent = document.querySelector(targetId); [cite: 102]
            button.classList.add('active'); [cite: 102]
            if (targetContent) {
                targetContent.classList.add('active'); [cite: 102]
            }
        });
    }); [cite: 103]

    // 14. Progress Bar
    const progressBars = document.querySelectorAll('.progress-bar-fill'); [cite: 104]
    progressBars.forEach(bar => { [cite: 104]
        const progress = bar.getAttribute('data-progress'); [cite: 104]
        bar.style.width = progress + '%'; [cite: 105]
    }); [cite: 105]

    // 10. Carrossel de Testemunhos
    const carousel = document.querySelector('.testimonial-carousel'); [cite: 105]
    const prevBtn = document.getElementById('prevBtn'); [cite: 106]
    const nextBtn = document.getElementById('nextBtn'); [cite: 106]
    const scrollAmount = carousel ? carousel.offsetWidth + 20 : 0; [cite: 107] // Largura do item + gap

    if (prevBtn) { [cite: 107]
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ [cite: 107]
                left: -scrollAmount, [cite: 108]
                behavior: 'smooth' [cite: 108]
            });
        });
    } [cite: 108]

    if (nextBtn) {
        nextBtn.addEventListener('click', () => { [cite: 108]
            carousel.scrollBy({
                left: scrollAmount, [cite: 109]
                behavior: 'smooth' [cite: 109]
            });
        });
    } [cite: 109]

    // 12. Indicador de Rolagem
    const scrollProgress = document.querySelector('.scroll-progress'); [cite: 110]
    const updateScrollProgress = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop; [cite: 111]
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight; [cite: 111]
        const scrolled = (scrollTop / scrollHeight) * 100; [cite: 112]
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + '%'; [cite: 113]
        }
    }; [cite: 113]
    window.addEventListener('scroll', updateScrollProgress); [cite: 113]

    // 14. Contador de Estatísticas
    const counters = document.querySelectorAll('.counter'); [cite: 114]
    const animateCounters = () => {
        counters.forEach(counter => { [cite: 114]
            const target = +counter.getAttribute('data-target'); [cite: 114]
            const speed = 200; // Ajuste a velocidade da animação [cite: 114]
            let currentCount = 0; [cite: 115]

            const updateCount = () => {
                const increment = target / speed; [cite: 115]
                if (currentCount < target) { [cite: 116]
                    currentCount += increment; [cite: 116]
                    counter.textContent = Math.ceil(currentCount); [cite: 116]
                    requestAnimationFrame(updateCount); [cite: 116]
                } else {
                    counter.textContent = target; [cite: 117]
                }
            };
            updateCount(); [cite: 117]
        });
    }; [cite: 117]
    animateCounters(); [cite: 117]

    // 18. Bloco de Spoiler
    const spoilerToggles = document.querySelectorAll('.spoiler-toggle'); [cite: 118]
    spoilerToggles.forEach(toggle => { [cite: 118]
        toggle.addEventListener('click', () => { [cite: 118]
            toggle.parentElement.classList.toggle('active'); [cite: 118]
        });
    }); [cite: 119]

    // 20. Lista de recursos com animação de marcador
    const animatedList = document.querySelector('.animated-list'); [cite: 120]
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { [cite: 120]
            if (entry.isIntersecting) { [cite: 121]
                entry.target.classList.add('in-view'); [cite: 121]
            }
        }); [cite: 121]
    }, { threshold: 0.5 }); [cite: 121] // A animação dispara quando 50% do elemento está visível

    if (animatedList) { [cite: 122]
        observer.observe(animatedList); [cite: 122]
    } [cite: 122]

    // 20. Aba de Pesquisa de Arquivos Gerais (Recursos)
    // Exemplo de dados dos cards
    const cardData = [
        {
            id: '1',
            thumbnail: 'assets/images/addon1.jpg',
            title: 'Addon de Teleporte',
            description: 'Adiciona novos comandos de teletransporte para o servidor.', [cite: 123]
            rating: 5, [cite: 123]
            tags: ['Addon', 'Arquivos Gerais'], [cite: 123]
            downloadLink: 'https://site-externo-1.com/download' [cite: 123]
        },
        {
            id: '2',
            thumbnail: 'assets/images/mod1.jpg',
            title: 'Mod de Ferramentas Mágicas', [cite: 124]
            description: 'Um mod que adiciona um conjunto de ferramentas com habilidades mágicas.', [cite: 124]
            rating: 4, [cite: 124]
            tags: ['Mod'], [cite: 124]
            downloadLink: 'https://site-externo-2.com/download' [cite: 124]
        },
        {
            id: '3', [cite: 125]
            thumbnail: 'assets/images/skin1.png', [cite: 125]
            title: 'Skin de Cavaleiro', [cite: 125]
            description: 'Uma skin épica de cavaleiro para personalizar seu personagem.', [cite: 125]
            rating: 5, [cite: 125]
            tags: ['Skin'], [cite: 125]
            downloadLink: 'https://site-externo-3.com/download' [cite: 125]
        },
        {
            id: '4', [cite: 126]
            thumbnail: 'assets/images/texturepack1.jpg', [cite: 126]
            title: 'Pacote de Texturas RPG', [cite: 126]
            description: 'Pacote de texturas que transforma o jogo em uma aventura de RPG.', [cite: 126]
            rating: 4, [cite: 126]
            tags: ['Arquivos Gerais'], [cite: 127]
            downloadLink: 'https://site-externo-4.com/download' [cite: 127]
        },
        {
            id: '5', [cite: 127]
            thumbnail: 'assets/images/mod2.jpg', [cite: 127]
            title: 'Mod de Decoração', [cite: 128]
            description: 'Um mod com centenas de novos blocos e itens de decoração.', [cite: 128]
            rating: 5, [cite: 128]
            tags: ['Mod'], [cite: 128]
            downloadLink: 'https://site-externo-5.com/download' [cite: 128]
        },
    ]; [cite: 129]
    const cardGrid = document.getElementById('card-grid'); [cite: 129]
    const searchInput = document.getElementById('search-input'); [cite: 129]
    const filterButtons = document.querySelectorAll('.filter-btn'); [cite: 129]
    const modal = document.getElementById('download-modal'); [cite: 129]
    const modalCloseBtn = document.querySelector('.modal-close-btn'); [cite: 130]

    // Função para renderizar as estrelas de avaliação
    const getStarRating = (rating) => {
        let stars = ''; [cite: 131]
        for (let i = 0; i < 5; i++) { [cite: 131]
            if (i < rating) {
                stars += '★'; [cite: 132]
            } else {
                stars += '☆'; [cite: 133]
            }
        }
        return stars; [cite: 134]
    }; [cite: 134]

    // Função para renderizar todos os cards no HTML
    const renderCards = (cards) => {
        cardGrid.innerHTML = ''; [cite: 135] // Limpa a grade antes de renderizar
        if (cards.length === 0) {
            cardGrid.innerHTML = '<p class="text-center">Nenhum resultado encontrado.</p>'; [cite: 136]
            return; [cite: 136]
        }

        cards.forEach(card => {
            const cardItem = document.createElement('div'); [cite: 136]
            cardItem.classList.add('card-item'); [cite: 137]

            cardItem.innerHTML = `
                <img src="${card.thumbnail}" alt="${card.title}" class="card-thumbnail">
                <div>
                    <h3>${card.title}</h3>
                    <p class="card-description">${card.description}</p>
                </div>
                <div class="card-rating">${getStarRating(card.rating)}</div>
                <button class="card-download-btn" data-id="${card.id}">Baixar</button>
            `; [cite: 137]
            cardGrid.appendChild(cardItem); [cite: 138]
        });
    }; [cite: 139]

    // Função de filtro
    const filterCards = (filter) => {
        searchInput.value = ''; [cite: 140] // Limpa a busca ao filtrar
        let filteredCards = cardData; [cite: 141]
        if (filter !== 'all') {
            filteredCards = cardData.filter(card => card.tags.includes(filter)); [cite: 142]
        }
        renderCards(filteredCards); [cite: 142]
    }; [cite: 143]

    // Evento de clique para os botões de filtro
    filterButtons.forEach(button => { [cite: 143]
        button.addEventListener('click', () => { [cite: 143]
            filterButtons.forEach(btn => btn.classList.remove('active')); [cite: 143]
            button.classList.add('active'); [cite: 144]
            filterCards(button.getAttribute('data-filter')); [cite: 144]
        });
    }); [cite: 144]

    // Evento de busca no input
    searchInput.addEventListener('input', (e) => { [cite: 144]
        const query = e.target.value.toLowerCase(); [cite: 144]
        filterButtons.forEach(btn => btn.classList.remove('active')); [cite: 145]
        const filteredCards = cardData.filter(card =>
            card.title.toLowerCase().includes(query) ||
            card.tags.some(tag => tag.toLowerCase().includes(query))
        ); [cite: 145]
        renderCards(filteredCards); [cite: 145]
    }); [cite: 145]

    // Evento de clique para abrir o modal
    cardGrid.addEventListener('click', (e) => { [cite: 146]
        if (e.target.classList.contains('card-download-btn')) { [cite: 146]
            const cardId = e.target.getAttribute('data-id'); [cite: 146]
            const card = cardData.find(c => c.id === cardId); [cite: 146]

            if (card) {
                document.getElementById('modal-image').src = card.thumbnail; [cite: 146]
                document.getElementById('modal-title').textContent = card.title; [cite: 147]
                document.getElementById('modal-description').textContent = card.description; [cite: 147]
                document.getElementById('modal-download-link').href = card.downloadLink; [cite: 147]

                modal.classList.add('active'); [cite: 147]
            }
        }
    }); [cite: 147]

    // Evento para fechar o modal
    modalCloseBtn.addEventListener('click', () => { [cite: 148]
        modal.classList.remove('active'); [cite: 148]
    }); [cite: 148]

    modal.addEventListener('click', (e) => { [cite: 148]
        if (e.target === modal) {
            modal.classList.remove('active'); [cite: 149]
        }
    }); [cite: 149]

    // Inicializa a grade com todos os cards
    renderCards(cardData); [cite: 149]
});