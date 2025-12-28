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
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');

  // Exit if testimonial slider doesn't exist on this page
  if (!container || !nextBtn || !prevBtn) return;

  const totalOriginal = 5; // Number of original testimonials
  let index = 0;
  const cardWidth = 320; // w-80 = 320px
  const gap = 28; // gap-7 = 28px
  const slideWidth = cardWidth + gap;

  function getVisibleCount() {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1280) return 2;
    return 3;
  }

  let visibleCount = getVisibleCount();

  function showTestimonial(instant = false) {
    if (instant) {
      container.style.transition = 'none';
    } else {
      container.style.transition = 'transform 500ms ease-in-out';
    }
    container.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  function handleInfiniteLoop() {
    // If we've scrolled past the original set, reset to beginning
    if (index >= totalOriginal) {
      setTimeout(() => {
        index = 0;
        showTestimonial(true);
      }, 500);
    }
    // If we've scrolled before the first item, jump to the end
    else if (index < 0) {
      setTimeout(() => {
        index = totalOriginal - 1;
        showTestimonial(true);
      }, 500);
    }
  }

  nextBtn.addEventListener('click', () => {
    index++;
    showTestimonial();
    handleInfiniteLoop();
  });

  prevBtn.addEventListener('click', () => {
    index--;
    showTestimonial();
    handleInfiniteLoop();
  });

  // Auto-play
  let autoplay = setInterval(() => {
    index++;
    showTestimonial();
    handleInfiniteLoop();
  }, 3000);

  // Pause on hover
  container.addEventListener('mouseenter', () => clearInterval(autoplay));
  container.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => {
      index++;
      showTestimonial();
      handleInfiniteLoop();
    }, 3000);
  });

  window.addEventListener('resize', () => {
    visibleCount = getVisibleCount();
    showTestimonial();
  });

  // Initialize
  showTestimonial();
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