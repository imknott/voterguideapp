document.addEventListener('DOMContentLoaded', function() {
    const name = document.getElementById('name');
    const photo = document.getElementById('photo');
    const policies = document.getElementById('policies');
    const background = document.getElementById('background');
    const location = document.getElementById('location');
    const website = document.getElementById('website');
    const phone = document.getElementById('phone');
    const party = document.getElementById('party');
    const street = document.getElementById('street');
    const city = document.getElementById('city');
    const state = document.getElementById('state');
    const zip = document.getElementById('zip');

    const submitBtn = document.getElementById('submitBtn');

    const toggleIndicator = (input, isValid) => {
      const toggle = document.getElementById(input.id + 'Toggle');
      toggle.classList.toggle('valid', isValid);
    }

    name.addEventListener('input', () => {
        toggleIndicator(name, name.value.trim().length > 0);
    });
    photo.addEventListener('input', () => {
        toggleIndicator(name, photo.value.trim().length > 0);
    });
    policies.addEventListener('input', () => {
        toggleIndicator(policies, policies.value.trim().length > 0);
    });
    background.addEventListener('input', () => {
        toggleIndicator(background, background.value.trim().length > 0);
    });
    location.addEventListener('input', () => {
        toggleIndicator(location, location.value.trim().length > 0);
    });
    website.addEventListener('input', () => {
        toggleIndicator(website, website.value.trim().length > 0);
    });
    phone.addEventListener('input', () => {
        toggleIndicator(phone, phone.value.trim().length > 0);
    });
    party.addEventListener('input', () => {
        toggleIndicator(party, party.value.trim().length > 0);
    });

    street.addEventListener('input', () => {
        toggleIndicator(street, street.value.trim().length > 0);
    });
    city.addEventListener('input', () => {
        toggleIndicator(city, city.value.trim().length > 0);
    });
    state.addEventListener('input', () => {
        toggleIndicator(state, state.value.trim().length > 0);
    });
    zip.addEventListener('input', () => {
        toggleIndicator(zip, zip.value.trim().length > 0);
    });

    submitBtn.addEventListener('click', (event) => {
      if (![...document.querySelectorAll('.toggle-indicator')].every(indicator => indicator.classList.contains('valid'))) {
        event.preventDefault();
        alert('Please correct the highlighted fields before submitting.');
      }
    })
});