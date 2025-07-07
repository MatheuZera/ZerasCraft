document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNavList = document.getElementById('main-nav-list'); // Agora usa o ID

    if (menuToggle && mainNavList) {
        menuToggle.addEventListener('click', function() {
            mainNavList.classList.toggle('active');
        });
    }

    // Código existente para os efeitos sonoros dos botões e cards
    const buttonsWithSound = document.querySelectorAll('[data-sound-effect="select"]');
    const clickSound = document.getElementById('clickSoundEffect');

    buttonsWithSound.forEach(button => {
        button.addEventListener('click', () => {
            if (clickSound) {
                clickSound.currentTime = 0; // Reinicia o áudio se já estiver tocando
                clickSound.play();
            }
        });
    });

    const cardsWithSound = document.querySelectorAll('[data-sound-id]');
    cardsWithSound.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (clickSound) { // Usando o mesmo som para hover em cards
                clickSound.currentTime = 0;
                clickSound.play();
            }
        });
    });


    // Lógica para controle de áudio de fundo
    const audioControlButton = document.getElementById('audioControlButton');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const currentMusicTitle = document.getElementById('currentMusicTitle');

    const audioProgressArc = document.querySelector('.audio-progress-arc'); // Seleciona o SVG do arco
    const arcProgress = audioProgressArc ? audioProgressArc.querySelector('.arc-progress') : null; // Seleciona o círculo de progresso

    // Array de músicas para o player (ajuste os caminhos conforme necessário)
    const musicPlaylist = [
        "audios/musics/Aria-Math.mp3",
        "audios/musics/Aria-Math.mp3",
        "audios/musics/Biome-Fest.mp3",
        "audios/musics/Blind-Spots.mp3",
        "audios/musics/Clark.mp3",
        "audios/musics/Danny.mp3",
        "audios/musics/Dreiton.mp3",
        "audios/musics/Dry-Hands.mp3",
        "audios/musics/Floating-Trees.mp3",
        "audios/musics/Haggstrom.mp3",
        "audios/musics/Haunt-Muskie.mp3",
        "audios/musics/Key.mp3",
        "audios/musics/Living-Mice.mp3",
        "audios/musics/Minecraft.mp3",
        "audios/musics/Moog-City 2.mp3",
        "audios/musics/Mutation.mp3",
        "audios/musics/Oxygène.mp3",
        "audios/musics/Subwoofer-Lullaby.mp3",
        "audios/musics/Sweden.mp3",
        "audios/musics/Taswell.mp3",
        "audios/musics/Wet-Hands.mp3"
    ];

    // MODIFICAÇÃO AQUI: Inicializa com uma música aleatória
    let currentMusicIndex = Math.floor(Math.random() * musicPlaylist.length);
    let isPlaying = false;
    let userInteracted = false; // Flag para controlar se o usuário já interagiu

    function updateMusicInfo() {
        if (backgroundMusic.src) {
            const fileName = backgroundMusic.src.split('/').pop().replace(/\.mp3$/, '');
            currentMusicTitle.textContent = fileName.replace(/-/g, ' '); // Formata o nome para exibição
        } else {
            currentMusicTitle.textContent = 'Música Desligada';
        }
    }

    function toggleAudio() {
        if (backgroundMusic.paused) {
            if (!backgroundMusic.src) {
                // Se não há música carregada, carrega a música atual (que já pode ser aleatória)
                backgroundMusic.src = musicPlaylist[currentMusicIndex];
            }
            backgroundMusic.play().then(() => {
                isPlaying = true;
                audioControlButton.classList.add('is-playing'); // Adiciona a classe para o CSS agir
                updateMusicInfo();
            }).catch(error => {
                console.error("Erro ao reproduzir áudio:", error);
                // Pode exibir uma mensagem ao usuário se a reprodução automática falhar
            });
        } else {
            backgroundMusic.pause();
            isPlaying = false;
            audioControlButton.classList.remove('is-playing'); // Remove a classe para o CSS agir
            currentMusicTitle.textContent = 'Música Desligada';
        }
    }

    if (audioControlButton) {
        audioControlButton.addEventListener('click', () => {
            userInteracted = true;
            toggleAudio();
        });
    }

    // Inicia a música automaticamente após a interação do usuário (se ainda não interagiu)
    document.body.addEventListener('click', () => {
        if (!userInteracted && !isPlaying && backgroundMusic) {
            userInteracted = true;
            if (musicPlaylist.length > 0) {
                backgroundMusic.src = musicPlaylist[currentMusicIndex]; // Usa o índice aleatório inicial
                toggleAudio(); // Tenta iniciar a reprodução
            }
        }
    }, { once: true }); // Executa apenas uma vez

    // MODIFICAÇÃO AQUI: Escolhe uma PRÓXIMA música aleatória quando a atual termina
    backgroundMusic.addEventListener('ended', () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * musicPlaylist.length);
        } while (newIndex === currentMusicIndex && musicPlaylist.length > 1); // Evita repetir a mesma música se houver mais de uma
        
        currentMusicIndex = newIndex;
        backgroundMusic.src = musicPlaylist[currentMusicIndex];
        backgroundMusic.play();
        updateMusicInfo();
    });

    // Event listener para atualizar o progresso do arco
    if (backgroundMusic && arcProgress) {
        backgroundMusic.addEventListener('timeupdate', () => {
            const duration = backgroundMusic.duration;
            const currentTime = backgroundMusic.currentTime;
            if (duration > 0) {
                const percentage = (currentTime / duration) * 100;
                const circumference = 2 * Math.PI * 16; // Raio 'r' do SVG é 16
                const dashoffset = circumference - (percentage / 100) * circumference;
                arcProgress.style.strokeDasharray = `${circumference} ${circumference}`;
                arcProgress.style.strokeDashoffset = dashoffset;
            }
        });
    }

    // Define o estado inicial do botão e do texto
    // Garante que ao carregar a página, o ícone "mudo" esteja visível e o texto "Música Desligada"
    backgroundMusic.pause(); // Garante que a música esteja pausada inicialmente
    isPlaying = false;
    audioControlButton.classList.remove('is-playing'); // Remove a classe is-playing inicialmente
    currentMusicTitle.textContent = 'Música Desligada';


    // Função para copiar para a área de transferência
    function copyToClipboard(elementId, feedbackElementId) {
        const element = document.getElementById(elementId);
        const feedback = document.getElementById(feedbackElementId);
        if (element && feedback) {
            const textToCopy = element.textContent || element.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                feedback.textContent = 'Copiado!';
                feedback.style.opacity = '1';
                setTimeout(() => {
                    feedback.style.opacity = '0';
                    feedback.textContent = '';
                }, 2000);
            }).catch(err => {
                console.error('Erro ao copiar: ', err);
                feedback.textContent = 'Erro ao copiar!';
                feedback.style.opacity = '1';
                setTimeout(() => {
                    feedback.style.opacity = '0';
                    feedback.textContent = '';
                }, 2000);
            });
        }
    }

    const copyIpPortBtn = document.getElementById('copyIpPortBtn');
    if (copyIpPortBtn) {
        copyIpPortBtn.addEventListener('click', function() {
            copyToClipboard('serverIp', 'copyIpPortFeedback');
            // Nota: Se você quer copiar IP e Porta em uma única ação, o ideal é concatenar o texto
            // antes de chamar copyToClipboard. Se for para copiar apenas um dos dois,
            // remova a linha de cópia secundária.
            // Exemplo de como concatenar:
            // const ip = document.getElementById('serverIp').textContent;
            // const port = document.getElementById('serverPort').textContent;
            // navigator.clipboard.writeText(`${ip}:${port}`);
        });
    }

    const copyAddressBtn = document.getElementById('copyAddressBtn');
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', function() {
            copyToClipboard('serverAddress', 'copyAddressFeedback');
        });
    }

    const copyNewAccessBtn = document.getElementById('copyNewAccessBtn');
    if (copyNewAccessBtn) {
        copyNewAccessBtn.addEventListener('click', function() {
            copyToClipboard('newAccessAddress', 'copyNewAccessFeedback');
        });
    }
});

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