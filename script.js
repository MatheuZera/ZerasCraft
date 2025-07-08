// script.js - Lógica de interatividade para o site Mundo Zera's Craft

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");

    // ... (Mantenha todas as suas variáveis globais e inicialização de áudio como estão) ...
    let hoverSound;
    let clickSound;
    const backgroundAudio = document.getElementById('backgroundAudio');
    let preparingNextMusic = false;
    const audioEffects = {};

    const initializeAudioEffect = (name, path) => { /* ... seu código ... */ };
    hoverSound = initializeAudioEffect('select', 'audios/effects/select.mp3');
    clickSound = initializeAudioEffect('click', 'audios/effects/click.mp3');
    const playEffectSound = (audioElement) => { /* ... seu código ... */ };
    const playEffectSoundInternal = (audioElement) => { /* ... seu código ... */ };
    function showCentralMessage(message) { /* ... seu código ... */ }


    // =====================================
    // 1. Menu Hambúrguer para Responsividade
    // =====================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            playEffectSound(clickSound); // Clicar no menu hambúrguer
        });

        document.querySelectorAll('.nav-menu a').forEach(item => {
            item.addEventListener('click', (event) => { // Adicione 'event' aqui
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                playEffectSound(clickSound); // Clicar em um item do menu

                // Se você quer que os links do menu também sumam, adicione aqui
                // Mas geralmente não se quer isso para links de navegação
                // handleButtonClickAnimation(event.currentTarget);
            });
        });
    } else {
        console.warn("Elementos do menu hambúrguer não encontrados. Verifique as classes 'menu-toggle' e 'nav-menu'.");
    }

    // =====================================
    // Nova Função para Lidar com a Animação de Botões Pós-Execução
    // =====================================
    // Esta função será chamada depois que a ação principal do botão for (ou estiver prestes a ser) executada.
    const handleButtonClickAnimation = (buttonElement, delayBeforeAnimate = 0) => {
        // playEffectSound(clickSound); // Se você não tiver um som de clique já associado ao botão.
                                    // Neste caso, você já tem nos listeners.

        setTimeout(() => {
            // Adiciona a classe de animação para iniciar a transição
            buttonElement.classList.add('btn-animating-out');
            // Ou use 'btn-animating-down' se preferir

            // Define um tempo limite para remover o botão do DOM após a animação
            // A duração deve corresponder à duração da transição CSS (0.5s = 500ms)
            const animationDuration = 500; // Corresponde à transição em CSS

            setTimeout(() => {
                // Remove o botão do DOM ou apenas o esconde
                // buttonElement.remove(); // Remove completamente o elemento
                buttonElement.style.display = 'none'; // Apenas esconde o elemento
                console.log("Botão animado e escondido/removido.");
            }, animationDuration);
        }, delayBeforeAnimate);
    };


    // =====================================
    // 2. Funcionalidade de Copiar Texto
    // =====================================
    const copyButtons = document.querySelectorAll('.copy-button');

    if (copyButtons.length > 0) {
        copyButtons.forEach(button => {
            button.addEventListener('click', async (event) => { // Adicione 'event'
                playEffectSound(clickSound); // Som de clique ao copiar

                let textToCopy = '';
                let targetElementSelector = button.dataset.copyTarget;
                let originalButtonText = button.textContent;

                // ... (Seu código existente para determinar textToCopy) ...
                if (targetElementSelector) {
                    const parentContext = button.closest('.access-info') || document;
                    const selectors = targetElementSelector.split(',').map(s => s.trim());
                    let partsToCopy = [];

                    for (const selector of selectors) {
                        const targetElement = parentContext.querySelector(selector);
                        if (targetElement) {
                            partsToCopy.push(targetElement.textContent.trim());
                        } else {
                            console.warn(`[Copiar] Elemento alvo '${selector}' não encontrado no contexto.`, parentContext);
                        }
                    }
                    if (selectors.includes('#serverIp') && selectors.includes('#serverPort') && partsToCopy.length === 2) {
                        textToCopy = `${partsToCopy[0]}:${partsToCopy[1]}`;
                    } else {
                        textToCopy = partsToCopy.join('');
                    }

                } else if (button.dataset.copyText) {
                    textToCopy = button.dataset.copyText;
                } else {
                    const accessCard = button.closest('.access-card');
                    if (accessCard) {
                        const ipElement = accessCard.querySelector('.ip');
                        const portElement = accessCard.querySelector('.port');
                        if (ipElement) {
                            textToCopy += ipElement.textContent.trim();
                        }
                        if (portElement) {
                            if (textToCopy) textToCopy += ':';
                            textToCopy += portElement.textContent.trim();
                        }
                    } else {
                        console.warn("Botão de cópia encontrado sem 'data-copy-target' ou 'data-copy-text', e não em um contexto .access-card/.access-info para fallback.");
                    }
                }

                if (textToCopy) {
                    try {
                        await navigator.clipboard.writeText(textToCopy);
                        console.log('Texto copiado: ' + textToCopy);
                        showCentralMessage(`'${textToCopy}' copiado!`);

                        // ANIMAÇÃO DE ESTADO DO BOTÃO DE CÓPIA (JÁ EXISTENTE)
                        button.textContent = 'Copiado!';
                        button.classList.add('copied');

                        setTimeout(() => {
                            button.textContent = originalButtonText;
                            button.classList.remove('copied');
                            // Se você quiser que o botão de cópia desapareça após a cópia e o feedback "Copiado!",
                            // chame handleButtonClickAnimation aqui, talvez com um pequeno delay.
                            // handleButtonClickAnimation(button, 500); // Exemplo: 0.5s após o texto voltar ao normal.
                        }, 2000);

                    } catch (err) {
                        console.error('Erro ao copiar: ', err);
                        showCentralMessage('Falha ao copiar.');
                    }
                } else {
                    console.warn("Nenhum texto válido para copiar encontrado.");
                    showCentralMessage('Nada para copiar.');
                }
            });
        });
    } else {
        console.warn("Nenhum botão de cópia encontrado. Verifique a classe 'copy-button'.");
    }

    // ... (Mantenha o resto do seu código de áudio de fundo, etc. como está) ...

    // =====================================
    // 3. Sistema de Áudio de Fundo - Com Reprodução Aleatória
    // =====================================
    const audioControlButton = document.getElementById('audioControlButton');
    const musicTitleDisplay = document.getElementById('musicTitleDisplay');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const arcProgress = audioProgressArc ? audioProgressArc.querySelector('.arc-progress') : null;

    const musicPlaylist = [ /* ... suas músicas ... */ ];
    let currentMusicIndex = -1;

    const updateAudioButtonTitle = () => { /* ... seu código ... */ };
    const getRandomMusicIndex = () => { /* ... seu código ... */ };
    const loadRandomMusic = (playImmediately = false) => { /* ... seu código ... */ };
    const updateProgressArc = () => { /* ... seu código ... */ };

    if (backgroundAudio && audioControlButton && musicTitleDisplay) {
        loadRandomMusic(); // Initial load, but won't auto-play without user interaction

        backgroundAudio.addEventListener('loadedmetadata', () => { /* ... seu código ... */ });
        backgroundAudio.addEventListener('timeupdate', updateProgressArc);
        backgroundAudio.addEventListener('ended', () => { /* ... seu código ... */ });

        audioControlButton.addEventListener('click', () => {
            playEffectSound(clickSound); // Clicar no botão de áudio

            if (backgroundAudio.paused) {
                preparingNextMusic = false;
                loadRandomMusic(true);
                localStorage.setItem('userInteractedWithAudio', 'true');
            } else {
                backgroundAudio.pause();
                audioControlButton.classList.remove('is-playing');
                showCentralMessage('Música pausada.');
                preparingNextMusic = false;
                updateAudioButtonTitle();
            }
        });

        const tryAutoPlay = () => { /* ... seu código ... */ };
        const handleInitialAudioPlay = () => { /* ... seu código ... */ };

        tryAutoPlay();
        setTimeout(updateProgressArc, 100);
        updateAudioButtonTitle();
    } else {
        console.warn("Elementos de áudio de fundo não encontrados. Verifique os IDs 'backgroundAudio', 'audioControlButton', 'musicTitleDisplay' e 'audioProgressArc'.");
    }

    // =====================================
    // 4. Sistema de Sons para Interações
    // =====================================
    document.querySelectorAll('.access-card, .info-card, .service-card, .community-card, .event-card, .partnership-card, .security-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            console.log("[Efeitos Sonoros] Mouse entrou no card. Tentando tocar hover sound.");
            playEffectSound(hoverSound);
        });
    });

    // Melhora: Usa um seletor mais específico para links que não são botões de menu (já tratados)
    document.querySelectorAll('a:not(.menu-toggle):not(.nav-menu a), .btn-primary, .btn-link').forEach(element => { // Incluí .btn-primary e .btn-link aqui
        element.addEventListener('click', (event) => {
            console.log("[Efeitos Sonoros] Link/Botão clicado. Tentando tocar click sound.");
            playEffectSound(clickSound); // Toca o som de clique

            // VERIFICA SE É UM BOTÃO DE NAVEGAÇÃO OU DE AÇÃO
            // Se for um link de navegação para outra página, não queremos que ele "desapareça" imediatamente,
            // a menos que você queira um fade-out da página toda.
            // Para botões de ação que executam algo na mesma página, a animação é mais apropriada.

            // Exemplo: Se for um link <a> que leva para outra página, e você quer um delay antes da navegação
            if (element.tagName === 'A' && element.href && element.href !== '#' && !element.classList.contains('no-animation')) {
                event.preventDefault(); // Previne a navegação imediata
                handleButtonClickAnimation(element); // Inicia a animação

                // Redireciona após a animação
                setTimeout(() => {
                    window.location.href = element.href;
                }, 500); // Deve ser igual ou um pouco mais que a duration da animação CSS
            }
            // Se for um <button> ou um link que não navega para outra página (ex: abre um modal)
            else if (element.tagName === 'BUTTON' || element.classList.contains('btn-primary') || element.classList.contains('btn-link')) {
                // Excluir os botões de cópia se você já tem uma lógica específica para eles
                if (!element.classList.contains('copy-button')) {
                    // Para botões que executam uma ação e depois podem "sumir"
                    // Chame a animação APÓS a ação principal do botão for realizada.
                    // Se a ação principal do botão leva tempo (ex: chamada de API),
                    // você pode chamar handleButtonClickAnimation dentro do callback da API.
                    // Por exemplo, se um botão "Excluir Item" remove um item do DOM e o botão não é mais necessário:
                    // handleButtonClickAnimation(element);
                    // No seu caso, se os botões são apenas para "informação" (Nada para ver aqui!)
                    // e você quer que eles desapareçam após o clique:
                    // handleButtonClickAnimation(element);
                    // No entanto, para botões como "MAIS DETALHES", "Sobre o Terreno", "Sobre o Campeonato",
                    // eles provavelmente levam a outras seções ou abrem modais, e não deveriam desaparecer.
                    // Pense bem quais botões devem desaparecer.
                    // Para os "Nada para ver aqui!" que não têm efeito real, você pode aplicar:
                    if (element.textContent.includes('Nada para ver aqui!')) {
                         handleButtonClickAnimation(element);
                    }
                }
            }
        });
    });

    // REMOVA OU AJUSTE ESTE BLOCO SE AS REGRAS ACIMA JÁ COBREM TUDO.
    // Atualmente, o seletor `a:not(.menu-toggle):not(.nav-menu a), .btn-primary, .btn-link` já inclui
    // os botões e links que você quer que tenham o som de clique.
    // Se você quer que QUALQUER botão (não apenas os com classe de botão específica)
    // toque o som de clique e potencialmente anime, mantenha este bloco
    // E ajuste o `handleButtonClickAnimation` seletivamente.
    // document.querySelectorAll('button:not(.copy-button):not(#audioControlButton), input[type="button"], input[type="submit"]').forEach(button => {
    //     button.addEventListener('click', (event) => {
    //         console.log("[Efeitos Sonoros] Botão clicado. Tentando tocar click sound.");
    //         playEffectSound(clickSound);
    //         // Se este botão específico deve desaparecer, adicione:
    //         // handleButtonClickAnimation(button);
    //     });
    // });


    // =====================================
    // 5. Botão "Voltar ao Topo"
    // =====================================
    const scrollTopButton = document.getElementById('scrollTopButton');

    if (scrollTopButton) {
        window.addEventListener('scroll', () => { /* ... seu código ... */ });
        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            playEffectSound(clickSound); // Clique no botão voltar ao topo
            // Geralmente, o botão de voltar ao topo não desaparece.
            // handleButtonClickAnimation(scrollTopButton); // Descomente se quiser que ele suma.
        });
    } else {
        console.warn("Botão 'Voltar ao Topo' não encontrado. Verifique o ID 'scrollTopButton'.");
    }

    // =====================================
    // 6. Atualizar Ano Atual no Rodapé
    // =====================================
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("Elemento para o ano atual não encontrado. Verifique o ID 'currentYear'.");
    }

    // =====================================
    // 7. Efeitos de Rolagem para Elementos
    // =====================================
    const sections = document.querySelectorAll('.fade-in-section');
    const observerOptions = { /* ... seu código ... */ };
    const sectionObserver = new IntersectionObserver((entries, observer) => { /* ... seu código ... */ }, observerOptions);
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});// script.js - Lógica de interatividade para o site Mundo Zera's Craft

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");

    // ... (Mantenha todas as suas variáveis globais e inicialização de áudio como estão) ...
    let hoverSound;
    let clickSound;
    const backgroundAudio = document.getElementById('backgroundAudio');
    let preparingNextMusic = false;
    const audioEffects = {};

    const initializeAudioEffect = (name, path) => { /* ... seu código ... */ };
    hoverSound = initializeAudioEffect('select', 'audios/effects/select.mp3');
    clickSound = initializeAudioEffect('click', 'audios/effects/click.mp3');
    const playEffectSound = (audioElement) => { /* ... seu código ... */ };
    const playEffectSoundInternal = (audioElement) => { /* ... seu código ... */ };
    function showCentralMessage(message) { /* ... seu código ... */ }


    // =====================================
    // 1. Menu Hambúrguer para Responsividade
    // =====================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            playEffectSound(clickSound); // Clicar no menu hambúrguer
        });

        document.querySelectorAll('.nav-menu a').forEach(item => {
            item.addEventListener('click', (event) => { // Adicione 'event' aqui
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                playEffectSound(clickSound); // Clicar em um item do menu

                // Se você quer que os links do menu também sumam, adicione aqui
                // Mas geralmente não se quer isso para links de navegação
                // handleButtonClickAnimation(event.currentTarget);
            });
        });
    } else {
        console.warn("Elementos do menu hambúrguer não encontrados. Verifique as classes 'menu-toggle' e 'nav-menu'.");
    }

    // =====================================
    // Nova Função para Lidar com a Animação de Botões Pós-Execução
    // =====================================
    // Esta função será chamada depois que a ação principal do botão for (ou estiver prestes a ser) executada.
    const handleButtonClickAnimation = (buttonElement, delayBeforeAnimate = 0) => {
        // playEffectSound(clickSound); // Se você não tiver um som de clique já associado ao botão.
                                    // Neste caso, você já tem nos listeners.

        setTimeout(() => {
            // Adiciona a classe de animação para iniciar a transição
            buttonElement.classList.add('btn-animating-out');
            // Ou use 'btn-animating-down' se preferir

            // Define um tempo limite para remover o botão do DOM após a animação
            // A duração deve corresponder à duração da transição CSS (0.5s = 500ms)
            const animationDuration = 500; // Corresponde à transição em CSS

            setTimeout(() => {
                // Remove o botão do DOM ou apenas o esconde
                // buttonElement.remove(); // Remove completamente o elemento
                buttonElement.style.display = 'none'; // Apenas esconde o elemento
                console.log("Botão animado e escondido/removido.");
            }, animationDuration);
        }, delayBeforeAnimate);
    };


    // =====================================
    // 2. Funcionalidade de Copiar Texto
    // =====================================
    const copyButtons = document.querySelectorAll('.copy-button');

    if (copyButtons.length > 0) {
        copyButtons.forEach(button => {
            button.addEventListener('click', async (event) => { // Adicione 'event'
                playEffectSound(clickSound); // Som de clique ao copiar

                let textToCopy = '';
                let targetElementSelector = button.dataset.copyTarget;
                let originalButtonText = button.textContent;

                // ... (Seu código existente para determinar textToCopy) ...
                if (targetElementSelector) {
                    const parentContext = button.closest('.access-info') || document;
                    const selectors = targetElementSelector.split(',').map(s => s.trim());
                    let partsToCopy = [];

                    for (const selector of selectors) {
                        const targetElement = parentContext.querySelector(selector);
                        if (targetElement) {
                            partsToCopy.push(targetElement.textContent.trim());
                        } else {
                            console.warn(`[Copiar] Elemento alvo '${selector}' não encontrado no contexto.`, parentContext);
                        }
                    }
                    if (selectors.includes('#serverIp') && selectors.includes('#serverPort') && partsToCopy.length === 2) {
                        textToCopy = `${partsToCopy[0]}:${partsToCopy[1]}`;
                    } else {
                        textToCopy = partsToCopy.join('');
                    }

                } else if (button.dataset.copyText) {
                    textToCopy = button.dataset.copyText;
                } else {
                    const accessCard = button.closest('.access-card');
                    if (accessCard) {
                        const ipElement = accessCard.querySelector('.ip');
                        const portElement = accessCard.querySelector('.port');
                        if (ipElement) {
                            textToCopy += ipElement.textContent.trim();
                        }
                        if (portElement) {
                            if (textToCopy) textToCopy += ':';
                            textToCopy += portElement.textContent.trim();
                        }
                    } else {
                        console.warn("Botão de cópia encontrado sem 'data-copy-target' ou 'data-copy-text', e não em um contexto .access-card/.access-info para fallback.");
                    }
                }

                if (textToCopy) {
                    try {
                        await navigator.clipboard.writeText(textToCopy);
                        console.log('Texto copiado: ' + textToCopy);
                        showCentralMessage(`'${textToCopy}' copiado!`);

                        // ANIMAÇÃO DE ESTADO DO BOTÃO DE CÓPIA (JÁ EXISTENTE)
                        button.textContent = 'Copiado!';
                        button.classList.add('copied');

                        setTimeout(() => {
                            button.textContent = originalButtonText;
                            button.classList.remove('copied');
                            // Se você quiser que o botão de cópia desapareça após a cópia e o feedback "Copiado!",
                            // chame handleButtonClickAnimation aqui, talvez com um pequeno delay.
                            // handleButtonClickAnimation(button, 500); // Exemplo: 0.5s após o texto voltar ao normal.
                        }, 2000);

                    } catch (err) {
                        console.error('Erro ao copiar: ', err);
                        showCentralMessage('Falha ao copiar.');
                    }
                } else {
                    console.warn("Nenhum texto válido para copiar encontrado.");
                    showCentralMessage('Nada para copiar.');
                }
            });
        });
    } else {
        console.warn("Nenhum botão de cópia encontrado. Verifique a classe 'copy-button'.");
    }

    // ... (Mantenha o resto do seu código de áudio de fundo, etc. como está) ...

    // =====================================
    // 3. Sistema de Áudio de Fundo - Com Reprodução Aleatória
    // =====================================
    const audioControlButton = document.getElementById('audioControlButton');
    const musicTitleDisplay = document.getElementById('musicTitleDisplay');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const arcProgress = audioProgressArc ? audioProgressArc.querySelector('.arc-progress') : null;

    const musicPlaylist = [ /* ... suas músicas ... */ ];
    let currentMusicIndex = -1;

    const updateAudioButtonTitle = () => { /* ... seu código ... */ };
    const getRandomMusicIndex = () => { /* ... seu código ... */ };
    const loadRandomMusic = (playImmediately = false) => { /* ... seu código ... */ };
    const updateProgressArc = () => { /* ... seu código ... */ };

    if (backgroundAudio && audioControlButton && musicTitleDisplay) {
        loadRandomMusic(); // Initial load, but won't auto-play without user interaction

        backgroundAudio.addEventListener('loadedmetadata', () => { /* ... seu código ... */ });
        backgroundAudio.addEventListener('timeupdate', updateProgressArc);
        backgroundAudio.addEventListener('ended', () => { /* ... seu código ... */ });

        audioControlButton.addEventListener('click', () => {
            playEffectSound(clickSound); // Clicar no botão de áudio

            if (backgroundAudio.paused) {
                preparingNextMusic = false;
                loadRandomMusic(true);
                localStorage.setItem('userInteractedWithAudio', 'true');
            } else {
                backgroundAudio.pause();
                audioControlButton.classList.remove('is-playing');
                showCentralMessage('Música pausada.');
                preparingNextMusic = false;
                updateAudioButtonTitle();
            }
        });

        const tryAutoPlay = () => { /* ... seu código ... */ };
        const handleInitialAudioPlay = () => { /* ... seu código ... */ };

        tryAutoPlay();
        setTimeout(updateProgressArc, 100);
        updateAudioButtonTitle();
    } else {
        console.warn("Elementos de áudio de fundo não encontrados. Verifique os IDs 'backgroundAudio', 'audioControlButton', 'musicTitleDisplay' e 'audioProgressArc'.");
    }

    // =====================================
    // 4. Sistema de Sons para Interações
    // =====================================
    document.querySelectorAll('.access-card, .info-card, .service-card, .community-card, .event-card, .partnership-card, .security-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            console.log("[Efeitos Sonoros] Mouse entrou no card. Tentando tocar hover sound.");
            playEffectSound(hoverSound);
        });
    });

    // Melhora: Usa um seletor mais específico para links que não são botões de menu (já tratados)
    document.querySelectorAll('a:not(.menu-toggle):not(.nav-menu a), .btn-primary, .btn-link').forEach(element => { // Incluí .btn-primary e .btn-link aqui
        element.addEventListener('click', (event) => {
            console.log("[Efeitos Sonoros] Link/Botão clicado. Tentando tocar click sound.");
            playEffectSound(clickSound); // Toca o som de clique

            // VERIFICA SE É UM BOTÃO DE NAVEGAÇÃO OU DE AÇÃO
            // Se for um link de navegação para outra página, não queremos que ele "desapareça" imediatamente,
            // a menos que você queira um fade-out da página toda.
            // Para botões de ação que executam algo na mesma página, a animação é mais apropriada.

            // Exemplo: Se for um link <a> que leva para outra página, e você quer um delay antes da navegação
            if (element.tagName === 'A' && element.href && element.href !== '#' && !element.classList.contains('no-animation')) {
                event.preventDefault(); // Previne a navegação imediata
                handleButtonClickAnimation(element); // Inicia a animação

                // Redireciona após a animação
                setTimeout(() => {
                    window.location.href = element.href;
                }, 500); // Deve ser igual ou um pouco mais que a duration da animação CSS
            }
            // Se for um <button> ou um link que não navega para outra página (ex: abre um modal)
            else if (element.tagName === 'BUTTON' || element.classList.contains('btn-primary') || element.classList.contains('btn-link')) {
                // Excluir os botões de cópia se você já tem uma lógica específica para eles
                if (!element.classList.contains('copy-button')) {
                    // Para botões que executam uma ação e depois podem "sumir"
                    // Chame a animação APÓS a ação principal do botão for realizada.
                    // Se a ação principal do botão leva tempo (ex: chamada de API),
                    // você pode chamar handleButtonClickAnimation dentro do callback da API.
                    // Por exemplo, se um botão "Excluir Item" remove um item do DOM e o botão não é mais necessário:
                    // handleButtonClickAnimation(element);
                    // No seu caso, se os botões são apenas para "informação" (Nada para ver aqui!)
                    // e você quer que eles desapareçam após o clique:
                    // handleButtonClickAnimation(element);
                    // No entanto, para botões como "MAIS DETALHES", "Sobre o Terreno", "Sobre o Campeonato",
                    // eles provavelmente levam a outras seções ou abrem modais, e não deveriam desaparecer.
                    // Pense bem quais botões devem desaparecer.
                    // Para os "Nada para ver aqui!" que não têm efeito real, você pode aplicar:
                    if (element.textContent.includes('Nada para ver aqui!')) {
                         handleButtonClickAnimation(element);
                    }
                }
            }
        });
    });

    // REMOVA OU AJUSTE ESTE BLOCO SE AS REGRAS ACIMA JÁ COBREM TUDO.
    // Atualmente, o seletor `a:not(.menu-toggle):not(.nav-menu a), .btn-primary, .btn-link` já inclui
    // os botões e links que você quer que tenham o som de clique.
    // Se você quer que QUALQUER botão (não apenas os com classe de botão específica)
    // toque o som de clique e potencialmente anime, mantenha este bloco
    // E ajuste o `handleButtonClickAnimation` seletivamente.
    // document.querySelectorAll('button:not(.copy-button):not(#audioControlButton), input[type="button"], input[type="submit"]').forEach(button => {
    //     button.addEventListener('click', (event) => {
    //         console.log("[Efeitos Sonoros] Botão clicado. Tentando tocar click sound.");
    //         playEffectSound(clickSound);
    //         // Se este botão específico deve desaparecer, adicione:
    //         // handleButtonClickAnimation(button);
    //     });
    // });


    // =====================================
    // 5. Botão "Voltar ao Topo"
    // =====================================
    const scrollTopButton = document.getElementById('scrollTopButton');

    if (scrollTopButton) {
        window.addEventListener('scroll', () => { /* ... seu código ... */ });
        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            playEffectSound(clickSound); // Clique no botão voltar ao topo
            // Geralmente, o botão de voltar ao topo não desaparece.
            // handleButtonClickAnimation(scrollTopButton); // Descomente se quiser que ele suma.
        });
    } else {
        console.warn("Botão 'Voltar ao Topo' não encontrado. Verifique o ID 'scrollTopButton'.");
    }

    // =====================================
    // 6. Atualizar Ano Atual no Rodapé
    // =====================================
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("Elemento para o ano atual não encontrado. Verifique o ID 'currentYear'.");
    }

    // =====================================
    // 7. Efeitos de Rolagem para Elementos
    // =====================================
    const sections = document.querySelectorAll('.fade-in-section');
    const observerOptions = { /* ... seu código ... */ };
    const sectionObserver = new IntersectionObserver((entries, observer) => { /* ... seu código ... */ }, observerOptions);
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});