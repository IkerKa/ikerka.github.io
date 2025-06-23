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
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('¡Gracias por tu mensaje! Te responderé pronto.');
    contactForm.reset();
});

// En tu script.js
const doomButton = document.getElementById('doom-easter-egg');
let doomInitialized = false;

doomButton.addEventListener('click', () => {
  if (!doomInitialized) {
    try {
      initSimpleDoom();
    } catch (e) {
        console.error('Error initializing DOOM:', e);
        alert('No se pudo cargar la sorpresa. Inténtalo de nuevo más tarde.');
    }
    doomInitialized = true;
  }
});

// function initDoom() {
//   // Crear contenedor para DOOM
//   const doomContainer = document.createElement('div');
//   doomContainer.id = 'doom-container';
//   doomContainer.style.cssText = `
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     z-index: 9998;
//     background: black;
//   `;
  
//   // Botón para cerrar
//   const closeBtn = document.createElement('button');
//   closeBtn.innerText = 'X';
//   closeBtn.style.cssText = `
//     position: absolute;
//     top: 15px;
//     right: 15px;
//     z-index: 10000;
//     background: #ff0000;
//     color: white;
//     border: none;
//     width: 40px;
//     height: 40px;
//     border-radius: 50%;
//     font-weight: bold;
//     cursor: pointer;
//   `;
  
//   document.body.appendChild(doomContainer);
//   doomContainer.appendChild(closeBtn);
  
//   // Cargar js-dos
//   const script = document.createElement('script');
//   script.src = 'https://js-dos.com/6.22/current/js-dos.js';
//   script.onload = () => {
//     Dos(doomContainer, {
//       wdosboxUrl: 'https://js-dos.com/6.22/current/wdosbox.js',
//       cycles: 1000,
//       autolock: true,
//     }).ready((fs, main) => {
//       // Descargar y ejecutar DOOM
//       fs.extract('https://js-dos.com/6.22/current/test/dos/doom.zip').then(() => {
//         main(['-c', 'DOOM.EXE']);
//       });
//     });
//   };
  
//   document.head.appendChild(script);
  
//   // Cerrar DOOM
//   closeBtn.addEventListener('click', () => {
//     document.body.removeChild(doomContainer);
//     doomInitialized = false;
//   });
  
//   // Cerrar con ESC
//   document.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape') {
//       document.body.removeChild(doomContainer);
//       doomInitialized = false;
//     }
//   });
// }

function initSimpleDoom() {
  const doomFrame = document.createElement('iframe');
  doomFrame.src = 'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos?anonymous=1';
  doomFrame.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    z-index: 9998;
  `;
  
  document.body.appendChild(doomFrame);
  
  // Crear botón de cierre
  const closeBtn = document.createElement('button');
  closeBtn.innerText = 'X';
  closeBtn.style.cssText = `
    position: absolute;
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
  `;
  
  doomFrame.parentNode.insertBefore(closeBtn, doomFrame);
  
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(doomFrame);
    document.body.removeChild(closeBtn);
    doomInitialized = false;
  });
}
