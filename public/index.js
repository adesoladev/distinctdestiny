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