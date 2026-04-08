/* ══════════════════════════════════════════
   main.js — Portfolio Álex Redruello Puga
══════════════════════════════════════════ */

/* ─── AOS — Animaciones al hacer scroll ─── */
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
});

/* ─── Navbar — añadir clase "scrolled" al desplazarse ─── */
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // ejecutar al cargar por si ya está desplazado

/* ─── Mobile nav toggle ─── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

// Cerrar menú al hacer clic en un enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

/* ─── Swiper — Galería ─── */
const galSwiper = new Swiper('.galeria-swiper', {
  loop: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  spaceBetween: 20,
  speed: 700,
  grabCursor: true,
  keyboard: { enabled: true },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    prevEl: '.swiper-button-prev',
    nextEl: '.swiper-button-next',
  },
  autoplay: {
    delay: 4500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  breakpoints: {
    0:   { spaceBetween: 8 },
    768: { spaceBetween: 20 },
  },
});

/* ─── Lightbox ─── */
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// Array de srcs de las imágenes del slider
function getSlideImages() {
  return Array.from(
    document.querySelectorAll('.galeria-swiper .swiper-slide:not(.swiper-slide-duplicate) img')
  ).map(img => ({ src: img.src, alt: img.alt }));
}

let currentLightboxIndex = 0;

function openLightbox(index) {
  const imgs = getSlideImages();
  if (!imgs.length) return;
  currentLightboxIndex = ((index % imgs.length) + imgs.length) % imgs.length;
  lightboxImg.src = imgs[currentLightboxIndex].src;
  lightboxImg.alt = imgs[currentLightboxIndex].alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

function lightboxStep(dir) {
  const imgs = getSlideImages();
  currentLightboxIndex = ((currentLightboxIndex + dir + imgs.length) % imgs.length);
  lightboxImg.src = imgs[currentLightboxIndex].src;
  lightboxImg.alt = imgs[currentLightboxIndex].alt;
}

// Abrir lightbox al hacer clic en una slide
document.querySelector('.galeria-swiper').addEventListener('click', (e) => {
  const slide = e.target.closest('.swiper-slide:not(.swiper-slide-duplicate)');
  if (!slide) return;
  const imgs = getSlideImages();
  const clickedImg = slide.querySelector('img');
  const idx = imgs.findIndex(i => i.src === clickedImg.src);
  openLightbox(idx !== -1 ? idx : galSwiper.realIndex);
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => lightboxStep(-1));
lightboxNext.addEventListener('click', () => lightboxStep(1));

// Cerrar con Escape o clic en fondo
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   lightboxStep(-1);
  if (e.key === 'ArrowRight')  lightboxStep(1);
});

/* ─── Formulario de contacto ─── */
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = 'Enviando…';

  // Simulación de envío (sin backend por ahora)
  setTimeout(() => {
    formNote.textContent = '¡Mensaje recibido! Te respondo lo antes posible.';
    contactForm.reset();
    btn.disabled = false;
    btn.textContent = 'Enviar mensaje';
    setTimeout(() => { formNote.textContent = ''; }, 5000);
  }, 1200);
});

/* ─── Scroll suave para anclas del navbar ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ─── Efecto parallax suave en el hero ─── */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    if (offset < window.innerHeight) {
      heroBg.style.transform = `translateY(${offset * 0.3}px) scale(1.05)`;
    }
  }, { passive: true });
}

/* ══════════════════════════════════════════
   MODALES DE PROYECTO
══════════════════════════════════════════ */
let copaSwiper     = null;
let arphotosSwiper = null;

const SWIPER_MODAL_CONFIG = {
  loop: false,
  centeredSlides: true,
  slidesPerView: 'auto',
  spaceBetween: 16,
  speed: 600,
  grabCursor: true,
  keyboard: { enabled: true },
  lazy: {
    loadPrevNext: true,
    loadPrevNextAmount: 2,
  },
};

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  // Inicializar swiper de Copa del Rey la primera vez
  if (modalId === 'modal-copa' && !copaSwiper) {
    copaSwiper = new Swiper('.copa-swiper', {
      ...SWIPER_MODAL_CONFIG,
      pagination: {
        el: '.copa-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        prevEl: '.copa-prev',
        nextEl: '.copa-next',
      },
    });
  }

  // Inicializar swipers de @arp.photos_ la primera vez
  if (modalId === 'modal-arphotos') {
    if (!arphotosSwiper) {
      arphotosSwiper = new Swiper('.arphotos-swiper', {
        ...SWIPER_MODAL_CONFIG,
        pagination: {
          el: '.arphotos-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          prevEl: '.arphotos-prev',
          nextEl: '.arphotos-next',
        },
      });
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

function closeAllModals() {
  document.querySelectorAll('.pmodal.is-open').forEach(m => {
    m.classList.remove('is-open');
  });
  document.body.style.overflow = '';
}

// Clic en tarjetas de proyecto
document.querySelectorAll('.proyecto-card--clickable').forEach(card => {
  card.addEventListener('click', () => {
    const modalId = card.dataset.modal;
    const url     = card.dataset.url;

    if (modalId) {
      openModal('modal-' + modalId);
    } else if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  });

  // Accesibilidad: activar con teclado
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

// Botón de cierre dentro de cada modal
document.querySelectorAll('[data-close-modal]').forEach(btn => {
  btn.addEventListener('click', closeAllModals);
});

// Clic en el overlay cierra el modal
document.querySelectorAll('.pmodal-overlay').forEach(overlay => {
  overlay.addEventListener('click', closeAllModals);
});

// Tecla Escape cierra modales abiertos
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllModals();
});
