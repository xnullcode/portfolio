document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Typewriter Effect with Syntax Highlighting
    const typeWriterElement = document.getElementById('typewriter-content');
    const tokens = [
        { text: '{\n  ', cls: 'text-gray-400' },
        { text: '"name"', cls: 'text-sky-300' },
        { text: ': ', cls: 'text-gray-400' },
        { text: '"Adil Ali"', cls: 'text-amber-200' },
        { text: ',\n  ', cls: 'text-gray-400' },
        { text: '"location"', cls: 'text-sky-300' },
        { text: ': ', cls: 'text-gray-400' },
        { text: '"India"', cls: 'text-amber-200' },
        { text: ',\n  ', cls: 'text-gray-400' },
        { text: '"stack"', cls: 'text-sky-300' },
        { text: ': [\n    ', cls: 'text-gray-400' },
        { text: '"React 19"', cls: 'text-amber-200' },
        { text: ',\n    ', cls: 'text-gray-400' },
        { text: '"Spring Boot"', cls: 'text-amber-200' },
        { text: ',\n    ', cls: 'text-gray-400' },
        { text: '"Docker"', cls: 'text-amber-200' },
        { text: ',\n    ', cls: 'text-gray-400' },
        { text: '"Kubernetes"', cls: 'text-amber-200' },
        { text: ',\n    ', cls: 'text-gray-400' },
        { text: '"Go"', cls: 'text-amber-200' },
        { text: ',\n    ', cls: 'text-gray-400' },
        { text: '"Microservices"', cls: 'text-amber-200' },
        { text: ',\n    ', cls: 'text-gray-400' },
        { text: '"Distributed Architecture"', cls: 'text-amber-200' },
        { text: '\n  ],\n  ', cls: 'text-gray-400' },
        { text: '"status"', cls: 'text-sky-300' },
        { text: ': ', cls: 'text-gray-400' },
        { text: '"open_for_opportunities"', cls: 'text-emerald-300' },
        { text: '\n}', cls: 'text-gray-400' }
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

    // 2. Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state on buttons
            filterButtons.forEach(b => {
                b.classList.remove('active', 'bg-code-green/10', 'text-code-green', 'border-code-green');
                b.classList.add('border-slate-muted', 'text-gray-300');
            });
            btn.classList.remove('border-slate-muted', 'text-gray-300');
            btn.classList.add('active', 'bg-code-green/10', 'text-code-green', 'border-code-green');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    // Trigger reflow for animation if needed
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

    // 3. Project Tabs Switching
    const projectContainers = document.querySelectorAll('.project-card');
    
    projectContainers.forEach(container => {
        const tabs = container.querySelectorAll('.project-tabs button');
        const contents = container.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active classes from all tabs in this container
                tabs.forEach(t => {
                    t.classList.remove('text-code-green', 'border-b-2', 'border-code-green');
                    t.classList.add('text-gray-500');
                });

                // Hide all content in this container
                contents.forEach(content => {
                    content.classList.remove('active-tab', 'opacity-100');
                    content.classList.add('opacity-0', 'pointer-events-none');
                });

                // Add active classes to clicked tab
                tab.classList.remove('text-gray-500');
                tab.classList.add('text-code-green', 'border-b-2', 'border-code-green');

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

    // 4. Slide-in Animations on Scroll
    const slideElements = document.querySelectorAll('.slide-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
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

    // Trigger initial check
    setTimeout(() => {
        slideElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);

    // 5. Mini Terminal
    const cmdInput = document.getElementById('cmd-input');
    const cmdOutput = document.getElementById('cmd-output');

    cmdInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim().toLowerCase();
            this.value = '';
            
            // Echo command
            cmdOutput.innerHTML += `<br/><span class="text-code-green">~$</span> ${command}`;

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

});
