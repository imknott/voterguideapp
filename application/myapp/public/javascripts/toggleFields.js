document.addEventListener('DOMContentLoaded', () => {
    const authSwitch = document.getElementById('authSwitch');
    const signupFields = document.getElementById('signupFields');
    const submitBtn = document.getElementById('submitBtn');
    const authForm = document.getElementById('authForm');

    // Function to handle form action and visibility based on switch state
    const handleSwitchChange = () => {
        if (authSwitch.checked) {
            authForm.setAttribute('action', '/auth/signup'); // Set action to signup
            signupFields.style.display = 'block'; // Show signup fields
            submitBtn.innerText = 'Sign Up'; // Change button text
        } else {
            authForm.setAttribute('action', '/auth/login'); // Set action to login
            signupFields.style.display = 'none'; // Hide signup fields
            submitBtn.innerText = 'Login'; // Change button text
        }
    };

    // Initialize form based on the switch state on load
    handleSwitchChange();

    // Add event listener for switch
    authSwitch.addEventListener('change', handleSwitchChange);
});
