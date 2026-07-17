document.addEventListener('DOMContentLoaded', () => {
    
    let currentProgress = 0.00;
    
    const clickButton = document.getElementById('click-button');
    const percentageText = document.getElementById('percentage-text');
    const progressBarFill = document.getElementById('progress-fill-bar');

    clickButton.addEventListener('click', (event) => {
        
        if (currentProgress < 100) {
            currentProgress += 1.00; // Increased to 1% for testing
            
            if (currentProgress > 100) {
                currentProgress = 100.00;
            }

            percentageText.innerText = currentProgress.toFixed(2) + '%';
            progressBarFill.style.width = currentProgress + '%';
            
            // Trigger the visual feedback at the mouse's X and Y coordinates
            spawnFloatingText(event.clientX, event.clientY);
        }
    });

    // --- Function to create floating text ---
    function spawnFloatingText(x, y) {
        // 1. Create a brand new div in the memory
        const floatText = document.createElement('div');
        floatText.innerText = '+1.00%'; // Updated visual feedback
        floatText.classList.add('floating-text'); // Attach the CSS animation
        
        // 2. Position it exactly where the mouse clicked
        floatText.style.left = (x - 20) + 'px'; 
        floatText.style.top = (y - 20) + 'px';
        
        // 3. Inject it into the HTML body
        document.body.appendChild(floatText);
        
        // 4. Set a timer to destroy the element after 1000ms (1 second) 
        setTimeout(() => {
            floatText.remove();
        }, 1000);
    }
});