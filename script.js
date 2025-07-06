document.addEventListener('DOMContentLoaded', () => {
    const playAudioBtn = document.getElementById('playAudioBtn');
    const audioPlayer = new Audio();
    audioPlayer.loop = false; // Queremos que toque uma vez e vá para a próxima
    audioPlayer.volume = 0.5; // Começa com volume médio
    let currentMusicIndex = 0;
    let isPlaying = false;

    // Elementos do toast e do arco de progresso
    const audioInfoToast = document.getElementById('audioInfoToast');
    const progressBarArc = playAudioBtn.querySelector('span');

    const musicList = [
        'audios/musics/Aria-Math-Lofi-Remake.mp3',
        'audios/musics/Aria-Math.mp3',
        'audios/musics/Begining.mp3',
        'audios/musics/Biome-Fest.mp3',
        'audios/musics/Blind-Spots.mp3',
        'audios/musics/Clark.mp3',
        'audios/musics/Danny.mp3',
        'audios/musics/Dreiton.mp3',
        'audios/musics/Dry-Hands.mp3',
        'audios/musics/Floating-Trees.mp3',
        'audios/musics/Haggstrom.mp3',
        'audios/musics/haunt-Muskie.mp3',
        'audios/musics/Key.mp3',
        'audios/musics/Living-Mice.mp3',
        'audios/musics/Mice-On-Venus.mp3',
        'audios/musics/Minecraft.mp3',
        'audios/musics/Moog-City-2.mp3',
        'audios/musics/Mutation.mp3',
        'audios/musics/Oxygène.mp3',
        'audios/musics/Subwoofer-Lullaby.mp3',
        'audios/musics/Sweden.mp3',
        'audios/musics/Taswell.mp3',
        'audios/musics/Wet-Hands.mp3',
    ];

    // Shuffle music list
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffleArray(musicList); // Embaralha a lista de músicas ao carregar

    // Função para extrair o nome da música do caminho
    function getMusicName(path) {
        const parts = path.split('/');
        const fileName = parts[parts.length - 1]; // Obtém "NomeDaMusica.mp3"
        return fileName.replace('.mp3', '').replace(/-/g, ' '); // Remove .mp3 e substitui hífens por espaços
    }

    // Função para mostrar o toast da música
    function showAudioInfoToast(message) {
        audioInfoToast.textContent = message;
        audioInfoToast.classList.remove('animate-toast'); // Reseta a animação se já estiver rodando
        audioInfoToast.classList.add('show');

        // Força o reflow para reiniciar a animação
        void audioInfoToast.offsetWidth;
        audioInfoToast.classList.add('animate-toast');

        // Esconde o toast após a animação
        setTimeout(() => {
            audioInfoToast.classList.remove('show', 'animate-toast');
        }, 4000); // Duração total da animação (4s)
    }

    // Função para tocar a próxima música na playlist
    function playNextMusic() {
        if (musicList.length === 0) {
            console.warn("Nenhuma música na lista.");
            return;
        }

        audioPlayer.src = musicList[currentMusicIndex];
        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                playAudioBtn.classList.add('play-audio-btn-on');
                playAudioBtn.classList.remove('play-audio-btn-off', 'animating');
                const musicName = getMusicName(musicList[currentMusicIndex]);
                showAudioInfoToast(`Tocando: ${musicName}`);
                progressBarArc.style.transition = 'transform linear'; // Volta a transição para o arco
            })
            .catch(error => {
                console.error("Erro ao tocar música:", error);
                isPlaying = false;
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
                playAudioBtn.classList.add('animating'); // Re-adiciona animação se houver erro ao tocar
            });

        currentMusicIndex = (currentMusicIndex + 1) % musicList.length; // Avança para a próxima música (loop)
    }

    // Event Listener para o botão de áudio
    playAudioBtn.addEventListener('click', () => {
        if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            playAudioBtn.classList.remove('play-audio-btn-on');
            playAudioBtn.classList.add('play-audio-btn-off');
            playAudioBtn.classList.add('animating'); // Adiciona animação quando pausado
            progressBarArc.style.transform = 'rotate(0deg)'; // Reseta o arco
            progressBarArc.style.transition = 'none'; // Remove transição para o reset
        } else {
            // Tenta tocar a música atual ou a próxima se for a primeira vez
            if (!audioPlayer.src || audioPlayer.paused) {
                playNextMusic();
            } else {
                audioPlayer.play()
                    .then(() => {
                        isPlaying = true;
                        playAudioBtn.classList.add('play-audio-btn-on');
                        playAudioBtn.classList.remove('play-audio-btn-off', 'animating');
                        // Mostra o toast novamente se a música estava pausada
                        const musicName = getMusicName(audioPlayer.src); // Pega o nome da música que está pausada/retomando
                        showAudioInfoToast(`Retomando: ${musicName}`);
                        progressBarArc.style.transition = 'transform linear'; // Volta a transição para o arco
                    })
                    .catch(error => {
                        console.error("Erro ao retomar música:", error);
                        playAudioBtn.classList.remove('play-audio-btn-on');
                        playAudioBtn.classList.add('play-audio-btn-off');
                        playAudioBtn.classList.add('animating'); // Re-adiciona animação se houver erro ao retomar
                    });
            }
        }
    });

    // Atualiza o progresso do arco
    audioPlayer.addEventListener('timeupdate', () => {
        if (isPlaying && !isNaN(audioPlayer.duration)) { // Verifica se duration é um número válido
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 360; // 0 a 360 graus
            progressBarArc.style.transform = `rotate(${progress}deg)`;
        }
    });

    // Quando a música termina, toca a próxima
    audioPlayer.addEventListener('ended', () => {
        playNextMusic();
    });

    // Início: Adiciona a animação "pulsante" ao botão se a música não estiver tocando
    if (!isPlaying) {
        playAudioBtn.classList.add('animating');
    }

    // Função de showToast genérica (mantida para outros usos, se houver)
    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.classList.add('toast-notification');
        toast.textContent = message;
        document.body.appendChild(toast);

        void toast.offsetWidth; // Force reflow
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            }, { once: true });
        }, duration);
    }

    // Lógica para copiar IP/Porta
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target;
            let textToCopy = '';

            if (targetId === 'bedrock-ip-port') {
                const ip = this.dataset.ip;
                const port = this.dataset.port;
                textToCopy = `${ip}:${port}`;
            } else if (targetId === 'java-address' || targetId === 'new-access-address') {
                textToCopy = this.dataset.ip;
            }

            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast('Copiado para a área de transferência!');
            }).catch(err => {
                console.error('Erro ao copiar: ', err);
                showToast('Erro ao copiar. Tente novamente.');
            });
        });
    });
});