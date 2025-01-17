document.addEventListener('DOMContentLoaded', function() {
    // Set the dates for the election and inauguration
    const electionDate = new Date('2024-11-05T00:00:00'); // Example: Nov 5, 2024
    const inaugurationDate = new Date('2025-01-20T12:00:00'); // Example: Jan 20, 2025

    const countdownElement = document.getElementById('countdown');
    const inaugurationElement = document.getElementById('inauguration-countdown');

    // Function to calculate the remaining time
    function updateCountdown(targetDate, element) {
        const now = new Date().getTime();
        const timeLeft = targetDate - now;

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        element.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            return true; // Timer has ended
        }

        return false; // Timer is still running
    }

    // Update the countdown every second
    let timer = setInterval(() => {
        // First, update the election countdown
        const electionEnded = updateCountdown(electionDate, countdownElement);

        // If the election countdown is done, switch to the inauguration countdown
        if (electionEnded) {
            clearInterval(timer); // Stop the first countdown
            countdownElement.style.display = 'none'; // Hide election countdown
            inaugurationElement.style.display = 'block'; // Show inauguration countdown

            // Start a new timer for the inauguration
            timer = setInterval(() => {
                updateCountdown(inaugurationDate, inaugurationElement);
            }, 1000);
        }
    }, 1000);
});