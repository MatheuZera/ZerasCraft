/* ===================================================================
   ZERA'S CRAFT - PLAYER DE ÁUDIO AVANÇADO (FLUXO INTELIGENTE DE CARREGAMENTO)
=================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 1. ELEMENTOS DOM
  const backgroundAudio = document.getElementById("backgroundAudio");
  const audioControlButton = document.getElementById("audioControlButton");
  const audioNextButton = document.getElementById("audioNextButton");
  const audioPrevButton = document.getElementById("audioPrevButton");
  const audioModeButton = document.getElementById("audioModeButton");
  const musicTitleDisplay = document.getElementById("musicTitleDisplay");
  const nowPlayingIcon = document.querySelector(".now-playing i");
  const audioProgressBar = document.getElementById("audioProgressBar");
  const currentTimeDisplay = document.getElementById("currentTimeDisplay");
  const durationDisplay = document.getElementById("durationDisplay");
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeButton = document.getElementById("volumeButton");
  const centralMessage = document.getElementById("centralMessage");

  // ===================================================================
  // 2. PLAYLIST COMPLETA (COM CORES)
  // ===================================================================
  const playlist = [
    {
      icon: "fas fa-music",
      playlist: "Minecraft",
      title: "Calm 1",
      src: "assets/audios/musics/background/calm1.mp3",
    },
    {
      icon: "fas fa-book",
      playlist: "C418",
      title: "Calm 2",
      src: "assets/audios/musics/background/calm2.mp3",
    },
    {
      icon: "fas fa-gamepad",
      playlist: "Lobby",
      title: "Aria Math",
      src: "assets/audios/musics/background/ariamath.mp3",
    },
  ];

  // ===================================================================
  // VARIÁVEIS DE CONTROLE DO PLAYER
  // ===================================================================
  let currentMode = "sequencial";
  let currentMusicIndex = 0;
  let isDragging = false;
  let lastSaveTime = 0;
  let playHistory = [];

  // ===================================================================
  // 3. SISTEMA DE NOTIFICAÇÕES (COM DURAÇÃO INTELIGENTE)
  // ===================================================================
  let messageTimeout;

  // Agora aceitamos um "duration". Se for 0, a mensagem nunca some sozinha!
  const showMessage = (title, desc, iconClass, colorHex, duration = 3000) => {
    if (!centralMessage) return;

    const titleStrong = centralMessage.querySelector(".message-content strong");
    const descSpan = centralMessage.querySelector(".message-content span");
    const iconI = centralMessage.querySelector(".message-icon i");
    const iconContainer = centralMessage.querySelector(".message-icon");

    if (titleStrong) titleStrong.textContent = title;
    if (descSpan) descSpan.textContent = desc;

    if (iconI && iconContainer) {
      iconI.className = `fas ${iconClass}`;
      iconContainer.style.backgroundColor = colorHex;
    }

    centralMessage.classList.remove("hide");
    centralMessage.classList.add("show");

    // Limpa timers antigos (ex: uma mensagem de CARREGANDO interrompe qualquer coisa que estava na tela)
    clearTimeout(messageTimeout);

    // Se duration for maior que zero, ela tem um tempo de vida para sumir.
    // Se for zero (0), a mensagem é "imortal" e fica até outra chamar o showMessage por cima!
    if (duration > 0) {
      messageTimeout = setTimeout(() => {
        centralMessage.classList.add("hide");
        setTimeout(() => {
          if (centralMessage.classList.contains("hide")) {
            centralMessage.classList.remove("show", "hide");
          }
        }, 500);
      }, duration);
    }
  };

  // ===================================================================
  // 4. MEMÓRIA DO PLAYER E INTERFACE
  // ===================================================================
  const saveState = () => {
    if (!backgroundAudio) return;
    const state = {
      index: currentMusicIndex,
      currentTime: backgroundAudio.currentTime,
      volume: backgroundAudio.volume,
      mode: currentMode,
      paused: backgroundAudio.paused,
      history: playHistory,
    };
    localStorage.setItem("zeraAudioState", JSON.stringify(state));
  };

  window.addEventListener("beforeunload", saveState);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const updateUI = () => {
    if (audioControlButton) {
      const icon = audioControlButton.querySelector("i");
      if (icon)
        icon.className = !backgroundAudio.paused
          ? "fas fa-pause"
          : "fas fa-play";
    }

    if (musicTitleDisplay && playlist[currentMusicIndex]) {
      const music = playlist[currentMusicIndex];
      musicTitleDisplay.textContent = `[${music.playlist}] ${music.title}`;

      if (nowPlayingIcon) {
        nowPlayingIcon.className = music.icon;
        nowPlayingIcon.style.color = music.color;
      }
    }

    if (audioModeButton) {
      const modeIcon = audioModeButton.querySelector("i");
      if (modeIcon) {
        const icons = {
          sequencial: "fa-list-ol",
          aleatorio: "fa-random",
          loop: "fa-repeat",
        };
        modeIcon.className = `fas ${icons[currentMode]}`;
      }
    }
  };

  // ===================================================================
  // 5. CONTROLES DO ÁUDIO
  // ===================================================================
  const loadMusic = (index, autoPlay = true) => {
    if (!playlist[index]) index = 0;
    currentMusicIndex = index;
    const music = playlist[currentMusicIndex];

    // 1º PASSO DA LINHA DO TEMPO: O Loading entra infinito (duration = 0)
    showMessage(
      "CARREGANDO...",
      `[${music.playlist}] ${music.title}`,
      "fa-spinner fa-spin",
      "#2196F3",
      0,
    );

    backgroundAudio.src = music.src;
    backgroundAudio.load();
    updateUI();

    if (autoPlay) {
      backgroundAudio.play().catch(() => {
        // Se der bloqueio, substitui o CARREGANDO por INTERAÇÃO NECESSÁRIA infinito
        showMessage(
          "AVISO",
          "O navegador bloqueou o áudio automático. Clique no play.",
          "fa-hand-paper",
          "#ff0000",
          0,
        );
        updateUI();
      });
    }
  };

  const togglePlay = () => {
    if (backgroundAudio.paused) {
      // Volta o aviso de loading infinito logo que clica em play (caso a net engasgue)
      showMessage(
        "CARREGANDO...",
        `[${playlist[currentMusicIndex].playlist}] ${playlist[currentMusicIndex].title}`,
        "fa-spinner fa-spin",
        "#2196F3",
        0,
      );

      backgroundAudio.play().catch(() => {
        showMessage(
          "AVISO",
          "Houve um problema com a reprodução.",
          "fa-exclamation-circle",
          "#ff0000",
          0,
        );
      });
    } else {
      backgroundAudio.pause();
      showMessage(
        "PAUSADO",
        "A música foi interrompida.",
        "fa-pause",
        "#f1c40f",
        3000,
      );
    }
    saveState();
    updateUI();
  };

  const playNext = () => {
    if (currentMode === "loop") {
      backgroundAudio.currentTime = 0;
      showMessage(
        "CARREGANDO...",
        `[${playlist[currentMusicIndex].playlist}] ${playlist[currentMusicIndex].title}`,
        "fa-spinner fa-spin",
        "#2196F3",
        0,
      );
      backgroundAudio.play().catch(() => {
        showMessage(
          "AVISO",
          "Clique no Play para iniciar.",
          "fa-hand-paper",
          "#ff0000",
          0,
        );
      });
      return;
    }

    playHistory.push(currentMusicIndex);

    let nextIndex = (currentMusicIndex + 1) % playlist.length;
    if (currentMode === "aleatorio") {
      nextIndex = Math.floor(Math.random() * playlist.length);
    }

    loadMusic(nextIndex, true);
  };

  const playPrev = () => {
    if (backgroundAudio.currentTime >= 5 || currentMode === "loop") {
      backgroundAudio.currentTime = 0;
      showMessage(
        "CARREGANDO...",
        `[${playlist[currentMusicIndex].playlist}] ${playlist[currentMusicIndex].title}`,
        "fa-spinner fa-spin",
        "#2196F3",
        0,
      );
      backgroundAudio.play().catch(() => {
        showMessage(
          "AVISO",
          "Clique no Play para iniciar.",
          "fa-hand-paper",
          "#ff0000",
          0,
        );
      });
    } else {
      if (playHistory.length > 0) {
        currentMusicIndex = playHistory.pop();
      } else {
        currentMusicIndex =
          (currentMusicIndex - 1 + playlist.length) % playlist.length;
      }
      loadMusic(currentMusicIndex, true);
    }
  };

  // ===================================================================
  // 6. EVENTOS DA API DO NAVEGADOR
  // ===================================================================

  // Se no meio da música a internet travar
  backgroundAudio.addEventListener("waiting", () => {
    showMessage(
      "CARREGANDO...",
      `[${playlist[currentMusicIndex].playlist}] ${playlist[currentMusicIndex].title}`,
      "fa-spinner fa-spin",
      "#2196F3",
      0,
    );
  });

  // 2º PASSO DA LINHA DO TEMPO: A música conseguiu rodar! Substitui CARREGANDO por TOCANDO.
  backgroundAudio.addEventListener("playing", () => {
    showMessage(
      "TOCANDO",
      `[${playlist[currentMusicIndex].playlist}] ${playlist[currentMusicIndex].title}`,
      "fa-play",
      "#1db954",
      3000,
    );
    updateUI();
  });

  // LINHA DO TEMPO DE ERROS: Falha -> Pula -> Carrega -> Toca
  backgroundAudio.addEventListener("error", () => {
    const failedMusic = playlist[currentMusicIndex];

    // Passo 1: Informa o Erro Crítico (Fica na tela para o jogador ler)
    showMessage(
      "ERRO NA FAIXA",
      `Falha em: ${failedMusic.title}`,
      "fa-exclamation-triangle",
      "#ff4444",
      0,
    );

    // Passo 2: Após 2 segundos, avisa que vai pular
    setTimeout(() => {
      showMessage(
        "PULANDO...",
        "Indo para a próxima faixa...",
        "fa-forward",
        "#ff9800",
        0,
      );

      // Passo 3: Manda tocar a próxima (Isso chama o "CARREGANDO..." infinito que depois vira "TOCANDO")
      setTimeout(playNext, 1500);
    }, 2000);
  });

  backgroundAudio.addEventListener("timeupdate", () => {
    if (!isDragging && audioProgressBar && backgroundAudio.duration) {
      audioProgressBar.value =
        (backgroundAudio.currentTime / backgroundAudio.duration) * 100;
      currentTimeDisplay.textContent = formatTime(backgroundAudio.currentTime);
      durationDisplay.textContent = formatTime(backgroundAudio.duration);
    }
    if (Math.abs(backgroundAudio.currentTime - lastSaveTime) > 1) {
      saveState();
      lastSaveTime = backgroundAudio.currentTime;
    }
  });

  backgroundAudio.addEventListener("ended", playNext);

  // ===================================================================
  // 7. BOTÕES E SLIDERS
  // ===================================================================
  if (audioControlButton)
    audioControlButton.addEventListener("click", togglePlay);
  if (audioNextButton) audioNextButton.addEventListener("click", playNext);
  if (audioPrevButton) audioPrevButton.addEventListener("click", playPrev);

  if (audioModeButton) {
    audioModeButton.addEventListener("click", () => {
      const modes = ["sequencial", "aleatorio", "loop"];
      currentMode = modes[(modes.indexOf(currentMode) + 1) % modes.length];
      showMessage(
        "MODO ALTERADO",
        `Ativado: ${currentMode.toUpperCase()}`,
        "fa-sync-alt",
        "#ff9800",
        3000,
      );
      saveState();
      updateUI();
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener("input", () => {
      backgroundAudio.volume = volumeSlider.value;
      const volPercent = Math.round(backgroundAudio.volume * 100);

      let volIcon = "fa-volume-up";
      if (volPercent === 0) volIcon = "fa-volume-mute";
      else if (volPercent < 50) volIcon = "fa-volume-down";

      if (volumeButton) {
        const icon = volumeButton.querySelector("i");
        if (icon) icon.className = `fas ${volIcon}`;
      }

      showMessage("VOLUME", `${volPercent}%`, volIcon, "#2196F3", 2000);
      saveState();
    });
  }

  if (volumeButton && volumeSlider) {
    volumeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      volumeSlider.classList.toggle("is-active");
    });
    volumeSlider.addEventListener("click", (e) => e.stopPropagation());
  }
  document.addEventListener("click", () => {
    if (volumeSlider) volumeSlider.classList.remove("is-active");
  });

  if (audioProgressBar) {
    audioProgressBar.addEventListener("input", () => (isDragging = true));
    audioProgressBar.addEventListener("change", () => {
      if (backgroundAudio.duration) {
        backgroundAudio.currentTime =
          (audioProgressBar.value / 100) * backgroundAudio.duration;
      }
      isDragging = false;
    });
  }

  // ===================================================================
  // 8. BOOT INICIAL (LIGA O CARRO)
  // ===================================================================
  const savedState = JSON.parse(localStorage.getItem("zeraAudioState"));
  if (savedState) {
    currentMusicIndex = savedState.index || 0;
    currentMode = savedState.mode || "sequencial";
    playHistory = savedState.history || [];

    backgroundAudio.volume =
      savedState.volume !== undefined ? savedState.volume : 0.5;
    if (volumeSlider) volumeSlider.value = backgroundAudio.volume;

    backgroundAudio.currentTime = savedState.currentTime || 0;

    if (!savedState.paused) {
      // Tenta puxar de onde parou. O loadMusic cuida do CARREGANDO -> TOCANDO.
      loadMusic(currentMusicIndex, true);
    } else {
      // Se estava pausado, carrega mas não dá play automático
      loadMusic(currentMusicIndex, false);
      // Sobrescreve o "CARREGANDO" imediatamente porque não estamos forçando play
      showMessage(
        "PRONTO PARA TOCAR",
        "Música carregada. Clique no Play.",
        "fa-play-circle",
        "#1db954",
        0,
      );
    }
  } else {
    // Primeira vez da pessoa no site
    loadMusic(0, false);
    backgroundAudio.volume = 0.5;
    showMessage(
      "PRONTO PARA TOCAR",
      "Bem-vindo! Clique no Play para ouvir a rádio.",
      "fa-play-circle",
      "#1db954",
      0,
    );
  }
  updateUI();
});
