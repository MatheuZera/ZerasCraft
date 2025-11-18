document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e pronto!");

    // =================================================================== -->
    // CÓDIGO DO SISTEMA DE MÚSICA ÚNICA E INVISÍVEL(NOVO)-- >
    // Este script inicia a música na primeira interação do usuário. -- >
    // =================================================================== -->
    document.addEventListener('DOMContentLoaded', () => {
        console.log("Sistema de Áudio de Fundo Invisível carregado.");

        const backgroundAudio = document.getElementById('backgroundAudio');
        let audioStarted = false;

        // Define o volume inicial da música (50% é um bom padrão para fundo)
        if (backgroundAudio) {
            // Tenta carregar o último volume, se não, usa 0.5
            const storedVolume = localStorage.getItem('audioBackgroundVolume');
            backgroundAudio.volume = storedVolume !== null ? parseFloat(storedVolume) : 0.5;
        }

        // Função que tenta iniciar a reprodução do áudio
        const startAudio = () => {
            if (!backgroundAudio || audioStarted) return;

            // Tenta iniciar a reprodução (necessita de interação do usuário)
            backgroundAudio.play()
                .then(() => {
                    console.log("Música de fundo iniciada com sucesso.");
                    audioStarted = true;
                    // Remove os listeners de eventos após o início bem-sucedido
                    document.body.removeEventListener('click', startAudio);
                    document.body.removeEventListener('touchstart', startAudio);
                })
                .catch(error => {
                    // Se houver erro (bloqueio do navegador), o listener continua ativo
                    console.log("Aguardando interação do usuário para iniciar o áudio...");
                });
        };

        // Adiciona listeners para os eventos de interação do usuário mais comuns
        // A música será iniciada no primeiro evento que ocorrer (clique ou toque).
        document.body.addEventListener('click', startAudio);
        document.body.addEventListener('touchstart', startAudio);

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
});