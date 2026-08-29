/* ===================================================================
   LÓGICA: CAMINHOS DINÂMICOS (ÁUDIOS E IMAGEM WEBP), PERSISTÊNCIA & ERROS
=================================================================== */
window.initJukeboxPlayer = function () {
  const backgroundAudio = document.getElementById("backgroundAudio");
  const jukeboxTrigger = document.getElementById("jukeboxTrigger");
  const jukeboxImg = document.querySelector(".jukebox-img");
  const notesContainer = document.getElementById("notesContainer");
  const centralMessage = document.getElementById("centralMessage");
  const messageTitle = document.getElementById("messageTitle");
  const messageDuration = document.getElementById("messageDuration");
  const msgIconWrapper = document.getElementById("msgIconWrapper");
  const msgIconType = document.getElementById("msgIconType");

  if (!backgroundAudio || !jukeboxTrigger) return;

  // Detecção automática inteligente do caminho base pelo script DOM
  const getScriptBasePath = () => {
    try {
      const scripts = document.querySelectorAll('script');
      for (let script of scripts) {
        if (script.src && script.src.includes('player.js')) {
          const url = new URL(script.src);
          return url.origin + url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1);
        }
      }
    } catch (e) {
      console.warn("Erro ao detectar caminho do script, usando fallback.", e);
    }
    return './';
  };

  const basePath = getScriptBasePath();

  // Corrige o caminho da imagem WebP da Jukebox dinamicamente (raiz ou subpastas)
  if (jukeboxImg) {
    jukeboxImg.src = basePath + "assets/images/geral/jukebox.webp";
  }

  const playlist = [
    {
      playlist: "Minecraft",
      title: "Calm 1",
      src: basePath + "assets/audios/musics/background/calm1.mp3",
    },
    {
      playlist: "C418",
      title: "Calm 2",
      src: basePath + "assets/audios/musics/background/calm2.mp3",
    },
    {
      playlist: "Lobby",
      title: "Aria Math",
      src: basePath + "assets/audios/musics/background/ariamath.mp3",
    },
  ];

  // Restaura estados salvos no localStorage (Persistência entre páginas)
  let currentMusicIndex = parseInt(localStorage.getItem('jukebox_index')) || 0;
  let currentMode = localStorage.getItem('jukebox_mode') || 'sequencial';
  let savedTime = parseFloat(localStorage.getItem('jukebox_time')) || 0;
  let wasPlaying = localStorage.getItem('jukebox_playing') === 'true';

  let noteInterval = null;
  let messageTimeout = null;
  let retryCount = 0;
  const maxRetries = 2;

  let audioCtx = null;
  let analyser = null;
  let gainNode = null;

  let clickTimeout = null;
  let holdTimeout = null;
  let isHolding = false;

  const modesConfig = {
    sequencial: { text: "Sequencial", icon: "fas fa-list-ol" },
    aleatorio: { text: "Aleatório", icon: "fas fa-random" },
    loop: { text: "Loop", icon: "fas fa-repeat" }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const showMessage = (title, maxTimeStr, type = 'tocando', duration = 3500) => {
    if (!centralMessage) return;

    if (messageTitle) messageTitle.textContent = title;
    if (messageDuration) messageDuration.textContent = maxTimeStr;

    let iconClass = "fa-music";
    let themeColor = "#1db954";

    switch (type) {
      case 'tocando':
        iconClass = "fa-play";
        themeColor = "#1db954";
        break;
      case 'pausado':
        iconClass = "fa-pause";
        themeColor = "#ffa500";
        break;
      case 'pulando':
        iconClass = "fa-forward";
        themeColor = "#3498db";
        break;
      case 'modo':
        iconClass = modesConfig[currentMode]?.icon || "fas fa-sync-alt";
        themeColor = "#9b59b6";
        break;
      case 'instrucoes':
        iconClass = "fa-circle-info";
        themeColor = "#2ecc71";
        break;
      case 'erro':
        iconClass = "fa-triangle-exclamation";
        themeColor = "#e74c3c";
        break;
      default:
        iconClass = "fa-music";
        themeColor = "#1db954";
    }

    if (msgIconType) msgIconType.className = `fas ${iconClass}`;
    if (msgIconWrapper) msgIconWrapper.style.backgroundColor = themeColor;
    if (messageDuration) messageDuration.style.color = themeColor;

    centralMessage.classList.add('show');
    clearTimeout(messageTimeout);

    if (duration > 0) {
      messageTimeout = setTimeout(() => {
        centralMessage.classList.remove('show');
      }, duration);
    }
  };

  const initAudioAnalyser = () => {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      const sourceNode = audioCtx.createMediaElementSource(backgroundAudio);
      gainNode = audioCtx.createGain();
      gainNode.gain.value = 1.2;

      sourceNode.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(audioCtx.destination);
    } catch (e) {
      audioCtx = null;
      analyser = null;
    }
  };

  const getAudioIntensity = () => {
    const music = playlist[currentMusicIndex];

    if (music.title === "Calm 1" && backgroundAudio.currentTime >= 146) {
      return 60;
    }

    if (!analyser) return 55;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    const length = dataArray.length;
    for (let i = 0; i < length; i++) {
      sum += dataArray[i];
    }
    let avg = sum / length;

    if (avg < 1) return 0;

    let normalized = Math.min(100, Math.round((avg / 15) * 100));
    return Math.max(25, normalized);
  };

  const getColorByIntensity = (val) => {
    const stops = [
      { pos: 0, color: [0, 255, 0] },
      { pos: 30, color: [0, 200, 100] },
      { pos: 50, color: [0, 128, 255] },
      { pos: 70, color: [255, 255, 0] },
      { pos: 85, color: [255, 69, 0] },
      { pos: 100, color: [138, 43, 226] }
    ];

    if (val <= 0) return 'rgb(0, 255, 0)';
    if (val >= 100) return 'rgb(138, 43, 226)';

    let lower = stops[0];
    let upper = stops[1];

    for (let i = 0; i < stops.length - 1; i++) {
      if (val >= stops[i].pos && val <= stops[i + 1].pos) {
        lower = stops[i];
        upper = stops[i + 1];
        break;
      }
    }

    const range = upper.pos - lower.pos;
    const t = range === 0 ? 0 : (val - lower.pos) / range;

    const r = Math.round(lower.color[0] + t * (upper.color[0] - lower.color[0]));
    const g = Math.round(lower.color[1] + t * (upper.color[1] - lower.color[1]));
    const b = Math.round(lower.color[2] + t * (upper.color[2] - lower.color[2]));

    return `rgb(${r}, ${g}, ${b})`;
  };

  const loadMusic = (index, autoPlay = false, isSkipping = false, startAtTime = 0) => {
    currentMusicIndex = index;
    const music = playlist[currentMusicIndex];
    backgroundAudio.src = music.src;
    backgroundAudio.load();

    backgroundAudio.onloadedmetadata = () => {
      if (startAtTime > 0 && startAtTime < backgroundAudio.duration) {
        backgroundAudio.currentTime = startAtTime;
      }
    };

    if (autoPlay) {
      backgroundAudio.play().then(() => {
        retryCount = 0;
        setTimeout(() => {
          const actionType = isSkipping ? 'pulando' : 'tocando';
          const titleLabel = isSkipping ? `Pulando: ${music.title}` : music.title;
          showMessage(titleLabel, `Max: ${formatTime(backgroundAudio.duration)}`, actionType, 3500);
        }, 200);
      }).catch((err) => {
        console.warn("Autoplay bloqueado pelo navegador:", err);
      });
    }
  };

  backgroundAudio.onerror = () => {
    const error = backgroundAudio.error;
    let errorDescription = "Erro desconhecido";

    if (error) {
      switch (error.code) {
        case 1: errorDescription = "Carregamento abortado"; break;
        case 2: errorDescription = "Erro de rede"; break;
        case 3: errorDescription = "Erro de decodificação"; break;
        case 4: errorDescription = "Formato não suportado"; break;
      }
    }

    if (retryCount < maxRetries) {
      retryCount++;
      showMessage(`Tentativa ${retryCount}/${maxRetries}...`, "Reconectando", "erro", 3000);
      setTimeout(() => {
        backgroundAudio.load();
        backgroundAudio.play().catch(() => { });
      }, 2000);
    } else {
      retryCount = 0;

      let nextIndex;
      if (currentMode === 'aleatorio') {
        do {
          nextIndex = Math.floor(Math.random() * playlist.length);
        } while (nextIndex === currentMusicIndex && playlist.length > 1);
      } else {
        nextIndex = (currentMusicIndex + 1) % playlist.length;
      }

      const nextMusicTitle = playlist[nextIndex].title;
      showMessage(`Pulando para: ${nextMusicTitle}`, errorDescription, "pulando", 4000);

      setTimeout(() => {
        loadMusic(nextIndex, true, true, 0);
      }, 3500);
    }
  };

  const spawnNote = () => {
    if (backgroundAudio.paused) return;

    const intensity = getAudioIntensity();
    if (intensity === 0) return;

    const note = document.createElement("div");
    note.className = "floating-note";

    const symbols = ["♩", "♪", "♫", "♬"];
    note.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];

    note.style.color = getColorByIntensity(intensity);

    const scaleVal = 0.7 + (intensity / 130);
    const randX = (Math.random() - 0.5) * 60 + "px";
    const randRot = (Math.random() - 0.5) * 60 + "deg";

    note.style.setProperty("--rand-x", randX);
    note.style.setProperty("--rand-rot", randRot);
    note.style.setProperty("--scale-val", scaleVal);

    if (notesContainer) {
      notesContainer.appendChild(note);
    }

    setTimeout(() => { note.remove(); }, 1200);
  };

  const handleNext = () => {
    retryCount = 0;
    let nextIndex;
    if (currentMode === 'aleatorio') {
      do {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } while (nextIndex === currentMusicIndex && playlist.length > 1);
    } else {
      nextIndex = (currentMusicIndex + 1) % playlist.length;
    }
    loadMusic(nextIndex, true, true, 0);
  };

  const togglePlayPause = () => {
    initAudioAnalyser();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const music = playlist[currentMusicIndex];
    if (backgroundAudio.paused) {
      backgroundAudio.play().then(() => {
        showMessage(music.title, `Max: ${formatTime(backgroundAudio.duration)}`, "tocando", 3500);
      }).catch(() => {
        showMessage("Erro ao iniciar", "00:00", "erro", 3000);
      });
    } else {
      backgroundAudio.pause();
      showMessage("Pausado", `Max: ${formatTime(backgroundAudio.duration)}`, "pausado", 3000);
    }
  };

  const cycleMode = () => {
    const modeKeys = Object.keys(modesConfig);
    const nextModeIndex = (modeKeys.indexOf(currentMode) + 1) % modeKeys.length;
    currentMode = modeKeys[nextModeIndex];

    showMessage(`Modo: ${modesConfig[currentMode].text}`, `Max: ${formatTime(backgroundAudio.duration)}`, "modo", 3500);
  };

  jukeboxTrigger.onmousedown = jukeboxTrigger.ontouchstart = (e) => {
    e.preventDefault();
    isHolding = false;

    holdTimeout = setTimeout(() => {
      isHolding = true;
      cycleMode();
    }, 600);
  };

  jukeboxTrigger.onmouseup = jukeboxTrigger.ontouchend = (e) => {
    e.preventDefault();
    clearTimeout(holdTimeout);
  };

  jukeboxTrigger.onclick = (e) => {
    if (isHolding) return;

    if (clickTimeout === null) {
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
        togglePlayPause();
      }, 250);
    } else {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      handleNext();
    }
  };

  backgroundAudio.onplaying = () => {
    initAudioAnalyser();
    if (!noteInterval) {
      noteInterval = setInterval(spawnNote, 500);
    }
  };

  backgroundAudio.onpause = () => {
    clearInterval(noteInterval);
    noteInterval = null;
  };

  backgroundAudio.onended = () => {
    if (currentMode === 'loop') {
      backgroundAudio.currentTime = 0;
      backgroundAudio.play().catch(() => { });
    } else {
      handleNext();
    }
  };

  window.addEventListener('beforeunload', () => {
    localStorage.setItem('jukebox_index', currentMusicIndex);
    localStorage.setItem('jukebox_mode', currentMode);
    localStorage.setItem('jukebox_time', backgroundAudio.currentTime);
    localStorage.setItem('jukebox_playing', !backgroundAudio.paused);
  });

  loadMusic(currentMusicIndex, wasPlaying, false, savedTime);

  setTimeout(() => {
    showMessage("1x: Play/Pause | 2x: Próxima | Seg.: Modo", "Jukebox Pronta", "instrucoes", 4500);
  }, 800);
};