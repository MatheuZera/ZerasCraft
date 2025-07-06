// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Funcionalidade de Copiar IP ---
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.copyTarget;
            let textToCopy = '';

            if (targetId === 'bedrock-ip-port') {
                const ip = document.getElementById('bedrock-ip').textContent;
                const port = document.getElementById('bedrock-port').textContent;
                textToCopy = `${ip}:${port}`;
            } else if (targetId === 'java-ip') {
                textToCopy = document.getElementById('java-ip').textContent;
            }

            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        const originalText = button.textContent;
                        button.textContent = 'Copiado!';
                        setTimeout(() => {
                            button.textContent = originalText;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Erro ao copiar: ', err);
                        alert(`Erro ao copiar o texto. Por favor, copie manualmente: ${textToCopy}`);
                    });
            }
        });
    });

    // --- Funcionalidade do Botão de Áudio ---
    const playAudioBtn = document.getElementById('playAudioBtn');
    const backgroundMusic = document.getElementById('backgroundMusic');
    let isPlaying = false; // Estado inicial da música

    // Verifica se a música deve começar a tocar após a interação do usuário
    // (necessário para a maioria dos navegadores)
    const toggleMusic = () => {
        if (isPlaying) {
            backgroundMusic.pause();
            playAudioBtn.classList.remove('play-audio-btn-on');
            playAudioBtn.classList.add('play-audio-btn-off');
            playAudioBtn.classList.remove('animating'); // Remove a animação ao pausar
        } else {
            backgroundMusic.play().catch(error => {
                console.error("Erro ao tentar tocar a música:", error);
                // Informar o usuário que precisa de interação para tocar
                alert("Seu navegador pode exigir uma interação inicial para que a música comece a tocar.");
            });
            playAudioBtn.classList.add('play-audio-btn-on');
            playAudioBtn.classList.remove('play-audio-btn-off');
            playAudioBtn.classList.add('animating'); // Adiciona a animação ao tocar
        }
        isPlaying = !isPlaying; // Inverte o estado
    };

    // Adiciona o evento de clique ao botão
    playAudioBtn.addEventListener('click', toggleMusic);

    // Mostra o botão após o DOM carregar (previne FOUC se o CSS padrão for 'display: none;')
    playAudioBtn.style.display = 'flex';
});