// --- Configurações Iniciais ---
const GRID_RESOLUTION_WIDTH = 120; // Largura do grid em células (pixels Minecraft)
const GRID_RESOLUTION_HEIGHT = 50; // Altura do grid em células (pixels Minecraft)

// --- Seleção de Elementos HTML ---
const canvasGrid = document.getElementById('canvasGrid');
const blockPaletteContainer = document.getElementById('blockPalette');
const clearButton = document.getElementById('clearButton');
const downloadButton = document.getElementById('downloadButton');
const brushSizeSlider = document.getElementById('brushSizeSlider');
const brushSizeValueSpan = document.getElementById('brushSizeValue');
const mainContainer = document.querySelector('.paint-container');
const header = document.querySelector('header');
const footer = document.querySelector('footer');
const toolbar = document.querySelector('.toolbar');
const canvasArea = document.querySelector('.canvas-area');
const rotateLeftButton = document.getElementById('rotateLeftButton');
const rotateRightButton = document.getElementById('rotateRightButton');
const rotateBlockButton = document.getElementById('rotateBlockButton');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');

// --- Variáveis de Estado ---
let currentTool = 'block';
let currentBlockId = ''; // Será definido como 'grass_block' na inicialização
let isDrawing = false;
let brushSize = 1;
let actualPixelSize = 1;
let currentCanvasRotation = 0; // 0, 90, 180, 270 (em graus) para o CANVAS
let currentBlockRotations = {}; // { 'blockId': degree, ... } Armazena a rotação de cada bloco

// --- Histórico para Desfazer/Refazer ---
let historyStack = []; // Armazena estados do grid (array de objetos { blockId, blockRotation })
let historyIndex = -1;
const MAX_HISTORY_STATES = 50;

// --- DADOS DOS BLOCOS (NOMES DE ARQUIVO EXATOS e NOMES AMIGÁVEIS) ---
const blockIds = [
    'grass_block',
    'dirt',
    'cobblestone',
    'stone',
    'sand',
    'oak_planks',
    'water',
    'lava',
    'diamond_ore',
    'glass',
    'coral_block',
    // --- NOVOS BLOCOS ADICIONADOS AQUI ---
    'bedrock',
    'bricks',
    'coal_ore',
    'crafting_table',
    'furnace',
    'gold_block',
    'iron_block',
    'log_oak',
    'obsidian',
    'redstone_ore',
    'emerald_ore',
    'spawner',
    'tnt',
    'wool_red',
    'wool_blue',
    'cactus',
    'pumpkin',
    'mushroom_stem',
    'netherrack',
    'end_stone',
    'ice',
    'snow_block',
    'mycelium',
    'soul_sand',
    'glowstone',
    'nether_brick',
    'quartz_ore',
    'magma_block',
    'lapis_ore',
    'bone_block_side',
    'bookshelf',
    'melon',
    'cake',
    'jukebox',
    'note_block',
    'command_block',
    'barrier',
    'structure_block',
    'slime_block',
    'honey_block',
    'sculk_sensor',
    'amethyst_block'
];

const blockNames = {
    'grass_block': 'Grama',
    'dirt': 'Terra',
    'cobblestone': 'Pedregulho',
    'stone': 'Pedra',
    'sand': 'Areia',
    'oak_planks': 'Tábuas Carvalho',
    'water': 'Água',
    'lava': 'Lava',
    'diamond_ore': 'Min. Diamante',
    'glass': 'Vidro',
    'coral_block': 'Coral',
    // --- NOMES DOS NOVOS BLOCOS ---
    'bedrock': 'Rocha Matriz',
    'bricks': 'Tijolos',
    'coal_ore': 'Min. Carvão',
    'crafting_table': 'Bancada',
    'furnace': 'Fornalha',
    'gold_block': 'Bloco Ouro',
    'iron_block': 'Bloco Ferro',
    'log_oak': 'Tronco Carvalho',
    'obsidian': 'Obsidiana',
    'redstone_ore': 'Min. Redstone',
    'emerald_ore': 'Min. Esmeralda',
    'spawner': 'Gerador',
    'tnt': 'TNT',
    'wool_red': 'Lã Vermelha',
    'wool_blue': 'Lã Azul',
    'cactus': 'Cacto',
    'pumpkin': 'Abóbora',
    'mushroom_stem': 'Caule Cog.',
    'netherrack': 'Netherrack',
    'end_stone': 'Pedra Fim',
    'ice': 'Gelo',
    'snow_block': 'Bloco Neve',
    'mycelium': 'Micélio',
    'soul_sand': 'Areia Almas',
    'glowstone': 'Pedra Luminosa',
    'nether_brick': 'Tijolo Nether',
    'quartz_ore': 'Min. Quartzo',
    'magma_block': 'Magma',
    'lapis_ore': 'Min. Lapis',
    'bone_block_side': 'Bloco Osso',
    'bookshelf': 'Estante',
    'melon': 'Melancia',
    'cake': 'Bolo',
    'jukebox': 'Jukebox',
    'note_block': 'Bloco Notas',
    'command_block': 'Bloco Comando',
    'barrier': 'Barreira',
    'structure_block': 'Estrutura',
    'slime_block': 'Slime',
    'honey_block': 'Mel',
    'sculk_sensor': 'Sensor Sculk',
    'amethyst_block': 'Ametista'
};

// --- Mapeamento de IDs para URLs de Imagem Base ---
const blockImageUrls = {};
blockIds.forEach(id => {
    blockImageUrls[id] = `assets/blocks/${id}.png`;
});

// --- Funções Principais ---

/**
 * Inicializa as rotações de todos os blocos para 0 graus.
 */
function initializeBlockRotations() {
    blockIds.forEach(id => {
        currentBlockRotations[id] = 0;
    });
}

/**
 * Pré-carrega todas as imagens de blocos e ferramentas para evitar atrasos visuais.
 */
async function preloadImages() {
    const promises = [];
    const allImageSources = [
        ...blockIds.map(id => blockImageUrls[id]), // Inclui todos os novos IDs de blocos
        'assets/tools/eraser.png', 'assets/tools/fill.png', 'assets/tools/eyedropper.png',
        'assets/tools/square_outline.png', 'assets/tools/circle.png', 'assets/tools/random.png',
        'assets/tools/mega_block.png', 'assets/tools/rotate_left.png', 'assets/tools/rotate_right.png',
        'assets/tools/rotate_block.png',
        'assets/tools/undo.png', 'assets/tools/redo.png',
        'assets/tools/block_icon.png'
    ];

    for (const src of allImageSources) {
        const img = new Image();
        img.src = src;
        promises.push(new Promise((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => {
                console.warn(`AVISO: Falha ao carregar imagem: ${src}. Verifique o caminho e o nome do arquivo.`);
                resolve();
            };
        }));
    }
    await Promise.all(promises);
    console.log('Tentativa de pré-carregamento de todas as imagens concluída.');
}

/**
 * Desativa o modo de desenho (quando o mouse é solto ou sai da área).
 * Salva o estado do grid no histórico para desfazer/refazer.
 */
function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        saveState();
    }
}

/**
 * Calcula o tamanho ideal de cada pixel do grid com base no espaço disponível.
 * Isso garante que o grid se ajuste dinamicamente à tela, incluindo rotação do canvas.
 */
function calculatePixelSize() {
    const headerHeight = header.offsetHeight;
    const footerHeight = footer.offsetHeight;
    const controlsHeight = document.querySelector('.controls').offsetHeight;
    const toolbarWidth = toolbar.offsetWidth;
    const blockPaletteWidth = blockPaletteContainer.offsetWidth;

    const bodyStyle = getComputedStyle(document.body);
    const bodyPaddingVertical = parseFloat(bodyStyle.paddingTop) + parseFloat(bodyStyle.paddingBottom);
    const bodyPaddingHorizontal = parseFloat(bodyStyle.paddingLeft) + parseFloat(bodyStyle.paddingRight);

    const mainStyle = getComputedStyle(mainContainer);
    const mainPaddingVertical = parseFloat(mainStyle.paddingTop) + parseFloat(mainStyle.paddingBottom);
    const mainPaddingHorizontal = parseFloat(mainStyle.paddingLeft) + parseFloat(mainStyle.paddingRight);

    const spacingUnit = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--spacing-unit'));

    let availableContentWidth;
    let availableContentHeight;

    if (window.innerWidth > 900) { // Layout desktop
        availableContentWidth = window.innerWidth
            - bodyPaddingHorizontal
            - mainPaddingHorizontal
            - toolbarWidth
            - blockPaletteWidth
            - (spacingUnit * 2) * 2; // gaps entre toolbar, canvas e paleta

        availableContentHeight = window.innerHeight
            - headerHeight
            - footerHeight
            - controlsHeight
            - bodyPaddingVertical
            - mainPaddingVertical;

    } else { // Layout mobile (flex-direction: column)
        availableContentWidth = window.innerWidth
            - bodyPaddingHorizontal
            - mainPaddingHorizontal
            - (spacingUnit * 2);

        availableContentHeight = window.innerHeight
            - headerHeight
            - footerHeight
            - controlsHeight
            - toolbar.offsetHeight
            - blockPaletteContainer.offsetHeight
            - bodyPaddingVertical
            - mainPaddingVertical
            - (spacingUnit * 2);
    }

    availableContentWidth = Math.max(1, availableContentWidth);
    availableContentHeight = Math.max(1, availableContentHeight);

    // Determinar a dimensão do grid a ser considerada para o cálculo do pixel size
    // Se o canvas estiver rotacionado em 90 ou 270 graus, as dimensões efetivas do grid se invertem
    const effectiveGridWidth = (currentCanvasRotation === 90 || currentCanvasRotation === 270) ? GRID_RESOLUTION_HEIGHT : GRID_RESOLUTION_WIDTH;
    const effectiveGridHeight = (currentCanvasRotation === 90 || currentCanvasRotation === 270) ? GRID_RESOLUTION_WIDTH : GRID_RESOLUTION_HEIGHT;

    const pixelSizeBasedOnWidth = Math.floor(availableContentWidth / effectiveGridWidth);
    const pixelSizeBasedOnHeight = Math.floor(availableContentHeight / effectiveGridHeight);

    actualPixelSize = Math.min(pixelSizeBasedOnWidth, pixelSizeBasedOnHeight);
    actualPixelSize = Math.max(actualPixelSize, 1); // Garante que o pixel size seja pelo menos 1

    // Aplica o tamanho do grid visível no DOM
    canvasGrid.style.width = `${actualPixelSize * GRID_RESOLUTION_WIDTH}px`;
    canvasGrid.style.height = `${actualPixelSize * GRID_RESOLUTION_HEIGHT}px`;

    document.documentElement.style.setProperty('--pixel-size', `${actualPixelSize}px`);
}


/**
 * Cria o grid de divs que representam os pixels do canvas.
 */
function createGrid() {
    canvasGrid.innerHTML = '';
    canvasGrid.style.gridTemplateColumns = `repeat(${GRID_RESOLUTION_WIDTH}, var(--pixel-size))`;
    canvasGrid.style.gridTemplateRows = `repeat(${GRID_RESOLUTION_HEIGHT}, var(--pixel-size))`;

    for (let i = 0; i < GRID_RESOLUTION_WIDTH * GRID_RESOLUTION_HEIGHT; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.dataset.row = Math.floor(i / GRID_RESOLUTION_WIDTH);
        pixel.dataset.col = i % GRID_RESOLUTION_WIDTH;
        pixel.dataset.blockId = ''; // Estado inicial: pixel vazio
        pixel.dataset.blockRotation = 0; // Estado inicial: 0 graus

        canvasGrid.appendChild(pixel);

        pixel.addEventListener('mousedown', (e) => {
            isDrawing = true;
            if (e.button === 0) { // Botão esquerdo do mouse
                applyTool(pixel, currentTool, currentBlockId, brushSize);
            }
        });
        pixel.addEventListener('mouseover', (e) => {
            if (isDrawing && e.buttons === 1) { // Apenas se o botão esquerdo estiver pressionado
                applyTool(pixel, currentTool, currentBlockId, brushSize);
            }
        });
    }
}

/**
 * Popula a paleta de blocos com os blocos definidos.
 */
function populateBlockPalette() {
    blockPaletteContainer.innerHTML = '';

    blockIds.forEach(id => {
        const blockDiv = document.createElement('div');
        blockDiv.classList.add('palette-block');
        blockDiv.dataset.blockId = id;
        blockDiv.title = blockNames[id] || id;

        const blockImage = document.createElement('img');
        blockImage.src = blockImageUrls[id];
        blockImage.alt = blockNames[id] || id;
        blockImage.classList.add('palette-block-image');
        blockImage.style.imageRendering = 'pixelated';
        blockImage.style.width = '48px';
        blockImage.style.height = '48px';

        const blockNameSpan = document.createElement('span');
        blockNameSpan.textContent = blockNames[id];

        blockDiv.appendChild(blockImage);
        blockDiv.appendChild(blockNameSpan);

        // APLICA A ROTAÇÃO DA IMAGEM, NÃO DO CONTÊINER DO BLOCO
        blockImage.style.transform = `rotate(${currentBlockRotations[id] || 0}deg)`;


        blockDiv.addEventListener('click', () => {
            currentBlockId = id;
            currentTool = 'block';
            updateSelectedBlockInPalette(id);
            updateActiveToolButton('blockTool');
            // Atualiza a imagem da ferramenta de bloco com o bloco selecionado e sua rotação
            const blockToolButtonImg = document.getElementById('blockTool').querySelector('img');
            if (blockToolButtonImg) {
                blockToolButtonImg.src = blockImageUrls[currentBlockId];
                blockToolButtonImg.style.transform = `rotate(${currentBlockRotations[currentBlockId]}deg)`;
            }
        });
        blockPaletteContainer.appendChild(blockDiv);
    });

    // Seleciona o primeiro bloco por padrão (grass_block)
    currentBlockId = blockIds[0];
    updateSelectedBlockInPalette(currentBlockId);

    // Atualiza a imagem inicial da ferramenta de bloco
    const blockToolButtonImg = document.getElementById('blockTool').querySelector('img');
    if (blockToolButtonImg) {
        blockToolButtonImg.src = blockImageUrls[currentBlockId];
        blockToolButtonImg.style.transform = `rotate(${currentBlockRotations[currentBlockId]}deg)`;
    }
}


/**
 * Atualiza visualmente qual bloco está selecionado na paleta.
 * @param {string} selectedId - O ID do bloco selecionado.
 */
function updateSelectedBlockInPalette(selectedId) {
    document.querySelectorAll('.palette-block').forEach(block => {
        block.classList.remove('selected');
        if (block.dataset.blockId === selectedId) {
            block.classList.add('selected');
        }
    });
}

/**
 * Atualiza visualmente qual botão de ferramenta está ativo.
 * @param {string} activeButtonId - O ID do botão da ferramenta ativa.
 */
function updateActiveToolButton(activeButtonId) {
    document.querySelectorAll('.tool-button').forEach(button => {
        button.classList.remove('active');
    });
    const activeButton = document.getElementById(activeButtonId);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

/**
 * Aplica a ferramenta selecionada a um pixel.
 * @param {HTMLElement} pixel - O elemento pixel HTML.
 * @param {string} tool - O tipo de ferramenta ('block', 'eraser', 'fill', etc.).
 * @param {string} blockId - O ID do bloco a ser aplicado (se a ferramenta for 'block').
 * @param {number} size - O tamanho do pincel.
 */
function applyTool(pixel, tool, blockId, size) {
    const row = parseInt(pixel.dataset.row);
    const col = parseInt(pixel.dataset.col);

    switch (tool) {
        case 'block':
            drawPixel(row, col, blockId, size, currentBlockRotations[blockId]);
            break;
        case 'eraser':
            drawPixel(row, col, '', size, 0); // Apaga, sem rotação
            break;
        case 'fill':
            fillBucket(row, col, blockId, currentBlockRotations[blockId]);
            break;
        case 'eyedropper':
            const pickedBlockId = pixel.dataset.blockId || blockIds[0];
            currentBlockId = pickedBlockId;
            currentBlockRotations[currentBlockId] = parseInt(pixel.dataset.blockRotation || 0);
            updateSelectedBlockInPalette(currentBlockId);
            updateActiveToolButton('blockTool');
            currentTool = 'block'; // Volta para a ferramenta de bloco
            // Atualiza a imagem da ferramenta de bloco para refletir o bloco pego
            const blockToolButtonImg = document.getElementById('blockTool').querySelector('img');
            if (blockToolButtonImg) {
                blockToolButtonImg.src = blockImageUrls[currentBlockId];
                blockToolButtonImg.style.transform = `rotate(${currentBlockRotations[currentBlockId]}deg)`;
            }
            break;
        case 'square-outline':
            drawShape(row, col, 'square-outline', blockId, size, currentBlockRotations[blockId]);
            break;
        case 'circle':
            drawShape(row, col, 'circle', blockId, size, currentBlockRotations[blockId]);
            break;
        case 'random':
            const randomId = getRandomBlockId();
            drawPixel(row, col, randomId, size, 0); // Blocos aleatórios sem rotação inicial para simplicidade
            break;
        case 'mega-block':
            drawMegaBlock(row, col, blockId, size, currentBlockRotations[blockId]);
            break;
    }
}

/**
 * Desenha um ou mais pixels com o bloco e rotação especificados.
 * @param {number} startRow - Linha do pixel central.
 * @param {number} startCol - Coluna do pixel central.
 * @param {string} blockIdToApply - ID do bloco a ser aplicado.
 * @param {number} size - Tamanho do pincel (raio da área a ser pintada).
 * @param {number} blockRotation - Rotação em graus para o bloco.
 */
function drawPixel(startRow, startCol, blockIdToApply, size, blockRotation) {
    const halfSize = Math.floor(size / 2);

    for (let r = startRow - halfSize; r <= startRow + halfSize; r++) {
        for (let c = startCol - halfSize; c <= startCol + halfSize; c++) {
            if (r >= 0 && r < GRID_RESOLUTION_HEIGHT && c >= 0 && c < GRID_RESOLUTION_WIDTH) {
                const index = r * GRID_RESOLUTION_WIDTH + c;
                const targetPixel = canvasGrid.children[index];
                if (targetPixel) {
                    targetPixel.dataset.blockId = blockIdToApply;
                    targetPixel.dataset.blockRotation = blockRotation;

                    targetPixel.classList.remove('block-rotated-0', 'block-rotated-90', 'block-rotated-180', 'block-rotated-270');

                    if (blockIdToApply) {
                        targetPixel.style.backgroundImage = `url(${blockImageUrls[blockIdToApply]})`;
                        targetPixel.classList.add(`block-rotated-${blockRotation}`);
                    } else {
                        targetPixel.style.backgroundImage = 'none';
                    }
                }
            }
        }
    }
}

/**
 * Preenche uma área contígua com um novo bloco (Flood Fill algorithm).
 * @param {number} startRow - Linha de início.
 * @param {number} startCol - Coluna de início.
 * @param {string} newBlockId - ID do bloco para preencher.
 * @param {number} newBlockRotation - Rotação do bloco para preencher.
 */
function fillBucket(startRow, startCol, newBlockId, newBlockRotation) {
    const initialPixel = canvasGrid.children[startRow * GRID_RESOLUTION_WIDTH + startCol];
    if (!initialPixel) return;

    const targetBlockId = initialPixel.dataset.blockId;
    const targetBlockRotation = parseInt(initialPixel.dataset.blockRotation || 0);

    // Se o targetBlockId e a rotação já forem os mesmos, não há o que preencher
    if (targetBlockId === newBlockId && targetBlockRotation === newBlockRotation) return;

    const queue = [{ r: startRow, c: startCol }];
    const visited = new Set();

    while (queue.length > 0) {
        const { r, c } = queue.shift();
        const key = `${r},${c}`;

        if (r < 0 || r >= GRID_RESOLUTION_HEIGHT || c < 0 || c >= GRID_RESOLUTION_WIDTH || visited.has(key)) {
            continue;
        }

        const currentPixel = canvasGrid.children[r * GRID_RESOLUTION_WIDTH + c];
        // Verifica se o pixel atual corresponde ao bloco e rotação alvo
        if (currentPixel && currentPixel.dataset.blockId === targetBlockId &&
            parseInt(currentPixel.dataset.blockRotation || 0) === targetBlockRotation) {

            currentPixel.dataset.blockId = newBlockId;
            currentPixel.dataset.blockRotation = newBlockRotation;

            currentPixel.classList.remove('block-rotated-0', 'block-rotated-90', 'block-rotated-180', 'block-rotated-270');

            if (newBlockId) {
                currentPixel.style.backgroundImage = `url(${blockImageUrls[newBlockId]})`;
                currentPixel.classList.add(`block-rotated-${newBlockRotation}`);
            } else {
                currentPixel.style.backgroundImage = 'none';
            }
            visited.add(key);

            queue.push({ r: r + 1, c: c });
            queue.push({ r: r - 1, c: c });
            queue.push({ r: r, c: c + 1 });
            queue.push({ r: r, c: c - 1 });
        }
    }
    saveState();
}

/**
 * Desenha formas geométricas (contorno quadrado, círculo).
 * @param {number} startRow - Linha do centro da forma.
 * @param {number} startCol - Coluna do centro da forma.
 * @param {string} shapeType - Tipo da forma ('square-outline', 'circle').
 * @param {string} blockIdToApply - ID do bloco para a forma.
 * @param {number} size - Tamanho da forma (raio/dimensão).
 * @param {number} blockRotation - Rotação do bloco.
 */
function drawShape(startRow, startCol, shapeType, blockIdToApply, size, blockRotation) {
    const halfSize = Math.floor(size / 2);

    const pixelsToDraw = [];

    if (shapeType === 'square-outline') {
        for (let r = startRow - halfSize; r <= startRow + halfSize; r++) {
            for (let c = startCol - halfSize; c <= startCol + halfSize; c++) {
                if (r >= 0 && r < GRID_RESOLUTION_HEIGHT && c >= 0 && c < GRID_RESOLUTION_WIDTH) {
                    if (r === startRow - halfSize || r === startRow + halfSize ||
                        c === startCol - halfSize || c === startCol + halfSize) {
                        pixelsToDraw.push({ r, c });
                    }
                }
            }
        }
    } else if (shapeType === 'circle') {
        const centerX = startCol;
        const centerY = startRow;
        const radius = halfSize;

        for (let r = centerY - radius; r <= centerY + radius; r++) {
            for (let c = centerX - radius; c <= centerX + radius; c++) {
                if (r >= 0 && r < GRID_RESOLUTION_HEIGHT && c >= 0 && c < GRID_RESOLUTION_WIDTH) {
                    const dist = Math.sqrt(Math.pow(c - centerX, 2) + Math.pow(r - centerY, 2));
                    if (dist >= radius - 1 && dist <= radius + 1) { // Desenha o contorno do círculo
                        pixelsToDraw.push({ r, c });
                    }
                }
            }
        }
    }

    pixelsToDraw.forEach(({ r, c }) => {
        const index = r * GRID_RESOLUTION_WIDTH + c;
        const targetPixel = canvasGrid.children[index];
        if (targetPixel) {
            targetPixel.dataset.blockId = blockIdToApply;
            targetPixel.dataset.blockRotation = blockRotation;
            targetPixel.classList.remove('block-rotated-0', 'block-rotated-90', 'block-rotated-180', 'block-rotated-270');
            if (blockIdToApply) {
                targetPixel.style.backgroundImage = `url(${blockImageUrls[blockIdToApply]})`;
                targetPixel.classList.add(`block-rotated-${blockRotation}`);
            } else {
                targetPixel.style.backgroundImage = 'none';
            }
        }
    });
    saveState();
}

/**
 * Retorna um ID de bloco aleatório da lista de blocos disponíveis.
 * @returns {string} ID de um bloco aleatório.
 */
function getRandomBlockId() {
    const randomIndex = Math.floor(Math.random() * blockIds.length);
    return blockIds[randomIndex];
}

/**
 * Desenha um "mega bloco" (bloco maior que 1x1, conforme o brushSize).
 * @param {number} startRow - Linha de início do bloco.
 * @param {number} startCol - Coluna de início do bloco.
 * @param {string} blockIdToApply - ID do bloco a ser aplicado.
 * @param {number} size - Dimensão do mega bloco (ex: 2 para 2x2, 3 para 3x3).
 * @param {number} blockRotation - Rotação do bloco.
 */
function drawMegaBlock(startRow, startCol, blockIdToApply, size, blockRotation) {
    for (let r = startRow; r < startRow + size; r++) {
        for (let c = startCol; c < startCol + size; c++) {
            if (r >= 0 && r < GRID_RESOLUTION_HEIGHT && c >= 0 && c < GRID_RESOLUTION_WIDTH) {
                const index = r * GRID_RESOLUTION_WIDTH + c;
                const targetPixel = canvasGrid.children[index];
                if (targetPixel) {
                    targetPixel.dataset.blockId = blockIdToApply;
                    targetPixel.dataset.blockRotation = blockRotation;
                    targetPixel.classList.remove('block-rotated-0', 'block-rotated-90', 'block-rotated-180', 'block-rotated-270');
                    if (blockIdToApply) {
                        targetPixel.style.backgroundImage = `url(${blockImageUrls[blockIdToApply]})`;
                        targetPixel.classList.add(`block-rotated-${blockRotation}`);
                    } else {
                        targetPixel.style.backgroundImage = 'none';
                    }
                }
            }
        }
    }
    saveState();
}

/**
 * Limpa todo o grid, removendo todos os blocos.
 */
function clearGrid() {
    if (confirm('Tem certeza que deseja limpar todo o desenho?')) {
        Array.from(canvasGrid.children).forEach(pixel => {
            pixel.dataset.blockId = '';
            pixel.dataset.blockRotation = 0;
            pixel.style.backgroundImage = 'none';
            pixel.classList.remove('block-rotated-0', 'block-rotated-90', 'block-rotated-180', 'block-rotated-270');
        });
        saveState();
    }
}

/**
 * Baixa o conteúdo do grid como uma imagem PNG.
 * As rotações individuais dos blocos e a rotação do canvas são consideradas.
 */
function downloadImage() {
    const tempCanvas = document.createElement('canvas');
    const exportPixelSize = 16;
    const tempCanvasWidth = GRID_RESOLUTION_WIDTH * exportPixelSize;
    const tempCanvasHeight = GRID_RESOLUTION_HEIGHT * exportPixelSize;

    tempCanvas.width = tempCanvasWidth;
    tempCanvas.height = tempCanvasHeight;
    const ctx = tempCanvas.getContext('2d');

    ctx.fillStyle = '#202020';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(`Falha ao carregar imagem para download: ${src}`);
            img.src = src;
        });
    };

    const drawPromises = [];
    Array.from(canvasGrid.children).forEach(pixel => {
        const blockId = pixel.dataset.blockId;
        const blockRotation = parseInt(pixel.dataset.blockRotation || 0);
        if (blockId) {
            const row = parseInt(pixel.dataset.row);
            const col = parseInt(pixel.dataset.col);
            const imageUrl = blockImageUrls[blockId];

            drawPromises.push(
                loadImage(imageUrl).then(img => {
                    ctx.save();
                    ctx.translate(col * exportPixelSize + exportPixelSize / 2, row * exportPixelSize + exportPixelSize / 2);
                    ctx.rotate(blockRotation * Math.PI / 180);
                    ctx.drawImage(img, -exportPixelSize / 2, -exportPixelSize / 2, exportPixelSize, exportPixelSize);
                    ctx.restore();
                }).catch(error => {
                    console.error(error);
                })
            );
        }
    });

    Promise.all(drawPromises).then(() => {
        const finalCanvas = document.createElement('canvas');
        let rotatedWidth = tempCanvasWidth;
        let rotatedHeight = tempCanvasHeight;

        if (currentCanvasRotation === 90 || currentCanvasRotation === 270) {
            rotatedWidth = tempCanvasHeight;
            rotatedHeight = tempCanvasWidth;
        }

        finalCanvas.width = rotatedWidth;
        finalCanvas.height = rotatedHeight;
        const finalCtx = finalCanvas.getContext('2d');

        finalCtx.save();
        finalCtx.translate(finalCanvas.width / 2, finalCanvas.height / 2);
        finalCtx.rotate(currentCanvasRotation * Math.PI / 180);
        finalCtx.drawImage(tempCanvas, -tempCanvasWidth / 2, -tempCanvasHeight / 2);
        finalCtx.restore();

        const dataURL = finalCanvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = 'minecraft_pixel_art.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }).catch(error => {
        console.error('Erro geral ao gerar imagem para download:', error);
    });
}

/**
 * Salva o estado atual do grid no histórico. Cada pixel armazena seu blockId e blockRotation.
 */
function saveState() {
    if (historyIndex < historyStack.length - 1) {
        historyStack = historyStack.slice(0, historyIndex + 1);
    }

    const currentState = Array.from(canvasGrid.children).map(pixel => ({
        blockId: pixel.dataset.blockId,
        blockRotation: parseInt(pixel.dataset.blockRotation || 0)
    }));

    if (historyStack.length > 0 && JSON.stringify(currentState) === JSON.stringify(historyStack[historyIndex])) {
        return;
    }

    historyStack.push(currentState);
    historyIndex = historyStack.length - 1;

    if (historyStack.length > MAX_HISTORY_STATES) {
        historyStack.shift();
        historyIndex--;
    }
    updateHistoryButtons();
}

/**
 * Desfaz a última ação.
 */
function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        restoreState(historyStack[historyIndex]);
    }
    updateHistoryButtons();
}

/**
 * Refaz a última ação desfeita.
 */
function redo() {
    if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        restoreState(historyStack[historyIndex]);
    }
    updateHistoryButtons();
}

/**
 * Restaura o grid para um estado salvo específico, aplicando blockId e blockRotation.
 * @param {Array<object>} state - Um array de objetos { blockId, blockRotation } representando o estado.
 */
function restoreState(state) {
    Array.from(canvasGrid.children).forEach((pixel, index) => {
        const { blockId, blockRotation } = state[index];
        pixel.dataset.blockId = blockId;
        pixel.dataset.blockRotation = blockRotation;

        pixel.classList.remove('block-rotated-0', 'block-rotated-90', 'block-rotated-180', 'block-rotated-270');

        if (blockId) {
            pixel.style.backgroundImage = `url(${blockImageUrls[blockId]})`;
            pixel.classList.add(`block-rotated-${blockRotation}`);
        } else {
            pixel.style.backgroundImage = 'none';
        }
    });
}

/**
 * Rotaciona o canvas (o grid inteiro).
 * @param {string} direction - 'left' para girar 90 graus para a esquerda, 'right' para 90 graus para a direita.
 */
function rotateCanvas(direction) {
    if (direction === 'left') {
        currentCanvasRotation = (currentCanvasRotation - 90 + 360) % 360;
    } else if (direction === 'right') {
        currentCanvasRotation = (currentCanvasRotation + 90) % 360;
    }
    canvasGrid.className = `rotated-${currentCanvasRotation}`;

    calculatePixelSize();
    restoreState(historyStack[historyIndex]);
}

/**
 * Rotaciona o bloco atualmente selecionado.
 */
function rotateCurrentBlock() {
    if (!currentBlockId) {
        alert('Selecione um bloco na paleta primeiro para rotacioná-lo.');
        return;
    }

    currentBlockRotations[currentBlockId] = (currentBlockRotations[currentBlockId] + 90) % 360;

    // Atualiza a visualização do bloco na paleta
    const paletteBlock = document.querySelector(`.palette-block[data-block-id="${currentBlockId}"]`);
    if (paletteBlock) {
        const paletteBlockImage = paletteBlock.querySelector('.palette-block-image');
        if (paletteBlockImage) {
            // APLICA A ROTAÇÃO APENAS NA IMAGEM, NÃO NO BLOCO INTEIRO
            paletteBlockImage.style.transform = `rotate(${currentBlockRotations[currentBlockId]}deg)`;
        }
    }

    const blockToolButtonImg = document.getElementById('blockTool').querySelector('img');
    if (currentTool === 'block' && blockToolButtonImg) {
        blockToolButtonImg.style.transform = `rotate(${currentBlockRotations[currentBlockId]}deg)`;
    }
    console.log(`Bloco ${currentBlockId} rotacionado para ${currentBlockRotations[currentBlockId]} graus.`);
}

/**
 * Atualiza o estado habilitado/desabilitado dos botões Desfazer/Refazer.
 */
function updateHistoryButtons() {
    undoButton.disabled = historyIndex <= 0;
    redoButton.disabled = historyIndex >= historyStack.length - 1;
}


// --- Event Listeners ---

document.addEventListener('mouseup', stopDrawing);

// Event Listeners para botões da Toolbar
document.getElementById('blockTool').addEventListener('click', () => {
    currentTool = 'block';
    updateActiveToolButton('blockTool');
    updateSelectedBlockInPalette(currentBlockId);
    const blockToolButtonImg = document.getElementById('blockTool').querySelector('img');
    if (blockToolButtonImg) {
        blockToolButtonImg.src = blockImageUrls[currentBlockId];
        blockToolButtonImg.style.transform = `rotate(${currentBlockRotations[currentBlockId]}deg)`;
    }
});
document.getElementById('eraserTool').addEventListener('click', () => {
    currentTool = 'eraser';
    updateActiveToolButton('eraserTool');
    updateSelectedBlockInPalette('');
    const blockToolButtonImg = document.getElementById('blockTool').querySelector('img');
    if (blockToolButtonImg) {
        blockToolButtonImg.src = 'assets/tools/block_icon.png';
        blockToolButtonImg.style.transform = 'rotate(0deg)';
    }
});
document.getElementById('fillTool').addEventListener('click', () => {
    currentTool = 'fill';
    updateActiveToolButton('fillTool');
});
document.getElementById('eyedropperTool').addEventListener('click', () => {
    currentTool = 'eyedropper';
    updateActiveToolButton('eyedropperTool');
});
document.getElementById('squareOutlineTool').addEventListener('click', () => {
    currentTool = 'square-outline';
    updateActiveToolButton('squareOutlineTool');
});
document.getElementById('circleTool').addEventListener('click', () => {
    currentTool = 'circle';
    updateActiveToolButton('circleTool');
});
document.getElementById('randomTool').addEventListener('click', () => {
    currentTool = 'random';
    updateActiveToolButton('randomTool');
});
document.getElementById('megaBlockTool').addEventListener('click', () => {
    currentTool = 'mega-block';
    updateActiveToolButton('megaBlockTool');
});

// Event Listeners para botões de Rotação de CANVAS
rotateLeftButton.addEventListener('click', () => rotateCanvas('left'));
rotateRightButton.addEventListener('click', () => rotateCanvas('right'));

// Event Listener para o botão de Rotação de BLOCO
rotateBlockButton.addEventListener('click', rotateCurrentBlock);

// Event Listener para o Slider de Tamanho do Pincel
brushSizeSlider.addEventListener('input', (e) => {
    brushSize = parseInt(e.target.value);
    brushSizeValueSpan.textContent = brushSize;
});

// Event Listeners para botões de Controle Inferiores
clearButton.addEventListener('click', clearGrid);
downloadButton.addEventListener('click', downloadImage);

// Event Listeners para botões de Desfazer/Refazer
undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);

// Event Listener para redimensionamento da janela
window.addEventListener('resize', () => {
    calculatePixelSize();
    restoreState(historyStack[historyIndex]);
});


// --- Inicialização do Aplicativo ---
document.addEventListener('DOMContentLoaded', async () => {
    initializeBlockRotations();
    await preloadImages();
    populateBlockPalette();
    calculatePixelSize();
    createGrid();
    saveState();
    updateHistoryButtons();
});