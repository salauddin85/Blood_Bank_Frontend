
const aboutsubscribeForm = (event) => {
    event.preventDefault();
  
    const token = localStorage.getItem("authToken"); // Get token from localStorage
    const SubscribeForm = document.getElementById("aboutsubscribeForm");
    const form = new FormData(SubscribeForm);
  
    // Check if the user is logged in
    if (!token) {
      alert("You must be logged in to subscribe.");
      return;
    }
  
    // Form data
    const formData = {
      email: form.get("email"), // FormData from the form
    };
    console.log(formData)
    // Fetch request
    fetch("https://blood-bank-deploy-vercel.vercel.app/blood_bank_releted/subscriptions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`, // Correctly formatted token
      },
      body: JSON.stringify(formData), // Convert formData to JSON
    })
      .then((res) => {
        if (!res.ok) {
          // If response is not ok, get the error message
          return res.json().then((data) => {
            let errorMessage = "Something went wrong.";
            
            // Show error details from backend
            if (data.detail) {
              errorMessage = data.detail;  // Show detailed error message
            } else if (data.email) {
              errorMessage = data.email.join(" "); // Handle email specific errors
            }
            
            alert(errorMessage); // Show alert with error
            throw new Error(errorMessage); // Throw error for catch block
          });
        }
        return res.json(); // If successful, return response as JSON
      })
      .then((data) => {
        console.log("Subscription success", data);
        alert("Thank you for subscribing!"); // Show success message
      })
      .catch((err) => {
        console.error("Error:", err); // Catch and log the error
      });
  };
  


  
  // feedback section 
  const apiURL = "https://blood-bank-deploy-vercel.vercel.app/blood_bank_releted/all_feedback/";
  let feedbackData = [];
  
  async function fetchFeedback() {
      try {
          const response = await fetch(apiURL);
          const data = await response.json();
          feedbackData = data.results; // Storing feedback results
          displayFeedback();
      } catch (error) {
          console.error("Error fetching feedback:", error);
      }
  }
  
  function displayFeedback() {
      const feedbackSection = document.getElementById('feedbackSection');
      const carouselIndicators = document.getElementById('carouselIndicators');
      feedbackSection.innerHTML = ''; // Clear existing feedback
      carouselIndicators.innerHTML = ''; // Clear existing indicators
  
      feedbackData.forEach((feedback, index) => {
          const createdAt = new Date(feedback.created_at);
          const formattedDate = createdAt.toLocaleDateString();
          const formattedTime = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
          // Add carousel indicator
          const indicatorItem = `
              <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-current="${index === 0 ? 'true' : 'false'}" aria-label="Slide ${index + 1}"></button>
          `;
          carouselIndicators.innerHTML += indicatorItem;
  
          // Add carousel item
          const feedbackItem = `
              <div class="carousel-item ${index === 0 ? 'active' : ''}">
                  <div class="custom-feedback-card">
                      <h5 class="pt-2">${feedback.donor}</h5>
                      <h5 class="pt-2">${feedback.feedback}</h5>
                      <h5 class="pt-2">Rating : ${feedback.rating}</h5>
                      <h5 class="pt-2">
                          Created on: ${formattedDate} at ${formattedTime}
                      </h5>
                  </div>
              </div>
          `;
          feedbackSection.innerHTML += feedbackItem;
      });
  }
  
  // Initial fetch
  fetchFeedback();
  