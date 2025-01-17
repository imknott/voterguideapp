document.addEventListener('DOMContentLoaded', function() {
    const logoutLink = document.getElementById('triggerLogout');
    const logoutForm = document.getElementById('logoutForm');

    // When the user clicks the "Logout" link in the dropdown
    logoutLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        logoutForm.submit();    // Programmatically submit the hidden logout form
    });

    // Custom dropdown toggle functionality (if you haven't implemented it yet)
    const dropdownButton = document.getElementById('dropdownButton');
    const customDropdownMenu = document.getElementById('customDropdownMenu');

    dropdownButton.addEventListener('click', function() {
        customDropdownMenu.style.display = customDropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Hide dropdown when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!dropdownButton.contains(event.target) && !customDropdownMenu.contains(event.target)) {
            customDropdownMenu.style.display = 'none';
        }
    });
});