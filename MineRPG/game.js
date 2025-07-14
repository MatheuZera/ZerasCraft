// game.js

// --- Configurações Globais ---
const CANVAS_WIDTH = 800; // Largura interna do jogo (o mundo inteiro visível)
const CANVAS_HEIGHT = 600; // Altura interna do jogo (o mundo inteiro visível)
const PLAYER_SIZE = 30;
const PLAYER_SPEED = 3;
const PLAYER_SPRINT_SPEED_MULTIPLIER = 1.5;
const ENERGY_COST_SPRINT = 0.5;
const ENERGY_REGEN_RATE = 0.8;
const MAX_HEALTH = 100;
const MAX_ENERGY = 100;
const STARTING_ARROWS = 20;

const ARROW_SPEED = 10;
const ARROW_SIZE = 10;

const PICKUP_SPAWN_INTERVAL = 5000;
const MAX_PICKUPS = 3;

// Obtenção dos elementos do DOM
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
// Removido o set de width/height aqui, será feito via JS e CSS
// gameCanvas.width = CANVAS_WIDTH;
// gameCanvas.height = CANVAS_HEIGHT;

const messagesContainer = document.getElementById('messages');
const gamepad1Info = document.getElementById('gamepad1Info');
const gamepad2Info = document.getElementById('gamepad2Info');

const player1ControlsDisplay = document.getElementById('player1-controls');
const player2ControlsDisplay = document.getElementById('player2-controls');
const player3ControlsDisplay = document.getElementById('player3-controls');
const player4ControlsDisplay = document.getElementById('player4-controls');


// Variáveis de estado do jogo
let gameRunning = false;
let players = [];
let projectiles = [];
let pickups = [];
let obstacles = [];

let lastFrameTime = 0;
let lastPickupSpawnTime = 0;

// Variáveis da câmera
// Simplificaremos estas variáveis, pois a câmera será fixa
let cameraShakeIntensity = 0;
let cameraShakeTimer = 0;

// Removemos CAMERA_ZOOM_FACTOR, pois a câmera exibirá o mapa inteiro.


// --- Mapeamento de Controles para Gamepad e Teclado ---
const CONTROLS = {
    PLAYER1: {
        type: 'keyboard',
        displayElement: player1ControlsDisplay,
        moveUp: { keyboard: 'w' },
        moveDown: { keyboard: 's' },
        moveLeft: { keyboard: 'a' },
        moveRight: { keyboard: 'd' },
        attack: { keyboard: 'c' },
        sprint: { keyboard: 'f' }
    },
    PLAYER2: {
        type: 'keyboard',
        displayElement: player2ControlsDisplay,
        moveUp: { keyboard: 'ArrowUp' },
        moveDown: { keyboard: 'ArrowDown' },
        moveLeft: { keyboard: 'ArrowLeft' },
        moveRight: { keyboard: 'ArrowRight' },
        attack: { keyboard: 'e' },
        sprint: { keyboard: 'p' }
    },
    PLAYER3: {
        type: 'gamepad',
        displayElement: player3ControlsDisplay,
        // Mapeamentos comuns para PlayStation e Xbox para P3
        psButtons: { // PlayStation: D-Pad / L1/L2
            moveUp: { gamepadButton: 12, label: 'D-Pad ↑' },
            moveDown: { gamepadButton: 13, label: 'D-Pad ↓' },
            moveLeft: { gamepadButton: 14, label: 'D-Pad ←' },
            moveRight: { gamepadButton: 15, label: 'D-Pad →' },
            attack: { gamepadButton: 6, label: 'L2' }, // L2
            sprint: { gamepadButton: 4, label: 'L1' }  // L1
        },
        xboxButtons: { // Xbox: D-Pad / LB/LT
            moveUp: { gamepadButton: 12, label: 'D-Pad ↑' },
            moveDown: { gamepadButton: 13, label: 'D-Pad ↓' },
            moveLeft: { gamepadButton: 14, label: 'D-Pad ←' },
            moveRight: { gamepadButton: 15, label: 'D-Pad →' },
            attack: { gamepadButton: 6, label: 'LT' }, // LT
            sprint: { gamepadButton: 4, label: 'LB' }  // LB
        }
    },
    PLAYER4: {
        type: 'gamepad',
        displayElement: player4ControlsDisplay,
        // Mapeamentos comuns para PlayStation e Xbox para P4
        psButtons: { // PlayStation: Botões de Ação / R1/R2
            moveUp: { gamepadButton: 3, label: '△' }, // Triângulo
            moveDown: { gamepadButton: 0, label: 'X' }, // X
            moveLeft: { gamepadButton: 2, label: '□' }, // Quadrado
            moveRight: { gamepadButton: 1, label: '○' }, // Círculo
            attack: { gamepadButton: 7, label: 'R2' }, // R2
            sprint: { gamepadButton: 5, label: 'R1' }  // R1
        },
        xboxButtons: { // Xbox: Botões de Ação / RB/RT
            moveUp: { gamepadButton: 3, label: 'Y' }, // Y
            moveDown: { gamepadButton: 0, label: 'A' }, // A
            moveLeft: { gamepadButton: 2, label: 'X' }, // X
            moveRight: { gamepadButton: 1, label: 'B' }, // B
            attack: { gamepadButton: 7, label: 'RT' }, // RT
            sprint: { gamepadButton: 5, label: 'RB' }  // RB
        }
    }
};

// --- Configurações e Estado dos Gamepads ---
const GAMEPAD_BUTTON_ATTACK_COOLDOWN = 200;

let connectedGamepads = [null, null]; // [gamepad_para_p3, gamepad_para_p4]

// --- Sistema de Input Centralizado ---
const input = {
    keys: {},
    lastGamepadAttackTime: [0, 0],

    isKeyDown(key) {
        return this.keys[key.toLowerCase()] || false;
    },

    isGamepadButtonDown(gamepadObj, playerSlotIndex, action, gamepadButtonIndex) {
        if (!gamepadObj || gamepadButtonIndex === undefined || gamepadButtonIndex === -1 || !gamepadObj.buttons[gamepadButtonIndex]) {
            return false;
        }

        const button = gamepadObj.buttons[gamepadButtonIndex];

        if (button.value !== undefined && button.value > 0.5 && action !== 'attack') {
            return true;
        } else if (button.pressed) {
            if (action === 'attack') {
                const now = performance.now();
                if (now - this.lastGamepadAttackTime[playerSlotIndex] > GAMEPAD_BUTTON_ATTACK_COOLDOWN) {
                    this.lastGamepadAttackTime[playerSlotIndex] = now;
                    return true;
                }
                return false;
            }
            return true;
        }
        return false;
    }
};

// --- Funções Auxiliares para Gamepad Detection ---
function getGamepadType(gamepadId) {
    const idLower = gamepadId.toLowerCase();
    if (idLower.includes('xbox') || idLower.includes('xinput') || idLower.includes('microsoft')) {
        return 'xbox';
    }
    if (idLower.includes('playstation') || idLower.includes('dualshock') || idLower.includes('dualsense')) {
        return 'playstation';
    }
    return 'standard';
}

function getGamepadControls(playerControls, gamepadType) {
    if (gamepadType === 'playstation' && playerControls.psButtons) {
        return playerControls.psButtons;
    }
    if (gamepadType === 'xbox' && playerControls.xboxButtons) {
        return playerControls.xboxButtons;
    }
    return playerControls.psButtons || playerControls.xboxButtons;
}


// --- Event Listeners para Teclado ---
window.addEventListener('keydown', (e) => {
    input.keys[e.key.toLowerCase()] = true;
    if ([' ', 'w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'c', 'e', 'f', 'p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
    }
});
window.addEventListener('keyup', (e) => {
    input.keys[e.key.toLowerCase()] = false;
});

// --- Event Listeners para Gamepad ---
window.addEventListener("gamepadconnected", (e) => {
    console.log(`Gamepad conectado: ${e.gamepad.id} (index: ${e.gamepad.index})`);

    const gamepadType = getGamepadType(e.gamepad.id);
    let playerAssigned = false;

    if (connectedGamepads[0] === null) {
        connectedGamepads[0] = { gamepad: e.gamepad, type: gamepadType };
        if (!players.some(p => p.id === 3)) {
            // Ajusta a posição inicial para o mapa fixo
            players.push(new Player(3, CANVAS_WIDTH / 2 - PLAYER_SIZE / 2, CANVAS_HEIGHT / 4 - PLAYER_SIZE / 2, 'Player 3', '#2ecc71'));
            players.sort((a, b) => a.id - b.id);
        }
        const p3 = players.find(p => p.id === 3);
        if (p3) {
            p3.gamepadSlotIndex = 0;
            showMessage(`Player 3: Gamepad ${e.gamepad.index} (${e.gamepad.id.substring(0, 20)}...) conectado como ${gamepadType.toUpperCase()}!`);
            playerAssigned = true;
            updateControlsDisplay(p3.id, gamepadType);
        }
    }
    else if (connectedGamepads[1] === null && (!connectedGamepads[0] || e.gamepad.index !== connectedGamepads[0].gamepad.index)) {
        connectedGamepads[1] = { gamepad: e.gamepad, type: gamepadType };
        if (!players.some(p => p.id === 4)) {
            // Ajusta a posição inicial para o mapa fixo
            players.push(new Player(4, CANVAS_WIDTH / 2 - PLAYER_SIZE / 2, CANVAS_HEIGHT * 3 / 4 - PLAYER_SIZE / 2, 'Player 4', '#f1c40f'));
            players.sort((a, b) => a.id - b.id);
        }
        const p4 = players.find(p => p.id === 4);
        if (p4) {
             p4.gamepadSlotIndex = 1;
             showMessage(`Player 4: Gamepad ${e.gamepad.index} (${e.gamepad.id.substring(0, 20)}...) conectado como ${gamepadType.toUpperCase()}!`);
             playerAssigned = true;
             updateControlsDisplay(p4.id, gamepadType);
        }
    }

    if (!playerAssigned) {
        console.log("Todos os slots de gamepads para jogadores estão ocupados. Este gamepad extra não será usado para controle dedicado.");
        showMessage(`Gamepad ${e.gamepad.index} (${e.gamepad.id.substring(0, 20)}...) conectado, mas não atribuído a um jogador.`);
    }
    updateInputStatus();
});

window.addEventListener("gamepaddisconnected", (e) => {
    console.log(`Gamepad desconectado: ${e.gamepad.id} (index: ${e.gamepad.index})`);

    let removedPlayerId = null;
    let playerSlotIndex = -1;

    if (connectedGamepads[0] && connectedGamepads[0].gamepad.index === e.gamepad.index) {
        connectedGamepads[0] = null;
        removedPlayerId = 3;
        playerSlotIndex = 0;
    } else if (connectedGamepads[1] && connectedGamepads[1].gamepad.index === e.gamepad.index) {
        connectedGamepads[1] = null;
        removedPlayerId = 4;
        playerSlotIndex = 1;
    }

    if (removedPlayerId !== null) {
        const playerToRemove = players.find(p => p.id === removedPlayerId);
        if (playerToRemove) {
            playerToRemove.headGuiElement.remove();
            players = players.filter(p => p.id !== removedPlayerId);
            showMessage(`Player ${removedPlayerId}: Gamepad desconectado! Player ${removedPlayerId} removido.`);
            // Limpa e esconde o display de controle
            const displayElement = CONTROLS[`PLAYER${removedPlayerId}`].displayElement;
            displayElement.querySelector('.controls-grid').innerHTML = ''; // Limpa o conteúdo
            displayElement.style.display = 'none'; // Esconde
        }
    }
    updateInputStatus();
    endGame();
});


// --- Funções Utilitárias ---
function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getRandomPosition(width, height) {
    let x, y;
    let validPosition = false;
    const padding = 50; // Margem para evitar spawn muito próximo das bordas

    for(let i = 0; i < 100; i++) { // Tenta 100 vezes para encontrar uma posição válida
        x = Math.random() * (CANVAS_WIDTH - width - 2 * padding) + padding;
        y = Math.random() * (CANVAS_HEIGHT - height - 2 * padding) + padding;
        
        let overlap = false;
        // Verifica colisão com obstáculos existentes
        for (const obs of obstacles) {
            if (collides({ x, y, width, height }, obs)) {
                overlap = true;
                break;
            }
        }
        // Verifica colisão com jogadores (para evitar spawn de itens/obstáculos em cima de jogadores)
        if (!overlap) {
            for (const player of players) {
                // Checa distância ao centro do jogador para evitar proximidade excessiva
                if (calculateDistance(x + width/2, y + height/2, player.x + player.width/2, player.y + player.height/2) < PLAYER_SIZE * 3) {
                    overlap = true;
                    break;
                }
            }
        }
        if (!overlap) {
            validPosition = true;
            break;
        }
    }
    
    if (!validPosition) {
        console.warn("Não foi possível encontrar uma posição aleatória sem colisão após várias tentativas. Retornando posição padrão.");
        return { x: CANVAS_WIDTH / 2 - width / 2, y: CANVAS_HEIGHT / 2 - height / 2 };
    }

    return { x, y };
}


// --- Classes Base do Jogo ---

class GameObject {
    constructor(x, y, width, height, color = 'gray') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Obstacle extends GameObject {
    constructor(x, y, width, height, color = '#7f8c8d') {
        super(x, y, width, height, color);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = '#606a6b';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

class Item {
    constructor(name, iconClass, durability = -1, maxStack = 1) {
        this.name = name;
        this.iconClass = iconClass;
        this.durability = durability;
        this.maxDurability = durability;
        this.maxStack = maxStack;
        this.quantity = 1;
    }
}

class Weapon extends Item {
    constructor(name, iconClass, damage, attackSpeed, durability, projectileColor = '#8b4513') {
        super(name, iconClass, durability, 1);
        this.damage = damage;
        this.attackSpeed = attackSpeed;
        this.lastAttackTime = 0;
        this.projectileColor = projectileColor;
    }

    canAttack() {
        return (performance.now() - this.lastAttackTime) > this.attackSpeed;
    }

    use() {
        this.lastAttackTime = performance.now();
        if (this.durability > 0) {
            this.durability--;
        }
        return this.durability > 0 || this.durability === -1;
    }
}

// Definição dos tipos de arcos (BLUEPRINTS)
const BOW_BLUEPRINTS = {
    LONGBOW: { name: "Arco Longo", iconClass: "item-longbow", damage: 15, attackSpeed: 600, durability: 50, projectileColor: '#8b4513' },
    SHORTBOW: { name: "Arco Curto", iconClass: "item-shortbow", damage: 10, attackSpeed: 300, durability: 70, projectileColor: '#5cb85c' },
    CROSSBOW: { name: "Besta", iconClass: "item-crossbow", damage: 25, attackSpeed: 1200, durability: 30, projectileColor: '#5bc0de' },
    RECURVEBOW: { name: "Arco Recurvo", iconClass: "item-recurvebow", damage: 18, attackSpeed: 450, durability: 60, projectileColor: '#e67e22' }, // Laranja
    COMPOUND_BOW: { name: "Arco Composto", iconClass: "item-compoundbow", damage: 22, attackSpeed: 800, durability: 40, projectileColor: '#c0392b' }, // Vermelho escuro
    HUNTING_BOW: { name: "Arco de Caça", iconClass: "item-huntingbow", damage: 12, attackSpeed: 400, durability: 80, projectileColor: '#27ae60' } // Verde escuro
};

function createWeaponFromBlueprint(blueprint) {
    return new Weapon(
        blueprint.name,
        blueprint.iconClass,
        blueprint.damage,
        blueprint.attackSpeed,
        blueprint.durability,
        blueprint.projectileColor
    );
}

class Pickup extends GameObject {
    constructor(x, y, item) {
        super(x, y, 20, 20, 'transparent');
        this.item = item;
    }

    draw(ctx) {
        if (this.item instanceof Weapon) {
            ctx.fillStyle = this.item.projectileColor;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#eee';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.save();
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            const abbreviation = this.item.name.split(' ').map(word => word[0]).join('');
            ctx.fillText(abbreviation, this.x + this.width / 2, this.y + this.height / 2);
            ctx.restore();

        } else {
            super.draw(ctx);
        }
    }
}


class Projectile extends GameObject {
    constructor(x, y, width, height, dx, dy, damage, ownerPlayerId, color = '#8b4513') {
        super(x, y, width, height, color);
        this.dx = dx;
        this.dy = dy;
        this.damage = damage;
        this.ownerPlayerId = ownerPlayerId;
        this.color = color;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        const angle = Math.atan2(this.dy, this.dx) + Math.PI / 2;
        ctx.rotate(angle);

        ctx.fillStyle = this.color;
        ctx.fillRect(-2, -8, 4, 16);

        ctx.fillStyle = '#eee';
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(-4, -12);
        ctx.lineTo(4, -12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f00';
        ctx.fillRect(-3, 8, 6, 4);

        ctx.restore();
    }
}

class Player extends GameObject {
    constructor(id, x, y, name, color) {
        super(x, y, PLAYER_SIZE, PLAYER_SIZE, color);
        this.id = id;
        this.name = name;
        this.health = MAX_HEALTH;
        this.energy = MAX_ENERGY;
        this.speed = PLAYER_SPEED;
        this.isSprinting = false;
        this.directionX = 0;
        this.directionY = 0;

        this.equippedWeapon = createWeaponFromBlueprint(BOW_BLUEPRINTS.LONGBOW);
        this.arrows = STARTING_ARROWS;

        this.lastAttackTime = 0;
        this.gamepadSlotIndex = null; 

        this.headGuiElement = this.createHeadGuiElement();
    }

    createHeadGuiElement() {
        const headGui = document.createElement('div');
        headGui.className = `player-head-gui p${this.id}`;
        headGui.innerHTML = `
            <h3>${this.name}</h3>
            <div class="bar-container"><div class="health-bar"></div></div>
            <div class="bar-container"><div class="energy-bar"></div></div>
            <div class="ammo-display">🏹 <strong class="ammo-value">${this.arrows}</strong></div>
            <div class="weapon-display">🗡️ <span class="weapon-name">${this.equippedWeapon ? this.equippedWeapon.name : 'Nenhum'}</span></div>
        `;
        document.body.appendChild(headGui);
        return headGui;
    }

    updateHeadGui() {
        const healthBar = this.headGuiElement.querySelector('.health-bar');
        const energyBar = this.headGuiElement.querySelector('.energy-bar');
        const ammoValue = this.headGuiElement.querySelector('.ammo-value');
        const weaponName = this.headGuiElement.querySelector('.weapon-name');

        healthBar.style.width = `${(this.health / MAX_HEALTH) * 100}%`;
        healthBar.style.backgroundColor = `hsl(${(this.health / MAX_HEALTH) * 120}, 70%, 50%)`;

        if (this.health < MAX_HEALTH * 0.2) {
            healthBar.classList.add('critical');
        } else {
            healthBar.classList.remove('critical');
        }

        energyBar.style.width = `${(this.energy / MAX_ENERGY) * 100}%`;
        ammoValue.textContent = this.arrows;
        weaponName.textContent = this.equippedWeapon ? `${this.equippedWeapon.name} (${this.equippedWeapon.durability !== -1 ? this.equippedWeapon.durability : '∞'})` : 'Nenhum';
    }

    updateHeadGuiPosition() {
        const canvasRect = gameCanvas.getBoundingClientRect();
        
        // As coordenadas do jogador no canvas do navegador
        // Não é mais afetado pela câmera, pois a câmera é fixa
        const playerScreenX = this.x * (canvasRect.width / CANVAS_WIDTH);
        const playerScreenY = this.y * (canvasRect.height / CANVAS_HEIGHT);

        // Posição final da GUI na tela do navegador
        const guiOffset = this.headGuiElement.offsetHeight + 10; // Espaço acima do jogador
        const finalScreenX = canvasRect.left + playerScreenX + (this.width / 2 * (canvasRect.width / CANVAS_WIDTH));
        const finalScreenY = canvasRect.top + playerScreenY - guiOffset;

        this.headGuiElement.style.left = `${finalScreenX - this.headGuiElement.offsetWidth / 2}px`;
        this.headGuiElement.style.top = `${finalScreenY}px`;
    }

    handleInput() {
        let dx = 0;
        let dy = 0;

        const playerControlsDefinition = CONTROLS[`PLAYER${this.id}`];

        let activeGamepadData = null;
        let playerGamepadControls = null;

        if (playerControlsDefinition.type === 'keyboard') {
            if (input.isKeyDown(playerControlsDefinition.moveUp.keyboard)) dy = -1;
            if (input.isKeyDown(playerControlsDefinition.moveDown.keyboard)) dy = 1;
            if (input.isKeyDown(playerControlsDefinition.moveLeft.keyboard)) dx = -1;
            if (input.isKeyDown(playerControlsDefinition.moveRight.keyboard)) dx = 1;

            this.isSprinting = input.isKeyDown(playerControlsDefinition.sprint.keyboard);

            if (input.isKeyDown(playerControlsDefinition.attack.keyboard)) {
                this.attack();
            }

        } else if (playerControlsDefinition.type === 'gamepad' && this.gamepadSlotIndex !== null) {
            activeGamepadData = connectedGamepads[this.gamepadSlotIndex];

            if (!activeGamepadData || !activeGamepadData.gamepad || !activeGamepadData.gamepad.connected) {
                return;
            }

            const liveGamepad = navigator.getGamepads()[activeGamepadData.gamepad.index];
            if (!liveGamepad) return;

            playerGamepadControls = getGamepadControls(playerControlsDefinition, activeGamepadData.type);

            if (!playerGamepadControls) {
                return;
            }

            // PRIORIDADE: Botões de D-Pad/Ação mapeados
            if (input.isGamepadButtonDown(liveGamepad, this.gamepadSlotIndex, 'moveUp', playerGamepadControls.moveUp.gamepadButton)) dy = -1;
            if (input.isGamepadButtonDown(liveGamepad, this.gamepadSlotIndex, 'moveDown', playerGamepadControls.moveDown.gamepadButton)) dy = 1;
            if (input.isGamepadButtonDown(liveGamepad, this.gamepadSlotIndex, 'moveLeft', playerGamepadControls.moveLeft.gamepadButton)) dx = -1;
            if (input.isGamepadButtonDown(liveGamepad, this.gamepadSlotIndex, 'moveRight', playerGamepadControls.moveRight.gamepadButton)) dx = 1;
            
            // Movimento com Eixos Analógicos (Stick Esquerdo para P3, Stick Direito para P4)
            const stickThreshold = 0.5;
            let analogX = 0;
            let analogY = 0;

            if (this.id === 3 && liveGamepad.axes && liveGamepad.axes.length >= 2) {
                analogX = liveGamepad.axes[0];
                analogY = liveGamepad.axes[1];
            } else if (this.id === 4 && liveGamepad.axes && liveGamepad.axes.length >= 4) {
                analogX = liveGamepad.axes[2];
                analogY = liveGamepad.axes[3];
            }
            
            if (dx === 0 && dy === 0) {
                 if (Math.abs(analogX) > stickThreshold) dx = analogX;
                 if (Math.abs(analogY) > stickThreshold) dy = analogY;
            }


            this.isSprinting = input.isGamepadButtonDown(liveGamepad, this.gamepadSlotIndex, 'sprint', playerGamepadControls.sprint.gamepadButton);

            if (input.isGamepadButtonDown(liveGamepad, this.gamepadSlotIndex, 'attack', playerGamepadControls.attack.gamepadButton)) {
                this.attack();
            }
        }

        if (dx !== 0 && dy !== 0) {
            const magnitude = Math.sqrt(dx * dx + dy * dy);
            dx /= magnitude;
            dy /= magnitude;
        }

        let currentSpeed = this.speed;
        if (this.isSprinting && this.energy > 0) {
            currentSpeed *= PLAYER_SPRINT_SPEED_MULTIPLIER;
            this.energy = Math.max(0, this.energy - ENERGY_COST_SPRINT);
            if (this.energy === 0) {
                this.isSprinting = false;
            }
        } else {
            this.energy = Math.min(MAX_ENERGY, this.energy + ENERGY_REGEN_RATE);
        }

        let newX = this.x + dx * currentSpeed;
        let newY = this.y + dy * currentSpeed;

        let canMoveX = true;
        let canMoveY = true;

        const futureRectX = { x: newX, y: this.y, width: this.width, height: this.height };
        const futureRectY = { x: this.x, y: newY, width: this.width, height: this.height };

        for (const obs of obstacles) {
            if (collides(futureRectX, obs)) {
                canMoveX = false;
            }
            if (collides(futureRectY, obs)) {
                canMoveY = false;
            }
            if (!canMoveX && !canMoveY) break;
        }

        if (canMoveX) this.x = newX;
        if (canMoveY) this.y = newY;

        // Limita o jogador dentro dos limites do mapa (CANVAS_WIDTH e CANVAS_HEIGHT)
        this.x = Math.max(0, Math.min(this.x, CANVAS_WIDTH - this.width));
        this.y = Math.max(0, Math.min(this.y, CANVAS_HEIGHT - this.height));
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
        showMessage(`${this.name} levou ${Math.floor(amount)} de dano!`);
        startCameraShake(5, 100); // Inicia o tremor da câmera
    }

    die() {
        showMessage(`${this.name} foi derrotado!`);
        this.headGuiElement.remove();
        players = players.filter(p => p.id !== this.id);
        endGame();
    }

    attack() {
        if (!this.equippedWeapon || !(this.equippedWeapon instanceof Weapon) || !this.equippedWeapon.canAttack()) {
            return;
        }
        if (this.arrows <= 0) {
            showMessage(`${this.name}: Sem flechas!`);
            return;
        }

        let targetPlayer = null;
        let minDist = Infinity;

        const otherPlayers = players.filter(p => p.id !== this.id);
        if (otherPlayers.length === 0) {
            showMessage(`${this.name}: Nenhum alvo para atirar!`);
            return; 
        }

        otherPlayers.forEach(p => {
            const dist = calculateDistance(this.x, this.y, p.x, p.y);
            if (dist < minDist) {
                minDist = dist;
                targetPlayer = p;
            }
        });

        if (!targetPlayer) {
            showMessage(`${this.name}: Nenhum alvo válido encontrado!`);
            return;
        }

        const weaponDamage = this.equippedWeapon.damage;

        const dirX = targetPlayer.x + targetPlayer.width / 2 - (this.x + this.width / 2);
        const dirY = targetPlayer.y + targetPlayer.height / 2 - (this.y + this.height / 2);
        const distance = calculateDistance(0, 0, dirX, dirY);

        let normDx = 0;
        let normDy = 0;

        if (distance > 0) {
            normDx = dirX / distance;
            normDy = dirY / distance;
        } else {
            normDy = -1; 
        }

        const projVx = normDx * ARROW_SPEED;
        const projVy = normDy * ARROW_SPEED;

        const projectileX = this.x + this.width / 2 - ARROW_SIZE / 2;
        const projectileY = this.y + this.height / 2 - ARROW_SIZE / 2;

        projectiles.push(new Projectile(
            projectileX,
            projectileY,
            ARROW_SIZE,
            ARROW_SIZE,
            projVx,
            projVy,
            weaponDamage,
            this.id,
            this.equippedWeapon.projectileColor
        ));

        this.arrows--;
        this.equippedWeapon.use();

        if (this.equippedWeapon.durability === 0) {
            showMessage(`${this.name}'s ${this.equippedWeapon.name} quebrou!`);
            this.equippedWeapon = createWeaponFromBlueprint(BOW_BLUEPRINTS.LONGBOW);
        }

        showMessage(`${this.name} atirou uma flecha!`);
    }

    collectItem(pickup) {
        if (pickup.item instanceof Weapon) {
            this.equippedWeapon = createWeaponFromBlueprint(pickup.item);
            showMessage(`${this.name} pegou um ${pickup.item.name}!`);
        }
    }

    draw(ctx) {
        super.draw(ctx);

        if (this.equippedWeapon && this.equippedWeapon.iconClass) {
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

            let targetPlayer = null;
            let minDist = Infinity;
            players.forEach(p => {
                if (p.id !== this.id) {
                    const dist = calculateDistance(this.x, this.y, p.x, p.y);
                    if (dist < minDist) {
                        minDist = dist;
                        targetPlayer = p;
                    }
                }
            });

            if (targetPlayer) {
                const angleToTarget = Math.atan2(targetPlayer.y - this.y, targetPlayer.x - this.x);
                ctx.rotate(angleToTarget + Math.PI / 2);
            } else {
                ctx.rotate(-Math.PI / 2);
            }

            // Desenho do arco baseado no tipo de arma
            // Ajustar o tamanho do desenho da arma para se adequar ao PLAYER_SIZE
            const weaponScale = 0.8; // Fator de escala
            const weaponLength = PLAYER_SIZE * weaponScale;

            if (this.equippedWeapon.iconClass === "item-longbow") {
                ctx.strokeStyle = '#a0522d'; ctx.lineWidth = 2; ctx.beginPath();
                ctx.arc(0, 0, weaponLength / 2, Math.PI / 4, 3 * Math.PI / 2 + Math.PI / 4); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, weaponLength / 2); ctx.lineTo(0, -weaponLength / 2);
                ctx.strokeStyle = '#333'; ctx.stroke();
            } else if (this.equippedWeapon.iconClass === "item-shortbow") {
                ctx.strokeStyle = '#5cb85c'; ctx.lineWidth = 2; ctx.beginPath();
                ctx.arc(0, 0, weaponLength * 0.7 / 2, Math.PI / 4, 3 * Math.PI / 2 + Math.PI / 4); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, weaponLength * 0.7 / 2); ctx.lineTo(0, -weaponLength * 0.7 / 2);
                ctx.strokeStyle = '#333'; ctx.stroke();
            } else if (this.equippedWeapon.iconClass === "item-crossbow") {
                ctx.fillStyle = '#5bc0de'; ctx.fillRect(-7 * weaponScale, -5 * weaponScale, 14 * weaponScale, 10 * weaponScale);
                ctx.fillStyle = '#333'; ctx.fillRect(-1 * weaponScale, -10 * weaponScale, 2 * weaponScale, 20 * weaponScale);
                ctx.strokeStyle = '#5bc0de'; ctx.lineWidth = 2 * weaponScale;
                ctx.beginPath(); ctx.moveTo(-7 * weaponScale, -5 * weaponScale); ctx.lineTo(-12 * weaponScale, -10 * weaponScale); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(7 * weaponScale, -5 * weaponScale); ctx.lineTo(12 * weaponScale, -10 * weaponScale); ctx.stroke();
            } else if (this.equippedWeapon.iconClass === "item-recurvebow") {
                ctx.strokeStyle = '#e67e22'; ctx.lineWidth = 2.5; ctx.beginPath();
                ctx.arc(0, 0, weaponLength * 0.8 / 2, Math.PI / 4, Math.PI / 2); ctx.stroke();
                ctx.arc(0, 0, weaponLength * 0.8 / 2, Math.PI + Math.PI / 4, Math.PI + Math.PI / 2, true); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, weaponLength * 0.8 / 2); ctx.lineTo(0, -weaponLength * 0.8 / 2);
                ctx.strokeStyle = '#333'; ctx.stroke();
            } else if (this.equippedWeapon.iconClass === "item-compoundbow") {
                ctx.fillStyle = '#c0392b'; ctx.fillRect(-8 * weaponScale, -5 * weaponScale, 16 * weaponScale, 10 * weaponScale); // Corpo central
                ctx.fillStyle = '#333'; ctx.fillRect(-2 * weaponScale, -12 * weaponScale, 4 * weaponScale, 24 * weaponScale); // Eixo
                ctx.beginPath(); // Rodas (cams)
                ctx.arc(-8 * weaponScale, -10 * weaponScale, 3 * weaponScale, 0, Math.PI * 2); ctx.fill();
                ctx.arc(8 * weaponScale, -10 * weaponScale, 3 * weaponScale, 0, Math.PI * 2); ctx.fill();
                ctx.arc(-8 * weaponScale, 10 * weaponScale, 3 * weaponScale, 0, Math.PI * 2); ctx.fill();
                ctx.arc(8 * weaponScale, 10 * weaponScale, 3 * weaponScale, 0, Math.PI * 2); ctx.fill();
            } else if (this.equippedWeapon.iconClass === "item-huntingbow") {
                ctx.strokeStyle = '#27ae60'; ctx.lineWidth = 3; ctx.beginPath();
                ctx.arc(0, 0, weaponLength * 0.9 / 2, Math.PI / 4, 3 * Math.PI / 2 + Math.PI / 4); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, weaponLength * 0.9 / 2); ctx.lineTo(0, -weaponLength * 0.9 / 2);
                ctx.strokeStyle = '#333'; ctx.stroke();
            }

            ctx.restore();
        }
    }
}


// --- Funções de Inicialização e Loop do Jogo ---

function showMessage(msg) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = msg;
    messagesContainer.appendChild(messageDiv);

    // Remove mensagens antigas se houver muitas
    while (messagesContainer.children.length > 5) {
        messagesContainer.firstChild.remove();
    }

    setTimeout(() => {
        messageDiv.remove();
    }, 2500);
}

function updateInputStatus() {
    gamepad1Info.innerHTML = `<span class="status-icon"></span>Slot Gamepad 1 (P3): ${connectedGamepads[0] ? `Conectado (${connectedGamepads[0].gamepad.id.substring(0, Math.min(20, connectedGamepads[0].gamepad.id.length))}...)` : 'Desconectado'}`;
    gamepad1Info.className = connectedGamepads[0] ? 'connected' : 'disconnected';

    gamepad2Info.innerHTML = `<span class="status-icon"></span>Slot Gamepad 2 (P4): ${connectedGamepads[1] ? `Conectado (${connectedGamepads[1].gamepad.id.substring(0, Math.min(20, connectedGamepads[1].gamepad.id.length))}...)` : 'Desconectado'}`;
    gamepad2Info.className = connectedGamepads[1] ? 'connected' : 'disconnected';
}

/**
 * Atualiza o display de controle para gamepads (P3/P4) com os botões corretos.
 * @param {number} playerId O ID do jogador (3 ou 4).
 * @param {string} gamepadType O tipo de gamepad ('xbox' ou 'playstation').
 */
function updateControlsDisplay(playerId, gamepadType) {
    const playerControls = CONTROLS[`PLAYER${playerId}`];
    const displayElement = playerControls.displayElement;
    
    // Assegura que o elemento está visível
    displayElement.style.display = 'block'; // Pode ser 'flex' ou 'block' dependendo do CSS externo

    const controlsGrid = displayElement.querySelector('.controls-grid');
    if (!controlsGrid) {
        console.error('Controls grid element not found for player', playerId);
        return;
    }
    controlsGrid.innerHTML = ''; // Limpa o conteúdo existente

    const controlsMap = getGamepadControls(playerControls, gamepadType);

    if (controlsMap) {
        // Movimento (Stick e D-Pad agrupados)
        let moveKeysHtml = '';
        const stickLabel = (playerId === 3) ? 'Left Stick' : 'Right Stick';
        moveKeysHtml += `<kbd class="stick">${stickLabel}</kbd>`;
        moveKeysHtml += `<kbd>D-Pad</kbd>`; // Um único botão para representar o D-Pad

        controlsGrid.innerHTML += `
            <div class="control-item">
                <span class="label">Mover</span>
                <div class="keys compact-movement">${moveKeysHtml}</div>
            </div>
        `;

        // Atacar
        controlsGrid.innerHTML += `
            <div class="control-item">
                <span class="label">Atacar</span>
                <div class="keys"><kbd>${controlsMap.attack.label}</kbd></div>
            </div>
        `;

        // Correr
        controlsGrid.innerHTML += `
            <div class="control-item">
                <span class="label">Correr</span>
                <div class="keys"><kbd>${controlsMap.sprint.label}</kbd></div>
            </div>
        `;
    }
}

/**
 * **MODIFICAÇÃO AQUI: CÂMERA FIXA**
 * A função updateCamera agora é removida ou simplificada drasticamente.
 * Não precisamos mais de cameraX, cameraY, ou CAMERA_ZOOM_FACTOR.
 * O canvas agora representará o mundo do jogo diretamente.
 */
function updateCamera() {
    // Não faz nada, a câmera está fixa e mostra o mapa inteiro
    // cameraX = 0;
    // cameraY = 0;
}

/**
 * Inicia um efeito de tremor na câmera.
 * @param {number} intensity A intensidade do tremor.
 * @param {number} duration A duração do tremor em milissegundos.
 */
function startCameraShake(intensity, duration) {
    cameraShakeIntensity = intensity;
    cameraShakeTimer = duration;
}

/**
 * Gera obstáculos aleatórios para o mapa.
 * @param {number} numObstacles O número de obstáculos a serem gerados.
 */
function generateRandomObstacles(numObstacles) {
    obstacles = []; // Limpa quaisquer obstáculos existentes
    const minSize = 40; // Tamanho mínimo de um obstáculo
    const maxSize = 120; // Tamanho máximo de um obstáculo
    const attemptsPerObstacle = 100; // Quantas vezes tentar encontrar uma posição para um obstáculo

    for (let i = 0; i < numObstacles; i++) {
        let obsWidth = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
        let obsHeight = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
        
        let positionFound = false;
        for (let j = 0; j < attemptsPerObstacle; j++) {
            const potentialPos = getRandomPosition(obsWidth, obsHeight);
            
            // Verifica se a nova posição do obstáculo colide com os jogadores iniciais
            let collidesWithPlayers = false;
            for (const player of players) {
                if (collides(potentialPos, player)) { // Reuso da função collides
                    collidesWithPlayers = true;
                    break;
                }
            }

            // Verifica se a nova posição do obstáculo colide com obstáculos já gerados
            let collidesWithOtherObstacles = false;
            for (const existingObs of obstacles) {
                if (collides(potentialPos, existingObs)) {
                    collidesWithOtherObstacles = true;
                    break;
                }
            }

            if (!collidesWithPlayers && !collidesWithOtherObstacles) {
                obstacles.push(new Obstacle(potentialPos.x, potentialPos.y, obsWidth, obsHeight));
                positionFound = true;
                break;
            }
        }

        if (!positionFound) {
            console.warn(`Não foi possível gerar o obstáculo ${i + 1} sem colisão.`);
        }
    }
}


/**
 * Função principal de desenho do jogo. Limpa o canvas e redesenha todos os objetos.
 */
function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Salva o estado do contexto antes de aplicar a transformação da câmera
    ctx.save();

    // Aplica a transformação de tremor da câmera
    // Como a câmera não segue, apenas aplicamos o tremor se houver
    ctx.translate(
        (cameraShakeTimer > 0 ? (Math.random() - 0.5) * cameraShakeIntensity : 0),
        (cameraShakeTimer > 0 ? (Math.random() - 0.5) * cameraShakeIntensity : 0)
    );

    // Agora, todos os elementos são desenhados diretamente em suas coordenadas do mundo.
    // Não há necessidade de subtrair cameraX ou cameraY, pois a câmera está fixa no (0,0) do mundo.

    obstacles.forEach(obstacle => obstacle.draw(ctx));
    pickups.forEach(pickup => pickup.draw(ctx));
    players.forEach(player => player.draw(ctx));
    projectiles.forEach(projectile => projectile.draw(ctx));

    // Restaura o estado do contexto para remover a transformação (do tremor)
    ctx.restore();
}

/**
 * Adiciona um novo pickup (arco) em uma posição aleatória.
 */
function spawnPickup() {
    if (pickups.length >= MAX_PICKUPS) return;

    const bowBlueprintsArray = Object.values(BOW_BLUEPRINTS);
    const randomBowBlueprint = bowBlueprintsArray[Math.floor(Math.random() * bowBlueprintsArray.length)];
    
    let pos = getRandomPosition(20, 20);

    const newWeaponInstance = createWeaponFromBlueprint(randomBowBlueprint);
    pickups.push(new Pickup(pos.x, pos.y, newWeaponInstance));
    showMessage(`Um novo ${randomBowBlueprint.name} apareceu!`);
}

// O loop principal do jogo
function gameLoop(currentTime = 0) {
    if (!gameRunning) return;

    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    // Atualiza o timer do tremor da câmera
    if (cameraShakeTimer > 0) {
        cameraShakeTimer = Math.max(0, cameraShakeTimer - deltaTime);
        if (cameraShakeTimer === 0) {
            cameraShakeIntensity = 0; // Reseta a intensidade quando o timer zera
        }
    }

    if (currentTime - lastPickupSpawnTime > PICKUP_SPAWN_INTERVAL) {
        spawnPickup();
        lastPickupSpawnTime = currentTime;
    }

    const browserGamepads = navigator.getGamepads();
    
    for(let i = 0; i < connectedGamepads.length; i++) {
        if (connectedGamepads[i]) {
            const liveGamepad = browserGamepads[connectedGamepads[i].gamepad.index];
            if (!liveGamepad || !liveGamepad.connected) {
                console.log(`Gamepad ${connectedGamepads[i].gamepad.id} (index: ${connectedGamepads[i].gamepad.index}) desconectado durante o update.`);
                const removedPlayerId = (i === 0) ? 3 : 4;
                const playerToRemove = players.find(p => p.id === removedPlayerId);
                if (playerToRemove) {
                    playerToRemove.headGuiElement.remove();
                    players = players.filter(p => p.id !== removedPlayerId);
                    showMessage(`Player ${removedPlayerId}: Gamepad desconectado! Player ${removedPlayerId} removido.`);
                    const displayElement = CONTROLS[`PLAYER${removedPlayerId}`].displayElement;
                    displayElement.querySelector('.controls-grid').innerHTML = '';
                    displayElement.style.display = 'none';
                }
                connectedGamepads[i] = null;
            } else {
                connectedGamepads[i].gamepad = liveGamepad;
            }
        }
    }

    updateInputStatus();

    players.forEach(player => {
        player.handleInput();
        player.updateHeadGui();
    });
    
    // Chama updateCamera, mas agora ela é uma função vazia
    updateCamera();

    players.forEach(player => {
        player.updateHeadGuiPosition(); // A posição da GUI ainda precisa ser atualizada
    });


    pickups = pickups.filter(pickup => {
        for (const player of players) {
            if (collides(player, pickup)) {
                player.collectItem(pickup);
                return false;
            }
        }
        return true;
    });

    const activeProjectiles = [];
    projectiles.forEach(p => {
        p.update();
        let hitSomething = false;

        // Checa colisão com obstáculos
        for (const obs of obstacles) {
            if (collides(p, obs)) {
                hitSomething = true;
                break;
            }
        }

        if (!hitSomething) {
            // Checa colisão com jogadores (exceto o próprio atirador)
            for (const player of players) {
                if (player.id !== p.ownerPlayerId && collides(p, player)) {
                    player.takeDamage(p.damage);
                    hitSomething = true;
                    break;
                }
            }
        }
        
        // Mantém o projétil se não colidiu com nada e ainda está dentro dos limites do mapa
        // A visibilidade é o limite do próprio CANVAS_WIDTH/HEIGHT
        if (!hitSomething && 
            p.x + p.width > 0 && 
            p.x < CANVAS_WIDTH &&
            p.y + p.height > 0 && 
            p.y < CANVAS_HEIGHT) {
            activeProjectiles.push(p);
        }
    });
    projectiles = activeProjectiles;
    
    draw();
    requestAnimationFrame(gameLoop);

    endGame(); 
}

// --- Funções de Redimensionamento do Canvas ---
function resizeCanvas() {
    const gameContainer = document.querySelector('.game-container');
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = gameContainer.offsetHeight;

    // Define a resolução interna do canvas para o tamanho do mundo do jogo
    gameCanvas.width = CANVAS_WIDTH; 
    gameCanvas.height = CANVAS_HEIGHT;

    // Ajusta o estilo do elemento canvas no DOM para preencher o container,
    // mantendo a proporção. Isso é feito pelo CSS com `width: 100%; height: 100%;`
    // no #gameCanvas e as dimensões fixas no .game-container.
    // Não precisamos de gameCanvas.style.width/height aqui.

    // As GUIs dos jogadores precisam ser atualizadas quando o canvas muda de tamanho
    // porque suas posições são relativas à tela, não ao mundo do jogo.
    players.forEach(player => player.updateHeadGuiPosition());

    // A câmera não precisa ser recalculada, pois está fixa.
    // updateCamera(); // Esta linha pode ser removida ou a função ser vazia.
}

// Adiciona listener para redimensionar o canvas quando a janela mudar
window.addEventListener('resize', resizeCanvas);


/**
 * Inicializa o estado do jogo para uma nova partida.
 */
function initGame() {
    gameRunning = true;
    players = [];
    projectiles = [];
    pickups = [];
    obstacles = [];
    connectedGamepads = [null, null];
    lastPickupSpawnTime = performance.now();

    // Reseta a câmera (variáveis de tremor)
    // cameraX = 0; // Removido
    // cameraY = 0; // Removido
    cameraShakeIntensity = 0;
    cameraShakeTimer = 0;


    document.querySelectorAll('.player-head-gui').forEach(el => el.remove());
    messagesContainer.innerHTML = '';

    // Limpa e esconde os displays de controle de gamepad
    player3ControlsDisplay.querySelector('.controls-grid').innerHTML = '';
    player3ControlsDisplay.style.display = 'none';
    player4ControlsDisplay.querySelector('.controls-grid').innerHTML = '';
    player4ControlsDisplay.style.display = 'none';

    // Posições iniciais dos jogadores
    players.push(new Player(1, 100, CANVAS_HEIGHT / 2 - PLAYER_SIZE / 2, 'Player 1', '#e74c3c'));
    players.push(new Player(2, CANVAS_WIDTH - 100 - PLAYER_SIZE, CANVAS_HEIGHT / 2 - PLAYER_SIZE / 2, 'Player 2', '#3498db'));

    // Geração de obstáculos aleatórios
    generateRandomObstacles(5); // Gera 5 obstáculos aleatórios (ajuste este número)

    const browserGamepads = navigator.getGamepads();
    
    for (let i = 0; i < browserGamepads.length; i++) {
        const gp = browserGamepads[i];
        if (gp && gp.connected && connectedGamepads[0] === null) {
            const gamepadType = getGamepadType(gp.id);
            connectedGamepads[0] = { gamepad: gp, type: gamepadType };
            // Posição inicial para P3 (gamepad 1)
            players.push(new Player(3, CANVAS_WIDTH / 2 - PLAYER_SIZE / 2 - 100, CANVAS_HEIGHT / 2 - PLAYER_SIZE / 2 - 100, 'Player 3', '#2ecc71'));
            const p3 = players.find(p => p.id === 3);
            if(p3) {
                p3.gamepadSlotIndex = 0;
                updateControlsDisplay(p3.id, gamepadType);
            }
            showMessage(`Player 3: Gamepad ${gp.index} (${gp.id.substring(0, Math.min(20, gp.id.length))}...) reconectado!`);
            break;
        }
    }

    for (let i = 0; i < browserGamepads.length; i++) {
        const gp = browserGamepads[i];
        if (gp && gp.connected && connectedGamepads[1] === null && (!connectedGamepads[0] || gp.index !== connectedGamepads[0].gamepad.index)) {
            const gamepadType = getGamepadType(gp.id);
            connectedGamepads[1] = { gamepad: gp, type: gamepadType };
            // Posição inicial para P4 (gamepad 2)
            players.push(new Player(4, CANVAS_WIDTH / 2 - PLAYER_SIZE / 2 + 100, CANVAS_HEIGHT / 2 - PLAYER_SIZE / 2 + 100, 'Player 4', '#f1c40f'));
            const p4 = players.find(p => p.id === 4);
            if(p4) {
                p4.gamepadSlotIndex = 1;
                updateControlsDisplay(p4.id, gamepadType);
            }
            showMessage(`Player 4: Gamepad ${gp.index} (${gp.id.substring(0, Math.min(20, gp.id.length))}...) reconectado!`);
            break;
        }
    }
    
    players.sort((a, b) => a.id - b.id);

    resizeCanvas(); // Chama o redimensionamento na inicialização
    updateInputStatus();
    gameLoop();
}

/**
 * Encerra o jogo, exibe o vencedor e um botão de reiniciar.
 */
function endGame() {
    if (gameRunning && players.length <= 1) {
        gameRunning = false;
        let winnerName = "Ninguém";
        if (players.length === 1) {
            winnerName = players[0].name;
        } else if (players.length === 0) {
            winnerName = "Todos foram derrotados!";
        }
        showMessage(`FIM DE JOGO! Vencedor: ${winnerName}`);

        setTimeout(() => {
            const restartButton = document.createElement('button');
            restartButton.textContent = 'Reiniciar Jogo';
            restartButton.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 15px 30px;
                font-size: 1.5em;
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                font-family: 'Press Start 2P', cursive;
                z-index: 200;
            `;
            document.body.appendChild(restartButton);
            restartButton.addEventListener('click', () => {
                restartButton.remove();
                initGame();
            });
        }, 3000);
    }
}

// Inicia o jogo automaticamente
initGame();