// News Manager - FIXED Display

class NewsManager {
    constructor() {
        this.apiKey = '91e39e6378b8ee2ec976c0b5c629b003';
        this.baseUrl = 'https://newsapi.org/v2';
        this.currentCategory = 'general';
        this.page = 1;
        this.articles = [];
        this.savedArticles = [];
        this.likedArticles = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCategories();
        this.loadUserData();
        this.fetchNews();
    }

    setupEventListeners() {
        document.getElementById('categorySelect')?.addEventListener('change', (e) => {
            this.currentCategory = e.target.value;
            this.page = 1;
            this.fetchNews();
            
            // Highlight selected category
            document.querySelectorAll('.category-tag').forEach(tag => {
                if (tag.dataset.category === this.currentCategory) {
                    tag.style.background = '#e3f2fd';
                    tag.style.borderColor = '#2196f3';
                } else {
                    tag.style.background = 'white';
                    tag.style.borderColor = '#e0e0e0';
                }
            });
        });

        document.getElementById('userSearchBtn')?.addEventListener('click', () => {
            this.handleSearch();
        });

        document.getElementById('userSearch')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        document.getElementById('refreshNews')?.addEventListener('click', () => {
            this.page = Math.floor(Math.random() * 5) + 1;
            this.fetchNews(true);
        });

        document.querySelectorAll('.category-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const category = tag.dataset.category;
                document.getElementById('categorySelect').value = category;
                this.currentCategory = category;
                this.page = 1;
                this.fetchNews();
            });
        });

        // Event delegation for news card actions
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.news-card');
            if (card && !e.target.closest('.action-btn')) {
                this.openArticle(card.dataset.articleId);
            }

            if (e.target.closest('.like-btn')) {
                const btn = e.target.closest('.like-btn');
                this.handleLike(btn.dataset.articleId, btn);
            }

            if (e.target.closest('.save-btn')) {
                const btn = e.target.closest('.save-btn');
                this.handleSave(btn.dataset.articleId, btn);
            }

            if (e.target.closest('.share-btn')) {
                this.handleShare(e.target.closest('.share-btn').dataset.articleId);
            }
        });
    }

    async fetchNews(forceRefresh = false) {
        try {
            this.showLoading(true);

            // Use sample news for now (API limit issue)
            setTimeout(() => {
                this.useSampleNews();
                this.showLoading(false);
            }, 800);

        } catch (error) {
            console.error('Error:', error);
            this.useSampleNews();
            this.showLoading(false);
        }
    }

    useSampleNews() {
        // Category-specific news
        const samples = {
            general: [
                {
                    title: 'Global Climate Summit Reaches Historic Agreement',
                    description: 'World leaders commit to reducing emissions by 50% by 2030. The landmark deal includes contributions from over 190 countries and establishes a new framework for climate action.',
                    source: { name: 'BBC News' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600',
                    publishedAt: new Date().toISOString()
                },
                {
                    title: 'Breakthrough in Quantum Computing Announced',
                    description: 'Scientists achieve quantum supremacy with new 1000-qubit processor. This breakthrough could revolutionize computing, cryptography, and drug discovery.',
                    source: { name: 'TechCrunch' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600',
                    publishedAt: new Date().toISOString()
                },
                {
                    title: 'International Space Station Gets New Module',
                    description: 'Russia launches new science module to ISS, expanding research capabilities. The module will enable new experiments in microgravity.',
                    source: { name: 'Space News' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600',
                    publishedAt: new Date().toISOString()
                },
                {
                    title: 'Major Archaeological Discovery in Egypt',
                    description: 'Ancient tomb discovered near Luxor contains well-preserved artifacts from 18th dynasty. Experts call it the most significant find in decades.',
                    source: { name: 'History Today' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1568322445389-f64ac251502f?w=600',
                    publishedAt: new Date().toISOString()
                },
                {
                    title: 'Global Economic Forum Highlights Digital Transformation',
                    description: 'World leaders discuss AI, blockchain, and future of work at annual meeting. Tech leaders predict major shifts in global economy.',
                    source: { name: 'Reuters' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600',
                    publishedAt: new Date().toISOString()
                },
                {
                    title: 'New Species Discovered in Amazon Rainforest',
                    description: 'Scientists find 15 new species including a glowing mushroom and a tiny frog. The discovery highlights importance of rainforest conservation.',
                    source: { name: 'Nature Journal' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600',
                    publishedAt: new Date().toISOString()
                }
            ],
            business: [
                {
                    title: 'Stock Market Hits All-Time High',
                    description: 'Dow Jones crosses 40,000 for first time in history as tech stocks surge. Analysts predict continued growth through Q3.',
                    source: { name: 'Wall Street Journal' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600',
                    publishedAt: new Date().toISOString()
                },
                {
                    title: 'Tech Giants Announce Historic Merger',
                    description: '$200 billion deal to create largest tech company in the world. The merger will reshape the entire industry landscape.',
                    source: { name: 'Bloomberg' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1551135049-8a33b2fb7f0e?w=600',
                    publishedAt: new Date().toISOString()
                },
                {
                    title: 'Federal Reserve Announces Rate Decision',
                    description: 'Central bank keeps rates steady, signals potential cuts later this year. Markets react positively to the announcement.',
                    source: { name: 'CNBC' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600',
                    publishedAt: new Date().toISOString()
                }
            ],
            sports: [
                {
                    title: 'World Cup 2026: Host Cities Announced',
                    description: '16 cities across USA, Canada, Mexico selected to host matches. Final to be played at MetLife Stadium in New Jersey.',
                    source: { name: 'ESPN' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600',
                    publishedAt: new Date().toISOString()
                },
                {
                    title: 'Olympics: New World Records in Swimming',
                    description: 'Three world records broken in single day at Olympic trials. Young swimmers emerge as new stars.',
                    source: { name: 'Sports Illustrated' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600',
                    publishedAt: new Date().toISOString()
                },
                {
                    title: 'NBA Finals: Game 7 Thriller',
                    description: 'Championship decided in final seconds as star player hits game-winning shot. Ratings hit all-time high.',
                    source: { name: 'Bleacher Report' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1504450758481-7338eba7524b?w=600',
                    publishedAt: new Date().toISOString()
                }
            ],
            technology: [
                {
                    title: 'Apple Unveils Vision Pro Headset',
                    description: 'Mixed reality headset starts at $3499, available next year. Early reviews praise the revolutionary technology.',
                    source: { name: 'The Verge' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600',
                    publishedAt: new Date().toISOString()
                },
                {
                    title: 'AI Creates Realistic Video from Text',
                    description: 'OpenAI announces Sora, text-to-video generator that creates 60-second HD videos. Artists and filmmakers excited.',
                    source: { name: 'Wired' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1551135049-8a33b2fb7f0e?w=600',
                    publishedAt: new Date().toISOString()
                },
                {
                    title: 'New Smartphone Battery Lasts 5 Days',
                    description: 'Chinese company unveils battery with graphene technology. Could revolutionize mobile devices.',
                    source: { name: 'TechRadar' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600',
                    publishedAt: new Date().toISOString()
                }
            ],
            entertainment: [
                {
                    title: 'Oscars 2024: Full Winners List',
                    description: 'Oppenheimer wins 7 awards including Best Picture. Christopher Nolan takes Best Director.',
                    source: { name: 'Variety' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=600',
                    publishedAt: new Date().toISOString()
                },
                {
                    title: 'Taylor Swift Announces New Album',
                    description: 'The Tortured Poets Department releasing April 19. Fans excited for 16 new songs.',
                    source: { name: 'Billboard' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=600',
                    publishedAt: new Date().toISOString()
                },
                {
                    title: 'Marvel Announces New Phase of Movies',
                    description: 'SDCC panel reveals 5 new films including Fantastic Four and Avengers: Secret Wars.',
                    source: { name: 'IGN' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1534809023262-2921e89cb0df?w=600',
                    publishedAt: new Date().toISOString()
                }
            ],
            health: [
                {
                    title: 'New Cancer Treatment Shows 90% Success Rate',
                    description: 'Immunotherapy breakthrough in clinical trials for advanced melanoma. Patients show remarkable recovery.',
                    source: { name: 'Medical News Today' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
                    publishedAt: new Date().toISOString()
                },
                {
                    title: 'WHO Declares End of COVID Emergency',
                    description: 'Global health emergency officially over after 3 years. Experts caution about future variants.',
                    source: { name: 'Reuters' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600',
                    publishedAt: new Date().toISOString()
                },
                {
                    title: 'Breakthrough in Alzheimer\'s Research',
                    description: 'New drug shows promise in slowing disease progression. Clinical trials expanded to 50 countries.',
                    source: { name: 'Healthline' },
                    url: '#',
                    urlToImage: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=600',
                    publishedAt: new Date().toISOString()
                }
            ]
        };

        // Get articles for current category
        this.articles = samples[this.currentCategory] || samples.general;
        
        // Shuffle slightly for variety
        this.articles = [...this.articles].sort(() => Math.random() - 0.3);
        
        this.renderNews();
        this.updateNewsCount();
    }

    renderNews() {
        const grid = document.getElementById('newsGrid');
        if (!grid) return;

        if (!this.articles || this.articles.length === 0) {
            grid.innerHTML = '<div class="empty-state">No news available</div>';
            return;
        }

        let html = '';
        this.articles.forEach((article, index) => {
            const isLiked = this.likedArticles.includes(article.url || article.title);
            const isSaved = this.savedArticles.some(a => a.id === (article.url || article.title));
            const imageUrl = article.urlToImage || article.image || 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=600';
            
            html += `
                <div class="news-card" data-article-id="${index}">
                    <img src="${imageUrl}" alt="${article.title}" class="news-image" loading="lazy"
                         onerror="this.src='https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=600'">
                    <div class="news-content">
                        <h3 class="news-title">${article.title}</h3>
                        <p class="news-description">${article.description || 'Click to read full article...'}</p>
                        <div class="news-meta">
                            <span class="news-source">
                                <i class="fas fa-newspaper"></i> ${article.source?.name || 'News4U'}
                            </span>
                            <span class="news-time">
                                <i class="far fa-clock"></i> ${this.timeAgo(article.publishedAt)}
                            </span>
                        </div>
                        <div class="news-actions">
                            <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" 
                                    data-article-id="${index}">
                                <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                            </button>
                            <button class="action-btn save-btn ${isSaved ? 'saved' : ''}" 
                                    data-article-id="${index}">
                                <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
                            </button>
                            <button class="action-btn share-btn" data-article-id="${index}">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;
    }

    timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour ago`;
        const days = Math.floor(hours / 24);
        return `${days} day ago`;
    }

    updateNewsCount() {
        const countEl = document.getElementById('newsCount');
        if (countEl) {
            countEl.textContent = this.articles.length || 0;
        }
    }

    loadUserData() {
        this.savedArticles = JSON.parse(localStorage.getItem('saved_articles') || '[]');
        this.likedArticles = JSON.parse(localStorage.getItem('liked_articles') || '[]');
        
        const savedCount = document.getElementById('savedCount');
        if (savedCount) {
            savedCount.textContent = this.savedArticles.length;
        }
    }

    handleLike(articleId, btn) {
        if (!window.AuthManager?.isAuthenticated()) {
            alert('Please login to like articles');
            window.AuthManager?.showAuthModal();
            return;
        }

        const article = this.articles[articleId];
        const id = article.url || article.title;

        const index = this.likedArticles.indexOf(id);
        if (index === -1) {
            this.likedArticles.push(id);
            btn.classList.add('liked');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            this.likedArticles.splice(index, 1);
            btn.classList.remove('liked');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }

        localStorage.setItem('liked_articles', JSON.stringify(this.likedArticles));
    }

    handleSave(articleId, btn) {
        if (!window.AuthManager?.isAuthenticated()) {
            alert('Please login to save articles');
            window.AuthManager?.showAuthModal();
            return;
        }

        const article = this.articles[articleId];
        const id = article.url || article.title;

        const index = this.savedArticles.findIndex(a => a.id === id);
        if (index === -1) {
            this.savedArticles.unshift({
                id: id,
                title: article.title,
                description: article.description,
                url: article.url,
                image: article.urlToImage,
                source: article.source?.name,
                savedAt: Date.now()
            });
            btn.classList.add('saved');
            btn.innerHTML = '<i class="fas fa-bookmark"></i>';
        } else {
            this.savedArticles.splice(index, 1);
            btn.classList.remove('saved');
            btn.innerHTML = '<i class="far fa-bookmark"></i>';
        }

        localStorage.setItem('saved_articles', JSON.stringify(this.savedArticles));
        
        const savedCount = document.getElementById('savedCount');
        if (savedCount) {
            savedCount.textContent = this.savedArticles.length;
        }
    }

    handleShare(articleId) {
        const article = this.articles[articleId];
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.description,
                url: article.url || window.location.href
            });
        } else {
            navigator.clipboard.writeText(article.url || window.location.href);
            alert('Link copied!');
        }
    }

    openArticle(articleId) {
        const article = this.articles[articleId];
        if (article.url && article.url !== '#') {
            window.open(article.url, '_blank');
        } else {
            alert(`📰 ${article.title}\n\n${article.description || 'Full article preview'}`);
        }
    }

    renderCategories() {
        const grid = document.querySelector('.categories-grid');
        if (!grid) return;

        const categories = [
            { name: 'Business', icon: 'briefcase', color: '#4CAF50' },
            { name: 'Sports', icon: 'futbol', color: '#FF9800' },
            { name: 'Technology', icon: 'laptop-code', color: '#2196F3' },
            { name: 'Entertainment', icon: 'film', color: '#9C27B0' },
            { name: 'Health', icon: 'heartbeat', color: '#E91E63' },
            { name: 'Science', icon: 'flask', color: '#009688' }
        ];

        grid.innerHTML = categories.map(cat => `
            <div class="category-card" data-category="${cat.name.toLowerCase()}">
                <div class="category-icon" style="background: ${cat.color}">
                    <i class="fas fa-${cat.icon}"></i>
                </div>
                <h3>${cat.name}</h3>
                <p>Latest news and updates</p>
            </div>
        `).join('');
    }

    showLoading(show) {
        const grid = document.getElementById('newsGrid');
        if (!grid) return;
        
        if (show) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 40px; color: #2196f3;"></i>
                    <p style="margin-top: 20px; color: #666;">Loading news...</p>
                </div>
            `;
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.NewsManager = new NewsManager();
});