document.addEventListener('DOMContentLoaded', () => {
    // Função para exibir toast notifications
    function showToast(message, duration = 3000) {
        const toastContainer = document.querySelector('.toast-container') || (() => {
            const div = document.createElement('div');
            div.className = 'toast-container';
            document.body.appendChild(div);
            return div;
        })();

        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, duration);
    }

    // Funcionalidade de copiar IP/Porta e Endereço
    const copyIpPortBtn = document.getElementById('copyIpPortBtn');
    const copyAddressBtn = document.getElementById('copyAddressBtn');
    const copyNewAccessBtn = document.getElementById('copyNewAccessBtn'); // Novo botão

    if (copyIpPortBtn) {
        copyIpPortBtn.addEventListener('click', () => {
            const ip = document.getElementById('serverIp').textContent;
            const port = document.getElementById('serverPort').textContent;
            navigator.clipboard.writeText(`${ip}:${port}`)
                .then(() => showToast('IP e Porta copiados!'))
                .catch(err => console.error('Erro ao copiar IP e Porta:', err));
        });
    }

    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', () => {
            const address = document.getElementById('serverAddress').textContent;
            navigator.clipboard.writeText(address)
                .then(() => showToast('Endereço copiado!'))
                .catch(err => console.error('Erro ao copiar endereço:', err));
        });
    }

    // Funcionalidade para o novo botão de acesso
    if (copyNewAccessBtn) {
        copyNewAccessBtn.addEventListener('click', () => {
            const newAddress = document.getElementById('newAccessAddress').textContent;
            navigator.clipboard.writeText(newAddress)
                .then(() => showToast('Novo Endereço copiado!'))
                .catch(err => console.error('Erro ao copiar novo endereço:', err));
        });
    }

    // =========================================
    // Áudio de Fundo e Controles
    // =========================================
    const backgroundMusic = document.getElementById('backgroundMusic');
    const audioControlButton = document.getElementById('audioControlButton');
    const currentMusicTitleSpan = document.getElementById('currentMusicTitle');
    const selectSound = document.getElementById('selectSound');
    const hoverSound = document.getElementById('hoverSound'); // Novo elemento de áudio para hover

    let isPlaying = false;
    let currentTrackIndex = 0;
    const playlist = Array.from(backgroundMusic.querySelectorAll('source')).map(source => ({
        src: source.src,
        title: source.dataset.title || 'Música Desconhecida'
    }));

    // Função para tocar o som de clique
    function playSelectSound() {
        if (selectSound && !selectSound.paused) {
            selectSound.pause();
            selectSound.currentTime = 0;
        }
        if (selectSound) {
            selectSound.play().catch(e => console.log("Erro ao tocar som de clique:", e));
        }
    }

    // Função para tocar o som de hover
    function playHoverSound() {
        if (hoverSound && !hoverSound.paused) {
            hoverSound.pause();
            hoverSound.currentTime = 0;
        }
        if (hoverSound) {
            hoverSound.play().catch(e => console.log("Erro ao tocar som de hover:", e));
        }
    }

    function loadAndPlayTrack(index) {
        if (playlist.length === 0) {
            console.warn("Playlist vazia, não há músicas para tocar.");
            currentMusicTitleSpan.textContent = "Nenhuma Música";
            return;
        }
        currentTrackIndex = index % playlist.length;
        if (currentTrackIndex < 0) {
            currentTrackIndex = playlist.length - 1;
        }
        backgroundMusic.src = playlist[currentTrackIndex].src;
        currentMusicTitleSpan.textContent = playlist[currentTrackIndex].title;
        backgroundMusic.load(); // Garante que a nova fonte seja carregada
        
        if (isPlaying) {
            backgroundMusic.play().catch(e => {
                console.error("Erro ao tentar tocar música:", e);
                // Autoplay pode ser bloqueado, atualiza o UI para refletir isso
                isPlaying = false;
                audioControlButton.classList.remove('on');
                audioControlButton.classList.add('off');
                audioControlButton.innerHTML = '<i class="fas fa-volume-mute"></i> <span>Música Desativada</span>';
            });
        }
    }

    function toggleAudio() {
        playSelectSound(); // Toca o som de clique ao interagir com o botão de áudio

        if (isPlaying) {
            backgroundMusic.pause();
            audioControlButton.classList.remove('on');
            audioControlButton.classList.add('off');
            audioControlButton.innerHTML = '<i class="fas fa-volume-mute"></i> <span>Música Desativada</span>';
            isPlaying = false;
        } else {
            // Tenta tocar a música, tratando a possível rejeição do autoplay
            backgroundMusic.play().then(() => {
                audioControlButton.classList.remove('off');
                audioControlButton.classList.add('on');
                audioControlButton.innerHTML = '<i class="fas fa-volume-up"></i> <span>' + playlist[currentTrackIndex].title + '</span>';
                isPlaying = true;
            }).catch(e => {
                console.error("Autoplay impedido ou outro erro ao tocar:", e);
                showToast("Para ouvir a música, por favor, interaja com a página primeiro.", 5000);
                // Garante que o estado do botão permaneça "mute" se o play falhar
                audioControlButton.classList.remove('on');
                audioControlButton.classList.add('off');
                audioControlButton.innerHTML = '<i class="fas fa-volume-mute"></i> <span>Música Desativada</span>';
                isPlaying = false;
            });
        }
    }

    // Inicializa o botão com base no estado inicial
    function initializeAudioButton() {
        if (backgroundMusic.paused) {
            audioControlButton.classList.add('off');
            audioControlButton.innerHTML = '<i class="fas fa-volume-mute"></i> <span>Música Desativada</span>';
            isPlaying = false;
        } else {
            audioControlButton.classList.add('on');
            audioControlButton.innerHTML = '<i class="fas fa-volume-up"></i> <span>' + playlist[currentTrackIndex].title + '</span>';
            isPlaying = true;
        }
    }

    // Tenta tocar automaticamente (pode ser bloqueado pelo navegador)
    backgroundMusic.play().then(() => {
        isPlaying = true;
        initializeAudioButton();
    }).catch(e => {
        console.warn("Autoplay inicial bloqueado. O áudio começará mudo. Erro:", e);
        isPlaying = false;
        initializeAudioButton();
    });

    audioControlButton.addEventListener('click', toggleAudio);

    // Carrega a primeira faixa ao iniciar
    loadAndPlayTrack(currentTrackIndex);

    // Escuta o evento 'ended' para tocar a próxima música
    backgroundMusic.addEventListener('ended', () => {
        loadAndPlayTrack(currentTrackIndex + 1);
    });

    // =========================================
    // Efeitos Sonoros de Hover nos Ícones dos Títulos
    // =========================================
    // Seleciona todos os ícones dentro dos elementos <h2> que têm o atributo data-sound-effect
    const titleIcons = document.querySelectorAll('h2 i[data-sound-effect]');

    titleIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            // Verifica se a música de fundo está tocando antes de tocar o som de hover
            // Isso evita sobrecarga de áudio se o usuário não quiser áudio
            if (isPlaying) { // Só toca se a música de fundo estiver ativa
                playHoverSound();
            }
        });
    });

    // Adiciona o som de clique aos botões de cópia para feedback visual/auditivo
    const copyButtons = document.querySelectorAll('.access-card .btn-primary');
    copyButtons.forEach(button => {
        button.addEventListener('click', playSelectSound);
    });
});