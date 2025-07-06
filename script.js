document.addEventListener('DOMContentLoaded', function() {
    // --- Código existente do botão de áudio (manter este) ---
    const playAudioBtn = document.getElementById('playAudioBtn');
    const minecraftAudio = document.getElementById('minecraftAudio');

    if (playAudioBtn && minecraftAudio) {
        // Inicializa o botão com o estado 'off' (desligado)
        playAudioBtn.classList.add('play-audio-btn-off');
        let isPlaying = false; 

        playAudioBtn.addEventListener('click', function() {
            if (isPlaying) {
                minecraftAudio.pause();
                minecraftAudio.currentTime = 0;
                isPlaying = false;
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
            } else {
                minecraftAudio.play();
                isPlaying = true;
                playAudioBtn.classList.remove('play-audio-btn-off');
                playAudioBtn.classList.add('play-audio-btn-on');
            }
        });

        minecraftAudio.addEventListener('ended', function() {
            isPlaying = false;
            playAudioBtn.classList.remove('play-audio-btn-on');
            playAudioBtn.classList.add('play-audio-btn-off');
        });

        minecraftAudio.addEventListener('pause', function() {
            if (isPlaying) {
                isPlaying = false;
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
            }
        });

        minecraftAudio.addEventListener('play', function() {
            isPlaying = true;
            playAudioBtn.classList.remove('play-audio-btn-off');
            playAudioBtn.classList.add('play-audio-btn-on');
        });
    } else {
        console.error("Erro: Botão ou elemento de áudio 'playAudioBtn' ou 'minecraftAudio' não encontrados no DOM.");
    }

    // --- NOVO CÓDIGO para o som de clique ---
    const clickAudio = document.getElementById('clickAudio');

    if (clickAudio) {
        // Seleciona todos os botões e links que você quer que toquem o som
        // Isso inclui botões, e links (a) que não são para navegação interna (#)
        const clickableElements = document.querySelectorAll(
            'button, a[href]:not([href^="#"]):not([href="javascript:void(0)"]), .btn-primary, .btn-secondary'
        );
        // Explicação do seletor:
        // - 'button': Seleciona todas as tags <button>.
        // - 'a[href]:not([href^="#"])': Seleciona todas as tags <a> que têm um atributo 'href'
        //   e cujo 'href' NÃO começa com '#' (ou seja, não são âncoras internas).
        // - ':not([href="javascript:void(0)"])': Exclui links que usam javascript:void(0),
        //   que geralmente são placeholdes de links que serão manipulados por JS sem navegação.
        // - '.btn-primary, .btn-secondary': Adiciona elementos que usam essas classes de botão,
        //   caso eles não sejam já 'button' ou 'a'.

        clickableElements.forEach(element => {
            element.addEventListener('click', function(event) {
                // Evita que o som seja executado várias vezes rapidamente se o usuário clicar furiosamente
                if (clickAudio.paused) { // Só toca se o áudio não estiver tocando
                    clickAudio.currentTime = 0; // Reinicia o áudio para tocar desde o início
                    clickAudio.play().catch(e => console.log("Erro ao tocar áudio de clique:", e));
                    // O .catch é importante para evitar erros no console se a reprodução for bloqueada pelo navegador
                    // (ex: política de autoplay)
                }
            });
        });

    } else {
        console.error("Erro: Elemento de áudio 'clickAudio' não encontrado no DOM. Verifique o ID e o HTML.");
    }
});