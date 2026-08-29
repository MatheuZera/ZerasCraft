/* ===================================================================
   LÓGICA: CAMINHOS DINÂMICOS (SUBPASTAS), INSTRUÇÕES, PERSISTÊNCIA & ERROS
=================================================================== */
window.initJukeboxPlayer = function () {
  const backgroundAudio = document.getElementById("backgroundAudio");
  const jukeboxTrigger = document.getElementById("jukeboxTrigger");
  const notesContainer = document.getElementById("notesContainer");
  const centralMessage = document.getElementById("centralMessage");
  const messageTitle = document.getElementById("messageTitle");
  const messageDuration = document.getElementById("messageDuration");
  const msgIconWrapper = document.getElementById("msgIconWrapper");
  const msgIconType = document.getElementById("msgIconType");

  if (!backgroundAudio || !jukeboxTrigger) return;

  // DETECÇÃO AUTOMÁTICA DE SUBPASTAS (Ex: /paginas/site.html)
  // Se estiver em uma subpasta, ajusta o caminho relativo para voltar à raiz corretamente.
  const getBasePath = () => {
    const path = window.location.pathname;
    return (path.includes('/paginas/') || path.includes('/pages/')) ? '../' : './';
  };

  const basePath = getBasePath();

    const playlist = [
        // AMBIENTE (Background) - Azul Claro
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'A Familiar Room', src: 'assets/audios/musics/background/a_familiar_room.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Aerie (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Aerie.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'An Ordinary Day', src: 'assets/audios/musics/background/an_ordinary_day.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Ancestry', src: 'assets/audios/musics/background/ancestry.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Bromeliad', src: 'assets/audios/musics/background/bromeliad.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Calm 1', src: 'assets/audios/musics/background/calm1.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Calm 2', src: 'assets/audios/musics/background/calm2.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Calm 3', src: 'assets/audios/musics/background/calm3.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Comforting Memories (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Comforting.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Creator (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Creator.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Dunes', src: 'assets/audios/musics/background/dunes.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Echo in the Wind', src: 'assets/audios/musics/background/echo_in_the_wind.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Firebugs', src: 'assets/audios/musics/background/firebugs.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Floating Dream', src: 'assets/audios/musics/background/floating_dream.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Hal 1', src: 'assets/audios/musics/background/hal1.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Hal 2', src: 'assets/audios/musics/background/hal2.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Hal 3', src: 'assets/audios/musics/background/hal3.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Hal 4', src: 'assets/audios/musics/background/hal4.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Infinite Amethyst (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Infinity.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Labyrinthine', src: 'assets/audios/musics/background/labyrinthine.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Left to Bloom (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Left.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Nuance 1', src: 'assets/audios/musics/background/nuance1.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Nuance 2', src: 'assets/audios/musics/background/nuance2.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'One more Day!', src: 'assets/audios/musics/background/one_more_day.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Otherside (Andrew Prahlow Remix)', src: 'assets/audios/musics/background/Otherside.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Piano 1', src: 'assets/audios/musics/background/piano1.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Piano 2', src: 'assets/audios/musics/background/piano2.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Piano 3', src: 'assets/audios/musics/background/piano3.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Stand Tall', src: 'assets/audios/musics/background/stand_tall.mp3' },
        { icon: 'fas fa-cloud', color: '#00d2ff', playlist: 'Ambiente', title: 'Wending', src: 'assets/audios/musics/background/wending.mp3' },

        // C418 ALBUM - Verde Clássico
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Aria Math', src: 'assets/audios/musics/c418/Aria-Math.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Beginning', src: 'assets/audios/musics/c418/Beginning.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Biome Fest', src: 'assets/audios/musics/c418/Biome-Fest.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Blind Spots', src: 'assets/audios/musics/c418/Blind-Spots.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Clark', src: 'assets/audios/musics/c418/Clark.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Danny', src: 'assets/audios/musics/c418/Danny.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Dreiton', src: 'assets/audios/musics/c418/Dreiton.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Dry Hands', src: 'assets/audios/musics/c418/Dry-Hands.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Floating Trees', src: 'assets/audios/musics/c418/Floating-Trees.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Haggstrom', src: 'assets/audios/musics/c418/Haggstrom.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Key', src: 'assets/audios/musics/c418/Key.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Living Mice', src: 'assets/audios/musics/c418/Living-Mice.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Mice On Venus', src: 'assets/audios/musics/c418/Mice-On-Venus.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Minecraft', src: 'assets/audios/musics/c418/Minecraft.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Moog City 1', src: 'assets/audios/musics/c418/Moog-City1.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Moog City 2', src: 'assets/audios/musics/c418/Moog-City2.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Mutation', src: 'assets/audios/musics/c418/Mutation.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Sweden', src: 'assets/audios/musics/c418/Sweden.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Taswell', src: 'assets/audios/musics/c418/Taswell.mp3' },
        { icon: 'fas fa-cube', color: '#54bd34', playlist: 'C418', title: 'Wet Hands', src: 'assets/audios/musics/c418/Wet-Hands.mp3' },

        // CREATIVE MUSICS - Verde Folha
        { icon: 'fas fa-leaf', color: '#8bc34a', playlist: 'Creative', title: 'Creative 1', src: 'assets/audios/musics/minecraft/Creative1.mp3' },
        { icon: 'fas fa-leaf', color: '#8bc34a', playlist: 'Creative', title: 'Creative 2', src: 'assets/audios/musics/minecraft/Creative2.mp3' },
        { icon: 'fas fa-leaf', color: '#8bc34a', playlist: 'Creative', title: 'Creative 3', src: 'assets/audios/musics/minecraft/Creative3.mp3' },
        { icon: 'fas fa-leaf', color: '#8bc34a', playlist: 'Creative', title: 'Creative 4', src: 'assets/audios/musics/minecraft/Creative4.mp3' },
        { icon: 'fas fa-leaf', color: '#8bc34a', playlist: 'Creative', title: 'Creative 5', src: 'assets/audios/musics/minecraft/Creative5.mp3' },
        { icon: 'fas fa-leaf', color: '#8bc34a', playlist: 'Creative', title: 'Creative 6', src: 'assets/audios/musics/minecraft/Creative6.mp3' },

        // END MUSICS - Roxo
        { icon: 'fas fa-bolt', color: '#9c27b0', playlist: 'End', title: 'Boss', src: 'assets/audios/musics/end/Boss.mp3' },
        { icon: 'fas fa-bolt', color: '#9c27b0', playlist: 'End', title: 'Créditos', src: 'assets/audios/musics/end/Credits.mp3' },
        { icon: 'fas fa-bolt', color: '#9c27b0', playlist: 'End', title: 'Fim', src: 'assets/audios/musics/end/End.mp3' },

        // MUSICS GENERAL - Rosa
        { icon: 'fas fa-music', color: '#e91e63', playlist: 'Músicas', title: 'Alone', src: 'assets/audios/musics/musics/Alone.mp3' },
        { icon: 'fas fa-music', color: '#e91e63', playlist: 'Músicas', title: 'Aria Math Lofi', src: 'assets/audios/musics/musics/Aria-Math-Lofi.mp3' },
        { icon: 'fas fa-music', color: '#e91e63', playlist: 'Músicas', title: 'Megalovania (hakkaku)', src: 'assets/audios/musics/musics/Megalovania.mp3' },
        { icon: 'fas fa-music', color: '#e91e63', playlist: 'Músicas', title: 'Over the Waterfall (Varu)', src: 'assets/audios/musics/musics/Over-the-Waterfall.mp3' },
        { icon: 'fas fa-music', color: '#e91e63', playlist: 'Músicas', title: 'Rat Dance (Jatis)', src: 'assets/audios/musics/musics/Rat-Dance.mp3' },
        { icon: 'fas fa-music', color: '#e91e63', playlist: 'Músicas', title: 'The Fat Rat - Note Block', src: 'assets/audios/musics/musics/TheFatRat_NoteBlock.mp3' },

        // NETHER MUSICS - Vermelho Fogo
        { icon: 'fas fa-meteor', color: '#f44336', playlist: 'Nether', title: 'Chrysopoeia', src: 'assets/audios/musics/nether/Chrysopoeia.mp3' },
        { icon: 'fas fa-meteor', color: '#f44336', playlist: 'Nether', title: 'Nether 1', src: 'assets/audios/musics/nether/Nether1.mp3' },
        { icon: 'fas fa-meteor', color: '#f44336', playlist: 'Nether', title: 'Nether 2', src: 'assets/audios/musics/nether/Nether2.mp3' },
        { icon: 'fas fa-meteor', color: '#f44336', playlist: 'Nether', title: 'Nether 3', src: 'assets/audios/musics/nether/Nether3.mp3' },
        { icon: 'fas fa-meteor', color: '#f44336', playlist: 'Nether', title: 'Nether 4', src: 'assets/audios/musics/nether/Nether4.mp3' },
        { icon: 'fas fa-meteor', color: '#f44336', playlist: 'Nether', title: 'Rubedo', src: 'assets/audios/musics/nether/Rubedo.mp3' },
        { icon: 'fas fa-meteor', color: '#f44336', playlist: 'Nether', title: 'So Below', src: 'assets/audios/musics/nether/So_Below.mp3' },

        // RECORDS - Amarelo / Dourado
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Blocks', src: 'assets/audios/musics/records/Blocks.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Cat', src: 'assets/audios/musics/records/Cat.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Far', src: 'assets/audios/musics/records/Far.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Mall', src: 'assets/audios/musics/records/Mall.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Mellohi', src: 'assets/audios/musics/records/Mellohi.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Otherside', src: 'assets/audios/musics/records/Otherside.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Pingstep Master', src: 'assets/audios/musics/records/Pingstep_Master.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Relic', src: 'assets/audios/musics/records/Relic.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Stal', src: 'assets/audios/musics/records/Stal.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Strad', src: 'assets/audios/musics/records/Strad.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Wait', src: 'assets/audios/musics/records/Wait.mp3' },
        { icon: 'fas fa-compact-disc', color: '#ffc107', playlist: 'Discos', title: 'Ward', src: 'assets/audios/musics/records/Ward.mp3' },

        // REMIX - Laranja
        { icon: 'fas fa-fire', color: '#ff9800', playlist: 'Remix', title: 'Aria Math (Synthwave)', src: 'assets/audios/musics/remix/Aria-Math.mp3' },
        { icon: 'fas fa-fire', color: '#ff9800', playlist: 'Remix', title: 'Aria Math Piano', src: 'assets/audios/musics/remix/Aria-Math-Piano.mp3' },
        { icon: 'fas fa-fire', color: '#ff9800', playlist: 'Remix', title: 'Cat Remix (Caution & Remix)', src: 'assets/audios/musics/remix/Cat-Remix.mp3' },
        { icon: 'fas fa-fire', color: '#ff9800', playlist: 'Remix', title: 'Minecraft Music Remix', src: 'assets/audios/musics/remix/Minecraft-Remix.mp3' },
        { icon: 'fas fa-fire', color: '#ff9800', playlist: 'Remix', title: 'Pigstep Remix (Fury Hearted)', src: 'assets/audios/musics/remix/Pigstep-Remix.mp3' },
        { icon: 'fas fa-fire', color: '#ff9800', playlist: 'Remix', title: 'Sweden Remix (Caution & Crisis)', src: 'assets/audios/musics/remix/Sweden.mp3' },

        // WATER - Azul
        { icon: 'fas fa-water', color: '#03a9f4', playlist: 'Water', title: 'Axolotl', src: 'assets/audios/musics/water/Axolotl.mp3' },
        { icon: 'fas fa-water', color: '#03a9f4', playlist: 'Water', title: 'Dragon Fish', src: 'assets/audios/musics/water/Dragon_Fish.mp3' },
        { icon: 'fas fa-water', color: '#03a9f4', playlist: 'Water', title: 'Shuniji', src: 'assets/audios/musics/water/Shuniji.mp3' }
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
        iconClass = modesConfig[currentMode]?.icon || "fa-sync-alt";
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
      showMessage("Erro Crítico", errorDescription, "erro", 4000);
      setTimeout(() => { handleNext(); }, 4000);
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
    if (currentMode === 'aleatorio') {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } while (nextIndex === currentMusicIndex && playlist.length > 1);
      currentMusicIndex = nextIndex;
    } else {
      currentMusicIndex = (currentMusicIndex + 1) % playlist.length;
    }
    loadMusic(currentMusicIndex, true, true, 0);
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

  // Gestos na Jukebox
  jukeboxTrigger.onmousedown = jukeboxTrigger.ontouchstart = (e) => {
    e.preventDefault();
    isHolding = false;

    holdTimeout = setTimeout(() => {
      isHolding = true;
      cycleMode(); // Segurar = Alterar Modo
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
        togglePlayPause(); // 1 Clique = Play/Pause
      }, 250);
    } else {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      handleNext(); // 2 Cliques = Próxima Música
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

  // Salva o estado atual continuamente no localStorage antes de sair/mudar de página
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('jukebox_index', currentMusicIndex);
    localStorage.setItem('jukebox_mode', currentMode);
    localStorage.setItem('jukebox_time', backgroundAudio.currentTime);
    localStorage.setItem('jukebox_playing', !backgroundAudio.paused);
  });

  // Inicialização: Carrega a música e exibe as instruções iniciais para o usuário
  loadMusic(currentMusicIndex, wasPlaying, false, savedTime);

  // Exibe as instruções de comandos logo no início da página
  setTimeout(() => {
    showMessage("1x: Play/Pause | 2x: Próxima | Seg.: Modo", "Jukebox Pronta", "instrucoes", 4500);
  }, 800);
};