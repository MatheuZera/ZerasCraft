document.addEventListener('DOMContentLoaded', () => {
    console.log("Script principal carregado. DOM Content Loaded.");

    // =====================================
    // 1. Controle de Áudio de Fundo
    // =====================================
    const audio = document.getElementById('backgroundMusic');
    const audioControlButton = document.getElementById('audioControlButton');
    const currentMusicTitle = document.getElementById('currentMusicTitle');
    const audioProgressArc = document.getElementById('audioProgressArc');
    const onIcon = audioControlButton ? audioControlButton.querySelector('.on-icon') : null; // Ícone com X (para mute)
    const offIcon = audioControlButton ? audioControlButton.querySelector('.off-icon') : null; // Ícone sem X (para volume normal)

    // Coleta todas as fontes de música do HTML
    const musicSources = Array.from(audio ? audio.querySelectorAll('source') : []).map(source => ({
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
        if (!audioControlButton || !onIcon || !offIcon) {
            console.warn("[updateAudioButtonState] Audio control elements not found.");
            return;
        }

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
            if (audioProgressArc) {
                audioProgressArc.style.transform = `rotate(-45deg)`; // Reset progress bar
            }
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
            if (currentMusicTitle) currentMusicTitle.textContent = 'Nenhuma música encontrada.';
            if (audioControlButton) audioControlButton.disabled = true;
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

        if (currentMusicTitle) currentMusicTitle.textContent = selectedMusic.title; // Update title immediately

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
                    if (currentMusicTitle) currentMusicTitle.textContent = 'Clique para tocar.'; // Indicate user interaction is needed
                    audio.pause(); // Ensure audio element is actually paused
                    updateAudioButtonState(); // Update UI to OFF state
                    console.log("[playRandomMusic] Autoplay blocked. Waiting for user interaction.");
                } else if (error.name === 'NotSupportedError' || error.name === 'AbortError') {
                    // Problem with the file itself (not supported, loading aborted)
                    if (currentMusicTitle) currentMusicTitle.textContent = 'Desligado.';
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
                    if (currentMusicTitle) currentMusicTitle.textContent = 'Erro de reprodução.';
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
        if (currentMusicTitle) currentMusicTitle.textContent = 'Desligado'; // Revert text to "Desligado"
        // updateAudioButtonState() will be called by the 'pause' event listener
    }

    // Event Listener for the audio control button click
    if (audioControlButton) {
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
    }


    // Event when music ends (for autoplaying next track)
    if (audio) {
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
            if (currentMusicTitle) currentMusicTitle.textContent = 'Erro de áudio!';
            audio.pause(); // Ensure audio stops trying to play
            updateAudioButtonState(); // Update UI to OFF state
        });
    }


    // Function to update the circular progress bar
    function updateProgressBar() {
        if (!audioProgressArc || !audio) return; // Ensure elements exist

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
    if (audioControlButton) { // Check if audioControlButton exists before trying to access its properties
        if (musicSources.length > 0) {
            audioControlButton.disabled = false;
            if (currentMusicTitle) currentMusicTitle.textContent = 'Clique para tocar.'; // Clear initial message
            updateAudioButtonState(); // Set initial visual state to "off"
            console.log("Audio button initialized to 'Clique para tocar'.");
        } else {
            audioControlButton.disabled = true; // Disable button if no music
            if (currentMusicTitle) currentMusicTitle.textContent = 'Nenhuma música disponível.';
            updateAudioButtonState(); // Set initial visual state to "off" and disabled
            console.warn("No music configured. Audio button disabled.");
        }
    } else {
        console.warn("Audio control button not found. Background music functionality might be impaired.");
    }


    // =====================================
    // 2. Seus Outros Scripts Existentes
    // (Consolidados e integrados aqui)
    // =====================================

    // Click Sound Effects
    const clickSoundEffect = new Audio('audios/effects/click.mp3'); // Renamed to avoid conflict
    document.querySelectorAll('a, button[data-sound-effect="select"]').forEach(element => {
        // Avoid conflict with the main audio control button and its children
        if (audioControlButton && !element.closest('#audioControlButton')) {
            element.addEventListener('click', (event) => {
                // console.log("Click sound: Attempting to play.");
                clickSoundEffect.currentTime = 0; // Reset audio to play multiple times
                clickSoundEffect.play().catch(e => console.error("Error playing click sound effect:", e.message));

                // If it's a link, prevent default and navigate after sound
                if (element.tagName === 'A' && element.href) {
                    event.preventDefault();
                    setTimeout(() => {
                        window.location.href = element.href;
                    }, 200); // Adjust time as needed
                }
            });
        } else if (!audioControlButton) { // If audioControlButton doesn't exist, apply to all buttons/links
             element.addEventListener('click', (event) => {
                clickSoundEffect.currentTime = 0;
                clickSoundEffect.play().catch(e => console.error("Error playing click sound effect:", e.message));
                if (element.tagName === 'A' && element.href) {
                    event.preventDefault();
                    setTimeout(() => {
                        window.location.href = element.href;
                    }, 200);
                }
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

    // Removed the duplicated DOMContentLoaded listener for clickSound and links
    // The link click sound logic is now integrated into the single click sound effect section above.

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