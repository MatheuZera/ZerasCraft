// ===============================================
// FUNÇÕES DE ATUALIZAÇÃO DA INTERFACE DO USUÁRIO (UI)
// ===============================================

function updateHUD() {
    const gameState = window.GLOBAL_GAME_STATE;

    gameState.players.forEach(player => {
        const hudElement = document.getElementById(`hud-${player.hudId}`);
        if (!hudElement) {
            console.warn(`HUD element for ${player.hudId} not found.`);
            return;
        }

        // Mostrar/Esconder HUD
        if (gameState.gameRunning) {
            hudElement.classList.remove('hidden');
        } else {
            hudElement.classList.add('hidden');
            return;
        }

        // Atualizar vida e energia
        document.getElementById(`${player.hudId}-health`).textContent = `HP: ${Math.round(player.health)}/${player.maxHealth}`;
        document.getElementById(`${player.hudId}-energy`).textContent = `EN: ${Math.round(player.energy)}/${player.maxEnergy}`;

        // Atualizar XP e Nível
        document.getElementById(`${player.hudId}-level`).textContent = player.level;
        document.getElementById(`${player.hudId}-xp`).textContent = player.xp;
        document.getElementById(`${player.hudId}-xp-next`).textContent = player.xpToNextLevel;

        // Atualizar arma e munição
        document.getElementById(`${player.hudId}-weapon-name`).textContent = player.currentWeapon.name;
        document.getElementById(`${player.hudId}-ammo`).textContent = `${player.currentWeapon.currentAmmo}/${player.currentWeapon.magazineSize}`;

        // Atualizar indicador de recarga
        const reloadIndicator = document.getElementById(`${player.hudId}-reload-indicator`);
        if (player.currentWeapon.isReloading) {
            reloadIndicator.style.width = `${(1 - (player.currentWeapon.reloadTimer / player.currentWeapon.reloadTime)) * 100}%`;
            reloadIndicator.style.backgroundColor = 'orange';
        } else {
            reloadIndicator.style.width = '0%';
            reloadIndicator.style.backgroundColor = 'transparent';
        }

        // Atualizar cooldown da habilidade especial
        const abilityCooldownElement = document.getElementById(`${player.hudId}-ability-cooldown`);
        if (player.abilities.special) {
            if (player.abilities.special.currentCooldown > 0) {
                abilityCooldownElement.textContent = `(${Math.ceil(player.abilities.special.currentCooldown / 1000)}s)`;
                abilityCooldownElement.style.color = 'red';
            } else {
                abilityCooldownElement.textContent = 'Pronto!';
                abilityCooldownElement.style.color = 'lime';
            }
        }
    });

    // Em modo solo, apenas P1 HUD é relevante. Em PvP, ambos.
    // Lógica adicional para mostrar/esconder o HUD do P2 em modo solo
    const hudP2 = document.getElementById('hud-p2');
    if (gameState.currentMode === 'solo' && hudP2 && !hudP2.classList.contains('hidden')) {
        hudP2.classList.add('hidden');
    } else if (gameState.currentMode === 'pvp' && hudP2 && hudP2.classList.contains('hidden')) {
        hudP2.classList.remove('hidden');
    }
}