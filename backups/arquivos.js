// Base de dados simulada
const archiveDB = {
    'mod-fps': { title: "FPS BOOST ULTRA", desc: "Reduz o consumo de memória e otimiza texturas.", size: "12MB", ver: "1.20" },
    'map-spawn': { title: "SPAWN LOBBY", desc: "Mapa completo pronto para servidores.", size: "45MB", ver: "Final" }
};

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('archiveSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.file-card');

    // --- LÓGICA DE BUSCA ---
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        cards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            card.style.display = title.includes(term) ? 'flex' : 'none';
        });
    });

    // --- LÓGICA DE FILTROS ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Estética dos botões
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            cards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// --- LÓGICA DO MODAL ---
function openFileModal(id) {
    const data = archiveDB[id];
    const modal = document.getElementById('fileModal');
    const body = document.getElementById('modalBody');

    if (data) {
        body.innerHTML = `
            <div style="padding: 40px;">
                <h2 style="color:var(--mc-green); margin-bottom:10px">${data.title}</h2>
                <p style="color:#888; margin-bottom:20px">${data.desc}</p>
                <div style="background:#111; padding:15px; border:1px solid #222; margin-bottom:20px">
                    <small>VERSÃO: ${data.ver} | TAMANHO: ${data.size}</small>
                </div>
                <button class="btn-action" style="background:var(--mc-green); color:#000">BAIXAR ARQUIVO</button>
            </div>
        `;
        modal.style.display = 'flex';
    }
}

function closeFileModal() {
    document.getElementById('fileModal').style.display = 'none';
}