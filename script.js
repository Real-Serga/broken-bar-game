document.addEventListener('DOMContentLoaded', () => {
    
    // --- Core Progression Variables ---
    let currentProgress = 0.00;
    let clickPower = 1.00; 
    
    // Auto-Loader Stats
    let autoLoaders = 0;
    let autoLoaderCap = 10;
    let autoLoaderInterval = null;
    let capExpanded = false; 

    // Multiplier Stats
    let multipliers = 0;
    const multiplierCap = 3; 
    const multiplierCost = 15.00; 

    // --- HTML Elements ---
    const clickButton = document.getElementById('click-button');
    const percentageText = document.getElementById('percentage-text');
    const progressBarFill = document.getElementById('progress-fill-bar');

    const buyAutoloaderBtn = document.getElementById('buy-autoloader');
    const autoloaderCountText = document.getElementById('autoloader-count');
    const autoloaderUnlockInfo = document.getElementById('autoloader-unlock-info');
    
    const buyMultiplierBtn = document.getElementById('buy-multiplier');
    const multiplierCountText = document.getElementById('multiplier-count');

    const upgradesList = document.getElementById('upgrades-list');
    const leftScrollBtn = document.querySelector('.left-scroll');
    const rightScrollBtn = document.querySelector('.right-scroll');

    // --- Dynamic Pricing Function ---
    function getAutoLoaderCost() {
        let cost = 0;
        if (autoLoaders === 0) {
            cost = 0.50; 
        } else if (autoLoaders === 1) {
            cost = 0.75; 
        } else {
            cost = 0.75 + ((autoLoaders - 1) * 0.15); 
        }
        
        return Math.min(cost, 5.00);
    }

    // --- Global UI Updater ---
    function updateDisplay() {
        if (currentProgress > 100) {
            currentProgress = 100.00;
        }
        percentageText.innerText = currentProgress.toFixed(2) + '%';
        progressBarFill.style.width = currentProgress + '%';

        // Check Milestone: Expand Auto-Loader Cap at 25%
        if (currentProgress >= 25.00 && !capExpanded) {
            capExpanded = true;
            autoLoaderCap = 25; 
            spawnFloatingAlert("Auto-Loader Cap Expanded!");
        }

        // Continually check if buttons should be green (affordable) or gray (unaffordable)
        updateAutoLoaderUI(); 
        updateMultiplierUI();
    }

    // Refresh Auto-Loader UI (Handles Info Text, Max Costs, and Colors)
    function updateAutoLoaderUI() {
        autoloaderCountText.innerText = `${autoLoaders}/${autoLoaderCap}`;
        const currentCost = getAutoLoaderCost();
        
        if (autoLoaders >= autoLoaderCap) {
            buyAutoloaderBtn.classList.add('disabled');
            
            if (!capExpanded) {
                buyAutoloaderBtn.innerText = "MAX CAP";
                autoloaderUnlockInfo.style.display = "block";
                autoloaderUnlockInfo.innerText = "Reach 25.00% progress to unlock more!";
            } else {
                buyAutoloaderBtn.innerText = "MAX LEVEL";
                autoloaderUnlockInfo.style.display = "none";
            }
        } else {
            buyAutoloaderBtn.innerText = `Cost: ${currentCost.toFixed(2)}%`;
            autoloaderUnlockInfo.style.display = "none";

            // The Affordability Check
            if (currentProgress < currentCost) {
                buyAutoloaderBtn.classList.add('disabled'); // Turns gray
            } else {
                buyAutoloaderBtn.classList.remove('disabled'); // Turns green
            }
        }
    }

    // Refresh Multiplier UI (Handles Colors and Cap)
    function updateMultiplierUI() {
        multiplierCountText.innerText = `${multipliers}/${multiplierCap}`;
        
        if (multipliers >= multiplierCap) {
            buyMultiplierBtn.innerText = "MAX CAP";
            buyMultiplierBtn.classList.add('disabled');
        } else {
            buyMultiplierBtn.innerText = `Cost: ${multiplierCost.toFixed(2)}%`;
            
            // The Affordability Check
            if (currentProgress < multiplierCost) {
                buyMultiplierBtn.classList.add('disabled'); // Turns gray
            } else {
                buyMultiplierBtn.classList.remove('disabled'); // Turns green
            }
        }
    }

    // --- Main Click Event ---
    clickButton.addEventListener('click', (event) => {
        if (currentProgress < 100) {
            currentProgress += clickPower;
            updateDisplay();
            spawnFloatingText(event.clientX, event.clientY, `+${clickPower.toFixed(2)}%`);
        }
    });

    // --- Auto-Loader Purchase Logic ---
    buyAutoloaderBtn.addEventListener('click', () => {
        const currentCost = getAutoLoaderCost();

        if (currentProgress >= currentCost && autoLoaders < autoLoaderCap) {
            currentProgress -= currentCost;
            autoLoaders++;
            
            updateDisplay();

            if (!autoLoaderInterval) {
                autoLoaderInterval = setInterval(() => {
                    if (currentProgress < 100 && autoLoaders > 0) {
                        currentProgress += (0.01 * autoLoaders);
                        updateDisplay(); // Triggers UI checks every second too
                    }
                }, 1000); 
            }
        } else if (autoLoaders < autoLoaderCap) {
            buyAutoloaderBtn.innerText = "Not Enough!";
            setTimeout(() => { updateDisplay(); }, 1000);
        }
    });

    // --- Multiplier Purchase Logic ---
    buyMultiplierBtn.addEventListener('click', () => {
        if (currentProgress >= multiplierCost && multipliers < multiplierCap) {
            currentProgress -= multiplierCost;
            multipliers++;
            clickPower *= 1.1; 
            
            updateDisplay();
        } else if (multipliers < multiplierCap) {
            buyMultiplierBtn.innerText = "Not Enough!";
            setTimeout(() => { updateDisplay(); }, 1000);
        }
    });

    // --- Carousel Scrolling Logic ---
    leftScrollBtn.addEventListener('click', () => {
        upgradesList.scrollBy({ left: -200, behavior: 'smooth' });
    });

    rightScrollBtn.addEventListener('click', () => {
        upgradesList.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // --- Visual Feedback Functions ---
    function spawnFloatingText(x, y, text) {
        const floatText = document.createElement('div');
        floatText.innerText = text; 
        floatText.classList.add('floating-text'); 
        
        floatText.style.left = (x - 20) + 'px'; 
        floatText.style.top = (y - 20) + 'px';
        
        document.body.appendChild(floatText);
        
        setTimeout(() => {
            floatText.remove();
        }, 1000);
    }

    function spawnFloatingAlert(text) {
        const alertText = document.createElement('div');
        alertText.innerText = text;
        alertText.classList.add('floating-alert');
        
        alertText.style.left = '50%';
        alertText.style.top = '20%';
        alertText.style.transform = 'translateX(-50%)';
        
        document.body.appendChild(alertText);
        
        setTimeout(() => {
            alertText.remove();
        }, 3000); 
    }

    // --- Initialization ---
    // Run this once at the start so buttons are gray immediately upon loading
    updateDisplay();
});