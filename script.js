document.addEventListener('DOMContentLoaded', () => {
    console.log("Script principal carregado. DOM Content Loaded.");

    // =====================================
    // 1. Controle de Áudio de Fundo
    // =====================================
    const audio = document.getElementById('backgroundMusic');
    const audioControlButton = document.getElementById('audioControlButton');
    const currentMusicTitle = document.getElementById('currentMusicTitle');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const onIcon = audioControlButton.querySelector('.on-icon');   // Ícone com X
    const offIcon = audioControlButton.querySelector('.off-icon'); // Ícone sem X

    // Coleta todas as fontes de música do HTML
    const musicSources = Array.from(audio.querySelectorAll('source')).map(source => ({
        src: source.src,
        title: source.dataset.title || 'Música Desconhecida' // Usa data-title ou um fallback
    }));

    let currentMusicIndex = -1; // Índice da música atualmente selecionada
    let isPlaying = false;      // Estado de reprodução da música de fundo

    console.log(`Músicas encontradas: ${musicSources.length}`, musicSources);

    // Função para atualizar o estado visual do botão (classes, ícones, texto)
    function updateAudioButtonState() {
        console.log(`updateAudioButtonState: isPlaying = ${isPlaying}`);

        if (isPlaying) {
            audioControlButton.classList.remove('off');
            audioControlButton.classList.add('on');
            onIcon.style.display = 'inline-block'; // Mostra o ícone de mute (com X)
            offIcon.style.display = 'none';        // Esconde o ícone de volume normal
            audioControlButton.setAttribute('aria-label', `Música tocando: ${currentMusicTitle.textContent}. Clique para pausar.`);
            updateProgressBar(); // Inicia/continua a atualização da barra de progresso
        } else {
            audioControlButton.classList.remove('on');
            audioControlButton.classList.add('off');
            onIcon.style.display = 'none';          // Esconde o ícone de mute
            offIcon.style.display = 'inline-block'; // Mostra o ícone de volume normal
            audioControlButton.setAttribute('aria-label', 'Música pausada. Clique para tocar.');
            audioProgressArc.style.transform = `rotate(-45deg)`; // Reseta a barra de progresso
            // O texto 'Desligado' ou 'Erro ao tocar música' já é definido por playRandomMusic ou pauseMusic
        }
    }

    // Função para reproduzir uma música aleatória
    function playRandomMusic() {
        console.log("playRandomMusic: Tentando iniciar reprodução...");

        if (musicSources.length === 0) {
            currentMusicTitle.textContent = 'Nenhuma música encontrada.';
            audioControlButton.disabled = true;
            isPlaying = false;
            updateAudioButtonState();
            console.warn("Nenhuma fonte de música configurada no HTML.");
            return;
        }

        let randomIndex;
        if (musicSources.length > 1) {
            // Garante que a próxima música seja diferente da atual, se houver mais de uma
            do {
                randomIndex = Math.floor(Math.random() * musicSources.length);
            } while (randomIndex === currentMusicIndex);
        } else {
            // Se houver apenas uma música, toque-a
            randomIndex = 0;
        }

        currentMusicIndex = randomIndex;
        const selectedMusic = musicSources[currentMusicIndex];

        audio.src = selectedMusic.src; // Define a fonte da música
        audio.load(); // Carrega a nova fonte (essencial para alguns navegadores/cenários)

        console.log(`playRandomMusic: Carregando '${selectedMusic.title}' de '${selectedMusic.src}'`);

        // Tenta tocar a música
        audio.play()
            .then(() => {
                isPlaying = true;
                currentMusicTitle.textContent = selectedMusic.title;
                updateAudioButtonState(); // Atualiza para o estado ON
                console.log(`playRandomMusic: Reproduzindo '${selectedMusic.title}' com sucesso.`);
            })
            .catch(error => {
                isPlaying = false; // Garante que o estado seja falso se houver erro
                currentMusicTitle.textContent = 'Erro ao tocar música.';
                updateAudioButtonState(); // Atualiza para o estado OFF (com mensagem de erro)
                console.error(`playRandomMusic: Falha ao reproduzir '${selectedMusic.title}' de '${selectedMusic.src}':`, error);

                // Tipos de erro comuns:
                // DOMException: The play() request was interrupted by a call to pause() - normal ao alternar rapidamente
                // NotAllowedError: play() failed because the user didn't interact with the document first. - autoplay bloqueado
                // NotSupportedError: The element has no supported sources. - caminho do áudio errado ou formato não suportado

                // Se o erro for um bloqueio de autoplay (NotAllowedError), não tentamos a próxima automaticamente.
                // Se for um erro de carregamento ou outro problema, podemos tentar a próxima.
                if (error.name !== 'NotAllowedError' && musicSources.length > 1) {
                    console.log("Tentando a próxima música devido a um erro de reprodução...");
                    setTimeout(playRandomMusic, 1000); // Tenta a próxima após 1 segundo
                }
            });
    }

    // Função para pausar a música
    function pauseMusic() {
        console.log("pauseMusic: Pausando reprodução.");
        audio.pause();
        isPlaying = false;
        currentMusicTitle.textContent = 'Desligado'; // Volta o texto para "Desligado"
        updateAudioButtonState(); // Atualiza para o estado OFF
    }

    // Event Listener para o clique no botão de controle de áudio
    audioControlButton.addEventListener('click', () => {
        console.log("Botão de controle de áudio clicado. isPlaying antes do toggle:", isPlaying);
        if (isPlaying) {
            pauseMusic();
        } else {
            playRandomMusic();
        }
    });

    // Evento quando a música termina de tocar (para autoplay da próxima)
    audio.addEventListener('ended', () => {
        console.log("Evento 'ended' disparado. Reproduzindo próxima música aleatória.");
        playRandomMusic();
    });

    // Evento de erro geral do elemento de áudio (para debug)
    audio.addEventListener('error', (e) => {
        console.error("Erro no elemento <audio>:", e);
        // isPlaying já deve ser false se o erro for do play() promise, mas garante aqui
        isPlaying = false;
        currentMusicTitle.textContent = 'Erro de áudio!';
        updateAudioButtonState();
    });

    // Função para atualizar a barra de progresso circular
    function updateProgressBar() {
        if (isPlaying && !isNaN(audio.duration) && audio.duration > 0) {
            const progress = (audio.currentTime / audio.duration); // Progresso de 0 a 1
            const rotation = progress * 360; // Rotação total em graus
            audioProgressArc.style.transform = `rotate(${rotation - 45}deg)`; // -45deg para alinhar o início no topo

            requestAnimationFrame(updateProgressBar); // Solicita o próximo frame
        } else {
            audioProgressArc.style.transform = `rotate(-45deg)`; // Reseta a barra
        }
    }

    // Inicialização do estado do botão de áudio quando a página carrega
    // Começa no estado "Desligado"
    if (musicSources.length > 0) {
        audioControlButton.disabled = false; // Habilita o botão
        audioControlButton.classList.add('off'); // Garante a classe 'off'
        currentMusicTitle.textContent = 'Desligado'; // Texto inicial
        onIcon.style.display = 'none';            // Ícone X escondido
        offIcon.style.display = 'inline-block';  // Ícone normal visível
        console.log("Botão de áudio inicializado para o estado 'Desligado'.");
    } else {
        audioControlButton.disabled = true; // Desabilita o botão se não houver músicas
        currentMusicTitle.textContent = 'Nenhuma música disponível.';
        audioControlButton.classList.add('off');
        onIcon.style.display = 'none';
        offIcon.style.display = 'inline-block';
        console.warn("Nenhuma música configurada. Botão de áudio desabilitado.");
    }


    // =====================================
    // 2. Seus Outros Scripts Existentes
    // (Mantidos e integrados aqui)
    // =====================================

    // Efeitos Sonoros de Clique
    const clickSound = new Audio('audios/effects/click.mp3'); // Verifique o caminho!
    document.querySelectorAll('a, button[data-sound-effect="select"]').forEach(element => {
        if (!element.classList.contains('audio-control-button')) { // Evita conflito com o botão de áudio principal
             element.addEventListener('click', () => {
                console.log("Click sound: Tentando tocar.");
                clickSound.currentTime = 0; // Reinicia o áudio para tocar múltiplas vezes
                clickSound.play().catch(e => console.error("Erro ao tocar som de clique:", e));
            });
        }
    });

    // Efeitos Sonoros de Hover
    const selectSound = new Audio('audios/effects/select.mp3'); // Verifique o caminho!
    document.querySelectorAll(
        '.service-card, .role-category-card, .access-card, .event-card, .community-card, .partnership-card, .partnership-proposal-card'
    ).forEach(element => {
        element.addEventListener('mouseenter', () => {
            console.log("Select sound: Tentando tocar.");
            selectSound.currentTime = 0; // Reinicia o áudio
            selectSound.play().catch(e => console.error("Erro ao tocar som de hover:", e));
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