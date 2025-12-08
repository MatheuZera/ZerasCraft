document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");

    // =====================================
    // Configuração de Áudio
    // =====================================

    // Define o prefixo do caminho absoluto para a pasta de efeitos
    // ATENÇÃO: Corrigido para Caminho Absoluto (usando o placeholder /ZerasCraft/)
    const AUDIO_BASE_PATH = '/ZerasCraft/assets/audios/effects/';

    // Define os caminhos e pre-carrega os sons
    const linkSound = new Audio(AUDIO_BASE_PATH + 'link.mp3');
    const cardSound = new Audio(AUDIO_BASE_PATH + 'card.mp3');
    const buttonSound = new Audio(AUDIO_BASE_PATH + 'button.mp3');
    const selectSound = new Audio(AUDIO_BASE_PATH + 'select.mp3');
    const buttonClickSound = new Audio(AUDIO_BASE_PATH + 'button-click.mp3');

    linkSound.preload = 'auto';
    cardSound.preload = 'auto';
    buttonSound.preload = 'auto';
    selectSound.preload = 'auto';
    buttonClickSound.preload = 'auto';

    /**
     * Toca um som de forma controlada, clonando o áudio para evitar interrupções.
     * @param {HTMLAudioElement} sound - O objeto de áudio a ser tocado.
     */
    function playSound(sound) {
        const clonedSound = sound.cloneNode();
        clonedSound.play().catch(e => console.error("Erro ao tocar o áudio:", e));
    }

    // =====================================
    // Gerenciamento de Eventos de Clique
    // =====================================

    document.addEventListener('click', (event) => {
        const target = event.target.closest('a, button');

        if (!target) {
            return;
        }

        const isNavLink = target.tagName === 'A' && target.href && !target.href.startsWith('#') && !target.href.includes('javascript:');
        const isSpecialButton = target.tagName === 'BUTTON' || (target.tagName === 'A' && target.href.startsWith('#'));

        if (isNavLink) {
            // Toca o som de link para navegação
            event.preventDefault();
            playSound(linkSound);
            setTimeout(() => {
                window.location.href = target.href;
            }, 300);
        } else if (isSpecialButton) {
            // Toca o som de clique para botões e links internos
            playSound(buttonClickSound);
        }
    });

    // =====================================
    // Gerenciamento de Eventos de Hover
    // =====================================

// =====================================
    // Gerenciamento de Eventos de Hover
    // =====================================

    // Seletores para os elementos
    const cardElements = document.querySelectorAll(
        '.service-card, .role-category-card, .access-card, .community-card, .event-card, .security-card, .faq-item, .info-card, .card, .marketplace-item, .wiki-category-card, .article-card, .youtube-card, .server-card, .donation-tier-card, .vote-site-card, .team-member-card, .news-featured-card, .news-article-card, .job-opening-card, .forum-post-card, .comment-card, .stat-item, .parallax-card, .card-container, .result-card, .card-compact, .container-cards-grandes, .content-card, .cards-container'
    );

    const buttonElements = document.querySelectorAll(
        'button, .btn, .btn-primary, .btn-destaque, .btn-push-down, .liquid-btn, .tag-btn, .btn-top, .btn-download, .item-link, .gallery-image, .container-cards-grandes, .card-button, .pricing-features'
    );

    const textLinkElements = document.querySelectorAll(
        'p a, span a, li a'
    );

    // Adiciona os event listeners
    cardElements.forEach(element => {
        element.addEventListener('mouseenter', () => playSound(cardSound));
    });

    buttonElements.forEach(element => {
        element.addEventListener('mouseenter', () => playSound(buttonSound));
    });

    textLinkElements.forEach(element => {
        element.addEventListener('mouseenter', () => playSound(selectSound));
    });

    // ==================================================================================================================================================
    // 1. Menu Hambúrguer (Otimizado para mais páginas)
    // ==================================================================================================================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    const menuIcon = menuToggle.querySelector('i');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');

            if (nav.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    }

    // ===================================================================
    // 2. Funcionalidade de Copiar Texto
    // ===================================================================
    // Esta função foi atualizada para incluir a lógica para o IP/Porta do servidor
    const copyButtons = document.querySelectorAll('.copy-button'); // Certifique-se de que seus botões de cópia têm esta classe
    if (copyButtons.length > 0) {
        copyButtons.forEach(button => {
            button.addEventListener('click', async () => {
                let textToCopy = '';
                let targetElementSelector = button.dataset.copyTarget; // Ex: '#serverIp, #serverPort'
                let originalButtonText = button.textContent;

                if (targetElementSelector) {
                    const selectors = targetElementSelector.split(',').map(s => s.trim());
                    let partsToCopy = [];
                    for (const selector of selectors) {
                        const targetElement = document.querySelector(selector);
                        if (targetElement) {
                            partsToCopy.push(targetElement.textContent.trim());
                        }
                    }
                    if (selectors.includes('#serverIp') && selectors.includes('#serverPort') && partsToCopy.length === 2) {
                        textToCopy = `${partsToCopy[0]}:${partsToCopy[1]}`;
                    } else {
                        textToCopy = partsToCopy.join(' '); // Junta com espaço se for outro tipo de múltiplos elementos
                    }
                } else if (button.dataset.copyText) {
                    textToCopy = button.dataset.copyText;
                }

                if (textToCopy) {
                    try {
                        // Usa a API Clipboard mais moderna se disponível, com fallback para execCommand
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(textToCopy);
                        } else {
                            const textArea = document.createElement("textarea");
                            textArea.value = textToCopy;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                        }

                        showCentralMessage(`[📃] (${textToCopy})  copiado!`);
                        button.textContent = 'Copiado!';
                        button.classList.add('copied');
                        setTimeout(() => {
                            button.textContent = originalButtonText;
                            button.classList.remove('copied');
                        }, 2000);
                    } catch (err) {
                        console.error('Erro ao copiar: ', err);
                        showCentralMessage('[❗] Falha ao copiar.');
                    }
                } else {
                    showCentralMessage('[📌] Nada para copiar.');
                }
                playEffectSound(clickSound);
            });
        });
    }

    // ===================================================================
    // 3. Animações de Rolagem com ScrollReveal
    // ===================================================================
    // Adicionado um pequeno atraso para o ScrollReveal carregar e evitar piscar
    setTimeout(() => {
        if (typeof ScrollReveal !== 'undefined') {
            ScrollReveal().reveal('.reveal', {
                delay: 200,
                distance: '50px',
                origin: 'bottom',
                interval: 100,
                mobile: true // Habilitado em mobile agora para melhor UX
            });
            ScrollReveal().reveal('.reveal-left', {
                delay: 200,
                distance: '50px',
                origin: 'left',
                mobile: true
            });
            ScrollReveal().reveal('.reveal-right', {
                delay: 200,
                distance: '50px',
                origin: 'right',
                mobile: true
            });
            ScrollReveal().reveal('.reveal-up', {
                delay: 200,
                distance: '50px',
                origin: 'top',
                mobile: true
            });
        } else {
            console.warn("ScrollReveal não está definido. Verifique se o script foi incluído corretamente.");
        }
    }, 500); // Atraso de 500ms

    // ===================================================================
    // 4. Botão Voltar ao Topo
    // ===================================================================

    // Botão Voltar ao Topo
    const scrollTopButton = document.getElementById('scrollTopButton');
    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                scrollTopButton.classList.add('show');
            } else {
                scrollTopButton.classList.remove('show');
            }
        });

        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            playEffectSound(clickSound);
        });
    }

    // ===================================================================
    // 5. Atualizar ano no Rodapé
    // ===================================================================
    // Atualização do Ano no Rodapé
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

});