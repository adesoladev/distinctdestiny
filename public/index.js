// Load header and footer
async function loadComponent(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    const html = await response.text();

    const targetElement = document.getElementById(elementId);
    const temp = document.createElement('div');
    temp.innerHTML = html;

    const component = temp.firstElementChild;
    targetElement.parentNode.replaceChild(component, targetElement);

  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
}

// Mobile menu
function initMobileMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");

  if (!menuBtn || !menu) return;

  let isOpen = false;

  menuBtn.addEventListener("click", () => {
    isOpen = !isOpen;
    menu.classList.toggle("hidden");
    menuBtn.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });
}

// Back to Top button
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Tab Content functionality
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".content");

  if (tabs.length === 0 || contents.length === 0) return; // Exit if tabs don't exist on this page

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-target");

      // Hide all content
      contents.forEach(c => {
        c.classList.add("hidden");
        c.classList.remove("active");
      });

      // Show the clicked tab content
      const activeContent = document.getElementById(target);
      if (activeContent) {
        activeContent.classList.remove("hidden");
        activeContent.classList.add("active");
      }

      // Update tab button styles
      tabs.forEach(t => {
        t.classList.remove("bg-accent", "text-white");
        t.classList.add("bg-gray-200", "text-gray-700");
      });
      tab.classList.add("bg-accent", "text-white");
      tab.classList.remove("bg-gray-200", "text-gray-700");
    });
  });
}

// Testimonial Slider functionality
function initTestimonialSlider() {
  const container = document.querySelector('.testimonial-container');
  const nextBtn = document.querySelectorAll('.next');
  const prevBtn = document.querySelectorAll('.prev');

  // Exit if testimonial slider doesn't exist on this page
  if (!container || !nextBtn.length || !prevBtn.length) return;

  const testimonials = container.querySelectorAll('.testimonial');
  const totalSlides = testimonials.length;
  let currentIndex = 0;
  const cardWidth = 320; // w-80 = 320px
  const gap = 28; // gap-7 = 28px
  const slideWidth = cardWidth + gap;
  
  // Set container width to fit all testimonials
  container.style.width = `${totalSlides * slideWidth}px`;
  let autoplayInterval;

  function updateSlider(animate = true) {
    if (!animate) {
      container.style.transition = 'none';
    } else {
      container.style.transition = 'transform 700ms ease-in-out';
    }
    container.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    
    // Force reflow if transition was disabled
    if (!animate) {
      container.offsetHeight;
      container.style.transition = 'transform 700ms ease-in-out';
    }
  }

  function nextSlide() {
    currentIndex++;
    if (currentIndex >= totalSlides) {
      currentIndex = 0;
    }
    updateSlider();
  }

  function prevSlide() {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = totalSlides - 1;
    }
    updateSlider();
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      nextSlide();
    }, 4000); // 4 second delay between slides
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Add click handlers to all next/prev buttons (for mobile and desktop)
  nextBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      stopAutoplay();
      nextSlide();
      startAutoplay(); // Restart autoplay after manual interaction
    });
  });

  prevBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      stopAutoplay();
      prevSlide();
      startAutoplay(); // Restart autoplay after manual interaction
    });
  });

  // Pause autoplay on hover
  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);

  // Handle window resize
  window.addEventListener('resize', () => {
    updateSlider(false);
  });

  // Initialize - show first slide immediately
  updateSlider(false);
  
  // Start autoplay after a brief initial delay
  setTimeout(startAutoplay, 2000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTestimonialSlider);
} else {
  initTestimonialSlider();
}
// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {

  // Load header and footer first
  await loadComponent('header', './components/header.html');
  await loadComponent('footer', './components/footer.html');

  // NAV ACTIVE LINK HANDLER — placed after header loads
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active state from all
      navLinks.forEach(l => l.classList.remove("!text-secondary", "font-semibold"));

      // Add active state to clicked
      link.classList.add("!text-secondary", "font-semibold");

      const href = link.getAttribute("href");

      if (href.startsWith("#")) {
        const section = document.querySelector(href);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    });
  });

  // Initialize all features
  initMobileMenu();
  initBackToTop();
  initTabs();
  initTestimonialSlider();
  initGalleryFilter();

  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      duration: 800,
      easing: 'ease-in-out',
      offset: 50,
      anchorPlacement: 'top-bottom',
    });
    AOS.refresh();
  }
});

// Refresh AOS after full load
window.addEventListener('load', () => {
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
});

// Gallery Filter Functionality
function initGalleryFilter() {
  const categories = [
    'All',
    'School Life',
    'Academics in Action',
    'Events & Celebrations',
    'Clubs & Activities',
    'Staff & Administration'
  ];

  const photos = [
    { id: 1, category: 'School Life', title: 'School Environment', img: 'Images/school-environment.jpg' },
    { id: 2, category: 'School Life', title: 'Morning Assembly', img: 'Images/assembly.png' },
    { id: 3, category: 'Academics in Action', title: 'Classroom Learning', img: 'Images/classroom.jpg' },
    { id: 4, category: 'Academics in Action', title: 'Library Study', img: 'Images/library.jpg' },
    { id: 5, category: 'Events & Celebrations', title: 'Cultural Day Celebration', img: 'Images/cultural.png' },
    { id: 6, category: 'Events & Celebrations', title: 'Open Day', img: 'Images/open-day.jpg' },
    { id: 7, category: 'Clubs & Activities', title: 'Science & STEM Activities', img: 'Images/stem.png' },
    { id: 8, category: 'Clubs & Activities', title: 'Sports & Teamwork', img: 'Images/sports.png' },
    { id: 9, category: 'Staff & Administration', title: 'Dedicated Staff', img: 'Images/staff.png' },
    { id: 10, category: 'Staff & Administration', title: 'Staff Meeting', img: 'Images/staff-meeting.png' },
    { id: 11, category: 'School Life', title: 'Playground Fun', img: 'Images/playground.png' },
    { id: 12, category: 'Academics in Action', title: 'Science Lab', img: 'Images/science.png' },
  ];

  let activeFilter = 'All';

  // Create filter buttons
  function createFilterButtons() {
    const filterContainer = document.getElementById('gallery-filters');
    if (!filterContainer) return;

    filterContainer.innerHTML = categories.map(category => `
      <button 
        class="filter-btn px-6 py-2 rounded-full font-medium transition-all duration-300 ${
          category === 'All' 
            ? 'bg-accent text-text' 
            : 'bg-gallery text-secondary hover:bg-accent hover:text-text'
        }"
        data-category="${category}"
      >
        ${category}
      </button>
    `).join('');

    // Add click event to all filter buttons
    const filterBtns = filterContainer.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.getAttribute('data-category');
        updateFilterButtons();
        filterPhotos();
      });
    });
  }

  // Update filter button styles
  function updateFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      const category = btn.getAttribute('data-category');
      if (category === activeFilter) {
        btn.classList.add('bg-accent', 'text-text');
        btn.classList.remove('bg-gallery', 'text-secondary');
      } else {
        btn.classList.remove('bg-accent', 'text-text');
        btn.classList.add('bg-gallery', 'text-secondary');
      }
    });
  }

  // Filter and display photos
  function filterPhotos() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    const filteredPhotos = activeFilter === 'All' 
      ? photos 
      : photos.filter(photo => photo.category === activeFilter);

    if (filteredPhotos.length === 0) {
      galleryGrid.innerHTML = `
        <div class="col-span-full text-center py-20">
          <p class="text-secondary text-xl">No photos found in this category.</p>
        </div>
      `;
      return;
    }

    galleryGrid.innerHTML = filteredPhotos.map(photo => `
      <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <div class="bg-primary h-64 flex items-center justify-center overflow-hidden">
          <img src="${photo.img}" alt="${photo.title}" class="w-full h-full object-cover">
        </div>
        <div class="p-4">
          <p class="font-medium text-secondary text-lg">${photo.title}</p>
          <p class="text-sm text-gray-500 mt-1">${photo.category}</p>
        </div>
      </div>
    `).join('');
  }

  // Initialize
  createFilterButtons();
  filterPhotos();
}

// Enhanced form submission with feedback
    const form = document.getElementById('contactForm');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      // Get form data
      const formData = new FormData(form);
      
      try {
        // Submit to Formspree
        const response = await fetch('https://formspree.io/f/xzzknjpo', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Success - show confirmation message
          form.style.display = 'none';
          confirmationMessage.classList.remove('hidden');
          
          // Reset form after 5 seconds
          setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            confirmationMessage.classList.add('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
          }, 5000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        // Show error in confirmation message area
        confirmationMessage.classList.remove('hidden');
        confirmationMessage.className = 'mt-6 bg-red-50 border border-red-200 rounded-2xl p-6';
        confirmationMessage.innerHTML = `
          <div class="flex items-center gap-3">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h4 class="font-semibold text-red-800">Oops! Something went wrong.</h4>
              <p class="text-red-700 text-sm">Please try again or contact us directly.</p>
            </div>
          </div>
        `;
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        
        // Hide error after 5 seconds
        setTimeout(() => {
          confirmationMessage.classList.add('hidden');
          confirmationMessage.className = 'hidden mt-6 bg-green-50 border border-green-200 rounded-2xl p-6';
          confirmationMessage.innerHTML = `
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <h4 class="font-semibold text-green-800">Thank you for reaching out!</h4>
                <p class="text-green-700 text-sm">Our team will get back to you shortly.</p>
              </div>
            </div>
          `;
        }, 5000);
      }
    });