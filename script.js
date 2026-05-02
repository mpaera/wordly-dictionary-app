
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsDiv = document.getElementById('results');

    // API Endpoint (Replace with a reliable public dictionary API)
    const apiEndpoint = "https://api.dictionaryapi.dev/api/v2/entries/en/"; // Example API

    // Function to fetch and display word data
    async function searchWord(word) {
        if (!word.trim()) {
            displayError("Please enter a word.");
            return;
        }

        clearResults(); // Clear any previous results

        try {
            const response = await fetch(apiEndpoint + word);
            const data = await response.json();

            if (response.ok) { // Check for HTTP errors (e.g., 404 Not Found)
                displayResults(data);
            } else {
                if (response.status === 404) {
                    displayError(`Word not found: "${word}"`);
                } else {
                    displayError("An error occurred while fetching the data.");
                }
            }
        } catch (error) {
            console.error("Fetch error:", error); // Log the error for debugging
            displayError("An error occurred. Please try again later.");
        }
    }

    // Function to display results in the results div
    function displayResults(data) {
        if (!Array.isArray(data) || data.length === 0) { // Handle unexpected data structure
          displayError("No definitions found for this word.");
          return;
        }

        resultsDiv.innerHTML = ""; // Clear existing content

        data.forEach(wordData => {
            const { word, phonetic, meanings } = wordData;
            const wordDiv = document.createElement('div');
            wordDiv.className = 'definition-item';

            wordDiv.innerHTML = `
                <h2>${word} ${phonetic ? `(${phonetic})` : ''}</h2>
            `;


            meanings.forEach(meaning => {
                wordDiv.innerHTML += `
                    <p><em>${meaning.partOfSpeech}</em></p>
                    <ul>
                        ${meaning.definitions.map(def => `<li>${def.definition}</li>`).join('')}
                    </ul>
                    ${meaning.synonyms && meaning.synonyms.length > 0 ? `<p><strong>Synonyms:</strong> ${meaning.synonyms.join(', ')}</p>` : ''}
                `;
            });

            resultsDiv.appendChild(wordDiv);
        });
    }


    // Function to display error messages
    function displayError(message) {
        clearResults();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        resultsDiv.appendChild(errorDiv);
    }

    // Function to clear existing results
    function clearResults() {
        resultsDiv.innerHTML = "";
    }


    // Event listener for the form submission (search)
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent page refresh
        const word = searchInput.value.trim(); // Get the word and trim whitespace
        searchWord(word);
    });