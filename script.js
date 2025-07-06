document.addEventListener('DOMContentLoaded', () => {
    console.log("Script principal carregado. DOM Content Loaded.");

    // =====================================
    // 1. Controle de Áudio de Fundo - REVISADO
    // =====================================
    document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('backgroundMusic');
    const audioControlButton = document.getElementById('audioControlButton');
    const currentMusicTitle = document.getElementById('currentMusicTitle');
    const progressArc = audioControlButton.querySelector('.arc-progress');
    const audioIcons = {
        // Renomeei para 'mute' e 'volume' para clareza, correspondendo aos ícones Font Awesome
        mute: audioControlButton.querySelector('.on-icon'),   // Este é o ícone de volume-mute
        volume: audioControlButton.querySelector('.off-icon') // Este é o ícone de volume-up
    };

    const playlist = [
        { title: "Bensound - Memories", src: "https://www.bensound.com/bensound-music/bensound-memories.mp3" },
        { title: "Bensound - Ukulele", src: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3" }
    ];
    let currentTrackIndex = 0;
    const circumference = 100;

    function updateProgressBar() {
        if (!audio.paused && !audio.ended) {
            const percentage = (audio.currentTime / audio.duration) * 100;
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
        audio.src = playlist[currentTrackIndex].src;
        currentMusicTitle.textContent = playlist[currentTrackIndex].title;
        audio.load();
        audio.play().catch(e => console.error("Erro ao reproduzir a próxima música:", e));
    }

    // Função para atualizar o estado visual do botão (ícones e texto)
    function updateButtonState(isPlaying) {
        if (isPlaying) {
            audioControlButton.classList.add('is-playing');
            audioIcons.mute.style.display = 'none';    // Esconde o ícone de mudo
            audioIcons.volume.style.display = 'inline-block'; // Mostra o ícone de volume
            currentMusicTitle.textContent = playlist[currentTrackIndex].title; // Exibe o título da música
        } else {
            audioControlButton.classList.remove('is-playing');
            audioIcons.mute.style.display = 'inline-block'; // Mostra o ícone de mudo
            audioIcons.volume.style.display = 'none';   // Esconde o ícone de volume
            currentMusicTitle.textContent = "Música Desligada"; // Texto para estado desligado
        }
    }

    function loadAndPlayCurrentTrack() {
        audio.src = playlist[currentTrackIndex].src;
        audio.load(); // Recarrega a nova fonte
        audio.play().then(() => {
            updateButtonState(true); // Atualiza o estado para "tocando"
        }).catch(e => {
            console.error("Erro ao iniciar a reprodução automática:", e);
            // Se a reprodução automática falhar (bloqueada pelo navegador),
            // mostramos o estado pausado e o usuário terá que interagir.
            updateButtonState(false); // Atualiza o estado para "pausado"
            currentMusicTitle.textContent = "Clique para iniciar"; // Mensagem para o usuário
        });
    }

    // Verifica a preferência do usuário no localStorage ao carregar a página
    const userPrefersMusic = localStorage.getItem('musicEnabled');

    if (userPrefersMusic === 'true') {
        loadAndPlayCurrentTrack();
    } else {
        audio.pause();
        updateButtonState(false); // Garante que o estado inicial seja "desligado"
    }

    // Event Listener para o clique no botão
    audioControlButton.addEventListener('click', () => {
        if (audio.paused) {
            loadAndPlayCurrentTrack();
            localStorage.setItem('musicEnabled', 'true');
        } else {
            audio.pause();
            updateButtonState(false); // Atualiza o estado para "pausado"
            localStorage.setItem('musicEnabled', 'false');
        }
    });

    audio.addEventListener('ended', () => {
        playNextTrack();
    });

    audio.addEventListener('timeupdate', updateProgressBar);
    audio.addEventListener('loadedmetadata', updateProgressBar);
});
    // =====================================
    // 2. Seus Outros Scripts Existentes
    // (Mantidos e integrados aqui)
    // =====================================

    // Click Sound Effects
    const clickSoundEffect = new Audio('audios/effects/click.mp3');
    document.querySelectorAll('a, button[data-sound-effect="select"]').forEach(element => {
        if (element.id !== 'audioControlButton') { // Evita conflito com o controle de áudio principal
            element.addEventListener('click', (event) => {
                clickSoundEffect.currentTime = 0;
                clickSoundEffect.play().catch(e => console.error("Error playing click sound effect:", e.message));

                if (element.tagName === 'A' && element.href && element.getAttribute('target') !== '_blank' && element.href.startsWith(window.location.origin)) {
                    event.preventDefault(); // Previne navegação imediata para permitir o som
                    setTimeout(() => {
                        window.location.href = element.href;
                    }, 200); // Pequeno atraso para o som tocar
                }
            });
        }
    });

    // HOVER/INTERACTION Sound Effects for CARDS
    const selectSound = new Audio('audios/effects/select.mp3');
    const animationEndSound = new Audio('audios/effects/hover-complete.mp3'); // Certifique-se de ter este arquivo!

    // Conjunto para rastrear quais cards já tocaram o som de final de animação para evitar repetição
    const playedAnimationEndSound = new WeakSet();

    const cardSelectors = [
        '.service-card',
        '.role-category-card',
        '.access-card',
        '.event-card',
        '.community-card',
        '.partnership-card',
        '.partnership-proposal-card',
        // Adicione seletores para os cards das imagens, se não estiverem já cobertos por essas classes.
        // Pela imagem, parece que "Plataformas de Jogo", "Experiência & Nível (XP)", "Guildas & Competições", "Status & Benefícios"
        // e outros, provavelmente já usam uma das classes base como `service-card` ou `access-card`.
    ].join(', ');

    document.querySelectorAll(cardSelectors).forEach(cardElement => {
        cardElement.addEventListener('mouseenter', () => {
            console.log("Select sound: Mouse entered a card. Playing initial sound.");
            selectSound.currentTime = 0;
            selectSound.play().catch(e => console.error("Error playing initial hover sound:", e.message));
            playedAnimationEndSound.delete(cardElement); // Permite que o som de final de animação toque novamente
        });

        cardElement.addEventListener('transitionend', (event) => {
            // Monitora a transição da propriedade 'transform' e verifica se o mouse ainda está sobre o card
            if (event.propertyName === 'transform' && cardElement.matches(':hover') && !playedAnimationEndSound.has(cardElement)) {
                console.log("Animation end sound: Transform transition ended on hovered card. Playing final sound.");
                animationEndSound.currentTime = 0;
                animationEndSound.play().catch(e => console.error("Error playing animation end sound:", e.message));
                playedAnimationEndSound.add(cardElement); // Marca que o som já tocou para este card
            }
        });

        cardElement.addEventListener('mouseleave', () => {
            console.log("Mouse left card. Resetting sound state.");
            playedAnimationEndSound.delete(cardElement); // Reseta o estado para a próxima interação
        });

        // Opcional: Evento de foco (para navegação por teclado)
        cardElement.addEventListener('focus', () => {
            console.log("Select sound: Card focused. Playing initial sound.");
            selectSound.currentTime = 0;
            selectSound.play().catch(e => console.error("Error playing initial hover sound on focus:", e.message));
            playedAnimationEndSound.delete(cardElement);
        });

        // Opcional: Evento de blur (quando o card perde o foco)
        cardElement.addEventListener('blur', () => {
            console.log("Card blurred. Resetting sound state.");
            playedAnimationEndSound.delete(cardElement);
        });
    });


    // Copy IP and Port Logic
    const copyIpPortBtn = document.getElementById('copyIpPortBtn');
    if (copyIpPortBtn) {
        copyIpPortBtn.addEventListener('click', () => {
            const ip = document.getElementById('serverIp');
            const port = document.getElementById('serverPort');
            if (ip && port) {
                const textToCopy = `${ip.textContent}:${port.textContent}`;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert('IP e Porta copiados: ' + textToCopy);
                    console.log("IP e Porta copiados:", textToCopy);
                }).catch(err => {
                    console.error('Erro ao copiar IP e Porta: ', err);
                });
            } else {
                console.error("Elements for IP or Port not found.");
            }
        });
    }

    const copyAddressBtn = document.getElementById('copyAddressBtn');
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', () => {
            const address = document.getElementById('serverAddress');
            if (address) {
                navigator.clipboard.writeText(address.textContent).then(() => {
                    alert('Endereço copiado: ' + address.textContent);
                    console.log("Endereço copiado:", address.textContent);
                }).catch(err => {
                    console.error('Erro ao copiar Endereço: ', err);
                });
            } else {
                console.error("Element for server address not found.");
            }
        });
    }

    const copyNewAccessBtn = document.getElementById('copyNewAccessBtn');
    if (copyNewAccessBtn) {
        copyNewAccessBtn.addEventListener('click', () => {
            const newAccessAddress = document.getElementById('newAccessAddress');
            if (newAccessAddress) {
                navigator.clipboard.writeText(newAccessAddress.textContent).then(() => {
                    alert('Endereço do Novo Acesso copiado: ' + newAccessAddress.textContent);
                    console.log("Endereço do Novo Acesso copiado:", newAccessAddress.textContent);
                }).catch(err => {
                    console.error('Erro ao copiar Endereço Adicional: ', err);
                });
            } else {
                console.error("Element for new access address not found.");
            }
        });
    }
});