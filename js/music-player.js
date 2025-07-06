document.addEventListener('DOMContentLoaded', () => {
    // --- Referências aos Elementos DOM ---
    const backgroundMusic = document.getElementById('backgroundMusic');
    const audioControlButton = document.getElementById('audioControlButton');
    const centralMessage = document.getElementById('centralMessage');
    const progressArc = audioControlButton.querySelector('.arc-progress');
    const audioIcon = audioControlButton.querySelector('.audio-icon i'); // O ícone de música Font Awesome

    // --- Referência para o som de hover dos cards ---
    const cardHoverSound = document.getElementById('cardHoverSound');

    // --- Seleciona todos os cards ---
    // IMPORTANTE: Substitua '.card' pela CLASSE REAL dos seus cards.
    const cards = document.querySelectorAll('.card'); //

    // --- Playlist de Músicas ---
    const playlist = [
        { title: "Aria-Math", src: "audios/musics/Aria-Math.mp3" },
        { title: "Beginning 2", src: "audios/musics/Beginning 2.mp3" },
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

    // --- Funções do Player de Música ---

    function updateProgressBar() {
        if (!backgroundMusic.paused && !backgroundMusic.ended) {
            const percentage = (backgroundMusic.currentTime / backgroundMusic.duration) * 100;
            const offset = circumference - (percentage / 100) * circumference;
            progressArc.style.strokeDasharray = `${percentage}, ${circumference}`;
            progressArc.style.strokeDashoffset = offset;
        } else {
            progressArc.style.strokeDasharray = `0, ${circumference}`;
            progressArc.style.strokeDashoffset = circumference;
        }
    }

    function playNextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadAndPlayCurrentTrack(); // Carrega e toca a próxima música
    }

    // Atualiza o estado visual do botão (classe 'is-playing' e rotação do ícone)
    function updateButtonState(isPlaying) {
        if (isPlaying) {
            audioControlButton.classList.add('is-playing');
            // O ícone de música já está fixo, então não precisa alternar classes de ícone
        } else {
            audioControlButton.classList.remove('is-playing');
            // Garante que o ícone de música esteja sempre visível e sem rotação quando pausado
            audioIcon.style.transform = 'rotate(0deg)';
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

    if (userPrefersMusic === 'true') {
        // Tenta tocar a música se a preferência for 'true'
        loadAndPlayCurrentTrack();
    } else {
        // Garante que o estado inicial seja "desligado"
        backgroundMusic.pause();
        updateButtonState(false);
    }

    // --- Event Listeners ---

    // Listener para o clique no botão de controle de áudio
    audioControlButton.addEventListener('click', () => {
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
            if (cardHoverSound) {
                cardHoverSound.currentTime = 0; // Reinicia o áudio para que ele toque sempre do início
                cardHoverSound.play().catch(e => {
                    // console.warn("Erro ao tocar o som de hover do card:", e);
                    // Erros de reprodução automática sem interação explícita do usuário são comuns em navegadores.
                    // Manter em warn ou comentar para evitar poluir o console em produção.
                });
            }
        });
    });

    // --- Verificação para cliques em links (se eles não estiverem funcionando) ---
    // Se seus links não estão funcionando, pode ser que algum script esteja impedindo o comportamento padrão.
    // Este código é um exemplo e deve ser adaptado.
    // const allLinks = document.querySelectorAll('a');
    // allLinks.forEach(link => {
    //     link.addEventListener('click', (event) => {
    //         // Se você tem algum código que impede o comportamento padrão do link, como:
    //         // event.preventDefault();
    //         // Remova-o ou adicione uma lógica condicional para permitir a navegação.
    //         console.log("Link clicado:", link.href);
    //         // Se o link deve navegar, não adicione event.preventDefault() aqui.
    //     });
    // });
});