document.addEventListener('DOMContentLoaded', () => {
    
    // Set our starting number
    let currentProgress = 0.00;
    
    // Grab the specific HTML elements by their IDs
    const clickButton = document.getElementById('click-button');
    const percentageText = document.getElementById('percentage-text');
    const progressBarFill = document.getElementById('progress-fill-bar');

    // Listen for clicks on the button
    clickButton.addEventListener('click', () => {
        
        // Only increase if we are under 100%
        if (currentProgress < 100) {
            currentProgress += 0.01;
            
            // Hard cap at 100 just in case
            if (currentProgress > 100) {
                currentProgress = 100.00;
            }

            // Update the text on the screen (clamped to 2 decimal places)
            percentageText.innerText = currentProgress.toFixed(2) + '%';
            
            // Update the width of the green CSS bar
            progressBarFill.style.width = currentProgress + '%';
        }
    });
});