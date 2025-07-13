// ===============================================
// CONSTANTES DE JOGO
// ===============================================
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 960;
const PLAYER_SIZE = 40; // Um pouco maior
const ENEMY_SIZE = 30;
const PROJECTILE_SIZE = 10;
const ITEM_SIZE = 25;
const OBSTACLE_SIZE = 80;
const DESTRUCTIBLE_SIZE = 50;
const TRAP_SIZE = 60;

// ===============================================
// CLASSE BASE PARA ENTIDADES (Player, Enemy, Destructible)
// ===============================================
class Entity {
    constructor(x, y, width, height, color, speed, maxHealth = 100) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.angle = 0; // Direção para onde a entidade está "olhando"
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.isDead = false;
        this.lastDamageTime = 0;
        this.invincibilityDuration = 200; // Pequeno tempo de invencibilidade após levar dano
        this.blinkTimer = 0; // Para efeito visual de dano
        this.flashDuration = 100;
    }

    takeDamage(amount) {
        if (Date.now() - this.lastDamageTime < this.invincibilityDuration) {
            return; // Ainda invencível
        }
        this.health -= amount;
        this.lastDamageTime = Date.now();
        this.blinkTimer = this.flashDuration; // Ativa o flash
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
            sfx.play('death'); // Som de morte
        } else {
            sfx.play('playerHurt'); // Som de dano
        }
    }

    update(deltaTime) {
        if (this.blinkTimer > 0) {
            this.blinkTimer -= deltaTime;
        }
    }

    draw(ctx) {
        if (this.isDead) return;

        let currentColor = this.color;
        // Efeito de piscar ao levar dano
        if (this.blinkTimer > 0 && Math.floor(Date.now() / 50) % 2 === 0) {
            currentColor = 'white';
        }

        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);

        ctx.fillStyle = currentColor;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Desenha um pequeno cano de arma para indicar a direção
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(this.width / 2 - 5, -3, 10, 6);

        ctx.restore();

        // Barra de vida
        const barWidth = this.width + 10;
        const barHeight = 6;
        const barX = this.x - 5;
        const barY = this.y - 15;

        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = 'lime';
        ctx.fillRect(barX, barY, barWidth * (this.health / this.maxHealth), barHeight);
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
}

// ===============================================
// CLASSE DE ARMA
// ===============================================
class Weapon {
    constructor(name, damage, fireRate, projectileSpeed, magazineSize, reloadTime, projColor, projType, projectilesPerShot = 1, spreadAngle = 0, shootSound = 'shootPistol', iconPath = 'images/icon_pistol.png') {
        this.name = name;
        this.damage = damage;
        this.fireRate = fireRate; // Tempo entre tiros em ms
        this.projectileSpeed = projectileSpeed;
        this.magazineSize = magazineSize;
        this.currentAmmo = magazineSize;
        this.reloadTime = reloadTime; // Tempo de recarga em ms
        this.projColor = projColor;
        this.projType = projType; // 'bullet', 'laser', 'explosive'
        this.isReloading = false;
        this.reloadTimer = 0;
        this.lastShotTime = 0; // Para controlar o fireRate
        this.projectilesPerShot = projectilesPerShot;
        this.spreadAngle = spreadAngle;
        this.shootSound = shootSound;
        this.icon = new Image();
        this.icon.src = iconPath;
        this.iconLoaded = false;
        this.icon.onload = () => { this.iconLoaded = true; };
        this.icon.onerror = () => { console.error(`Erro ao carregar ícone da arma: ${iconPath}`); };
    }

    startReload() {
        if (!this.isReloading && this.currentAmmo < this.magazineSize) {
            this.isReloading = true;
            this.reloadTimer = this.reloadTime;
            sfx.play('reload');
        }
    }

    update(deltaTime) {
        if (this.isReloading) {
            this.reloadTimer -= deltaTime;
            if (this.reloadTimer <= 0) {
                this.currentAmmo = this.magazineSize;
                this.isReloading = false;
            }
        }
    }

    canShoot() {
        // Verifica se não está recarregando E se tem munição E se o cooldown do tiro já passou
        return !this.isReloading && this.currentAmmo > 0 && (Date.now() - this.lastShotTime >= this.fireRate);
    }

    shoot() {
        this.currentAmmo--;
        this.lastShotTime = Date.now();
        sfx.play(this.shootSound); // Toca o som específico da arma
    }
}

// ===============================================
// CLASSE JOGADOR
// ===============================================
class Player extends Entity {
    constructor(x, y, playerNumber, color, controls) {
        super(x, y, PLAYER_SIZE, PLAYER_SIZE, color, 4, 100); // maxHealth 100
        this.playerNumber = playerNumber;
        this.controls = controls;
        this.coins = 0;
        this.xp = 0;
        this.level = 1;
        this.xpToNextLevel = 100;
        this.maxEnergy = 100;
        this.energy = this.maxEnergy;

        this.weapons = {
            'pistol': new Weapon('Pistola', 10, 200, 8, 10, 1500, 'yellow', 'bullet', 1, 0, 'shootPistol', 'images/icon_pistol.png'),
            'shotgun': new Weapon('Escopeta', 8, 500, 6, 5, 2000, 'orange', 'bullet', 5, Math.PI / 10, 'shootShotgun', 'images/icon_shotgun.png'),
            'machinegun': new Weapon('Metralhadora', 7, 80, 9, 30, 2500, 'lime', 'bullet', 1, 0.05, 'shootMachinegun', 'images/icon_machinegun.png'),
            'rifle': new Weapon('Rifle', 20, 400, 10, 8, 2200, 'cyan', 'bullet', 1, 0, 'shootRifle', 'images/icon_rifle.png'),
            'sniper': new Weapon('Sniper', 50, 1500, 15, 3, 3500, 'blue', 'bullet', 1, 0, 'shootSniper', 'images/icon_sniper.png'),
            'bazooka': new Weapon('Bazooka', 0, 1000, 7, 1, 4000, 'red', 'explosive_bullet', 1, 0, 'shoot', 'images/icon_bazooka.png'), // Explosive bullet, damage set on projectile
            'smg': new Weapon('SMG', 5, 60, 10, 40, 2000, 'purple', 'bullet', 1, 0.08, 'shootSmg', 'images/icon_smg.png')
        };
        this.currentWeapon = this.weapons['pistol']; // Começa com a pistola
        this.weaponSwitchCooldown = 0;
        this.WEAPON_SWITCH_COOLDOWN = 200;

        this.dashCooldown = 0;
        this.dashDuration = 150; // Tempo que o dash dura em ms
        this.currentDashDuration = 0;
        this.dashSpeedMultiplier = 3;
        this.isDashing = false;

        // Habilidades Especiais (Definidas no construtor)
        this.abilities = {};
        if (playerNumber === 1) {
            this.abilities.special = {
                name: 'Tiro Explosivo',
                key: 'x',
                cooldown: 5000,
                currentCooldown: 0,
                energyCost: 30
            };
        } else if (playerNumber === 2) {
            this.abilities.special = {
                name: 'Aura de Cura',
                key: 'm',
                cooldown: 7000,
                currentCooldown: 0,
                energyCost: 40
            };
        }

        // Buffs Ativos
        this.activeBuffs = {
            speed: { isActive: false, timer: 0, duration: 0, multiplier: 1 },
            invincibility: { isActive: false, timer: 0, duration: 0 },
            damage: { isActive: false, timer: 0, duration: 0, multiplier: 1 }
        };
        this.baseSpeed = this.speed;
        this.baseDamageMultiplier = 1;

        this.hudId = `p${playerNumber}`;
    }

    addXP(amount) {
        this.xp += amount;
        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.xp -= this.xpToNextLevel;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
        this.maxHealth += 10;
        this.health = this.maxHealth;
        this.maxEnergy += 10;
        this.energy = this.maxEnergy;

        for (const weaponName in this.weapons) {
            this.weapons[weaponName].damage += 1; // Aumenta o dano de todas as armas
        }
        sfx.play('levelUp');
        showMessage(`P${this.playerNumber} SUBIU DE NÍVEL para ${this.level}!`, 2000);
    }

    applyBuff(type, duration, value = 0) {
        this.activeBuffs[type].isActive = true;
        this.activeBuffs[type].timer = duration;
        this.activeBuffs[type].duration = duration;
        sfx.play('powerUp');
        showMessage(`P${this.playerNumber}: ${type.toUpperCase()} Ativo!`, 1500);

        if (type === 'speed') {
            this.activeBuffs.speed.multiplier = value;
            this.speed = this.baseSpeed * this.activeBuffs.speed.multiplier;
        } else if (type === 'damage') {
            this.activeBuffs.damage.multiplier = value;
            this.baseDamageMultiplier = this.activeBuffs.damage.multiplier;
        } else if (type === 'invincibility') {
            this.invincibilityDuration = duration + 500;
        }
    }

    update(deltaTime, otherPlayer = null) {
        super.update(deltaTime); // Atualiza o timer de piscar de dano

        if (this.isDead) return;

        this.currentWeapon.update(deltaTime); // Atualiza o timer de recarga da arma

        // Atualiza cooldowns
        this.dashCooldown = Math.max(0, this.dashCooldown - deltaTime);
        this.weaponSwitchCooldown = Math.max(0, this.weaponSwitchCooldown - deltaTime);
        if (this.abilities.special) {
            this.abilities.special.currentCooldown = Math.max(0, this.abilities.special.currentCooldown - deltaTime);
        }

        // Atualiza Buffs
        for (const buffType in this.activeBuffs) {
            const buff = this.activeBuffs[buffType];
            if (buff.isActive) {
                buff.timer -= deltaTime;
                if (buff.timer <= 0) {
                    buff.isActive = false;
                    if (buffType === 'speed') {
                        this.speed = this.baseSpeed;
                    } else if (buffType === 'damage') {
                        this.baseDamageMultiplier = 1;
                    } else if (buffType === 'invincibility') {
                        this.invincibilityDuration = 200; // Volta ao normal
                    }
                }
            }
        }

        let velX = 0;
        let velY = 0;
        const currentSpeed = this.speed;
        const keys = window.GLOBAL_GAME_STATE.keys;

        // Movimentação
        if (keys[this.controls.up]) velY -= currentSpeed;
        if (keys[this.controls.down]) velY += currentSpeed;
        if (keys[this.controls.left]) velX -= currentSpeed;
        if (keys[this.controls.right]) velX += currentSpeed;

        // Normalização da velocidade para movimento diagonal
        if (velX !== 0 && velY !== 0) {
            const magnitude = Math.sqrt(velX * velX + velY * velY);
            velX /= magnitude;
            velY /= magnitude;
            velX *= currentSpeed;
            velY *= currentSpeed;
        }

        // Dash
        if (keys[this.controls.dash] && this.dashCooldown === 0 && this.energy >= 20) {
            this.isDashing = true;
            this.currentDashDuration = this.dashDuration;
            this.energy -= 20;
            this.dashCooldown = 1000; // 1 segundo de cooldown para o dash
            sfx.play('dash');
            keys[this.controls.dash] = false; // Consome a tecla para evitar múltiplos dashes
        }

        if (this.isDashing) {
            this.x += velX * this.dashSpeedMultiplier;
            this.y += velY * this.dashSpeedMultiplier;
            this.currentDashDuration -= deltaTime;
            if (this.currentDashDuration <= 0) {
                this.isDashing = false;
            }
        } else {
            this.x += velX;
            this.y += velY;
        }

        // Limites da tela
        this.x = Math.max(0, Math.min(this.x, GAME_WIDTH - this.width));
        this.y = Math.max(0, Math.min(this.y, GAME_HEIGHT - this.height));

        // Mira
        if (window.GLOBAL_GAME_STATE.currentMode === 'solo') {
            const { mouseX, mouseY } = window.GLOBAL_GAME_STATE;
            const dx = mouseX - (this.x + this.width / 2);
            const dy = mouseY - (this.y + this.height / 2);
            this.angle = Math.atan2(dy, dx);
        } else if (window.GLOBAL_GAME_STATE.currentMode === 'pvp' && otherPlayer) {
            const dx = (otherPlayer.x + otherPlayer.width / 2) - (this.x + this.width / 2);
            const dy = (otherPlayer.y + otherPlayer.height / 2) - (this.y + this.height / 2);
            this.angle = Math.atan2(dy, dx);
        } else { // Fallback para onde o jogador está se movendo se não houver alvo
             if (velX !== 0 || velY !== 0) {
                 this.angle = Math.atan2(velY, velX);
             }
        }

        // Ataque
        if (keys[this.controls.attack] && this.currentWeapon.canShoot()) {
            this._shoot();
            this.currentWeapon.shoot(); // Consome munição e reseta lastShotTime
        } else if (keys[this.controls.attack] && !this.currentWeapon.canShoot() && !this.currentWeapon.isReloading && this.currentWeapon.currentAmmo === 0) {
            sfx.play('noAmmo');
        }


        // Recarregar
        if (keys[this.controls.reload]) {
            this.currentWeapon.startReload();
        }

        // Troca de arma (Q/E para P1, O/P para P2)
        if (keys[this.controls.weaponNext] && this.weaponSwitchCooldown === 0) {
            this.switchWeapon(1);
            this.weaponSwitchCooldown = this.WEAPON_SWITCH_COOLDOWN;
            keys[this.controls.weaponNext] = false; // Consome o input da tecla
        } else if (keys[this.controls.weaponPrev] && this.weaponSwitchCooldown === 0) {
            this.switchWeapon(-1);
            this.weaponSwitchCooldown = this.WEAPON_SWITCH_COOLDOWN;
            keys[this.controls.weaponPrev] = false; // Consome o input da tecla
        }

        // Ativar Habilidade Especial
        if (this.abilities.special && keys[this.abilities.special.key] && this.abilities.special.currentCooldown === 0 && this.energy >= this.abilities.special.energyCost) {
            this._useSpecialAbility();
            this.abilities.special.currentCooldown = this.abilities.special.cooldown;
            this.energy -= this.abilities.special.energyCost;
            keys[this.abilities.special.key] = false; // Consome o input
        }

        // Regeneração passiva de energia (ajustado para ser por segundo)
        this.energy = Math.min(this.maxEnergy, this.energy + (0.02 * deltaTime)); // 2 energia por segundo
    }

    _shoot() {
        const projectilesArray = window.GLOBAL_GAME_STATE.projectiles;
        const particlesArray = window.GLOBAL_GAME_STATE.particles;

        // Ponto de saída do tiro (boca da arma)
        const muzzleX = this.x + this.width / 2 + Math.cos(this.angle) * (this.width / 2 + 5);
        const muzzleY = this.y + this.height / 2 + Math.sin(this.angle) * (this.height / 2 + 5);

        // Feedback visual na boca da arma
        createImpactParticles(muzzleX, muzzleY, 2, 4, 'white', 0.5, 100, particlesArray);

        const weaponDamage = this.currentWeapon.damage * this.baseDamageMultiplier;

        if (this.currentWeapon.projectilesPerShot > 1) { // Escopeta/Espalhamento
            for (let i = 0; i < this.currentWeapon.projectilesPerShot; i++) {
                const angleOffset = (Math.random() - 0.5) * this.currentWeapon.spreadAngle;
                const finalAngle = this.angle + angleOffset;
                projectilesArray.push(new Projectile(
                    muzzleX, muzzleY, PROJECTILE_SIZE, PROJECTILE_SIZE, this.currentWeapon.projColor, this.currentWeapon.projectileSpeed, finalAngle, weaponDamage, this, this.currentWeapon.projType
                ));
            }
        } else {
            projectilesArray.push(new Projectile(
                muzzleX, muzzleY, PROJECTILE_SIZE, PROJECTILE_SIZE, this.currentWeapon.projColor, this.currentWeapon.projectileSpeed, this.angle, weaponDamage, this, this.currentWeapon.projType
            ));
        }
    }

    _useSpecialAbility() {
        const gameState = window.GLOBAL_GAME_STATE;
        const particlesArray = gameState.particles;

        if (this.playerNumber === 1) { // Tiro Explosivo (Player 1)
            sfx.play('explosion');
            const startX = this.x + this.width / 2 + Math.cos(this.angle) * (this.width / 2 + 10);
            const startY = this.y + this.height / 2 + Math.sin(this.angle) * (this.height / 2 + 10);
            gameState.projectiles.push(new Projectile(
                startX, startY, PROJECTILE_SIZE * 1.5, PROJECTILE_SIZE * 1.5, 'red', 6, this.angle, 80, this, 'explosive' // Dano fixo de 80 para habilidade
            ));
        } else if (this.playerNumber === 2) { // Aura de Cura (Player 2)
            sfx.play('auraHeal');
            const healAmount = 20 + this.level * 2;
            this.health = Math.min(this.maxHealth, this.health + healAmount);
            showMessage(`P${this.playerNumber} Aura de Cura ativada! +${healAmount} HP`, 1500);

            for(let i=0; i<10; i++) {
                particlesArray.push(new Particle(
                    this.x + Math.random() * this.width,
                    this.y + Math.random() * this.height,
                    5, 'rgba(0,255,0,0.5)', (Math.random()-0.5)*1, (Math.random()-0.5)*1, 500
                ));
            }
        }
    }

    switchWeapon(direction) {
        const weaponNames = Object.keys(this.weapons);
        let currentIndex = weaponNames.indexOf(this.currentWeapon.name.toLowerCase().replace(/ /g, ''));
        if (currentIndex === -1) currentIndex = 0; // Fallback se o nome não for encontrado

        currentIndex = (currentIndex + direction + weaponNames.length) % weaponNames.length;
        this.currentWeapon = this.weapons[weaponNames[currentIndex]];
        showMessage(`P${this.playerNumber} Arma: ${this.currentWeapon.name.toUpperCase()}`, 1000);
    }

    collectItem(item) {
        sfx.play('itemPickup');
        const gameState = window.GLOBAL_GAME_STATE;
        switch (item.type) {
            case 'health':
                this.health = Math.min(this.maxHealth, this.health + item.value);
                createImpactParticles(item.x + item.width/2, item.y + item.height/2, 10, 4, 'lime', 1.5, 400, gameState.particles);
                showMessage(`P${this.playerNumber} +${item.value} HP!`, 800);
                break;
            case 'energy':
                this.energy = Math.min(this.maxEnergy, this.energy + item.value);
                createImpactParticles(item.x + item.width/2, item.y + item.height/2, 10, 4, 'blue', 1.5, 400, gameState.particles);
                showMessage(`P${this.playerNumber} +${item.value} Energia!`, 800);
                break;
            case 'coin':
                this.coins += item.value;
                createImpactParticles(item.x + item.width/2, item.y + item.height/2, 5, 4, 'gold', 2, 300, gameState.particles);
                showMessage(`P${this.playerNumber} +${item.value} Moedas!`, 800);
                break;
            case 'weapon':
                const newWeaponName = item.weaponType;
                if (this.weapons[newWeaponName]) {
                    this.weapons[newWeaponName].currentAmmo = this.weapons[newWeaponName].magazineSize; // Recarrega a arma coletada
                    this.currentWeapon = this.weapons[newWeaponName]; // Equipa
                    showMessage(`P${this.playerNumber} Nova arma: ${newWeaponName.toUpperCase()}!`, 1000);
                } else {
                    this.currentWeapon.currentAmmo = this.currentWeapon.magazineSize; // Recarrega a arma atual
                    showMessage(`P${this.playerNumber} Munição completa!`, 1000);
                }
                createImpactParticles(item.x + item.width/2, item.y + item.height/2, 10, 4, 'gray', 1.5, 400, gameState.particles);
                break;
            case 'buff_speed':
                this.applyBuff('speed', 5000, 1.5);
                break;
            case 'buff_invincibility':
                this.applyBuff('invincibility', 3000);
                break;
            case 'buff_damage':
                this.applyBuff('damage', 7000, 2);
                break;
        }
    }

    draw(ctx) {
        super.draw(ctx); // Desenha a entidade base

        // Desenhar a barra de energia
        const energyBarWidth = this.width + 10;
        const energyBarHeight = 6;
        const energyBarX = this.x - 5;
        const energyBarY = this.y - 8; // Abaixo da barra de vida

        ctx.fillStyle = '#333';
        ctx.fillRect(energyBarX, energyBarY, energyBarWidth, energyBarHeight);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.strokeRect(energyBarX, energyBarY, energyBarWidth, energyBarHeight);

        ctx.fillStyle = '#3498db'; // Cor azul para energia
        ctx.fillRect(energyBarX, energyBarY, energyBarWidth * (this.energy / this.maxEnergy), energyBarHeight);

        // Desenhar o ícone da arma atual
        if (this.currentWeapon.iconLoaded) {
            const iconSize = 20;
            const iconX = this.x + this.width / 2 - iconSize / 2;
            const iconY = this.y - PLAYER_SIZE - iconSize; // Acima do jogador
            ctx.drawImage(this.currentWeapon.icon, iconX, iconY, iconSize, iconSize);
        }


        // Desenhar indicador de Habilidade
        if (this.abilities.special) {
            const cooldownRatio = this.abilities.special.currentCooldown / this.abilities.special.cooldown;
            const barLength = this.width + 10;
            const barHeight = 4;
            const barY = this.y + this.height + 5;
            const barX = this.x - 5;

            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barLength, barHeight);
            ctx.fillStyle = cooldownRatio > 0 ? 'rgba(255,0,0,0.7)' : 'rgba(0,255,0,0.7)';
            ctx.fillRect(barX, barY, barLength * (1 - cooldownRatio), barHeight);
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barLength, barHeight);
            ctx.font = '8px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.abilities.special.key.toUpperCase(), barX + barLength/2, barY + barHeight/2);
        }

        // Desenhar indicadores de Buffs ativos
        let buffY = this.y - 40;
        for (const buffType in this.activeBuffs) {
            const buff = this.activeBuffs[buffType];
            if (buff.isActive) {
                const buffText = `${buffType.substring(0,1).toUpperCase()}: ${Math.ceil(buff.timer / 1000)}s`;
                ctx.font = '10px Arial';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText(buffText, this.x + this.width / 2, buffY);
                buffY -= 12;
            }
        }
    }
}

// ===============================================
// CLASSE INIMIGO (NPC)
// ===============================================
class Enemy extends Entity {
    constructor(x, y, type) {
        let width, height, speed, health, color, attackRange, attackDamage, attackSpeed, projectileSpeed, projColor, xpDrop, coinsDrop;

        switch (type) {
            case 'melee':
                width = ENEMY_SIZE; height = ENEMY_SIZE; speed = 2.8; health = 40; color = 'red';
                attackRange = 40; attackDamage = 8; attackSpeed = 700;
                xpDrop = 5; coinsDrop = 1;
                break;
            case 'ranged':
                width = ENEMY_SIZE; height = ENEMY_SIZE; speed = 2; health = 30; color = 'purple';
                attackRange = 250; attackDamage = 12; attackSpeed = 1000;
                projectileSpeed = 7; projColor = 'darkorange';
                xpDrop = 7; coinsDrop = 2;
                break;
            case 'tank':
                width = ENEMY_SIZE * 1.5; height = ENEMY_SIZE * 1.5; speed = 1.5; health = 120; color = 'darkred';
                attackRange = 50; attackDamage = 15; attackSpeed = 1400;
                xpDrop = 15; coinsDrop = 4;
                break;
            case 'fast':
                width = ENEMY_SIZE * 0.8; height = ENEMY_SIZE * 0.8; speed = 4; health = 20; color = 'cyan';
                attackRange = 30; attackDamage = 5; attackSpeed = 600;
                xpDrop = 6; coinsDrop = 1;
                break;
            case 'suicide':
                width = ENEMY_SIZE; height = ENEMY_SIZE; speed = 3.5; health = 25; color = 'darkgreen';
                attackRange = 60; attackDamage = 40; attackSpeed = 1000;
                xpDrop = 10; coinsDrop = 3;
                this.detonationTimer = 1000;
                this.isDetonating = false;
                break;
            case 'splitter':
                width = ENEMY_SIZE * 1.2; height = ENEMY_SIZE * 1.2; speed = 2.2; health = 60; color = 'brown';
                attackRange = 45; attackDamage = 10; attackSpeed = 900;
                xpDrop = 12; coinsDrop = 3;
                break;
            case 'small_splitter':
                width = ENEMY_SIZE * 0.6; height = ENEMY_SIZE * 0.6; speed = 3.5; health = 15; color = 'saddlebrown';
                attackRange = 35; attackDamage = 6; attackSpeed = 500;
                xpDrop = 3; coinsDrop = 1;
                break;
            case 'boss_cube':
                width = ENEMY_SIZE * 2.5; height = ENEMY_SIZE * 2.5; speed = 1.0; health = 500; color = 'gold';
                attackRange = 300; attackDamage = 25; attackSpeed = 2000;
                projectileSpeed = 8; projColor = 'hotpink';
                xpDrop = 100; coinsDrop = 20;
                break;
            default:
                width = ENEMY_SIZE; height = ENEMY_SIZE; speed = 2.5; health = 50; color = 'red';
                attackRange = 40; attackDamage = 8; attackSpeed = 800;
                xpDrop = 5; coinsDrop = 1;
        }
        super(x, y, width, height, color, speed, health);
        this.type = type;
        this.attackRange = attackRange;
        this.attackDamage = attackDamage;
        this.attackCooldown = 0;
        this.attackSpeed = attackSpeed;
        this.projectileSpeed = projectileSpeed;
        this.projColor = projColor;
        this.xpDrop = xpDrop;
        this.coinsDrop = coinsDrop;
    }

    update(deltaTime, targetPlayer) {
        super.update(deltaTime);

        if (this.isDead || !targetPlayer || targetPlayer.isDead) return;

        this.attackCooldown = Math.max(0, this.attackCooldown - deltaTime);

        const dx = (targetPlayer.x + targetPlayer.width / 2) - (this.x + this.width / 2);
        const dy = (targetPlayer.y + targetPlayer.height / 2) - (this.y + this.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        this.angle = angle;

        if (this.type === 'suicide') {
            if (dist < this.attackRange && !this.isDetonating) {
                this.isDetonating = true;
                this.detonationTimer = 1000; // Começa contagem para explosão
                showMessage("Suicida está carregando!", 500);
            }
            if (this.isDetonating) {
                this.detonationTimer -= deltaTime;
                if (this.detonationTimer <= 0) {
                    this._explode(targetPlayer);
                    this.isDead = true;
                }
                // Ainda se move em direção ao player enquanto detona
                this.x += Math.cos(angle) * (this.speed * 0.5);
                this.y += Math.sin(angle) * (this.speed * 0.5);
            } else {
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            }
        } else { // Comportamento padrão para outros inimigos
            if (dist > this.attackRange) {
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            } else {
                if (this.attackCooldown === 0) {
                    if (this.type === 'melee' || this.type === 'tank' || this.type === 'fast' || this.type === 'splitter' || this.type === 'small_splitter') {
                        targetPlayer.takeDamage(this.attackDamage);
                        sfx.play('hit');
                    } else if (this.type === 'ranged' || this.type === 'boss_cube') {
                        this.shoot(targetPlayer);
                    }
                    this.attackCooldown = this.attackSpeed;
                }
            }
        }
    }

    shoot(target) {
        const projectilesArray = window.GLOBAL_GAME_STATE.projectiles;
        const particlesArray = window.GLOBAL_GAME_STATE.particles;

        const projSize = PROJECTILE_SIZE * 0.8;
        const startX = this.x + this.width / 2 + Math.cos(this.angle) * (this.width / 2 + 5);
        const startY = this.y + this.height / 2 + Math.sin(this.angle) * (this.height / 2 + 5);

        createImpactParticles(startX, startY, 2, 3, 'white', 0.5, 100, particlesArray);

        if (this.type === 'boss_cube') {
            for (let i = -1; i <= 1; i++) {
                const spreadAngle = this.angle + (i * Math.PI / 8);
                projectilesArray.push(new Projectile(
                    startX, startY, projSize * 1.5, projSize * 1.5, this.projColor, this.projectileSpeed * 0.8, spreadAngle, this.attackDamage, this, 'bullet_enemy'
                ));
            }
        } else {
            projectilesArray.push(new Projectile(
                startX, startY, projSize, projSize, this.projColor, this.projectileSpeed, this.angle, this.attackDamage, this, 'bullet_enemy'
            ));
        }
        sfx.play('shoot');
    }

    _explode(targetPlayer) {
        sfx.play('explosion');
        const explosionRadius = 150;
        const explosionDamage = this.attackDamage;
        const gameState = window.GLOBAL_GAME_STATE;

        if (targetPlayer && distance(this, targetPlayer) < explosionRadius) {
            targetPlayer.takeDamage(explosionDamage);
        }

        createImpactParticles(this.x + this.width/2, this.y + this.height/2, 30, 8, 'orange', 5, 800, gameState.particles);
        createImpactParticles(this.x + this.width/2, this.y + this.height/2, 20, 6, 'yellow', 4, 600, gameState.particles);
    }

    onDeath(itemsArray, enemiesArray, playersArray) {
        sfx.play('enemyDeath');
        const gameState = window.GLOBAL_GAME_STATE;

        playersArray.forEach(player => {
            if (!player.isDead && distance(this, player) < 300) {
                player.addXP(this.xpDrop);
                createImpactParticles(this.x + this.width/2, this.y + this.height/2, 5, 4, 'purple', 1, 200, gameState.particles);
            }
        });

        if (rollChance(40)) {
            const itemTypes = ['health', 'energy', 'coin', 'weapon', 'buff_speed', 'buff_invincibility', 'buff_damage'];
            const randomItemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            let itemValue = 0;
            let weaponType = null;

            switch (randomItemType) {
                case 'health': itemValue = 15; break;
                case 'energy': itemValue = 20; break;
                case 'coin': itemValue = Math.floor(Math.random() * 15) + 10; break;
                case 'weapon':
                    const weaponPool = ['shotgun', 'machinegun', 'rifle', 'sniper', 'bazooka', 'smg'];
                    weaponType = weaponPool[Math.floor(Math.random() * weaponPool.length)];
                    break;
                case 'buff_speed': itemValue = 1.5; break;
                case 'buff_invincibility': break;
                case 'buff_damage': itemValue = 2; break;
            }
            itemsArray.push(new Item(this.x + this.width/2 - ITEM_SIZE/2, this.y + this.height/2 - ITEM_SIZE/2, randomItemType, itemValue, weaponType));
        }

        if (this.type === 'splitter') {
            const numSmall = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < numSmall; i++) {
                const spawnX = this.x + (Math.random() * 20 - 10);
                const spawnY = this.y + (Math.random() * 20 - 10);
                enemiesArray.push(new Enemy(spawnX, spawnY, 'small_splitter'));
            }
        }
    }

    draw(ctx) {
        super.draw(ctx);
        if (this.type === 'suicide' && this.isDetonating) {
            const progress = this.detonationTimer / 1000;
            const radius = this.width / 2 + (1 - progress) * 30;
            ctx.strokeStyle = `rgba(255, 100, 0, ${progress * 0.8})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

// ===============================================
// CLASSE PROJÉTIL
// ===============================================
class Projectile {
    constructor(x, y, width, height, color, speed, angle, damage, owner, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.angle = angle;
        this.damage = damage;
        this.owner = owner;
        this.type = type; // 'bullet', 'laser', 'explosive', 'bullet_enemy'
        this.isDead = false;
        this.lifetime = 2000;
        this.creationTime = Date.now();
        this.explosionRadius = 100;
        this.explosionDamage = 50;
    }

    update(deltaTime) {
        if (this.isDead) return;

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < -this.width || this.x > GAME_WIDTH || this.y < -this.height || this.y > GAME_HEIGHT || (Date.now() - this.creationTime > this.lifetime)) {
            this.isDead = true;
            if (this.type === 'explosive') {
                this._explode();
            }
        }
    }

    draw(ctx) {
        if (this.isDead) return;

        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);

        ctx.fillStyle = this.color;
        if (this.type === 'laser') {
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        } else if (this.type === 'explosive') {
            ctx.fillStyle = `rgba(255, 0, 0, ${Math.abs(Math.sin(Date.now() / 100)) * 0.8 + 0.2})`;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        } else if (this.type === 'bullet_enemy') {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        else {
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        ctx.restore();
    }

    _explode() {
        sfx.play('explosion');
        const gameState = window.GLOBAL_GAME_STATE;
        if (this.owner instanceof Player) {
            gameState.enemies.forEach(enemy => {
                if (!enemy.isDead && distance(this, enemy) < this.explosionRadius) {
                    enemy.takeDamage(this.explosionDamage);
                }
            });
        }
        createImpactParticles(this.x + this.width/2, this.y + this.height/2, 20, 6, 'orange', 4, 600, gameState.particles);
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
}

// ===============================================
// CLASSE PARTÍCULA (para efeitos visuais)
// ===============================================
class Particle {
    constructor(x, y, size, color, velX, velY, lifetime) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.velX = velX;
        this.velY = velY;
        this.lifetime = lifetime;
        this.age = 0;
        this.isDead = false;
        this.alpha = 1;
    }

    update(deltaTime) {
        this.x += this.velX;
        this.y += this.velY;
        this.age += deltaTime;
        this.alpha = 1 - (this.age / this.lifetime);
        if (this.alpha <= 0) {
            this.isDead = true;
        }
    }

    draw(ctx) {
        if (this.isDead) return;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

// ===============================================
// CLASSE ITEM (drops de inimigos)
// ===============================================
class Item {
    constructor(x, y, type, value, weaponType = null) {
        this.x = x;
        this.y = y;
        this.width = ITEM_SIZE;
        this.height = ITEM_SIZE;
        this.type = type; // 'health', 'energy', 'coin', 'weapon', 'buff_speed', 'buff_invincibility', 'buff_damage'
        this.value = value;
        this.weaponType = weaponType; // Usado para 'weapon' type
        this.isCollected = false;
        this.color = this._getColor(type);

        // Ícones para itens
        this.icon = new Image();
        this.iconLoaded = false;
        this.iconPath = this._getIconPath(type, weaponType);
        this.icon.src = this.iconPath;
        this.icon.onload = () => { this.iconLoaded = true; };
        this.icon.onerror = () => { console.error(`Erro ao carregar ícone do item: ${this.iconPath}`); };
    }

    _getColor(type) {
        switch (type) {
            case 'health': return 'red';
            case 'energy': return 'blue';
            case 'coin': return 'gold';
            case 'weapon': return 'darkgray';
            case 'buff_speed': return 'lightgreen';
            case 'buff_invincibility': return 'silver';
            case 'buff_damage': return 'darkviolet';
            default: return 'gray';
        }
    }

    _getIconPath(type, weaponType) {
        switch (type) {
            case 'health': return 'images/icon_health.png';
            case 'energy': return 'images/icon_medkit.png'; // Ou um ícone de energia
            case 'coin': return 'images/icon_damage.png'; // Trocar por um ícone de moeda se tiver
            case 'weapon':
                if (weaponType) {
                    return `images/icon_${weaponType}.png`; // Ex: images/icon_shotgun.png
                }
                return 'images/icon_pistol.png'; // Fallback
            case 'buff_speed': return 'images/icon_damage.png'; // Trocar por ícone de velocidade
            case 'buff_invincibility': return 'images/icon_damage.png'; // Trocar por ícone de escudo
            case 'buff_damage': return 'images/icon_damage.png';
            default: return '';
        }
    }

    draw(ctx) {
        if (this.isCollected) return;

        if (this.iconLoaded) {
            ctx.drawImage(this.icon, this.x, this.y, this.width, this.height);
        } else {
            // Fallback se o ícone não carregar
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = 'black';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            let text = '';
            switch (this.type) {
                case 'health': text = 'HP'; break;
                case 'energy': text = 'EN'; break;
                case 'coin': text = '$'; break;
                case 'weapon': text = 'W'; break;
                case 'buff_speed': text = 'S'; break;
                case 'buff_invincibility': text = 'I'; break;
                case 'buff_damage': text = 'D'; break;
            }
            ctx.fillText(text, this.x + this.width / 2, this.y + this.height / 2);
        }
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
}

// ===============================================
// CLASSE OBSTÁCULO (blocos estáticos indestrutíveis)
// ===============================================
class Obstacle {
    constructor(x, y, width, height, color = '#4a2c6d') { // Cor mais escura para combinar
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = '#2d1b42'; // Borda mais escura
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
}

// ===============================================
// CLASSE DESTRUTÍVEL (caixas, barreiras destrutíveis)
// ===============================================
class Destructible extends Entity {
    constructor(x, y, width, height, health, color = '#7f5a9e') { // Cor diferente
        super(x, y, width, height, color, 0, health);
        this.coinsDrop = Math.floor(Math.random() * 3) + 1;
    }

    takeDamage(amount) {
        super.takeDamage(amount); // Chama o takeDamage da Entity para lidar com HP, invencibilidade, blink
        if (this.isDead) {
            sfx.play('hit'); // Som de destruição
            const gameState = window.GLOBAL_GAME_STATE;
            createImpactParticles(this.x + this.width/2, this.y + this.height/2, 15, 6, 'darkgray', 3, 500, gameState.particles);
            gameState.items.push(new Item(this.x + this.width/2 - ITEM_SIZE/2, this.y + this.height/2 - ITEM_SIZE/2, 'coin', this.coinsDrop));
        } else {
            sfx.play('hit');
        }
    }

    draw(ctx) {
        if (this.isDead) return;

        let currentColor = this.color;
        if (this.blinkTimer > 0 && Math.floor(Date.now() / 50) % 2 === 0) {
            currentColor = 'white';
        }

        ctx.fillStyle = currentColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = '#5f4178';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Barra de vida acima do destrutível
        const barWidth = this.width;
        const barHeight = 4;
        const barY = this.y - 10;
        const barX = this.x;
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = 'orange';
        ctx.fillRect(barX, barY, barWidth * (this.health / this.maxHealth), barHeight);
    }
}

// ===============================================
// CLASSE ARMADILHA (Trap)
// ===============================================
class Trap {
    constructor(x, y, width, height, damage, cooldown, color = 'darkred') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.damage = damage;
        this.cooldown = cooldown;
        this.color = color;
        this.lastDamageTime = {}; // Mapeia o tempo do último dano por ID do jogador
    }

    update(deltaTime, playersArray, particlesArray) {
        playersArray.forEach(player => {
            if (!player.isDead && checkCollision(player, this)) {
                // Usa player.playerNumber como ID único para a armadilha
                if (!this.lastDamageTime[player.playerNumber] || (Date.now() - this.lastDamageTime[player.playerNumber] > this.cooldown)) {
                    player.takeDamage(this.damage);
                    this.lastDamageTime[player.playerNumber] = Date.now();
                    createImpactParticles(player.x + player.width/2, player.y + player.height/2, 10, 4, 'red', 2, 400, particlesArray);
                    // sfx.play('playerHurt'); // Som de dano já é chamado em takeDamage
                }
            }
        });
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Desenhar um ícone para indicar que é uma armadilha
        ctx.fillStyle = 'yellow';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', this.x + this.width / 2, this.y + this.height / 2);
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
}