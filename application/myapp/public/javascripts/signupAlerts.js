document.addEventListener('DOMContentLoaded', function() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const dob = document.getElementById('dob');
    const name = document.getElementById('name');
    const username = document.getElementById('username');
    const submitBtn = document.getElementById('submitBtn');

    const toggleIndicator = (input, isValid) => {
      const toggle = document.getElementById(input.id + 'Toggle');
      toggle.classList.toggle('valid', isValid);
    }

    email.addEventListener('input', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      toggleIndicator(email, emailRegex.test(email.value));
    });

    password.addEventListener('input', () => {
      toggleIndicator(password, password.value.length >= 6);
    });

    confirmPassword.addEventListener('input', () => {
      toggleIndicator(confirmPassword, confirmPassword.value === password.value);
    });

    dob.addEventListener('input', () => {
      const birthDate = new Date(dob.value);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      const monthDiff = new Date().getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && new Date().getDate() < birthDate.getDate())) {
        age--;
      }
      toggleIndicator(dob, age >= 13);
    });

    name.addEventListener('input', () => {
      toggleIndicator(name, name.value.trim().length > 0);
    });

    username.addEventListener('input', () => {
      toggleIndicator(username, username.value.trim().length > 0);
    });

    submitBtn.addEventListener('click', (event) => {
      if (![...document.querySelectorAll('.toggle-indicator')].every(indicator => indicator.classList.contains('valid'))) {
        event.preventDefault(); // Prevent submission if any field is invalid
        alert('Please correct the highlighted fields before submitting.');
      }
    })
});