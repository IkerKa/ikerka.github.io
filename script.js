// Efecto smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Formulario de contacto
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('¡Gracias por tu mensaje! Te responderé pronto.');
    contactForm.reset();
});

// Variables para el easter egg
const doomButton = document.getElementById('doom-easter-egg');
let gameSelectorVisible = false;

// Función para mostrar el selector de juegos
function showGameSelector() {
    if (gameSelectorVisible) return;

    gameSelectorVisible = true;

    // Crear contenedor del selector
    const gameSelector = document.createElement('div');
    gameSelector.id = 'game-selector';
    gameSelector.innerHTML = `
                <h2 class="game-selector-title">¿Qué juego clásico quieres jugar?</h2>
                <div class="games-container">
                    <div class="game-card" data-game="doom">
                        <img src="https://upload.wikimedia.org/wikipedia/en/5/57/Doom_cover_art.jpg" alt="DOOM" class="game-image">
                        <div class="game-title">DOOM (1993)</div>
                    </div>
                    <div class="game-card" data-game="wolfenstein">
                        <img src="https://upload.wikimedia.org/wikipedia/en/8/8f/Wolfenstein-3d.jpg" alt="Wolfenstein 3D" class="game-image">
                        <div class="game-title">Wolfenstein 3D</div>
                    </div>
                </div>
                <button class="close-selector">X</button>
            `;

    document.body.appendChild(gameSelector);

    // Agregar eventos a las tarjetas de juego
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function () {
            const game = this.getAttribute('data-game');
            launchGame(game);
            gameSelectorVisible = false;
            document.body.removeChild(gameSelector);
        });
    });

    // Botón para cerrar
    document.querySelector('.close-selector').addEventListener('click', () => {
        document.body.removeChild(gameSelector);
        gameSelectorVisible = false;
    });

    // Cerrar con ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.body.removeChild(gameSelector);
            gameSelectorVisible = false;
        }
    });
}

// Función para lanzar el juego seleccionado
function launchGame(game) {
    const games = {
        doom: [
            'https://archive.org/embed/msdos_Doom_1993',
            'https://dos.zone/doom/',
            'https://playclassic.games/games/first-person-shooter-dos-games-online/play-doom-online/'
        ],
        wolfenstein: [
            'https://archive.org/embed/msdos_Wolfenstein_3D_1992',
            'https://dos.zone/wolfenstein-3d/',
            'https://playclassic.games/games/first-person-shooter-dos-games-online/play-wolfenstein-3d-online/'
        ]
    };

    // Intentar cargar el primer enlace disponible
    const gameUrls = games[game];
    let currentUrlIndex = 0;

    function tryLoadGame() {
        if (currentUrlIndex >= gameUrls.length) {
            alert('Lo siento, no se pudo cargar el juego. Inténtalo más tarde.');
            return;
        }

        const gameFrame = document.createElement('iframe');
        gameFrame.src = gameUrls[currentUrlIndex];
        gameFrame.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
            z-index: 9998;
        `;

        // Manejar errores al cargar el iframe
        gameFrame.onerror = function() {
            console.log(`Error al cargar ${gameUrls[currentUrlIndex]}, intentando siguiente...`);
            document.body.removeChild(gameFrame);
            currentUrlIndex++;
            tryLoadGame();
        };

        document.body.appendChild(gameFrame);

        // Crear botón de cierre
        const closeBtn = document.createElement('button');
        closeBtn.innerText = '✕';
        closeBtn.style.cssText = `
            position: fixed;
            top: 15px;
            right: 15px;
            z-index: 10000;
            background: #ff0000;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-weight: bold;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        `;

        closeBtn.title = 'Cerrar juego (ESC)';
        document.body.appendChild(closeBtn);

        function closeGame() {
            if (document.body.contains(gameFrame)) {
                document.body.removeChild(gameFrame);
            }
            if (document.body.contains(closeBtn)) {
                document.body.removeChild(closeBtn);
            }
            document.removeEventListener('keydown', handleKeydown);
        }

        function handleKeydown(e) {
            if (e.key === 'Escape') {
                closeGame();
            }
        }

        closeBtn.addEventListener('click', closeGame);
        document.addEventListener('keydown', handleKeydown);
    }

    tryLoadGame();
}

// Evento para el botón de easter egg
doomButton.addEventListener('click', () => {
    if (!gameSelectorVisible) {
        showGameSelector();
    }
});

// Efecto de sonido al hacer clic (opcional)
doomButton.addEventListener('click', () => {
    try {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-gun-click-1104.mp3');
        audio.volume = 0.3;
        audio.play();
    } catch (e) {
        console.log('Error al reproducir sonido:', e);
    }
});