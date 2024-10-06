let currentPage = 1;
const itemsPerPage = 4;

function fetchFeedback(page) {
    fetch(`https://blood-bank-backend-c7w8.onrender.com/blood_bank_releted/all_feedback/?page=${page}`)
        .then(response => response.json())
        .then(data => {
            displayFeedback(data.results);
            setupPagination(data.count);
        })
        .catch(error => console.error('Error fetching feedback:', error));
}

function displayFeedback(feedbacks) {
    const feedbackSection = document.getElementById('feedback-section');
    feedbackSection.innerHTML = ''; // Clear previous feedback

    feedbacks.forEach(feedback => {
        const feedbackCard = `
            <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
                <div class="feedback-card p-3 h-100"> <!-- Padding added here -->
                    <h5>${feedback.donor}</h5>
                    <p>${feedback.feedback}</p>
                    <p>Rating: ${feedback.rating}</p>
                    <p><small>${new Date(feedback.created_at).toLocaleString()}</small></p>
                </div>
            </div>
        `;
        feedbackSection.innerHTML += feedbackCard;
    });
}

function setupPagination(totalCount) {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear previous pagination

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.innerHTML = 'Previous';
    prevButton.className = 'btn btn-white text-white border-white fw-bold rounded-0';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            fetchFeedback(currentPage);
        }
    };
    paginationContainer.appendChild(prevButton);

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerHTML = i;
        pageButton.className = 'btn btn-white bg-white px-3 py-2 ms-2 me-2 rounded-0';
        pageButton.onclick = () => {
            currentPage = i;
            fetchFeedback(currentPage);
        };
        paginationContainer.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.innerHTML = 'Next';
    nextButton.className = 'btn btn-white text-white border-white fw-bold px-4 rounded-0';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchFeedback(currentPage);
        }
    };
    paginationContainer.appendChild(nextButton);
}

// Initial fetch
fetchFeedback(currentPage);
