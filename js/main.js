/**
 * Fersie Site — Vanilla JavaScript Interactive Engine
 * Milestone 3: Site Institucional
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initCollectionFilters();
  initWhatsAppCTAs();
  initProductModal();
  initSmoothScroll();
});

/**
 * 1. Mobile Menu / Navigation Drawer Toggle
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

  if (toggleBtn) {
    toggleBtn.addEventListener('click', openDrawer);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  // Close drawer on link click
  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/**
 * 2. Collection Filter Tab Bar Logic
 */
function initCollectionFilters() {
  const filterBtns = document.querySelectorAll('.fersie-filter-btn');
  const productCards = document.querySelectorAll('.fersie-product-card');

  if (!filterBtns.length || !productCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter') || 'all';

      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 3. WhatsApp CTA Dynamic Link Handler
 */
function initWhatsAppCTAs() {
  const defaultPhone = '5511999999999';

  document.body.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('.fersie-wa-product-cta');
    if (!targetBtn) return;

    const productName = targetBtn.getAttribute('data-wa-product') || 'produto Fersie';
    const productPrice = targetBtn.getAttribute('data-wa-price') || '';
    const productCode = targetBtn.getAttribute('data-wa-code') || '';
    const customPhone = targetBtn.getAttribute('data-wa-phone') || defaultPhone;

    let message = `Olá Fersie! Gostaria de mais informações e atendimento para o produto: ${productName}`;
    if (productCode) message += ` (Código: ${productCode})`;
    if (productPrice) message += ` no valor de R$ ${productPrice}`;
    message += `.`;

    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/${customPhone}?text=${encodedMsg}`;
    
    targetBtn.setAttribute('href', waUrl);
  });
}

/**
 * 4. Interactive Product Preview Modal / Lightbox Viewer
 */
function initProductModal() {
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalImg = document.getElementById('modal-img');
  const modalCategory = document.getElementById('modal-category');
  const modalCode = document.getElementById('modal-code');
  const modalDesc = document.getElementById('modal-desc');
  const modalPrice = document.getElementById('modal-price');
  const modalWaBtn = document.getElementById('modal-wa-btn');

  // Delegated click listener for preview buttons
  document.body.addEventListener('click', (e) => {
    const previewBtn = e.target.closest('.btn-preview-modal');
    if (!previewBtn) return;

    const title = previewBtn.getAttribute('data-title') || 'Produto Fersie';
    const category = previewBtn.getAttribute('data-category') || 'Coleção';
    const price = previewBtn.getAttribute('data-price') || 'Sob Consulta';
    const imgSrc = previewBtn.getAttribute('data-img') || 'images/placeholder_fersie.png';
    const desc = previewBtn.getAttribute('data-desc') || 'Peça exclusiva da Fersie desenvolvida com caimento e materiais nobres.';
    const code = previewBtn.getAttribute('data-code') || 'FER-000';

    if (modalTitle) modalTitle.textContent = title;
    if (modalImg) {
      modalImg.setAttribute('src', imgSrc);
      modalImg.setAttribute('alt', title);
    }
    if (modalCategory) modalCategory.textContent = category.toUpperCase();
    if (modalCode) modalCode.textContent = `CÓDIGO: ${code}`;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalPrice) modalPrice.textContent = price;

    if (modalWaBtn) {
      const message = `Olá Fersie! Tenho interesse no produto ${title} (Código: ${code}) no valor de ${price}.`;
      const waUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
      modalWaBtn.setAttribute('href', waUrl);
      modalWaBtn.setAttribute('data-wa-product', title);
      modalWaBtn.setAttribute('data-wa-code', code);
      modalWaBtn.setAttribute('data-wa-price', price);
    }

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', 'true');
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
    });
  }

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      if (typeof modal.close === 'function') modal.close();
      else modal.removeAttribute('open');
    }
  });
}

/**
 * 5. Smooth Scrolling for Internal Anchor Links
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  anchorLinks.forEach(link => {
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
