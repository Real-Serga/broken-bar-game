document.addEventListener('DOMContentLoaded', () => {
    
    // --- Core Progression Variables ---
    let currentProgress = 0.00;
    let clickPower = 1.00; 
    
    // Auto-Loader Stats
    let autoLoaders = 0;
    let autoLoaderCap = 10;
    let capExpanded = false; 

    // Multiplier Stats
    let multipliers = 0;
    const multiplierCap = 3; 
    const multiplierCosts = [15.00, 30.00, 40.00];

    // --- Threat System Variables ---
    const threatOverlay = document.getElementById('threat-overlay');
    let activeMalwares = []; 
    let bloatwareActive = false; 
    let adwareActiveCount = 0; // Tracks if massive adwares are choking progress

    // --- HTML Elements ---
    const clickButton = document.getElementById('click-button');
    const percentageText = document.getElementById('percentage-text');
    const progressBarFill = document.getElementById('progress-fill-bar');

    const buyAutoloaderBtn = document.getElementById('buy-autoloader');
    const autoloaderCountText = document.getElementById('autoloader-count');
    const autoloaderInfoCircle = document.getElementById('autoloader-info');
    
    const buyMultiplierBtn = document.getElementById('buy-multiplier');
    const multiplierCountText = document.getElementById('multiplier-count');

    const upgradesList = document.getElementById('upgrades-list');
    const leftScrollBtn = document.querySelector('.left-scroll');
    const rightScrollBtn = document.querySelector('.right-scroll');

    // --- Dynamic Pricing Functions ---
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

    function getMultiplierCost() {
        return multiplierCosts[multipliers] || multiplierCosts[multiplierCosts.length - 1];
    }

    // --- Global UI Updater ---
    function updateDisplay() {
        if (currentProgress < 0) currentProgress = 0.00;
        if (currentProgress > 100) currentProgress = 100.00;
        
        percentageText.innerText = currentProgress.toFixed(2) + '%';
        progressBarFill.style.width = currentProgress + '%';

        // Check Milestone: Expand Auto-Loader Cap at 25%
        if (currentProgress >= 25.00 && !capExpanded) {
            capExpanded = true;
            autoLoaderCap = 25; 
            spawnFloatingAlert("Auto-Loader Cap Expanded!");
        }

        updateAutoLoaderUI(); 
        updateMultiplierUI();
    }

    function updateAutoLoaderUI() {
        autoloaderCountText.innerText = `${autoLoaders}/${autoLoaderCap}`;
        const currentCost = getAutoLoaderCost();
        
        if (autoLoaders >= autoLoaderCap) {
            buyAutoloaderBtn.classList.add('disabled');
            if (!capExpanded) {
                buyAutoloaderBtn.innerText = "MAX CAP";
                autoloaderInfoCircle.style.display = "inline-block"; 
            } else {
                buyAutoloaderBtn.innerText = "MAX LEVEL";
                autoloaderInfoCircle.style.display = "none";
            }
        } else {
            buyAutoloaderBtn.innerText = `Cost: ${currentCost.toFixed(2)}%`;
            autoloaderInfoCircle.style.display = "none";
            if (currentProgress < currentCost) {
                buyAutoloaderBtn.classList.add('disabled'); 
            } else {
                buyAutoloaderBtn.classList.remove('disabled'); 
            }
        }
    }

    function updateMultiplierUI() {
        multiplierCountText.innerText = `${multipliers}/${multiplierCap}`;
        if (multipliers >= multiplierCap) {
            buyMultiplierBtn.innerText = "MAX CAP";
            buyMultiplierBtn.classList.add('disabled');
        } else {
            const currentMultCost = getMultiplierCost();
            buyMultiplierBtn.innerText = `Cost: ${currentMultCost.toFixed(2)}%`;
            if (currentProgress < currentMultCost) {
                buyMultiplierBtn.classList.add('disabled'); 
            } else {
                buyMultiplierBtn.classList.remove('disabled'); 
            }
        }
    }

    // --- Main Click Event ---
    clickButton.addEventListener('click', (event) => {
        if (currentProgress < 100) {
            
            // Calculate effective click power
            let effectiveClickPower = clickPower;
            
            // Bloatware Debuff: Holds back manual clicking power by 50% margin
            if (bloatwareActive) {
                effectiveClickPower *= 0.5;
            }

            currentProgress += effectiveClickPower;
            updateDisplay();
            spawnFloatingText(event.clientX, event.clientY, `+${effectiveClickPower.toFixed(2)}%`, '#32CD32');
        }
    });

    // --- Auto-Loader Purchase Logic ---
    buyAutoloaderBtn.addEventListener('click', () => {
        const currentCost = getAutoLoaderCost();
        if (currentProgress >= currentCost && autoLoaders < autoLoaderCap) {
            currentProgress -= currentCost;
            autoLoaders++;
            updateDisplay();
        } else if (autoLoaders < autoLoaderCap) {
            buyAutoloaderBtn.innerText = "Not Enough!";
            setTimeout(() => { updateDisplay(); }, 1000);
        }
    });

    // --- Multiplier Purchase Logic ---
    buyMultiplierBtn.addEventListener('click', () => {
        const currentMultCost = getMultiplierCost();
        if (currentProgress >= currentMultCost && multipliers < multiplierCap) {
            currentProgress -= currentMultCost;
            multipliers++;
            clickPower *= 1.1; 
            updateDisplay();
        } else if (multipliers < multiplierCap) {
            buyMultiplierBtn.innerText = "Not Enough!";
            setTimeout(() => { updateDisplay(); }, 1000);
        }
    });

    // --- Global Game Loop (Runs every 1 second) ---
    setInterval(() => {
        if (currentProgress < 100) {
            // 1. Calculate Generation
            let generation = (0.01 * autoLoaders);
            
            // Bloatware Debuff: Halves passive generation speed
            if (bloatwareActive) {
                generation *= 0.5; 
            }

            // Adware Debuff: Chokes progress to a crawl (10% of normal)
            if (adwareActiveCount > 0) {
                generation *= 0.1;
            }
            
            // 2. Calculate Drain
            let drain = (activeMalwares.length * 0.05);

            // 3. Apply changes
            currentProgress += generation;
            currentProgress -= drain;
            
            updateDisplay();
        }
    }, 1000);


    // --- Threat Spawning Functions ---

    function getRandomPosition(width, height) {
        const x = Math.max(0, Math.random() * (window.innerWidth - width));
        const y = Math.max(0, Math.random() * (window.innerHeight - height));
        return { x, y };
    }

    function spawnMalware() {
        const malware = document.createElement('div');
        malware.classList.add('malware-entity');
        
        let hp = 3; 
        malware.innerHTML = `MALWARE<br>HP:${hp}`;
        
        const pos = getRandomPosition(45, 45);
        malware.style.left = `${pos.x}px`;
        malware.style.top = `${pos.y}px`;

        threatOverlay.appendChild(malware);
        activeMalwares.push(malware); 

        malware.addEventListener('click', (e) => {
            hp--;
            malware.innerHTML = `MALWARE<br>HP:${hp}`;
            spawnFloatingText(e.clientX, e.clientY, `-1 HP`, '#ff0000');
            
            if (hp <= 0) {
                malware.remove();
                activeMalwares = activeMalwares.filter(m => m !== malware);
            }
        });
    }

    function spawnBloatware() {
        if (bloatwareActive) return; 
        
        const bloatware = document.createElement('div');
        bloatware.classList.add('bloatware-entity');
        bloatwareActive = true; 
        
        let hp = 5; 
        bloatware.innerHTML = `BLOAT<br>HP:${hp}<br><span style="font-size: 8px; color: #ffaaaa; margin-top: 2px;">-50% GAIN</span>`;
        
        const pos = getRandomPosition(65, 65);
        bloatware.style.left = `${pos.x}px`;
        bloatware.style.top = `${pos.y}px`;

        threatOverlay.appendChild(bloatware);

        bloatware.addEventListener('click', (e) => {
            hp--;
            bloatware.innerHTML = `BLOAT<br>HP:${hp}<br><span style="font-size: 8px; color: #ffaaaa; margin-top: 2px;">-50% GAIN</span>`;
            spawnFloatingText(e.clientX, e.clientY, `-1 HP`, '#cccccc');
            
            if (hp <= 0) {
                bloatware.remove();
                bloatwareActive = false; 
            }
        });
    }

    function spawnAdware() {
        const adware = document.createElement('div');
        adware.classList.add('adware-popup');
        
        // Updated boundaries for the 350x200 pixel size
        const adwareWidth = 350;
        const adwareHeight = 200;
        const pos = getRandomPosition(adwareWidth, adwareHeight);
        
        adware.style.left = `${pos.x}px`;
        adware.style.top = `${pos.y}px`;

        adware.innerHTML = `
            <div class="adware-header">
                <span>⚠️ CRITICAL SYSTEM ALERT ⚠️</span>
                <span class="adware-close">X</span>
            </div>
            <div class="adware-body">
                <span>SYSTEM RESOURCES EXHAUSTED!</span>
                <br>
                <span style="font-size: 0.9rem; color: #ff3333;">(Progress generation severely reduced)</span>
            </div>
        `;

        threatOverlay.appendChild(adware);
        adwareActiveCount++; // Apply the progress choke hold

        const closeBtn = adware.querySelector('.adware-close');
        closeBtn.addEventListener('click', () => {
            adware.remove();
            adwareActiveCount--; // Release the choke hold
        });
    }

    // --- Dynamic Threat Director ---
    let threatSpawnTimer = 0;

    setInterval(() => {
        // Base spawn rate is every 10 seconds.
        // Aggression Spike: Once progress reaches 30%, spawn rate jumps to every 4 seconds.
        let currentSpawnRate = (currentProgress >= 30.00) ? 4 : 10;
        
        threatSpawnTimer++;
        
        if (threatSpawnTimer >= currentSpawnRate) {
            threatSpawnTimer = 0; // Reset timer
            
            const rand = Math.random();
            if (rand < 0.33) {
                spawnMalware();
            } else if (rand < 0.66) {
                spawnBloatware();
            } else {
                spawnAdware();
            }
        }
    }, 1000); 

    // --- Carousel Scrolling Logic ---
    leftScrollBtn.addEventListener('click', () => {
        upgradesList.scrollBy({ left: -200, behavior: 'smooth' });
    });

    rightScrollBtn.addEventListener('click', () => {
        upgradesList.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // --- Visual Feedback Functions ---
    function spawnFloatingText(x, y, text, color = '#32CD32') {
        const floatText = document.createElement('div');
        floatText.innerText = text; 
        floatText.classList.add('floating-text'); 
        floatText.style.color = color;
        
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
    updateDisplay();
});