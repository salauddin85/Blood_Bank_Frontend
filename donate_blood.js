function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}
// ---------------------------------------------------------------

// Blood Notification Modal শো করার জন্য
document
  .getElementById("notificationBloodBtn")
  .addEventListener("click", function () {
    var bloodModal = new bootstrap.Modal(
      document.getElementById("bloodNotificationModal")
    );
    bloodModal.show();
  });

// Create Events Modal শো করার জন্য
document
  .getElementById("eventCreateModalBtn")
  .addEventListener("click", function () {
    var eventModal = new bootstrap.Modal(
      document.getElementById("eventCreateModal")
    );
    eventModal.show();
  });

  // Open Feedback Modal
document
.getElementById("feedbackCreateModalbtn")
.addEventListener("click", function () {
  var feedbackModal = new bootstrap.Modal(
    document.getElementById("feedbackModal")
  );
  feedbackModal.show();
});

// ----------------------------------------------------------

const notificationForm = (event) => {
  event.preventDefault();
  // Retrieve the authentication token from localStorage
  const token = localStorage.getItem("authToken");

  // Log the token value for debugging purposes
  console.log("Token:", token);
  const form = document.getElementById("notificationForm");
  formData = new FormData(form);
  const NoticicationData = {
    blood_group: formData.get("bloodGroup"), // Change this
    location: formData.get("location").toUpperCase(),
    message: formData.get("message"),
  };

  console.log(NoticicationData);

  // Check if the token is present
  if (!token) {
    alert("You are not an authenticated user.Please Login");

    return;
  }

  // Send a POST request with blood group and location
  fetch("https://blood-bank-deploy-vercel.vercel.app/events/notifications/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`, // Ensure the token is correctly formatted
    },
    body: JSON.stringify(NoticicationData),
  })
    .then((res) => {
      if (res.status === 201) {
        return res.json().then((data) => {
          alert("Notification sent successfully!");
        });
      } else if (res.status === 400) {
        return res.json().then((data) => {
          alert(
            "Error: " + (data.error || "Bad request. Please check your input.")
          );
        });
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again.");
    });

  var modal = bootstrap.Modal.getInstance(
    document.getElementById("bloodNotificationModal")
  );
  modal.hide();

  return false;
};

const notificationShow = () => {
  const notificationSection = document.getElementById("notification");

  // Retrieve the authentication token from localStorage
  const token = localStorage.getItem("authToken");

  // // Check if the token is present
  // if (!token) {
  //     alert("You are not authenticated. Please log in.");
  //     return;
  // }

  // Fetch the notifications
  fetch("https://blood-bank-deploy-vercel.vercel.app/events/notifications/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Token ${token}`, // Ensure the token is correctly formatted
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log("All notifications:", data);

      // Clear previous notifications
      notificationSection.innerHTML = "";

      // Check if there are any notifications to display
      if (data.results.length === 0) {
        notificationSection.innerHTML = `<h3 class="text-center">No notifications available.</h3>`;
        return;
      }

      // Loop through the first 3 notifications and display them
      data.results.slice(0, 6).forEach((notification) => {
        const notificationDiv = document.createElement("div");
        notificationDiv.className = "notification-item "; // Add a class for styling

        notificationDiv.innerHTML = `
                    <p><strong>From:</strong> ${notification.sender}</p>
                    <p><strong>Message:</strong> ${notification.message}</p>
                    <p><strong>Location:</strong> ${notification.location}</p>
                    <p><strong>Blood Group:</strong> ${
                      notification.blood_group
                    }</p>
                    <p><strong>Created At:</strong> ${new Date(
                      notification.created_at
                    ).toLocaleString()}</p>
                `;

        // Append the notification to the section
        notificationSection.appendChild(notificationDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching notifications:", error);
    });
};

// Call the function to fetch and display notifications
notificationShow();

// ------------------------------------------------------------------------------

const EventForm = (event) => {
  event.preventDefault();
  // Retrieve the authentication token from localStorage
  const token = localStorage.getItem("authToken");

  // Log the token value for debugging purposes
  console.log("Token:", token);
  const form = document.getElementById("createEventForm");
  formData = new FormData(form);
  const EventData = {
    event_name: formData.get("eventName").toUpperCase(), // Change this
    recipient: formData.get("eventRecipient"),
    blood_group: formData.get("bloodGroup"),
    date: formData.get("eventDate"),
  };

  console.log(EventData);

  // Check if the token is present
  if (!token) {
    alert("You are not an authenticated user.Please Login");

    return;
  }

  // Send a POST request with blood group and location
  fetch("https://blood-bank-deploy-vercel.vercel.app/events/donation-events/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`, // Ensure the token is correctly formatted
    },
    body: JSON.stringify(EventData),
  })
    .then((res) => {
      if (res.status === 201) {
        return res.json().then((data) => {
          alert("Donation Event Create successfully!");
        });
      } else if (res.status === 400) {
        return res.json().then((data) => {
          alert(
            "Error: " + (data.error || "Bad request. Please check your input.")
          );
        });
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again.");
    });

  var modal = bootstrap.Modal.getInstance(
    document.getElementById("eventCreateModal")
  );
  modal.hide();

  return false;
};

// Event Show
document.addEventListener("DOMContentLoaded", function () {
  const eventSection = document.getElementById("events-list");

  // Retrieve the authentication token from localStorage
  const token = localStorage.getItem("authToken");

  // Check if the token is present

  // Fetch data from your API
  fetch("https://blood-bank-deploy-vercel.vercel.app/events/dashboard/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Token ${token}`, // Ensure the token is correctly formatted
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Fetched event data:", data);

      // Clear the existing events if any
      eventSection.innerHTML = "";

      // Limit to the first 12 events
      const limitedEvents = data.results.slice(0, 12); // Access 'results' array

      // Loop through the limited events and inject them into the HTML
      limitedEvents.forEach((event) => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("col-lg-3", "col-md-6", "col-sm-12", "mb-4"); // For responsive layout

        eventCard.innerHTML = `
                <div class="event-card p-4 border rounded shadow-sm">
                    <h6 class="fw-bold"><strong> Event: </strong> ${event.event_name.toUpperCase()}</h6>
                    <div class="event-details mt-2">
                        <p><strong>Recipient:</strong> ${event.recipient}</p>
                        <p><strong>Blood Group:</strong> ${
                          event.blood_group
                        }</p>
                        <p><strong>Date:</strong> ${
                          event.date
                            ? new Date(event.date).toLocaleDateString()
                            : "Not Provided"
                        }</p>
                        <p><strong>Status:</strong> ${event.status}</p>
                        <p><strong>Created by:</strong> ${event.created_by}</p>
                        <button type="submit" class="btn btn-danger rounded-0" id=${event.id} onclick="AcceptDonation(${event.id})">Accept</button>

                    </div>
                </div>
            `;

        // Append the event card to the section
        eventSection.appendChild(eventCard);
      });
    })
    .catch((error) => {
      console.error("Error fetching event data:", error);
    //   alert("Failed to load events. Please try again later.");
    });
});

// --------------------------------------------------------------------
//   Accept Donation
// ---------------------------------------------------------------------

function AcceptDonation(eventId) {
  console.log("Accepted Donation for Event ID:", eventId);
  // console.log("Token:", localStorage.getItem("authToken"));
  const token = localStorage.getItem("authToken");

  const encodedEventId = encodeURIComponent(eventId);
  console.log("Encoded Event ID:", encodedEventId);
  if (!token) {
    alert("You are not an authenticated user.Please Login");

    return;
  }
  fetch(`https://blood-bank-deploy-vercel.vercel.app/events/acceptdonation/${encodedEventId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      eventId: encodedEventId, // যদি backend এ এই data দরকার হয়
    }),
  })
    .then((response) => {
      // If response is not OK, handle the error here itself
      if (!response.ok) {
        return response.json().then((err) => {
          // Show the error message in an alert
          alert(err.error || "An error occurred");
          throw new Error(`HTTP error! Status: ${response.status}`);
        });
      }
      return response.json(); // Parse JSON data for successful requests
    })
    .then((data) => {
      console.log("Donation accepted:", data);
      alert("Donation Successful");
      // এখানে UI আপডেট করতে পারেন
    })
    .catch((error) => {
      console.error("Error accepting donation:", error);
      // Fallback in case error is not a valid JSON or can't be parsed
    });
}

// ---------------------------------------------------
// Donation History
// Global variable to hold the fetched donation history data
let donationData = [];

// Function to fetch donation history from the API
function fetchDonationHistory() {
    fetch("https://blood-bank-deploy-vercel.vercel.app/events/dashboard/donation_history/", {
        method: "GET"
        // headers: {
        //     "Content-Type": "application/json",
        //     // Authorization: `Token ${localStorage.getItem("authToken")}`, // Include your auth token here
        // },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse response to JSON
    })
    .then((data) => {
        console.log("Donation history data:", data);
        donationData = data.donation_history; // Access the donation_history array
        displayDonationHistory(); // Call function to display donation history
    })
    .catch((error) => {
        console.error('Error fetching donation history:', error);
        alert('Failed to load donation history. Please try again later.');
    });
}

// Function to display the donation history in the HTML
function displayDonationHistory() {
    const container = document.getElementById("donation-history-container");
    container.innerHTML = ""; // Clear existing content

    // Slice to get only the first 6 donation history records
    const limitedDonations = donationData.slice(0, 6);

    // Loop through the limited donation data and create cards for each item
    limitedDonations.forEach((item) => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card history-card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Event: ${item.event.event_name}</h5>
                        <p class="card-text">
                            <strong>Recipient:</strong> ${item.event.recipient}<br>
                            <strong>Blood Group:</strong> ${item.event.blood_group}<br>
                            <strong>Date:</strong> ${item.event.date}<br>
                            <strong>Status:</strong> ${item.event.status}<br>
                            <strong>Created By:</strong> ${item.event.created_by || "N/A"}<br>
                            <strong>Active:</strong> ${item.event.is_active ? "Yes" : "No"}
                        </p>
                        <hr>
                        <p class="card-text">
                            <strong>User:</strong> ${item.user}<br>
                            <strong>Accepted On:</strong> ${item.accepted_on}<br>
                            <strong>Donation Count:</strong> ${item.blood_donation_count}<br>
                            <strong>Canceled:</strong> ${item.is_canceled ? "Yes" : "No"}
                        </p>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", card); // Append the card to the container
    });
}

{/* <button class="btn btn-primary" onclick="downloadPDF(${item.id})">Download Donation History PDF</button> */}
// Function to handle PDF download
function downloadPDF(donationId) {
    // Find the specific donation record by ID
    const donation = donationData.find(item => item.id === donationId);
    if (!donation) {
        alert("Donation record not found!");
        return;
    }

    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Define the PDF content
    const title = "Donation History";
    const content = `
        Event Name: ${donation.event.event_name}
        Recipient: ${donation.event.recipient}
        Blood Group: ${donation.event.blood_group}
        Date: ${donation.event.date}
        Status: ${donation.event.status}
        Created By: ${donation.event.created_by || "N/A"}
        User: ${donation.user}
        Accepted On: ${donation.accepted_on}
        Donation Count: ${donation.blood_donation_count}
        Canceled: ${donation.is_canceled ? "Yes" : "No"}
    `;

    // Add title and content to PDF
    doc.setFontSize(22);
    doc.text(title, 10, 10);
    doc.setFontSize(12);
    doc.text(content, 10, 30);

    // Save the PDF
    doc.save(`donation_history_${donationId}.pdf`);
}

// Call the function to fetch the donation history when the page loads
window.onload = fetchDonationHistory;


// --------------------------------------------------------------------------------

// Total 8 Blood Request




// Event Show
// Event Show
document.addEventListener("DOMContentLoaded", function () {
  const eventSection = document.getElementById("events-list-request");

  // Retrieve the authentication token from localStorage
  const token = localStorage.getItem("authToken");

  // Fetch data from your API
  fetch("https://blood-bank-deploy-vercel.vercel.app/events/dashboard/recipient_requests/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`, // Ensure the token is correctly formatted
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Fetched blood request data:", data);

      // Clear the existing events if any
      eventSection.innerHTML = "";

      // Access the 'recipient_requests' array (based on your sample response)
      const limitedEvents = data.recipient_requests.slice(0, 12);

      // Loop through the limited events and inject them into the HTML
      limitedEvents.forEach((event) => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("col-lg-3", "col-md-6", "col-sm-12", "mb-4"); // For responsive layout

        eventCard.innerHTML = `
          <div class="event-card    h-100 border rounded-2 shadow-sm">
            <h6 class="fw-bold"><strong>Event:</strong> ${event.event_name.toUpperCase()}</h6>
            <div class="event-details mt-2">
              <p><strong>Recipient:</strong> ${event.recipient}</p>
              <p><strong>Blood Group:</strong> ${event.blood_group}</p>
              <p><strong>Date:</strong> ${
                event.date
                  ? new Date(event.date).toLocaleDateString()
                  : "Not Provided"
              }</p>
              <p><strong>Status:</strong> ${event.status}</p>
              <p><strong>Created by:</strong> ${event.created_by}</p>
              <button type="submit" class="btn btn-danger rounded-0" id=${event.id} onclick="AcceptDonation(${event.id})">Accept</button>
            </div>
          </div>
        `;

        // Append the event card to the section
        eventSection.appendChild(eventCard);
      });
    })
    .catch((error) => {
      console.error("Error fetching event data:", error);
    });
});


// -----------------------------------------------------------

// Fedback
// --------------------------------------------------------
// Open Feedback Modal
async function handleFeedbackSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get values from the form
  const rating = document.getElementById("rating").value;
  const feedbackText = document.getElementById("feedbackText").value;

  // Get the auth token from local storage
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You are not an authenticated user.Please Login");

    return;
  }
  // Prepare the data to be sent
  const data = {
      feedback: feedbackText,
      rating: rating
      
  };
  console.log(data)
  try {
      const response = await fetch("https://blood-bank-deploy-vercel.vercel.app/blood_bank_releted/feedback/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
          },
          body: JSON.stringify(data),
      });

      // Check the response status
      console.log(response)
      if (response.ok) {
          const result = await response.json();
          console.log(result)
          alert(result.detail || "Feedback submitted successfully!");

          // Close the modal
          var feedbackModal = bootstrap.Modal.getInstance(document.getElementById("feedbackModal"));
          feedbackModal.hide();

          // Reset the form
          document.getElementById("feedbackForm").reset();
      } else {
          // Handle error responses from the backend
          const errorData = await response.json();
          console.log(errorData)
          if (errorData) {
              alert(errorData); // Display the detailed error message
          } else {
              alert("Error submitting feedback. Please try again.");
          }
      }
  } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting your feedback. Please try again.");
  }
}


// Clear page content when modal is closed
document
  .getElementById("feedbackModal")
  .addEventListener("hidden.bs.modal", function () {
    // Reset the form fields
    document.getElementById("feedbackForm").reset();
    
    // Ensure page visibility
    document.body.style.overflow = 'auto'; // Ensure body can scroll again
    
    // Optionally remove any styles that might be affecting visibility
    // You can add other logic here if there are specific styles you want to reset
  });