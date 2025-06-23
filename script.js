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
        doom: {
            url: "https://js-dos.com/cdn/upload/DOOM-@evilution.zip",
            exe: "./DOOM/DOOM.EXE",
            title: "DOOM (1993)"
        },
        wolfenstein: {
            url: "https://js-dos.com/cdn/upload/Wolfenstein3D-@evilution.zip",
            exe: "./WOLF3D/WOLF3D.EXE",
            title: "Wolfenstein 3D"
        }
    };

    const selectedGame = games[game];
    if (!selectedGame) {
        alert('Juego no encontrado');
        return;
    }

    // Crear contenedor del juego
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    gameContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 9998;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `;

    // Crear canvas para DOSBox
    const dosboxCanvas = document.createElement('canvas');
    dosboxCanvas.id = 'dosbox';
    dosboxCanvas.style.cssText = `
        width: 80%;
        height: 80%;
        border: 2px solid #333;
        background: #000;
    `;

    // Mensaje de carga
    const loadingMsg = document.createElement('div');
    loadingMsg.innerText = `Cargando ${selectedGame.title}...`;
    loadingMsg.style.cssText = `
        color: white;
        font-size: 18px;
        margin-bottom: 20px;
        font-family: Arial, sans-serif;
    `;

    gameContainer.appendChild(loadingMsg);
    gameContainer.appendChild(dosboxCanvas);
    document.body.appendChild(gameContainer);

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

    // Función para cerrar el juego
    function closeGame() {
        if (window.currentDosbox) {
            try {
                window.currentDosbox.stop();
            } catch (e) {
                console.log('Error al detener DOSBox:', e);
            }
            window.currentDosbox = null;
        }
        if (document.body.contains(gameContainer)) {
            document.body.removeChild(gameContainer);
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

    // Verificar si js-dos está disponible
    if (typeof Dosbox === 'undefined') {
        loadingMsg.innerText = 'Error: js-dos no está cargado. Cargando librería...';
        
        // Cargar js-dos dinámicamente
        const script = document.createElement('script');
        script.src = 'https://js-dos.com/cdn/js-dos-api.js';
        script.onload = function() {
            initDosbox();
        };
        script.onerror = function() {
            loadingMsg.innerText = 'Error al cargar js-dos. Usando método alternativo...';
            // Fallback a iframe si js-dos no se puede cargar
            fallbackToIframe();
        };
        document.head.appendChild(script);
    } else {
        initDosbox();
    }

    function initDosbox() {
        try {
            loadingMsg.innerText = `Iniciando ${selectedGame.title}...`;
            
            window.currentDosbox = new Dosbox({
                id: "dosbox",
                onload: function (dosbox) {
                    loadingMsg.innerText = `Ejecutando ${selectedGame.title}...`;
                    dosbox.run(selectedGame.url, selectedGame.exe);
                },
                onrun: function (dosbox, app) {
                    console.log("App '" + app + "' is running");
                    loadingMsg.style.display = 'none';
                },
                onerror: function(error) {
                    console.error('Error en DOSBox:', error);
                    loadingMsg.innerText = 'Error al cargar el juego. Intentando método alternativo...';
                    fallbackToIframe();
                }
            });
        } catch (error) {
            console.error('Error al crear DOSBox:', error);
            fallbackToIframe();
        }
    }

    function fallbackToIframe() {
        // Fallback a los enlaces originales si js-dos falla
        const fallbackUrls = {
            doom: 'https://archive.org/embed/msdos_Doom_1993',
            wolfenstein: 'https://archive.org/embed/msdos_Wolfenstein_3D_1992'
        };
        
        dosboxCanvas.style.display = 'none';
        loadingMsg.innerText = 'Cargando con método alternativo...';
        
        const iframe = document.createElement('iframe');
        iframe.src = fallbackUrls[game];
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
        `;
        
        gameContainer.appendChild(iframe);
        loadingMsg.style.display = 'none';
    }
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