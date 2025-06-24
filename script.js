// Efecto smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Formulario de contacto
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('¡Gracias por tu mensaje! Te responderé pronto.');
    contactForm.reset();
});
const doomButton = document.getElementById('doom-easter-egg');
let gameSelectorVisible = false;
let dosInstance = null; // Track the running game instance

function showGameSelector() {
    if (gameSelectorVisible) return;
    gameSelectorVisible = true;

    const gameSelector = document.createElement('div');
    gameSelector.id = 'game-selector';
    gameSelector.innerHTML = `
        <h2 class="game-selector-title">¿Qué juego clásico quieres jugar?</h2>
        <div class="games-container">
            <div class="game-card" data-game="doom">
                <img src="https://js-dos.com/cdn/images/doom.png" alt="DOOM" class="game-image">
                <div class="game-title">DOOM (1993)</div>
            </div>
            <div class="game-card" data-game="wolfenstein">
                <img src="https://js-dos.com/cdn/images/wolf3d.png" alt="Wolfenstein 3D" class="game-image">
                <div class="game-title">Wolfenstein 3D</div>
            </div>
        </div>
        <button class="close-selector">X</button>
    `;

    document.body.appendChild(gameSelector);

    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function() {
            const game = this.getAttribute('data-game');
            launchGame(game);
            document.body.removeChild(gameSelector);
            gameSelectorVisible = false;
        });
    });

    document.querySelector('.close-selector').addEventListener('click', () => {
        document.body.removeChild(gameSelector);
        gameSelectorVisible = false;
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(gameSelector);
            gameSelectorVisible = false;
        }
    });
}

function launchGame(game) {
    // Close any existing game instance
    if (dosInstance) {
        dosInstance.stop();
        dosInstance = null;
    }

    const games = {
        doom: {
            bundleUrl: "https://cdn.jsdelivr.net/gh/doszone/doom@master/DOOM.zip",
            title: "DOOM (1993)"
        },
        wolfenstein: {
            bundleUrl: "https://cdn.jsdelivr.net/gh/doszone/wolfenstein3d@master/Wolfenstein3D.zip",
            title: "Wolfenstein 3D"
        }
    };

    const selected = games[game];
    if (!selected) return;

    const container = document.getElementById('jsdos');
    container.style.display = 'block';
    container.innerHTML = ''; // Clear previous content

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    closeBtn.classList.add('close-selector');
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.zIndex = '10001';
    closeBtn.addEventListener('click', closeGame);
    container.appendChild(closeBtn);

    // Create canvas for the game
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    // Initialize js-dos
    dosInstance = Dos(canvas, {
        wdosboxUrl: "https://js-dos.com/7.4.0/wdosbox.js",
        autolock: true,
        onerror: console.error,
        onprogress: console.log
    });

    dosInstance.run(selected.bundleUrl)
        .then(() => console.log(`${selected.title} started`))
        .catch(e => console.error('Error starting game:', e));

    function closeGame() {
        if (dosInstance) {
            dosInstance.stop();
            dosInstance = null;
        }
        container.style.display = 'none';
        document.removeEventListener('keydown', escHandler);
    }

    function escHandler(e) {
        if (e.key === 'Escape') {
            closeGame();
        }
    }

    document.addEventListener('keydown', escHandler);
}

// Easter egg button event
doomButton.addEventListener('click', () => {
    if (!gameSelectorVisible) {
        showGameSelector();
    }
});

// Sound effect
doomButton.addEventListener('click', () => {
    try {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-gun-click-1104.mp3');
        audio.volume = 0.3;
        audio.play();
    } catch (e) {
        console.log('Error playing sound:', e);
    }
});