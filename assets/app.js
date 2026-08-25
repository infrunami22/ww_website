// ============================================
// WW
// Production-Grade Static Web App
// ============================================

(function() {
    'use strict';

    // ============================================
    // Configuration
    // ============================================
    
    const CONFIG = {
        timezone: 'Europe/Budapest',
        imageBaseUrl: '', // Set to empty for local repo mode, or URL for separate image repo
        dataPath: {
            current: 'data/current.json', // Legacy fallback
            weekConfig: 'data/week-config.json',
            currentA: 'data/current-a.json',
            currentB: 'data/current-b.json',
            archive: 'data/archive.json',
            legacyExample: 'data/legacy-import-example.txt'
        }
    };

    // ============================================
    // State Management
    // ============================================
    
    const state = {
        currentWeek: null,
        archive: [],
        theme: localStorage.getItem('ww-theme') || 'light',
        countdownInterval: null,
        lightboxImages: [],
        lightboxIndex: 0,
        imgurCache: {} // Cache for resolved Imgur album URLs
    };

    // ============================================
    // Date & Timezone Utilities
    // ============================================
    
    /**
     * Get current date/time in Europe/Budapest timezone
     */
    function getCurrentBudapestTime() {
        return new Date(new Date().toLocaleString('en-US', { timeZone: CONFIG.timezone }));
    }

    /**
     * Check if the current week is revealed
     */
    function isRevealed(revealAtISO) {
        if (!revealAtISO) return false;
        const revealDate = new Date(revealAtISO);
        const now = getCurrentBudapestTime();
        return now >= revealDate;
    }

    /**
     * Calculate time difference for countdown
     */
    function getTimeDifference(revealAtISO) {
        const revealDate = new Date(revealAtISO);
        const now = getCurrentBudapestTime();
        const diff = revealDate - now;

        if (diff <= 0) {
            return null;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    }

    /**
     * Format date for display
     */
    function formatDate(isoString) {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: CONFIG.timezone
        }).format(date);
    }

    // ============================================
    // Image URL Resolution
    // ============================================
    
    /**
     * Fetch and cache Imgur album images
     */
    async function cacheImgurAlbums(imageUrls) {
        const albumUrls = imageUrls.filter(url => url && url.includes('imgur.com/a/'));
        
        for (const albumUrl of albumUrls) {
            // Skip if already cached
            if (state.imgurCache[albumUrl]) continue;
            
            try {
                const albumId = albumUrl.match(/imgur\.com\/a\/([a-zA-Z0-9]+)/);
                if (albumId && albumId[1]) {
                    console.log(`Fetching image from Imgur album: ${albumId[1]}`);
                    
                    // Fetch the album page HTML
                    const response = await fetch(`https://imgur.com/a/${albumId[1]}`);
                    const html = await response.text();
                    
                    // Extract the first image URL from the HTML
                    // Look for pattern: "url":"https://i.imgur.com/XXX.jpg"
                    const imageMatch = html.match(/"url":"(https?:[^"]+i\.imgur\.com[^"]+)"/);
                    if (imageMatch) {
                        // Unescape the URL (replace \/ with /)
                        const imageUrl = imageMatch[1].replace(/\\\//g, '/');
                        console.log(`Cached album ${albumId[1]} -> ${imageUrl}`);
                        state.imgurCache[albumUrl] = imageUrl;
                    } else {
                        console.error(`Could not extract image from album: ${albumId[1]}`);
                        state.imgurCache[albumUrl] = null; // Cache the failure
                    }
                }
            } catch (error) {
                console.error(`Error fetching Imgur album ${albumUrl}:`, error);
                state.imgurCache[albumUrl] = null; // Cache the failure
            }
        }
    }

    /**
     * Resolve image URL based on configuration
     */
    function resolveImageUrl(path) {
        if (!path) return 'assets/placeholders/default.jpg';
        
        // If it's already a full URL
        if (path.startsWith('http://') || path.startsWith('https://')) {
            // Check if this is a cached Imgur album
            if (path.includes('imgur.com/a/') && state.imgurCache[path]) {
                if (state.imgurCache[path] === null) {
                    // Failed to resolve, use placeholder
                    return 'assets/placeholders/default.jpg';
                }
                // Use cached direct image URL
                path = state.imgurCache[path];
            }
            
            // Add cache buster to prevent stale images
            const separator = path.includes('?') ? '&' : '?';
            return `${path}${separator}_=${Date.now()}`;
        }
        
        // For relative paths
        if (CONFIG.imageBaseUrl) {
            // Remove leading './' if present
            const cleanPath = path.replace(/^\.\//, '');
            return `${CONFIG.imageBaseUrl.replace(/\/$/, '')}/${cleanPath}`;
        }
        
        // Add cache buster to local images too
        return `${path}?_=${Date.now()}`;
    }

    // ============================================
    // Data Loading
    // ============================================
    
    async function loadData() {
        try {
            // Add cache-busting timestamp to prevent stale data
            const cacheBuster = `?t=${Date.now()}`;
            
            console.log('Loading data with cache buster:', cacheBuster);
            
            // Try to load from separate files first (new format)
            const [weekConfigRes, currentARes, currentBRes, archiveRes] = await Promise.all([
                fetch(CONFIG.dataPath.weekConfig + cacheBuster, { cache: 'no-store' }).catch(() => null),
                fetch(CONFIG.dataPath.currentA + cacheBuster, { cache: 'no-store' }).catch(() => null),
                fetch(CONFIG.dataPath.currentB + cacheBuster, { cache: 'no-store' }).catch(() => null),
                fetch(CONFIG.dataPath.archive + cacheBuster, { cache: 'no-store' })
            ]);

            if (!archiveRes.ok) {
                throw new Error('Failed to load archive data');
            }

            const archiveData = await archiveRes.json();
            state.archive = archiveData.entries || [];

            // Check if we have the new separate file format
            if (weekConfigRes && weekConfigRes.ok && currentARes && currentARes.ok && currentBRes && currentBRes.ok) {
                console.log('Loading from separate files (new format)');
                const weekConfig = await weekConfigRes.json();
                const currentA = await currentARes.json();
                const currentB = await currentBRes.json();

                console.log('Week config:', weekConfig);
                console.log('Participant A:', currentA);
                console.log('Participant B:', currentB);

                // Merge the separate files into currentWeek structure
                state.currentWeek = {
                    weekId: weekConfig.weekId,
                    season: weekConfig.season,
                    revealAt: weekConfig.revealAt,
                    timezone: weekConfig.timezone,
                    contestantA: weekConfig.contestantA,
                    contestantB: weekConfig.contestantB,
                    nomineeA: currentA.nominee,
                    nomineeB: currentB.nominee,
                    status: weekConfig.status,
                    notes: weekConfig.notes
                };

                // Update config if provided
                if (weekConfig.site) {
                    if (weekConfig.site.imageBaseUrl) {
                        CONFIG.imageBaseUrl = weekConfig.site.imageBaseUrl;
                    }
                }
            } else {
                // Fallback to legacy single file format
                console.log('Loading from legacy single file format');
                const currentRes = await fetch(CONFIG.dataPath.current + cacheBuster, { cache: 'no-store' });
                if (!currentRes.ok) {
                    throw new Error('Failed to load current week data');
                }
                const currentData = await currentRes.json();
                state.currentWeek = currentData.currentWeek;

                // Update config if provided
                if (currentData.site) {
                    if (currentData.site.imageBaseUrl) {
                        CONFIG.imageBaseUrl = currentData.site.imageBaseUrl;
                    }
                }
            }

            console.log('Final merged currentWeek:', state.currentWeek);
            
            // Cache Imgur album images
            const allImageUrls = [];
            if (state.currentWeek) {
                if (state.currentWeek.nomineeA && state.currentWeek.nomineeA.imageUrls) {
                    allImageUrls.push(...state.currentWeek.nomineeA.imageUrls);
                }
                if (state.currentWeek.nomineeB && state.currentWeek.nomineeB.imageUrls) {
                    allImageUrls.push(...state.currentWeek.nomineeB.imageUrls);
                }
            }
            state.archive.forEach(entry => {
                if (entry.nomineeA && entry.nomineeA.imageUrls) {
                    allImageUrls.push(...entry.nomineeA.imageUrls);
                }
                if (entry.nomineeB && entry.nomineeB.imageUrls) {
                    allImageUrls.push(...entry.nomineeB.imageUrls);
                }
            });
            
            await cacheImgurAlbums(allImageUrls);
            
            return true;
        } catch (error) {
            console.error('Error loading data:', error);
            showError('Failed to load data. Please check that data files exist.');
            return false;
        }
    }

    // ============================================
    // Rendering - Current Week
    // ============================================
    
    function renderCurrentWeek() {
        if (!state.currentWeek) {
            document.getElementById('currentWeekSection').innerHTML = 
                '<div class="empty-state"><div class="empty-state-icon">📅</div><p>No current week data available.</p></div>';
            return;
        }

        const week = state.currentWeek;
        const revealed = isRevealed(week.revealAt);

        // Update title
        document.getElementById('currentWeekTitle').textContent = 
            `Week ${week.weekId} - ${week.season}`;

        // Update reveal status badge
        const statusEl = document.getElementById('revealStatus');
        statusEl.className = `reveal-status ${revealed ? 'revealed' : 'locked'}`;
        statusEl.textContent = revealed ? '✓ Revealed' : '🔒 Locked';

        // Render countdown
        renderCountdown(week.revealAt, revealed);

        // Render contestant cards
        renderContestantCards(week, revealed);
    }

    function renderCountdown(revealAtISO, revealed) {
        const container = document.getElementById('countdownContainer');
        
        if (revealed) {
            container.innerHTML = '<div class="countdown"><div class="countdown-display">Revealed! 🎉</div></div>';
            if (state.countdownInterval) {
                clearInterval(state.countdownInterval);
            }
            return;
        }

        function updateCountdown() {
            const diff = getTimeDifference(revealAtISO);
            if (!diff) {
                renderCurrentWeek(); // Re-render when revealed
                return;
            }

            const display = document.getElementById('countdownDisplay');
            if (display) {
                display.textContent = 
                    `${diff.days}d ${String(diff.hours).padStart(2, '0')}h ${String(diff.minutes).padStart(2, '0')}m ${String(diff.seconds).padStart(2, '0')}s`;
            }
        }

        updateCountdown();
        if (state.countdownInterval) {
            clearInterval(state.countdownInterval);
        }
        state.countdownInterval = setInterval(updateCountdown, 1000);
    }

    function renderContestantCards(week, revealed) {
        const container = document.getElementById('contestantCards');
        const cards = [
            { contestant: week.contestantA, nominee: week.nomineeA, key: 'A' },
            { contestant: week.contestantB, nominee: week.nomineeB, key: 'B' }
        ];

        container.innerHTML = cards.map(({ contestant, nominee, key }) => {
            const imageUrl = nominee.imageUrls && nominee.imageUrls[0] 
                ? resolveImageUrl(nominee.imageUrls[0]) 
                : 'assets/placeholders/default.jpg';

            // Log the image URL for debugging
            console.log(`Rendering ${contestant}'s image:`, imageUrl);

            return `
                <div class="contestant-card ${revealed ? 'revealed' : 'locked'}">
                    <div class="card-header">
                        <h3 class="contestant-name">${escapeHtml(contestant)}</h3>
                        <span class="card-badge ${revealed ? 'revealed' : 'locked'}">
                            ${revealed ? 'Revealed' : 'Locked'}
                        </span>
                    </div>
                    
                    <div class="nominee-image-container">
                        <img src="${imageUrl}" 
                             alt="${revealed ? escapeHtml(nominee.womanName) : 'Hidden'}" 
                             class="nominee-image"
                             onerror="console.error('Image failed to load:', this.src); this.onerror=null; this.src='assets/placeholders/default.jpg';">
                        ${!revealed ? `
                            <div class="locked-overlay">
                                <div class="locked-icon">🔒</div>
                                <div class="locked-text">Locked until Wednesday 12:00</div>
                                <div class="locked-text" style="font-size: 0.875rem; margin-top: 0.5rem;">
                                    ${escapeHtml(nominee.shortDescription || 'Nominee ready')}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    ${revealed ? `
                        <div class="nominee-info">
                            <h3>${escapeHtml(nominee.womanName)}</h3>
                            <p class="nominee-description">${escapeHtml(nominee.shortDescription)}</p>
                            ${nominee.tags && nominee.tags.length > 0 ? `
                                <div class="nominee-tags">
                                    ${nominee.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                                </div>
                            ` : ''}
                            <div class="card-action">
                                <button class="button secondary" onclick="window.wwApp.showNomineeDetails('${key}')">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ` : `
                        <div class="nominee-info">
                            <h3>???</h3>
                            <p class="nominee-description text-muted">Reveal on ${formatDate(week.revealAt)}</p>
                        </div>
                    `}
                </div>
            `;
        }).join('');
    }

    // ============================================
    // Rendering - Archive
    // ============================================
    
    function renderArchive(filteredEntries = null) {
        const entries = filteredEntries || state.archive;
        const container = document.getElementById('archiveGrid');

        if (entries.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📦</div><p>No archive entries found.</p></div>';
            return;
        }

        // Populate filter dropdowns
        populateFilterDropdowns();

        container.innerHTML = entries.map(entry => {
            return `
                <div class="archive-item" onclick="window.wwApp.showArchiveDetails('${entry.weekId}')">
                    <div class="archive-item-header">
                        <span class="archive-week">Week ${entry.weekId}</span>
                        <span class="archive-date">${formatDate(entry.revealAt)}</span>
                    </div>
                    <div class="archive-nominees">
                        <div class="archive-nominee">
                            <strong>${escapeHtml(entry.contestantA)}</strong>: ${escapeHtml(entry.nomineeA.womanName)}
                        </div>
                        <div class="archive-nominee">
                            <strong>${escapeHtml(entry.contestantB)}</strong>: ${escapeHtml(entry.nomineeB.womanName)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function populateFilterDropdowns() {
        // Get unique years
        const years = [...new Set(state.archive.map(e => e.season))].sort().reverse();
        const yearFilter = document.getElementById('archiveYearFilter');
        yearFilter.innerHTML = '<option value="">All Years</option>' + 
            years.map(year => `<option value="${year}">${year}</option>`).join('');

        // Get unique contestants
        const contestants = new Set();
        state.archive.forEach(e => {
            contestants.add(e.contestantA);
            contestants.add(e.contestantB);
        });
        const contestantFilter = document.getElementById('archiveContestantFilter');
        contestantFilter.innerHTML = '<option value="">All Contestants</option>' + 
            [...contestants].sort().map(c => `<option value="${c}">${c}</option>`).join('');
    }

    function filterArchive() {
        const searchTerm = document.getElementById('archiveSearch').value.toLowerCase();
        const yearFilter = document.getElementById('archiveYearFilter').value;
        const contestantFilter = document.getElementById('archiveContestantFilter').value;

        const filtered = state.archive.filter(entry => {
            const matchesSearch = !searchTerm || 
                entry.nomineeA.womanName.toLowerCase().includes(searchTerm) ||
                entry.nomineeB.womanName.toLowerCase().includes(searchTerm) ||
                entry.contestantA.toLowerCase().includes(searchTerm) ||
                entry.contestantB.toLowerCase().includes(searchTerm);

            const matchesYear = !yearFilter || entry.season === yearFilter;

            const matchesContestant = !contestantFilter || 
                entry.contestantA === contestantFilter || 
                entry.contestantB === contestantFilter;

            return matchesSearch && matchesYear && matchesContestant;
        });

        renderArchive(filtered);
    }

    // ============================================
    // Modal Management
    // ============================================
    
    function showNomineeDetails(contestantKey) {
        if (!state.currentWeek) return;

        const week = state.currentWeek;
        const contestant = contestantKey === 'A' ? week.contestantA : week.contestantB;
        const nominee = contestantKey === 'A' ? week.nomineeA : week.nomineeB;

        const modal = document.getElementById('detailModal');
        const modalBody = document.getElementById('modalBody');

        const images = nominee.imageUrls || [];
        const imageGallery = images.length > 0 ? `
            <div class="modal-image-gallery">
                ${images.map((url, idx) => `
                    <div class="modal-image-item" onclick="window.wwApp.openLightbox(${JSON.stringify(images.map(u => resolveImageUrl(u)))}, ${idx})">
                        <img src="${resolveImageUrl(url)}" 
                             alt="${escapeHtml(nominee.womanName)} - Image ${idx + 1}"
                             onerror="this.src='assets/placeholders/default.jpg'">
                    </div>
                `).join('')}
            </div>
        ` : '';

        modalBody.innerHTML = `
            <h2 class="modal-title">${escapeHtml(nominee.womanName)}</h2>
            <p class="modal-subtitle">Nominated by ${escapeHtml(contestant)} - Week ${week.weekId}, ${week.season}</p>
            
            ${nominee.tags && nominee.tags.length > 0 ? `
                <div class="nominee-tags">
                    ${nominee.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}

            ${imageGallery}

            <div style="margin-top: 1.5rem;">
                <h3>About</h3>
                <p>${escapeHtml(nominee.longerDescription || nominee.shortDescription)}</p>
            </div>

            ${nominee.sourceNote ? `
                <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.875rem;">
                    <em>Note: ${escapeHtml(nominee.sourceNote)}</em>
                </div>
            ` : ''}
        `;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function showArchiveDetails(weekId) {
        const entry = state.archive.find(e => e.weekId === weekId);
        if (!entry) return;

        const modal = document.getElementById('detailModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <h2 class="modal-title">Week ${entry.weekId} - ${entry.season}</h2>
            <p class="modal-subtitle">Revealed on ${formatDate(entry.revealAt)}</p>

            <div style="margin-top: 2rem;">
                <h3>${escapeHtml(entry.contestantA)}'s Nominee</h3>
                <h4 style="color: var(--accent-primary); margin: 0.5rem 0;">${escapeHtml(entry.nomineeA.womanName)}</h4>
                <p>${escapeHtml(entry.nomineeA.longerDescription || entry.nomineeA.shortDescription)}</p>
                ${entry.nomineeA.tags && entry.nomineeA.tags.length > 0 ? `
                    <div class="nominee-tags" style="margin-top: 0.5rem;">
                        ${entry.nomineeA.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
                ${entry.nomineeA.imageUrls && entry.nomineeA.imageUrls.length > 0 ? `
                    <div class="modal-image-gallery" style="margin-top: 1rem;">
                        ${entry.nomineeA.imageUrls.map((url, idx) => `
                            <div class="modal-image-item" onclick="window.wwApp.openLightbox(${JSON.stringify(entry.nomineeA.imageUrls.map(u => resolveImageUrl(u)))}, ${idx})">
                                <img src="${resolveImageUrl(url)}" 
                                     alt="${escapeHtml(entry.nomineeA.womanName)} - Image ${idx + 1}"
                                     onerror="this.src='assets/placeholders/default.jpg'">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>

            <div style="margin-top: 2rem;">
                <h3>${escapeHtml(entry.contestantB)}'s Nominee</h3>
                <h4 style="color: var(--accent-primary); margin: 0.5rem 0;">${escapeHtml(entry.nomineeB.womanName)}</h4>
                <p>${escapeHtml(entry.nomineeB.longerDescription || entry.nomineeB.shortDescription)}</p>
                ${entry.nomineeB.tags && entry.nomineeB.tags.length > 0 ? `
                    <div class="nominee-tags" style="margin-top: 0.5rem;">
                        ${entry.nomineeB.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
                ${entry.nomineeB.imageUrls && entry.nomineeB.imageUrls.length > 0 ? `
                    <div class="modal-image-gallery" style="margin-top: 1rem;">
                        ${entry.nomineeB.imageUrls.map((url, idx) => `
                            <div class="modal-image-item" onclick="window.wwApp.openLightbox(${JSON.stringify(entry.nomineeB.imageUrls.map(u => resolveImageUrl(u)))}, ${idx})">
                                <img src="${resolveImageUrl(url)}" 
                                     alt="${escapeHtml(entry.nomineeB.womanName)} - Image ${idx + 1}"
                                     onerror="this.src='assets/placeholders/default.jpg'">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // ============================================
    // Lightbox
    // ============================================
    
    function openLightbox(images, startIndex = 0) {
        state.lightboxImages = images;
        state.lightboxIndex = startIndex;
        showLightboxImage();
        
        const modal = document.getElementById('lightboxModal');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function showLightboxImage() {
        const img = document.getElementById('lightboxImage');
        const caption = document.getElementById('lightboxCaption');
        
        img.src = state.lightboxImages[state.lightboxIndex];
        caption.textContent = `Image ${state.lightboxIndex + 1} of ${state.lightboxImages.length}`;
    }

    function navigateLightbox(direction) {
        state.lightboxIndex += direction;
        
        if (state.lightboxIndex < 0) {
            state.lightboxIndex = state.lightboxImages.length - 1;
        } else if (state.lightboxIndex >= state.lightboxImages.length) {
            state.lightboxIndex = 0;
        }
        
        showLightboxImage();
    }

    // ============================================
    // Theme Management
    // ============================================
    
    function initTheme() {
        document.documentElement.setAttribute('data-theme', state.theme);
    }

    function toggleTheme() {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', state.theme);
        localStorage.setItem('ww-theme', state.theme);
    }

    // ============================================
    // Admin Panel - Week Entry
    // ============================================
    
    // ============================================
    // Admin Panel - Deadline Checking
    // ============================================
    
    function checkDeadline(contestant) {
        if (!state.currentWeek) return;
        
        const revealDate = new Date(state.currentWeek.revealAt);
        const now = getCurrentBudapestTime();
        
        // Deadline is 1 minute before reveal (08:59 AM on Wednesday)
        const deadline = new Date(revealDate.getTime() - 60000);
        
        const warningEl = document.getElementById(`deadlineWarning${contestant}`);
        
        if (now >= deadline) {
            warningEl.style.display = 'block';
            warningEl.innerHTML = '<strong>⚠️ Deadline Passed</strong><br>The editing deadline (Wednesday 12:00 Budapest time) has passed. You can no longer modify this week\'s entry.';
            
            // Disable form
            const form = document.getElementById(`contestant${contestant}Form`);
            const inputs = form.querySelectorAll('input, textarea, button');
            inputs.forEach(input => input.disabled = true);
        } else {
            warningEl.style.display = 'none';
            
            // Show time remaining
            const diff = deadline - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            if (hours < 24) {
                warningEl.style.display = 'block';
                warningEl.innerHTML = `<strong>⏰ Deadline Reminder</strong><br>You have ${hours} hours and ${minutes} minutes left to edit (until Wednesday 12:00 Budapest time).`;
                warningEl.style.backgroundColor = '#fff3cd';
                warningEl.style.borderColor = '#ffc107';
            }
        }
    }

    // ============================================
    // Admin Panel - Load Current Nominee
    // ============================================
    
    async function loadCurrentNominee(contestant) {
        try {
            // Load from separate file based on contestant
            const filePath = contestant === 'A' ? CONFIG.dataPath.currentA : CONFIG.dataPath.currentB;
            const cacheBuster = `?t=${Date.now()}`;
            const response = await fetch(filePath + cacheBuster, { cache: 'no-store' });
            
            if (!response.ok) {
                throw new Error(`Could not load ${filePath}`);
            }
            
            const data = await response.json();
            const nominee = data.nominee;
            const suffix = 'Solo';
            
            // Populate form
            document.getElementById(`nominee${contestant}Name${suffix}`).value = nominee.womanName || '';
            document.getElementById(`nominee${contestant}Short${suffix}`).value = nominee.shortDescription || '';
            document.getElementById(`nominee${contestant}Long${suffix}`).value = nominee.longerDescription || '';
            document.getElementById(`nominee${contestant}Tags${suffix}`).value = nominee.tags ? nominee.tags.join(', ') : '';
            
            // Populate image URLs
            const imageInputs = document.querySelectorAll(`input.image-path-input[data-contestant="${contestant}${suffix}"]`);
            if (nominee.imageUrls) {
                nominee.imageUrls.forEach((url, index) => {
                    if (imageInputs[index]) {
                        imageInputs[index].value = url;
                    }
                });
            }
            
            alert('Your current data has been loaded!');
        } catch (error) {
            alert(`Could not load current data. Make sure current-${contestant.toLowerCase()}.json exists and is valid.`);
            console.error(error);
        }
    }

    // ============================================
    // Admin Panel - Generate Nominee JSON
    // ============================================
    
    function generateNomineeJSON(contestant) {
        const suffix = 'Solo';
        const form = document.getElementById(`contestant${contestant}Form`);
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const nominee = collectNomineeData(contestant + suffix);
        
        // For separate files, wrap in the expected structure
        const output = {
            participantName: `Participant ${contestant}`,
            nominee: nominee
        };
        
        const jsonOutput = JSON.stringify(output, null, 2);
        
        document.getElementById(`jsonOutput${contestant}`).value = jsonOutput;
        document.getElementById(`outputSection${contestant}`).style.display = 'block';
        document.getElementById(`outputSection${contestant}`).scrollIntoView({ behavior: 'smooth' });
    }

    // ============================================
    // Admin Panel - Copy to Clipboard
    // ============================================
    
    function copyToClipboard(textareaId) {
        const textarea = document.getElementById(textareaId);
        textarea.select();
        document.execCommand('copy');
        alert('JSON copied to clipboard!');
    }

    // ============================================
    // Admin Panel - Week Entry
    // ============================================
    
    function setupAdminPanel() {
        // Tab switching
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                document.querySelectorAll('.admin-tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                document.getElementById(`${tabName}Tab`).style.display = 'block';
                
                // Check deadline when switching to contestant tabs
                if (tabName === 'contestantA' || tabName === 'contestantB') {
                    checkDeadline(tabName === 'contestantA' ? 'A' : 'B');
                }
            });
        });

        // Contestant A handlers
        document.getElementById('loadCurrentA').addEventListener('click', () => loadCurrentNominee('A'));
        document.getElementById('generateAJSON').addEventListener('click', () => generateNomineeJSON('A'));
        document.getElementById('copyJSONA').addEventListener('click', () => copyToClipboard('jsonOutputA'));

        // Contestant B handlers
        document.getElementById('loadCurrentB').addEventListener('click', () => loadCurrentNominee('B'));
        document.getElementById('generateBJSON').addEventListener('click', () => generateNomineeJSON('B'));
        document.getElementById('copyJSONB').addEventListener('click', () => copyToClipboard('jsonOutputB'));

        // Week Setup handlers (full week entry)
        document.getElementById('generateFilenames').addEventListener('click', generateFilenameSuggestions);
        document.getElementById('generateJSON').addEventListener('click', generateWeekJSON);
        document.getElementById('copyJSON').addEventListener('click', () => copyToClipboard('jsonOutput'));
        document.getElementById('downloadJSON').addEventListener('click', downloadJSON);
        
        // Initial deadline check
        checkDeadline('A');
    }

    function generateFilenameSuggestions() {
        const weekId = document.getElementById('weekId').value;
        const season = document.getElementById('season').value;
        const contestantA = document.getElementById('contestantAName').value.toLowerCase();
        const contestantB = document.getElementById('contestantBName').value.toLowerCase();
        const nomineeA = document.getElementById('nomineeAName').value;
        const nomineeB = document.getElementById('nomineeBName').value;

        if (!weekId || !season || !contestantA || !contestantB) {
            alert('Please fill in Week ID, Season, and Contestant names first.');
            return;
        }

        const slugA = createSlug(nomineeA);
        const slugB = createSlug(nomineeB);

        const suggestions = `
Suggested Filenames for Week ${weekId}:

Contestant A (${contestantA}):
- assets/images/${season}-w${weekId}-${contestantA}-${slugA}-01.webp
- assets/images/${season}-w${weekId}-${contestantA}-${slugA}-02.webp
- assets/images/${season}-w${weekId}-${contestantA}-${slugA}-03.webp

Contestant B (${contestantB}):
- assets/images/${season}-w${weekId}-${contestantB}-${slugB}-01.webp
- assets/images/${season}-w${weekId}-${contestantB}-${slugB}-02.webp
- assets/images/${season}-w${weekId}-${contestantB}-${slugB}-03.webp

Instructions:
1. Optimize your images (WebP format recommended, max 2MB each)
2. Rename files using the suggestions above
3. Commit files to your repository in the assets/images/ folder
4. Enter the file paths in the "Image Paths" fields above
5. Generate JSON
        `.trim();

        document.getElementById('filenameSection').style.display = 'block';
        document.getElementById('filenameOutput').textContent = suggestions;
    }

    function generateWeekJSON() {
        const form = document.getElementById('weekEntryForm');
        
        // Validate required fields
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Collect form data
        const weekData = {
            weekId: document.getElementById('weekId').value,
            season: document.getElementById('season').value,
            revealAt: `${document.getElementById('revealDate').value}T${document.getElementById('revealTime').value}:00+01:00`,
            timezone: CONFIG.timezone,
            contestantA: document.getElementById('contestantAName').value,
            contestantB: document.getElementById('contestantBName').value,
            nomineeA: collectNomineeData('A'),
            nomineeB: collectNomineeData('B'),
            status: 'pending',
            notes: ''
        };

        const fullData = {
            site: {
                title: 'WW',
                subtitle: 'WW Wednesday',
                timezone: CONFIG.timezone,
                imageBaseUrl: CONFIG.imageBaseUrl
            },
            currentWeek: weekData
        };

        const jsonOutput = JSON.stringify(fullData, null, 2);
        document.getElementById('jsonOutput').value = jsonOutput;
        document.getElementById('outputSection').style.display = 'block';
        
        // Scroll to output
        document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth' });
    }

    function collectNomineeData(contestant) {
        const prefix = `nominee${contestant}`;
        
        // Collect image paths from input fields
        const imagePaths = [];
        document.querySelectorAll(`input.image-path-input[data-contestant="${contestant}"]`).forEach(input => {
            if (input.value.trim()) {
                imagePaths.push(input.value.trim());
            }
        });

        const tagsInput = document.getElementById(`${prefix}Tags`).value;
        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

        return {
            womanName: document.getElementById(`${prefix}Name`).value,
            shortDescription: document.getElementById(`${prefix}Short`).value,
            longerDescription: document.getElementById(`${prefix}Long`).value,
            imageUrls: imagePaths,
            tags: tags,
            sourceNote: '',
            manuallyEntered: true
        };
    }

    function downloadJSON() {
        const jsonText = document.getElementById('jsonOutput').value;
        const blob = new Blob([jsonText], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'current.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ============================================
    // Admin Panel - Legacy Import
    // ============================================
    
    function setupLegacyImport() {
        document.getElementById('parseLegacy').addEventListener('click', parseLegacyData);
        document.getElementById('loadExample').addEventListener('click', loadLegacyExample);
        document.getElementById('copyLegacyJSON').addEventListener('click', () => {
            const textarea = document.getElementById('legacyJSON');
            textarea.select();
            document.execCommand('copy');
            alert('JSON copied to clipboard!');
        });
    }

    async function loadLegacyExample() {
        try {
            const response = await fetch(CONFIG.dataPath.legacyExample);
            const text = await response.text();
            document.getElementById('legacyInput').value = text;
        } catch (error) {
            alert('Could not load example file. Make sure legacy-import-example.txt exists.');
        }
    }

    function parseLegacyData() {
        const input = document.getElementById('legacyInput').value;
        const warnings = [];
        
        try {
            const parsed = parseLegacyText(input, warnings);
            
            const fullData = {
                site: {
                    title: 'WW',
                    timezone: CONFIG.timezone,
                    imageBaseUrl: CONFIG.imageBaseUrl
                },
                currentWeek: parsed
            };

            document.getElementById('legacyJSON').value = JSON.stringify(fullData, null, 2);
            
            const warningsEl = document.getElementById('legacyWarnings');
            if (warnings.length > 0) {
                warningsEl.innerHTML = '<strong>Warnings:</strong><ul>' + 
                    warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('') + 
                    '</ul>';
            } else {
                warningsEl.innerHTML = '<strong>✓ Parsed successfully with no warnings.</strong>';
            }
            
            document.getElementById('legacyOutput').style.display = 'block';
            document.getElementById('legacyOutput').scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            alert(`Parse error: ${error.message}`);
        }
    }

    function parseLegacyText(text, warnings) {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        const data = {
            weekId: '',
            season: new Date().getFullYear().toString(),
            revealAt: '',
            timezone: CONFIG.timezone,
            contestantA: '',
            contestantB: '',
            nomineeA: { womanName: '', shortDescription: '', longerDescription: '', imageUrls: [], tags: [] },
            nomineeB: { womanName: '', shortDescription: '', longerDescription: '', imageUrls: [], tags: [] },
            status: 'pending',
            notes: ''
        };

        let currentContestant = null;

        lines.forEach(line => {
            // Week ID
            if (line.toLowerCase().startsWith('week ')) {
                data.weekId = line.split(' ')[1].trim();
            }
            // Reveal date
            else if (line.toLowerCase().startsWith('reveal:')) {
                const dateStr = line.substring(7).trim();
                try {
                    // Try to parse the date and convert to ISO
                    const parsed = new Date(dateStr);
                    if (!isNaN(parsed)) {
                        data.revealAt = parsed.toISOString();
                    } else {
                        warnings.push(`Could not parse reveal date: ${dateStr}`);
                    }
                } catch {
                    warnings.push(`Invalid reveal date format: ${dateStr}`);
                }
            }
            // Contestants
            else if (line.toLowerCase().includes('contestant 1:') || line.toLowerCase().includes('contestant a:')) {
                data.contestantA = line.split(':')[1].trim();
                currentContestant = 'A';
            }
            else if (line.toLowerCase().includes('contestant 2:') || line.toLowerCase().includes('contestant b:')) {
                data.contestantB = line.split(':')[1].trim();
                currentContestant = 'B';
            }
            // Nominee data
            else if (line.toLowerCase().includes('nominee:')) {
                const name = line.split(':')[1].trim();
                if (currentContestant === 'A') {
                    data.nomineeA.womanName = name;
                } else if (currentContestant === 'B') {
                    data.nomineeB.womanName = name;
                }
            }
            else if (line.toLowerCase().includes('description:')) {
                const desc = line.split(':')[1].trim();
                if (currentContestant === 'A') {
                    data.nomineeA.shortDescription = desc;
                    data.nomineeA.longerDescription = desc;
                } else if (currentContestant === 'B') {
                    data.nomineeB.shortDescription = desc;
                    data.nomineeB.longerDescription = desc;
                }
            }
            else if (line.toLowerCase().includes('images:') || line.toLowerCase().includes('image:')) {
                const paths = line.split(':')[1].trim().split(',').map(p => p.trim()).filter(p => p);
                if (currentContestant === 'A') {
                    data.nomineeA.imageUrls = paths;
                } else if (currentContestant === 'B') {
                    data.nomineeB.imageUrls = paths;
                }
            }
            else if (line.toLowerCase().includes('tags:')) {
                const tags = line.split(':')[1].trim().split(',').map(t => t.trim()).filter(t => t);
                if (currentContestant === 'A') {
                    data.nomineeA.tags = tags;
                } else if (currentContestant === 'B') {
                    data.nomineeB.tags = tags;
                }
            }
        });

        // Validation
        if (!data.weekId) warnings.push('Week ID not found');
        if (!data.revealAt) warnings.push('Reveal date not found or invalid');
        if (!data.contestantA) warnings.push('Contestant A name not found');
        if (!data.contestantB) warnings.push('Contestant B name not found');
        if (!data.nomineeA.womanName) warnings.push('Contestant A nominee name not found');
        if (!data.nomineeB.womanName) warnings.push('Contestant B nominee name not found');

        return data;
    }

    // ============================================
    // Utility Functions
    // ============================================
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function createSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    function showError(message) {
        console.error(message);
        // Could add a toast notification here
    }

    // ============================================
    // Event Listeners Setup
    // ============================================
    
    function setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', toggleTheme);

        // Admin panel toggle
        document.getElementById('adminToggle').addEventListener('click', () => {
            const panel = document.getElementById('adminPanel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                closeModal(modal.id);
            });
        });

        // Modal backdrop clicks
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                closeModal(modal.id);
            });
        });

        // Lightbox navigation
        document.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
        document.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));

        // Archive filters
        document.getElementById('archiveSearch').addEventListener('input', filterArchive);
        document.getElementById('archiveYearFilter').addEventListener('change', filterArchive);
        document.getElementById('archiveContestantFilter').addEventListener('change', filterArchive);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const lightbox = document.getElementById('lightboxModal');
            if (lightbox.style.display === 'flex') {
                if (e.key === 'ArrowLeft') navigateLightbox(-1);
                if (e.key === 'ArrowRight') navigateLightbox(1);
                if (e.key === 'Escape') closeModal('lightboxModal');
            }
            
            const detailModal = document.getElementById('detailModal');
            if (detailModal.style.display === 'flex' && e.key === 'Escape') {
                closeModal('detailModal');
            }
        });
    }

    // ============================================
    // Initialization
    // ============================================
    
    async function init() {
        initTheme();
        setupEventListeners();
        setupAdminPanel();
        setupLegacyImport();

        const loaded = await loadData();
        if (loaded) {
            renderCurrentWeek();
            renderArchive();
        }
    }

    // ============================================
    // Public API
    // ============================================
    
    window.wwApp = {
        showNomineeDetails,
        showArchiveDetails,
        openLightbox,
        reload: async function() {
            console.log('Force reloading data...');
            const loaded = await loadData();
            if (loaded) {
                renderCurrentWeek();
                renderArchive();
                console.log('Data reloaded successfully!');
            }
        }
    };

    // Start the app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
