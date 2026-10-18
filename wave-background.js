/**
 * Standalone 3D Undulating Wireframe Wave Background (Three.js)
 * Full-Website Background Component with Scroll Parallax & Theme Reactivity.
 */
(function() {
    function createGlowDotTexture() {
        const c = document.createElement('canvas');
        c.width = 32;
        c.height = 32;
        const ctx = c.getContext('2d');
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.6)');
        grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.12)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
        return new THREE.CanvasTexture(c);
    }

    function initWaveBackground() {
        const canvas = document.getElementById('hero-waves-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        // 1. Scene, Camera, Renderer (Full Viewport)
        const scene = new THREE.Scene();
        let width = window.innerWidth;
        let height = window.innerHeight;

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(0, -16, 17);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height, false);

        // Circular glow texture for soft circular particles & nodes
        const glowTexture = createGlowDotTexture();

        // 2. Terrain Mesh (Spans entire viewport height and width)
        const planeWidth = 72;
        const planeHeight = 65;
        const segmentsX = 68;
        const segmentsY = 52;

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, segmentsX, segmentsY);
        const basePositions = new Float32Array(geometry.attributes.position.array);
        const vertexCount = geometry.attributes.position.count;

        const isInitialLight = document.documentElement.classList.contains('light');

        const wireMaterial = new THREE.MeshBasicMaterial({
            wireframe: true,
            transparent: true,
            opacity: isInitialLight ? 0.16 : 0.28,
            color: new THREE.Color(isInitialLight ? '#ea580c' : '#f97316'),
            blending: isInitialLight ? THREE.NormalBlending : THREE.AdditiveBlending,
            depthWrite: false
        });

        const terrainMesh = new THREE.Mesh(geometry, wireMaterial);
        terrainMesh.position.set(0, 0, -3);
        terrainMesh.rotation.x = -Math.PI * 0.34;
        scene.add(terrainMesh);

        // 3. Vertex Nodes (Points bound to exact same geometry)
        const pointsMaterial = new THREE.PointsMaterial({
            size: 0.20,
            sizeAttenuation: true,
            map: glowTexture,
            transparent: true,
            opacity: isInitialLight ? 0.24 : 0.55,
            color: new THREE.Color(isInitialLight ? '#d97706' : '#ffb700'),
            blending: isInitialLight ? THREE.NormalBlending : THREE.AdditiveBlending,
            depthWrite: false
        });

        const pointsMesh = new THREE.Points(geometry, pointsMaterial);
        pointsMesh.position.copy(terrainMesh.position);
        pointsMesh.rotation.copy(terrainMesh.rotation);
        scene.add(pointsMesh);

        // 4. Sparse Floating Dust / Ember Particles (Full Screen Volume)
        const emberCount = 110;
        const emberGeometry = new THREE.BufferGeometry();
        const emberPositions = new Float32Array(emberCount * 3);
        const emberVelocities = [];

        for (let i = 0; i < emberCount; i++) {
            const i3 = i * 3;
            emberPositions[i3] = (Math.random() - 0.5) * 60;
            emberPositions[i3 + 1] = (Math.random() - 0.5) * 50;
            emberPositions[i3 + 2] = Math.random() * 10 + 0.5;

            emberVelocities.push({
                speedZ: 0.005 + Math.random() * 0.012,
                freq: 0.6 + Math.random() * 1.2,
                phase: Math.random() * Math.PI * 2,
                baseX: emberPositions[i3]
            });
        }
        emberGeometry.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));

        const emberMaterial = new THREE.PointsMaterial({
            size: 0.30,
            sizeAttenuation: true,
            map: glowTexture,
            transparent: true,
            opacity: isInitialLight ? 0.18 : 0.44,
            color: new THREE.Color(isInitialLight ? '#94a3b8' : '#ff4e00'),
            blending: isInitialLight ? THREE.NormalBlending : THREE.AdditiveBlending,
            depthWrite: false
        });

        const embersMesh = new THREE.Points(emberGeometry, emberMaterial);
        embersMesh.position.copy(terrainMesh.position);
        embersMesh.rotation.copy(terrainMesh.rotation);
        scene.add(embersMesh);

        // 5. Dynamic Theme Binding (Zero context recreation)
        function updateThemeColors(isLight) {
            if (isLight) {
                // Light Mode: Architectural blueprint with terracotta/amber and muted slate
                wireMaterial.color.set('#ea580c');
                wireMaterial.opacity = 0.16;
                wireMaterial.blending = THREE.NormalBlending;

                pointsMaterial.color.set('#d97706');
                pointsMaterial.opacity = 0.24;
                pointsMaterial.blending = THREE.NormalBlending;

                emberMaterial.color.set('#94a3b8');
                emberMaterial.opacity = 0.18;
                emberMaterial.blending = THREE.NormalBlending;
            } else {
                // Dark Mode: Cyber-Sunset fiery orange-to-amber glow
                wireMaterial.color.set('#f97316');
                wireMaterial.opacity = 0.28;
                wireMaterial.blending = THREE.AdditiveBlending;

                pointsMaterial.color.set('#ffb700');
                pointsMaterial.opacity = 0.55;
                pointsMaterial.blending = THREE.AdditiveBlending;

                emberMaterial.color.set('#ff4e00');
                emberMaterial.opacity = 0.44;
                emberMaterial.blending = THREE.AdditiveBlending;
            }
            wireMaterial.needsUpdate = true;
            pointsMaterial.needsUpdate = true;
            emberMaterial.needsUpdate = true;
        }

        const themeObserver = new MutationObserver(() => {
            const isLight = document.documentElement.classList.contains('light');
            updateThemeColors(isLight);
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        // 6. Smooth Mouse and Scroll Parallax
        let targetMouseX = 0;
        let targetMouseY = 0;
        let currentMouseX = 0;
        let currentMouseY = 0;
        let scrollY = window.scrollY;
        let currentScrollY = scrollY;

        function onMouseMove(e) {
            targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
            targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        }
        window.addEventListener('mousemove', onMouseMove, { passive: true });

        function onScroll() {
            scrollY = window.scrollY;
        }
        window.addEventListener('scroll', onScroll, { passive: true });

        // 7. Full-Site Animation Loop
        const clock = new THREE.Clock();
        let animId = null;
        let isTabVisible = !document.hidden;

        function animate() {
            if (!isTabVisible) {
                animId = null;
                return;
            }

            animId = requestAnimationFrame(animate);

            const time = clock.getElapsedTime();

            // Smooth mouse and scroll interpolation
            currentMouseX += (targetMouseX - currentMouseX) * 0.04;
            currentMouseY += (targetMouseY - currentMouseY) * 0.04;
            currentScrollY += (scrollY - currentScrollY) * 0.05;

            // Camera reacts gently to mouse and page scroll
            camera.position.x = currentMouseX * 2.2;
            camera.position.y = -16 + currentMouseY * 1.3 - (currentScrollY * 0.002);
            camera.lookAt(0, -(currentScrollY * 0.0015), 0);

            // Layered harmonic waves across full background
            const positions = geometry.attributes.position.array;
            for (let i = 0; i < vertexCount; i++) {
                const i3 = i * 3;
                const x = basePositions[i3];
                const y = basePositions[i3 + 1];

                // Continuous rolling topography
                let z = Math.sin(x * 0.18 + time * 0.6) * Math.cos(y * 0.15 + time * 0.45) * 1.1;
                z += Math.sin((x + y) * 0.12 - time * 0.32) * 0.65;
                z += Math.cos(x * 0.26 - y * 0.18 + time * 0.48) * 0.35;

                // Subtle local mouse ripple displacement
                const dx = x - currentMouseX * 12;
                const dy = y - currentMouseY * 8;
                const dist = Math.sqrt(dx * dx + dy * dy);
                z += Math.sin(dist * 0.36 - time * 1.5) * Math.exp(-dist * 0.15) * 0.75;

                positions[i3 + 2] = z;
            }
            geometry.attributes.position.needsUpdate = true;

            // Animate floating embers across full background
            const emberPos = emberGeometry.attributes.position.array;
            for (let i = 0; i < emberCount; i++) {
                const i3 = i * 3;
                const v = emberVelocities[i];
                emberPos[i3 + 2] += v.speedZ;
                if (emberPos[i3 + 2] > 7.5) {
                    emberPos[i3 + 2] = 0.5;
                }
                emberPos[i3] = v.baseX + Math.sin(time * v.freq + v.phase) * 0.45;
            }
            emberGeometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        }

        // Tab visibility management (pause when user switches tabs to save GPU)
        document.addEventListener('visibilitychange', () => {
            isTabVisible = !document.hidden;
            if (isTabVisible) {
                if (!animId) {
                    clock.start();
                    animate();
                }
            } else {
                if (animId) {
                    cancelAnimationFrame(animId);
                    animId = null;
                    clock.stop();
                }
            }
        });

        // 8. Window Resize Handling
        function onResize() {
            if (!canvas || !renderer || !camera) return;
            width = window.innerWidth;
            height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        }

        window.addEventListener('resize', onResize, { passive: true });

        // Kickoff animation loop
        animate();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWaveBackground);
    } else {
        initWaveBackground();
    }
})();
