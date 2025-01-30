document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingContent = document.querySelector('.loading-content');
    const enterButton = document.querySelector('.enter-button');
    const loadingMessage = document.querySelector('.loading-message .message-text');
    const progressBar = document.querySelector('.progress-bar');
    const mainContent = document.querySelector('main');
    
    let loadingProgress = 0;
    const totalDuration = 3000; // 3 seconds for loading
    const updateInterval = 25; // More frequent updates for smoother animation
    const progressIncrement = (100 * updateInterval) / totalDuration;
    
    // Themed loading messages
    const loadingMessages = [
        "Charting the course through digital seas... ⚓",
        "Scanning the horizon for golden opportunities... 🏴‍☠️",
        "Gathering treasures from the crypto depths... 💎",
        "Calibrating the compass to true gains... 🧭",
        "Preparing your voyage to prosperity... ⛵",
        "Mapping the routes to crypto riches... 🗺️"
    ];
    let currentMessage = 0;

    const updateLoadingMessage = () => {
        loadingMessage.style.opacity = '0';
        loadingMessage.style.transform = 'translateY(10px)';
        setTimeout(() => {
            loadingMessage.textContent = loadingMessages[currentMessage];
            loadingMessage.style.opacity = '1';
            loadingMessage.style.transform = 'translateY(0)';
            currentMessage = (currentMessage + 1) % loadingMessages.length;
        }, 300);
    };

    // Start message rotation with dynamic timing
    const messageInterval = setInterval(updateLoadingMessage, 1200);
    
    // Initialize the app
    function initialize() {
        // Hide the coins grid initially
        if (coinsGrid) {
            coinsGrid.style.opacity = '0';
            coinsGrid.style.transform = 'translateY(10px)';
        }

        // Remove active class from all buttons first
        timeframeButtons.forEach(btn => btn.classList.remove('active'));
        
        // Set initial timeframe to 3h
        const defaultButton = document.querySelector('.timeframe-btn[data-timeframe="3h"]');
        if (defaultButton) {
            defaultButton.classList.add('active');
            
            // Update the displayed timeframe text
            const currentTimeframeDisplay = document.querySelector('.current-timeframe');
            if (currentTimeframeDisplay) {
                currentTimeframeDisplay.textContent = '3 Hours';
            }
        }

        // Preload data before showing the grid
        return updateCoinsGrid().then(() => {
            // Show the grid with animation
            if (coinsGrid) {
                requestAnimationFrame(() => {
                    coinsGrid.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    coinsGrid.style.opacity = '1';
                    coinsGrid.style.transform = 'translateY(0)';
                });
            }

            // Set up auto-refresh only after initial load
            if (updateInterval) clearInterval(updateInterval);
            updateInterval = setInterval(updateCoinsGrid, 45000);
        }).catch(error => {
            console.error('Error during initialization:', error);
            // Handle error gracefully
        });
    }

    // Loading screen animation
    const loadingInterval = setInterval(() => {
        loadingProgress += progressIncrement * (0.85 + Math.random() * 0.3);
        
        if (loadingProgress >= 100) {
            loadingProgress = 100;
            clearInterval(loadingInterval);
            
            // Show enter button
            enterButton.style.opacity = '1';
            enterButton.style.transform = 'translateY(0)';
            
            // Handle enter button click
            enterButton.addEventListener('click', () => {
                // Initialize app before transition
                initialize();
                
                // Start exit animation
                enterButton.classList.add('clicked');
                loadingContent.style.transform = 'translateY(-30px) scale(0.98)';
                loadingContent.style.opacity = '0';
                
                // Add particle effects
                createParticlesBurst(loadingScreen);
                
                setTimeout(() => {
                    loadingScreen.style.backdropFilter = 'blur(20px)';
                    loadingScreen.style.transform = 'scale(1.1)';
                    loadingScreen.classList.add('hidden');
                    
                    // Show main content
                    loadingScreen.addEventListener('transitionend', () => {
                        loadingScreen.remove();
                        mainContent.style.display = 'block';
                        mainContent.classList.add('fade-in');
                        
                        // Ensure grid is visible
                        const coinsGrid = document.querySelector('.coins-grid');
                        if (coinsGrid) {
                            coinsGrid.style.opacity = '1';
                            coinsGrid.style.transform = 'translateY(0)';
                        }
                    }, { once: true });
                }, 800);
            });
        }
        
        // Update progress bar
        progressBar.style.width = `${loadingProgress}%`;
    }, updateInterval);

    // Add mouse movement tracking for loading screen
    document.addEventListener('mousemove', (e) => {
        if (loadingScreen) {
            const rect = loadingScreen.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            loadingScreen.style.setProperty('--mouse-x', `${x}%`);
            loadingScreen.style.setProperty('--mouse-y', `${y}%`);
        }
    });
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.style.display = 'none';
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        try {
            // Here you would typically send the data to your backend
            console.log('Form submitted with data:', data);
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error sending your message. Please try again later.');
        }
    });
}

// Navbar scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('hidden');
    observer.observe(section);
});

// API Configuration
const API_KEY = 'cbbff4e0-dc44-4106-9e43-2b54667ea532';
const API_BASE_URL = 'https://data.solanatracker.io';

// DOM Elements
const timeframeButtons = document.querySelectorAll('.timeframe-btn');
const coinsGrid = document.querySelector('.coins-grid');
const updateTimeSpan = document.getElementById('update-time');
const currentYearSpan = document.getElementById('current-year');

// Set current year in footer
currentYearSpan.textContent = new Date().getFullYear();

// State
let currentTimeframe = '3h'; // Default to 3h
let updateInterval;

// Utility Functions
const abbreviateNumber = (num) => {
    if (num === undefined || num === null) return 'N/A';
    
    const absNum = Math.abs(num);
    
    if (absNum < 1e3) return num.toFixed(2);
    if (absNum < 1e6) return (num / 1e3).toFixed(1) + 'K';
    if (absNum < 1e9) return (num / 1e6).toFixed(1) + 'M';
    if (absNum < 1e12) return (num / 1e9).toFixed(1) + 'B';
    return (num / 1e12).toFixed(1) + 'T';
};

const formatUSD = (num) => {
    if (num === undefined || num === null) return 'N/A';
    
    const absNum = Math.abs(num);
    
    // Handle small numbers with precision
    if (absNum < 0.01) return '<$0.01';
    if (absNum < 1) return '$' + num.toFixed(3);
    
    // Abbreviate larger numbers
    return '$' + abbreviateNumber(num);
};

const formatNumber = (num, maximumFractionDigits = 2) => {
    if (num === undefined || num === null) return 'N/A';
    
    const absNum = Math.abs(num);
    
    // Handle very small numbers
    if (absNum < 1e-6) return num.toExponential(2);
    if (absNum < 1) return num.toFixed(6);
    
    // Use abbreviations for larger numbers
    return abbreviateNumber(num);
};

const formatPercentage = (num) => {
    if (num === undefined || num === null) return 'N/A';
    
    // Keep percentages with 2 decimal places but add + sign for positive values
    return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
};

// Add new utility functions
const analyzeMomentum = (priceChanges) => {
    const timeframes = ['5m', '15m', '1h', '4h', '24h'];
    let positiveCount = 0;
    let totalCount = 0;

    timeframes.forEach(timeframe => {
        if (priceChanges[timeframe]) {
            totalCount++;
            if (priceChanges[timeframe].priceChangePercentage > 0) {
                positiveCount++;
            }
        }
    });

    const ratio = positiveCount / totalCount;
    if (ratio >= 0.7) return 'bullish';
    if (ratio <= 0.3) return 'bearish';
    return 'neutral';
};

const analyzeVolume = (volume, marketCap) => {
    if (!volume || !marketCap) return 'Insufficient data';
    const volumeRatio = volume / marketCap;
    
    if (volumeRatio >= 0.2) return 'High trading activity';
    if (volumeRatio >= 0.05) return 'Moderate trading activity';
    return 'Low trading activity';
};

const calculateRiskLevel = (marketCap, volume, priceChanges) => {
    let riskScore = 0;
    
    // Market cap risk (0-3 points)
    if (marketCap < 100000) riskScore += 3;
    else if (marketCap < 1000000) riskScore += 2;
    else if (marketCap < 10000000) riskScore += 1;

    // Volume risk (0-3 points)
    const volumeRatio = volume / marketCap;
    if (volumeRatio < 0.01) riskScore += 3;
    else if (volumeRatio < 0.05) riskScore += 2;
    else if (volumeRatio < 0.1) riskScore += 1;

    // Price volatility risk (0-3 points)
    const volatility = Math.abs(priceChanges['24h']?.priceChangePercentage || 0);
    if (volatility > 50) riskScore += 3;
    else if (volatility > 20) riskScore += 2;
    else if (volatility > 10) riskScore += 1;

    // Return risk level based on total score
    if (riskScore >= 7) return 'high';
    if (riskScore >= 4) return 'medium';
    return 'low';
};

// Add to existing utility functions
const calculateBuyingPressure = (events) => {
    const timeframes = ['5m', '15m', '1h', '4h', '24h'];
    let buyPressure = 0;
    let totalFrames = 0;

    timeframes.forEach(timeframe => {
        if (events[timeframe]) {
            totalFrames++;
            const change = events[timeframe].priceChangePercentage;
            const volume = events[timeframe].volumeChangePercentage || 0;
            
            if (change > 0 && volume > 0) {
                buyPressure += (change + volume) / 2;
            }
        }
    });

    return Math.min((buyPressure / totalFrames) * 10, 100);
};

const calculateTrendStrength = (events) => {
    const timeframes = ['5m', '15m', '1h', '4h', '24h'];
    let strength = 0;
    let totalFrames = 0;
    let prevChange = null;
    let consistentDirection = true;

    timeframes.forEach(timeframe => {
        if (events[timeframe]) {
            totalFrames++;
            const change = events[timeframe].priceChangePercentage;
            
            if (prevChange !== null) {
                if ((prevChange > 0 && change < 0) || (prevChange < 0 && change > 0)) {
                    consistentDirection = false;
                }
            }
            prevChange = change;
            
            strength += Math.abs(change);
        }
    });

    let trendStrength = (strength / totalFrames) * (consistentDirection ? 1.5 : 1);
    return Math.min(trendStrength * 5, 100);
};

// Add new utility function for buy signal
const analyzeBuySignal = (events, marketCap, buyingPressure, trendStrength) => {
    // Calculate score based on multiple factors
    let score = 0;
    
    // Momentum score (0-40 points)
    const timeframes = ['5m', '15m', '1h', '4h', '24h'];
    let positiveTimeframes = 0;
    timeframes.forEach(timeframe => {
        if (events[timeframe]?.priceChangePercentage > 0) {
            positiveTimeframes++;
        }
    });
    score += (positiveTimeframes / timeframes.length) * 40;

    // Buying pressure score (0-30 points)
    score += (buyingPressure / 100) * 30;

    // Trend strength score (0-30 points)
    score += (trendStrength / 100) * 30;

    // Market cap factor (-10 to +10 points)
    if (marketCap > 10000000) score += 10;
    else if (marketCap > 1000000) score += 5;
    else if (marketCap < 100000) score -= 10;
    else if (marketCap < 500000) score -= 5;

    // Determine signal based on final score
    if (score >= 75) return 'strong-buy';
    if (score >= 40) return 'hold';
    return 'sell';
};

// API Functions
const fetchTrendingCoins = async (timeframe) => {
    try {
        const response = await fetch(`${API_BASE_URL}/tokens/trending/${timeframe}`, {
            headers: {
                'x-api-key': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        // Validate data structure
        if (!Array.isArray(data)) {
            throw new Error('Invalid API response format');
        }

        // Filter out invalid entries and take top 6
        const validCoins = data
            .filter(coin => 
                coin && 
                coin.token && 
                coin.token.name && 
                coin.token.symbol && 
                coin.pools && 
                coin.pools.length > 0 && 
                coin.events
            )
            .slice(0, 6);

        if (validCoins.length === 0) {
            throw new Error('No valid coin data found');
        }

        return validCoins;
    } catch (error) {
        console.error('Error fetching trending coins:', error);
        throw error;
    }
};

// Sample coin data generator
const generateSampleCoins = (count) => {
    const sampleCoins = [
        { name: 'BONK', symbol: 'BONK', imageUrl: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I' },
        { name: 'Raydium', symbol: 'RAY', imageUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png' },
        { name: 'Samoyedcoin', symbol: 'SAMO', imageUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU/logo.png' },
        { name: 'Star Atlas', symbol: 'ATLAS', imageUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx/logo.png' },
        { name: 'Serum', symbol: 'SRM', imageUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt/logo.png' },
        { name: 'Orca', symbol: 'ORCA', imageUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE/logo.png' }
    ];

    return Array(count).fill().map((_, index) => {
        const baseData = sampleCoins[index % sampleCoins.length];
        const priceChange = (Math.random() * 40) - 20; // Random change between -20% and +20%
        const volume = Math.random() * 1000000 + 100000; // Random volume between 100K and 1.1M
        const price = Math.random() * 10 + 0.1; // Random price between 0.1 and 10.1

        return {
            token: {
                name: baseData.name,
                symbol: baseData.symbol,
                image: baseData.imageUrl
            },
            pools: {
                totalLiquidity: Math.random() * 5000000 + 500000
            },
            events: {
                [currentTimeframe]: {
                    priceChangePercentage: priceChange,
                    volume: volume,
                    price: price
                }
            }
        };
    });
};

// Enhanced createCoinCard function
const createCoinCard = (coin, index, isTopGainer) => {
    const card = document.createElement('div');
    card.className = `coin-card ${isTopGainer ? 'top-gainer' : ''}`;
    
    // Add decorative corners
    card.innerHTML = `
        <div class="corner corner-top-left"></div>
        <div class="corner corner-top-right"></div>
        <div class="corner corner-bottom-left"></div>
        <div class="corner corner-bottom-right"></div>
        <div class="compass-decoration"></div>
        ${isTopGainer ? '<div class="top-gainer-badge"><span class="badge-icon">⭐</span><span class="badge-text">Top Gainer</span></div>' : ''}
        <div class="coin-header">
            <div class="coin-image-wrapper">
                <img src="${coin.token.image}" alt="${coin.token.name}" class="coin-image">
            </div>
            <div class="coin-title">
                <h3>${coin.token.name}</h3>
                <div class="coin-symbol">$${coin.token.symbol}</div>
            </div>
        </div>
        <div class="coin-stats">
            <div class="stat-item">
                <div class="stat-label">Change</div>
                <div class="stat-value ${coin.events[currentTimeframe].priceChangePercentage >= 0 ? 'positive' : 'negative'}">
                    ${formatPercentage(coin.events[currentTimeframe].priceChangePercentage)}
                </div>
            </div>
        </div>
        <div class="view-analytics">
            <span>View Analytics</span>
            <i class="fas fa-arrow-right"></i>
        </div>
    `;

    // Add click handler for the entire card
    card.addEventListener('click', () => {
        const modal = document.getElementById('coinModal');
        if (modal) {
            modal.classList.add('visible');
            showModal(coin);
        }
    });

    return card;
};

// Enhanced updateCoinsGrid function
const updateCoinsGrid = async () => {
    try {
        // Add updating class to show transition
        if (coinsGrid) {
            coinsGrid.classList.add('updating');
        }

        let coins = await fetchTrendingCoins(currentTimeframe);
        
        // If no coins or less than 6 coins, generate sample data
        if (!coins || coins.length < 6) {
            coins = generateSampleCoins(6);
        }

        // Clear existing content
        coinsGrid.innerHTML = '';
        
        // Find the top gainer
        let maxChange = -Infinity;
        let topGainerIndex = 0;

        coins.forEach((coin, index) => {
            const change = coin.events?.[currentTimeframe]?.priceChangePercentage || 0;
            if (change > maxChange) {
                maxChange = change;
                topGainerIndex = index;
            }
        });

        // Create and add cards with staggered animation
        coins.forEach((coin, index) => {
            const isTopGainer = index === topGainerIndex;
            const card = createCoinCard(coin, index, isTopGainer);
            coinsGrid.appendChild(card);
            
            // Add staggered entrance animation
            requestAnimationFrame(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });

        // Update last updated time
        const now = new Date();
        const timeString = now.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        if (updateTimeSpan) {
            updateTimeSpan.textContent = timeString;
        }

        // Remove updating class after transition
        setTimeout(() => {
            if (coinsGrid) {
                coinsGrid.classList.remove('updating');
            }
        }, 400);

    } catch (error) {
        console.error('Error updating coins:', error);
        // Show sample data on error
        const sampleCoins = generateSampleCoins(6);
        if (coinsGrid) {
            coinsGrid.innerHTML = '';
            sampleCoins.forEach((coin, index) => {
                const isTopGainer = index === 0;
                const card = createCoinCard(coin, index, isTopGainer);
                coinsGrid.appendChild(card);
                
                // Add staggered animation even for sample data
                requestAnimationFrame(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            });
        }
    }
};

// Add click event listeners to timeframe buttons
timeframeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Prevent multiple clicks during transition
        if (button.classList.contains('active')) return;
        
        // Remove active class from all buttons
        timeframeButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update current timeframe
        currentTimeframe = button.dataset.timeframe;
        
        // Update the displayed timeframe text
        const currentTimeframeDisplay = document.querySelector('.current-timeframe');
        if (currentTimeframeDisplay) {
            currentTimeframeDisplay.textContent = `${currentTimeframe.toUpperCase()} Hours`;
        }
        
        // Add transition class to grid
        if (coinsGrid) {
            coinsGrid.classList.add('updating');
        }
        
        // Refresh the grid with new timeframe data
        updateCoinsGrid().then(() => {
            if (coinsGrid) {
                coinsGrid.classList.remove('updating');
            }
        });
    });
});

// Enhanced easing function for smoother progress
function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

// Particle burst effect function
function createParticlesBurst(container) {
    const particlesCount = 20;
    const colors = ['#FFD700', '#FFA500', '#FF8C00', '#DAA520'];
    
    for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'exit-particle';
        
        // Random properties for more organic movement
        const angle = (i / particlesCount) * 360;
        const velocity = 2 + Math.random() * 2;
        const size = 4 + Math.random() * 6;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            transform: rotate(${angle}deg) translateY(-100px);
            animation: particleBurst 0.8s ease-out forwards;
            animation-delay: ${Math.random() * 0.2}s;
        `;
        
        container.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// Add to your existing CSS (through JavaScript to ensure it's added after the loading screen)
const style = document.createElement('style');
style.textContent = `
    .loading-content {
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .loading-screen.hidden {
        opacity: 0;
        transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                    backdrop-filter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    main.fade-in {
        opacity: 0;
        animation: fadeInMain 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    @keyframes fadeInMain {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Enhanced modal handling
const showModal = (coinData) => {
    const modal = document.getElementById('coinModal');
    if (!modal) return;

    const { token, events } = coinData;
    const currentEvent = events[currentTimeframe] || {};
    
    // Update modal content with simplified structure
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-coin-info">
                    <img src="${token.image}" alt="${token.name}" class="modal-coin-image">
                    <div class="modal-coin-title">
                        <h2>${token.name}</h2>
                        <div class="modal-coin-symbol">$${token.symbol}</div>
                    </div>
                </div>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="timeframes-grid">
                    ${generateTimeframeStats(events)}
                </div>
                <div class="momentum-analysis">
                    <div class="momentum-header">
                        <i class="fas fa-chart-line momentum-icon"></i>
                        <h3 class="momentum-title">Momentum Analysis</h3>
                    </div>
                    <div class="momentum-content">
                        <div class="momentum-text-wrapper">
                            <p class="momentum-text">${generateMomentumAnalysis(events)}</p>
                        </div>
                        <div class="indicators-wrapper">
                            <div class="indicator buying-pressure">
                                <div class="indicator-header">
                                    <span class="indicator-label">Buying Pressure</span>
                                    <span class="indicator-value">${calculateBuyingPressure(events).toFixed(0)}%</span>
                                </div>
                                <div class="indicator-bar">
                                    <div class="indicator-fill" style="width: ${calculateBuyingPressure(events)}%">
                                        <div class="indicator-glow"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="indicator trend-strength">
                                <div class="indicator-header">
                                    <span class="indicator-label">Trend Strength</span>
                                    <span class="indicator-value">${calculateTrendStrength(events).toFixed(0)}%</span>
                                </div>
                                <div class="indicator-bar">
                                    <div class="indicator-fill" style="width: ${calculateTrendStrength(events)}%">
                                        <div class="indicator-glow"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add close handlers
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.onclick = () => closeModal();
    }
    
    // Close on background click
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };

    // Show modal
    modal.classList.add('visible');
};

const closeModal = () => {
    const modal = document.getElementById('coinModal');
    if (modal) {
    modal.classList.remove('visible');
    }
};

const generateTimeframeStats = (events) => {
    const timeframes = ['5m', '1h', '3h', '6h', '12h', '24h'];
    return timeframes.map(timeframe => {
        const change = events[timeframe]?.priceChangePercentage || 0;
        return `
            <div class="timeframe-stat">
                <span class="label">${timeframe.toUpperCase()}</span>
                <span class="value ${change >= 0 ? 'positive' : 'negative'}">
                    ${formatPercentage(change)}
                </span>
            </div>
        `;
    }).join('');
};

const generateMomentumAnalysis = (events) => {
    const buyingPressure = calculateBuyingPressure(events);
    const trendStrength = calculateTrendStrength(events);
    const change24h = events['24h']?.priceChangePercentage || 0;
    
    let analysis = '';
    
    if (buyingPressure > 70) {
        analysis = 'Strong buying pressure with sustained momentum.';
    } else if (buyingPressure > 40) {
        analysis = 'Moderate buying activity with balanced momentum.';
    } else {
        analysis = 'Limited buying pressure with potential consolidation.';
    }
    
    analysis += ` ${Math.abs(change24h).toFixed(1)}% ${change24h >= 0 ? 'gain' : 'decline'} over 24 hours.`;
    
    if (trendStrength > 70) {
        analysis += ' Showing strong trend continuation.';
    } else if (trendStrength > 40) {
        analysis += ' Displaying moderate trend strength.';
    } else {
        analysis += ' Exhibiting weak trend signals.';
    }
    
    return analysis;
};

// Initialize map features
let mapZoom = 1;
const MAP_MIN_ZOOM = 0.8;
const MAP_MAX_ZOOM = 1.5;

function initializeMapControls() {
    const mapContainer = document.querySelector('main');
    
    // Add zoom controls
    const zoomControls = document.createElement('div');
    zoomControls.className = 'map-controls';
    zoomControls.innerHTML = `
        <button class="map-control" id="zoomIn">
            <i class="fas fa-plus"></i>
        </button>
        <button class="map-control" id="zoomOut">
            <i class="fas fa-minus"></i>
        </button>
        <button class="map-control" id="toggleSound">
            <i class="fas fa-volume-up"></i>
        </button>
    `;
    document.body.appendChild(zoomControls);
    
    // Zoom functionality
    document.getElementById('zoomIn').onclick = () => updateZoom(0.1);
    document.getElementById('zoomOut').onclick = () => updateZoom(-0.1);
    
    // Add compass rose
    const compass = document.createElement('div');
    compass.className = 'compass-rose';
    compass.innerHTML = `
        <img src="/images/compass-rose.png" alt="Compass Rose">
    `;
    document.body.appendChild(compass);
}

function updateZoom(delta) {
    const newZoom = Math.max(MAP_MIN_ZOOM, Math.min(MAP_MAX_ZOOM, mapZoom + delta));
    if (newZoom !== mapZoom) {
        mapZoom = newZoom;
        document.querySelector('.coins-grid').style.transform = `scale(${mapZoom})`;
    }
}

function initializeAudioControls() {
    const soundButton = document.getElementById('toggleSound');
    let soundEnabled = false;
    
    soundButton.onclick = () => {
        soundEnabled = !soundEnabled;
        soundButton.querySelector('i').className = 
            `fas fa-volume-${soundEnabled ? 'up' : 'mute'}`;
        
        if (soundEnabled) {
            sounds.background.play();
        } else {
            sounds.background.pause();
        }
    };
}

// Add parallax effect to background
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    
    document.body.style.backgroundPosition = `${moveX}px ${moveY}px`;
    
    // Move compass rose
    const compass = document.querySelector('.compass-rose');
    if (compass) {
        compass.style.transform = `rotate(${moveX}deg)`;
    }
});

// Add new helper function for momentum summary
const generateMomentumSummary = (buyingPressure, trendStrength, change24h) => {
    const momentum = buyingPressure > trendStrength ? 'bullish' : 'bearish';
    const strength = buyingPressure > 70 ? 'strong' : buyingPressure > 40 ? 'moderate' : 'weak';
    const stability = Math.abs(change24h) < 10 ? 'stable' : Math.abs(change24h) < 20 ? 'volatile' : 'highly volatile';
    
    return `Market showing ${strength} ${momentum} momentum with ${stability} price action. 
           ${buyingPressure > trendStrength ? 'Buying pressure exceeds' : 'Trend strength dominates'} 
           current market dynamics.`;
};

// Initialize modal functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeModal);

document.addEventListener('DOMContentLoaded', function() {
    const enterButton = document.querySelector('.enter-button');
    const loadingScreen = document.querySelector('.loading-screen');
    const mainContent = document.querySelector('main');

    // Initialize loading screen
    function initializeLoadingScreen() {
        enterButton.addEventListener('click', startVoyage);
    }

    // Handle the transition to main content
    function startVoyage() {
        // Create particle effects
        createParticles();
        
        // Add exit animation classes
        loadingScreen.classList.add('exit');
        
        // Show main content after a delay
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.classList.add('enter');
        }, 800);
    }

    // Create particle effects on button click
    function createParticles() {
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'exit-particle';
            
            // Random position and animation
            const angle = (i / 12) * Math.PI * 2;
            const velocity = 100 + Math.random() * 50;
            particle.style.setProperty('--x', Math.cos(angle) * velocity + 'px');
            particle.style.setProperty('--y', Math.sin(angle) * velocity + 'px');
            
            enterButton.appendChild(particle);
            
            // Clean up particles
            setTimeout(() => particle.remove(), 1000);
        }
    }

    initializeLoadingScreen();
}); 