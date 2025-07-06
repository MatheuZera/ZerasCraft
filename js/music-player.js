document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('backgroundMusic');
    const audioControlButton = document.getElementById('audioControlButton');
    const currentMusicTitle = document.getElementById('currentMusicTitle');
    const progressArc = audioControlButton.querySelector('.arc-progress'); // O caminho do arco de progresso SVG
    const audioIcons = {
        on: audioControlButton.querySelector('.on-icon'), // Ícone para quando está tocando/mutado
        off: audioControlButton.querySelector('.off-icon') // Ícone para quando está parado/desligado
    };

    // Playlist de exemplo. Adicione os nomes dos arquivos MP3 aqui.
    // Certifique-se de que os caminhos em <audio> <source> correspondam a estes.
    const playlist = [
        { title: "Bensound - Memories", src: "https://www.bensound.com/bensound-music/bensound-memories.mp3" },
        { title: "Bensound - Ukulele", src: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3" }
        // Adicione mais músicas aqui
    ];
    let currentTrackIndex = 0;

    const circumference = 100; // Circunferência total do nosso arco SVG para cálculo do progresso

    // Função para atualizar o arco de progresso
    function updateProgressBar() {
        if (!audio.paused && !audio.ended) {
            const percentage = (audio.currentTime / audio.duration) * 100;
            const offset = circumference - (percentage / 100) * circumference;
            progressArc.style.strokeDasharray = `${percentage}, ${circumference}`; // Preenche a porcentagem
            progressArc.style.strokeDashoffset = offset; // Move o início do traço
        } else {
            // Reinicia o progresso quando a música pausa ou termina
            progressArc.style.strokeDasharray = `0, ${circumference}`;
            progressArc.style.strokeDashoffset = circumference;
        }
    }

    // Função para carregar e reproduzir a próxima música da playlist
    function playNextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        audio.src = playlist[currentTrackIndex].src;
        currentMusicTitle.textContent = playlist[currentTrackIndex].title;
        audio.load(); // Recarrega a nova fonte
        audio.play().catch(e => console.error("Erro ao reproduzir a próxima música:", e));
    }

    // Função para carregar e iniciar a música com base no índice atual
    function loadAndPlayCurrentTrack() {
        audio.src = playlist[currentTrackIndex].src;
        currentMusicTitle.textContent = playlist[currentTrackIndex].title;
        audio.load();
        audio.play().then(() => {
            audioControlButton.classList.add('is-playing');
            audioIcons.on.style.display = 'none'; // Esconde ícone de "mute"
            audioIcons.off.style.display = 'inline-block'; // Mostra ícone de "volume"
        }).catch(e => {
            console.error("Erro ao iniciar a reprodução automática:", e);
            // Se a reprodução automática falhar (bloqueada pelo navegador),
            // mostramos o estado pausado e o usuário terá que interagir.
            audioControlButton.classList.remove('is-playing');
            audioIcons.on.style.display = 'inline-block';
            audioIcons.off.style.display = 'none';
            currentMusicTitle.textContent = "Clique para iniciar";
        });
    }

    // Verifica a preferência do usuário no localStorage ao carregar a página
    const userPrefersMusic = localStorage.getItem('musicEnabled');

    if (userPrefersMusic === 'true') {
        // Se a música estava ligada, tentamos reproduzir.
        // Alguns navegadores podem bloquear autoplay sem interação.
        loadAndPlayCurrentTrack();
    } else {
        // Se a música estava desligada ou nunca foi definida
        audio.pause();
        audioControlButton.classList.remove('is-playing');
        audioIcons.on.style.display = 'inline-block'; // Mostra ícone de "mute"
        audioIcons.off.style.display = 'none'; // Esconde ícone de "volume"
        currentMusicTitle.textContent = "Música Desligada";
    }

    // Event Listener para o clique no botão
    audioControlButton.addEventListener('click', () => {
        if (audio.paused) {
            // Se estiver pausado, tenta tocar
            loadAndPlayCurrentTrack(); // Tenta tocar a música atual
            localStorage.setItem('musicEnabled', 'true');
        } else {
            // Se estiver tocando, pausa
            audio.pause();
            audioControlButton.classList.remove('is-playing');
            audioIcons.on.style.display = 'inline-block'; // Mostra ícone de "mute"
            audioIcons.off.style.display = 'none'; // Esconde ícone de "volume"
            currentMusicTitle.textContent = "Música Desligada";
            localStorage.setItem('musicEnabled', 'false');
        }
    });

    // Event Listener para quando a música terminar (para playlist)
    audio.addEventListener('ended', () => {
        playNextTrack(); // Toca a próxima música
    });

    // Event Listener para atualizar a barra de progresso durante a reprodução
    audio.addEventListener('timeupdate', updateProgressBar);

    // Event Listener para lidar com o carregamento da metadados (para obter a duração)
    audio.addEventListener('loadedmetadata', updateProgressBar);
});