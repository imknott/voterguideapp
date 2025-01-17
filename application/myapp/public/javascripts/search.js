document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn-category');
  const searchCategoryInput = document.getElementById('searchCategory');

  let values = [];

  buttons.forEach(button => {
      button.addEventListener('click', function() {
        if (values.includes(button.getAttribute('data-value'))) {
          values = values.filter(value => value !== button.getAttribute('data-value'));
        } else {
          values.push(button.getAttribute('data-value'));
        }
        console.log(values);
        
        if (values.includes(button.getAttribute('data-value'))) {
          button.classList.remove('btn-light');
          button.classList.add('btn-success');
        } else {
          button.classList.remove('btn-success');
          button.classList.add('btn-light');
        }
        console.log(values.toString());
        searchCategoryInput.value = values.toString();
      })
  })
});

//This function contains code to ensure the user is only able to enter a search term that 
//is a an alphnumeric phrase no greater than 40 characters.
//This is done by using a regular expression to check the input against a pattern.
//It also renders a alert to the user and disables submit until the conditions are met. 

function validateSearchTerm() {
    const searchTermInput = document.getElementById('searchTerm');
    const submitButton = document.getElementById('submitButton');
    const charCountError = document.getElementById('charCountError');

    // Regular expression to allow only alphanumeric characters and spaces
    const alphanumericRegex = /^[a-zA-Z0-9 ]*$/;
    const searchTerm = searchTermInput.value;

    // Check if input is empty, exceeds 40 characters, or contains invalid characters
    if (searchTerm.length === 0 || searchTerm.length > 40 || !alphanumericRegex.test(searchTerm)) {
      charCountError.style.display = (searchTerm.length > 40 || !alphanumericRegex.test(searchTerm)) ? 'block' : 'none';
      submitButton.disabled = true;
    } else {
      charCountError.style.display = 'none';
      submitButton.disabled = false;
    }
  }