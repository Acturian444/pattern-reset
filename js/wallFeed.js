// Wall Feed Handler
class WallFeed {
    constructor() {
        this.feed = document.createElement('div');
        this.feed.className = 'wall-feed';
        this.unsubscribe = null;
        this.currentCity = localStorage.getItem('selectedCity') || 'Global';
        this.currentSort = 'newest';
        /** @type {{ type: 'emotion'|'situation', label: string }[]} Up to 3; any mix; posts match if ANY tag matches */
        this.wallFilterTags = [];
        this._locationBtn = null;
        this._showingRow = null;
        this.currentSearch = '';
        this.posts = [];
        this.filteredPosts = [];
        this.viewMode = localStorage.getItem('wallViewMode') || 'list';
        this.currentIndex = 0;
        this.container = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Listener for all clicks within the feed
        this.feed.addEventListener('click', this.handleFeedClick.bind(this));
        // Listener to close menu when clicking outside
        document.addEventListener('click', this.handleDocumentClick.bind(this));
    }

    handleFeedClick(e) {
        const moreOptionsButton = e.target.closest('.more-options-button');
        const copyLinkButton = e.target.closest('.copy-link-button');
        const shareButton = e.target.closest('.share-post-button');
        const reportButton = e.target.closest('.report-post-button');

        if (moreOptionsButton) {
            e.preventDefault();
            this.handleMoreOptionsClick(moreOptionsButton);
        } else if (copyLinkButton) {
            e.preventDefault();
            this.handleCopyLinkClick(copyLinkButton);
        } else if (shareButton) {
            e.preventDefault();
            this.handleShareClick(shareButton);
        } else if (reportButton) {
            e.preventDefault();
            this.handleReportClick(reportButton);
        }
    }

    handleMoreOptionsClick(button) {
        const menu = button.nextElementSibling;
        const isVisible = menu.classList.contains('visible');
        // Close all menus first
        this.closeAllOptionMenus();
        // If the menu wasn't visible, show it
        if (!isVisible) {
            menu.classList.add('visible');
        }
    }
    
    handleDocumentClick(e) {
        // If the click is not on a more-options-button or inside a menu, close all menus.
        if (!e.target.closest('.more-options-button') && !e.target.closest('.options-menu')) {
            this.closeAllOptionMenus();
        }
    }

    closeAllOptionMenus() {
        this.feed.querySelectorAll('.options-menu.visible').forEach(openMenu => {
            openMenu.classList.remove('visible');
        });
    }

    handleCopyLinkClick(button) {
        const postCard = button.closest('.post-card');
        const postId = postCard.dataset.postId;
        if (!postId) return;

        const url = `${window.location.origin}${window.location.pathname}?post=${postId}`;
        navigator.clipboard.writeText(url).then(() => {
            this.showToast('Link copied!');
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            this.showToast('Failed to copy link.', 'error');
        });
        this.closeAllOptionMenus();
    }

    handleShareClick(button) {
        const postCard = button.closest('.post-card');
        const postId = postCard.dataset.postId;
        if (!postId) return;

        const post = this.posts.find(p => p.id === postId);
        if (!post) {
            console.error('Post data not found for sharing.');
            this.showToast('Could not share post.', 'error');
            return;
        }

        this.showToast('Creating shareable image...');
        this.generateShareImage(post);
        this.closeAllOptionMenus();
    }

    handleReportClick(button) {
        const card = button.closest('.post-card');
        const postId = card.dataset.postId;
        const post = this.posts.find(p => p.id === postId);

        if (post) {
            this.openReportModal(post);
        } else {
            console.error('Could not find post to report:', postId);
            this.showToast('Something went wrong. Could not report post.', 'error');
        }
    }

    openReportModal(post) {
        const modalOverlay = document.getElementById('report-modal-overlay');
        const modal = document.getElementById('report-modal');
        const reasonsContainer = document.getElementById('report-reasons');
        const submitBtn = document.getElementById('report-submit-btn');
        const closeBtn = document.getElementById('report-modal-close');
    
        const reasons = [
            {
                title: "Hate Speech",
                description: "Promotes prejudice or discrimination toward a group."
            },
            {
                title: "Harassment or Bullying",
                description: "Targets or attacks someone personally."
            },
            {
                title: "Threat of Violence",
                description: "Expresses or implies harm to others."
            },
            {
                title: "Promoting Self-Harm or Suicide",
                description: "Encourages or glorifies harm to self."
            },
            {
                title: "Inappropriate or Offensive Content",
                description: "Sexual, graphic, or unsuitable for this space."
            },
            {
                title: "Spam or Irrelevant",
                description: "Not genuine or emotionally disruptive to the wall."
            },
            {
                title: "Urgent Mental Health Concern",
                description: "Flag this if someone may be in immediate danger."
            }
        ];
    
        reasonsContainer.innerHTML = '';
        reasons.forEach(reason => {
            const reasonEl = document.createElement('div');
            reasonEl.className = 'report-reason';
            reasonEl.dataset.reason = reason.title;
            reasonEl.innerHTML = `
                <strong class="report-reason-title">${reason.title}</strong>
                <p class="report-reason-description">${reason.description}</p>
            `;
            reasonsContainer.appendChild(reasonEl);
        });
    
        modalOverlay.classList.add('visible');
    
        let selectedReason = null;
    
        const reasonElements = reasonsContainer.querySelectorAll('.report-reason');
        reasonElements.forEach(el => {
            el.onclick = () => {
                reasonElements.forEach(innerEl => innerEl.classList.remove('selected'));
                el.classList.add('selected');
                selectedReason = el.dataset.reason;
                submitBtn.disabled = false;
            };
        });
    
        const closeModal = () => {
            modalOverlay.classList.remove('visible');
            submitBtn.disabled = true;
            selectedReason = null;
        };
    
        closeBtn.onclick = closeModal;
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        };
    
        submitBtn.onclick = async () => {
            if (!selectedReason) return;
    
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
    
            try {
                await window.PostService.submitReport(post, selectedReason);
                this.showToast('Report submitted. Thank you for helping keep this space safe.');
            } catch (error) {
                console.error("Error submitting report:", error);
                this.showToast('Could not submit report. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Report';
                closeModal();
            }
        };
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.add('visible');
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            toast.classList.remove('visible');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    }

    render(container) {
        this.container = container;
        // Create controls section
        const controls = document.createElement('div');
        controls.className = 'wall-controls';
        
        // Location filter
        const locationFilter = this.createLocationFilter();
        controls.appendChild(locationFilter);

        // Search and filter row
        const searchFilterRow = document.createElement('div');
        searchFilterRow.className = 'wall-search-filter-row';
        
        // Search bar
        const searchBar = this.createSearchBar();
        searchFilterRow.appendChild(searchBar);
        
        // Filter button
        const filterBtn = this.createFilterButton();
        searchFilterRow.appendChild(filterBtn);
        
        controls.appendChild(searchFilterRow);

        // Add controls to container
        container.appendChild(controls);

        // Sort + View toggle row
        const sortViewRow = document.createElement('div');
        sortViewRow.className = 'wall-sort-view-row';
        const sortDropdown = this.createSortDropdown();
        sortDropdown.style.margin = '';
        sortViewRow.appendChild(sortDropdown);
        const viewToggle = this.createViewToggle();
        sortViewRow.appendChild(viewToggle);
        container.appendChild(sortViewRow);
        
        // Add feed
        container.appendChild(this.feed);
        
        // Subscribe to posts
        this.subscribeToPosts();

        if (this.viewMode === 'single') {
            this.setupSingleCardKeyboard();
        }
    }

    createViewToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'wall-view-toggle';
        toggle.setAttribute('role', 'group');
        toggle.setAttribute('aria-label', 'View mode');
        const listBtn = document.createElement('button');
        listBtn.className = `wall-view-btn ${this.viewMode === 'list' ? 'active' : ''}`;
        listBtn.type = 'button';
        listBtn.setAttribute('aria-label', 'List view');
        listBtn.setAttribute('aria-pressed', this.viewMode === 'list');
        listBtn.innerHTML = '<i class="fas fa-list" aria-hidden="true"></i>';
        listBtn.setAttribute('title', 'List view');
        listBtn.onclick = () => this.setViewMode('list');
        const singleBtn = document.createElement('button');
        singleBtn.className = `wall-view-btn ${this.viewMode === 'single' ? 'active' : ''}`;
        singleBtn.type = 'button';
        singleBtn.setAttribute('aria-label', 'Single card view');
        singleBtn.setAttribute('aria-pressed', this.viewMode === 'single');
        singleBtn.innerHTML = '<i class="fas fa-window-maximize" aria-hidden="true"></i>';
        singleBtn.setAttribute('title', 'Single story view');
        singleBtn.onclick = () => this.setViewMode('single');
        toggle.appendChild(listBtn);
        toggle.appendChild(singleBtn);
        return toggle;
    }

    setViewMode(mode) {
        if (mode === this.viewMode) return;
        if (mode === 'single' && this.viewMode === 'list') {
            this.captureViewportCardIndex();
        }
        this.viewMode = mode;
        localStorage.setItem('wallViewMode', mode);
        this.updateViewToggleUI();
        this.updateFeed();
        if (mode === 'single') {
            this.setupSingleCardKeyboard();
        } else {
            this.removeSingleCardKeyboard();
        }
    }

    captureViewportCardIndex() {
        const cards = this.feed.querySelectorAll('.post-card');
        if (cards.length === 0) return;
        const feed = this.feed;
        const scrollTop = feed.scrollTop;
        const viewportCenter = scrollTop + feed.clientHeight / 2;
        let bestIndex = 0;
        let bestDist = Infinity;
        cards.forEach((card, i) => {
            const cardCenter = card.offsetTop + card.offsetHeight / 2;
            const dist = Math.abs(cardCenter - viewportCenter);
            if (dist < bestDist) { bestDist = dist; bestIndex = i; }
        });
        this.currentIndex = Math.min(bestIndex, this.filteredPosts.length - 1);
    }

    updateViewToggleUI() {
        const row = this.container?.querySelector('.wall-sort-view-row');
        if (!row) return;
        const toggle = row.querySelector('.wall-view-toggle');
        if (!toggle) return;
        const listBtn = toggle.querySelector('.wall-view-btn:first-child');
        const singleBtn = toggle.querySelector('.wall-view-btn:last-child');
        if (listBtn) {
            listBtn.classList.toggle('active', this.viewMode === 'list');
            listBtn.setAttribute('aria-pressed', this.viewMode === 'list');
        }
        if (singleBtn) {
            singleBtn.classList.toggle('active', this.viewMode === 'single');
            singleBtn.setAttribute('aria-pressed', this.viewMode === 'single');
        }
    }

    setupSingleCardKeyboard() {
        this._singleCardKeyHandler = (e) => {
            if (this.viewMode !== 'single') return;
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.goToPrevCard();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.goToNextCard();
            }
        };
        document.addEventListener('keydown', this._singleCardKeyHandler);
    }

    removeSingleCardKeyboard() {
        if (this._singleCardKeyHandler) {
            document.removeEventListener('keydown', this._singleCardKeyHandler);
            this._singleCardKeyHandler = null;
        }
    }

    goToPrevCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderSingleCardView();
        }
    }

    goToNextCard() {
        if (this.currentIndex < this.filteredPosts.length - 1) {
            this.currentIndex++;
            this.renderSingleCardView();
        }
    }

    createLocationFilter() {
        const stack = document.createElement('div');
        stack.className = 'wall-location-filter-stack';

        const locationFilter = document.createElement('div');
        locationFilter.className = 'wall-location-filter';

        const locationBtn = document.createElement('button');
        locationBtn.className = 'wall-location-btn';
        locationBtn.type = 'button';
        locationBtn.innerHTML = this.getLocationButtonHTML();
        locationBtn.onclick = () => this.openLocationModal();
        this._locationBtn = locationBtn;

        locationFilter.appendChild(locationBtn);

        const showingRow = document.createElement('div');
        showingRow.className = 'wall-about-filters';
        this._showingRow = showingRow;

        stack.appendChild(locationFilter);
        stack.appendChild(showingRow);

        this.updateShowingRow();
        return stack;
    }

    getLocationButtonHTML() {
        const isGlobal = this.currentCity === 'Global';
        const icon = '<i class="fas fa-map-marker-alt"></i>';
        const locationText = isGlobal ? 'Global' : this.currentCity;
        return `
            <span class="wall-location-btn-text">${icon} ${locationText}</span>
            <i class="fas fa-chevron-down wall-location-btn-chevron" aria-hidden="true"></i>
        `;
    }

    postMatchesWallTag(post, t) {
        if (t.type === 'emotion') {
            if (!post.emotion) return false;
            return post.emotion
                .split(',')
                .map((e) => e.trim())
                .includes(t.label);
        }
        return post.situation === t.label;
    }

    applyWallTagFilter(posts) {
        if (!this.wallFilterTags.length) return posts;
        return posts.filter((post) =>
            this.wallFilterTags.some((t) => this.postMatchesWallTag(post, t))
        );
    }

    isWallTagSelected(tag) {
        return this.wallFilterTags.some(
            (t) => t.type === tag.type && t.label === tag.label
        );
    }

    createFilterChip(entry) {
        const { type, label } = entry;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'wall-filter-chip';
        btn.setAttribute('role', 'listitem');
        btn.setAttribute('aria-label', `Remove filter ${label}`);

        const mid = document.createElement('span');
        mid.className = 'wall-filter-chip-text';
        mid.textContent = label;
        btn.appendChild(mid);

        const times = document.createElement('span');
        times.className = 'wall-filter-chip-remove';
        times.setAttribute('aria-hidden', 'true');
        times.textContent = '\u00D7';

        btn.appendChild(times);

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.wallFilterTags = this.wallFilterTags.filter(
                (t) => !(t.type === type && t.label === label)
            );
            this.updateFeed();
            this.updateLocationButton();
        };

        return btn;
    }

    getActiveFilterCount() {
        return this.wallFilterTags.length;
    }

    /**
     * Adding this tag would exceed 3 active filters (deselecting always allowed).
     */
    canToggleUnifiedFilter(tag) {
        if (this.isWallTagSelected(tag)) return true;
        return this.wallFilterTags.length < 3;
    }

    normalizeWallFilters() {
        if (this.wallFilterTags.length > 3) {
            this.wallFilterTags = this.wallFilterTags.slice(0, 3);
        }
    }

    updateShowingRow() {
        if (!this._showingRow) return;

        const n = this.wallFilterTags.length;

        if (n === 0) {
            this._showingRow.hidden = false;
            this._showingRow.innerHTML = '';
            const defaultLine = document.createElement('div');
            defaultLine.className = 'wall-about-default';
            defaultLine.setAttribute('role', 'status');
            defaultLine.innerHTML =
                '<span class="wall-about-brand">About:</span>' +
                '<span class="wall-about-default-suffix"> All stories</span>';
            this._showingRow.appendChild(defaultLine);
            return;
        }

        this._showingRow.hidden = false;
        this._showingRow.innerHTML = '';

        const bar = document.createElement('div');
        bar.className = 'wall-about-inline-bar';
        bar.setAttribute('role', 'group');
        bar.setAttribute('aria-label', 'Active filters');

        const aboutLabel = document.createElement('span');
        aboutLabel.className = 'wall-about-inline-label';
        aboutLabel.innerHTML = '<span class="wall-about-brand">About:</span>';

        const list = document.createElement('div');
        list.className = 'wall-filter-chip-list wall-filter-chip-list--inline';
        list.setAttribute('role', 'list');
        this.wallFilterTags.forEach((entry) => {
            list.appendChild(this.createFilterChip(entry));
        });

        bar.appendChild(aboutLabel);
        bar.appendChild(list);
        this._showingRow.appendChild(bar);
    }

    createSearchBar() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'wall-search-container';
        
        const searchForm = document.createElement('form');
        searchForm.className = 'wall-search-form';
        searchForm.onsubmit = (e) => {
            e.preventDefault();
            this.handleSearch();
        };
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'wall-search-input';
        searchInput.placeholder = 'Search Wall...';
        searchInput.value = this.currentSearch;
        
        const searchButton = document.createElement('button');
        searchButton.type = 'submit';
        searchButton.className = 'wall-search-button';
        searchButton.innerHTML = '<i class="fas fa-search"></i>';
        
        searchForm.appendChild(searchInput);
        searchForm.appendChild(searchButton);
        searchContainer.appendChild(searchForm);
        
        return searchContainer;
    }

    createFilterButton() {
        const filterBtn = document.createElement('button');
        filterBtn.className = 'wall-filter-btn';
        filterBtn.innerHTML = '<i class="fas fa-filter"></i>';
        filterBtn.onclick = () => this.openFilterModal();
        return filterBtn;
    }

    createSortDropdown() {
        const sortContainer = document.createElement('div');
        sortContainer.className = 'wall-sort-container custom-dropdown';
        sortContainer.setAttribute('role', 'group');

        // Custom dropdown trigger
        const trigger = document.createElement('button');
        trigger.className = 'wall-sort-trigger';
        trigger.id = 'wall-sort-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-labelledby', 'wall-sort-trigger');
        trigger.type = 'button';
        trigger.tabIndex = 0;
        trigger.innerHTML = `${this.getSortText(this.currentSort)} <span class=\"dropdown-arrow\">▼</span>`;
        sortContainer.appendChild(trigger);

        // Dropdown list
        const dropdown = document.createElement('ul');
        dropdown.className = 'wall-sort-list';
        dropdown.setAttribute('role', 'listbox');
        dropdown.tabIndex = -1;
        dropdown.style.display = 'none';

        // Add dropdown label/header
        const dropdownLabel = document.createElement('li');
        dropdownLabel.className = 'wall-sort-label-dropdown';
        dropdownLabel.textContent = 'Sort by';
        dropdownLabel.setAttribute('aria-hidden', 'true');
        dropdown.appendChild(dropdownLabel);
        
        const options = [
            { value: 'newest', text: 'Newest' },
            { value: 'oldest', text: 'Oldest' },
            { value: 'mostFelt', text: 'Most Felt' }
        ];
        
        options.forEach(opt => {
            const li = document.createElement('li');
            li.className = 'wall-sort-option';
            li.setAttribute('role', 'option');
            li.setAttribute('data-value', opt.value);
            li.tabIndex = 0;
            li.textContent = opt.text;
            if (opt.value === this.currentSort) {
                li.classList.add('selected');
                li.setAttribute('aria-selected', 'true');
            }
            li.onclick = () => {
                this.currentSort = opt.value;
                trigger.innerHTML = `${opt.text} <span class=\"dropdown-arrow\">▼</span>`;
                // Remove 'selected' from all options
                dropdown.querySelectorAll('.wall-sort-option').forEach(optEl => {
                    optEl.classList.remove('selected');
                    optEl.removeAttribute('aria-selected');
        });
                // Add 'selected' to the clicked option
                li.classList.add('selected');
                li.setAttribute('aria-selected', 'true');
                dropdown.style.display = 'none';
                trigger.setAttribute('aria-expanded', 'false');
                this.updateFeed();
            };
            li.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    li.click();
                }
            };
            dropdown.appendChild(li);
        });
        sortContainer.appendChild(dropdown);

        // Toggle dropdown
        trigger.onclick = (e) => {
            e.stopPropagation();
            const expanded = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', String(!expanded));
            dropdown.style.display = expanded ? 'none' : 'block';
            // Remove auto-focus on first option
        };
        // Close dropdown on outside click
        document.addEventListener('click', (e) => {
            if (!sortContainer.contains(e.target)) {
                dropdown.style.display = 'none';
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
        // Keyboard navigation
        trigger.onkeydown = (e) => {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dropdown.style.display = 'block';
                trigger.setAttribute('aria-expanded', 'true');
                // Remove auto-focus on first option
            }
        };
        dropdown.onkeydown = (e) => {
            const options = Array.from(dropdown.querySelectorAll('.wall-sort-option'));
            const current = document.activeElement;
            let idx = options.indexOf(current);
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (idx < options.length - 1) options[idx + 1].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (idx > 0) options[idx - 1].focus();
            } else if (e.key === 'Escape') {
                dropdown.style.display = 'none';
                trigger.setAttribute('aria-expanded', 'false');
                trigger.focus();
            }
        };
        return sortContainer;
    }

    getSortText(value) {
        switch (value) {
            case 'oldest': return 'Oldest';
            case 'mostFelt': return 'Most Felt';
            default: return 'Newest';
        }
    }

    getPostCountForCity(city) {
        let posts = this.applyWallTagFilter(this.posts);
        if (city === 'Global') {
            return posts.length;
        }
        return posts.filter((p) => p.city === city).length;
    }

    openLocationModal() {
        // Create and show location modal with proper overlay structure
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'wall-location-modal-overlay visible';
        
        const getCityChipHTML = (city) => {
            const count = this.getPostCountForCity(city);
            const showCount = count >= 3;
            const countSuffix = showCount ? ` — ${count} post${count === 1 ? '' : 's'}` : '';
            const label = city === 'Global' ? 'Global' : city;
            const icon = (city === 'Global' && this.currentCity === 'Global') || (city !== 'Global' && this.currentCity === city) ? '<i class="fas fa-map-marker-alt"></i> ' : '';
            return `<button class="wall-city-chip ${this.currentCity === city ? 'selected' : ''}" data-city="${city}">${icon}${label}${countSuffix}</button>`;
        };

        const modal = document.createElement('div');
        modal.className = 'wall-location-modal';
        modal.innerHTML = `
            <div class="wall-location-modal-content">
                <div class="wall-location-modal-header">
                    <h3>Select Location</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="wall-location-search">
                    <input type="text" placeholder="Search cities..." class="wall-location-search-input">
                </div>
                <div class="wall-city-chip-list">
                    ${getCityChipHTML('Global')}
                    ${this.getCityList().map(city => getCityChipHTML(city)).join('')}
                </div>
            </div>
        `;
        
        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);

        // Handle city selection
        const cityButtons = modal.querySelectorAll('.wall-city-chip');
        cityButtons.forEach(btn => {
            btn.onclick = () => {
                const city = btn.dataset.city;
                this.currentCity = city;
                localStorage.setItem('selectedCity', city);
                this.updateLocationButton();
                this.updateFeed();
                modalOverlay.remove();
            };
        });

        // Handle search
        const searchInput = modal.querySelector('.wall-location-search-input');
        searchInput.oninput = (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const cityButtons = modal.querySelectorAll('.wall-city-chip');
            cityButtons.forEach(btn => {
                const city = btn.dataset.city;
                btn.style.display = city.toLowerCase().includes(searchTerm) || city === 'Global' ? 'flex' : 'none';
            });
        };

        // Handle close
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.onclick = () => modalOverlay.remove();

        // Close on outside click
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) modalOverlay.remove();
        };
    }

    getAllEmotionLabels() {
        const out = new Set();
        this.getEmotionCategories().forEach((cat) => {
            this.getSubEmotions(cat).forEach((e) => out.add(e));
        });
        return out;
    }

    /**
     * Single interleaved list of feeling + situation tags (relatability-first; see UNIFIED_FILTER_LABEL_ORDER).
     */
    getUnifiedFilterTags() {
        const situations = new Set(this.getSituationList());
        const emotionSet = this.getAllEmotionLabels();
        const order = WallFeed.UNIFIED_FILTER_LABEL_ORDER;
        const tagFor = (label) => ({
            type: situations.has(label) ? 'situation' : 'emotion',
            label
        });
        const ordered = [];
        const seen = new Set();

        for (const label of order) {
            if (seen.has(label)) continue;
            if (!emotionSet.has(label) && !situations.has(label)) continue;
            ordered.push(tagFor(label));
            seen.add(label);
        }

        [...emotionSet]
            .filter((e) => !seen.has(e))
            .sort((a, b) => a.localeCompare(b))
            .forEach((label) => {
                ordered.push({ type: 'emotion', label });
                seen.add(label);
            });

        this.getSituationList().forEach((label) => {
            if (seen.has(label)) return;
            ordered.push({ type: 'situation', label });
            seen.add(label);
        });

        return ordered;
    }

    getSituationList() {
        if (typeof LET_IT_OUT_SITUATION_TAGS !== 'undefined' && Array.isArray(LET_IT_OUT_SITUATION_TAGS)) {
            return [...LET_IT_OUT_SITUATION_TAGS];
        }
        return [
            'Relationships',
            'Dating',
            'Situationship',
            'Relationship',
            'Breakup',
            'No Contact',
            'Ex',
            'Mixed Signals',
            'One-Sided',
            'Not Committing',
            'On and Off',
            'Breadcrumbing',
            'Ghosted',
            'Didn’t Say It',
            'Holding It In',
            'Avoided the Conversation',
            'Said Something I Regret',
            'Left on Read',
            'Past',
            'Family',
            'Friendship',
            'Work',
            'Self',
            'Childhood',
            'Closure I Never Got',
            'Still Thinking About It'
        ];
    }

    openFilterModal() {
        const modal = document.createElement('div');
        modal.className = 'wall-filter-modal visible';
        modal.innerHTML = `
            <div class="letitout-emotion-modal wall-filter-modal-inner">
                <div class="letitout-emotion-modal-header">
                    <div class="wall-filter-modal-header-text">
                        <div class="letitout-emotion-modal-title">Explore stories</div>
                        <p class="wall-filter-modal-hint">Pick up to 3 to filter stories</p>
                    </div>
                    <button type="button" class="letitout-emotion-modal-close" aria-label="Close">&times;</button>
                </div>
                <div class="letitout-emotion-modal-content wall-filter-modal-scroll">
                    <div class="filter-unified-wrapper"></div>
                </div>
                <div class="letitout-emotion-modal-footer wall-filter-modal-footer">
                    <button type="button" class="letitout-emotion-modal-btn clear">Clear Filter</button>
                    <button type="button" class="letitout-emotion-modal-btn done">Apply</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const unifiedWrap = modal.querySelector('.filter-unified-wrapper');
        const doneBtn = modal.querySelector('.letitout-emotion-modal-btn.done');
        const clearBtn = modal.querySelector('.letitout-emotion-modal-btn.clear');
        const closeBtn = modal.querySelector('.letitout-emotion-modal-close');

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'emotion-search-input wall-filter-unified-search';
        searchInput.placeholder = 'Search feelings or situations...';
        searchInput.autocomplete = 'off';
        searchInput.setAttribute('aria-label', 'Search feelings or situations');

        const categoriesContainer = document.createElement('div');
        categoriesContainer.className = 'emotion-categories-container emotion-categories-container--flat wall-filter-unified-container';

        unifiedWrap.appendChild(searchInput);
        unifiedWrap.appendChild(categoriesContainer);

        const renderUnified = (filter = '') => {
            categoriesContainer.innerHTML = '';
            const filterVal = filter.trim().toLowerCase();
            const pillsWrap = document.createElement('div');
            pillsWrap.className = 'emotion-subtags emotion-subtags--flat wall-filter-unified-grid';

            this.getUnifiedFilterTags().forEach((tag) => {
                if (filterVal && !tag.label.toLowerCase().includes(filterVal)) return;

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'emotion-subtag wall-unified-filter-tag';
                if (tag.type === 'situation') {
                    btn.classList.add('wall-unified-filter-tag--situation');
                }

                const labelSpan = document.createElement('span');
                labelSpan.className = 'emotion-subtag-label';
                labelSpan.textContent = tag.label;
                btn.appendChild(labelSpan);

                if (this.isWallTagSelected(tag)) {
                    btn.classList.add('selected');
                }

                const canToggle = this.canToggleUnifiedFilter(tag);
                if (!canToggle) {
                    btn.classList.add('wall-unified-filter-tag--max');
                    btn.setAttribute('aria-disabled', 'true');
                    btn.title = 'Choose up to 3 tags — remove one to add another';
                }

                btn.onclick = () => {
                    if (!this.canToggleUnifiedFilter(tag)) {
                        return;
                    }
                    if (this.isWallTagSelected(tag)) {
                        this.wallFilterTags = this.wallFilterTags.filter(
                            (t) => !(t.type === tag.type && t.label === tag.label)
                        );
                    } else {
                        this.wallFilterTags.push({
                            type: tag.type,
                            label: tag.label
                        });
                    }
                    renderUnified(searchInput.value);
                };

                pillsWrap.appendChild(btn);
            });

            categoriesContainer.appendChild(pillsWrap);
        };

        renderUnified();

        searchInput.oninput = () => {
            renderUnified(searchInput.value);
        };

        clearBtn.onclick = () => {
            this.wallFilterTags = [];
            this.updateLocationButton();
            renderUnified(searchInput.value);
        };

        doneBtn.onclick = () => {
            this.updateFeed();
            this.updateLocationButton();
            modal.remove();
        };

        const closeModal = () => {
            modal.remove();
        };
        closeBtn.onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
    }

    handleSearch() {
        const searchInput = document.querySelector('.wall-search-input');
        this.currentSearch = searchInput.value.trim();
        this.updateFeed();
    }

    updateLocationButton() {
        if (this._locationBtn) {
            this._locationBtn.innerHTML = this.getLocationButtonHTML();
        } else {
            const locationBtn = document.querySelector('.wall-location-btn');
            if (locationBtn) {
                locationBtn.innerHTML = this.getLocationButtonHTML();
            }
        }
        this.updateShowingRow();
    }

    updateFeed() {
        this.normalizeWallFilters();

        let filteredPosts = [...this.posts];
        
        // Apply city filter
        if (this.currentCity !== 'Global') {
            filteredPosts = filteredPosts.filter(post => post.city === this.currentCity);
        }
        
        // Wall tags: match ANY selected tag (feelings and/or situations)
        filteredPosts = this.applyWallTagFilter(filteredPosts);
        
        // Apply search
        if (this.currentSearch) {
            const searchTerm = this.currentSearch.toLowerCase();
            filteredPosts = filteredPosts.filter(post => 
                post.content.toLowerCase().includes(searchTerm) ||
                (post.emotion && post.emotion.toLowerCase().includes(searchTerm)) ||
                (post.situation && post.situation.toLowerCase().includes(searchTerm)) ||
                (post.truthNumber && post.truthNumber.toString().includes(searchTerm.replace(/[^\d]/g, ''))) // Search Truth numbers
            );
        }
        
        // Apply sort
        switch (this.currentSort) {
            case 'oldest':
                filteredPosts.sort((a, b) => a.timestamp - b.timestamp);
                break;
            case 'mostFelt':
                filteredPosts.sort((a, b) => (b.feltCount || 0) - (a.feltCount || 0));
                break;
            default: // newest
                filteredPosts.sort((a, b) => b.timestamp - a.timestamp);
        }
        
        this.filteredPosts = filteredPosts;
        this.renderPosts(filteredPosts);
    }

    subscribeToPosts() {
        this.unsubscribe = window.PostService.subscribeToPosts(posts => {
            this.posts = posts;
            this.updateFeed();
        });
    }

    buildWallEmptyContent() {
        const wrap = document.createElement('div');
        wrap.className = 'wall-empty-message';
        wrap.setAttribute('role', 'status');

        const searchTrimmed = (this.currentSearch || '').trim();
        const isAllStoriesView =
            this.wallFilterTags.length === 0 &&
            this.currentCity === 'Global' &&
            !searchTrimmed;

        let titleText;
        let subtitleText;
        if (isAllStoriesView) {
            titleText = "Nothing here yet—that's okay.";
            subtitleText =
                "If something's on your mind, you can be the first to share it. It's anonymous.";
        } else {
            titleText = 'Nothing matches right now.';
            subtitleText =
                'Try different filters or search—or start writing with what you had in mind.';
        }

        const p1 = document.createElement('p');
        p1.className = 'wall-empty-title';
        p1.textContent = titleText;

        const p2 = document.createElement('p');
        p2.className = 'wall-empty-subtitle';
        p2.textContent = subtitleText;

        wrap.appendChild(p1);
        wrap.appendChild(p2);

        const writeBlock = document.createElement('div');
        writeBlock.className = 'wall-empty-write-block';

        const cta = document.createElement('button');
        cta.type = 'button';
        cta.className = 'wall-empty-cta-btn';
        cta.textContent = 'Let it out';
        cta.setAttribute(
            'aria-label',
            'Go to Write and share your story'
        );
        cta.onclick = () => this.goToWriteTabWithPreset();

        writeBlock.appendChild(cta);
        wrap.appendChild(writeBlock);

        return wrap;
    }

    goToWriteTabWithPreset() {
        try {
            sessionStorage.setItem(
                'letitout_wall_to_write_preset',
                JSON.stringify(this.wallFilterTags)
            );
        } catch (_) {
            /* ignore */
        }
        const writeTab = document.getElementById('write-tab');
        if (writeTab) writeTab.click();
    }

    renderPosts(posts) {
        this.feed.innerHTML = '';
        this.feed.className = 'wall-feed';
        if (this.viewMode === 'single') {
            this.feed.classList.add('wall-feed-single');
            this.renderSingleCardView();
        } else {
            if (posts.length > 0) {
                posts.forEach(post => {
                    const card = PostCard.create(post);
                    this.feed.appendChild(card);
                });
            } else {
                this.feed.appendChild(this.buildWallEmptyContent());
            }
            this.highlightPostFromUrl();
        }
    }

    renderSingleCardView() {
        this.feed.innerHTML = '';
        const posts = this.filteredPosts;
        if (posts.length === 0) {
            this.feed.appendChild(this.buildWallEmptyContent());
            return;
        }
        this.currentIndex = Math.min(this.currentIndex, posts.length - 1);
        const post = posts[this.currentIndex];
        const card = PostCard.create(post);
        card.classList.add('post-card-single');

        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'wall-single-card-wrapper';
        const cardContainer = document.createElement('div');
        cardContainer.className = 'wall-single-card-container';
        cardContainer.appendChild(card);
        cardWrapper.appendChild(cardContainer);

        const navRow = document.createElement('div');
        navRow.className = 'wall-single-card-nav';

        const backBtn = document.createElement('button');
        backBtn.className = 'wall-single-nav-btn wall-single-nav-back';
        backBtn.type = 'button';
        backBtn.setAttribute('aria-label', 'Previous post');
        backBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        backBtn.onclick = () => this.goToPrevCard();
        backBtn.disabled = this.currentIndex === 0;

        const progress = document.createElement('div');
        progress.className = 'wall-single-card-progress';
        progress.textContent = `${this.currentIndex + 1} of ${posts.length}`;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'wall-single-nav-btn wall-single-nav-next';
        nextBtn.type = 'button';
        nextBtn.setAttribute('aria-label', 'Next post');
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.onclick = () => this.goToNextCard();
        nextBtn.disabled = this.currentIndex === posts.length - 1;

        navRow.appendChild(backBtn);
        navRow.appendChild(progress);
        navRow.appendChild(nextBtn);

        this.feed.appendChild(cardWrapper);
        this.feed.appendChild(navRow);
    }

    highlightPostFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const postIdFromUrl = urlParams.get('post');
        if (!postIdFromUrl) return;

        const postCard = this.feed.querySelector(`.post-card[data-post-id="${postIdFromUrl}"]`);
        if (postCard) {
            postCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            postCard.classList.add('highlight-glow');
            setTimeout(() => {
                postCard.classList.remove('highlight-glow');
            }, 2500);
            
            // Remove the post param after a delay to ensure highlighting is complete
            setTimeout(() => {
            const url = new URL(window.location);
            url.searchParams.delete('post');
            window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
            }, 3000);
        }
    }

    async generateShareImage(post) {
        // --- Dark Mode Check ---
        const isDarkMode = document.body.classList.contains('dark-mode');

        const shareContainer = document.createElement('div');
        shareContainer.id = 'share-image-container';
        
        // --- Main Canvas Styling (1080x1350px) ---
        Object.assign(shareContainer.style, {
            position: 'absolute',
            left: '-9999px',
            top: '0px',
            width: '1080px',
            height: '1350px',
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fffcf1', // THEME AWARE
            padding: '80px 60px',
            boxSizing: 'border-box',
            fontFamily: '"DM Sans", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between' // Positions header at top, footer at bottom
        });

        // --- Container for all content ---
        const contentWrapper = document.createElement('div');
        Object.assign(contentWrapper.style, {
            width: '100%',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center', // Center content vertically
            height: '100%'
        });

        // --- Main Content (centered) ---
        const mainContent = document.createElement('div');
        Object.assign(mainContent.style, {
            width: '80%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start'
        });

        // --- Emotion Tags with Anton Font ---
        const tagsContainer = document.createElement('div');
        Object.assign(tagsContainer.style, {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            gap: '15px',
            marginBottom: '15px' // Reduced from 30px
        });

        let allEmotions = [];
        if (Array.isArray(post.emotions) && post.emotions.length > 0) {
            allEmotions = post.emotions.join(',').split(',').map(e => e.trim()).filter(e => e);
        } else if (typeof post.emotion === 'string' && post.emotion) { // Fallback for older data
            allEmotions = post.emotion.split(',').map(e => e.trim()).filter(e => e);
        }

        // --- Show only 1 emotion tag ---
        let tagsToDisplay = [];
        if (allEmotions.length > 0) {
            tagsToDisplay = [allEmotions[0]]; // Only show the first emotion tag
        }
        
        if (tagsToDisplay.length > 0) {
            tagsToDisplay.forEach(e => {
                const tag = document.createElement('span');
                tag.textContent = e;
                Object.assign(tag.style, {
                    fontFamily: '"Anton", sans-serif', // Anton font
                    color: '#f10000', // Brand red for both light and dark modes
                    fontSize: '42px', // Same size as body text
                    fontWeight: '400', // Normal weight for Anton
                    textTransform: 'uppercase', // Uppercase for Anton
                    letterSpacing: '1px'
                });
                tagsContainer.appendChild(tag);
            });
        }
        
        const content = document.createElement('p');
        content.textContent = post.content;
        Object.assign(content.style, {
            fontSize: '42px',
            color: isDarkMode ? '#D4D4D4' : 'black', // THEME AWARE
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            textAlign: 'left',
            margin: '0'
        });
        
        mainContent.append(tagsContainer, content);
        
        // --- Assemble and Render ---
        contentWrapper.append(mainContent);
        shareContainer.append(contentWrapper);

        // --- Footer (Watermark) - Always at bottom ---
        const footer = document.createElement('div');
        Object.assign(footer.style, {
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            textAlign: 'left',
            width: '100%',
            height: '120px', // Fixed height for footer
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '150px', // Increased to move footer more to the right
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fffcf1' // Match container background
        });

        const watermark = document.createElement('p');
        watermark.innerHTML = `Story #${post.truthNumber || ''} &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; LetItOut`;
        Object.assign(watermark.style, {
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '24px',
            color: isDarkMode ? '#888' : '#ccc', // Lighter colors for both modes
            fontWeight: '500',
            margin: '0',
            textAlign: 'left'
        });
        
        footer.appendChild(watermark);
        shareContainer.appendChild(footer);
        document.body.appendChild(shareContainer);

        try {
            const canvas = await html2canvas(shareContainer, {
                useCORS: true,
                scale: 1, // Use 1x scale as we've defined exact dimensions
                backgroundColor: null,
                width: 1080,
                height: 1350,
                scrollX: 0,
                scrollY: -window.scrollY // Fix for capturing off-screen content
            });
            
            document.body.removeChild(shareContainer);

            const dataUrl = canvas.toDataURL('image/png');

            if (navigator.share && navigator.canShare) {
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], 'pattern-reset-post.png', { type: blob.type });
                await navigator.share({
                    files: [file],
                    title: 'Someone opened up on Let It Out. Read their journal.',
                });
            } else {
                this.showShareModal(dataUrl);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Share action was canceled by the user.');
            } else {
                console.error('Error generating share image:', error);
                this.showToast('Could not create image.', 'error');
            }
            
            if(document.body.contains(shareContainer)) {
                document.body.removeChild(shareContainer);
            }
        }
    }

    showShareModal(dataUrl) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'share-modal-overlay';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'share-modal-content';

        const closeButton = document.createElement('button');
        closeButton.className = 'share-modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => document.body.removeChild(modalOverlay);

        const heading = document.createElement('h3');
        heading.textContent = 'Share this Post';

        const image = document.createElement('img');
        image.src = dataUrl;
        image.style.width = '100%';
        image.style.borderRadius = '8px';
        image.style.border = '1px solid #eee';

        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = 'pattern-reset-post.png';
        downloadLink.className = 'share-modal-download-button';
        downloadLink.textContent = 'Download Image';

        modalContent.append(closeButton, heading, image, downloadLink);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
            }
        };
    }

    cleanup() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    destroy() {
        this.cleanup();
        this.removeSingleCardKeyboard();
        // Remove event listeners
        if (this.feed) {
            this.feed.removeEventListener('click', this.handleFeedClick.bind(this));
        }
        document.removeEventListener('click', this.handleDocumentClick.bind(this));
    }

    getCityList() {
        return [
            'Atlanta, GA', 'Austin, TX', 'Bay Area, CA', 'Boston, MA', 'Chicago, IL', 'Denver, CO',
            'Houston, TX', 'Las Vegas, NV', 'Los Angeles, CA', 'Miami, FL', 'Minneapolis, MN',
            'Nashville, TN', 'New Orleans, LA', 'New York, NY', 'Orlando, FL', 'Philadelphia, PA',
            'Phoenix, AZ', 'Portland, OR', 'Salt Lake City, UT', 'San Diego, CA', 'San Francisco, CA',
            'San Jose, CA', 'Seattle, WA', 'Tampa, FL', 'Washington, DC'
        ];
    }

    getEmotionCategories() {
        return [
            'Core Pain',
            'Emotional State',
            'Longing & Connection',
            'Growth / Release'
        ];
    }

    getSubEmotions(category) {
        const emotions = {
            'Core Pain': [
                'Heartbreak', 'Rejection', 'Abandonment', 'Betrayal', 'Loneliness', 'Shame', 'Regret', 'Resentment'
            ],
            'Emotional State': [
                'Anxious', 'Overthinking', 'Drained', 'Numb', 'Stuck', 'Lost', 'Powerless',
                'Confused', 'Obsessing', 'Keeps happening', 'Insecure'
            ],
            'Longing & Connection': [
                'Longing', 'Missing Someone', 'Still in Love', 'Wanting Connection', 'Wanting to Feel Chosen'
            ],
            'Growth / Release': [
                'Letting Go', 'Healing', 'Forgiveness', 'Clarity'
            ]
        };
        return emotions[category] || [];
    }
}

/**
 * Relatability-first interleaving of feelings + situations for the wall filter modal.
 * Any tag missing here is appended automatically (emotions A–Z, then remaining situations).
 */
WallFeed.UNIFIED_FILTER_LABEL_ORDER = [
    'Heartbreak',
    'Ghosted',
    'Mixed Signals',
    'Drained',
    'Anxious',
    'Confused',
    'Situationship',
    'Breakup',
    'Rejection',
    'Breadcrumbing',
    'On and Off',
    'One-Sided',
    'Not Committing',
    'Overthinking',
    'Obsessing',
    'Numb',
    'Stuck',
    'Lost',
    'Powerless',
    'Keeps happening',
    'Insecure',
    'Longing',
    'Missing Someone',
    'Still in Love',
    'Wanting Connection',
    'Wanting to Feel Chosen',
    'No Contact',
    'Ex',
    'Dating',
    'Relationship',
    'Relationships',
    'Abandonment',
    'Betrayal',
    'Loneliness',
    'Shame',
    'Regret',
    'Resentment',
    'Didn\u2019t Say It',
    'Holding It In',
    'Avoided the Conversation',
    'Said Something I Regret',
    'Left on Read',
    'Family',
    'Friendship',
    'Work',
    'Self',
    'Childhood',
    'Past',
    'Closure I Never Got',
    'Still Thinking About It',
    'Letting Go',
    'Healing',
    'Forgiveness',
    'Clarity'
];

window.WallFeed = WallFeed;