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
        // Set initial timeframe
        const defaultButton = document.querySelector('.timeframe-btn[data-timeframe="24h"]');
        if (defaultButton) {
            defaultButton.classList.add('active');
            currentTimeframe = '24h';
        }

        // Initial data load
        updateCoinsGrid().then(() => {
            // Set up auto-refresh
            if (updateInterval) clearInterval(updateInterval);
            setInterval(updateCoinsGrid, 45000);
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
let currentTimeframe = '24h';
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

// UI Functions
const createCoinCard = (coinData, index, isTopGainer) => {
    const { token, pools, events } = coinData;
    const mainPool = pools[0] || {};
    const marketCap = mainPool.marketCap?.usd || 0;
    
    const card = document.createElement('div');
    card.className = `coin-card${isTopGainer ? ' top-gainer' : ''}`;

    // Format market cap with enhanced precision and premium tiers
    const formatMarketCap = (marketCap) => {
        const formatNumber = (num, decimals = 1) => {
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }).format(num);
        };

        if (marketCap >= 1e9) {
            return `$${formatNumber(marketCap / 1e9)}B <span class="tier">Sovereign</span>`;
        }
        if (marketCap >= 1e6) {
            return `$${formatNumber(marketCap / 1e6)}M <span class="tier">Fortune</span>`;
        }
        return `$${formatNumber(marketCap / 1e3)}K <span class="tier">Venture</span>`;
    };

    // Calculate trend strength with dynamic indicators
    const trendStrength = Math.min(Math.abs(events[currentTimeframe]?.priceChangePercentage || 0) * 2, 100);
    const getTrendEmoji = (strength) => {
        if (strength >= 80) return '⚡';
        if (strength >= 60) return '🌊';
        if (strength >= 40) return '⛵';
        if (strength >= 20) return '🌅';
        return '🌊';
    };
    
    // Format price change with premium styling
    const formatPriceChange = (change) => {
        const formatted = Math.abs(change || 0).toFixed(1);
        const prefix = (change || 0) >= 0 ? '+' : '-';
        const emoji = (change || 0) >= 0 ? '📈' : '📉';
        return `<div class="change-value">
            <span class="prefix">${prefix}</span>${formatted}<span class="percent">%</span>
            <span class="trend-emoji">${emoji}</span>
        </div>`;
    };

    const priceChange = events[currentTimeframe]?.priceChangePercentage || 0;
    const formattedChange = formatPriceChange(priceChange);
    const changeClass = priceChange >= 0 ? 'positive' : 'negative';

    // Ensure image URL is valid, use fallback if needed
    const imageUrl = token.image || 'https://via.placeholder.com/48?text=NA';
    const fallbackImage = 'https://via.placeholder.com/48?text=NA';

    // Enhanced top gainer badge with premium design
    const topGainerBadge = isTopGainer ? `
        <div class="top-gainer-badge">
            <span class="badge-icon">✨</span>
            <span class="badge-text">Top Pick</span>
        </div>
    ` : '';

    card.innerHTML = `
        ${topGainerBadge}
        <div class="coin-header">
            <div class="coin-main-info">
                <div class="coin-image-wrapper">
                    <img src="${imageUrl}" 
                         alt="${token.name}" 
                         class="coin-image" 
                         loading="lazy"
                         onerror="this.src='${fallbackImage}'; this.onerror=null;">
                </div>
                <div class="coin-title">
                    <h3>${token.name}</h3>
                    <span class="coin-symbol">$${token.symbol}</span>
                </div>
            </div>
        </div>
        <div class="coin-key-stats">
            <div class="stat">
                <span class="label">Value</span>
                <span class="value">${formatMarketCap(marketCap)}</span>
            </div>
            <div class="stat">
                <span class="label">${currentTimeframe}</span>
                <span class="value ${changeClass}">${formattedChange}</span>
            </div>
            <div class="stat">
                <span class="label">Momentum ${getTrendEmoji(trendStrength)}</span>
                <div class="trend-meter">
                    <div class="trend-fill" style="width: ${trendStrength}%"></div>
                    <span class="trend-value">${Math.round(trendStrength)}%</span>
                </div>
            </div>
        </div>
    `;

    // Add click handler for modal
    card.addEventListener('click', () => showModal(coinData));

    return card;
};

const updateCoinsGrid = async () => {
    try {
        const coins = await fetchTrendingCoins(currentTimeframe);
        
        if (!coins || coins.length === 0) {
            coinsGrid.innerHTML = '<div class="error-message">No trending coins available</div>';
            return;
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

        // Create and add cards
        coins.forEach((coin, index) => {
            if (!coin.token || !coin.pools || !coin.events) {
                console.warn('Invalid coin data structure:', coin);
                return;
            }

            const isTopGainer = index === topGainerIndex;
            const card = createCoinCard(coin, index, isTopGainer);
            coinsGrid.appendChild(card);
        });

        // Update last updated time with enhanced format
        const now = new Date();
        const timeString = now.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        updateTimeSpan.textContent = `Last Updated: ${timeString}`;

    } catch (error) {
        console.error('Error updating coins:', error);
        coinsGrid.innerHTML = '<div class="error-message">Failed to load trending coins</div>';
    }
};

// Add click event listeners to timeframe buttons
timeframeButtons.forEach(button => {
    button.addEventListener('click', () => {
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
        
        // Refresh the grid with new timeframe data
        updateCoinsGrid();
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
    const { token, pools, events } = coinData;
    const mainPool = pools[0] || {};
    const marketCap = mainPool.marketCap?.usd;
    const change24h = events?.['24h']?.priceChangePercentage;
    
    const buyingPressure = calculateBuyingPressure(events);
    const trendStrength = calculateTrendStrength(events);
    const riskLevel = calculateRiskLevel(marketCap, 0, events);

    // Calculate market cap tier for enhanced display
    const marketCapTier = marketCap > 10000000 ? 'Established' :
                         marketCap > 1000000 ? 'Growing' : 'Emerging';
    const marketCapTierClass = marketCapTier.toLowerCase();

    const modal = document.getElementById('coinModal');
    if (!modal) return;

    const modalContent = `
        <div class="modal-header">
            <div class="modal-coin-info">
                <img class="modal-coin-image" src="${token.image || 'https://via.placeholder.com/48'}" alt="${token.name}">
                <div class="modal-coin-title">
                    <h2 class="modal-coin-name">${token.name}</h2>
                    <span class="modal-coin-symbol">$${token.symbol}</span>
                </div>
            </div>
            <button class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
            <div class="modal-stats-grid">
                <div class="modal-stat market-cap-stat">
                    <span class="stat-label">💰 Market Cap</span>
                    <div class="market-cap-content">
                        <span class="stat-value">${formatUSD(marketCap)}</span>
                        <span class="market-cap-tier ${marketCapTierClass}">
                            ${marketCapTier} Project
                        </span>
                    </div>
                </div>
                <div class="modal-stat highlight-stat ${change24h >= 0 ? 'positive' : 'negative'}">
                    <span class="stat-label">📈 24h Change</span>
                    <div class="change-value">
                        <i class="fas fa-arrow-${change24h >= 0 ? 'up' : 'down'}"></i>
                        <span class="stat-value">${formatPercentage(change24h)}</span>
                    </div>
                </div>
                <div class="modal-stat">
                    <span class="stat-label">⚡ Trend Strength</span>
                    <div class="trend-meter">
                        <div class="trend-fill" style="width: ${trendStrength}%"></div>
                        <span class="trend-value">${Math.round(trendStrength)}%</span>
                    </div>
                </div>
                <div class="modal-stat">
                    <span class="stat-label">🎯 Risk Level</span>
                    <span class="stat-value risk-${riskLevel}">${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}</span>
                </div>
            </div>

            <div class="modal-price-changes">
                <h3>⏱️ Price Action</h3>
                <div class="timeframes-grid">
                    ${generateTimeframeStats(events)}
                </div>
            </div>

            <div class="modal-analysis">
                <div class="analysis-section momentum-analysis">
                    <h3>📊 Market Momentum</h3>
                    <div class="momentum-grid">
                        <div class="momentum-indicator">
                            <span class="indicator-label">Buying Pressure</span>
                            <div class="indicator-bar">
                                <div class="indicator-fill" style="width: ${buyingPressure}%"></div>
                                <span class="indicator-value">${Math.round(buyingPressure)}%</span>
                            </div>
                            <span class="indicator-status ${buyingPressure > 70 ? 'strong' : buyingPressure > 40 ? 'moderate' : 'weak'}">
                                ${buyingPressure > 70 ? 'Strong' : buyingPressure > 40 ? 'Moderate' : 'Weak'} Pressure
                            </span>
                        </div>
                        <div class="momentum-indicator">
                            <span class="indicator-label">Price Stability</span>
                            <div class="indicator-bar">
                                <div class="indicator-fill" style="width: ${100 - Math.abs(change24h)}%"></div>
                                <span class="indicator-value">${Math.round(100 - Math.abs(change24h))}%</span>
                            </div>
                        </div>
                        <div class="momentum-summary">
                            <div class="summary-header">
                                <span class="summary-title">Momentum Analysis</span>
                                <span class="momentum-badge ${buyingPressure > trendStrength ? 'bullish' : 'bearish'}">
                                    ${buyingPressure > trendStrength ? '🚀 Bullish' : '🔻 Bearish'}
                                </span>
                            </div>
                            <p class="summary-text">
                                ${generateMomentumSummary(buyingPressure, trendStrength, change24h)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.querySelector('.modal-content').innerHTML = modalContent;
    
    // Add event listeners for closing
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.onclick = () => closeModal(modal);
    modal.onclick = (e) => {
        if (e.target === modal) closeModal(modal);
    };

    // Show modal with animation
    requestAnimationFrame(() => {
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    });
};

const closeModal = (modal) => {
    modal.classList.remove('visible');
    document.body.style.overflow = '';
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

const generateMomentumAnalysis = (events, marketCap) => {
    const momentum = analyzeMomentum(events);
    const change24h = events?.['24h']?.priceChangePercentage || 0;
    const change1h = events?.['1h']?.priceChangePercentage || 0;

    const marketCapTier = marketCap > 10000000 ? 'established' :
                         marketCap > 1000000 ? 'growing' : 'emerging';

    return `This ${marketCapTier} token is showing ${momentum} momentum with a 
            ${Math.abs(change24h).toFixed(1)}% ${change24h >= 0 ? 'gain' : 'decline'} over 24 hours. 
            Recent activity indicates ${change1h >= 0 ? 'positive' : 'negative'} short-term momentum 
            with a ${Math.abs(change1h).toFixed(1)}% ${change1h >= 0 ? 'increase' : 'decrease'} in the past hour.`;
};

const generateVolumeAnalysis = (volume24h, marketCap) => {
    if (!volume24h || !marketCap) return 'Insufficient trading data available.';

    const volumeRatio = volume24h / marketCap;
    const volumeLevel = volumeRatio >= 0.2 ? 'high' :
                       volumeRatio >= 0.1 ? 'moderate' :
                       volumeRatio >= 0.05 ? 'steady' : 'light';

    const liquidityAssessment = volumeRatio >= 0.15 ? 'highly liquid' :
                               volumeRatio >= 0.08 ? 'moderately liquid' : 'limited liquidity';

    return `Trading activity shows ${volumeLevel} volume with ${formatUSD(volume24h)} in 24-hour trades. 
            The token demonstrates ${liquidityAssessment} with a volume/market cap ratio of ${(volumeRatio * 100).toFixed(1)}%.`;
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