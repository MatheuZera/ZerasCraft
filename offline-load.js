const CACHE_NAME = 'zerascraft-offline-v1';
const ASSETS_TO_CACHE = [
    'offline.html',
    'assets/images/geral/icone.png',
    'assets/images/geral/background.png',
    'assets/images/icones/Ícone Banner.png',
    'assets/images/icones/Ícone Baú.png',
    'assets/images/icones/Ícone Castelo.png',
    'assets/images/icones/Ícone Livro.png',
    'assets/images/icones/Icone Opções.png'
];

// Instala o Service Worker e guarda os arquivos essenciais no cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Ativa e limpa caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Intercepta as requisições de rede
self.addEventListener('fetch', (event) => {
    // Apenas gerencia requisições GET
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .catch(() => {
                // Se a rede falhar, tenta buscar no cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    // Se for uma requisição de página HTML e falhar, exibe o offline.html
                    if (event.request.mode === 'navigate') {
                        return caches.match('offline.html');
                    }
                });
            })
    );
});