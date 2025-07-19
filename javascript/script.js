$(document).ready(function() {
    const config = {
        scrollOffset: 100,
        animationDuration: 800,
        mobileBreakpoint: 1170
    };

    const $window = $(window);
    const $body = $('body');
    const $header = $('header');
    const $mobileBtn = $('#mobile_btn');
    const $mobileMenu = $('#mobile_menu');
    const $sections = $('section');
    const $navItems = $('.nav-item');
    const $html = $('html');

    init();

    function init() {
        setupEventListeners();
        setupScrollReveal();
        setupSmoothScrolling();
        checkInitialScroll();
    }

    function setupEventListeners() {
        $mobileBtn.on('click', toggleMobileMenu);
        
        $('.nav-item a').on('click', closeMobileMenu);
        
        $window.on('scroll', handleScroll);
        
        $window.on('resize', handleResize);
        
        $(document).on('keydown', handleKeydown);
        
        $('a[href^="#"]').on('click', handleSmoothScroll);
    }

    function toggleMobileMenu() {
        $mobileMenu.toggleClass('active');
        $mobileBtn.find('i').toggleClass('fa-bars fa-x');
        $body.toggleClass('menu-open');
        
        $mobileBtn.addClass('rotate');
        setTimeout(() => $mobileBtn.removeClass('rotate'), 300);
    }

    function closeMobileMenu() {
        $mobileMenu.removeClass('active');
        $mobileBtn.find('i').removeClass('fa-x').addClass('fa-bars');
        $body.removeClass('menu-open');
    }

    function handleScroll() {
        const scrollTop = $window.scrollTop();
        
        if (scrollTop > config.scrollOffset) {
            $header.addClass('scrolled');
        } else {
            $header.removeClass('scrolled');
        }
        
        updateActiveNavigation(scrollTop);
        
        applyParallax(scrollTop);
    }

    function updateActiveNavigation(scrollTop) {
        let activeSectionIndex = 0;
        const headerHeight = $header.outerHeight();

        $sections.each(function(i) {
            const $section = $(this);
            const sectionTop = $section.offset().top - headerHeight - 50;
            const sectionBottom = sectionTop + $section.outerHeight();

            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                activeSectionIndex = i;
                return false;
            }
        });

        $navItems.removeClass('active');
        $navItems.eq(activeSectionIndex).addClass('active');
    }

    function applyParallax(scrollTop) {
        const parallaxElements = $('.shape, .parallax');
        const speed = 0.5;
        
        parallaxElements.each(function() {
            const $element = $(this);
            const yPos = -(scrollTop * speed);
            $element.css('transform', `translateY(${yPos}px)`);
        });
    }

    function handleResize() {
        if ($window.width() > config.mobileBreakpoint) {
            closeMobileMenu();
        }
    }

    function handleKeydown(e) {
        if (e.keyCode === 27) {
            closeMobileMenu();
        }
        
        if (e.keyCode === 38 || e.keyCode === 40) {
            e.preventDefault();
            navigateWithArrows(e.keyCode);
        }
    }

    function navigateWithArrows(keyCode) {
        const currentSection = getCurrentSection();
        const totalSections = $sections.length;
        
        let nextSection;
        if (keyCode === 38) { 
            nextSection = currentSection > 0 ? currentSection - 1 : totalSections - 1;
        } else { 
            nextSection = currentSection < totalSections - 1 ? currentSection + 1 : 0;
        }
        
        scrollToSection(nextSection);
    }

    function getCurrentSection() {
        const scrollTop = $window.scrollTop();
        const headerHeight = $header.outerHeight();
        
        let currentSection = 0;
        $sections.each(function(i) {
            const $section = $(this);
            const sectionTop = $section.offset().top - headerHeight - 50;
            const sectionBottom = sectionTop + $section.outerHeight();
            
            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                currentSection = i;
                return false;
            }
        });
        
        return currentSection;
    }

    // Scroll suave para seção
    function scrollToSection(sectionIndex) {
        const $targetSection = $sections.eq(sectionIndex);
        const headerHeight = $header.outerHeight();
        const targetOffset = $targetSection.offset().top - headerHeight;
        
        $html.animate({
            scrollTop: targetOffset
        }, config.animationDuration, 'easeInOutQuart');
    }

    // Handle smooth scroll
    function handleSmoothScroll(e) {
        const href = $(this).attr('href');
        
        if (href.length > 1) {
            e.preventDefault();
            const $target = $(href);
            
            if ($target.length) {
                const headerHeight = $header.outerHeight();
                const targetOffset = $target.offset().top - headerHeight;
                // Se já está na seção, ainda faz o scroll (útil para recarregar a posição)
                $html.animate({
                    scrollTop: targetOffset
                }, config.animationDuration, 'easeInOutQuart');
            }
        }
    }

    // Configurar ScrollReveal
    function setupScrollReveal() {
        if (typeof ScrollReveal !== 'undefined') {
            const sr = ScrollReveal({
                distance: '60px',
                duration: 1000,
                delay: 200,
                easing: 'cubic-bezier(0.5, 0, 0, 1)',
                origin: 'bottom',
                reset: false
            });

            // Animações específicas
            sr.reveal('#cta', {
                origin: 'left',
                duration: 1200,
                distance: '50px'
            });

            sr.reveal('#banner', {
                origin: 'right',
                duration: 1200,
                distance: '50px',
                delay: 300
            });

            sr.reveal('.infos-me', {
                origin: 'bottom',
                duration: 1000,
                distance: '40px',
                interval: 200
            });

            sr.reveal('.techz', {
                origin: 'bottom',
                duration: 800,
                distance: '30px',
                interval: 150
            });

            sr.reveal('#footer_items', {
                origin: 'bottom',
                duration: 1000,
                distance: '40px'
            });
        }
    }

    // Configurar smooth scrolling
    function setupSmoothScrolling() {
        // Adicionar easing personalizado
        $.easing.easeInOutQuart = function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        };
    }

    // Verificar scroll inicial
    function checkInitialScroll() {
        if ($window.scrollTop() > 0) {
            handleScroll();
        }
    }

    // Utilitários
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle para performance
    const throttledScroll = debounce(handleScroll, 16);
    $window.on('scroll', throttledScroll);

    // Adicionar classes CSS para animações
    $body.addClass('js-loaded');
    
    // Preloader (se necessário)
    $(window).on('load', function() {
        $body.addClass('page-loaded');
    });

    // Registrar Service Worker para PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Intersection Observer para animações mais eficientes
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        // Observar elementos
        $('.infos-me, .techz, .card').each(function() {
            observer.observe(this);
        });
    }
});

// Remover CSS adicional antigo que pode conflitar
// (Remover o bloco que injeta .nav-item a::before e hover)