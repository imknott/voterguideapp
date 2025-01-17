let stars = document.querySelectorAll(".ratings span");
let selectedRating;

// Function to highlight stars based on user rating
function highlightStars(rating) {
    stars.forEach(star => {
        if (star.dataset.rating <= rating) {
            star.setAttribute("data-clicked", "true");
        } else {
            star.removeAttribute("data-clicked");
        }
    });
}

// Handle user star clicks for interactive rating
for (let star of stars) {
    star.addEventListener("click", function () {
        selectedRating = this.dataset.rating;

        // Update clicked stars
        stars.forEach(s => s.removeAttribute("data-clicked"));
        this.setAttribute("data-clicked", "true");

        let prevSibling = this.nextElementSibling;
        while (prevSibling) {
            prevSibling.setAttribute("data-clicked", "true");
            prevSibling = prevSibling.nextElementSibling;
        }

        // Highlight stars based on selected rating
        highlightStars(selectedRating);

        // Set the hidden input to the selected rating value
        document.getElementById("ratingValue").value = selectedRating;
    });
}