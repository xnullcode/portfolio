document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Typewriter Effect with Syntax Highlighting
    const typeWriterElement = document.getElementById('typewriter-content');
    const tokens = [
        { text: '{\n  ', cls: 'token-punct text-gray-400' },
        { text: '"name"', cls: 'token-key text-sky-300' },
        { text: ': ', cls: 'token-punct text-gray-400' },
        { text: '"Adil Ali"', cls: 'token-str text-amber-200' },
        { text: ',\n  ', cls: 'token-punct text-gray-400' },
        { text: '"location"', cls: 'token-key text-sky-300' },
        { text: ': ', cls: 'token-punct text-gray-400' },
        { text: '"India"', cls: 'token-str text-amber-200' },
        { text: ',\n  ', cls: 'token-punct text-gray-400' },
        { text: '"stack"', cls: 'token-key text-sky-300' },
        { text: ': [\n    ', cls: 'token-punct text-gray-400' },
        { text: '"React 19"', cls: 'token-str text-amber-200' },
        { text: ',\n    ', cls: 'token-punct text-gray-400' },
        { text: '"Spring Boot"', cls: 'token-str text-amber-200' },
        { text: ',\n    ', cls: 'token-punct text-gray-400' },
        { text: '"Docker"', cls: 'token-str text-amber-200' },
        { text: ',\n    ', cls: 'token-punct text-gray-400' },
        { text: '"Kubernetes"', cls: 'token-str text-amber-200' },
        { text: ',\n    ', cls: 'token-punct text-gray-400' },
        { text: '"Go"', cls: 'token-str text-amber-200' },
        { text: ',\n    ', cls: 'token-punct text-gray-400' },
        { text: '"Microservices"', cls: 'token-str text-amber-200' },
        { text: ',\n    ', cls: 'token-punct text-gray-400' },
        { text: '"Distributed Architecture"', cls: 'token-str text-amber-200' },
        { text: '\n  ],\n  ', cls: 'token-punct text-gray-400' },
        { text: '"status"', cls: 'token-key text-sky-300' },
        { text: ': ', cls: 'token-punct text-gray-400' },
        { text: '"open_for_opportunities"', cls: 'token-status text-amber-400' },
        { text: '\n}', cls: 'token-punct text-gray-400' }
    ];

    let tokenIdx = 0;
    let charIdx = 0;

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function renderTypewriter() {
        if (!typeWriterElement) return;

        let html = '';
        for (let i = 0; i < tokenIdx; i++) {
            html += `<span class="${tokens[i].cls}">${escapeHtml(tokens[i].text)}</span>`;
        }

        if (tokenIdx < tokens.length) {
            const currentToken = tokens[tokenIdx];
            const currentSlice = currentToken.text.slice(0, charIdx + 1);
            html += `<span class="${currentToken.cls}">${escapeHtml(currentSlice)}</span>`;

            charIdx++;
            if (charIdx >= currentToken.text.length) {
                tokenIdx++;
                charIdx = 0;
            }
            typeWriterElement.innerHTML = html;
            setTimeout(renderTypewriter, 20);
        } else {
            typeWriterElement.innerHTML = html;
        }
    }

    setTimeout(renderTypewriter, 400);

    // 2. Browser/OS Theme Detection & Switcher (Fallback: light)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const urlParams = new URLSearchParams(window.location.search);

    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    function getInitialTheme() {
        const urlTheme = urlParams.get('theme');
        if (urlTheme === 'light' || urlTheme === 'dark') return urlTheme;

        const savedUserTheme = localStorage.getItem('portfolio-user-theme');
        if (savedUserTheme === 'light' || savedUserTheme === 'dark') return savedUserTheme;

        return getSystemTheme();
    }

    function setTheme(theme, isManual = false) {
        if (theme === 'dark') {
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            if (themeToggleBtn) themeToggleBtn.textContent = 'Light';
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
            if (themeToggleBtn) themeToggleBtn.textContent = 'Dark';
        }

        if (isManual) {
            localStorage.setItem('portfolio-user-theme', theme);
        }
    }

    // Initialize theme state (button label & document class)
    setTheme(getInitialTheme(), false);

    // User manual toggle (saves explicit preference)
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isCurrentlyLight = document.documentElement.classList.contains('light');
            setTheme(isCurrentlyLight ? 'dark' : 'light', true);
        });
    }

    // Dynamic OS/Browser color-scheme change sync (only if user hasn't explicitly set preference)
    if (window.matchMedia) {
        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleThemeChange = (e) => {
            if (!localStorage.getItem('portfolio-user-theme')) {
                setTheme(e.matches ? 'dark' : 'light', false);
            }
        };
        if (colorSchemeQuery.addEventListener) {
            colorSchemeQuery.addEventListener('change', handleThemeChange);
        } else if (colorSchemeQuery.addListener) {
            colorSchemeQuery.addListener(handleThemeChange);
        }
    }

    // 3. Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state on buttons
            filterButtons.forEach(b => {
                b.classList.remove('active', 'bg-amber-500/10', 'text-amber-400', 'border-amber-500');
                b.classList.add('border-slate-700/60');
            });
            btn.classList.remove('border-slate-700/60');
            btn.classList.add('active', 'bg-amber-500/10', 'text-amber-400', 'border-amber-500');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 4. Project Tabs Switching
    const projectContainers = document.querySelectorAll('.project-card');
    
    projectContainers.forEach(container => {
        const tabs = container.querySelectorAll('.project-tabs button');
        const contents = container.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active classes from all tabs in this container
                tabs.forEach(t => {
                    t.classList.remove('text-amber-400', 'border-b-2', 'border-amber-400');
                    t.classList.add('text-gray-500');
                });

                // Hide all content in this container
                contents.forEach(content => {
                    content.classList.remove('active-tab', 'opacity-100');
                    content.classList.add('opacity-0', 'pointer-events-none');
                });

                // Add active classes to clicked tab
                tab.classList.remove('text-gray-500');
                tab.classList.add('text-amber-400', 'border-b-2', 'border-amber-400');

                // Show target content
                const targetId = tab.getAttribute('data-target');
                const targetContent = container.querySelector(`#${targetId}`);
                if (targetContent) {
                    targetContent.classList.remove('opacity-0', 'pointer-events-none');
                    targetContent.classList.add('active-tab', 'opacity-100');
                }
            });
        });
    });

    // 5. Slide-in Animations on Scroll
    const slideElements = document.querySelectorAll('.slide-in');
    
    function checkSlideVisibility() {
        slideElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight + 50) {
                el.classList.add('visible');
            }
        });
    }

    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.05
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    slideElements.forEach(el => {
        scrollObserver.observe(el);
    });

    window.addEventListener('scroll', checkSlideVisibility, { passive: true });

    // Initial check
    setTimeout(checkSlideVisibility, 100);
    setTimeout(checkSlideVisibility, 400);

    // 6. Mini Terminal
    const cmdInput = document.getElementById('cmd-input');
    const cmdOutput = document.getElementById('cmd-output');

    cmdInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim().toLowerCase();
            this.value = '';
            
            // Echo command with amber prompt
            cmdOutput.innerHTML += `<br/><span class="text-amber-400 font-semibold">~$</span> ${command}`;

            if (command === 'help') {
                cmdOutput.innerHTML += `<br/>Available commands:<br/>
                - <b>github</b>: Open GitHub profile<br/>
                - <b>linkedin</b>: Open LinkedIn profile<br/>
                - <b>email</b>: Send an email<br/>
                - <b>clear</b>: Clear terminal output`;
            } else if (command === 'clear') {
                cmdOutput.innerHTML = '';
            } else if (command === 'github') {
                cmdOutput.innerHTML += `<br/>Opening GitHub...`;
                window.open('https://github.com/xnullcode', '_blank');
            } else if (command === 'linkedin') {
                cmdOutput.innerHTML += `<br/>Opening LinkedIn...`;
                window.open('https://linkedin.com/in/xnullcode', '_blank');
            } else if (command === 'email') {
                cmdOutput.innerHTML += `<br/>Opening mail client...`;
                window.location.href = 'mailto:adilalicm@gmail.com';
            } else if (command !== '') {
                cmdOutput.innerHTML += `<br/>Command not found: ${command}. Type 'help' for available commands.`;
            }

            // Scroll to bottom
            cmdOutput.scrollTop = cmdOutput.scrollHeight;
        }
    });

    // 7. Header Brand Click (Smooth Scroll to Top)
    const brandTitle = document.querySelector('.header-cursive-brand');
    if (brandTitle) {
        brandTitle.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 8. Scrollspy: Highlight Active Nav Link (Hero/Adil, Projects, Metrics, Contact)
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = [
        { id: 'hero', el: document.getElementById('hero') },
        { id: 'projects', el: document.getElementById('projects') },
        { id: 'metrics', el: document.getElementById('metrics') },
        { id: 'contact', el: document.getElementById('contact') }
    ];

    function updateScrollspy() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        let activeId = 'hero';

        // If user scrolled near bottom, activate Contact
        if (scrollY + windowHeight >= documentHeight - 100) {
            activeId = 'contact';
        } else {
            // Trigger threshold: 240px from top of viewport
            const triggerPoint = 240;
            
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section.el) {
                    const rect = section.el.getBoundingClientRect();
                    if (rect.top <= triggerPoint) {
                        activeId = section.id;
                        break;
                    }
                }
            }
        }

        // 1. Brand 'Adil' is glowing orange when in top Hero section
        if (brandTitle) {
            if (activeId === 'hero') {
                brandTitle.classList.add('active');
            } else {
                brandTitle.classList.remove('active');
            }
        }

        // 2. Navigation links light up when their corresponding section is active
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (activeId !== 'hero' && href === `#${activeId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateScrollspy, { passive: true });
    window.addEventListener('resize', updateScrollspy, { passive: true });
    updateScrollspy();

    // 9. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 9. Initial Scroll URL or Hash Handling
    const scrollParam = urlParams.get('scroll');
    if (scrollParam) {
        const targetScroll = parseInt(scrollParam, 10);
        window.scrollTo(0, targetScroll);
        updateScrollspy();
        checkSlideVisibility();
        setTimeout(() => {
            window.scrollTo(0, targetScroll);
            updateScrollspy();
            checkSlideVisibility();
        }, 150);
    }

    if (window.location.hash) {
        setTimeout(() => {
            updateScrollspy();
            checkSlideVisibility();
        }, 150);
    }

});
