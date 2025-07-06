document.addEventListener('DOMContentLoaded', () => {
    console.log("Script principal carregado. DOM Content Loaded.");

    // =====================================
    // 1. Controle de Áudio de Fundo - REVISADO E CONSOLIDADO
    // =====================================
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
    const circumference = 100; // Valor que deve corresponder à circunferência do seu círculo SVG para o progresso.

    function updateProgressBar() {
        if (!audio.paused && !audio.ended && audio.duration) {
            const percentage = (audio.currentTime / audio.duration) * 100;
            const offset = circumference - (percentage / 100) * circumference;
            progressArc.style.strokeDasharray = `${percentage}, ${circumference}`;
            progressArc.style.strokeDashoffset = offset;
        } else {
            // Reinicia a barra de progresso se o áudio estiver pausado ou não tiver duração
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
        // Assegura que o source seja definido antes de tentar carregar e tocar
        if (!audio.src || audio.src !== playlist[currentTrackIndex].src) {
             audio.src = playlist[currentTrackIndex].src;
             audio.load(); // Recarrega a nova fonte apenas se a src mudou
        }

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

    // Inicializa o estado do áudio com base na preferência do usuário ou padrão
    if (userPrefersMusic === 'true') {
        // Tenta tocar, mas pode falhar devido a políticas de autoplay
        audio.src = playlist[currentTrackIndex].src; // Define a fonte inicial
        audio.load();
        loadAndPlayCurrentTrack();
    } else {
        audio.pause();
        updateButtonState(false); // Garante que o estado inicial seja "desligado"
    }

    // Event Listener para o clique no botão de controle de áudio
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
    // Chamada inicial para garantir que a barra de progresso esteja no estado correto ao carregar
    updateProgressBar();


    // =====================================
    // 2. Seus Outros Scripts Existentes
    // (Mantidos e integrados aqui)
    // =====================================

    // Click Sound Effects
    const clickSoundEffect = new Audio('audios/effects/click.mp3'); //
    document.querySelectorAll('a, button[data-sound-effect="select"]').forEach(element => { //
        if (element.id !== 'audioControlButton') { // Evita conflito com o controle de áudio principal
            element.addEventListener('click', (event) => { //
                clickSoundEffect.currentTime = 0; //
                clickSoundEffect.play().catch(e => console.error("Error playing click sound effect:", e.message)); //

                if (element.tagName === 'A' && element.href && element.getAttribute('target') !== '_blank' && element.href.startsWith(window.location.origin)) { //
                    event.preventDefault(); // Previne navegação imediata para permitir o som
                    setTimeout(() => { //
                        window.location.href = element.href; //
                    }, 200); // Pequeno atraso para o som tocar
                }
            });
        }
    });

    // HOVER/INTERACTION Sound Effects for CARDS
    const selectSound = new Audio('audios/effects/select.mp3'); //
    const animationEndSound = new Audio('audios/effects/hover-complete.mp3'); // Certifique-se de ter este arquivo!

    // Conjunto para rastrear quais cards já tocaram o som de final de animação para evitar repetição
    const playedAnimationEndSound = new WeakSet(); //

    const cardSelectors = [ //
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
    ].join(', '); //

    document.querySelectorAll(cardSelectors).forEach(cardElement => { //
        cardElement.addEventListener('mouseenter', () => { //
            console.log("Select sound: Mouse entered a card. Playing initial sound."); //
            selectSound.currentTime = 0; //
            selectSound.play().catch(e => console.error("Error playing initial hover sound:", e.message)); //
            playedAnimationEndSound.delete(cardElement); // Permite que o som de final de animação toque novamente
        });

        cardElement.addEventListener('transitionend', (event) => { //
            // Monitora a transição da propriedade 'transform' e verifica se o mouse ainda está sobre o card
            if (event.propertyName === 'transform' && cardElement.matches(':hover') && !playedAnimationEndSound.has(cardElement)) { //
                console.log("Animation end sound: Transform transition ended on hovered card. Playing final sound."); //
                animationEndSound.currentTime = 0; //
                animationEndSound.play().catch(e => console.error("Error playing animation end sound:", e.message)); //
                playedAnimationEndSound.add(cardElement); // Marca que o som já tocou para este card
            }
        });

        cardElement.addEventListener('mouseleave', () => { //
            console.log("Mouse left card. Resetting sound state."); //
            playedAnimationEndSound.delete(cardElement); // Reseta o estado para a próxima interação
        });

        // Opcional: Evento de foco (para navegação por teclado)
        cardElement.addEventListener('focus', () => { //
            console.log("Select sound: Card focused. Playing initial sound."); //
            selectSound.currentTime = 0; //
            selectSound.play().catch(e => console.error("Error playing initial hover sound on focus:", e.message)); //
            playedAnimationEndSound.delete(cardElement); //
        });

        // Opcional: Evento de blur (quando o card perde o foco)
        cardElement.addEventListener('blur', () => { //
            console.log("Card blurred. Resetting sound state."); //
            playedAnimationEndSound.delete(cardElement); //
        });
    });


    // Copy IP and Port Logic
    const copyIpPortBtn = document.getElementById('copyIpPortBtn'); //
    if (copyIpPortBtn) { //
        copyIpPortBtn.addEventListener('click', () => { //
            const ip = document.getElementById('serverIp'); //
            const port = document.getElementById('serverPort'); //
            if (ip && port) { //
                const textToCopy = `${ip.textContent}:${port.textContent}`; //
                navigator.clipboard.writeText(textToCopy).then(() => { //
                    alert('IP e Porta copiados: ' + textToCopy); //
                    console.log("IP e Porta copiados:", textToCopy); //
                }).catch(err => { //
                    console.error('Erro ao copiar IP e Porta: ', err); //
                });
            } else { //
                console.error("Elements for IP or Port not found."); //
            }
        });
    }

    const copyAddressBtn = document.getElementById('copyAddressBtn'); //
    if (copyAddressBtn) { //
        copyAddressBtn.addEventListener('click', () => { //
            const address = document.getElementById('serverAddress'); //
            if (address) { //
                navigator.clipboard.writeText(address.textContent).then(() => { //
                    alert('Endereço copiado: ' + address.textContent); //
                    console.log("Endereço copiado:", address.textContent); //
                }).catch(err => { //
                    console.error('Erro ao copiar Endereço: ', err); //
                });
            } else { //
                console.error("Element for server address not found."); //
            }
        });
    }

    const copyNewAccessBtn = document.getElementById('copyNewAccessBtn'); //
    if (copyNewAccessBtn) { //
        copyNewAccessBtn.addEventListener('click', () => { //
            const newAccessAddress = document.getElementById('newAccessAddress'); //
            if (newAccessAddress) { //
                navigator.clipboard.writeText(newAccessAddress.textContent).then(() => { //
                    alert('Endereço do Novo Acesso copiado: ' + newAccessAddress.textContent); //
                    console.log("Endereço do Novo Acesso copiado:", newAccessAddress.textContent); //
                }).catch(err => { //
                    console.error('Erro ao copiar Endereço Adicional: ', err); //
                });
            } else { //
                console.error("Element for new access address not found."); //
            }
        });
    }
});