document.addEventListener('DOMContentLoaded', function() {
    const candidatename = document.getElementById('candidatename');
    const eventname = document.getElementById('eventname');
    const location = document.getElementById('location');
    const date = document.getElementById('date');

    const submitBtn = document.getElementById('submitBtn');

    const toggleIndicator = (input, isValid) => {
      const toggle = document.getElementById(input.id + 'Toggle');
      toggle.classList.toggle('valid', isValid);
    }

    candidatename.addEventListener('input', () => {
        toggleIndicator(candidatename, candidatename.value.trim().length > 0);
    });

    eventname.addEventListener('input', () => {
        toggleIndicator(eventname, eventname.value.trim().length > 0);
    });

    location.addEventListener('input', () => {
        toggleIndicator(location, location.value.trim().length > 0);
    });

    date.addEventListener('input', () => {
        toggleIndicator(date, true);
    });

    submitBtn.addEventListener('click', (event) => {
      if (![...document.querySelectorAll('.toggle-indicator')].every(indicator => indicator.classList.contains('valid'))) {
        event.preventDefault();
        alert('Please correct the highlighted fields before submitting.');
      }
    })
});