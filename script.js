document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // 0. PRELOADER / BOOT SEQUENCE
    // =================================================================
    const preloaderText = document.querySelector('.preloader-text');
    const bootSequence = ["BOOTING VigneshOS...", "Loading Profile...", "Identity Verified: VIGNESH", "Initializing Cloud Services...", "Loading Experience Modules...", "Connection Established."];
    let bootIndex = 0;
    const interval = setInterval(() => {
        if (preloaderText) preloaderText.textContent = bootSequence[bootIndex];
        bootIndex++;
        if (bootIndex === bootSequence.length) {
            clearInterval(interval);
            gsap.to('.preloader', { opacity: 0, duration: 0.5, onComplete: () => document.querySelector('.preloader').style.display = 'none' });
        }
    }, 400);

    
    // =================================================================
    // 0. LENOIS SMOOTH SCROLL
    // =================================================================
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // =================================================================
    // 1. GSAP & ANIMATION SETUP
    // =================================================================
    gsap.registerPlugin(ScrollTrigger);

    // =================================================================
    // 2. CURSOR GLOW
    // =================================================================
    const cursorGlow = document.querySelector('.cursor-glow');
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursorGlow, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.5,
            ease: 'power3.out'
        });
    });

    // =================================================================
    // 3. HEADER & NAVLINK ANIMATIONS
    // =================================================================
    gsap.from('header', {
        y: -100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        delay: 3 // Delay for preloader
    });

    // Magnetic Buttons
    const magneticButtons = document.querySelectorAll('.cta-button');
    magneticButtons.forEach(button => {
        const span = button.querySelector('span');
        button.addEventListener('mousemove', (e) => {
            const { offsetX, offsetY } = e;
            const { clientWidth, clientHeight } = button;
            const x = (offsetX / clientWidth) * 2 - 1;
            const y = (offsetY / clientHeight) * 2 - 1;
            gsap.to(span, { x: x * 15, y: y * 15, duration: 0.5, ease: 'power3.out' });
        });
        button.addEventListener('mouseleave', () => {
            gsap.to(span, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        });
    });

    // =================================================================
    // 4. HERO SECTION ANIMATIONS
    // =================================================================
    const heroTimeline = gsap.timeline({ delay: 3 });
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            heroTitle.appendChild(span);
        });
        heroTimeline
            .from(heroTitle.querySelectorAll('span'), {
                opacity: 0,
                y: 80,
                rotateX: -90,
                stagger: 0.05,
                duration: 1,
                ease: 'power4.out'
            })
            .from('.hero-subtitle .subtitle-line', {
                opacity: 0,
                y: 30,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out'
            }, "-=0.5")
            .from('.hero-cta-group .cta-button', {
                opacity: 0,
                y: 30,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out'
            }, "-=0.5");
    }

    // =================================================================
    // 5. BOOT SEQUENCE ANIMATION
    // =================================================================
    gsap.from('.boot-text', {
        opacity: 0,
        duration: 0.1,
        stagger: 0.8,
        scrollTrigger: {
            trigger: '.boot-sequence',
            start: 'top 60%',
            end: 'bottom 70%',
            scrub: 1,
        }
    });

    // =================================================================
    // 7. ECOSYSTEM DIAGRAM
    // =================================================================
    const ecosystem = document.getElementById('ecosystem');
    if (ecosystem) {
        const connectionsSVG = ecosystem.querySelector('.connections');
        const connections = [
            ['internet', 'cloudflare'], ['cloudflare', 'dreamcloud'], ['dreamcloud', 'telegram'], ['dreamcloud', 'web'],
            ['telegram', 'queue'], ['web', 'auth'], ['queue', 'torrent'], ['queue', 'ytdlp'],
            ['torrent', 'downloads'], ['ytdlp', 'downloads'], ['downloads', 'extraction'], ['extraction', 'organizer'],
            ['organizer', 'gdrive'], ['organizer', 'truenas'], ['gdrive', 'media-server'], ['truenas', 'media-server'],
            ['media-server', 'streaming']
        ];

        function drawConnections() {
            connectionsSVG.innerHTML = '';
            connections.forEach(([startId, endId]) => {
                const startNode = document.getElementById(`node-${startId}`);
                const endNode = document.getElementById(`node-${endId}`);
                if (startNode && endNode) {
                    const startRect = startNode.getBoundingClientRect();
                    const endRect = endNode.getBoundingClientRect();
                    const svgRect = connectionsSVG.getBoundingClientRect();

                    const x1 = startRect.left + startRect.width / 2 - svgRect.left;
                    const y1 = startRect.bottom - svgRect.top;
                    const x2 = endRect.left + endRect.width / 2 - svgRect.left;
                    const y2 = endRect.top - svgRect.top;

                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('d', `M${x1} ${y1} C ${x1} ${y1 + 50}, ${x2} ${y2 - 50}, ${x2} ${y2}`);
                    connectionsSVG.appendChild(path);
                }
            });
        }
        
        ScrollTrigger.create({
            trigger: '#ecosystem',
            start: 'top center',
            onEnter: () => {
                drawConnections();
                gsap.fromTo('.ecosystem-diagram .node', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out' });
                gsap.fromTo('.connections path', { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 2, stagger: 0.1, ease: 'power2.out' });
            },
            once: true
        });
        window.addEventListener('resize', drawConnections);
    }
    
    // =================================================================
    // 7. THREE.JS ANIMATED BACKGROUND
    // =================================================================
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('three-bg').appendChild(renderer.domElement);

    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.7 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        stars.rotation.x += 0.0001;
        stars.rotation.y += 0.0001;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // =================================================================
    // 8. TECH STACK GALAXY
    // =================================================================
    const techGalaxy = document.querySelector('.tech-galaxy');
    if (techGalaxy) {
        const planets = techGalaxy.querySelectorAll('.planet');
        const techDetails = techGalaxy.querySelector('.tech-details');
        const techData = {
            frontend: { title: 'Frontend Planet', content: 'Angular, TypeScript, HTML, CSS, RxJS' },
            backend: { title: 'Backend Planet', content: '.NET Core, C#, REST API, Entity Framework' },
            infrastructure: { title: 'Infrastructure Planet', content: 'Docker, TrueNAS, Linux, Cloudflare, Azure' },
            core: { title: 'Core Databases', content: 'SQL Server, MongoDB, SQLite' }
        };

        planets.forEach(planet => {
            planet.addEventListener('mouseenter', () => {
                const type = planet.classList.contains('frontend') ? 'frontend' :
                             planet.classList.contains('backend') ? 'backend' : 'infrastructure';
                techDetails.innerHTML = `<h3>${techData[type].title}</h3><p>${techData[type].content}</p>`;
            });
        });
        techGalaxy.querySelector('.sun').addEventListener('mouseenter', () => {
            techDetails.innerHTML = `<h3>${techData.core.title}</h3><p>${techData.core.content}</p>`;
        });
    }

    // =================================================================
    // 9. TIMELINE ANIMATION
    // =================================================================
    gsap.utils.toArray('.timeline-item').forEach(item => {
        gsap.from(item, {
            opacity: 0,
            y: 50,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    gsap.from('.timeline-line', {
        scaleY: 0,
        transformOrigin: 'top center',
        scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top 80%',
            end: 'bottom 80%',
            scrub: true
        }
    });

    // =================================================================
    // 10. CONTACT TERMINAL
    // =================================================================
    // The terminal logic has been removed and replaced with a new contact section.
    // We can add hover animations to the new contact cards for a premium feel.
    gsap.from('.contact-card', {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 85%'
        }
    });
    
    // =================================================================
    // 11. DREAMCLOUD DASHBOARD - LIVE UPDATES
    // =================================================================
    const dashboard = document.getElementById('dreamcloud-dashboard');
    if (dashboard) {
        gsap.from('.dash-panel', {
            opacity: 0, y: 60, stagger: 0.15, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '#dreamcloud-dashboard', start: 'top 75%' }
        });

        const cpuVal = document.getElementById('cpu-val');
        const ramVal = document.getElementById('ram-val');
        const uploadVal = document.getElementById('upload-val');
        const downloadVal = document.getElementById('download-val');
        const queueVal = document.getElementById('queue-val');
        const completedVal = document.getElementById('completed-val');
        const dockerVal = document.getElementById('docker-val');
        const networkVal = document.getElementById('network-val');

        const ramProgress = document.getElementById('ram-progress');
        const uploadProgress = document.getElementById('upload-progress');
        const networkProgress = document.getElementById('network-progress');

        const storageRing = document.getElementById('storage-ring-fg');
        const storagePercent = document.getElementById('storage-percent');
        const storageDetails = document.getElementById('storage-details');
        const ringCircumference = 2 * Math.PI * 54;
        if (storageRing) storageRing.style.strokeDasharray = ringCircumference;

        function updateTelemetry() {
            if (ramVal && ramProgress) {
                const val = Math.round(gsap.utils.random(45, 78));
                ramVal.textContent = `${val}%`;
                ramProgress.style.width = `${val}%`;
            }
            if (uploadVal && uploadProgress) {
                const val = gsap.utils.random(15, 45, 0.1);
                uploadVal.textContent = `${val.toFixed(1)} MB/s`;
                uploadProgress.style.width = `${Math.min(100, (val / 50) * 100)}%`;
            }
            if (networkVal && networkProgress) {
                const val = gsap.utils.random(0.8, 2.5, 0.1);
                networkVal.textContent = `${val.toFixed(1)} Gbps`;
                networkProgress.style.width = `${Math.min(100, (val / 3) * 100)}%`;
            }
            if (cpuVal) cpuVal.textContent = `${Math.round(gsap.utils.random(25, 55))}%`;
            if (downloadVal) downloadVal.textContent = `${Math.round(gsap.utils.random(80, 160))}.0 MB/s`;
            if (queueVal) queueVal.textContent = Math.round(gsap.utils.random(6, 18));
            if (dockerVal) dockerVal.textContent = `${Math.round(gsap.utils.random(15, 19))} Running`;
            if (completedVal) {
                // Safely parse and increment
                let currentCompleted = parseInt(completedVal.textContent) || 0;
                completedVal.textContent = currentCompleted + (Math.random() > 0.6 ? 1 : 0);
            }

            if (storageRing && storagePercent && storageDetails) {
                let perc = parseFloat(storagePercent.textContent) || 72;
                perc = Math.min(94, perc + gsap.utils.random(0.1, 0.4));
                storagePercent.textContent = `${Math.round(perc)}%`;
                storageDetails.textContent = `${(perc/100*18.2).toFixed(1)} TB of 18.2 TB`;
                const offset = ringCircumference - (perc/100)*ringCircumference;
                gsap.to(storageRing, { strokeDashoffset: offset, duration: 1, ease: 'power2.out' });
            }
        }

        setInterval(updateTelemetry, 1100);
        updateTelemetry();

        // Live Activity Feed
        const activityLog = document.querySelector('#live-activity .terminal-body');
        if (activityLog) {
            const logMessages = [
                 { icon: '⬇', color: '#22C55E', text: 'Torrent downloading: ubuntu-24.04.iso' },
                 { icon: '☁', color: '#F59E0B', text: 'Uploading backup: /media/photos.zip' },
                 { icon: '📥', color: '#3B82F6', text: 'YT-DLP processing: "IMAX 4k"' },
                 { icon: '🎬', color: '#8B5CF6', text: 'Transcoding: Jananayagan.H.24.2160p.DD+7.1.mkv to mp4' },
                 { icon: '📦', color: '#94A3B8', text: 'Unzipping archive: project-files.zip' },
                 { icon: '⬇', color: '#22C55E', text: 'Torrent downloading: Windows-11-Professional.iso' },
                  { icon: '☁', color: '#F59E0B', text: 'Uploading bundle: /localDisk:D/data.tar' },
                  { icon: '⬇', color: '#22C55E', text: 'Torrent downloading: Ubuntu-24.04-LTS-Desktop.iso' },
    { icon: '🎬', color: '#8B5CF6', text: 'Transcoding: Interstellar.2014.2160p.HEVC → H.264 MP4' },
    { icon: '📥', color: '#3B82F6', text: 'YT-DLP downloading: Apple WWDC 2026 Keynote (4K60)' },
    { icon: '☁', color: '#F59E0B', text: 'Uploading backup: /Media/Photos/2026-Archive.zip to Google Drive' },
    { icon: '🤖', color: '#06B6D4', text: 'Telegram Bot: Processing /mirror command from @dreamcloud_user' },
    { icon: '📦', color: '#94A3B8', text: 'Extracting archive: Linux.ISO.Collection.part01.rar' },
    { icon: '🌐', color: '#F97316', text: 'Cloudflare Tunnel connected • Public endpoint secured with SSL' },
    { icon: '🐳', color: '#0EA5E9', text: 'Docker: Restarted qBittorrent container after health check' },
    { icon: '💾', color: '#14B8A6', text: 'TrueNAS: Snapshot created for Media dataset successfully' },
    { icon: '🗄', color: '#6366F1', text: 'MongoDB: Authentication session refreshed for Telegram Bot' },
    { icon: '🎵', color: '#EC4899', text: 'Navidrome: Added 124 new songs and updated music index' },
    { icon: '📺', color: '#7C3AED', text: 'Jellyfin: Refreshing movie library and downloading metadata' },
    { icon: '🔀', color: '#EF4444', text: 'GitHub: DreamCloud repository synchronized with origin/main' },
    { icon: '🚀', color: '#38BDF8', text: 'Deploying latest DreamCloud build via Cloudflare Tunnel' },
    { icon: '🛡', color: '#10B981', text: 'Security Scan: No malware detected in newly downloaded files' },
    { icon: '⚡', color: '#FACC15', text: 'Queue Manager: Prioritizing 8 active download tasks automatically' },
    { icon: '📂', color: '#A78BFA', text: 'Media Organizer: Sorting files into Movies, TV Shows and Music' },
    { icon: '🧠', color: '#C084FC', text: 'Generating AI metadata and artwork for newly imported media' },
    { icon: '🔄', color: '#06B6D4', text: 'Cloud Sync: Synchronizing DreamCloud storage with Google Drive' },
    { icon: '⚙', color: '#64748B', text: 'System Maintenance: Cleaning cache, optimizing database and verifying storage integrity' }
            ];

            const addLogEntry = () => {
                if (activityLog.children.length > 7) {
                     gsap.to(activityLog.firstChild, {opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0, margin: 0, onComplete: () => activityLog.firstChild.remove()});
                }
                const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
                const entry = document.createElement('div');
                entry.className = 'log-entry';
                entry.innerHTML = `<span style="color:${msg.color}">${msg.icon}</span> <span>${msg.text}</span>`;
                
                activityLog.appendChild(entry);
                gsap.from(entry, {opacity: 0, x: -20, duration: 0.5, ease: 'power2.out'});
                activityLog.scrollTop = activityLog.scrollHeight;
            };

            setInterval(addLogEntry, 2200);
            addLogEntry();
        }
    }
});
