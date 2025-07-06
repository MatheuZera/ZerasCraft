document.addEventListener('DOMContentLoaded', () => {
    console.log("Script principal carregado. DOM Content Loaded.");

    // =====================================
    // 1. Controle de Áudio de Fundo
    // =====================================
    const audio = document.getElementById('backgroundMusic');
    const audioControlButton = document.getElementById('audioControlButton');
    const currentMusicTitle = document.getElementById('currentMusicTitle');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const onIcon = audioControlButton.querySelector('.on-icon');   // Ícone com X (para mute)
    const offIcon = audioControlButton.querySelector('.off-icon'); // Ícone sem X (para volume normal)

    // Coleta todas as fontes de música do HTML
    const musicSources = Array.from(audio.querySelectorAll('source')).map(source => ({
        src: source.src,
        title: source.dataset.title || 'Música Desconhecida' // Usa data-title ou um fallback
    }));

    let currentMusicIndex = -1; // Índice da música atualmente selecionada

    console.log(`Músicas encontradas: ${musicSources.length}`, musicSources);

    /**
     * Atualiza o estado visual do botão de controle de áudio (classes, ícones, texto, progresso).
     * Esta função agora se baseia no estado real do elemento <audio>.
     */
    function updateAudioButtonState() {
        console.log(`[updateAudioButtonState] Called. audio.paused = ${audio.paused}, audio.src = ${audio.src ? 'Defined' : 'Undefined'}`);

        // The music is "playing" if it's not paused AND has a source defined (i.e., not initial empty state)
        const isCurrentlyPlaying = !audio.paused && audio.src && audio.readyState >= 3; // readyState >=3 means enough data to play

        if (isCurrentlyPlaying) {
            audioControlButton.classList.remove('off');
            audioControlButton.classList.add('on'); // Add 'on' class for neon
            onIcon.style.display = 'inline-block';
            offIcon.style.display = 'none';
            // The music title should already be set by playRandomMusic()
            audioControlButton.setAttribute('aria-label', `Música tocando: ${currentMusicTitle.textContent}. Clique para pausar.`);
            updateProgressBar(); // Start/continue progress bar update
        } else {
            audioControlButton.classList.remove('on'); // Remove 'on' class to deactivate neon
            audioControlButton.classList.add('off');
            onIcon.style.display = 'none';
            offIcon.style.display = 'inline-block';
            audioControlButton.setAttribute('aria-label', 'Música pausada. Clique para tocar.');
            audioProgressArc.style.transform = `rotate(-45deg)`; // Reset progress bar
            // The text 'Desligado' or 'Erro' should be set by pauseMusic() or the catch block of playRandomMusic()
        }
        console.log(`[updateAudioButtonState] UI updated. Button classList: ${audioControlButton.classList}`);
    }

    /**
     * Reproduz uma música aleatória da lista.
     * Tenta lidar com a política de autoplay e erros de reprodução.
     */
    function playRandomMusic() {
        console.log("[playRandomMusic] Attempting to start playback...");

        if (musicSources.length === 0) {
            currentMusicTitle.textContent = 'Nenhuma música encontrada.';
            audioControlButton.disabled = true;
            updateAudioButtonState(); // Ensure button is off
            console.warn("[playRandomMusic] No music sources configured in HTML.");
            return;
        }

        let randomIndex;
        if (musicSources.length > 1) {
            do {
                randomIndex = Math.floor(Math.random() * musicSources.length);
            } while (randomIndex === currentMusicIndex);
        } else {
            randomIndex = 0; // Only one song, play it
        }

        currentMusicIndex = randomIndex;
        const selectedMusic = musicSources[currentMusicIndex];

        audio.src = selectedMusic.src;
        audio.load(); // Load the new source (essential for some browsers/scenarios)

        currentMusicTitle.textContent = selectedMusic.title; // Update title immediately

        console.log(`[playRandomMusic] Loading '${selectedMusic.title}' from '${selectedMusic.src}'`);

        // Attempt to play the music
        audio.play()
            .then(() => {
                // Play successful. The 'play' event listener will handle updateAudioButtonState().
                console.log(`[playRandomMusic] Successfully playing '${selectedMusic.title}'.`);
            })
            .catch(error => {
                // The play promise was rejected.
                console.error(`[playRandomMusic] Failed to play '${selectedMusic.title}' from '${selectedMusic.src}':`, error);

                if (error.name === 'NotAllowedError') {
                    // Autoplay blocked. UI should reflect that music is not playing.
                    currentMusicTitle.textContent = 'Clique para tocar.'; // Indicate user interaction is needed
                    audio.pause(); // Ensure audio element is actually paused
                    updateAudioButtonState(); // Update UI to OFF state
                    console.log("[playRandomMusic] Autoplay blocked. Waiting for user interaction.");
                } else if (error.name === 'NotSupportedError' || error.name === 'AbortError') {
                    // Problem with the file itself (not supported, loading aborted)
                    currentMusicTitle.textContent = 'Desligado.';
                    audio.pause(); // Ensure audio is paused
                    updateAudioButtonState(); // Update UI to OFF state
                    console.error("[playRandomMusic] Audio format or loading error:", error);
                    // Optional: Try next song if multiple exist and this is a file error
                    if (musicSources.length > 1) {
                         console.log("[playRandomMusic] Trying next song due to file error...");
                         setTimeout(playRandomMusic, 1500); // Try next after a short delay
                    }
                } else {
                    // Other generic errors (e.g., DOMException if play() is interrupted very quickly)
                    currentMusicTitle.textContent = 'Erro de reprodução.';
                    audio.pause(); // Ensure audio is paused
                    updateAudioButtonState(); // Update UI to OFF state
                    console.error("[playRandomMusic] Unexpected error during playback:", error);
                }
            });
    }

    /**
     * Pauses the currently playing music.
     */
    function pauseMusic() {
        console.log("[pauseMusic] Pausing playback.");
        audio.pause(); // This will trigger the 'pause' event listener
        currentMusicTitle.textContent = 'Desligado'; // Revert text to "Desligado"
        // updateAudioButtonState() will be called by the 'pause' event listener
    }

    // Event Listener for the audio control button click
    audioControlButton.addEventListener('click', () => {
        console.log("[audioControlButton] Clicked. Current audio.paused state:", audio.paused);
        // Logic now directly based on the 'paused' state of the audio element
        if (!audio.paused) { // If not paused, it's playing (or attempting to play)
            console.log("[audioControlButton] Music is playing, pausing.");
            pauseMusic();
        } else {
            console.log("[audioControlButton] Music is paused, attempting to play.");
            playRandomMusic();
        }
    });

    // Event when music ends (for autoplaying next track)
    audio.addEventListener('ended', () => {
        console.log("[audio] 'ended' event fired. Playing next random music.");
        playRandomMusic();
    });

    // Event when audio is officially paused (by code or UI)
    audio.addEventListener('pause', () => {
        console.log("[audio] 'pause' event fired. Updating UI.");
        // Ensure the UI is updated to the paused state
        updateAudioButtonState();
    });

    // Event when audio officially starts playing (by code or UI)
    audio.addEventListener('play', () => {
        console.log("[audio] 'play' event fired. Updating UI.");
        // Ensure the UI is updated to the playing state
        updateAudioButtonState();
    });

    // Event for general audio element errors (for debugging)
    audio.addEventListener('error', (e) => {
        console.error("[audio] Error on <audio> element:", e.message, e);
        currentMusicTitle.textContent = 'Erro de áudio!';
        audio.pause(); // Ensure audio stops trying to play
        updateAudioButtonState(); // Update UI to OFF state
    });

    // Function to update the circular progress bar
    function updateProgressBar() {
        // Only update if audio is actually playing and has valid duration
        if (!audio.paused && !isNaN(audio.duration) && audio.duration > 0) {
            const progress = (audio.currentTime / audio.duration); // Progress from 0 to 1
            const rotation = progress * 360; // Total rotation in degrees
            audioProgressArc.style.transform = `rotate(${rotation - 45}deg)`; // -45deg to align start at top
            requestAnimationFrame(updateProgressBar); // Request next frame
        } else {
            audioProgressArc.style.transform = `rotate(-45deg)`; // Reset bar
        }
    }

    // Initialization of audio button state when page loads
    if (musicSources.length > 0) {
        audioControlButton.disabled = false;
        currentMusicTitle.textContent = 'Clique para tocar.'; // Clear initial message
        updateAudioButtonState(); // Set initial visual state to "off"
        console.log("Audio button initialized to 'Clique para tocar'.");
    } else {
        audioControlButton.disabled = true; // Disable button if no music
        currentMusicTitle.textContent = 'Nenhuma música disponível.';
        updateAudioButtonState(); // Set initial visual state to "off" and disabled
        console.warn("No music configured. Audio button disabled.");
    }


    // =====================================
    // 2. Seus Outros Scripts Existentes
    // (Mantidos e integrados aqui)
    // =====================================

    // Click Sound Effects
    const clickSound = new Audio('audios/effects/click.mp3');
    document.querySelectorAll('a, button[data-sound-effect="select"]').forEach(element => {
        // Avoid conflict with the main audio control button and its children
        if (!element.closest('#audioControlButton')) {
             element.addEventListener('click', () => {
                // console.log("Click sound: Attempting to play.");
                clickSound.currentTime = 0; // Reset audio to play multiple times
                clickSound.play().catch(e => console.error("Error playing click sound:", e.message));
            });
        }
    });

    // Hover Sound Effects
    const selectSound = new Audio('audios/effects/select.mp3');
    document.querySelectorAll(
        '.service-card, .role-category-card, .access-card, .event-card, .community-card, .partnership-card, .partnership-proposal-card'
    ).forEach(element => {
        element.addEventListener('mouseenter', () => {
            // console.log("Select sound: Attempting to play.");
            selectSound.currentTime = 0; // Reset audio
            selectSound.play().catch(e => console.error("Error playing hover sound:", e.message));
        });
    });

    // Copy IP and Port Logic
    const copyIpPortBtn = document.getElementById('copyIpPortBtn');
    if (copyIpPortBtn) {
        copyIpPortBtn.addEventListener('click', () => {
            const ip = document.getElementById('serverIp').textContent;
            const port = document.getElementById('serverPort').textContent;
            const textToCopy = `${ip}:${port}`;
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('IP e Porta copiados: ' + textToCopy);
                console.log("IP e Porta copiados:", textToCopy);
            }).catch(err => {
                console.error('Erro ao copiar IP e Porta: ', err);
            });
        });
    }

    const copyAddressBtn = document.getElementById('copyAddressBtn');
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', () => {
            const address = document.getElementById('serverAddress').textContent;
            navigator.clipboard.writeText(address).then(() => {
                alert('Endereço copiado: ' + address);
                console.log("Endereço copiado:", address);
            }).catch(err => {
                console.error('Erro ao copiar Endereço: ', err);
            });
        });
    }

    const copyNewAccessBtn = document.getElementById('copyNewAccessBtn');
    if (copyNewAccessBtn) {
        copyNewAccessBtn.addEventListener('click', () => {
            const newAccessAddress = document.getElementById('newAccessAddress').textContent;
            navigator.clipboard.writeText(newAccessAddress).then(() => {
                alert('Endereço do Novo Acesso copiado: ' + newAccessAddress);
                console.log("Endereço do Novo Acesso copiado:", newAccessAddress);
            }).catch(err => {
                console.error('Erro ao copiar Endereço Adicional: ', err);
            });
        });
    }
});