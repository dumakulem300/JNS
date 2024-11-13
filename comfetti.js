// Track whether the wheel is currently spinning
let wheelSpinning = false;

// Function to trigger confetti explosion
function triggerConfetti() {
    confetti({
        particleCount: 200,         // Number of confetti pieces
        spread: 70,                 // Angle of spread
        origin: { x: 0.5, y: 0.4 }, // Origin of confetti (center of the screen)
        colors: ['#ff0', '#0ff', '#f0f', '#0f0', '#f00'] // Confetti colors
    });
}

// Function to simulate the wheel spinning
function spinWheel() {
    if (wheelSpinning) return; // Prevent the wheel from spinning again while it's already spinning

    wheelSpinning = true; // Set the spinning state to true
    document.getElementById('spinBtn').disabled = true; // Disable the spin button while spinning

    const wheel = document.querySelector('.roulette-wheel');
    
    // Add a CSS class to simulate the spinning effect
    wheel.style.transition = "transform 3s ease-out"; // Make the wheel spin smoothly
    wheel.style.transform = `rotate(${Math.floor(Math.random() * 360) + 3600}deg)`; // Random rotation for the spin
    
    // After the spinning animation finishes (3 seconds), trigger the confetti
    setTimeout(function() {
        triggerConfetti(); // Trigger confetti after spin stops
        wheelSpinning = false; // Set the spinning state back to false
        document.getElementById('spinBtn').disabled = false; // Enable the spin button again
    }, 3000); // Match the set timeout with the spinning duration
}

// Add event listener for the spin button
const spinBtn = document.getElementById('spinBtn');
if (spinBtn) {
    spinBtn.addEventListener('click', spinWheel);
}
