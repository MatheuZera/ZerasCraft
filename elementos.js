document.addEventListener('DOMContentLoaded', () => {

    // =====================================
    // Lightbox para Galeria de Imagens
    // =====================================
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    const lightboxImage = document.querySelector('.lightbox-imagem');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (galleryItems.length > 0 && lightboxOverlay && lightboxImage && lightboxClose) {
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const largeImageSrc = item.dataset.image;
                if (largeImageSrc) {
                    lightboxImage.src = largeImageSrc;
                    lightboxOverlay.style.display = 'flex';
                }
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightboxOverlay.style.display = 'none';
        });

        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                lightboxOverlay.style.display = 'none';
            }
        });
    }

    // =====================================
    // Funcionalidade de Acordeão
    // =====================================
    const acordeaoBotoes = document.querySelectorAll('.acordeao-btn');
    acordeaoBotoes.forEach(button => {
        button.addEventListener('click', () => {
            const painel = button.nextElementSibling;
            button.classList.toggle('active');
            if (painel.style.maxHeight) {
                painel.style.maxHeight = null;
            } else {
                painel.style.maxHeight = painel.scrollHeight + "px";
            }
        });
    });

    // =====================================
    // Animação da Barra de Progresso
    // =====================================
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const progressValue = progressBar.dataset.progress;
        progressBar.style.width = `${progressValue}%`;
    }

    // =====================================
    // Funcionalidade de Modal
    // =====================================
    const btnModalOpen = document.querySelector('.btn-modal-open');
    const modalBg = document.querySelector('.modal-bg');
    const modalClose = document.querySelector('.modal-close');
    if (btnModalOpen && modalBg && modalClose) {
        btnModalOpen.addEventListener('click', () => {
            modalBg.style.display = 'flex';
        });
        modalClose.addEventListener('click', () => {
            modalBg.style.display = 'none';
        });
        window.addEventListener('click', (e) => {
            if (e.target === modalBg) {
                modalBg.style.display = 'none';
            }
        });
    }

    // =====================================
    // Funcionalidade de Abas
    // =====================================
    const abaBotoes = document.querySelectorAll('.aba-btn');
    const abaPaineis = document.querySelectorAll('.aba-painel');
    abaBotoes.forEach(btn => {
        btn.addEventListener('click', () => {
            abaBotoes.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            abaPaineis.forEach(p => p.classList.remove('active'));
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // =====================================
    // Funcionalidade de Carrossel
    // =====================================
    const carrosselContainer = document.querySelector('.carrossel-container');
    const carrosselSlider = document.querySelector('.carrossel-slider');
    const carrosselPrev = document.querySelector('.carrossel-prev');
    const carrosselNext = document.querySelector('.carrossel-next');
    if (carrosselContainer && carrosselSlider && carrosselPrev && carrosselNext) {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carrossel-slider img');
        const totalSlides = slides.length;

        carrosselNext.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            carrosselSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
        });

        carrosselPrev.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            carrosselSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
        });
    }

    // =====================================
    // Botão de Rolar para o Topo
    // =====================================
    const btnScrollTop = document.querySelector('.btn-scroll-top');
    if (btnScrollTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btnScrollTop.style.display = 'flex';
            } else {
                btnScrollTop.style.display = 'none';
            }
        });
        btnScrollTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =====================================
    // Compartilhamento Social
    // =====================================
    const btnShare = document.querySelector('.btn-share');
    const shareIcons = document.querySelector('.share-icons');
    if (btnShare && shareIcons) {
        btnShare.addEventListener('click', () => {
            shareIcons.classList.toggle('active');
        });
    }

    // =====================================
    // Contadores de Número
    // =====================================
    const contadores = document.querySelectorAll('.contador-numero');
    const animarContadores = () => {
        contadores.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const speed = 200;
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
    animarContadores();

    // =====================================
    // Modal com Fundo Borrado
    // =====================================
    const btnModalBlur = document.querySelector('.btn-modal-blur');
    const modalBlurBg = document.querySelector('.modal-blur-bg');
    const modalBlurClose = document.querySelector('.modal-blur-close');
    const modalBlurEntendido = document.querySelector('.modal-blur-content .btn-destaque');
    if (btnModalBlur && modalBlurBg && modalBlurClose && modalBlurEntendido) {
        btnModalBlur.addEventListener('click', () => {
            modalBlurBg.style.display = 'flex';
        });
        modalBlurClose.addEventListener('click', () => {
            modalBlurBg.style.display = 'none';
        });
        modalBlurEntendido.addEventListener('click', () => {
            modalBlurBg.style.display = 'none';
        });
        window.addEventListener('click', (e) => {
            if (e.target === modalBlurBg) {
                modalBlurBg.style.display = 'none';
            }
        });
    }

    // =====================================
    // Abas Animadas
    // =====================================
    const abaAnimadaBotoes = document.querySelectorAll('.aba-btn-animada');
    const abaAnimadaPaineis = document.querySelectorAll('.aba-painel-animada');
    const abaIndicador = document.querySelector('.aba-indicador');
    if (abaAnimadaBotoes.length > 0 && abaAnimadaPaineis.length > 0 && abaIndicador) {
        const updateIndicator = (button) => {
            const buttonRect = button.getBoundingClientRect();
            const containerRect = button.parentElement.getBoundingClientRect();
            abaIndicador.style.left = `${buttonRect.left - containerRect.left}px`;
            abaIndicador.style.width = `${buttonRect.width}px`;
        };

        abaAnimadaBotoes.forEach(btn => {
            btn.addEventListener('click', () => {
                abaAnimadaBotoes.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                abaAnimadaPaineis.forEach(p => p.classList.remove('active'));
                document.getElementById(btn.dataset.tabAnimada).classList.add('active');
                updateIndicator(btn);
            });
        });

        // Posiciona o indicador na aba ativa inicial
        const activeBtn = document.querySelector('.aba-btn-animada.active');
        if (activeBtn) {
            updateIndicator(activeBtn);
        }
    }

    // =====================================
    // Aviso Toast
    // =====================================
    const btnAvisoSucesso = document.querySelector('.btn-aviso-sucesso');
    const avisoToast = document.querySelector('.aviso-toast');
    if (btnAvisoSucesso && avisoToast) {
        btnAvisoSucesso.addEventListener('click', () => {
            avisoToast.classList.add('show');
            setTimeout(() => {
                avisoToast.classList.remove('show');
            }, 3000);
        });
    }

    // =====================================
    // Copiar para a Área de Transferência
    // =====================================
    const btnCopy = document.querySelector('.btn-copy');
    
    if (btnCopy) {
        // Armazena o conteúdo original do botão (o ícone de copiar)
        const originalContent = btnCopy.innerHTML;

        btnCopy.addEventListener('click', () => {
            const codeBlock = document.querySelector('.codigo-bloco');

            if (codeBlock) {
                // Seleciona o texto do bloco de código
                const textToCopy = codeBlock.innerText;
                const tempInput = document.createElement('textarea');
                tempInput.value = textToCopy;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);

                // Muda o conteúdo do botão para o texto "Copiado!"
                btnCopy.innerHTML = 'Copiado!';
                
                // Após 2 segundos, restaura o conteúdo original do botão
                setTimeout(() => {
                    btnCopy.innerHTML = '<i class="fas fa-clipboard"></i>';
                }, 2000);
            }
        });
    }

    // =====================================
    // Sidebar
    // =====================================
    const btnSidebarOpen = document.querySelector('.btn-sidebar-open');
    const btnSidebarClose = document.querySelector('.btn-sidebar-close');
    const sidebarMenu = document.querySelector('.sidebar-menu');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    if (btnSidebarOpen && btnSidebarClose && sidebarMenu && sidebarOverlay) {
        btnSidebarOpen.addEventListener('click', () => {
            sidebarMenu.classList.add('open');
            sidebarOverlay.style.display = 'block';
        });
        btnSidebarClose.addEventListener('click', () => {
            sidebarMenu.classList.remove('open');
            sidebarOverlay.style.display = 'none';
        });
        sidebarOverlay.addEventListener('click', () => {
            sidebarMenu.classList.remove('open');
            sidebarOverlay.style.display = 'none';
        });
    }

    // =====================================
    // Filtro de Galeria
    // =====================================
    const filtroBotoes = document.querySelectorAll('.filtro-btn');
    const galeriaItens = document.querySelectorAll('.galeria-item-filtro');
    filtroBotoes.forEach(btn => {
        btn.addEventListener('click', () => {
            filtroBotoes.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filtro = btn.dataset.filter;
            galeriaItens.forEach(item => {
                const categoria = item.dataset.category;
                if (filtro === 'all' || categoria === filtro) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });


    // Seleciona o botão e os elementos de texto dentro do card
    const readMoreBtn = document.querySelector('.btn-ler-mais');
    const fullText = document.querySelector('.texto-completo');
    const ellipsis = document.querySelector('.ler-mais-ponto');

    // Verifica se os elementos existem antes de adicionar o listener
    if (readMoreBtn && fullText && ellipsis) {
        readMoreBtn.addEventListener('click', () => {
            // Verifica se o texto completo está visível
            const isExpanded = fullText.style.display === 'inline' || fullText.style.display === 'inline-block';

            if (isExpanded) {
                // Se estiver expandido, o esconde e mostra a reticências
                fullText.style.display = 'none';
                ellipsis.style.display = 'inline';
                readMoreBtn.textContent = 'Ler Mais';
            } else {
                // Se estiver oculto, o mostra e esconde a reticências
                fullText.style.display = 'inline'; // Ou 'inline-block' dependendo do layout
                ellipsis.style.display = 'none';
                readMoreBtn.textContent = 'Ler Menos';
            }
        });
    }

    // Obtém o elemento do carregador da página
    const pageLoader = document.getElementById('page-loader');

    // Verifica se o elemento existe na página
    if (pageLoader) {
        // Usa setTimeout para agendar a remoção do carregador após 2 segundos
        setTimeout(() => {
            // Remove o carregador da página, tornando o conteúdo visível
            pageLoader.style.display = 'none';
        }, 2000); // 2000 milissegundos = 2 segundos
    }

    // Seleciona os elementos do HTML que controlam o chatbot
    const chatbotBtn = document.querySelector('.chatbot-btn');
    const chatbotBox = document.querySelector('.chatbot-box');
    const chatbotClose = document.querySelector('.chatbot-close');

    // Verifica se os elementos existem antes de adicionar os listeners
    if (chatbotBtn && chatbotBox && chatbotClose) {
        // Adiciona um evento de clique ao botão para abrir o chatbot
        // Ele adiciona a classe 'show', que torna a caixa visível
        chatbotBtn.addEventListener('click', () => {
            chatbotBox.classList.add('show');
        });

        // Adiciona um evento de clique ao botão de fechar
        // Ele remove a classe 'show', que esconde a caixa do chatbot
        chatbotClose.addEventListener('click', () => {
            chatbotBox.classList.remove('show');
        });
    }

    // =====================================
    // Efeito Ripple no Botão
    // =====================================
    const btnRipple = document.querySelector('.btn-ripple');
    if (btnRipple) {
        btnRipple.addEventListener('click', (e) => {
            const rect = btnRipple.getBoundingClientRect();
            const circle = document.createElement('span');
            const diameter = Math.max(rect.width, rect.height);
            const radius = diameter / 2;
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple');
            const existingRipple = btnRipple.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }
            btnRipple.appendChild(circle);
        });
    }

    // =====================================
    // Validação de Formulário
    // =====================================
    const formValidacao = document.querySelector('.form-validacao');
    if (formValidacao) {
        formValidacao.addEventListener('input', (e) => {
            const input = e.target;
            const feedback = input.nextElementSibling;
            if (input.validity.valid) {
                feedback.textContent = '';
                input.style.borderColor = 'green';
            } else {
                feedback.textContent = 'Campo inválido!';
                input.style.borderColor = 'red';
            }
        });
    }

    // =====================================
    // Botão de Download com Animação
    // =====================================
    const btnDownload = document.querySelector('.btn-download');
    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            btnDownload.classList.add('downloading');
            setTimeout(() => {
                btnDownload.classList.remove('downloading');
            }, 2000);
        });
    }

    // =====================================
    // Consentimento de Cookies
    // =====================================
    const cookieConsent = document.getElementById('cookie-consent');
    const btnAceitarCookie = document.querySelector('.btn-aceitar-cookie');
    const btnRejeitarCookie = document.querySelector('.btn-rejeitar-cookie');
    if (cookieConsent && btnAceitarCookie && btnRejeitarCookie) {
        btnAceitarCookie.addEventListener('click', () => {
            cookieConsent.style.display = 'none';
        });
        btnRejeitarCookie.addEventListener('click', () => {
            cookieConsent.style.display = 'none';
        });
    }

    // =====================================
    // Carrossel de Testemunhos
    // =====================================
    const testemunhoWrapper = document.querySelector('.testemunho-wrapper');
    const bolhas = document.querySelectorAll('.bolha-testemunho');
    if (testemunhoWrapper && bolhas.length > 0) {
        let currentTestemunho = 0;
        const totalTestemunhos = bolhas.length;

        const updateTestemunho = (index) => {
            testemunhoWrapper.style.transform = `translateX(-${index * 100}%)`;
            bolhas.forEach(bolha => bolha.classList.remove('active'));
            bolhas[index].classList.add('active');
        };

        bolhas.forEach((bolha, index) => {
            bolha.addEventListener('click', () => {
                currentTestemunho = index;
                updateTestemunho(currentTestemunho);
            });
        });
    }

    // =====================================
    // Contador Rolante
    // =====================================
    const rollingCounters = document.querySelectorAll('.numero-rolling');
    const animateRollingCounters = () => {
        rollingCounters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            let count = 0;
            const increment = target / 100;
            const updateCounter = () => {
                if (count < target) {
                    count += increment;
                    counter.textContent = Math.ceil(count);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            updateCounter();
        });
    };
    animateRollingCounters();

    // =====================================
    // Botão de Compartilhar Toggle
    // =====================================
    const btnShareToggle = document.querySelector('.btn-share-toggle');
    const shareLinks = document.querySelector('.share-links');
    if (btnShareToggle && shareLinks) {
        btnShareToggle.addEventListener('click', () => {
            shareLinks.classList.toggle('open');
        });
    }

    // =====================================
    // Galeria Parallax
    // =====================================
    const galeriaColunas = document.querySelectorAll('.galeria-coluna');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        galeriaColunas.forEach(coluna => {
            const speed = parseFloat(coluna.dataset.speed);
            coluna.style.transform = `translateY(${scrollY * speed * 0.1}px)`;
        });
    });

    // =====================================
    // Dropdown Menu
    // =====================================
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener('click', () => {
            dropdownMenu.classList.toggle('open');
        });
    }

    // =====================================
    // Tabela de Dados com Ordenação
    // =====================================
    const tabelaEstatisticas = document.getElementById('tabela-estatisticas');
    if (tabelaEstatisticas) {
        const headers = tabelaEstatisticas.querySelectorAll('th');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.column;
                const order = header.dataset.order === 'desc' ? 'asc' : 'desc';
                header.dataset.order = order;

                const tableRows = Array.from(tabelaEstatisticas.querySelectorAll('tbody tr'));
                tableRows.sort((a, b) => {
                    const aText = a.querySelector(`td:nth-child(${header.cellIndex + 1})`).textContent.trim();
                    const bText = b.querySelector(`td:nth-child(${header.cellIndex + 1})`).textContent.trim();
                    if (order === 'asc') {
                        return aText.localeCompare(bText);
                    } else {
                        return bText.localeCompare(aText);
                    }
                });

                tableRows.forEach(row => tabelaEstatisticas.querySelector('tbody').appendChild(row));
            });
        });
    }

    // =====================================
    // Card de Estatística Circular
    // =====================================
    const circuloProgresso = document.querySelector('.circulo-progresso');
    if (circuloProgresso) {
        const porcentagem = circuloProgresso.dataset.porcentagem;
        const offset = 282.7 * (1 - porcentagem / 100);
        circuloProgresso.style.strokeDashoffset = offset;
    }

    // =====================================
    // Gráfico de Barras
    // =====================================
    const graficoBarras = document.querySelector('.grafico-barras');
    if (graficoBarras) {
        const barras = graficoBarras.querySelectorAll('.barra-item');
        barras.forEach(barra => {
            const value = parseInt(barra.dataset.value);
            barra.style.height = `${value}%`;
        });
    }

    // =====================================
    // Pop-up de Aviso
    // =====================================
    const btnAvisoPopupOpen = document.querySelector('.btn-abrir-aviso');
    const avisoPopupOverlay = document.querySelector('.aviso-popup-overlay');
    const avisoPopupClose = document.querySelector('.aviso-popup-close');
    if (btnAvisoPopupOpen && avisoPopupOverlay && avisoPopupClose) {
        btnAvisoPopupOpen.addEventListener('click', () => {
            avisoPopupOverlay.style.display = 'flex';
        });
        avisoPopupClose.addEventListener('click', () => {
            avisoPopupOverlay.style.display = 'none';
        });
        window.addEventListener('click', (e) => {
            if (e.target === avisoPopupOverlay) {
                avisoPopupOverlay.style.display = 'none';
            }
        });
    }

    // =====================================
    // Toolbox (Tooltip)
    // =====================================
    const toolboxTrigger = document.querySelector('.toolbox-trigger');
    const toolboxConteudo = document.querySelector('.toolbox-conteudo');
    if (toolboxTrigger && toolboxConteudo) {
        toolboxTrigger.addEventListener('mouseover', () => {
            toolboxConteudo.style.display = 'block';
        });
        toolboxTrigger.addEventListener('mouseout', () => {
            toolboxConteudo.style.display = 'none';
        });
    }

    // =====================================
    // Abas de Anotações
    // =====================================
    const noteTabButtons = document.querySelectorAll('.abas-notas-btn');
    const noteTabContent = document.querySelector('.abas-notas-container');
    const notePanes = document.createElement('div');
    notePanes.className = 'abas-notas-conteudo mt-4 p-4 bg-white rounded-lg shadow';
    noteTabContent.appendChild(notePanes);

    // Dados de exemplo para as anotações
    const notes = {
        nota1: "Estas são as anotações do projeto, incluindo escopo, cronograma e metas. O projeto visa modernizar a plataforma e melhorar a experiência do usuário.",
        nota2: "Requisitos técnicos: React, Tailwind CSS, Firebase para autenticação e banco de dados. API REST para comunicação com o backend.",
        nota3: "A equipe é composta por João (Frontend), Maria (Backend), Pedro (UI/UX) e Ana (Gerente de Projeto)."
    };

    const showNote = (tabId) => {
        notePanes.innerHTML = `<p class=\"text-gray-700\">${notes[tabId]}</p>`;
    };

    if (noteTabButtons.length > 0) {
        noteTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                noteTabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                showNote(button.dataset.tabNotas);
            });
        });
        // Exibir a primeira aba por padrão
        showNote('nota1');
    }



    // =====================================
    // 1. Alerta com Efeito de Fade
    // =====================================
    const alertButton = document.querySelector('.btn-tooltip-fade');
    const alertOverlay = document.querySelector('.tooltip-fade-overlay');
    const alertCloseButton = document.querySelector('.btn-fechar-tooltip');

    if (alertButton && alertOverlay && alertCloseButton) {
        alertButton.addEventListener('click', () => {
            alertOverlay.style.display = 'flex';
            setTimeout(() => alertOverlay.classList.add('show'), 10);
        });
        alertCloseButton.addEventListener('click', () => {
            alertOverlay.classList.remove('show');
            setTimeout(() => alertOverlay.style.display = 'none', 300);
        });
        alertOverlay.addEventListener('click', (e) => {
            if (e.target === alertOverlay) {
                alertOverlay.classList.remove('show');
                setTimeout(() => alertOverlay.style.display = 'none', 300);
            }
        });
    }

    // =====================================
    // 2. Tooltip de Código com Copiar
    // =====================================
    const copyButton = document.querySelector('.btn-copy');
    if (copyButton) {
        copyButton.addEventListener('click', (e) => {
            const code = e.target.previousElementSibling.querySelector('code').innerText;
            const tempInput = document.createElement('textarea');
            tempInput.value = code;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            const originalText = copyButton.innerText;
            copyButton.innerText = 'Copiado!';
            setTimeout(() => {
                copyButton.innerText = originalText;
            }, 2000);
        });
    }

    // =====================================
    // 3. Carrossel de Tela Cheia
    // =====================================
    const fullScreenCarousel = document.querySelector('.carousel-full-screen');
    if (fullScreenCarousel) {
        const items = fullScreenCarousel.querySelectorAll('.carousel-item');
        const prevBtn = fullScreenCarousel.querySelector('.prev');
        const nextBtn = fullScreenCarousel.querySelector('.next');
        let currentIndex = 0;

        const showSlide = (index) => {
            items.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
            showSlide(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
            showSlide(currentIndex);
        });
    }

    // =====================================
    // 4. Abas Modernas
    // =====================================
    const modernTabButtons = document.querySelectorAll('.tab-button');
    const tabIndicator = document.querySelector('.tab-active-indicator');
    const tabPanes = document.querySelectorAll('.tab-pane');

    const updateIndicator = (activeButton) => {
        const {
            width,
            left
        } = activeButton.getBoundingClientRect();
        const containerLeft = activeButton.parentElement.getBoundingClientRect().left;
        tabIndicator.style.width = `${width}px`;
        tabIndicator.style.left = `${left - containerLeft}px`;
    };

    if (modernTabButtons.length > 0) {
        updateIndicator(document.querySelector('.tab-button.active'));

        modernTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                modernTabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                tabPanes.forEach(pane => {
                    pane.classList.toggle('active', pane.id === tabId);
                });
                updateIndicator(button);
            });
        });
    }

    // =====================================
    // 5. Formulário de Contato com Validação
    // =====================================
    const contactForm = document.getElementById('form-contato');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formGroups = contactForm.querySelectorAll('.form-grupo');
            let isValid = true;

            formGroups.forEach(group => {
                const input = group.querySelector('input, textarea');
                const feedback = group.querySelector('.feedback-validacao');
                feedback.classList.add('hidden');
                if (!input.checkValidity()) {
                    feedback.innerText = input.validationMessage;
                    feedback.classList.remove('hidden');
                    isValid = false;
                }
            });

            if (isValid) {
                // Simulação de envio
                console.log('Formulário enviado com sucesso!');
                contactForm.reset();
                // Aqui você pode adicionar a lógica de notificação de sucesso
            }
        });
    }

    // =====================================
    // 6. Efeito de Swipe Líquido
    // =====================================
    const liquidWrapper = document.querySelector('.liquid-swipe-wrapper');
    const liquidCards = document.querySelectorAll('.liquid-card');
    const liquidPrev = document.querySelector('.liquid-btn.prev');
    const liquidNext = document.querySelector('.liquid-btn.next');
    if (liquidWrapper && liquidPrev && liquidNext) {
        let liquidIndex = 0;
        const updateLiquidSwipe = () => {
            liquidWrapper.style.transform = `translateX(-${liquidIndex * 100}%)`;
        };
        liquidNext.addEventListener('click', () => {
            liquidIndex = (liquidIndex < liquidCards.length - 1) ? liquidIndex + 1 : 0;
            updateLiquidSwipe();
        });
        liquidPrev.addEventListener('click', () => {
            liquidIndex = (liquidIndex > 0) ? liquidIndex - 1 : liquidCards.length - 1;
            updateLiquidSwipe();
        });
    }

    // =====================================
    // 7. Carrossel 3D
    // =====================================
    const carousel3dWrapper = document.querySelector('.carousel-3d-wrapper');
    const cards3d = document.querySelectorAll('.carousel-3d-card');
    const prev3d = document.querySelector('.prev-3d');
    const next3d = document.querySelector('.next-3d');
    if (carousel3dWrapper && prev3d && next3d) {
        let current3dIndex = 0;
        const numCards = cards3d.length;

        const update3dCarousel = () => {
            const angle = 360 / numCards;
            cards3d.forEach((card, i) => {
                const rotation = (i - current3dIndex) * angle;
                const zTranslate = -150;
                card.style.transform = `rotateY(${rotation}deg) translateZ(${zTranslate}px)`;
                card.style.opacity = (i === current3dIndex) ? '1' : '0.7';
            });
        };

        prev3d.addEventListener('click', () => {
            current3dIndex = (current3dIndex > 0) ? current3dIndex - 1 : numCards - 1;
            update3dCarousel();
        });

        next3d.addEventListener('click', () => {
            current3dIndex = (current3dIndex < numCards - 1) ? current3dIndex + 1 : 0;
            update3dCarousel();
        });

        update3dCarousel(); // Inicia o carrossel na posição correta
    }

    // =====================================
    // 8. Card "Ler Mais"
    // =====================================
    const readMoreButton = document.querySelector('.btn-ler-mais');
    const readMoreCard = document.querySelector('.card-ler-mais');
    if (readMoreButton && readMoreCard) {
        readMoreButton.addEventListener('click', () => {
            readMoreCard.classList.toggle('expandido');
            readMoreButton.innerText = readMoreCard.classList.contains('expandido') ? 'Ler Menos' : 'Ler Mais';
        });
    }

    // =====================================
    // 10. Seção de Pesquisa e Filtro
    // =====================================
    const searchInput = document.getElementById('searchInput');
    const tagButtons = document.querySelectorAll('.tag-btn');
    const searchResultsContainer = document.getElementById('searchResults');
    const itemModal = document.getElementById('itemModal');
    const closeModalBtn = itemModal.querySelector('.close-modal');

    const itemsData = [{
        title: 'Item de Exemplo 1',
        description: 'Descrição do primeiro item. Focado em funcionalidades avançadas.',
        tags: ['addon', 'arquivos'],
        thumbnail: 'https://via.placeholder.com/400x300/F44336/FFFFFF?text=Item+1'
    }, {
        title: 'Super Mod de Jogo',
        description: 'Um mod incrível que adiciona novos recursos ao seu jogo favorito.',
        tags: ['mod'],
        thumbnail: 'https://via.placeholder.com/400x300/E91E63/FFFFFF?text=Item+2'
    }, {
        title: 'Nova Skin Exclusiva',
        description: 'Personalize seu personagem com esta skin rara e exclusiva.',
        tags: ['skin'],
        thumbnail: 'https://via.placeholder.com/400x300/9C27B0/FFFFFF?text=Item+3'
    }, {
        title: 'Addon de Interface',
        description: 'Melhore a experiência do usuário com este addon de interface.',
        tags: ['addon'],
        thumbnail: 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Item+4'
    }, {
        title: 'Mod de Gráficos',
        description: 'Mod que melhora a qualidade visual e desempenho do jogo.',
        tags: ['mod', 'arquivos'],
        thumbnail: 'https://via.placeholder.com/400x300/FFC107/FFFFFF?text=Item+5'
    }, {
        title: 'Skin de Personagem',
        description: 'Nova skin de personagem com animações personalizadas.',
        tags: ['skin'],
        thumbnail: 'https://via.placeholder.com/400x300/795548/FFFFFF?text=Item+6'
    },];

    const renderResults = (items) => {
        searchResultsContainer.innerHTML = '';
        if (items.length === 0) {
            searchResultsContainer.innerHTML = '<p class="text-center text-gray-500 col-span-full">Nenhum resultado encontrado.</p>';
            return;
        }
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-gray-50 p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow';
            card.innerHTML = `
                        <img src="${item.thumbnail}" alt="${item.title}" class="w-full h-auto rounded-md mb-2">
                        <h4 class="font-bold">${item.title}</h4>
                        <p class="text-sm text-gray-600 truncate">${item.description}</p>
                    `;
            card.addEventListener('click', () => openModal(item));
            searchResultsContainer.appendChild(card);
        });
    };

    const filterItems = () => {
        const query = searchInput.value.toLowerCase();
        const activeTag = document.querySelector('.tag-btn.active').dataset.tag;

        const filtered = itemsData.filter(item => {
            const matchesQuery = item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
            const matchesTag = activeTag === 'all' || item.tags.includes(activeTag);
            return matchesQuery && matchesTag;
        });
        renderResults(filtered);
    };

    const openModal = (item) => {
        document.getElementById('modalThumbnail').src = item.thumbnail;
        document.getElementById('modalTitle').innerText = item.title;
        document.getElementById('modalDescription').innerText = item.description;
        document.getElementById('modalDetails').innerText = `Tags: ${item.tags.join(', ')}`;
        itemModal.style.display = 'flex';
    };

    if (searchInput && tagButtons.length > 0) {
        searchInput.addEventListener('input', filterItems);
        tagButtons.forEach(button => {
            button.addEventListener('click', () => {
                tagButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterItems();
            });
        });
        closeModalBtn.addEventListener('click', () => {
            itemModal.style.display = 'none';
        });
        itemModal.addEventListener('click', (e) => {
            if (e.target === itemModal) {
                itemModal.style.display = 'none';
            }
        });
    }

    // Renderiza todos os itens na carga inicial
    renderResults(itemsData);

    // =====================================
    // 11. Sistema de Notificação
    // =====================================
    const btnNotificacao = document.getElementById('btnNotificacao');
    const notificacaoAviso = document.getElementById('notificacaoAviso');
    const notificacaoFechar = notificacaoAviso ? notificacaoAviso.querySelector('.notificacao-fechar') : null;
    if (btnNotificacao && notificacaoAviso) {
        btnNotificacao.addEventListener('click', () => {
            notificacaoAviso.style.display = 'flex';
            setTimeout(() => notificacaoAviso.classList.add('show'), 10);
            setTimeout(() => {
                notificacaoAviso.classList.remove('show');
                setTimeout(() => notificacaoAviso.style.display = 'none', 300);
            }, 5000);
        });
        if (notificacaoFechar) {
            notificacaoFechar.addEventListener('click', () => {
                notificacaoAviso.classList.remove('show');
                setTimeout(() => notificacaoAviso.style.display = 'none', 300);
            });
        }
    }

    // =====================================
    // 12. Cartão Expansível
    // =====================================
    const expandableCard = document.querySelector('.cartao-expansivel');
    if (expandableCard) {
        expandableCard.addEventListener('click', () => {
            expandableCard.classList.toggle('expandido');
        });
    }

    // =====================================
    // 14. Modal Simples
    // =====================================
    const openModalBtn = document.getElementById('abrirModal');
    const simpleModal = document.getElementById('modal');
    const closeSimpleModalBtn = simpleModal ? simpleModal.querySelector('.fechar-modal') : null;

    if (openModalBtn && simpleModal && closeSimpleModalBtn) {
        openModalBtn.addEventListener('click', () => {
            simpleModal.style.display = 'flex';
        });
        closeSimpleModalBtn.addEventListener('click', () => {
            simpleModal.style.display = 'none';
        });
        simpleModal.addEventListener('click', (e) => {
            if (e.target === simpleModal) {
                simpleModal.style.display = 'none';
            }
        });
    }

    // =====================================
    // 15. Slider de Testemunhos
    // =====================================
    const testimonialSlider = document.querySelector('.slider-testemunhos');
    const testimonialItems = testimonialSlider ? testimonialSlider.querySelectorAll('.item-slider') : [];
    const prevTestimonialBtn = testimonialSlider ? testimonialSlider.querySelector('.botao-anterior') : null;
    const nextTestimonialBtn = testimonialSlider ? testimonialSlider.querySelector('.botao-proximo') : null;
    if (testimonialSlider && testimonialItems.length > 0) {
        let currentTestimonialIndex = 0;

        const showTestimonial = (index) => {
            testimonialItems.forEach(item => item.classList.remove('ativo'));
            testimonialItems[index].classList.add('ativo');
        };

        prevTestimonialBtn.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex > 0) ? currentTestimonialIndex - 1 : testimonialItems.length - 1;
            showTestimonial(currentTestimonialIndex);
        });

        nextTestimonialBtn.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex < testimonialItems.length - 1) ? currentTestimonialIndex + 1 : 0;
            showTestimonial(currentTestimonialIndex);
        });
    }

    // =====================================
    // 16. Carrossel de Imagens
    // =====================================
    const imageCarouselContainer = document.querySelector('.carrossel-container');
    const imageCarouselSlides = imageCarouselContainer ? imageCarouselContainer.querySelector('.carrossel-slides') : null;
    const imageCarouselButtons = imageCarouselContainer ? imageCarouselContainer.querySelectorAll('.carrossel-botao') : [];
    if (imageCarouselSlides && imageCarouselButtons.length > 0) {
        let currentSlide = 0;
        const totalSlides = imageCarouselSlides.children.length;

        const updateCarousel = () => {
            const slideWidth = imageCarouselSlides.clientWidth;
            imageCarouselSlides.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        };

        imageCarouselButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('proximo')) {
                    currentSlide = (currentSlide < totalSlides - 1) ? currentSlide + 1 : 0;
                } else {
                    currentSlide = (currentSlide > 0) ? currentSlide - 1 : totalSlides - 1;
                }
                updateCarousel();
            });
        });
        window.addEventListener('resize', updateCarousel);
    }

    // =====================================
    // 17. Visualizador de Imagens
    // =====================================
    const imageToView = document.getElementById('imagemTeste');
    const viewerModal = document.getElementById('visualizador');
    const viewedImage = document.getElementById('imagemVisualizada');
    const viewerClose = viewerModal ? viewerModal.querySelector('.visualizador-fechar') : null;

    if (imageToView && viewerModal && viewerClose) {
        imageToView.addEventListener('click', () => {
            viewedImage.src = imageToView.src;
            viewerModal.style.display = 'flex';
        });

        viewerClose.addEventListener('click', () => {
            viewerModal.style.display = 'none';
        });

        viewerModal.addEventListener('click', (e) => {
            if (e.target === viewerModal) {
                viewerModal.style.display = 'none';
            }
        });
    }

    // =====================================
    // 18. Modal de Senha
    // =====================================
    const passwordBtn = document.getElementById('verificarSenhaBtn');
    const passwordInput = document.getElementById('senha-input');
    const passwordModal = document.getElementById('modalSenhaSucesso');
    const closePasswordModal = passwordModal ? passwordModal.querySelector('.modal-avancado-fechar') : null;
    if (passwordBtn && passwordInput && passwordModal) {
        passwordBtn.addEventListener('click', () => {
            const correctPassword = 'senha123';
            if (passwordInput.value === correctPassword) {
                passwordModal.style.display = 'flex';
            } else {
                // Não usamos alert(), então apenas logamos para demonstração
                console.error('Senha incorreta!');
            }
        });
        if (closePasswordModal) {
            closePasswordModal.addEventListener('click', () => {
                passwordModal.style.display = 'none';
            });
        }
        passwordModal.addEventListener('click', (e) => {
            if (e.target === passwordModal) {
                passwordModal.style.display = 'none';
            }
        });
    }

    // =====================================
    // 19. Abas de Notas com Conteúdo Dinâmico
    // =====================================
    const notesTabButtons = document.querySelectorAll('.abas-notas-btn');
    const notesTabPanes = document.querySelectorAll('.abas-notas-pane');

    notesTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            notesTabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            notesTabPanes.forEach(pane => {
                pane.classList.toggle('active', pane.id === tabId);
            });
        });
    });

    // =====================================
    // 20. Carrossel de Depoimentos com Pontos
    // =====================================
    const testimonialsCarousel = document.querySelector('.depoimento-carrossel');
    const testimonialDots = document.querySelectorAll('.ponto-nav');
    const testimonialItemsList = document.querySelectorAll('.depoimento-item');
    if (testimonialsCarousel && testimonialDots.length > 0) {
        let currentTestimonialSlide = 0;
        const totalTestimonials = testimonialItemsList.length;

        const updateTestimonialCarousel = (index) => {
            testimonialsCarousel.style.transform = `translateX(-${index * 100}%)`;
            testimonialDots.forEach(dot => dot.classList.remove('active'));
            testimonialDots[index].classList.add('active');
        };

        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentTestimonialSlide = index;
                updateTestimonialCarousel(currentTestimonialSlide);
            });
        });
    }
});