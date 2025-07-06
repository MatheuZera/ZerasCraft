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
    const selectSound = document.getElementById('selectSound'); // Elemento de áudio para click.mp3
    const hoverSound = document.getElementById('hoverSound');   // Elemento de áudio para hover.mp3

    let isPlaying = false;
    let currentTrackIndex = 0;
    const playlist = Array.from(backgroundMusic.querySelectorAll('source')).map(source => ({
        src: source.src,
        title: source.dataset.title || 'Música Desconhecida'
    }));

    // Função genérica para tocar um som
    function playAudioElement(audioElement) {
        if (!audioElement) {
            console.warn("Elemento de áudio não encontrado para reprodução.");
            return;
        }
        // Para permitir que o som toque novamente rapidamente (múltiplos cliques/hovers)
        if (!audioElement.paused) {
            audioElement.pause();
            audioElement.currentTime = 0; // Reinicia o som
        }
        audioElement.play().catch(e => {
            // Captura o erro se o autoplay for bloqueado ou se o arquivo não for encontrado
            console.log(`Erro ao tocar som: ${audioElement.id || 'desconhecido'} - ${e.message}`, e);
            // Opcional: mostrar um toast para o usuário se o som é importante
            // showToast("Clique na página para ativar os sons!", 3000); 
        });
    }

    // Funções específicas para os sons (agora usando playAudioElement)
    function playSelectSound() {
        playAudioElement(selectSound);
    }

    function playHoverSound() {
        // Altere esta condição conforme sua preferência:
        // Se quiser que o som de hover toque SEMPRE: remova 'if (isPlaying)'
        // Se quiser que o som de hover toque APENAS quando a música de fundo estiver ativa: mantenha 'if (isPlaying)'
        if (isPlaying) { 
            playAudioElement(hoverSound);
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
                console.error("Erro ao tentar tocar música (autoplay pode estar bloqueado):", e);
                isPlaying = false; // Atualiza o estado para refletir que não está tocando
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
            backgroundMusic.play().then(() => {
                audioControlButton.classList.remove('off');
                audioControlButton.classList.add('on');
                audioControlButton.innerHTML = '<i class="fas fa-volume-up"></i> <span>' + playlist[currentTrackIndex].title + '</span>';
                isPlaying = true;
            }).catch(e => {
                console.error("Autoplay impedido ou outro erro ao tocar:", e);
                showToast("Para ouvir a música, por favor, interaja com a página primeiro.", 5000);
                audioControlButton.classList.remove('on');
                audioControlButton.classList.add('off');
                audioControlButton.innerHTML = '<i class="fas fa-volume-mute"></i> <span>Música Desativada</span>';
                isPlaying = false;
            });
        }
    }

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

    if (audioControlButton) {
        audioControlButton.addEventListener('click', toggleAudio);
    }

    // Carrega a primeira faixa ao iniciar
    loadAndPlayTrack(currentTrackIndex);

    // Escuta o evento 'ended' para tocar a próxima música
    backgroundMusic.addEventListener('ended', () => {
        loadAndPlayTrack(currentTrackIndex + 1);
    });

    // =========================================
    // Efeitos Sonoros de Interação (Cliques e Hovers)
    // =========================================

    // 1. Ícones de Título (H2) - Som de hover
    const titleIcons = document.querySelectorAll('h2 i[data-sound-effect]');
    titleIcons.forEach(icon => {
        icon.addEventListener('mouseenter', playHoverSound);
        // Opcional: Se quiser um som de clique nos ícones do título também, descomente a linha abaixo
        // icon.addEventListener('click', playSelectSound); 
    });

    // 2. Botões de Copiar (Acesso ao Servidor) - Som de clique
    // Esta parte já estava funcional.
    const copyButtons = document.querySelectorAll('.access-card .btn-primary');
    copyButtons.forEach(button => {
        button.addEventListener('click', playSelectSound);
    });

    // 3. Botões de "Saiba Mais" e outros links/botões genéricos - Som de clique
    // Alvo: botões com a classe 'btn-link', e todos os 'btn-primary' exceto os de cópia (já tratados acima),
    // e botões com a classe 'saiba-mais-btn'.
    const generalLinksButtons = document.querySelectorAll('.btn-link, .btn-primary:not(.access-card .btn-primary), .saiba-mais-btn');
    generalLinksButtons.forEach(button => {
        button.addEventListener('click', playSelectSound);
    });

    // 4. Cards Inteiros - Som de clique (e opcionalmente hover)
    // Inclui todos os tipos de cards para um som ao clicar em qualquer parte deles.
    // Garantimos que o som não seja duplicado se o clique for em um botão/link dentro do card.
    const clickableCards = document.querySelectorAll(
        '.service-card, .role-card, .event-card, .collaborator-card, .partnership-card, .access-card'
    );

    clickableCards.forEach(card => {
        card.addEventListener('click', (event) => {
            const clickedElement = event.target;
            const isButtonOrLinkInside = clickedElement.closest('.btn-link') || 
                                         clickedElement.closest('.btn-primary') ||
                                         clickedElement.closest('.saiba-mais-btn');
            
            if (!isButtonOrLinkInside) {
                playSelectSound();
            }
        });
        
        // Opcional: Adicionar som de hover para o card inteiro. Descomente a linha abaixo se desejar.
        // card.addEventListener('mouseenter', playHoverSound); 
    });

    // Listener para o botão de controle de áudio (já tinha playSelectSound dentro de toggleAudio)
    // Isso é redundante aqui, pois toggleAudio já é chamado no listener de click do audioControlButton.
    // Remover a linha abaixo se já estiver no bloco de inicialização do audioControlButton.
    // if (audioControlButton) {
    //     audioControlButton.addEventListener('click', toggleAudio); 
    // }
});