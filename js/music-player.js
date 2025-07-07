document.addEventListener('DOMContentLoaded', () => {
    // --- Referências aos Elementos DOM ---
    const backgroundMusic = document.getElementById('backgroundMusic');
    const audioControlButton = document.getElementById('audioControlButton');
    const centralMessage = document.getElementById('centralMessage');
    const progressArc = audioControlButton.querySelector('.arc-progress');

    // Referências aos ícones específicos
    const onIcon = audioControlButton.querySelector('.on-icon'); // Ícone de "volume-up"
    const offIcon = audioControlButton.querySelector('.off-icon'); // Ícone de "volume-mute"

    // --- Referência para os sons de efeito ---
    const cardHoverSound = document.getElementById('cardHoverSound');
    const clickSound = document.getElementById('clickSound'); // Referência para o click.mp3
    const selectSound = document.getElementById('selectSound'); // Referência para o select.mp3

    // --- Seleciona todos os cards ---
    const cards = document.querySelectorAll('.card');

    // --- Playlist de Músicas ---
    const playlist = [
        { title: "Aria-Math", src: "audios/musics/Aria-Math.mp3" },
        { title: "Beginning 2", src: "audios/musics/Beginning-2.mp3" },
        { title: "Biome-Fest", src: "audios/musics/Biome-Fest.mp3" },
        { title: "Blind-Spots", src: "audios/musics/Blind-Spots.mp3" },
        { title: "Clark", src: "audios/musics/Clark.mp3" },
        { title: "Danny", src: "audios/musics/Danny.mp3" },
        { title: "Dreiton", src: "audios/musics/Dreiton.mp3" },
        { title: "Dry-Hands", src: "audios/musics/Dry-Hands.mp3" },
        { title: "Floating-Trees", src: "audios/musics/Floating-Trees.mp3" },
        { title: "Haggstrom", src: "audios/musics/Haggstrom.mp3" },
        { title: "Key", src: "audios/musics/Key.mp3" },
        { title: "Living-Mice", src: "audios/musics/Living-Mice.mp3" },
        { title: "Mice-On-Venus", src: "audios/musics/Mice-On-Venus.mp3" },
        { title: "Minecraft", src: "audios/musics/Minecraft.mp3" },
        { title: "Moog-City 2", src: "audios/musics/Moog-City 2.mp3" },
        { title: "Mutation", src: "audios/musics/Mutation.mp3" },
        { title: "Sweden", src: "audios/musics/Sweden.mp3" },
        { title: "Taswell", src: "audios/musics/Taswell.mp3" },
        { title: "Wet-Hands", src: "audios/musics/Wet-Hands.mp3" }
    ];
    let currentTrackIndex = 0;
    const circumference = 100; // Valor para o SVG do progresso
    let messageTimeout; // Para controlar o timeout da mensagem central

    // --- Funções Auxiliares de Áudio ---

    // Função genérica para tocar efeitos sonoros
    function playSoundEffect(audioElement) {
        if (audioElement) {
            audioElement.currentTime = 0; // Reinicia o áudio
            audioElement.play().catch(e => {
                // console.warn("Erro ao tocar efeito sonoro:", e);
                // Captura erros de reprodução automática sem interação do usuário
            });
        }
    }

    // --- Funções do Player de Música ---

    function updateProgressBar() {
        if (!backgroundMusic.paused && !backgroundMusic.ended && backgroundMusic.duration > 0) {
            const percentage = (backgroundMusic.currentTime / backgroundMusic.duration) * 100;
            const offset = circumference - (percentage / 100) * circumference;
            progressArc.style.strokeDasharray = `${circumference}, ${circumference}`; // Define o tamanho total do círculo
            progressArc.style.strokeDashoffset = offset; // Define o quanto do círculo deve ser preenchido
        } else {
            // Reinicia a barra de progresso quando a música está pausada ou não iniciada
            progressArc.style.strokeDasharray = `0, ${circumference}`;
            progressArc.style.strokeDashoffset = circumference;
        }
    }

    function playNextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadAndPlayCurrentTrack(); // Carrega e toca a próxima música
    }

    // Atualiza o estado visual do botão (classe 'is-playing' e troca de ícones)
    function updateButtonState(isPlaying) {
        if (isPlaying) {
            audioControlButton.classList.add('is-playing');
            onIcon.style.display = 'inline-block'; // Mostra o ícone de volume-up
            offIcon.style.display = 'none'; // Esconde o ícone de volume-mute
        } else {
            audioControlButton.classList.remove('is-playing');
            onIcon.style.display = 'none'; // Esconde o ícone de volume-up
            offIcon.style.display = 'inline-block'; // Mostra o ícone de volume-mute
        }
    }

    // Exibe a mensagem central na tela
    function showCentralMessage(message) {
        centralMessage.textContent = message;
        centralMessage.classList.add('show');

        clearTimeout(messageTimeout); // Limpa qualquer timeout anterior

        // Define um timeout para remover a mensagem após 3 segundos
        messageTimeout = setTimeout(() => {
            centralMessage.classList.remove('show');
        }, 3000);
    }

    // Carrega e tenta tocar a música atual da playlist
    function loadAndPlayCurrentTrack() {
        const currentTrack = playlist[currentTrackIndex];
        if (!currentTrack) {
            showCentralMessage("Erro: Playlist vazia ou música não encontrada.");
            console.error("Playlist vazia ou índice de música inválido.");
            updateButtonState(false);
            return;
        }

        backgroundMusic.src = currentTrack.src;
        backgroundMusic.load(); // Recarrega a nova fonte

        backgroundMusic.play().then(() => {
            updateButtonState(true); // Música tocando
            showCentralMessage(`Tocando: ${currentTrack.title}`);
        }).catch(e => {
            console.error("Erro ao iniciar a reprodução automática:", e);
            updateButtonState(false); // Música pausada ou não iniciada
            showCentralMessage("Clique para iniciar a música");
            // Se a reprodução automática falhar, o usuário terá que interagir.
        });
    }

    // --- Inicialização ao Carregar a Página ---
    const userPrefersMusic = localStorage.getItem('musicEnabled');

    // Define o estado inicial do botão e da música
    if (userPrefersMusic === 'true') {
        // Tenta tocar a música se a preferência for 'true'
        loadAndPlayCurrentTrack();
    } else {
        // Garante que o estado inicial seja "desligado"
        backgroundMusic.pause();
        updateButtonState(false); // Define o ícone inicial como volume-mute
    }

    // --- Event Listeners ---

    // Listener para o clique no botão de controle de áudio
    audioControlButton.addEventListener('click', () => {
        // Toca o som de clique ao interagir com o botão principal
        playSoundEffect(clickSound);

        if (backgroundMusic.paused) {
            loadAndPlayCurrentTrack();
            localStorage.setItem('musicEnabled', 'true');
        } else {
            backgroundMusic.pause();
            updateButtonState(false);
            showCentralMessage("Música Pausada");
            localStorage.setItem('musicEnabled', 'false');
        }
    });

    // Listener para quando a música atual termina
    backgroundMusic.addEventListener('ended', playNextTrack);

    // Listeners para atualizar a barra de progresso
    backgroundMusic.addEventListener('timeupdate', updateProgressBar);
    backgroundMusic.addEventListener('loadedmetadata', updateProgressBar);

    // --- Listener para o som de hover dos cards ---
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            playSoundEffect(cardHoverSound); // Usa a função auxiliar
        });
    });

    // Adicione um listener de clique a todos os cards para tocar o som de "select"
    cards.forEach(card => {
        card.addEventListener('click', () => {
            playSoundEffect(selectSound); // Toca o som de select ao clicar no card
        });
    });
});