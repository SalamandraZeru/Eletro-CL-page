document.addEventListener('DOMContentLoaded', () => {
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
        
        // Transformar ícone hambúrguer em X
        const icon = menuToggle.querySelector('i');
        if (navbarMenu.classList.contains('active')) {
            menuToggle.setAttribute('aria-label', 'Fechar menu');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            menuToggle.setAttribute('aria-label', 'Abrir menu');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
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
    const animObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animObserver.observe(el);
    });

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
        drawParticles();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
            }, 250);
        });
    }

    // ==========================================
    // 6.1 AVALIAÇÕES DO GOOGLE (via /api/reviews)
    // ==========================================
    // Se a API falhar ou não estiver configurada, os depoimentos estáticos
    // do HTML continuam aparecendo.
    const reviewsGrid = document.getElementById('depoimentos-grid');
    const avatarColors = ['#27ae60', '#e67e22', '#3498db', '#8e44ad', '#c0392b'];
    const MAX_REVIEW_CHARS = 280;

    const starsHtml = (rating) => {
        const full = Math.round(rating);
        return '<i class="fa-solid fa-star"></i>'.repeat(full) + '<i class="fa-regular fa-star"></i>'.repeat(5 - full);
    };

    const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');

    const el = (tag, className, text) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    };

    const buildReviewCard = (review, index) => {
        const card = el('div', 'card card--depoimento animate-on-scroll');

        const stars = el('div', 'depoimento__stars');
        stars.innerHTML = starsHtml(review.rating);
        stars.setAttribute('aria-label', `${review.rating} de 5 estrelas`);

        const text = review.text.length > MAX_REVIEW_CHARS
            ? review.text.slice(0, MAX_REVIEW_CHARS).trimEnd() + '…'
            : review.text;
        const quote = el('p', 'depoimento__text', `"${text}"`);

        const author = el('div', 'depoimento__author');
        let avatar;
        if (review.photo) {
            avatar = el('img', 'depoimento__avatar');
            avatar.src = review.photo;
            avatar.alt = '';
            avatar.loading = 'lazy';
            avatar.referrerPolicy = 'no-referrer';
            avatar.width = 44;
            avatar.height = 44;
        } else {
            avatar = el('div', 'depoimento__avatar', initials(review.author));
            avatar.style.backgroundColor = avatarColors[index % avatarColors.length];
        }

        const info = el('div');
        const name = el('h4', 'depoimento__name');
        if (review.authorUrl) {
            const link = el('a', null, review.author);
            link.href = review.authorUrl;
            link.target = '_blank';
            link.rel = 'noopener';
            name.appendChild(link);
        } else {
            name.textContent = review.author;
        }
        const role = el('span', 'depoimento__role', review.time ? `${review.time} · Google` : 'Avaliação no Google');
        info.append(name, role);
        author.append(avatar, info);

        card.append(stars, quote, author);
        return card;
    };

    const renderGoogleSummary = ({ rating, total, url }) => {
        const box = document.getElementById('google-rating');
        if (!box || !rating) return;
        document.getElementById('google-rating-value').textContent = rating.toFixed(1).replace('.', ',');
        document.getElementById('google-rating-stars').innerHTML = starsHtml(rating);
        document.getElementById('google-rating-count').textContent =
            `${total} ${total === 1 ? 'avaliação' : 'avaliações'}`;
        const link = document.getElementById('google-rating-link');
        if (url) link.href = url; else link.remove();
        box.hidden = false;
    };

    if (reviewsGrid) {
        fetch('/api/reviews')
            .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
            .then(data => {
                renderGoogleSummary(data);
                if (!data.reviews?.length) return;
                reviewsGrid.replaceChildren(...data.reviews.map(buildReviewCard));
                reviewsGrid.querySelectorAll('.animate-on-scroll').forEach(card => animObserver.observe(card));
            })
            .catch(() => { /* mantém os depoimentos estáticos */ });
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
