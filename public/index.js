document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    once: true,
    duration: 800,
    easing: 'ease-in-out',
    offset: 50, // Changed from 0 to 50
    anchorPlacement: 'top-bottom',
  });
});

// Refresh AOS after images and content load
window.addEventListener('load', function() {
  AOS.refresh();
});

// Select hamburger button and mobile menu
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

let isOpen = false;

menuBtn.addEventListener("click", () => {
  isOpen = !isOpen;

  // Toggle mobile menu visibility
  menu.classList.toggle("hidden");

  // Toggle hamburger / close icon
  menuBtn.innerHTML = isOpen
    ? '<i class="fa-solid fa-xmark"></i>' // Cross icon when open
    : '<i class="fa-solid fa-bars"></i>'; // Hamburger icon when closed
});
 
// NAV ACTIVE LINK HANDLER
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Remove active state from all links
    navLinks.forEach(l => l.classList.remove("!text-accent", "font-semibold"));

    // Add active state to clicked link
    link.classList.add("!text-accent", "font-semibold");

    // Smooth scroll to section
    const targetId = link.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Counter animation function
      function animateCounter(element, target, duration = 2000) {
        const isDecimal = target % 1 !== 0;
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            element.textContent = isDecimal ? target.toFixed(1) : Math.floor(target).toLocaleString();
            clearInterval(timer);
          } else {
            element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
          }
        }, 16);
      }

      // Intersection Observer to trigger animation when section is visible
      const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => {
              const target = parseFloat(counter.getAttribute('data-target'));
              animateCounter(counter, target);
            });
            observer.unobserve(entry.target); // Only animate once
          }
        });
      }, observerOptions);

      // Observe the stats section
      const statsSection = document.getElementById('stats');
      if (statsSection) {
        observer.observe(statsSection);
      }
 
 // INFINITE TESTIMONIAL SLIDER
        const container = document.querySelector('.testimonial-container');
        const nextBtn = document.querySelector('.next');
        const prevBtn = document.querySelector('.prev');

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


    // BACK TO TOP ARROW
    const backToTopBtn = document.getElementById('backToTop');
  // Show the button when scrolling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
    }
  });

  // Scroll to top smoothly
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });