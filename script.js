document.addEventListener('DOMContentLoaded', () => {
    
    let currentProgress = 0.00;
    let autoLoaderInterval = null; // Keeps track of our automatic generation
    
    // Core Game Elements
    const clickButton = document.getElementById('click-button');
    const percentageText = document.getElementById('percentage-text');
    const progressBarFill = document.getElementById('progress-fill-bar');

    // Upgrade Shop Elements
    const buyAutoloaderBtn = document.getElementById('buy-autoloader');
    const upgradesList = document.getElementById('upgrades-list');
    const leftScrollBtn = document.querySelector('.left-scroll');
    const rightScrollBtn = document.querySelector('.right-scroll');

    // --- Core UI Update Function ---
    // Moved to a separate function so we can call it from clicks AND upgrades
    function updateDisplay() {
        if (currentProgress > 100) {
            currentProgress = 100.00;
        }
        percentageText.innerText = currentProgress.toFixed(2) + '%';
        progressBarFill.style.width = currentProgress + '%';
    }

    // --- Main Click Event ---
    clickButton.addEventListener('click', (event) => {
        if (currentProgress < 100) {
            currentProgress += 1.00; // Still 1% for testing
            updateDisplay();
            spawnFloatingText(event.clientX, event.clientY);
        }
    });

    // --- Store Purchase Logic ---
    buyAutoloaderBtn.addEventListener('click', () => {
        // Check if the user has enough progress to buy it (Cost: 5.00%)
        if (currentProgress >= 5.00) {
            // 1. Deduct the cost
            currentProgress -= 5.00;
            updateDisplay();

            // 2. Prevent buying it over and over for now (Optional, but good for V1)
            buyAutoloaderBtn.innerText = "Purchased!";
            buyAutoloaderBtn.classList.add('disabled');
            buyAutoloaderBtn.disabled = true;

            // 3. Start the passive income loop
            if (!autoLoaderInterval) {
                autoLoaderInterval = setInterval(() => {
                    if (currentProgress < 100) {
                        currentProgress += 0.01; // Generates 0.01% every tick
                        updateDisplay();
                    }
                }, 1000); // 1000ms = 1 second
            }
        } else {
            // Give a quick visual feedback if they don't have enough
            buyAutoloaderBtn.innerText = "Not Enough!";
            setTimeout(() => {
                buyAutoloaderBtn.innerText = "Cost: 5.00%";
            }, 1000);
        }
    });

    // --- Carousel Scrolling Logic ---
    leftScrollBtn.addEventListener('click', () => {
        upgradesList.scrollBy({ left: -200, behavior: 'smooth' });
    });

    rightScrollBtn.addEventListener('click', () => {
        upgradesList.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // --- Function to create floating text ---
    function spawnFloatingText(x, y) {
        const floatText = document.createElement('div');
        floatText.innerText = '+1.00%'; 
        floatText.classList.add('floating-text'); 
        
        floatText.style.left = (x - 20) + 'px'; 
        floatText.style.top = (y - 20) + 'px';
        
        document.body.appendChild(floatText);
        
        setTimeout(() => {
            floatText.remove();
        }, 1000);
    }
});