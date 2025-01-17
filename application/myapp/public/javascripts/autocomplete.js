document.getElementById('address').addEventListener('input', async function () {
    const query = this.value;

    if (query.length > 2) {
        const suggestions = await getAddressSuggestions(query);
        displaySuggestions(suggestions);
    }
});

async function getAddressSuggestions(query) {
    const apiKey = 'fA6q4GlxWmZq2MdVI6OLbP79wOKz4QRCQr5Q9rkXbyc';
    const url = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${encodeURIComponent(query)}&apiKey=${apiKey}&limit=5&in=countryCode:USA`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.items.map(item => item.address.label);
    } catch (error) {
        console.error('Error fetching address suggestions:', error);
        return [];
    }
}

function displaySuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('addressSuggestions');
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions

    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = suggestion;
        suggestionItem.onclick = () => selectSuggestion(suggestion);
        suggestionsContainer.appendChild(suggestionItem);
    });

    suggestionsContainer.style.display = suggestions.length ? 'block' : 'none';
}

function selectSuggestion(suggestion) {
    document.getElementById('address').value = suggestion;
    document.getElementById('addressSuggestions').style.display = 'none';
}