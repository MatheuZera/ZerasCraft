// ===============================================
// UTILITIES GERAIS E FUNÇÕES AUXILIARES
// ===============================================

// Classe para gerenciar efeitos sonoros
class SoundManager {
    constructor() {
        this.sounds = {};
        this.loadSounds();
    }

    loadSounds() {
        const soundList = {
            buttonClick: 'button.wav',
            playerHurt: 'player_hurt.wav',
            enemyDeath: 'enemy_death.wav',
            shootPistol: 'shoot_pistol.mp3', // Ajuste para o nome do seu arquivo
            shootMachinegun: 'shoot_machinegun.mp3',
            shootRifle: 'shoot_rifle.mp3',
            shootShotgun: 'shoot_shotgun.mp3',
            shootSmg: 'shoot_smg.mp3',
            shootSniper: 'shoot_sniper.mp3',
            hit: 'hit.mp3',
            reload: 'reload.mp3',
            noAmmo: 'no_ammo.wav', // Mantenha se tiver
            dash: 'dash.wav', // Mantenha se tiver
            itemPickup: 'pickup.mp3',
            explosion: 'explosion.mp3',
            levelUp: 'level_up.wav', // Mantenha se tiver
            powerUp: 'power_up.wav', // Mantenha se tiver
            auraHeal: 'aura_heal.wav', // Mantenha se tiver
            death: 'death.mp3'
        };

        for (const key in soundList) {
            this.sounds[key] = new Audio(`sfx/${soundList[key]}`);
            this.sounds[key].volume = 0.5; // Volume padrão
            this.sounds[key].load(); // Pré-carrega o áudio
        }
    }

    play(key, volume = null) {
        if (this.sounds[key]) {
            // Clonar o nó de áudio para permitir múltiplas reproduções rápidas
            const soundInstance = this.sounds[key].cloneNode();
            soundInstance.volume = volume !== null ? volume : this.sounds[key].volume;
            soundInstance.play().catch(e => console.warn(`Falha ao reproduzir som ${key}:`, e));
        } else {
            console.warn(`Som '${key}' não encontrado.`);
        }
    }
}

// Instância global do SoundManager
const sfx = new SoundManager();

// Funções de detecção e resolução de colisão
function distance(obj1, obj2) {
    const dx = (obj1.x + obj1.width / 2) - (obj2.x + obj2.width / 2);
    const dy = (obj1.y + obj1.height / 2) - (obj2.y + obj2.height / 2);
    return Math.sqrt(dx * dx + dy * dy);
}

function checkCollision(obj1, obj2) {
    // Verificar se obj1 ou obj2 estão mortos/inativos
    if (obj1.isDead || obj2.isDead) return false;

    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function resolveCollision(obj1, obj2) {
    // Isso é para colisões de "empurrar", como jogador contra obstáculo.
    // É mais complexo do que parece para ser perfeito, mas uma versão simplificada:
    const overlapX = Math.min(obj1.x + obj1.width, obj2.x + obj2.width) - Math.max(obj1.x, obj2.x);
    const overlapY = Math.min(obj1.y + obj1.height, obj2.y + obj2.height) - Math.max(obj1.y, obj2.y);

    if (overlapX > 0 && overlapY > 0) {
        if (overlapX < overlapY) {
            // Colisão horizontal
            if (obj1.x < obj2.x) { // obj1 está à esquerda de obj2
                obj1.x -= overlapX;
            } else { // obj1 está à direita de obj2
                obj1.x += overlapX;
            }
        } else {
            // Colisão vertical
            if (obj1.y < obj2.y) { // obj1 está acima de obj2
                obj1.y -= overlapY;
            } else { // obj1 está abaixo de obj2
                obj1.y += overlapY;
            }
        }
    }
}

function showMessage(text, duration = 1500) {
    const messageOverlay = document.getElementById('message-overlay');
    if (!messageOverlay) {
        console.warn('Elemento #message-overlay não encontrado.');
        return;
    }

    messageOverlay.textContent = text;
    messageOverlay.classList.remove('hidden');
    messageOverlay.style.opacity = '1';

    setTimeout(() => {
        messageOverlay.style.opacity = '0';
        setTimeout(() => messageOverlay.classList.add('hidden'), 500); // Esconde após a transição
    }, duration);
}

function rollChance(percentage) {
    return Math.random() * 100 < percentage;
}

/**
 * Cria partículas de impacto.
 * @param {number} x - Posição X da origem das partículas.
 * @param {number} y - Posição Y da origem das partículas.
 * @param {number} count - Número de partículas a criar.
 * @param {number} size - Tamanho das partículas.
 * @param {string} color - Cor das partículas.
 * @param {number} speedMultiplier - Multiplicador da velocidade das partículas.
 * @param {number} lifetime - Tempo de vida das partículas em ms.
 * @param {Array<Particle>} particlesArray - O array global de partículas para adicionar.
 * @param {number} spread - Fator de dispersão para a direção inicial das partículas (0 para sem dispersão, 1 para total).
 */
function createImpactParticles(x, y, count, size, color, speedMultiplier, lifetime, particlesArray, spread = 1) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velX = Math.cos(angle) * (Math.random() * speedMultiplier * spread);
        const velY = Math.sin(angle) * (Math.random() * speedMultiplier * spread);
        particlesArray.push(new Particle(x, y, size, color, velX, velY, lifetime));
    }
}