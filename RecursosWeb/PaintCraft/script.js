document.addEventListener('DOMContentLoaded', () => {
    const canvasGrid = document.getElementById('canvasGrid');
    const blockPalette = document.getElementById('blockPalette');
    const pencilToolBtn = document.getElementById('pencilTool');
    const eraserToolBtn = document.getElementById('eraserTool');
    const fillToolBtn = document.getElementById('fillTool');
    const moveToolBtn = document.getElementById('moveTool');
    const rotateToolBtn = document.getElementById('rotateTool');
    const brushSizeInput = document.getElementById('brushSize');
    const brushSizeValueSpan = document.getElementById('brushSizeValue');
    const clearCanvasBtn = document.getElementById('clearCanvas');
    const downloadImageBtn = document.getElementById('downloadImage');

    const gridSize = 32; // Define o tamanho do grid (32x32 pixels)
    let pixelSize = 16; // Tamanho inicial de cada "pixel" no grid em px (será ajustado pelo CSS)
    let selectedBlock = 'grass_block'; // Bloco selecionado inicialmente
    let activeTool = 'pencil'; // Ferramenta ativa inicialmente
    let currentBrushSize = parseInt(brushSizeInput.value); // Tamanho do pincel
    let rotationAngle = 0; // Ângulo de rotação do canvas (0, 90, 180, 270)
    let isMouseDown = false;
    let originalColors = {}; // Armazena as cores originais dos pixels para o pincel/borracha
    let blockRotationState = {}; // Armazena o estado de rotação de cada bloco individual (para o pixel)


    // --- Configuração e Geração do Grid ---
    function setGridCSSVariables() {
        const root = document.documentElement;
        // Ajusta o tamanho do pixel para preencher o canvas-area no mobile, se o grid for menor.
        // Em desktop, ele se ajusta ao tamanho fixo do pixel.
        if (window.innerWidth <= 768) {
             // Calcula um tamanho de pixel que caiba no viewport
            const maxDimension = Math.min(canvasGrid.offsetWidth, canvasGrid.offsetHeight);
            pixelSize = Math.floor(maxDimension / gridSize);
        } else {
            pixelSize = 16; // Mantém 16px para desktop ou um valor que você ache ideal
        }
        root.style.setProperty('--pixel-size', `${pixelSize}px`);
        canvasGrid.style.gridTemplateColumns = `repeat(${gridSize}, var(--pixel-size))`;
        canvasGrid.style.gridTemplateRows = `repeat(${gridSize}, var(--pixel-size))`;
    }

    function createGrid() {
        canvasGrid.innerHTML = ''; // Limpa o grid existente
        for (let i = 0; i < gridSize * gridSize; i++) {
            const pixel = document.createElement('div');
            pixel.classList.add('pixel');
            pixel.dataset.index = i; // Armazena o índice para fácil referência
            pixel.style.backgroundImage = `url(assets/blocks/air.png)`; // Cor de fundo inicial (vazio/ar)
            pixel.dataset.blockType = 'air'; // Tipo de bloco
            pixel.dataset.rotation = 0; // Rotação inicial de cada bloco
            pixel.classList.add('block-rotated-0'); // Aplica a classe de rotação inicial
            canvasGrid.appendChild(pixel);
        }
        setGridCSSVariables(); // Define as variáveis CSS após criar o grid
    }

    // Ajusta o tamanho do grid e pixels quando a janela é redimensionada
    window.addEventListener('resize', setGridCSSVariables);


    // --- Paleta de Blocos ---
    const blocks = [
        { id: 'air', name: 'Ar', path: 'air.png' },
        { id: 'grass_block', name: 'Grama', path: 'grass_block.png' },
        { id: 'dirt', name: 'Terra', path: 'dirt.png' },
        { id: 'stone', name: 'Pedra', path: 'stone.png' },
        { id: 'cobblestone', name: 'Pedregulho', path: 'cobblestone.png' },
        { id: 'oak_planks', name: 'Tábuas de Carvalho', path: 'oak_planks.png' },
        { id: 'bricks', name: 'Tijolos', path: 'bricks.png' },
        { id: 'sand', name: 'Areia', path: 'sand.png' },
        { id: 'gravel', name: 'Cascalho', path: 'gravel.png' },
        { id: 'water_still', name: 'Água', path: 'water_still.png' },
        { id: 'lava_still', name: 'Lava', path: 'lava_still.png' },
        { id: 'coal_ore', name: 'Minério de Carvão', path: 'coal_ore.png' },
        { id: 'iron_ore', name: 'Minério de Ferro', path: 'iron_ore.png' },
        { id: 'gold_ore', name: 'Minério de Ouro', path: 'gold_ore.png' },
        { id: 'diamond_ore', name: 'Minério de Diamante', path: 'diamond_ore.png' },
        { id: 'glass', name: 'Vidro', path: 'glass.png' },
        { id: 'log_oak', name: 'Tronco de Carvalho', path: 'log_oak.png' },
        { id: 'leaves_oak', name: 'Folhas de Carvalho', path: 'leaves_oak.png' },
        { id: 'bedrock', name: 'Rocha Matriz', path: 'bedrock.png' },
        { id: 'crafting_table', name: 'Bancada', path: 'crafting_table.png' },
        { id: 'furnace', name: 'Fornalha', path: 'furnace.png' },
        { id: 'chest', name: 'Baú', path: 'chest.png' },
        { id: 'torch', name: 'Tocha', path: 'torch.png' },
        { id: 'redstone_ore', name: 'Minério de Redstone', path: 'redstone_ore.png' },
        { id: 'emerald_ore', name: 'Minério de Esmeralda', path: 'emerald_ore.png' },
        { id: 'obsidian', name: 'Obsidiana', path: 'obsidian.png' },
        { id: 'netherrack', name: 'Netherrack', path: 'netherrack.png' },
        { id: 'glowstone', name: 'Pedra Luminosa', path: 'glowstone.png' },
        { id: 'soul_sand', name: 'Areia de Almas', path: 'soul_sand.png' },
        { id: 'end_stone', name: 'Pedra do Fim', path: 'end_stone.png' },
        { id: 'quartz_ore', name: 'Minério de Quartzo', path: 'quartz_ore.png' },
        { id: 'sponge', name: 'Esponja', path: 'sponge.png' },
        { id: 'ice', name: 'Gelo', path: 'ice.png' },
        { id: 'snow', name: 'Neve', path: 'snow.png' },
        { id: 'clay', name: 'Argila', path: 'clay.png' },
        { id: 'pumpkin', name: 'Abóbora', path: 'pumpkin.png' },
        { id: 'melon_block', name: 'Melancia', path: 'melon_block.png' },
        { id: 'cactus_side', name: 'Cacto', path: 'cactus_side.png' },
        { id: 'sugar_cane', name: 'Cana-de-Açúcar', path: 'sugar_cane.png' },
        { id: 'mushroom_red', name: 'Cogumelo Vermelho', path: 'mushroom_red.png' },
        { id: 'mushroom_brown', name: 'Cogumelo Marrom', path: 'mushroom_brown.png' },
        { id: 'mycelium_side', name: 'Micélio', path: 'mycelium_side.png' },
        { id: 'nether_brick', name: 'Tijolo do Nether', path: 'nether_brick.png' },
        { id: 'end_portal_frame_top', name: 'Moldura do Portal do Fim', path: 'end_portal_frame_top.png' },
        { id: 'dragon_egg', name: 'Ovo de Dragão', path: 'dragon_egg.png' },
        { id: 'command_block', name: 'Bloco de Comando', path: 'command_block.png' },
        { id: 'barrier', name: 'Barreira', path: 'barrier.png' },
        { id: 'structure_block', name: 'Bloco de Estrutura', path: 'structure_block.png' },
        { id: 'note_block', name: 'Bloco Musical', path: 'note_block.png' },
        { id: 'jukebox', name: 'Jukebox', path: 'jukebox.png' },
        { id: 'dispenser', name: 'Ejetor', path: 'dispenser.png' },
        { id: 'dropper', name: 'Liberador', path: 'dropper.png' },
        { id: 'hopper_outside', name: 'Funil', path: 'hopper_outside.png' },
        { id: 'piston_top_sticky', name: 'Pistão Grudento', path: 'piston_top_sticky.png' },
        { id: 'piston_top', name: 'Pistão', path: 'piston_top.png' },
        { id: 'daylight_detector_top', name: 'Detector de Luz', path: 'daylight_detector_top.png' },
        { id: 'redstone_block', name: 'Bloco de Redstone', path: 'redstone_block.png' },
        { id: 'emerald_block', name: 'Bloco de Esmeralda', path: 'emerald_block.png' },
        { id: 'gold_block', name: 'Bloco de Ouro', path: 'gold_block.png' },
        { id: 'iron_block', name: 'Bloco de Ferro', path: 'iron_block.png' },
        { id: 'diamond_block', name: 'Bloco de Diamante', path: 'diamond_block.png' },
        { id: 'lapis_block', name: 'Bloco de Lápis-Lazúli', path: 'lapis_block.png' },
        { id: 'redstone_lamp_off', name: 'Lâmpada de Redstone Desligada', path: 'redstone_lamp_off.png' },
        { id: 'redstone_lamp_on', name: 'Lâmpada de Redstone Ligada', path: 'redstone_lamp_on.png' },
        { id: 'tripwire_hook', name: 'Gancho de Armadilha', path: 'tripwire_hook.png' },
        { id: 'repeater_off', name: 'Repetidor Desligado', path: 'repeater_off.png' },
        { id: 'comparator_off', name: 'Comparador Desligado', path: 'comparator_off.png' },
        { id: 'tnt_side', name: 'TNT', path: 'tnt_side.png' },
        { id: 'slime_block', name: 'Bloco de Slime', path: 'slime_block.png' },
        { id: 'hay_block_side', name: 'Fardo de Feno', path: 'hay_block_side.png' },
        { id: 'end_rod', name: 'Vara do Fim', path: 'end_rod.png' },
        { id: 'purpur_block', name: 'Bloco de Purpur', path: 'purpur_block.png' },
        { id: 'chorus_flower', name: 'Flor do Coro', path: 'chorus_flower.png' },
        { id: 'chorus_plant', name: 'Planta do Coro', path: 'chorus_plant.png' },
        { id: 'magma_block', name: 'Bloco de Magma', path: 'magma_block.png' },
        { id: 'nether_wart_block', name: 'Bloco de Fungo do Nether', path: 'nether_wart_block.png' },
        { id: 'red_nether_brick', name: 'Tijolo do Nether Vermelho', path: 'red_nether_brick.png' },
        { id: 'bone_block_side', name: 'Bloco de Osso', path: 'bone_block_side.png' },
        { id: 'concrete_black', name: 'Concreto Preto', path: 'concrete_black.png' },
        { id: 'concrete_blue', name: 'Concreto Azul', path: 'concrete_blue.png' },
        { id: 'concrete_brown', name: 'Concreto Marrom', path: 'concrete_brown.png' },
        { id: 'concrete_cyan', name: 'Concreto Ciano', path: 'concrete_cyan.png' },
        { id: 'concrete_gray', name: 'Concreto Cinza', path: 'concrete_gray.png' },
        { id: 'concrete_green', name: 'Concreto Verde', path: 'concrete_green.png' },
        { id: 'concrete_light_blue', name: 'Concreto Azul Claro', path: 'concrete_light_blue.png' },
        { id: 'concrete_lime', name: 'Concreto Verde Limão', path: 'concrete_lime.png' },
        { id: 'concrete_magenta', name: 'Concreto Magenta', path: 'concrete_magenta.png' },
        { id: 'concrete_orange', name: 'Concreto Laranja', path: 'concrete_orange.png' },
        { id: 'concrete_pink', name: 'Concreto Rosa', path: 'concrete_pink.png' },
        { id: 'concrete_purple', name: 'Concreto Roxo', path: 'concrete_purple.png' },
        { id: 'concrete_red', name: 'Concreto Vermelho', path: 'concrete_red.png' },
        { id: 'concrete_silver', name: 'Concreto Cinza Claro', path: 'concrete_silver.png' },
        { id: 'concrete_white', name: 'Concreto Branco', path: 'concrete_white.png' },
        { id: 'concrete_yellow', name: 'Concreto Amarelo', path: 'concrete_yellow.png' },
        { id: 'terracotta', name: 'Terracota', path: 'terracotta.png' },
        { id: 'glazed_terracotta_black', name: 'Terracota Vidrada Preta', path: 'glazed_terracotta_black.png' },
        { id: 'glazed_terracotta_blue', name: 'Terracota Vidrada Azul', path: 'glazed_terracotta_blue.png' },
        { id: 'glazed_terracotta_brown', name: 'Terracota Vidrada Marrom', path: 'glazed_terracotta_brown.png' },
        { id: 'glazed_terracotta_cyan', name: 'Terracota Vidrada Ciano', path: 'glazed_terracotta_cyan.png' },
        { id: 'glazed_terracotta_gray', name: 'Terracota Vidrada Cinza', path: 'glazed_terracotta_gray.png' },
        { id: 'glazed_terracotta_green', name: 'Terracota Vidrada Verde', path: 'glazed_terracotta_green.png' },
        { id: 'glazed_terracotta_light_blue', name: 'Terracota Vidrada Azul Claro', path: 'glazed_terracotta_light_blue.png' },
        { id: 'glazed_terracotta_lime', name: 'Terracota Vidrada Verde Limão', path: 'glazed_terracotta_lime.png' },
        { id: 'glazed_terracotta_magenta', name: 'Terracota Vidrada Magenta', path: 'glazed_terracotta_magenta.png' },
        { id: 'glazed_terracotta_orange', name: 'Terracota Vidrada Laranja', path: 'glazed_terracotta_orange.png' },
        { id: 'glazed_terracotta_pink', name: 'Terracota Vidrada Rosa', path: 'glazed_terracotta_pink.png' },
        { id: 'glazed_terracotta_purple', name: 'Terracota Vidrada Roxa', path: 'glazed_terracotta_purple.png' },
        { id: 'glazed_terracotta_red', name: 'Terracota Vidrada Vermelha', path: 'glazed_terracotta_red.png' },
        { id: 'glazed_terracotta_silver', name: 'Terracota Vidrada Cinza Claro', path: 'glazed_terracotta_silver.png' },
        { id: 'glazed_terracotta_white', name: 'Terracota Vidrada Branca', path: 'glazed_terracotta_white.png' },
        { id: 'glazed_terracotta_yellow', name: 'Terracota Vidrada Amarela', path: 'glazed_terracotta_yellow.png' },
        { id: 'shulker_box', name: 'Caixa de Shulker', path: 'shulker_box.png' },
        { id: 'structure_void', name: 'Vazio de Estrutura', path: 'structure_void.png' },
        { id: 'conduit', name: 'Conduíte', path: 'conduit.png' },
        { id: 'sea_lantern', name: 'Lanterna do Mar', path: 'sea_lantern.png' },
        { id: 'prismarine', name: 'Prismarinho', path: 'prismarine.png' },
        { id: 'dark_prismarine', name: 'Prismarinho Escuro', path: 'dark_prismarine.png' },
        { id: 'prismarine_bricks', name: 'Tijolos de Prismarinho', path: 'prismarine_bricks.png' },
        { id: 'dried_kelp_block', name: 'Bloco de Alga Seca', path: 'dried_kelp_block.png' },
        { id: 'coral_block_brain', name: 'Bloco de Coral Cérebro', path: 'coral_block_brain.png' },
        { id: 'coral_block_bubble', name: 'Bloco de Coral Bolha', path: 'coral_block_bubble.png' },
        { id: 'coral_block_fire', name: 'Bloco de Coral Fogo', path: 'coral_block_fire.png' },
        { id: 'coral_block_horn', name: 'Bloco de Coral Chifre', path: 'coral_block_horn.png' },
        { id: 'coral_block_tube', name: 'Bloco de Coral Tubo', path: 'coral_block_tube.png' },
        { id: 'lectern_top', name: 'Púlpito', path: 'lectern_top.png' },
        { id: 'campfire_top', name: 'Fogueira', path: 'campfire_top.png' },
        { id: 'lantern', name: 'Lanterna', path: 'lantern.png' },
        { id: 'barrel_top', name: 'Barril', path: 'barrel_top.png' },
        { id: 'smithing_table_top', name: 'Mesa de Ferraria', path: 'smithing_table_top.png' },
        { id: 'fletching_table_top', name: 'Mesa de Arquearia', path: 'fletching_table_top.png' },
        { id: 'grindstone_top', name: 'Pedra de Amolar', path: 'grindstone_top.png' },
        { id: 'loom_top', name: 'Tear', path: 'loom_top.png' },
        { id: 'cartography_table_top', name: 'Mesa de Cartografia', path: 'cartography_table_top.png' },
        { id: 'composter_top', name: 'Composteira', path: 'composter_top.png' },
        { id: 'blast_furnace_top', name: 'Fornalha de Explosão', path: 'blast_furnace_top.png' },
        { id: 'smoker_top', name: 'Defumador', path: 'smoker_top.png' },
        { id: 'bell_top', name: 'Sino', path: 'bell_top.png' },
        { id: 'scaffolding_top', name: 'Andaime', path: 'scaffolding_top.png' },
        { id: 'jigsaw', name: 'Bloco de Quebra-Cabeça', path: 'jigsaw.png' },
        { id: 'observer_top', name: 'Observador', path: 'observer_top.png' },
        { id: 'target_side', name: 'Alvo', path: 'target_side.png' },
        { id: 'honey_block_top', name: 'Bloco de Mel', path: 'honey_block_top.png' },
        { id: 'honeycomb_block', name: 'Bloco de Favo de Mel', path: 'honeycomb_block.png' },
        { id: 'crying_obsidian', name: 'Obsidiana Chorosa', path: 'crying_obsidian.png' },
        { id: 'respawn_anchor_top', name: 'Âncora de Reaparecimento', path: 'respawn_anchor_top.png' },
        { id: 'basalt_top', name: 'Basalto', path: 'basalt_top.png' },
        { id: 'polished_basalt_top', name: 'Basalto Polido', path: 'polished_basalt_top.png' },
        { id: 'blackstone', name: 'Pedra Negra', path: 'blackstone.png' },
        { id: 'polished_blackstone', name: 'Pedra Negra Polida', path: 'polished_blackstone.png' },
        { id: 'gilded_blackstone', name: 'Pedra Negra Dourada', path: 'gilded_blackstone.png' },
        { id: 'chiseled_polished_blackstone', name: 'Pedra Negra Polida Ciselada', path: 'chiseled_polished_blackstone.png' },
        { id: 'cracked_polished_blackstone_bricks', name: 'Tijolos de Pedra Negra Rachados', path: 'cracked_polished_blackstone_bricks.png' },
        { id: 'polished_blackstone_bricks', name: 'Tijolos de Pedra Negra Polidos', path: 'polished_blackstone_bricks.png' },
        { id: 'chain', name: 'Corrente', path: 'chain.png' },
        { id: 'warped_stem', name: 'Caule Distorcido', path: 'warped_stem.png' },
        { id: 'crimson_stem', name: 'Caule Carmesim', path: 'crimson_stem.png' },
        { id: 'warped_nylium_side', name: 'Nylium Distorcido', path: 'warped_nylium_side.png' },
        { id: 'crimson_nylium_side', name: 'Nylium Carmesim', path: 'crimson_nylium_side.png' },
        { id: 'warped_wart_block', name: 'Bloco de Fungo Distorcido', path: 'warped_wart_block.png' },
        { id: 'crimson_roots', name: 'Raízes Carmesim', path: 'crimson_roots.png' },
        { id: 'shroomlight', name: 'Coguluz', path: 'shroomlight.png' },
        { id: 'weeping_vines', name: 'Vinhas Choronas', path: 'weeping_vines.png' },
        { id: 'twisting_vines', name: 'Vinhas Retorcidas', path: 'twisting_vines.png' },
        { id: 'soul_soil', name: 'Terra de Almas', path: 'soul_soil.png' },
        { id: 'ancient_debris', name: 'Escombros Antigos', path: 'ancient_debris.png' },
        { id: 'netherite_block', name: 'Bloco de Netherite', path: 'netherite_block.png' },
        { id: 'lodestone', name: 'Pedra de Ímã', path: 'lodestone.png' },
        { id: 'glowing_lichen', name: 'Líquen Luminoso', path: 'glowing_lichen.png' },
        { id: 'deepslate', name: 'Ardósia Escura', path: 'deepslate.png' },
        { id: 'cobbled_deepslate', name: 'Ardósia Escura Rachada', path: 'cobbled_deepslate.png' },
        { id: 'polished_deepslate', name: 'Ardósia Escura Polida', path: 'polished_deepslate.png' },
        { id: 'deepslate_bricks', name: 'Tijolos de Ardósia Escura', path: 'deepslate_bricks.png' },
        { id: 'cracked_deepslate_bricks', name: 'Tijolos de Ardósia Escura Rachados', path: 'cracked_deepslate_bricks.png' },
        { id: 'chiseled_deepslate', name: 'Ardósia Escura Ciselada', path: 'chiseled_deepslate.png' },
        { id: 'tuff', name: 'Tufo', path: 'tuff.png' },
        { id: 'dripstone_block', name: 'Bloco de Pedra Gotejante', path: 'dripstone_block.png' },
        { id: 'pointed_dripstone', name: 'Pedra Gotejante Pontuda', path: 'pointed_dripstone.png' },
        { id: 'moss_block', name: 'Bloco de Musgo', path: 'moss_block.png' },
        { id: 'cave_vines', name: 'Vinhas da Caverna', path: 'cave_vines.png' },
        { id: 'glow_item_frame', name: 'Moldura Brilhante', path: 'glow_item_frame.png' },
        { id: 'azalea', name: 'Azaleia', path: 'azalea.png' },
        { id: 'flowering_azalea', name: 'Azaleia Florescendo', path: 'flowering_azalea.png' },
        { id: 'moss_carpet', name: 'Tapete de Musgo', path: 'moss_carpet.png' },
        { id: 'big_dripleaf_top', name: 'Grande Folha Gotejante', path: 'big_dripleaf_top.png' },
        { id: 'small_dripleaf', name: 'Pequena Folha Gotejante', path: 'small_dripleaf.png' },
        { id: 'spore_blossom', name: 'Flor de Esporos', path: 'spore_blossom.png' },
        { id: 'calcite', name: 'Calcita', path: 'calcite.png' },
        { id: 'smooth_basalt', name: 'Basalto Liso', path: 'smooth_basalt.png' },
        { id: 'amethyst_block', name: 'Bloco de Ametista', path: 'amethyst_block.png' },
        { id: 'budding_amethyst', name: 'Ametista Broto', path: 'budding_amethyst.png' },
        { id: 'lightning_rod', name: 'Para-raios', path: 'lightning_rod.png' },
        { id: 'copper_block', name: 'Bloco de Cobre', path: 'copper_block.png' },
        { id: 'cut_copper', name: 'Cobre Cortado', path: 'cut_copper.png' },
        { id: 'waxed_copper_block', name: 'Bloco de Cobre Encerado', path: 'waxed_copper_block.png' },
        { id: 'waxed_cut_copper', name: 'Cobre Cortado Encerado', path: 'waxed_cut_copper.png' },
        { id: 'oxidized_copper', name: 'Cobre Oxidado', path: 'oxidized_copper.png' },
        { id: 'weathered_copper', name: 'Cobre Envelhecido', path: 'weathered_copper.png' },
        { id: 'exposed_copper', name: 'Cobre Exposto', path: 'exposed_copper.png' },
        { id: 'raw_iron_block', name: 'Bloco de Ferro Bruto', path: 'raw_iron_block.png' },
        { id: 'raw_gold_block', name: 'Bloco de Ouro Bruto', path: 'raw_gold_block.png' },
        { id: 'raw_copper_block', name: 'Bloco de Cobre Bruto', path: 'raw_copper_block.png' }
    ];

    function createPalette() {
        blocks.forEach(block => {
            const paletteBlock = document.createElement('div');
            paletteBlock.classList.add('palette-block');
            paletteBlock.dataset.blockId = block.id;

            const img = document.createElement('img');
            img.classList.add('palette-block-image');
            img.src = `assets/blocks/${block.path}`;
            img.alt = block.name;
            img.draggable = false; // Impede arrastar a imagem

            const nameSpan = document.createElement('span');
            nameSpan.textContent = block.name;

            paletteBlock.appendChild(img);
            paletteBlock.appendChild(nameSpan);
            blockPalette.appendChild(paletteBlock);
        });

        // Seleciona o primeiro bloco por padrão (grama)
        const initialBlock = document.querySelector(`.palette-block[data-block-id="${selectedBlock}"]`);
        if (initialBlock) {
            initialBlock.classList.add('selected');
        }
    }


    // --- Funções de Ferramentas ---
    function selectTool(tool) {
        // Remove a classe 'active' de todos os botões de ferramenta
        document.querySelectorAll('.tool-button').forEach(btn => {
            btn.classList.remove('active');
        });
        // Adiciona a classe 'active' ao botão da ferramenta selecionada
        const selectedToolBtn = document.getElementById(`${tool}Tool`);
        if (selectedToolBtn) {
            selectedToolBtn.classList.add('active');
        }
        activeTool = tool;
        console.log(`Ferramenta selecionada: ${activeTool}`);
    }

    function paintPixel(pixelElement, blockIdToPaint = selectedBlock) {
        if (!pixelElement) return;

        const blockData = blocks.find(b => b.id === blockIdToPaint);
        if (!blockData) return;

        pixelElement.style.backgroundImage = `url(assets/blocks/${blockData.path})`;
        pixelElement.dataset.blockType = blockIdToPaint;

        // Se a ferramenta não for "move" ou "rotate", resetar a rotação do bloco
        if (activeTool !== 'move' && activeTool !== 'rotate') {
            pixelElement.dataset.rotation = 0;
            // Remove todas as classes de rotação do bloco e adiciona a padrão
            pixelElement.classList.remove('block-rotated-0', 'block-rotated-90', 'block-rotated-180', 'block-rotated-270');
            pixelElement.classList.add('block-rotated-0');
        }
    }

    function applyBrush(targetPixel, paintFunction) {
        const targetIndex = parseInt(targetPixel.dataset.index);
        const row = Math.floor(targetIndex / gridSize);
        const col = targetIndex % gridSize;

        const halfBrush = Math.floor(currentBrushSize / 2);

        for (let i = -halfBrush; i < currentBrushSize - halfBrush; i++) {
            for (let j = -halfBrush; j < currentBrushSize - halfBrush; j++) {
                const newRow = row + i;
                const newCol = col + j;

                if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                    const index = newRow * gridSize + newCol;
                    const pixelToPaint = canvasGrid.children[index];
                    if (pixelToPaint) {
                        paintFunction(pixelToPaint);
                    }
                }
            }
        }
    }

    // --- Event Listeners do Canvas ---
    canvasGrid.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        const targetPixel = e.target.closest('.pixel');
        if (targetPixel) {
            if (activeTool === 'pencil') {
                applyBrush(targetPixel, (pixel) => paintPixel(pixel, selectedBlock));
            } else if (activeTool === 'eraser') {
                applyBrush(targetPixel, (pixel) => paintPixel(pixel, 'air'));
            } else if (activeTool === 'fill') {
                // Implementar lógica de "balde de tinta" (flood fill)
                // Por simplicidade, este exemplo não tem flood fill. Apenas pinta o pixel clicado.
                paintPixel(targetPixel, selectedBlock);
            }
        }
    });

    canvasGrid.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        const targetPixel = e.target.closest('.pixel');
        if (targetPixel) {
            if (activeTool === 'pencil') {
                applyBrush(targetPixel, (pixel) => paintPixel(pixel, selectedBlock));
            } else if (activeTool === 'eraser') {
                applyBrush(targetPixel, (pixel) => paintPixel(pixel, 'air'));
            }
        }
    });

    canvasGrid.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    canvasGrid.addEventListener('mouseleave', () => {
        isMouseDown = false;
    });


    // --- Event Listeners da Paleta ---
    blockPalette.addEventListener('click', (e) => {
        const selectedPaletteBlock = e.target.closest('.palette-block');
        if (selectedPaletteBlock) {
            // Remove a classe 'selected' de todos os blocos da paleta
            document.querySelectorAll('.palette-block').forEach(block => {
                block.classList.remove('selected');
            });
            // Adiciona a classe 'selected' ao bloco clicado
            selectedPaletteBlock.classList.add('selected');
            selectedBlock = selectedPaletteBlock.dataset.blockId;
            console.log(`Bloco selecionado: ${selectedBlock}`);
        }
    });


    // --- Event Listeners da Toolbar ---
    pencilToolBtn.addEventListener('click', () => selectTool('pencil'));
    eraserToolBtn.addEventListener('click', () => selectTool('eraser'));
    fillToolBtn.addEventListener('click', () => selectTool('fill'));
    moveToolBtn.addEventListener('click', () => selectTool('move'));
    rotateToolBtn.addEventListener('click', () => selectTool('rotate'));

    brushSizeInput.addEventListener('input', () => {
        currentBrushSize = parseInt(brushSizeInput.value);
        brushSizeValueSpan.textContent = currentBrushSize;
    });

    // --- Funcionalidade da Ferramenta de Mover ---
    let isDragging = false;
    let startX, startY;
    let initialTranslateX = 0;
    let initialTranslateY = 0;

    canvasGrid.addEventListener('mousedown', (e) => {
        if (activeTool === 'move') {
            isDragging = true;
            canvasGrid.style.cursor = 'grabbing';
            startX = e.clientX;
            startY = e.clientY;
            const transformMatrix = window.getComputedStyle(canvasGrid).transform;
            if (transformMatrix !== 'none') {
                const matrix = new DOMMatrixReadOnly(transformMatrix);
                initialTranslateX = matrix.m41;
                initialTranslateY = matrix.m42;
            } else {
                initialTranslateX = 0;
                initialTranslateY = 0;
            }
        }
    });

    canvasGrid.addEventListener('mousemove', (e) => {
        if (activeTool === 'move' && isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            canvasGrid.style.transform = `translate(${initialTranslateX + dx}px, ${initialTranslateY + dy}px) rotate(${rotationAngle}deg)`;
        }
    });

    canvasGrid.addEventListener('mouseup', () => {
        if (activeTool === 'move') {
            isDragging = false;
            canvasGrid.style.cursor = 'grab';
        }
    });

    canvasGrid.addEventListener('mouseleave', () => {
        if (activeTool === 'move') {
            isDragging = false;
            canvasGrid.style.cursor = 'grab';
        }
    });

    // --- Funcionalidade da Ferramenta de Rotacionar ---
    rotateToolBtn.addEventListener('click', () => {
        selectTool('rotate'); // Ativa a ferramenta de rotação
        rotationAngle = (rotationAngle + 90) % 360; // Rotaciona em incrementos de 90 graus
        canvasGrid.style.transform = `rotate(${rotationAngle}deg)`; // Aplica rotação ao grid
        canvasGrid.classList.remove('rotated-0', 'rotated-90', 'rotated-180', 'rotated-270');
        canvasGrid.classList.add(`rotated-${rotationAngle}`);
    
        // Se a ferramenta de rotação estiver ativa e o usuário clicar em um pixel, rotacionar o bloco individualmente
        if (activeTool === 'rotate') {
            canvasGrid.addEventListener('click', handlePixelRotation);
        } else {
            canvasGrid.removeEventListener('click', handlePixelRotation);
        }
    });

    // Função para rotacionar um pixel individualmente (quando a ferramenta 'rotate' está ativa)
    function handlePixelRotation(e) {
        const pixel = e.target.closest('.pixel');
        if (pixel && activeTool === 'rotate') {
            let currentBlockRotation = parseInt(pixel.dataset.rotation || 0);
            currentBlockRotation = (currentBlockRotation + 90) % 360;
            pixel.dataset.rotation = currentBlockRotation;
            
            // Remove todas as classes de rotação antigas e adiciona a nova
            pixel.classList.remove('block-rotated-0', 'block-rotated-90', 'block-rotated-180', 'block-rotated-270');
            pixel.classList.add(`block-rotated-${currentBlockRotation}`);
        }
    }


    // --- Controles Inferiores ---
    clearCanvasBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar toda a tela?')) {
            createGrid(); // Recria o grid, limpando todos os pixels
            rotationAngle = 0; // Reseta a rotação do canvas
            canvasGrid.style.transform = 'rotate(0deg)';
            canvasGrid.classList.remove('rotated-0', 'rotated-90', 'rotated-180', 'rotated-270');
            canvasGrid.classList.add('rotated-0'); // Garante que a classe de 0deg esteja presente

            // Limpa o estado de rotação de todos os blocos individuais
            blockRotationState = {};
            document.querySelectorAll('.pixel').forEach(pixel => {
                pixel.dataset.rotation = 0;
                pixel.classList.remove('block-rotated-0', 'block-rotated-90', 'block-rotated-180', 'block-rotated-270');
                pixel.classList.add('block-rotated-0');
            });
        }
    });

    downloadImageBtn.addEventListener('click', () => {
        // Temporariamente remove a rotação do canvas para o download
        const originalCanvasTransform = canvasGrid.style.transform;
        canvasGrid.style.transform = ''; // Remove a rotação do grid principal para o HTML2Canvas

        // Temporariamente remove as classes de rotação dos pixels para o download
        const originalPixelRotations = [];
        document.querySelectorAll('.pixel').forEach(pixel => {
            const currentRotation = pixel.dataset.rotation || 0;
            originalPixelRotations.push({ pixel, rotation: currentRotation });
            pixel.classList.remove('block-rotated-0', 'block-rotated-90', 'block-rotated-180', 'block-rotated-270');
            pixel.classList.add(`block-rotated-0`); // Define todos para 0deg para o screenshot
        });

        // Use setTimeout para garantir que as alterações de estilo sejam aplicadas antes do screenshot
        setTimeout(() => {
            // Reajusta a escala para o HTML2Canvas, se necessário (pode ser ajustado)
            const scale = 2; // Aumenta a resolução do download
            html2canvas(canvasGrid, {
                scale: scale,
                backgroundColor: null, // Deixa o fundo transparente se o grid não tiver fundo
                useCORS: true // Importante para carregar imagens de outros domínios ou caminhos relativos
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'minecraft_pixel_art.png';
                link.href = canvas.toDataURL('image/png');
                link.click();

                // Restaura a rotação original do canvas
                canvasGrid.style.transform = originalCanvasTransform;

                // Restaura as rotações originais dos pixels
                originalPixelRotations.forEach(({ pixel, rotation }) => {
                    pixel.classList.remove('block-rotated-0', 'block-rotated-90', 'block-rotated-180', 'block-rotated-270');
                    pixel.classList.add(`block-rotated-${rotation}`);
                    pixel.dataset.rotation = rotation;
                });
            });
        }, 50); // Pequeno atraso para o navegador aplicar as mudanças de estilo
    });


    // --- Inicialização ---
    createGrid();
    createPalette();

    // Adiciona o script html2canvas dinamicamente
    const script = document.createElement('script');
    script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    script.onload = () => {
        console.log('html2canvas carregado!');
        // Opcional: Se precisar de alguma lógica que dependa do html2canvas estar carregado, coloque aqui.
    };
    document.head.appendChild(script);
});