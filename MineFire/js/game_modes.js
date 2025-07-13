// ===============================================
// ESTADO GLOBAL DO JOGO
// ===============================================
window.GLOBAL_GAME_STATE = {
    gameRunning: false,
    currentMode: null, // 'solo' ou 'pvp'
    players: [],
    enemies: [],
    projectiles: [],
    items: [],
    obstacles: [],
    destructibles: [],
    traps: [],
    particles: [],
    keys: {},
    mouseX: 0,
    mouseY: 0,
    lastFrameTime: 0,
    gameLoopRequestId: null, // Para cancelar o requestAnimationFrame
    score: 0,
    wave: 0,
    enemiesSpawnedThisWave: 0,
    maxEnemiesPerWave: 5,
    spawnCooldown: 1500,
    lastSpawnTime: 0,
    totalEnemiesKilled: 0
};

// Obtenha o canvas e o contexto uma vez na inicialização global
const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d') : null; // Verificação para evitar erro se canvas não existir

// ===============================================
// FUNÇÕES DE GERENCIAMENTO DE JOGO
// ===============================================

function initGame(mode) {
    console.log('--- Iniciando Jogo --- Modo:', mode);
    const gameState = window.GLOBAL_GAME_STATE;

    // Resetar estado do jogo para um novo início limpo
    gameState.players = [];
    gameState.enemies = [];
    gameState.projectiles = [];
    gameState.items = [];
    gameState.obstacles = [];
    gameState.destructibles = [];
    gameState.traps = [];
    gameState.particles = [];
    gameState.keys = {}; // Limpar teclas
    gameState.score = 0;
    gameState.wave = 0;
    gameState.enemiesSpawnedThisWave = 0;
    gameState.maxEnemiesPerWave = 5;
    gameState.spawnCooldown = 1500;
    gameState.lastSpawnTime = 0;
    gameState.totalEnemiesKilled = 0;
    gameState.currentMode = mode;
    gameState.gameRunning = true;

    // Esconder menus e mostrar canvas e HUDs
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('gameCanvas').classList.remove('hidden');
    document.getElementById('hud-p1').classList.remove('hidden');
    if (mode === 'pvp') {
        document.getElementById('hud-p2').classList.remove('hidden');
    } else {
        document.getElementById('hud-p2').classList.add('hidden');
    }


    // Inicializar jogadores
    gameState.players.push(new Player(
        GAME_WIDTH / 4, GAME_HEIGHT / 2, 1, 'blue',
        { up: 'w', down: 's', left: 'a', right: 'd', attack: 'Alt', dash: 'Shift', reload: 'r', weaponNext: 'e', weaponPrev: 'q', special: 'x' }
    ));
    if (mode === 'pvp') {
        gameState.players.push(new Player(
            GAME_WIDTH * 3 / 4 - PLAYER_SIZE, GAME_HEIGHT / 2, 2, 'green',
            { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', attack: 'Shift', dash: 'l', reload: 'k', weaponNext: 'p', weaponPrev: 'o', special: 'm' }
        ));
    }

    // Gerar objetos aleatórios no mapa
    generateMapObjects();

    // Iniciar a primeira onda de inimigos (apenas em modo solo)
    if (gameState.currentMode === 'solo') {
        startNextWave();
    }

    // Certifique-se de que o loop do jogo só seja iniciado uma vez
    if (gameState.gameLoopRequestId) {
        cancelAnimationFrame(gameState.gameLoopRequestId);
    }
    gameState.lastFrameTime = performance.now();
    gameState.gameLoopRequestId = requestAnimationFrame(gameLoop);
    console.log('Jogo iniciado. gameLoopRequestId:', gameState.gameLoopRequestId);
}

function endGame() {
    console.log('--- Encerrando Jogo ---');
    const gameState = window.GLOBAL_GAME_STATE;
    gameState.gameRunning = false;
    if (gameState.gameLoopRequestId) {
        cancelAnimationFrame(gameState.gameLoopRequestId);
        gameState.gameLoopRequestId = null;
    }

    // Mostrar menu principal e esconder tudo o mais
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('gameCanvas').classList.add('hidden');
    document.getElementById('hud-p1').classList.add('hidden');
    document.getElementById('hud-p2').classList.add('hidden');
}

function pauseGame() {
    console.log('Jogo Pausado.');
    window.GLOBAL_GAME_STATE.gameRunning = false;
    document.getElementById('pause-menu').classList.remove('hidden');
}

function resumeGame() {
    console.log('Jogo Retomado.');
    window.GLOBAL_GAME_STATE.gameRunning = true;
    document.getElementById('pause-menu').classList.add('hidden');
    window.GLOBAL_GAME_STATE.lastFrameTime = performance.now(); // Resetar para evitar salto no tempo
    // Retomar o loop se ele foi parado (não deveria, pauseGame apenas define gameRunning = false)
    if (!window.GLOBAL_GAME_STATE.gameLoopRequestId) {
         window.GLOBAL_GAME_STATE.gameLoopRequestId = requestAnimationFrame(gameLoop);
    }
}

function gameLoop(currentTime) {
    const gameState = window.GLOBAL_GAME_STATE;

    if (!gameState.gameRunning) {
        // console.log('Game loop parado (gameRunning é false).');
        gameState.gameLoopRequestId = null; // Garante que não continuará pedindo frames
        return;
    }

    const deltaTime = currentTime - gameState.lastFrameTime;
    gameState.lastFrameTime = currentTime;

    update(deltaTime);
    draw();

    gameState.gameLoopRequestId = requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    const gameState = window.GLOBAL_GAME_STATE;

    // Atualizar jogadores
    gameState.players.forEach((player, index) => {
        const otherPlayer = gameState.players[1 - index]; // Pega o outro jogador para a mira no PvP
        player.update(deltaTime, otherPlayer);
    });

    // Lógica de Spawn de Inimigos (apenas em modo solo)
    if (gameState.currentMode === 'solo') {
        if (gameState.enemiesSpawnedThisWave < gameState.maxEnemiesPerWave && Date.now() - gameState.lastSpawnTime > gameState.spawnCooldown) {
            spawnEnemy();
            gameState.lastSpawnTime = Date.now();
        }
        // Verificar se todos os inimigos da wave foram mortos para iniciar a próxima
        if (gameState.enemiesSpawnedThisWave >= gameState.maxEnemiesPerWave && gameState.enemies.length === 0) {
            startNextWave();
        }

        gameState.enemies.forEach(enemy => {
            const targetPlayer = gameState.players[0]; // Inimigos perseguem P1 em modo solo
            if (targetPlayer && !targetPlayer.isDead) {
                enemy.update(deltaTime, targetPlayer);
            } else {
                enemy.update(deltaTime, null); // Se P1 morrer, inimigos param
            }
        });
    }

    // Atualizar projéteis
    gameState.projectiles.forEach(projectile => {
        projectile.update(deltaTime);
    });

    // Atualizar partículas
    gameState.particles.forEach(particle => {
        particle.update(deltaTime);
    });

    // Atualizar armadilhas
    gameState.traps.forEach(trap => {
        trap.update(deltaTime, gameState.players, gameState.particles);
    });

    // --- Lógica de Colisão e Interação ---

    // Colisão Jogador-Inimigo (apenas em modo solo para inimigos)
    if (gameState.currentMode === 'solo') {
        gameState.players.forEach(player => {
            if (player.isDead) return;
            gameState.enemies.forEach(enemy => {
                if (!enemy.isDead && checkCollision(player, enemy)) {
                    resolveCollision(player, enemy);
                    // O dano direto do inimigo ao jogador é tratado dentro do update do inimigo.
                }
            });
        });
    }

    // Colisão Projétil-Inimigo (jogador -> inimigo)
    gameState.projectiles.forEach(projectile => {
        if (projectile.isDead) return;
        if (projectile.owner instanceof Player) {
            gameState.enemies.forEach(enemy => {
                if (!enemy.isDead && checkCollision(projectile, enemy)) {
                    enemy.takeDamage(projectile.damage);
                    projectile.isDead = true;
                    createImpactParticles(projectile.x + projectile.width/2, projectile.y + projectile.height/2, 5, 4, 'red', 1, 300, gameState.particles);
                }
            });
            // Colisão de projéteis com objetos destrutíveis
            gameState.destructibles.forEach(destructible => {
                if (!destructible.isDead && checkCollision(projectile, destructible)) {
                    destructible.takeDamage(projectile.damage);
                    projectile.isDead = true;
                    createImpactParticles(projectile.x + projectile.width/2, projectile.y + projectile.height/2, 5, 4, 'gray', 1, 300, gameState.particles);
                }
            });
        }
    });

    // Colisão Projétil-Jogador (inimigo -> jogador) OU Projétil-Jogador (jogador -> jogador em PvP)
    gameState.projectiles.forEach(projectile => {
        if (projectile.isDead) return;
        gameState.players.forEach(player => {
            if (!player.isDead && checkCollision(projectile, player)) {
                // Projétil inimigo acertou jogador, ou jogador atirou em outro jogador (friendly fire)
                if ((projectile.owner instanceof Enemy) || (gameState.currentMode === 'pvp' && projectile.owner !== player)) {
                    player.takeDamage(projectile.damage);
                    projectile.isDead = true;
                    createImpactParticles(projectile.x + projectile.width/2, projectile.y + projectile.height/2, 5, 4, 'purple', 1, 300, gameState.particles);
                }
            }
        });
    });

    // Colisão Jogador-Item
    gameState.players.forEach(player => {
        if (player.isDead) return;
        gameState.items.forEach(item => {
            if (!item.isCollected && checkCollision(player, item)) {
                player.collectItem(item);
                item.isCollected = true;
            }
        });
    });

    // Colisão Jogador-Obstáculo e Inimigo-Obstáculo
    const allStaticObstacles = [...gameState.obstacles, ...gameState.destructibles];
    gameState.players.forEach(player => {
        if (player.isDead) return;
        allStaticObstacles.forEach(obstacle => {
            if (!obstacle.isDead && checkCollision(player, obstacle)) {
                resolveCollision(player, obstacle);
            }
        });
    });

    if (gameState.currentMode === 'solo') {
        gameState.enemies.forEach(enemy => {
            if (enemy.isDead) return;
            allStaticObstacles.forEach(obstacle => {
                if (!obstacle.isDead && checkCollision(enemy, obstacle)) {
                    resolveCollision(enemy, obstacle);
                }
            });
        });
    }

    // Remover entidades mortas/coletadas/fora da tela
    gameState.enemies = gameState.enemies.filter(enemy => {
        if (enemy.isDead) {
            enemy.onDeath(gameState.items, gameState.enemies, gameState.players); // Chamar onDeath aqui
            gameState.totalEnemiesKilled++; // Contar inimigos mortos
            return false; // Remove
        }
        return true;
    });
    gameState.projectiles = gameState.projectiles.filter(projectile => !projectile.isDead);
    gameState.items = gameState.items.filter(item => !item.isCollected);
    gameState.particles = gameState.particles.filter(particle => !particle.isDead);
    gameState.destructibles = gameState.destructibles.filter(destructible => !destructible.isDead);

    // Lógica de Fim de Jogo (Game Over)
    if (gameState.currentMode === 'solo') {
        if (gameState.players[0] && gameState.players[0].isDead) {
            gameOver("Você foi derrotado! Onda " + gameState.wave);
        }
    } else if (gameState.currentMode === 'pvp') {
        const p1Dead = gameState.players[0] && gameState.players[0].isDead;
        const p2Dead = gameState.players[1] && gameState.players[1].isDead;

        if (p1Dead && p2Dead) {
            gameOver("Empate! Ambos foram derrotados.");
        } else if (p1Dead) {
            gameOver("Jogador 2 Venceu!");
        } else if (p2Dead) {
            gameOver("Jogador 1 Venceu!");
        }
    }

    // Atualizar HUD
    updateHUD();
}

function draw() {
    if (!ctx) {
        console.error("Contexto do canvas não está disponível.");
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    // Desenhar elementos na ordem correta
    window.GLOBAL_GAME_STATE.obstacles.forEach(obstacle => obstacle.draw(ctx));
    window.GLOBAL_GAME_STATE.destructibles.forEach(destructible => destructible.draw(ctx));
    window.GLOBAL_GAME_STATE.traps.forEach(trap => trap.draw(ctx));
    window.GLOBAL_GAME_STATE.items.forEach(item => item.draw(ctx));
    window.GLOBAL_GAME_STATE.enemies.forEach(enemy => enemy.draw(ctx));
    window.GLOBAL_GAME_STATE.players.forEach(player => player.draw(ctx));
    window.GLOBAL_GAME_STATE.projectiles.forEach(projectile => projectile.draw(ctx));
    window.GLOBAL_GAME_STATE.particles.forEach(particle => particle.draw(ctx));
}

function spawnEnemy() {
    const gameState = window.GLOBAL_GAME_STATE;
    const enemyTypes = ['melee', 'ranged', 'tank', 'fast', 'suicide', 'splitter'];
    const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

    let spawnX, spawnY;
    const padding = 50; // Distância mínima da borda para spawnar
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

    switch (side) {
        case 0: // Top
            spawnX = Math.random() * (GAME_WIDTH - ENEMY_SIZE);
            spawnY = -ENEMY_SIZE - padding;
            break;
        case 1: // Right
            spawnX = GAME_WIDTH + padding;
            spawnY = Math.random() * (GAME_HEIGHT - ENEMY_SIZE);
            break;
        case 2: // Bottom
            spawnX = Math.random() * (GAME_WIDTH - ENEMY_SIZE);
            spawnY = GAME_HEIGHT + padding;
            break;
        case 3: // Left
            spawnX = -ENEMY_SIZE - padding;
            spawnY = Math.random() * (GAME_HEIGHT - ENEMY_SIZE);
            break;
    }

    gameState.enemies.push(new Enemy(spawnX, spawnY, randomType));
    gameState.enemiesSpawnedThisWave++;
    console.log(`Spawned ${randomType} enemy. Total for wave: ${gameState.enemiesSpawnedThisWave}/${gameState.maxEnemiesPerWave}`);
}

function startNextWave() {
    const gameState = window.GLOBAL_GAME_STATE;
    gameState.wave++;
    gameState.enemiesSpawnedThisWave = 0;
    gameState.maxEnemiesPerWave += 2; // Aumenta o número de inimigos por onda
    gameState.spawnCooldown = Math.max(500, gameState.spawnCooldown - 50); // Diminui o cooldown mínimo
    showMessage(`Onda ${gameState.wave} INICIADA!`, 2000);
    console.log(`Iniciando Onda ${gameState.wave}. Inimigos nesta onda: ${gameState.maxEnemiesPerWave}`);

    // Cura um pouco os jogadores no início da onda
    gameState.players.forEach(player => {
        if (!player.isDead) {
            player.health = Math.min(player.maxHealth, player.health + 10);
            player.energy = Math.min(player.maxEnergy, player.energy + 10);
        }
    });

    // Adiciona um boss a cada 5 ondas
    if (gameState.wave % 5 === 0 && gameState.wave > 0) { // Garante que não é na onda 0
        const spawnX = Math.random() * (GAME_WIDTH - ENEMY_SIZE * 2.5);
        const spawnY = Math.random() * (GAME_HEIGHT - ENEMY_SIZE * 2.5);
        gameState.enemies.push(new Enemy(spawnX, spawnY, 'boss_cube'));
        showMessage("CHEFE APARECEU!", 3000);
    }
}

function generateMapObjects() {
    const gameState = window.GLOBAL_GAME_STATE;
    // Limpa objetos antigos antes de gerar novos
    gameState.obstacles = [];
    gameState.destructibles = [];
    gameState.traps = [];

    // Gerar obstáculos aleatórios
    for (let i = 0; i < 5; i++) {
        gameState.obstacles.push(new Obstacle(
            Math.random() * (GAME_WIDTH - OBSTACLE_SIZE),
            Math.random() * (GAME_HEIGHT - OBSTACLE_SIZE),
            OBSTACLE_SIZE, OBSTACLE_SIZE
        ));
    }
    // Gerar destrutíveis aleatórios
    for (let i = 0; i < 7; i++) {
        gameState.destructibles.push(new Destructible(
            Math.random() * (GAME_WIDTH - DESTRUCTIBLE_SIZE),
            Math.random() * (GAME_HEIGHT - DESTRUCTIBLE_SIZE),
            DESTRUCTIBLE_SIZE, DESTRUCTIBLE_SIZE, 40 // HP para destrutíveis
        ));
    }
    // Gerar armadilhas aleatórias
    for (let i = 0; i < 3; i++) {
        gameState.traps.push(new Trap(
            Math.random() * (GAME_WIDTH - TRAP_SIZE),
            Math.random() * (GAME_HEIGHT - TRAP_SIZE),
            TRAP_SIZE, TRAP_SIZE, 15, 1500 // 15 de dano, 1.5s de cooldown
        ));
    }
}

function gameOver(message) {
    console.log('--- GAME OVER ---', message);
    const gameState = window.GLOBAL_GAME_STATE;
    gameState.gameRunning = false;
    if (gameState.gameLoopRequestId) {
        cancelAnimationFrame(gameState.gameLoopRequestId);
        gameState.gameLoopRequestId = null;
    }

    document.getElementById('gameCanvas').classList.add('hidden');
    document.getElementById('hud-p1').classList.add('hidden');
    document.getElementById('hud-p2').classList.add('hidden');

    const gameOverScreen = document.getElementById('game-over-screen');
    if (!gameOverScreen) {
        // Isso não deve acontecer se o HTML estiver correto, mas é uma segurança
        console.error("Elemento #game-over-screen não encontrado.");
        return;
    }
    document.getElementById('game-over-message').textContent = message;
    gameOverScreen.classList.remove('hidden');

    // Remove listeners antigos para evitar duplicação
    const restartBtn = document.getElementById('restart-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    const newRestartHandler = () => { sfx.play('buttonClick'); gameOverScreen.classList.add('hidden'); initGame(gameState.currentMode); };
    const newBackToMenuHandler = () => { sfx.play('buttonClick'); gameOverScreen.classList.add('hidden'); endGame(); };

    // Remover e adicionar para garantir que não haja múltiplos listeners
    restartBtn.removeEventListener('click', restartBtn._currentHandler);
    backToMenuBtn.removeEventListener('click', backToMenuBtn._currentHandler);

    restartBtn.addEventListener('click', newRestartHandler);
    backToMenuBtn.addEventListener('click', newBackToMenuHandler);

    restartBtn._currentHandler = newRestartHandler;
    backToMenuBtn._currentHandler = newBackToMenuHandler;
}


// ===============================================
// EVENT LISTENERS GLOBAIS
// ===============================================

// Garante que o canvas e o contexto existem antes de adicionar listeners que os usam
if (canvas) {
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        window.GLOBAL_GAME_STATE.mouseX = e.clientX - rect.left;
        window.GLOBAL_GAME_STATE.mouseY = e.clientY - rect.top;
    });
} else {
    console.error("Canvas element not found. Game cannot initialize correctly.");
}


document.addEventListener('keydown', (e) => {
    // console.log("Key Down:", e.key); // Debugging de teclas
    window.GLOBAL_GAME_STATE.keys[e.key] = true;

    // Pausar/Despausar com 'Escape'
    if (e.key === 'Escape') {
        if (window.GLOBAL_GAME_STATE.gameRunning) {
            pauseGame();
        } else if (document.getElementById('pause-menu').classList.contains('hidden') &&
                   document.getElementById('main-menu').classList.contains('hidden') &&
                   document.getElementById('game-over-screen').classList.contains('hidden')) {
            // Se o jogo não está rodando, mas nenhum menu está visível (ex: após um Game Over e o menu foi fechado, mas o usuário não clicou em nada)
            // Não faz nada aqui, esperando o usuário interagir com os botões.
        } else if (!document.getElementById('pause-menu').classList.contains('hidden')) {
            // Se o menu de pausa está visível, resume
            resumeGame();
        }
    }
});

document.addEventListener('keyup', (e) => {
    window.GLOBAL_GAME_STATE.keys[e.key] = false;
});

// Event listeners para os botões do menu principal
document.getElementById('start-solo-btn').addEventListener('click', () => {
    sfx.play('buttonClick');
    initGame('solo');
});

document.getElementById('start-pvp-btn').addEventListener('click', () => {
    sfx.play('buttonClick');
    initGame('pvp');
});

// Event listeners para os botões do menu de pausa
document.getElementById('resume-btn').addEventListener('click', () => {
    sfx.play('buttonClick');
    resumeGame();
});

document.getElementById('main-menu-btn').addEventListener('click', () => {
    sfx.play('buttonClick');
    endGame();
});

// Inicialização (garante que o menu principal aparece ao carregar a página)
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('gameCanvas').classList.add('hidden'); // Oculta o canvas no início
    // Garante que os HUDs estão ocultos no início
    document.getElementById('hud-p1').classList.add('hidden');
    document.getElementById('hud-p2').classList.add('hidden');
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');

    // Inicializa o sound manager para pré-carregar os sons
    sfx.loadSounds();
});