// Main Application Controller - Clean Version

class News4UApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('News4UApp initialized');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Footer category links
        document.querySelectorAll('.footer-section a[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                if (window.NewsManager) {
                    window.NewsManager.filterByCategory(category);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });

        // Online/Offline detection
        window.addEventListener('online', () => {
            if (window.NewsManager) {
                window.NewsManager.fetchNews();
            }
        });
    }
}

// Single initialization
document.addEventListener('DOMContentLoaded', () => {
    window.News4UApp = new News4UApp();
});