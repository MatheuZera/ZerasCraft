document.addEventListener('DOMContentLoaded', function() {
    const playAudioBtn = document.getElementById('playAudioBtn');
    const backgroundAudio = document.getElementById('backgroundAudio');
    let isPlaying = false;
    let currentTrackIndex = 0;

    // Lista de músicas, ajuste os caminhos conforme sua estrutura
    const musicTracks = [
        'audios/musics/Aria-Math-Lofi-Remake.mp3',
        'audios/musics/Aria-Math.mp3',
        'audios/musics/Begining.mp3',
        'audios/musics/Biome-Fest.mp3',
        'audios/musics/Blind-Spots.mp3',
        'audios/musics/Clark.mp3',
        'audios/musics/Danny.mp3',
        'audios/musics/Dreiton.mp3',
        'audios/musics/Dry-Hands.mp3',
        'audios/musics/Floating.mp3',
        'audios/musics/Haggstrom.mp3',
        'audios/musics/haunt-Muskie.mp3',
        'audios/musics/Key.mp3',
        'audios/musics/Living-Mice.mp3',
        'audios/musics/Minecraft.mp3',
        'audios/musics/Moong-City.mp3',
        'audios/musics/Mutation.mp3',
        'audios/musics/Oxygène.mp3',
        'audios/musics/Subwoofer-Lullaby.mp3',
        'audios/musics/Sweden.mp3',
        'audios/musics/Taswell.mp3',
        'audios/musics/Wet-Hands.mp3',
    ];

    // Função para carregar e tocar a próxima música
    function playNextTrack() {
        if (musicTracks.length === 0) return;

        backgroundAudio.src = musicTracks[currentTrackIndex];
        backgroundAudio.play()
            .then(() => {
                isPlaying = true;
                playAudioBtn.classList.add('play-audio-btn-on');
                playAudioBtn.classList.remove('play-audio-btn-off', 'animating'); // Remove animação quando tocando
                console.log('Música tocando:', musicTracks[currentTrackIndex]);
            })
            .catch(error => {
                console.error('Erro ao tentar tocar a música:', error);
                isPlaying = false;
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
                // Tenta a próxima música automaticamente em caso de erro de reprodução
                currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
                setTimeout(playNextTrack, 1000); // Tenta a próxima em 1 segundo
            });
    }

    // Event listener para quando a música termina
    backgroundAudio.addEventListener('ended', () => {
        console.log('Música terminou:', musicTracks[currentTrackIndex]);
        currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
        playNextTrack();
    });

    // Event listener para o botão de play/pause
    playAudioBtn.addEventListener('click', () => {
        if (isPlaying) {
            backgroundAudio.pause();
            isPlaying = false;
            playAudioBtn.classList.remove('play-audio-btn-on');
            playAudioBtn.classList.add('play-audio-btn-off');
            playAudioBtn.classList.add('animating'); // Adiciona animação quando pausado
        } else {
            playNextTrack(); // Toca a música atual ou a próxima
        }
    });

    // Função para verificar a interação do usuário e mostrar o botão
    function checkUserInteraction() {
        if (document.visibilityState === 'visible' && !isPlaying && backgroundAudio.paused) {
            playAudioBtn.style.display = 'flex'; // Mostra o botão
            playAudioBtn.classList.add('animating'); // Começa a animar para chamar atenção
        }
    }

    // Chama a função ao carregar a página e ao mudar a visibilidade da aba
    window.addEventListener('load', checkUserInteraction);
    document.addEventListener('visibilitychange', checkUserInteraction);

    // Adiciona o tratamento para AutoPlay Policy do Chrome
    // Se o áudio não tocar automaticamente no primeiro click, tente este método alternativo
    // backgroundAudio.play().catch(error => {
    //     console.log('Autoplay impedido. Botão de play será mostrado.');
    //     playAudioBtn.style.display = 'flex';
    //     playAudioBtn.classList.add('animating');
    // });
});