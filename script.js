document.addEventListener('DOMContentLoaded', () => {
    // Number Counter Animation
    const stats = document.querySelectorAll('.count');
    
    const animateStats = () => {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const speed = 200; // Lower is faster
            
            const updateCount = () => {
                const count = +stat.innerText;
                const inc = target / speed;

                if (count < target) {
                    stat.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    stat.innerText = target;
                }
            };
            
            updateCount();
        });
    };

    // Intersection Observer for triggering animations when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stats-container')) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        observer.observe(statsContainer);
    }

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fake Download Logic (just for effect) - DISABLED for direct link
    // The buttons now point directly to fatality.zip, but we can keep the effect if it's not a link
    const downloadBtns = document.querySelectorAll('.btn-primary');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if(href && href.includes('.zip')) {
                // Allow default download
                return; 
            }
            
            if(btn.getAttribute('href') === '#download') return; 
            
            // ... (rest of logic)
        });
    });

    // Parallax effect for Orbs
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const orb1 = document.querySelector('.orb-1');
        const orb2 = document.querySelector('.orb-2');
        
        if(orb1) orb1.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        if(orb2) orb2.style.transform = `translate(-${x * 30}px, -${y * 30}px)`;
    });

    // Fetch Real Discord Stats
    async function fetchDiscordStats() {
        try {
            const response = await fetch('https://discord.com/api/v9/invites/7wMHk9EWZs?with_counts=true');
            if (response.ok) {
                const data = await response.json();
                const memberCount = data.approximate_member_count;
                const onlineCount = data.approximate_presence_count;

                const memberEl = document.getElementById('member-count');
                const onlineEl = document.getElementById('online-count');

                if (memberEl) memberEl.setAttribute('data-target', memberCount);
                if (onlineEl) onlineEl.setAttribute('data-target', onlineCount);
            }
        } catch (e) {
            console.log('Could not fetch live stats, using defaults');
        }
    }
    
    // Initial fetch
    fetchDiscordStats();
    
    // Auto-update every 10 seconds
    setInterval(fetchDiscordStats, 10000);

    // Video Player Logic
    const videoContainer = document.getElementById('videoContainer');
    const video = document.getElementById('tutorialVideo');

    if (videoContainer && video) {
        videoContainer.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                videoContainer.classList.add('playing');
            } else {
                video.pause();
                videoContainer.classList.remove('playing');
            }
        });

        video.addEventListener('ended', () => {
            videoContainer.classList.remove('playing');
        });
        
        video.addEventListener('pause', () => {
             videoContainer.classList.remove('playing');
        });
        
        video.addEventListener('play', () => {
             videoContainer.classList.add('playing');
        });
    }

    // === GITHUB CONFIGURATION ===
    // ЗАМЕНИТЕ ЭТО НА ВАШ РЕПОЗИТОРИЙ (например: "Andrew/FatalityExec")
    const GITHUB_REPO = "andrew20021214-ops/executorsite"; 
    // ============================

    // Fetch Last Updated & Download Link from GitHub
    async function fetchGitHubData() {
        try {
            // Если пользователь еще не поменял настройки, не делаем запрос
            if (GITHUB_REPO.includes("YOUR_USERNAME")) {
                console.log("Please configure GITHUB_REPO in script.js");
                return;
            }

            const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
            if (response.ok) {
                const data = await response.json();
                
                // 1. Update Date
                const date = new Date(data.published_at);
                const now = new Date();
                const diff = (now - date) / 1000;
                
                let timeString;
                if (diff < 60) timeString = "Just now";
                else if (diff < 3600) timeString = `${Math.floor(diff / 60)} min ago`;
                else if (diff < 86400 && date.getDate() === now.getDate()) {
                    timeString = `Today at ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                } else timeString = date.toLocaleDateString();

                const lastUpdatedEl = document.getElementById('last-updated');
                if (lastUpdatedEl) lastUpdatedEl.innerText = timeString;

                // 2. Update Download Link
                // Ищем файл fatality.zip в ассетах релиза
                const asset = data.assets.find(a => a.name === "fatality.zip");
                if (asset) {
                    const downloadBtns = document.querySelectorAll('.btn-primary');
                    downloadBtns.forEach(btn => {
                        // Меняем href и target для открытия в новой вкладке
                        if (btn.tagName === 'A') {
                            btn.href = asset.browser_download_url;
                            btn.target = "_blank";
                            
                            // Добавляем эффект открытия модального окна
                            btn.addEventListener('click', () => {
                                const modal = document.getElementById('downloadModal');
                                if (modal) modal.classList.add('active');
                            });
                        } else {
                            // Если вдруг это кнопка (старый вариант)
                            btn.onclick = () => {
                                window.open(asset.browser_download_url, '_blank');
                                const modal = document.getElementById('downloadModal');
                                if (modal) modal.classList.add('active');
                            };
                        }
                    });
                }
            }
        } catch (e) {
            console.log('Could not fetch GitHub data');
        }
    }
    fetchGitHubData();

    // Disable Right Click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Disable F12 and DevTools shortcuts
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
            (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
            (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
        ) {
            e.preventDefault();
        }
    });
});
