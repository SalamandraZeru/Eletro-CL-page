import { initConsent } from './consent.js';

document.addEventListener('DOMContentLoaded', () => {
    initConsent();

    // ==========================================
    // 1. MENU MOBILE E SCROLL DA NAVBAR
    // ==========================================
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    const menuLinks = document.querySelectorAll('.navbar__link');

    // Mudar estilo da navbar ao rolar a página
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('navbar--scrolled', 'scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled', 'scrolled');
        }
    });

    // Alternar classe do menu mobile
    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navbarMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open', navbarMenu.classList.contains('active'));
        
        // O ícone (hambúrguer ↔ X) troca via CSS a partir de aria-expanded
        menuToggle.setAttribute('aria-label', navbarMenu.classList.contains('active') ? 'Fechar menu' : 'Abrir menu');
    };

    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navbarMenu?.classList.contains('active')) {
            toggleMenu();
            menuToggle.focus();
        }
    });

    // Fechar menu ao clicar em um link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ==========================================
    // 2. SMOOTH SCROLL (Nativo via JS)
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 3. INTERSECTION OBSERVER (ANIMAÇÕES)
    // ==========================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.querySelectorAll(':scope > .reveal-clip').forEach(child => child.classList.add('visible'));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    // Itens de grids marcados com data-stagger entram em cascata
    document.querySelectorAll('[data-stagger]').forEach(group => {
        group.querySelectorAll(':scope > .animate-on-scroll').forEach((item, i) => {
            item.style.setProperty('--d', `${i * 90}ms`);
        });
    });

    // Elementos com .reveal-clip começam 100% recortados e o observer não os
    // detectaria; por isso quem é observado é o contêiner deles.
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animObserver.observe(el.classList.contains('reveal-clip') ? el.parentElement : el);
    });

    // Linha que "desenha" a ligação entre as etapas do Como Funciona
    const stepsGrid = document.querySelector('.steps__grid');
    if (stepsGrid) {
        new IntersectionObserver(([entry], observer) => {
            if (entry.isIntersecting) {
                stepsGrid.classList.add('is-drawn');
                observer.disconnect();
            }
        }, { threshold: 0.35 }).observe(stepsGrid);
    }

    // ==========================================
    // 3.1 BARRA DE PROGRESSO + MENU ATIVO
    // ==========================================
    const progressBar = document.getElementById('scroll-progress');
    let progressTicking = false;
    const updateProgress = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        progressTicking = false;
    };
    if (progressBar) {
        window.addEventListener('scroll', () => {
            if (!progressTicking) {
                progressTicking = true;
                requestAnimationFrame(updateProgress);
            }
        }, { passive: true });
        updateProgress();
    }

    const navLinksById = new Map();
    document.querySelectorAll('.navbar__link, .bottom-nav__link, .legal__toc a').forEach(link => {
        const id = link.getAttribute('href')?.slice(1);
        if (!id) return;
        if (!navLinksById.has(id)) navLinksById.set(id, []);
        navLinksById.get(id).push(link);
    });
    const spyObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinksById.forEach(links => links.forEach(l => l.classList.remove('is-active')));
            navLinksById.get(entry.target.id)?.forEach(l => l.classList.add('is-active'));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinksById.forEach((_, id) => {
        const section = document.getElementById(id);
        if (section) spyObserver.observe(section);
    });

    // ==========================================
    // 3.2 BRILHO QUE SEGUE O CURSOR NOS CARDS
    // ==========================================
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.card--servico, .step').forEach(card => {
            card.addEventListener('pointermove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
                card.style.setProperty('--my', `${e.clientY - rect.top}px`);
            });
        });
    }

    // ==========================================
    // 4. ANIMAÇÃO DE CONTADORES (STATS)
    // ==========================================
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.stats__number').forEach(stat => {
        statsObserver.observe(stat);
    });

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // 2 segundos
        const frameDuration = 1000 / 60; // 60 FPS
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;
        
        // Easing function suave (easeOutExpo)
        const easeOut = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

        const counter = setInterval(() => {
            frame++;
            const progress = easeOut(frame / totalFrames);
            let currentCount = Math.round(target * progress);
            
            if (target >= 1000) {
                element.innerText = '+' + currentCount.toLocaleString('pt-BR');
            } else if (target === 100) {
                element.innerText = currentCount + '%';
            } else {
                element.innerText = '+' + currentCount;
            }

            if (frame === totalFrames) {
                clearInterval(counter);
            }
        }, frameDuration);
    }

    // ==========================================
    // 5. LAZY LOADING DE IMAGENS
    // ==========================================
    const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imgObserver.observe(img);
    });

    const currentYear = document.getElementById('current-year');
    if (currentYear) currentYear.textContent = new Date().getFullYear();

    // ==========================================
    // 6. HERO CANVAS (Partículas)
    // ==========================================
    const canvas = document.getElementById('hero__canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const particleCount = Math.floor(window.innerWidth / 15);
            
            for (let i = 0; i < particleCount; i++) {
                // Alterna entre partículas verdes e brancas (50% de chance cada)
                const isGreen = Math.random() > 0.5;
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 0.5,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    alpha: Math.random() * 0.5 + 0.1,
                    color: isGreen ? '39, 174, 96' : '255, 255, 255'
                });
            }
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
                ctx.fill();

                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const distance = Math.hypot(p.x - p2.x, p.y - p2.y);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${p.color}, ${0.15 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(drawParticles);
        };

        resizeCanvas();
        if (prefersReducedMotion) {
            drawParticles();
            cancelAnimationFrame(animationFrameId);
        } else {
            // Só anima enquanto o hero está visível (economiza bateria/CPU)
            new IntersectionObserver(([entry]) => {
                cancelAnimationFrame(animationFrameId);
                if (entry.isIntersecting) drawParticles();
            }).observe(canvas);
        }

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
            }, 250);
        });
    }

    // ==========================================
    // 7. EASTER EGG (Konami Code)
    // ==========================================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    window.addEventListener('keydown', (e) => {
        // Ignora case (B/b, A/a)
        const key = e.key;
        if (key === konamiCode[konamiIndex] || key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Ativa o easter egg (cursor de raio)
                document.body.classList.add('cursor-lightning');
                konamiIndex = 0; // reseta
            }
        } else {
            konamiIndex = 0; // reseta a sequência
        }
    });
});
