/**
 * FERSIÊ — High Tailoring & Fine Jewelry
 * Luxury Interactive Engine & Motion Controller
 * Based on Fersie Design System (ds.fersie.com)
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollController();
  initScrollObserver();
  initMobileDrawer();
  initCollectionFilters();
  initProductModal();
  initSmoothScroll();
  initParallaxEffects();
  initWhatsAppLinks();
});

/**
 * 1. Scroll Controller (Progress Bar & Sticky Header Transformation)
 */
function initScrollController() {
  const progressBar = document.querySelector('.fersie-scroll-progress');
  const header = document.querySelector('.fersie-site-header');

  const onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Header transition on scroll
    if (header) {
      if (scrollTop > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Fallback progress bar calculation if CSS Scroll-Driven Animations not active
    if (progressBar && scrollHeight > 0) {
      const progressPercent = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * 2. Scroll Reveal Animations (IntersectionObserver Fallback & Progressive Enhancement)
 */
function initScrollObserver() {
  const revealElements = document.querySelectorAll('.fersie-reveal');
  if (!revealElements.length) return;

  // Ensure all elements are immediately visible
  revealElements.forEach(el => el.classList.add('active', 'is-visible'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active', 'is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '50px'
    });

    revealElements.forEach(el => observer.observe(el));
  }
}

/**
 * 3. Mobile Navigation Drawer
 */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('menu-toggle-btn');
  const drawer = document.getElementById('nav-drawer');
  const closeBtn = document.getElementById('drawer-close-btn');
  const overlay = document.getElementById('drawer-overlay');

  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/**
 * 4. Collection Filter Tabs Logic
 */
function initCollectionFilters() {
  const filterBtns = document.querySelectorAll('.fersie-filter-btn');
  const productCards = document.querySelectorAll('.fersie-card');

  if (!filterBtns.length || !productCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter') || 'all';

      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/**
 * 5. Interactive Product Quick-View Lightbox Modal
 */
function initProductModal() {
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalImg = document.getElementById('modal-img');
  const modalCategory = document.getElementById('modal-category');
  const modalCode = document.getElementById('modal-code');
  const modalDesc = document.getElementById('modal-desc');
  const modalPrice = document.getElementById('modal-price');
  const modalWaBtn = document.getElementById('modal-wa-btn');

  function openModal(data) {
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalImg) {
      modalImg.setAttribute('src', data.img);
      modalImg.setAttribute('alt', data.title);
    }
    if (modalCategory) modalCategory.textContent = data.category.toUpperCase();
    if (modalCode) modalCode.textContent = `REF: ${data.code}`;
    if (modalDesc) modalDesc.textContent = data.desc;
    if (modalPrice) modalPrice.textContent = data.price;

    if (modalWaBtn) {
      const phone = '5543988597348';
      const text = `Olá FERSIÊ! Gostaria de consultar a disponibilidade da peça "${data.title}" (Ref: ${data.code}) no valor de ${data.price}. Poderiam me atender?`;
      modalWaBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.body.addEventListener('click', (e) => {
    const trigger = e.target.closest('.btn-preview-modal');
    if (!trigger) return;

    const data = {
      title: trigger.getAttribute('data-title') || 'Peça Exclusiva FERSIÊ',
      category: trigger.getAttribute('data-category') || 'Coleção',
      price: trigger.getAttribute('data-price') || 'Sob Consulta',
      img: trigger.getAttribute('data-img') || 'images/logo_fersie_padrao.png',
      desc: trigger.getAttribute('data-desc') || 'Modelagem impecável em tecidos nobres e acabamentos artesanais de alta alfaiataria.',
      code: trigger.getAttribute('data-code') || 'FER-001'
    };

    openModal(data);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * 6. Smooth Scrolling for Internal Hash Anchors
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1);
      const targetElem = document.getElementById(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/**
 * 7. Subtle Parallax on Luxury Visual Elements
 */
function initParallaxEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const heroVisual = document.querySelector('.fersie-hero-image-wrap');
  if (!heroVisual) return;

  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const img = heroVisual.querySelector('img');
    if (img) {
      img.style.transform = `scale(1.04) translate(${x * 0.02}px, ${y * 0.02}px)`;
    }
  });

  heroVisual.addEventListener('mouseleave', () => {
    const img = heroVisual.querySelector('img');
    if (img) {
      img.style.transform = 'scale(1)';
    }
  });
}

/**
 * 8. Dynamic WhatsApp Link Builder
 */
function initWhatsAppLinks() {
  const phone = '5543988597348';
  document.querySelectorAll('.fersie-wa-direct').forEach(btn => {
    const context = btn.getAttribute('data-context') || 'Atendimento Geral';
    const text = `Olá FERSIÊ! Gostaria de falar com o atendimento exclusivo do ateliê sobre: ${context}.`;
    btn.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  });
}
