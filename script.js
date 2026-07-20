document.addEventListener('DOMContentLoaded', () => {
    
    // --- Core Progression Variables ---
    let currentProgress = 0.00;
    let clickPower = 1.00; 
    
    // Auto-Loader Stats
    let autoLoaders = 0;
    let autoLoaderCap = 10;
    const autoLoaderCost = 5.00;
    let autoLoaderInterval = null;
    let capExpanded = false; // Tracks if we hit the 25% threshold

    // Multiplier Stats
    let multipliers = 0;
    const multiplierCost = 15.00; 

    // --- HTML Elements ---
    const clickButton = document.getElementById('click-button');
    const percentageText = document.getElementById('percentage-text');
    const progressBarFill = document.getElementById('progress-fill-bar');

    const buyAutoloaderBtn = document.getElementById('buy-autoloader');
    const autoloaderCountText = document.getElementById('autoloader-count');
    
    const buyMultiplierBtn = document.getElementById('buy-multiplier');
    const multiplierCountText = document.getElementById('multiplier-count');

    const upgradesList = document.getElementById('upgrades-list');
    const leftScrollBtn = document.querySelector('.left-scroll');
    const rightScrollBtn = document.querySelector('.right-scroll');

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
            autoLoaderCap = 25; // Expands the cap limits
            updateAutoLoaderUI(); // Refresh the button visuals
            spawnFloatingAlert("Auto-Loader Cap Expanded!");
        }
    }

    // Refresh Auto-Loader UI specifically
    function updateAutoLoaderUI() {
        autoloaderCountText.innerText = `${autoLoaders}/${autoLoaderCap}`;
        
        if (autoLoaders >= autoLoaderCap) {
            buyAutoloaderBtn.innerText = "MAX CAP";
            buyAutoloaderBtn.classList.add('disabled');
        } else {
            buyAutoloaderBtn.innerText = `Cost: ${autoLoaderCost.toFixed(2)}%`;
            buyAutoloaderBtn.classList.remove('disabled');
        }
    }

    // --- Main Click Event ---
    clickButton.addEventListener('click', (event) => {
        if (currentProgress < 100) {
            currentProgress += clickPower;
            updateDisplay();
            // Pass dynamically updated click power to floating text
            spawnFloatingText(event.clientX, event.clientY, `+${clickPower.toFixed(2)}%`);
        }
    });

    // --- Auto-Loader Purchase Logic ---
    buyAutoloaderBtn.addEventListener('click', () => {
        if (currentProgress >= autoLoaderCost && autoLoaders < autoLoaderCap) {
            currentProgress -= autoLoaderCost;
            autoLoaders++;
            
            updateAutoLoaderUI();
            updateDisplay();

            // Start or accelerate the passive income loop
            if (!autoLoaderInterval) {
                autoLoaderInterval = setInterval(() => {
                    if (currentProgress < 100 && autoLoaders > 0) {
                        // Generates 0.01% multiplied by however many auto-loaders you own
                        currentProgress += (0.01 * autoLoaders);
                        updateDisplay();
                    }
                }, 1000); 
            }
        } else if (autoLoaders < autoLoaderCap) {
            buyAutoloaderBtn.innerText = "Not Enough!";
            setTimeout(() => { updateAutoLoaderUI(); }, 1000);
        }
    });

    // --- Multiplier Purchase Logic ---
    buyMultiplierBtn.addEventListener('click', () => {
        if (currentProgress >= multiplierCost) {
            currentProgress -= multiplierCost;
            multipliers++;
            clickPower *= 1.1; // Increases base click power by 1.1x geometrically
            
            multiplierCountText.innerText = multipliers;
            updateDisplay();
        } else {
            buyMultiplierBtn.innerText = "Not Enough!";
            setTimeout(() => { buyMultiplierBtn.innerText = `Cost: ${multiplierCost.toFixed(2)}%`; }, 1000);
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
    // Floating text tied to the mouse position
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

    // Centered golden alert text for milestones
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
});