// Wall Feed Handler
class WallFeed {
    constructor() {
        this.feed = document.createElement('div');
        this.feed.className = 'wall-feed';
        this.unsubscribe = null;
        this.currentSort = 'newest';
        /** @type {{ type: 'emotion'|'situation', label: string }[]} Up to 3; any mix; posts match if ANY tag matches */
        this.wallFilterTags = [];
        this._showingRow = null;
        this.currentSearch = '';
        this.posts = [];
        this.filteredPosts = [];
        this.viewMode = localStorage.getItem('wallViewMode') || 'list';
        this.currentIndex = 0;
        /** Stable anchor in single-card view when the feed re-sorts (e.g. new post). */
        this.currentPostId = null;
        /** Last rendered post-id order for list view; skip DOM rebuild when unchanged. */
        this._wallPostIdSignature = '';
        this._wallPostIds = [];
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
        
        // Active filter chips row
        const aboutFilters = this.createAboutFiltersSection();
        controls.appendChild(aboutFilters);

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
        const card = cards[bestIndex];
        if (card?.dataset?.postId) {
            this.currentPostId = card.dataset.postId;
        }
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
            this.currentPostId = this.filteredPosts[this.currentIndex]?.id ?? null;
            this.renderSingleCardView(true);
        }
    }

    goToNextCard() {
        if (this.currentIndex < this.filteredPosts.length - 1) {
            this.currentIndex++;
            this.currentPostId = this.filteredPosts[this.currentIndex]?.id ?? null;
            this.renderSingleCardView(true);
        }
    }

    updateSingleCardNavUI(posts) {
        const backBtn = this.feed.querySelector('.wall-single-nav-back');
        const nextBtn = this.feed.querySelector('.wall-single-nav-next');
        const progress = this.feed.querySelector('.wall-single-card-progress');
        if (backBtn) backBtn.disabled = this.currentIndex === 0;
        if (nextBtn) nextBtn.disabled = this.currentIndex === posts.length - 1;
        if (progress) progress.textContent = `${this.currentIndex + 1} of ${posts.length}`;
    }

    createAboutFiltersSection() {
        const showingRow = document.createElement('div');
        showingRow.className = 'wall-about-filters';
        this._showingRow = showingRow;
        this.updateShowingRow();
        return showingRow;
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
            this.updateFilterBar();
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
        const emotions = this.getAllEmotionLabels();
        const situations = new Set(this.getSituationList());
        this.wallFilterTags = this.wallFilterTags.filter((t) => {
            if (t.type === 'emotion') return emotions.has(t.label);
            if (t.type === 'situation') return situations.has(t.label);
            return false;
        });
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

    getAllEmotionLabels() {
        if (typeof LET_IT_OUT_EMOTION_TAGS !== 'undefined' && Array.isArray(LET_IT_OUT_EMOTION_TAGS)) {
            return new Set(LET_IT_OUT_EMOTION_TAGS);
        }
        return new Set([
            'Heartbroken', 'Rejected', 'Betrayed', 'Lonely', 'Jealous', 'Sad', 'Ashamed', 'Embarrassed',
            'Guilty', 'Regretful', 'Anxious', 'Scared', 'Overwhelmed', 'Exhausted', 'Numb', 'Stuck',
            'Lost', 'Confused', 'Powerless', 'Angry', 'Frustrated', 'Disappointed', 'Resentful',
            'Insecure', 'Obsessed', 'Hopeless', 'Shocked', 'Relieved', 'Hopeful', 'Proud', 'Confident',
            'Happy', 'Peaceful', 'Free', 'Inspired', 'Loved', 'Healing', 'Grateful'
        ]);
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
            'Relationships', 'Dating', 'Breakup', 'Marriage', 'Divorce', 'Infidelity', 'Friendship', 'Family',
            'Parenthood', 'Childhood', 'School', 'Identity', 'Sexuality', 'Self-Worth', 'Purpose', 'Career', 'Money',
            'Success', 'Failure', 'Addiction', 'Mental Health', 'Health', 'Trauma', 'Grief & Loss', 'Regret',
            'Starting Over', 'Life Change', 'Faith & Spirituality', 'Abuse', 'Secret', 'Confession', 'Other'
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
            this.updateFeed();
            this.updateFilterBar();
            renderUnified(searchInput.value);
        };

        doneBtn.onclick = () => {
            this.updateFeed();
            this.updateFilterBar();
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

    updateFilterBar() {
        this.updateShowingRow();
    }

    updateFeed() {
        this.normalizeWallFilters();

        let filteredPosts = [...this.posts];
        
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

    /** Keep the story you're reading visually fixed when the feed updates above it. */
    _captureWallScrollAnchor() {
        const expanded = PostCard.getExpandedPostIds();
        for (const id of expanded) {
            const card = this.feed.querySelector(`.post-card[data-post-id="${id}"]`);
            if (card) {
                return { postId: id, top: card.getBoundingClientRect().top };
            }
        }

        let best = null;
        let bestDist = Infinity;
        const mid = window.innerHeight * 0.4;
        this.feed.querySelectorAll('.post-card').forEach((card) => {
            const rect = card.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            const dist = Math.abs(rect.top - mid);
            if (dist < bestDist) {
                bestDist = dist;
                best = { postId: card.dataset.postId, top: rect.top };
            }
        });
        return best;
    }

    _restoreWallScrollAnchor(anchor) {
        if (!anchor?.postId) return;
        const card = this.feed.querySelector(`.post-card[data-post-id="${anchor.postId}"]`);
        if (!card) return;
        const delta = card.getBoundingClientRect().top - anchor.top;
        if (Math.abs(delta) > 1) {
            window.scrollBy(0, delta);
        }
    }

    _detectPrependedPostCount(oldIds, newIds) {
        if (!oldIds.length || newIds.length <= oldIds.length) return 0;
        const tail = newIds.slice(newIds.length - oldIds.length);
        if (!tail.every((id, i) => id === oldIds[i])) return 0;
        return newIds.length - oldIds.length;
    }

    _detectAppendedPostCount(oldIds, newIds) {
        if (!oldIds.length || newIds.length <= oldIds.length) return 0;
        const head = newIds.slice(0, oldIds.length);
        if (!head.every((id, i) => id === oldIds[i])) return 0;
        return newIds.length - oldIds.length;
    }

    renderPosts(posts) {
        if (this.viewMode === 'single') {
            this.feed.className = 'wall-feed wall-feed-single';
            this.renderSingleCardView();
            return;
        }

        this.feed.className = 'wall-feed';
        const newIds = posts.map((p) => p.id);
        const idSignature = newIds.join('\n');
        const oldIds = this._wallPostIds;
        const hasCards = Boolean(this.feed.querySelector('.post-card'));

        if (idSignature && idSignature === this._wallPostIdSignature && hasCards) {
            PostCard.patchWallCards(this.feed, posts);
            this.highlightPostFromUrl();
            return;
        }

        const anchor = hasCards ? this._captureWallScrollAnchor() : null;

        const prependCount = hasCards ? this._detectPrependedPostCount(oldIds, newIds) : 0;
        if (prependCount > 0) {
            const addedPosts = posts.slice(0, prependCount);
            const fragment = document.createDocumentFragment();
            addedPosts.forEach((post) => {
                fragment.appendChild(PostCard.create(post));
            });
            this.feed.insertBefore(fragment, this.feed.firstChild);
            this._wallPostIds = newIds;
            this._wallPostIdSignature = idSignature;
            PostCard.patchWallCards(this.feed, posts);
            requestAnimationFrame(() => {
                this._restoreWallScrollAnchor(anchor);
                this.highlightPostFromUrl();
            });
            return;
        }

        const appendCount = hasCards ? this._detectAppendedPostCount(oldIds, newIds) : 0;
        if (appendCount > 0) {
            posts.slice(oldIds.length).forEach((post) => {
                this.feed.appendChild(PostCard.create(post));
            });
            this._wallPostIds = newIds;
            this._wallPostIdSignature = idSignature;
            PostCard.patchWallCards(this.feed, posts);
            this.highlightPostFromUrl();
            return;
        }

        this._wallPostIdSignature = idSignature;
        this._wallPostIds = newIds;
        this.feed.innerHTML = '';

        if (posts.length > 0) {
            posts.forEach((post) => {
                this.feed.appendChild(PostCard.create(post));
            });
        } else {
            this.feed.appendChild(this.buildWallEmptyContent());
        }

        requestAnimationFrame(() => {
            this._restoreWallScrollAnchor(anchor);
            this.highlightPostFromUrl();
        });
    }

    renderSingleCardView(forceRebuild = false) {
        const posts = this.filteredPosts;
        if (posts.length === 0) {
            this.feed.innerHTML = '';
            this.currentPostId = null;
            this.feed.appendChild(this.buildWallEmptyContent());
            return;
        }

        if (this.currentPostId) {
            const idxById = posts.findIndex((p) => p.id === this.currentPostId);
            if (idxById >= 0) this.currentIndex = idxById;
        }
        this.currentIndex = Math.min(this.currentIndex, posts.length - 1);
        const post = posts[this.currentIndex];
        this.currentPostId = post?.id ?? null;

        const existingCard = this.feed.querySelector('.post-card[data-post-id]');
        if (
            !forceRebuild &&
            existingCard &&
            post.id &&
            existingCard.dataset.postId === post.id &&
            this.feed.querySelector('.wall-single-card-nav')
        ) {
            PostCard.patchWallCards(this.feed, [post]);
            this.updateSingleCardNavUI(posts);
            return;
        }

        this.feed.innerHTML = '';
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

    /** Situation + up to 3 feelings from a wall post. */
    _getShareImageTagsFromPost(post) {
        const situation =
            typeof post.situation === 'string' && post.situation.trim()
                ? post.situation.trim()
                : null;

        let emotions = [];
        if (Array.isArray(post.emotions) && post.emotions.length > 0) {
            emotions = post.emotions
                .join(',')
                .split(',')
                .map((e) => e.trim())
                .filter(Boolean);
        } else if (typeof post.emotion === 'string' && post.emotion) {
            emotions = post.emotion
                .split(',')
                .map((e) => e.trim())
                .filter(Boolean);
        }

        return { situation, emotions: emotions.slice(0, 3) };
    }

    /**
     * Share image header: red SITUATION title + muted feelings subtitle (stacked, no dash).
     */
    _getShareImageTitleLayout(post, isDarkMode = false) {
        const { situation, emotions } = this._getShareImageTagsFromPost(post);
        const situationText = situation ? situation.toUpperCase() : '';
        const feelingsText = emotions.join(', ');
        const hasTitle = Boolean(situationText || feelingsText);
        const mutedColor = isDarkMode ? '#A3A3A3' : '#5A5A5A';

        if (!hasTitle) {
            return {
                hasTitle: false,
                situationText: '',
                feelingsText: '',
                situationFontSize: 0,
                feelingsFontSize: 0,
                mutedColor,
                blockHeight: 0,
            };
        }

        const columnWidth = this._getShareImageColumnMetrics().columnWidth;
        const marginBottom = 15;
        const subtitleGap = 6;

        const measureSituationWidth = (text, fontSize) =>
            text.length * (fontSize * 0.54 + 1);

        const measureFeelingsWidth = (text, fontSize) =>
            text.length * (fontSize * 0.46 + 0.4);

        const fitSingleLine = (text, measure, maxFs, minFs) => {
            for (let fs = maxFs; fs >= minFs; fs -= fs >= 32 ? 2 : 1) {
                if (measure(text, fs) <= columnWidth) return fs;
            }
            return minFs;
        };

        const truncateToWidth = (text, fontSize, measure) => {
            let truncated = text;
            while (truncated.length > 8 && measure(truncated, fontSize) > columnWidth) {
                truncated = truncated.slice(0, -1).replace(/[,\s]+$/, '').trim();
                if (truncated.length <= 8) break;
                truncated += '\u2026';
            }
            return truncated;
        };

        let situationFontSize = 0;
        let feelingsFontSize = 0;
        let displayFeelings = feelingsText;

        if (situationText) {
            situationFontSize = fitSingleLine(situationText, measureSituationWidth, 42, 22);
        }

        if (feelingsText) {
            feelingsFontSize = fitSingleLine(feelingsText, measureFeelingsWidth, 26, 14);
            displayFeelings = truncateToWidth(feelingsText, feelingsFontSize, measureFeelingsWidth);
        }

        let blockHeight = marginBottom;
        if (situationText) {
            blockHeight += Math.ceil(situationFontSize * 1.1);
        }
        if (situationText && feelingsText) {
            blockHeight += subtitleGap;
        }
        if (feelingsText) {
            blockHeight += Math.ceil(feelingsFontSize * 1.15);
        }

        return {
            hasTitle: true,
            situationText,
            feelingsText: displayFeelings,
            situationFontSize,
            feelingsFontSize,
            mutedColor,
            subtitleGap,
            blockHeight,
        };
    }

    /** Fit story text on 1080×1350 share canvas: scale font down, truncate if still too long. */
    _getShareImageTextLayout(rawText, titleBlockHeight = 72) {
        const text = (rawText || '').trim();
        const canvasHeight = 1350;
        const footerHeight = 148;
        const verticalPadding = 160;
        const tagsBlockHeight = titleBlockHeight || 0;
        const contentWidth = this._getShareImageColumnMetrics().columnWidth;
        const availableHeight = canvasHeight - verticalPadding - footerHeight - tagsBlockHeight;

        const tiers = [
            { maxLen: 320, fontSize: 42, lineHeight: 1.6 },
            { maxLen: 700, fontSize: 36, lineHeight: 1.55 },
            { maxLen: 1400, fontSize: 30, lineHeight: 1.5 },
            { maxLen: 2800, fontSize: 24, lineHeight: 1.45 },
            { maxLen: 5000, fontSize: 20, lineHeight: 1.4 },
            // 5k+ posts: smaller type + tighter leading to fit ~4k chars on canvas
            { maxLen: Infinity, fontSize: 16, lineHeight: 1.3 },
        ];

        const tier = tiers.find((t) => text.length <= t.maxLen) || tiers[tiers.length - 1];
        const lineHeightPx = tier.fontSize * tier.lineHeight;
        const charsPerLine = Math.max(18, Math.floor(contentWidth / (tier.fontSize * 0.48)));
        const maxLines = Math.max(4, Math.floor(availableHeight / lineHeightPx));
        const maxChars = charsPerLine * maxLines;

        let displayText = text;
        let truncated = false;
        if (displayText.length > maxChars) {
            displayText = displayText.slice(0, Math.max(0, maxChars - 1)).trim() + '\u2026';
            truncated = true;
        }

        return {
            displayText,
            truncated,
            fontSize: tier.fontSize,
            lineHeight: tier.lineHeight,
            isLong: text.length > 320,
        };
    }

    _getShareImageColumnMetrics() {
        const padX = 60;
        const canvasWidth = 1080;
        const innerWidth = canvasWidth - padX * 2;
        const columnWidth = Math.floor(innerWidth * 0.8);
        const columnOffset = Math.floor((innerWidth - columnWidth) / 2);
        return { padX, innerWidth, columnWidth, columnOffset };
    }

    _getShareImageFooterLine(post) {
        const storyNum = post.truthNumber ? `#${post.truthNumber}` : '';
        const storyLabel = storyNum ? `Story ${storyNum}` : 'Story';
        return `${storyLabel} | Let It Out - Tell Your Story | mypatternreset.com/letitout`;
    }

    /** Caption for iMessage, WhatsApp, etc. when sharing the story image. */
    _getShareMessage() {
        return {
            text:
                'Let It Out \u2014 Tell the story you\u2019ve never told.\n' +
                'https://mypatternreset.com/letitout',
        };
    }

    async generateShareImage(post) {
        // --- Dark Mode Check ---
        const isDarkMode = document.body.classList.contains('dark-mode');
        const titleLayout = this._getShareImageTitleLayout(post, isDarkMode);
        const textLayout = this._getShareImageTextLayout(post.content, titleLayout.blockHeight);
        const shareMessage = this._getShareMessage(post);
        const column = this._getShareImageColumnMetrics();

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
            justifyContent: 'flex-start',
        });

        // --- Container for all content ---
        const contentWrapper = document.createElement('div');
        Object.assign(contentWrapper.style, {
            width: '100%',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: textLayout.isLong ? 'flex-start' : 'center',
            flex: '1',
            minHeight: '0',
            paddingBottom: '12px',
        });

        // --- Main column (tag, body, footer share one left edge) ---
        const innerColumn = document.createElement('div');
        Object.assign(innerColumn.style, {
            width: `${column.columnWidth}px`,
            maxWidth: `${column.columnWidth}px`,
            marginLeft: `${column.columnOffset}px`,
            marginRight: `${column.columnOffset}px`,
            display: 'flex',
            flexDirection: 'column',
            flex: '1',
            minHeight: '0',
            boxSizing: 'border-box',
        });

        const mainContent = document.createElement('div');
        Object.assign(mainContent.style, {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: textLayout.isLong ? 'flex-start' : 'center',
            alignItems: 'flex-start',
            flex: '1',
            minHeight: '0',
            overflow: 'hidden',
            boxSizing: 'border-box',
        });

        // --- Title block: situation (red) + feelings subtitle below ---
        const tagsContainer = document.createElement('div');
        Object.assign(tagsContainer.style, {
            width: '100%',
            marginBottom: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            boxSizing: 'border-box',
        });

        if (titleLayout.hasTitle) {
            if (titleLayout.situationText) {
                const situationEl = document.createElement('p');
                situationEl.textContent = titleLayout.situationText;
                Object.assign(situationEl.style, {
                    fontFamily: '"Anton", sans-serif',
                    color: '#f10000',
                    fontSize: `${titleLayout.situationFontSize}px`,
                    fontWeight: '400',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    lineHeight: '1.1',
                    margin: '0',
                    padding: '0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                });
                tagsContainer.appendChild(situationEl);
            }

            if (titleLayout.feelingsText) {
                const feelingsEl = document.createElement('p');
                feelingsEl.textContent = titleLayout.feelingsText;
                Object.assign(feelingsEl.style, {
                    fontFamily: '"DM Sans", sans-serif',
                    color: titleLayout.mutedColor,
                    fontSize: `${titleLayout.feelingsFontSize}px`,
                    fontWeight: '600',
                    letterSpacing: '0.02em',
                    lineHeight: '1.15',
                    margin: titleLayout.situationText
                        ? `${titleLayout.subtitleGap}px 0 0`
                        : '0',
                    padding: '0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                });
                tagsContainer.appendChild(feelingsEl);
            }
        }
        
        const content = document.createElement('p');
        content.textContent = textLayout.displayText;
        Object.assign(content.style, {
            fontSize: `${textLayout.fontSize}px`,
            color: isDarkMode ? '#D4D4D4' : 'black',
            lineHeight: String(textLayout.lineHeight),
            whiteSpace: 'pre-wrap',
            textAlign: 'left',
            margin: '0',
            wordBreak: 'break-word',
        });
        
        const footer = document.createElement('div');
        Object.assign(footer.style, {
            width: '100%',
            flexShrink: '0',
            marginTop: 'auto',
            paddingTop: '28px',
            paddingLeft: '0',
            marginBottom: '0',
            textAlign: 'left',
            boxSizing: 'border-box',
        });

        const watermark = document.createElement('p');
        watermark.textContent = this._getShareImageFooterLine(post);
        Object.assign(watermark.style, {
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '20px',
            color: isDarkMode ? '#888' : '#aaa',
            fontWeight: '500',
            margin: '0',
            padding: '0',
            textAlign: 'left',
            lineHeight: '1.45',
            boxSizing: 'border-box',
        });

        footer.appendChild(watermark);
        if (titleLayout.hasTitle) {
            mainContent.append(tagsContainer, content, footer);
        } else {
            mainContent.append(content, footer);
        }
        innerColumn.append(mainContent);
        contentWrapper.append(innerColumn);
        shareContainer.append(contentWrapper);
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
                    text: shareMessage.text,
                });
            } else {
                this.showShareModal(dataUrl, shareMessage);
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

    showShareModal(dataUrl, shareMessage) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'share-modal-overlay';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'share-modal-content';

        const closeButton = document.createElement('button');
        closeButton.className = 'share-modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => document.body.removeChild(modalOverlay);

        const heading = document.createElement('h3');
        heading.textContent = 'Share this story';

        const caption = document.createElement('p');
        caption.className = 'share-modal-caption';
        caption.textContent = shareMessage?.text || '';
        Object.assign(caption.style, {
            fontSize: '0.95rem',
            lineHeight: '1.5',
            color: '#555',
            whiteSpace: 'pre-wrap',
            margin: '0 0 1rem',
            textAlign: 'left',
        });

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

        modalContent.append(closeButton, heading, caption, image, downloadLink);
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
}

/**
 * Relatability-first interleaving of feelings + situations for the wall filter modal.
 * Any tag missing here is appended automatically (emotions A–Z, then remaining situations).
 */
WallFeed.UNIFIED_FILTER_LABEL_ORDER = [
    'Heartbroken',
    'Breakup',
    'Anxious',
    'Scared',
    'Relationships',
    'Betrayed',
    'Infidelity',
    'Dating',
    'Lonely',
    'Loved',
    'Jealous',
    'Sad',
    'Family',
    'Overwhelmed',
    'Exhausted',
    'Numb',
    'Friendship',
    'Rejected',
    'Divorce',
    'Stuck',
    'Marriage',
    'Ashamed',
    'Embarrassed',
    'Mental Health',
    'Health',
    'Trauma',
    'Lost',
    'Career',
    'Angry',
    'Frustrated',
    'Disappointed',
    'Grief & Loss',
    'Hopeless',
    'Shocked',
    'Childhood',
    'School',
    'Healing',
    'Starting Over',
    'Guilty',
    'Identity',
    'Sexuality',
    'Insecure',
    'Confident',
    'Life Change',
    'Faith & Spirituality',
    'Regretful',
    'Self-Worth',
    'Confused',
    'Parenthood',
    'Powerless',
    'Abuse',
    'Secret',
    'Confession',
    'Resentful',
    'Purpose',
    'Obsessed',
    'Money',
    'Relieved',
    'Failure',
    'Hopeful',
    'Happy',
    'Peaceful',
    'Free',
    'Inspired',
    'Confident',
    'Proud',
    'Success',
    'Addiction',
    'Grateful',
    'Other',
    'Regret'
];

window.WallFeed = WallFeed;