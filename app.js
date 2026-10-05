/**
 * FOOD IS NOT WASTE® — "KNOW YOUR ROLE"
 * Workshop Companion Script
 * Zero-dependency, lightweight, high-performance mobile UX
 */

(function () {
  'use strict';

  // Elements
  const stickyNav = document.getElementById('stickyNav');
  const heroGrid = document.querySelector('.role-selector-grid');
  const roleCards = document.querySelectorAll('.role-card');
  const navPills = document.querySelectorAll('.nav-pill');
  const selectorCards = document.querySelectorAll('.role-select-card');
  const chooseAnotherRoleBtns = document.querySelectorAll('.back-to-top-btn');
  const stickyPillsScroll = document.getElementById('stickyPillsScroll');
  const scrollFadeEdge = document.querySelector('.scroll-fade-edge');

  // Helper: Smooth scroll with offset for sticky nav
  function scrollToRole(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    // Remove active highlight from all cards
    roleCards.forEach(card => card.classList.remove('is-active-target'));

    // Calculate position taking into account sticky nav height
    const navHeight = stickyNav ? stickyNav.offsetHeight : 0;
    const elementRect = targetElement.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const targetScrollY = Math.max(0, absoluteElementTop - navHeight - 12);

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });

    // Add active highlight
    targetElement.classList.add('is-active-target');

    // Update active pill
    updateActivePill(targetId);

    // Focus target for accessibility
    setTimeout(() => {
      targetElement.focus({ preventScroll: true });
    }, 350);
  }

  // Update active pill state & horizontally scroll the pill into view if needed
  function updateActivePill(targetId) {
    navPills.forEach(pill => {
      const match = pill.getAttribute('data-target') === targetId;
      pill.classList.toggle('active', match);
      pill.setAttribute('aria-selected', match ? 'true' : 'false');

      if (match) {
        // Ensure pill is centered in sticky horizontal scroll
        pill.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    });
  }

  // Update scroll fade indicator on sticky nav
  function checkScrollFade() {
    if (!stickyPillsScroll || !scrollFadeEdge) return;
    const maxScroll = stickyPillsScroll.scrollWidth - stickyPillsScroll.clientWidth;
    if (maxScroll <= 5) {
      scrollFadeEdge.style.opacity = '0';
    } else {
      const atEnd = stickyPillsScroll.scrollLeft >= maxScroll - 12;
      scrollFadeEdge.style.opacity = atEnd ? '0' : '0.85';
    }
  }

  if (stickyPillsScroll) {
    stickyPillsScroll.addEventListener('scroll', checkScrollFade, { passive: true });
    window.addEventListener('resize', checkScrollFade, { passive: true });
  }

  // Hero Card Click Handlers
  selectorCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.getAttribute('data-target');
      if (targetId) {
        scrollToRole(targetId);
      }
    });
  });

  // Sticky Nav Pill Click Handlers
  navPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetId = pill.getAttribute('data-target');
      if (targetId) {
        scrollToRole(targetId);
      }
    });
  });

  // "Choose another role" button handlers
  chooseAnotherRoleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const heroSection = document.getElementById('top');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
        // After smooth scroll, clean active target styling
        setTimeout(() => {
          roleCards.forEach(card => card.classList.remove('is-active-target'));
          navPills.forEach(pill => {
            pill.classList.remove('active');
            pill.setAttribute('aria-selected', 'false');
          });
        }, 300);
      }
    });
  });

  // Sticky Nav Visibility on scroll
  if (heroGrid && stickyNav) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // When hero selector grid goes out of view above, show sticky nav
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            stickyNav.classList.add('is-visible');
            checkScrollFade();
          } else {
            stickyNav.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(heroGrid);
  }

  // Active Role Observer while scrolling
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const roleId = entry.target.id;
          updateActivePill(roleId);
        }
      });
    },
    {
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0.1
    }
  );

  roleCards.forEach(card => cardObserver.observe(card));

})();
