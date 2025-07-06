document.addEventListener('DOMContentLoaded', function() {
    const playAudioBtn = document.getElementById('playAudioBtn');
    const minecraftAudio = document.getElementById('minecraftAudio');

    if (playAudioBtn && minecraftAudio) {
        // Inicializa o botão com o estado 'off' (desligado)
        // Isso garante que o ícone inicial seja o de 'mudo'
        playAudioBtn.classList.add('play-audio-btn-off');

        // Variável para controlar o estado da reprodução (true = tocando, false = parado)
        let isPlaying = false; 

        playAudioBtn.addEventListener('click', function() {
            if (isPlaying) {
                // Se estiver tocando, pause o áudio e reinicie-o
                minecraftAudio.pause();
                minecraftAudio.currentTime = 0; // Volta para o início
                isPlaying = false;
                // Altera a classe para o estado 'off' (ícone de mudo)
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
            } else {
                // Se não estiver tocando, inicie a reprodução
                minecraftAudio.play();
                isPlaying = true;
                // Altera a classe para o estado 'on' (ícone de música)
                playAudioBtn.classList.remove('play-audio-btn-off');
                playAudioBtn.classList.add('play-audio-btn-on');
            }
        });

        // Opcional: Adicione um ouvinte para quando o áudio terminar (para loop)
        minecraftAudio.addEventListener('ended', function() {
            // Se você quer que ele loope automaticamente, descomente as linhas abaixo:
            // minecraftAudio.currentTime = 0;
            // minecraftAudio.play();
            // isPlaying = true; // Mantém o estado como tocando
            
            // Se você quer que ele pare e o botão volte ao estado inicial ao terminar:
            isPlaying = false;
            // Altera a classe para o estado 'off' quando a música termina
            playAudioBtn.classList.remove('play-audio-btn-on');
            playAudioBtn.classList.add('play-audio-btn-off');
        });

        // Opcional: Adicione um ouvinte para quando o áudio for pausado por fora (ex: usuário muda de aba)
        minecraftAudio.addEventListener('pause', function() {
            if (isPlaying) { // Só reage se o áudio estava sendo controlado pelo botão
                isPlaying = false;
                // Altera a classe para o estado 'off' se o áudio for pausado por fora
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
            }
        });

        // Adicione um ouvinte para quando o áudio começar a tocar (pode ser útil para autoplay ou outras interações)
        minecraftAudio.addEventListener('play', function() {
            isPlaying = true;
            playAudioBtn.classList.remove('play-audio-btn-off');
            playAudioBtn.classList.add('play-audio-btn-on');
        });

    } else {
        console.error("Erro: Botão ou elemento de áudio não encontrados no DOM.");
    }
});