let primeraCarta = null;
let segundaCarta = null;
let bloqueo = false;

document.addEventListener("DOMContentLoaded", function () {
  /* ========================
     Código del Slider
  ========================= */
  const slider = document.querySelector('.sliderq');

  if (slider) {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    let velocity = 0;
    let lastX = 0;
    let momentumID = null;

    document.querySelectorAll('.slider-trackq img').forEach(img => {
      img.addEventListener('dragstart', e => e.preventDefault());
    });

    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      lastX = startX;
      velocity = 0;
      cancelMomentum(); // Detiene la inercia anterior si había
      slider.style.cursor = 'grabbing';
    });

    slider.addEventListener('mouseleave', () => {
      isDragging = false;
      slider.style.cursor = 'grab';
      applyMomentum(); // Aplica la inercia al soltar
    });

    slider.addEventListener('mouseup', () => {
      isDragging = false;
      slider.style.cursor = 'grab';
      applyMomentum();
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 0.4;
      velocity = x - lastX; // Calcula velocidad
      lastX = x;
      slider.scrollLeft = scrollLeft - walk;
    });

    function applyMomentum() {
      momentumID = requestAnimationFrame(() => {
        velocity *= 0.95; // Fricción
        if (Math.abs(velocity) > 0.5) {
          slider.scrollLeft -= velocity;
          applyMomentum(); // Sigue con el siguiente frame
        } else {
          cancelMomentum(); // Detiene si la velocidad es baja
        }
      });
    }

  function cancelMomentum() {
      if (momentumID) {
        cancelAnimationFrame(momentumID);
        momentumID = null;
      }
    }

  }

  /* ========================
     Código de Cartas
  ========================= */
  document.querySelectorAll('.carta').forEach(carta => {
    carta.addEventListener('click', () => {
      if (bloqueo || carta.classList.contains('volteada')) return;

      carta.classList.add('volteada');

      if (!primeraCarta) {
        primeraCarta = carta;
      } else {
        segundaCarta = carta;
        bloqueo = true;

        if (primeraCarta.dataset.pareja === segundaCarta.dataset.pareja) {
          const pareja = primeraCarta.dataset.pareja;
          setTimeout(() => {
            mostrarPopup(pareja);
            reiniciarCartas();
          }, 600);
        } else {
          setTimeout(() => {
            primeraCarta.classList.remove('volteada');
            segundaCarta.classList.remove('volteada');
            reiniciarCartas();
          }, 1000);
        }
      }
    });
  });
});

/* ========================
   Funciones auxiliares
========================= */

function reiniciarCartas() {
  primeraCarta = null;
  segundaCarta = null;
  bloqueo = false;
}

function mostrarPopup(pareja) {
  document.getElementById(`popup-${pareja}`).style.display = 'flex';
}

function cerrarPopup() {
  document.querySelectorAll('.popup').forEach(p => p.style.display = 'none');
}

