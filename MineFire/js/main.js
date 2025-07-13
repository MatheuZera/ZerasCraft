// ===============================================
// SETUP GLOBAL E VARIÁVEIS DE JOGO
// ===============================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Objeto para gerenciar o estado global do jogo
window.GLOBAL_GAME_STATE = {
    player1: null,
    player2: null,
    players: [],
    enemies: [],
    projectiles: [],
    particles: [],
    items: [],
    obstacles: [],
    destructibles: [], // Novo array para objetos destrutíveis
    traps: [],         // Novo array para armadilhas
    keys: {},
    mouseX: 0,
    mouseY: 0,
    gameStarted: false,
    gameOver: false,
    currentMode: null,
    animationFrameId: null,
    lastUpdateTime: 0,
    endGame: null,
    soloEnemySpawner: new SoloEnemySpawner()
};

// Referências diretas para facilitar o acesso no main.js
const gameState = window.GLOBAL_GAME_STATE;

// ===============================================
// FUNÇÕES DE GERENCIAMENTO DO JOGO
// ===============================================

function initGame(mode) {
    sfx.buttonClick();
    hideMainMenu();
    hideGameOverScreen();

    gameState.gameStarted = true;
    gameState.gameOver = false;
    gameState.lastUpdateTime = performance.now();

    // Limpa todas as entidades de qualquer jogo anterior
    gameState.players.length = 0;
    gameState.enemies.length = 0;
    gameState.projectiles.length = 0;
    gameState.particles.length = 0;
    gameState.items.length = 0;
    gameState.obstacles.length = 0;
    gameState.destructibles.length = 0; // Limpa destrutíveis
    gameState.traps.length = 0;         // Limpa armadilhas

    // Redefine o controle de teclas
    for (const key in gameState.keys) {
        if (gameState.keys.hasOwnProperty(key)) {
            gameState.keys[key] = false;
        }
    }

    gameState.endGame = endGame;

    if (mode === 'solo') {
        gameState.currentMode = 'solo';
        SOLO_MODE.init(gameState);
    } else if (mode === 'pvp') {
        gameState.currentMode = 'pvp';
        PVP_MODE.init(gameState);
    }

    gameState.player1 = gameState.players[0];
    gameState.player2 = gameState.players[1] || null;

    cancelAnimationFrame(gameState.animationFrameId);
    gameState.animationFrameId = requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    if (gameState.gameOver) return;

    if (gameState.currentMode === 'solo') {
        SOLO_MODE.update(deltaTime, gameState);
    } else if (gameState.currentMode === 'pvp') {
        PVP_MODE.update(deltaTime, gameState);
    }

    // Atualiza projéteis e partículas globalmente (movimento)
    // As colisões e remoções são delegadas aos modos de jogo ou filtradas lá
    gameState.projectiles.forEach(p => p.update(deltaTime));
    // O filtro de projéteis é feito nos modos, mas garantimos que proj.isDead é respeitado.
    gameState.projectiles = gameState.projectiles.filter(p => !p.isDead);

    gameState.particles.forEach(p => p.update(deltaTime));
    gameState.particles = gameState.particles.filter(p => !p.isDead);

    // Itens não precisam de update de movimento, apenas a coleta que já é tratada.
}

function render() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (gameState.currentMode === 'solo') {
        SOLO_MODE.render(ctx, gameState);
    } else if (gameState.currentMode === 'pvp') {
        PVP_MODE.render(ctx, gameState);
    }
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - gameState.lastUpdateTime;
    gameState.lastUpdateTime = timestamp;

    update(deltaTime);
    render();

    if (!gameState.gameOver) {
        gameState.animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function endGame(message) {
    cancelAnimationFrame(gameState.animationFrameId);
    gameState.gameOver = true;
    showGameOverScreen(message);
}

function resetGame() {
    sfx.buttonClick();
    cancelAnimationFrame(gameState.animationFrameId);
    gameState.gameOver = false;
    gameState.gameStarted = false;
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    hideGameOverScreen();
    showMessage("Jogo Reiniciado!", 1000);
    if (gameState.currentMode) {
        initGame(gameState.currentMode);
    } else {
        backToMainMenu();
    }
}

function backToMainMenu() {
    sfx.buttonClick();
    cancelAnimationFrame(gameState.animationFrameId);
    gameState.gameOver = true;
    gameState.gameStarted = false;
    gameState.currentMode = null;
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    hideGameOverScreen();
    showMessage("Voltou ao Menu Principal", 1000);
    resetHUDs();
    showMainMenu();
}

// ===============================================
// GERENCIAMENTO DE EVENTOS DE INPUT
// ===============================================
window.addEventListener('keydown', (e) => {
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(e.key)) {
        e.preventDefault();
    }
    gameState.keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
    gameState.keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    gameState.mouseX = e.clientX - rect.left;
    gameState.mouseY = e.clientY - rect.top;
});
canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0 && gameState.currentMode === 'solo' && gameState.player1) {
        gameState.keys[gameState.player1.controls.attack] = true;
    }
});
canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0 && gameState.currentMode === 'solo' && gameState.player1) {
        gameState.keys[gameState.player1.controls.attack] = false;
    }
});

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// ===============================================
// INICIALIZAÇÃO
// ===============================================

window.onload = () => {
    startSoloBtn.addEventListener('click', () => initGame('solo'));
    startPvPBtn.addEventListener('click', () => initGame('pvp'));

    restartGameBtn.addEventListener('click', resetGame);
    backToMenuBtn.addEventListener('click', backToMainMenu);

    showMainMenu();
};