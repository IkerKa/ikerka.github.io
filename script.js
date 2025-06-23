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