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

// Variables para el easter egg
const doomButton = document.getElementById('doom-easter-egg');
let gameSelectorVisible = false;

// Función para mostrar el selector de juegos
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
            waitForDosAndRun(() => launchGame(game));

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
  const games = {
    doom: {
      bundleUrl: "https://js-dos.com/cdn/upload/DOOM-@evilution.zip",
      title: "DOOM (1993)"
    },
    wolfenstein: { /* ... */ }
  };

  const selected = games[game];
  if (!selected) return alert('Juego no encontrado');

  const el = document.getElementById('jsdos');
  el.style.display = 'block';

  Dos(el)
    .run(selected.bundleUrl)
    .then(() => console.log(`${selected.title} iniciado`))
    .catch(e => console.error('Error al iniciar:', e));
    
  // Cierre con tecla Escape
  function escHandler(e) {
    if (e.key === 'Escape') {
      el.style.display = 'none';
      document.removeEventListener('keydown', escHandler);
    }
  }
  document.addEventListener('keydown', escHandler);
}

// Evento para el botón de easter egg
doomButton.addEventListener('click', () => {
    if (!gameSelectorVisible) {
        showGameSelector();
    }
});

// Efecto de sonido al hacer clic
doomButton.addEventListener('click', () => {
    try {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-gun-click-1104.mp3');
        audio.volume = 0.3;
        audio.play();
    } catch (e) {
        console.log('Error al reproducir sonido:', e);
    }
});

function waitForDosAndRun(callback) {
  if (typeof Dos === 'undefined') {
    setTimeout(() => waitForDosAndRun(callback), 100);
  } else {
    callback();
  }
}
