document.addEventListener('DOMContentLoaded', () => {
    
    // --- Core Progression Variables ---
    let currentProgress = 0.00;
    let clickPower = 1.00; 
    let highestMilestone = 0; // Tracks every 10% bracket reached
    
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
    let adwareActiveCount = 0; 

    // --- Buff & Debuff Variables ---
    let clickBoostTimer = 0;      // 2x Click Power
    let productionBoostTimer = 0; // 2x Generation Speed
    let productionDebuffTimer = 0;// 0.5x Generation Speed

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
    
    const activeBoostsList = document.querySelector('.active-boosts-list'); // Left Panel

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

        // Check Milestone: Every 10% for the Gamble Wheel
        let currentMilestone = Math.floor(currentProgress / 10) * 10;
        if (currentMilestone > highestMilestone && currentMilestone < 100) {
            highestMilestone = currentMilestone;
            spawnGamblePopup();
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

    // Dynamic Left Panel Builder
    function updateBoostsUI() {
        activeBoostsList.innerHTML = ''; 
        let hasActiveEffect = false;
        
        if (clickBoostTimer > 0) {
            hasActiveEffect = true;
            const boostDiv = document.createElement('div');
            boostDiv.classList.add('active-boost-item');
            boostDiv.innerHTML = `2x CLICK<br>${clickBoostTimer}s`;
            activeBoostsList.appendChild(boostDiv);
        }
        
        if (productionBoostTimer > 0) {
            hasActiveEffect = true;
            const prodDiv = document.createElement('div');
            prodDiv.classList.add('active-boost-item');
            prodDiv.innerHTML = `2x PROD<br>${productionBoostTimer}s`;
            activeBoostsList.appendChild(prodDiv);
        }

        if (productionDebuffTimer > 0) {
            hasActiveEffect = true;
            const debuffDiv = document.createElement('div');
            debuffDiv.classList.add('active-debuff-item');
            debuffDiv.innerHTML = `0.5x PROD<br>${productionDebuffTimer}s`;
            activeBoostsList.appendChild(debuffDiv);
        }

        if (!hasActiveEffect) {
            activeBoostsList.innerHTML = `
                <div class="boost-placeholder"></div>
                <div class="boost-placeholder"></div>
                <div class="boost-placeholder"></div>
            `;
        }
    }

    // --- Main Click Event ---
    clickButton.addEventListener('click', (event) => {
        if (currentProgress < 100) {
            let effectiveClickPower = clickPower;
            
            // Gamble Buff: 2x Clicks
            if (clickBoostTimer > 0) {
                effectiveClickPower *= 2;
            }
            
            // Bloatware Debuff
            if (bloatwareActive) {
                effectiveClickPower *= 0.5;
            }

            currentProgress += effectiveClickPower;
            updateDisplay();
            
            let floatColor = clickBoostTimer > 0 ? '#FFD700' : '#32CD32'; 
            spawnFloatingText(event.clientX, event.clientY, `+${effectiveClickPower.toFixed(2)}%`, floatColor);
        }
    });

    // --- Upgrades Logic ---
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
            // Handle Buff Timers
            if (clickBoostTimer > 0) clickBoostTimer--;
            if (productionBoostTimer > 0) productionBoostTimer--;
            if (productionDebuffTimer > 0) productionDebuffTimer--;
            updateBoostsUI();

            // 1. Calculate Generation
            let generation = (0.01 * autoLoaders);
            
            // Apply Buffs/Debuffs
            if (productionBoostTimer > 0) generation *= 2; 
            if (productionDebuffTimer > 0) generation *= 0.5;
            if (bloatwareActive) generation *= 0.5; 
            if (adwareActiveCount > 0) generation *= 0.1;
            
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
        adwareActiveCount++; 

        const closeBtn = adware.querySelector('.adware-close');
        closeBtn.addEventListener('click', () => {
            adware.remove();
            adwareActiveCount--; 
        });
    }

    // --- Dynamic Gamble Wheel Function ---
    function spawnGamblePopup() {
        const popup = document.createElement('div');
        popup.classList.add('gamble-popup');
        
        const pos = getRandomPosition(320, 300);
        popup.style.left = `${pos.x}px`;
        popup.style.top = `${pos.y}px`;

        popup.innerHTML = `
            <div class="gamble-header">
                <span>System Gamble</span>
                <span class="gamble-close">X</span>
            </div>
            <div class="gamble-body">
                <span style="text-align:center; color:#ccc; font-size:0.9rem;">Spin for a massive boost...<br>or system corruption!</span>
                <div class="wheel-container">
                    <div class="wheel-pointer"></div>
                    <div class="gamble-wheel-visual" id="the-wheel"></div>
                </div>
                <button class="spin-btn">SPIN!</button>
            </div>
        `;

        threatOverlay.appendChild(popup);

        const closeBtn = popup.querySelector('.gamble-close');
        const spinBtn = popup.querySelector('.spin-btn');
        const wheel = popup.querySelector('#the-wheel');

        // Safe Close
        closeBtn.addEventListener('click', () => {
            popup.remove();
        });

        // Spin Logic
        spinBtn.addEventListener('click', () => {
            spinBtn.disabled = true;
            spinBtn.innerText = "SPINNING...";
            closeBtn.style.display = "none"; // Stop user from closing while spinning

            // 50/50 Chance
            const isGood = Math.random() < 0.5;
            
            // Calculate rotation: 
            // The wheel has Red on the Right (0 to 180deg) and Green on the Left (180 to 360deg).
            // To land on GREEN (Good): The pointer is at top (0deg). We need the wheel to stop with the Green half at the top.
            // This means we need an angle between 190deg and 350deg.
            // To land on RED (Bad): We need an angle between 10deg and 170deg.
            
            let landingAngle = isGood 
                ? Math.floor(Math.random() * 160) + 190 
                : Math.floor(Math.random() * 160) + 10;
            
            // Add 5 full rotations for drama
            let totalRotation = (360 * 5) + landingAngle; 
            
            wheel.style.transform = `rotate(${totalRotation}deg)`;

            // Wait 3 seconds for CSS transition to finish
            setTimeout(() => {
                if (isGood) {
                    // Pick 1 of 3 Good outcomes
                    const roll = Math.random();
                    if (roll < 0.33) {
                        spawnFloatingAlert("WON: 2x CLICKS!");
                        clickBoostTimer += 15;
                    } else if (roll < 0.66) {
                        spawnFloatingAlert("WON: 2x PRODUCTION!");
                        productionBoostTimer += 15;
                    } else {
                        spawnFloatingAlert("WON: INSTANT GAIN!");
                        // Gain based on upgrades
                        let instantBump = ((autoLoaders + multipliers) * 0.5) + 2.0; 
                        currentProgress += instantBump;
                    }
                } else {
                    // Pick 1 of 3 Bad outcomes
                    const roll = Math.random();
                    if (roll < 0.33) {
                        spawnFloatingAlert("LOST: MALWARE SWARM!");
                        spawnMalware();
                        spawnMalware();
                        spawnMalware();
                        spawnBloatware();
                    } else if (roll < 0.66) {
                        spawnFloatingAlert("LOST: DATA CORRUPTION!");
                        currentProgress -= 5.00;
                    } else {
                        spawnFloatingAlert("LOST: SYSTEM SLUGGISH!");
                        productionDebuffTimer += 15;
                    }
                }
                
                updateBoostsUI();
                updateDisplay();
                
                // Remove popup shortly after result
                setTimeout(() => {
                    popup.remove();
                }, 1500);

            }, 3000); // 3 seconds matches the CSS transition time
        });
    }

    // --- Dynamic Threat Director ---
    let threatSpawnTimer = 0;
    setInterval(() => {
        let currentSpawnRate = (currentProgress >= 30.00) ? 4 : 10;
        threatSpawnTimer++;
        if (threatSpawnTimer >= currentSpawnRate) {
            threatSpawnTimer = 0; 
            const rand = Math.random();
            if (rand < 0.33) spawnMalware();
            else if (rand < 0.66) spawnBloatware();
            else spawnAdware();
        }
    }, 1000); 

    // --- Carousel Scrolling Logic ---
    leftScrollBtn.addEventListener('click', () => { upgradesList.scrollBy({ left: -200, behavior: 'smooth' }); });
    rightScrollBtn.addEventListener('click', () => { upgradesList.scrollBy({ left: 200, behavior: 'smooth' }); });

    // --- Visual Feedback Functions ---
    function spawnFloatingText(x, y, text, color = '#32CD32') {
        const floatText = document.createElement('div');
        floatText.innerText = text; 
        floatText.classList.add('floating-text'); 
        floatText.style.color = color;
        floatText.style.left = (x - 20) + 'px'; 
        floatText.style.top = (y - 20) + 'px';
        document.body.appendChild(floatText);
        setTimeout(() => floatText.remove(), 1000);
    }

    function spawnFloatingAlert(text) {
        const alertText = document.createElement('div');
        alertText.innerText = text;
        alertText.classList.add('floating-alert');
        alertText.style.left = '50%';
        alertText.style.top = '20%';
        alertText.style.transform = 'translateX(-50%)';
        document.body.appendChild(alertText);
        setTimeout(() => alertText.remove(), 3000); 
    }

    // --- Initialization ---
    updateBoostsUI();
    updateDisplay();
});