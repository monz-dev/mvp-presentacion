    const sections = document.querySelectorAll('.section');
    const totalSections = sections.length;
    let currentSection = 0;

    // Para móvil: trackear card actual dentro de los 5 pilares
    let currentCardInPillars = 0;
    const cardsGrid = document.querySelector('#section-2 .cards-grid');
    const cards = cardsGrid ? cardsGrid.querySelectorAll('.card') : [];

    // Create progress dots
    const dotsContainer = document.getElementById('progress-dots');
    for (let i = 0; i < totalSections; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => scrollToSection(i);
      dotsContainer.appendChild(dot);
    }

    function updateUI() {
      // Update dots
      document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSection);
      });

      // Update nav buttons
      document.getElementById('prev-btn').disabled = currentSection === 0;
      document.getElementById('next-btn').disabled = currentSection === totalSections - 1;
    }

    function scrollToSection(index) {
      if (index >= 0 && index < totalSections) {
        currentSection = index;
        sections[index].scrollIntoView({ behavior: 'smooth' });
        updateUI();
      }
    }

    function isMobile() {
      return window.innerWidth <= 768;
    }

    function nextSection() {
      // En móvil, si estamos en la sección de pilares (index 2)
      if (isMobile() && currentSection === 2 && cards.length > 0) {
        if (currentCardInPillars < cards.length - 1) {
          currentCardInPillars++;
          cards[currentCardInPillars].scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        } else {
          // Ir a la siguiente sección principal
          currentCardInPillars = 0;
        }
      }
      
      if (currentSection < totalSections - 1) {
        scrollToSection(currentSection + 1);
      }
    }

    function prevSection() {
      // En móvil, si estamos en la sección de pilares (index 2)
      if (isMobile() && currentSection === 2 && cards.length > 0) {
        if (currentCardInPillars > 0) {
          currentCardInPillars--;
          cards[currentCardInPillars].scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        } else {
          // Ir a la sección anterior
          currentCardInPillars = 0;
        }
      }
      
      if (currentSection > 0) {
        scrollToSection(currentSection - 1);
      }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        nextSection();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSection();
      }
    });

    // Scroll detection
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          currentSection = index;
          
          // Reset card index cuando entramos a pilares
          if (index === 2) {
            currentCardInPillars = 0;
          }
          
          updateUI();
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));

    // Initialize
    updateUI();
