document.addEventListener('DOMContentLoaded', () => {
    console.log("Script principal carregado. DOM Content Loaded.");

    // =====================================
    // 1. Controle de Áudio de Fundo
    // =====================================
    const audio = document.getElementById('backgroundMusic');
    const audioControlButton = document.getElementById('audioControlButton');
    const currentMusicTitle = document.getElementById('currentMusicTitle');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const onIcon = audioControlButton.querySelector('.on-icon');   // Ícone com X (para mute)
    const offIcon = audioControlButton.querySelector('.off-icon'); // Ícone sem X (para volume normal)

    // Coleta todas as fontes de música do HTML
    const musicSources = Array.from(audio.querySelectorAll('source')).map(source => ({
        src: source.src,
        title: source.dataset.title || 'Música Desconhecida' // Usa data-title ou um fallback
    }));

    let currentMusicIndex = -1; // Índice da música atualmente selecionada
    // 'isPlaying' será determinado pelo estado real do 'audio' element, não por uma variável booleana simples
    // let isPlaying = false; // Removido ou será inferido

    console.log(`Músicas encontradas: ${musicSources.length}`, musicSources);

    /**
     * Atualiza o estado visual do botão de controle de áudio (classes, ícones, texto, progresso).
     * Esta função agora se baseia no estado real do elemento <audio>.
     */
    function updateAudioButtonState() {
        // console.log(`updateAudioButtonState: audio.paused = ${audio.paused}, audio.src = ${audio.src}`);

        // A música está "tocando" se não estiver pausada E tiver uma fonte definida
        const isCurrentlyPlaying = !audio.paused && audio.src;

        if (isCurrentlyPlaying) {
            audioControlButton.classList.remove('off');
            audioControlButton.classList.add('on'); // Adiciona a classe 'on' para ativar o neon
            onIcon.style.display = 'inline-block';
            offIcon.style.display = 'none';
            audioControlButton.setAttribute('aria-label', `Música tocando: ${currentMusicTitle.textContent}. Clique para pausar.`);
            updateProgressBar(); // Inicia/continua a atualização da barra de progresso
        } else {
            audioControlButton.classList.remove('on'); // Remove a classe 'on' para desativar o neon
            audioControlButton.classList.add('off');
            onIcon.style.display = 'none';
            offIcon.style.display = 'inline-block';
            audioControlButton.setAttribute('aria-label', 'Música pausada. Clique para tocar.');
            audioProgressArc.style.transform = `rotate(-45deg)`; // Reseta a barra de progresso
            // O texto já foi definido por pauseMusic ou pelo catch de playRandomMusic
        }
    }

    /**
     * Reproduz uma música aleatória da lista.
     * Tenta lidar com a política de autoplay e erros de reprodução.
     */
    function playRandomMusic() {
        console.log("playRandomMusic: Tentando iniciar reprodução...");

        if (musicSources.length === 0) {
            currentMusicTitle.textContent = 'Nenhuma música encontrada.';
            audioControlButton.disabled = true;
            updateAudioButtonState();
            console.warn("Nenhuma fonte de música configurada no HTML.");
            return;
        }

        let randomIndex;
        if (musicSources.length > 1) {
            do {
                randomIndex = Math.floor(Math.random() * musicSources.length);
            } while (randomIndex === currentMusicIndex);
        } else {
            randomIndex = 0;
        }

        currentMusicIndex = randomIndex;
        const selectedMusic = musicSources[currentMusicIndex];

        audio.src = selectedMusic.src;
        audio.load(); // Carrega a nova fonte

        currentMusicTitle.textContent = selectedMusic.title; // Atualiza o título imediatamente

        console.log(`playRandomMusic: Carregando '${selectedMusic.title}' de '${selectedMusic.src}'`);

        audio.play()
            .then(() => {
                console.log(`playRandomMusic: Reproduzindo '${selectedMusic.title}' com sucesso.`);
                updateAudioButtonState(); // Atualiza para o estado ON (com neon)
            })
            .catch(error => {
                // A promessa de play foi rejeitada.
                // Isso pode acontecer devido a:
                // 1. NotAllowedError (autoplay bloqueado) - o mais comum.
                // 2. DOMException (interrompido por pause() rápido, ou outro erro).
                // 3. NotSupportedError (formato de áudio não suportado, caminho errado).

                console.error(`playRandomMusic: Falha ao reproduzir '${selectedMusic.title}' de '${selectedMusic.src}':`, error);

                if (error.name === 'NotAllowedError') {
                    // Música não pôde ser iniciada por falta de interação do usuário.
                    // O UI deve refletir que a música não está tocando.
                    currentMusicTitle.textContent = 'Clique para tocar.';
                    // Não chamamos pauseMusic aqui, apenas atualizamos o estado visual
                    // para indicar que está "parado" esperando o clique.
                    audio.pause(); // Garante que esteja pausado no modelo do navegador
                    updateAudioButtonState(); // Atualiza para o estado OFF
                    console.log("Autoplay bloqueado. Aguardando interação do usuário.");
                } else if (error.name === 'NotSupportedError' || error.name === 'AbortError') {
                    // Problema com o arquivo (não suportado, carregamento abortado)
                    currentMusicTitle.textContent = 'Erro ao carregar música.';
                    audio.pause(); // Garante que esteja pausado
                    updateAudioButtonState(); // Atualiza para o estado OFF
                    console.error("Erro no formato ou carregamento do áudio:", error);
                    // Opcional: Tentar a próxima música se houver muitas e for um erro de arquivo
                    if (musicSources.length > 1) {
                         console.log("Tentando a próxima música devido a um erro de arquivo...");
                         setTimeout(playRandomMusic, 1500); // Tenta a próxima após um pequeno atraso
                    }
                } else {
                    // Outro tipo de erro geral (DOMException etc.)
                    currentMusicTitle.textContent = 'Erro de reprodução.';
                    audio.pause(); // Garante que esteja pausado
                    updateAudioButtonState(); // Atualiza para o estado OFF
                    console.error("Erro inesperado durante a reprodução:", error);
                }
            });
    }

    /**
     * Pausa a música em reprodução.
     */
    function pauseMusic() {
        console.log("pauseMusic: Pausando reprodução.");
        audio.pause();
        currentMusicTitle.textContent = 'Desligado'; // Volta o texto para "Desligado"
        updateAudioButtonState(); // Atualiza para o estado OFF (sem neon)
    }

    // Event Listener para o clique no botão de controle de áudio
    audioControlButton.addEventListener('click', () => {
        // A lógica agora se baseia diretamente no estado 'paused' do elemento audio
        if (!audio.paused) { // Se não estiver pausado, está tocando
            console.log("Botão clicado: Música tocando, pausando.");
            pauseMusic();
        } else {
            console.log("Botão clicado: Música pausada, tentando tocar.");
            playRandomMusic();
        }
    });

    // Evento quando a música termina de tocar (para autoplay da próxima)
    audio.addEventListener('ended', () => {
        console.log("Evento 'ended' disparado. Reproduzindo próxima música aleatória.");
        playRandomMusic();
    });

    // Evento quando o áudio é pausado (via código ou UI)
    audio.addEventListener('pause', () => {
        console.log("Evento 'pause' disparado.");
        // O currentMusicTitle e o estado já foram ajustados por pauseMusic(),
        // mas garante que o UI está correto.
        updateAudioButtonState();
    });

    // Evento quando o áudio começa a tocar (via código ou UI)
    audio.addEventListener('play', () => {
        console.log("Evento 'play' disparado.");
        // Garante que o UI está no estado de reprodução
        updateAudioButtonState();
    });

    // Evento de erro geral do elemento de áudio (para debug)
    audio.addEventListener('error', (e) => {
        console.error("Erro no elemento <audio>:", e.message, e);
        currentMusicTitle.textContent = 'Erro de áudio!';
        audio.pause(); // Garante que o áudio pare
        updateAudioButtonState(); // Atualiza para o estado OFF
    });

    // Função para atualizar a barra de progresso circular
    function updateProgressBar() {
        // Só atualiza se o áudio estiver realmente tocando e tiver duração válida
        if (!audio.paused && !isNaN(audio.duration) && audio.duration > 0) {
            const progress = (audio.currentTime / audio.duration);
            const rotation = progress * 360;
            audioProgressArc.style.transform = `rotate(${rotation - 45}deg)`;
            requestAnimationFrame(updateProgressBar);
        } else {
            audioProgressArc.style.transform = `rotate(-45deg)`; // Reseta a barra
        }
    }

    // Inicialização do estado do botão de áudio quando a página carrega
    if (musicSources.length > 0) {
        audioControlButton.disabled = false;
        currentMusicTitle.textContent = 'Clique para tocar.'; // Mensagem inicial clara
        updateAudioButtonState(); // Define o estado visual inicial como "off"
        console.log("Botão de áudio inicializado para 'Clique para tocar'.");
    } else {
        audioControlButton.disabled = true;
        currentMusicTitle.textContent = 'Nenhuma música disponível.';
        updateAudioButtonState(); // Define o estado visual inicial como "off" e desabilitado
        console.warn("Nenhuma música configurada. Botão de áudio desabilitado.");
    }


    // =====================================
    // 2. Seus Outros Scripts Existentes
    // (Mantidos e integrados aqui)
    // =====================================

    // Efeitos Sonoros de Clique
    const clickSound = new Audio('audios/effects/click.mp3');
    document.querySelectorAll('a, button[data-sound-effect="select"]').forEach(element => {
        // Evita conflito com o botão de áudio principal e seus filhos
        if (!element.closest('#audioControlButton')) {
             element.addEventListener('click', () => {
                // console.log("Click sound: Tentando tocar.");
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.error("Erro ao tocar som de clique:", e.message));
            });
        }
    });

    // Efeitos Sonoros de Hover
    const selectSound = new Audio('audios/effects/select.mp3');
    document.querySelectorAll(
        '.service-card, .role-category-card, .access-card, .event-card, .community-card, .partnership-card, .partnership-proposal-card'
    ).forEach(element => {
        element.addEventListener('mouseenter', () => {
            // console.log("Select sound: Tentando tocar.");
            selectSound.currentTime = 0;
            selectSound.play().catch(e => console.error("Erro ao tocar som de hover:", e.message));
        });
    });

    // Lógica de Copiar IP e Porta
    const copyIpPortBtn = document.getElementById('copyIpPortBtn');
    if (copyIpPortBtn) {
        copyIpPortBtn.addEventListener('click', () => {
            const ip = document.getElementById('serverIp').textContent;
            const port = document.getElementById('serverPort').textContent;
            const textToCopy = `${ip}:${port}`;
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('IP e Porta copiados: ' + textToCopy);
                console.log("IP e Porta copiados:", textToCopy);
            }).catch(err => {
                console.error('Erro ao copiar IP e Porta: ', err);
            });
        });
    }

    const copyAddressBtn = document.getElementById('copyAddressBtn');
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', () => {
            const address = document.getElementById('serverAddress').textContent;
            navigator.clipboard.writeText(address).then(() => {
                alert('Endereço copiado: ' + address);
                console.log("Endereço copiado:", address);
            }).catch(err => {
                console.error('Erro ao copiar Endereço: ', err);
            });
        });
    }

    const copyNewAccessBtn = document.getElementById('copyNewAccessBtn');
    if (copyNewAccessBtn) {
        copyNewAccessBtn.addEventListener('click', () => {
            const newAccessAddress = document.getElementById('newAccessAddress').textContent;
            navigator.clipboard.writeText(newAccessAddress).then(() => {
                alert('Endereço do Novo Acesso copiado: ' + newAccessAddress);
                console.log("Endereço do Novo Acesso copiado:", newAccessAddress);
            }).catch(err => {
                console.error('Erro ao copiar Endereço Adicional: ', err);
            });
        });
    }
});