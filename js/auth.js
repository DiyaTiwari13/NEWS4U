// Auth Manager - With Session Storage (Auto logout on tab close)

class Auth {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.checkStoredUser();
        this.setupEventListeners();
        this.updateUI();
        
        // Tab close pe automatically logout ho jayega (session storage use kar rahe hain)
        this.setupSessionCleanup();
    }

    checkStoredUser() {
        try {
            // SESSION STORAGE use kar rahe hain - ye tab close hote hi clear ho jata hai
            const userData = sessionStorage.getItem('news4u_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                this.isLoggedIn = true;
            }
        } catch (e) {
            sessionStorage.removeItem('news4u_user');
        }
    }

    setupSessionCleanup() {
        // Window close/refresh pe bhi session clear ho jayega
        window.addEventListener('beforeunload', () => {
            // Kuch nahi karna - session storage automatically clear ho jata hai
        });

        // Tab visibility change - agar user tab close kare
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                // Tab hidden ho raha hai - kuch nahi karte
            }
        });
    }

    setupEventListeners() {
        // User name click - toggle dropdown
        const userNameBtn = document.getElementById('userNameBtn');
        if (userNameBtn) {
            userNameBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }

        // Click outside to close dropdown
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('dropdownMenu');
            const userNameBtn = document.getElementById('userNameBtn');
            
            if (dropdown && userNameBtn) {
                if (!userNameBtn.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            }
        });

        // Profile button
        document.getElementById('profileBtn')?.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });

        // Change password button
        document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
            window.location.href = 'profile.html#password';
        });

        // Saved articles button
        document.getElementById('savedArticlesBtn')?.addEventListener('click', () => {
            window.location.href = 'profile.html#saved';
        });

        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.handleLogout();
        });

        // Login from home page
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn && loginBtn.tagName === 'A') {
            // Already a link to login.html
        }
    }

    toggleDropdown() {
        const dropdown = document.getElementById('dropdownMenu');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem('news4u_user');
            this.currentUser = null;
            this.isLoggedIn = false;
            this.updateUI();
            window.location.reload();
        }
    }

    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const userMenu = document.getElementById('userMenu');
        const heroGuest = document.getElementById('heroGuest');
        const heroUser = document.getElementById('heroUser');
        const thoughtsSection = document.getElementById('thoughtsSection');
        const searchBtn = document.getElementById('searchButton');
        const userSearchBtn = document.getElementById('userSearchBtn');
        
        // Dropdown elements
        const displayName = document.getElementById('displayName');
        const dropdownName = document.getElementById('dropdownName');
        const dropdownEmail = document.getElementById('dropdownEmail');

        if (this.isLoggedIn && this.currentUser) {
            // Logged in state
            if (loginBtn) loginBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (heroGuest) heroGuest.classList.add('hidden');
            if (heroUser) heroUser.classList.remove('hidden');
            if (thoughtsSection) thoughtsSection.classList.remove('hidden');
            
            // Update user info
            if (displayName) displayName.textContent = this.currentUser.name.split(' ')[0];
            if (dropdownName) dropdownName.textContent = this.currentUser.name;
            if (dropdownEmail) dropdownEmail.textContent = this.currentUser.email;
            
            // Update welcome message
            const userNameDisplay = document.getElementById('userNameDisplay');
            if (userNameDisplay) {
                userNameDisplay.textContent = this.currentUser.name.split(' ')[0];
            }
            
            // Enable search
            if (searchBtn) {
                searchBtn.disabled = false;
                searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
            }
            if (userSearchBtn) userSearchBtn.disabled = false;
            
        } else {
            // Not logged in state
            if (loginBtn) loginBtn.style.display = 'inline-flex';
            if (userMenu) userMenu.style.display = 'none';
            if (heroGuest) heroGuest.classList.remove('hidden');
            if (heroUser) heroUser.classList.add('hidden');
            if (thoughtsSection) thoughtsSection.classList.add('hidden');
            
            // Disable search
            if (searchBtn) {
                searchBtn.disabled = true;
                searchBtn.innerHTML = '<i class="fas fa-lock"></i> Login to Search';
            }
            if (userSearchBtn) userSearchBtn.disabled = true;
        }
    }

    isAuthenticated() {
        return this.isLoggedIn;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.AuthManager = new Auth();
});