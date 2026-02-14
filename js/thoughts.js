// Thoughts Manager - Real-time Quotes

class ThoughtsManager {
    constructor() {
        this.currentThought = null;
        this.thoughts = [
            { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
            { content: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
            { content: "Stay hungry, stay foolish.", author: "Steve Jobs" },
            { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
            { content: "The best way to predict the future is to create it.", author: "Peter Drucker" },
            { content: "It always seems impossible until it's done.", author: "Nelson Mandela" },
            { content: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
            { content: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
            { content: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
            { content: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
            { content: "Happiness is not something readymade. It comes from your own actions.", author: "Dalai Lama" },
            { content: "The purpose of our lives is to be happy.", author: "Dalai Lama" }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.fetchThought();
        
        // Auto-refresh every 30 seconds (real-time feel)
        setInterval(() => {
            if (document.getElementById('thoughtsSection') && 
                !document.getElementById('thoughtsSection').classList.contains('hidden')) {
                this.fetchThought();
            }
        }, 30000);
    }

    setupEventListeners() {
        const refreshBtn = document.getElementById('refreshThoughts');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.fetchThought();
            });
        }
    }

    fetchThought() {
        // Random thought from collection
        const randomIndex = Math.floor(Math.random() * this.thoughts.length);
        this.currentThought = this.thoughts[randomIndex];
        this.displayThought();
    }

    displayThought() {
        const textEl = document.getElementById('thoughtText');
        const authorEl = document.getElementById('thoughtAuthor');

        if (textEl && this.currentThought) {
            textEl.textContent = this.currentThought.content;
        }

        if (authorEl && this.currentThought) {
            authorEl.textContent = `— ${this.currentThought.author}`;
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.ThoughtsManager = new ThoughtsManager();
});