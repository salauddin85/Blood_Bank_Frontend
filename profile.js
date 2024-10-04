let fullname = "";
let profileId = ""; 

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        window.location.href = "/login"; // Redirect if not authenticated
        return;
    }

    const profileUrl = 'http://127.0.0.1:8000/accounts/profile/';

    const fetchProfileData = () => {
        fetch(profileUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = "/login"; 
                }
                throw new Error('Failed to fetch profile data');
            }
            return response.json();
        })
        .then(profileData => {
            const profile = profileData[0]; 
            console.log(profile)
            profileId = profile.id; // Assign profile ID
            console.log(profileId, "id"); // Log the ID after it's assigned

            fullname = `${profile.first_name || 'Unknown'} ${profile.last_name || 'Unknown'}`.trim();
            console.log(fullname); // Log full name for debugging

            // Update the DOM with profile information
            document.getElementById('profileName').textContent = fullname;
            document.getElementById('userName').textContent = profile.username || 'Unknown';
            document.getElementById('firstName').textContent = profile.first_name || 'Unknown';
            document.getElementById('lastName').textContent = profile.last_name || 'Unknown';
            document.getElementById('Email').textContent = profile.email || 'Unknown';
            document.getElementById('profileAge').textContent = profile.age || 'N/A';
            document.getElementById('profileMobile').textContent = profile.mobaile_no || 'N/A';
            document.getElementById('profileAddress').textContent = profile.address || 'N/A';
            document.getElementById('profileBloodGroup').textContent = profile.blood_group || 'N/A';
            document.getElementById('availabilityStatus').textContent = profile.is_available ? 'Yes' : 'No';
            document.getElementById('healthStatus').textContent = profile.health_screening_passed ? 'Yes' : 'No';
            document.getElementById('profileImage').src = profile.image || 'default-image.jpg'; // Default image

            // At this point, profileId has been assigned
            // You can now use profileId in subsequent operations
            performAdditionalOperations(profileId); // Example of using profileId
        })
        .catch(error => console.error('Error fetching profile data:', error));
    };

    const performAdditionalOperations = (id) => {
        console.log("Using profile ID:", id);
        // Add your additional logic here, using the profileId
    };

    fetchProfileData();
});


// -------------------------------------------------
// Update Profile
document.getElementById('updateProfileForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Default form submission বন্ধ করুন

  // ডেটা অবজেক্ট তৈরি করুন
  const data = {
      'first_name': document.getElementById('first_name').value,
      'last_name': document.getElementById('last_name').value,
      'age': document.getElementById('age').value,
      'mobaile_no': document.getElementById('mobaile_no').value,
      'address': document.getElementById('address').value,
      'blood_group': document.getElementById('blood_group').value
  };

  // ছবির ফাইল নেওয়া
  const imageFile = document.getElementById('profileImage').files[0];
  
  // FormData ব্যবহার করুন
  const formData = new FormData();
  Object.keys(data).forEach(key => formData.append(key, data[key])); // অন্য ডেটা যোগ করুন
  if (imageFile) {
      formData.append('image', imageFile); // ছবির ফাইল যোগ করুন
  }

  sendData(formData); // ডেটা পাঠান
});

// ডেটা পাঠানোর ফাংশন
function sendData(data) {
  const token = localStorage.getItem("authToken"); // টোকেন নিন
  // প্রোফাইল আইডি এখানে দিন

  fetch(`http://127.0.0.1:8000/accounts/profile/${profileId}`, {
      method: 'PATCH', // অথবা PUT ব্যবহার করুন
      body: data, // FormData হিসেবে ডেটা পাঠান
      headers: {
          'Authorization': `Token ${token}` // টোকেন হেডারে যোগ করুন
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to update profile'); // ত্রুটি হ্যান্ডল করুন
      }
      return response.json(); // JSON হিসেবে উত্তর পড়ুন
  })
  .then(data => {
      console.log('Success:', data);
      // সফল হলে মডাল বন্ধ করুন
      var modal = bootstrap.Modal.getInstance(document.getElementById('updateProfileModal'));
      modal.hide();
  })
  .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while updating the profile. Please try again.'); // ব্যবহারকারীর জন্য ত্রুটি বার্তা দেখান
  });
}




// --------------------------------------------------------------
// Donation History
let donationData = []; // Global variable to hold the fetched donation history data

function fetchDonationHistory() {
  fetch("http://127.0.0.1:8000/events/donation-history/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("authToken")}`, // Include your auth token here
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Parse response to JSON
    })
    .then((data) => {
      console.log("donation history data", data);
      donationData = data; // Store the fetched data in the global variable
      const container = document.getElementById("donation-history-container");
      container.innerHTML = ""; // Clear existing content

      let totalDonationsCount = 0; // Initialize total donation count

      data.forEach((item) => {
        console.log(item);
        // Sum up the donation counts
        totalDonationsCount += item.blood_donation_count;

        // Create a card for each donation history item
        const card = `
          <div class="col-lg-4 col-md-6 col-sm-12">
            <div class="card history-card h-100 py-4 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">Event: ${item.event.event_name}</h5>
                <p class="card-text">
                  <strong>Recipient:</strong> ${item.event.recipient}<br>
                  <strong>Blood Group:</strong> ${item.event.blood_group}<br>
                  <strong>Date:</strong> ${item.event.date}<br>
                  <strong>Status:</strong> ${item.event.status}<br>
                  <strong>Created By:</strong> ${item.event.created_by}<br>
                  <strong>Active:</strong> ${item.event.is_active ? "Yes" : "No"}
                </p>
                <hr>
                <p class="card-text">
                  <strong>User:</strong> ${item.user}<br>
                  <strong>Accepted On:</strong> ${item.accepted_on}<br>
                  <strong>Donation Count:</strong> ${item.blood_donation_count}<br>
                  <strong>Canceled:</strong> ${item.is_canceled ? "Yes" : "No"}
                </p>
                <button class="btn btn-download-history rounded-pill" onclick="downloadPDF()">Download Donation History PDF</button>
                
              </div>
            </div>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", card); // Append the card to the container
      });

      // Display the total donations and congrats message
      const full_name = fullname; // Replace this with the actual user's full name from your data
      displayCongratsMessage(full_name, totalDonationsCount);
      document.getElementById("totalDonations").innerText = `Total Donations: ${totalDonationsCount}`;
    })
    .catch((error) => {
      console.error('Error fetching donation history:', error);
      //   alert('Failed to load donation history. Please try again later.');
    });
}

function displayCongratsMessage(fullName, totalDonationsCount) {
  const messageElement = document.getElementById("congratsMessage");
  messageElement.style.display = "block"; // Make the message visible
  messageElement.innerHTML = `🎉 Congratulations, ${fullName}! 🎉<br>You have made a total of ${totalDonationsCount} donations. Thank you for your generosity! 💖`;
}

function downloadPDF() {
  generatePDF(donationData); // Pass the fetched donation data to the PDF generation function
}

function generatePDF(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;

  data.forEach((item, index) => {
    if (index > 0) {
      doc.addPage(); // Add new page for items after the first
      doc.text("Donation History", 10, 10);
      y = 20; // Reset Y-axis position
    }

    if (item) {
      // For the first item, include all details
      if (index === 0) {
        const fullText = `Event: ${item.event.event_name || "N/A"}\nRecipient: ${item.event.recipient || "N/A"}\nCreated By: ${item.event.created_by || "N/A"}\nBlood Group: ${item.event.blood_group || "N/A"}\nDate: ${item.event.date || "N/A"}\nStatus: ${item.event.status || "N/A"}\nAccepted On: ${item.accepted_on || "N/A"}\nUser: ${item.user || "N/A"}\nDonation Count: ${item.blood_donation_count || "N/A"}\nCanceled: ${item.is_canceled ? "Yes" : "No"}`;
        doc.text(fullText, 10, y);
      } else {
        // For other items, show limited information
        const limitedText = `Event: ${item.event.event_name || "N/A"}\nRecipient: ${item.recipient || "N/A"}\nCreated By: ${item.event.created_by || "N/A"}\nBlood Group: ${item.blood_group || "N/A"}\nDate: ${item.date || "N/A"}\nStatus: ${item.status || "N/A"}`;
        doc.text(limitedText, 10, y);
      }
      y += 30;

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    }
  });

  doc.save("donation_history.pdf"); // Save PDF
}

// Fetch the donation history on page load
window.onload = fetchDonationHistory;
















document.addEventListener('DOMContentLoaded', () => {
  fetchFeedback();
});

async function fetchFeedback() {
  const token = localStorage.getItem("authToken");

  try {
      const response = await fetch('http://127.0.0.1:8000/blood_bank_releted/feedback/', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
          },
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const feedbackData = await response.json();
      displayFeedback(feedbackData);
  } catch (error) {
      console.error('Error fetching feedback:', error);
  }
}

function displayFeedback(feedbackData) {
  const feedbackContainer = document.getElementById('feedback-container');
  feedbackContainer.innerHTML = ''; // Clear existing content

  feedbackData.forEach(feedback => {
      const feedbackDiv = document.createElement('div');
      feedbackDiv.className = 'feedback-item py-5 px-5  w-75 m-auto';
      feedbackDiv.innerHTML = `
          <h4>User: ${feedback.donor}</h4>
          <h5 class="mt-2">Rating: ${feedback.rating}</h5>
          <h5>Date: ${new Date(feedback.created_at).toLocaleDateString()}</h5>
          <h6 class="mt-2">Feedback: ${feedback.feedback}</h6>
          <div class="button-container">
              <button class="update-feedback-btn mt-5 rounded-pill  text px-3 text-white fw-bold border-0" onclick="openUpdateModal(${feedback.id})">Update Feedback</button>
              <button class="update-feedback-btn mt-5 ms-5 rounded-pill  text px-3 text-white fw-bold border-0" onclick="deleteFeedback(${feedback.id})">Delete Feedback</button>
          </div>
      `;
      feedbackContainer.appendChild(feedbackDiv);
  });
}

async function openUpdateModal(feedbackId) {
  const token = localStorage.getItem("authToken");

  try {
      const response = await fetch(`http://127.0.0.1:8000/blood_bank_releted/feedback/${feedbackId}/`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
          },
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const feedback = await response.json();

      // Populate the modal fields with feedback data
      document.getElementById('feedbackDonor').value = feedback.donor;
      document.getElementById('feedbackRating').value = feedback.rating; // Populate rating dropdown
      document.getElementById('feedbackText').value = feedback.feedback;
      document.getElementById('feedbackId').value = feedback.id;

      // Show the modal
      $('#updateFeedbackModal').modal('show');

  } catch (error) {
      console.error('Error fetching feedback:', error);
  }
}

document.getElementById('submitFeedbackBtn').addEventListener('click', async () => {
  const token = localStorage.getItem("authToken");
  const feedbackId = document.getElementById('feedbackId').value;
  const updatedFeedback = {
      donor: document.getElementById('feedbackDonor').value,
      rating: document.getElementById('feedbackRating').value,
      feedback: document.getElementById('feedbackText').value,
  };

  try {
      const response = await fetch(`http://127.0.0.1:8000/blood_bank_releted/feedback/${feedbackId}/`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
          },
          body: JSON.stringify(updatedFeedback),
      });

      if (response.ok) {
          alert('Feedback updated successfully!');
          $('#updateFeedbackModal').modal('hide');
          fetchFeedback(); // Refresh feedback list
      } else {
          alert('Error updating feedback. Please try again.');
      }
  } catch (error) {
      console.error('Error updating feedback:', error);
  }
});

// Function to delete feedback
async function deleteFeedback(feedbackId) {
  const token = localStorage.getItem("authToken");

  if (confirm('Are you sure you want to delete this feedback?')) {
      try {
          const response = await fetch(`http://127.0.0.1:8000/blood_bank_releted/feedback/${feedbackId}/`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Token ${token}`,
              },
          });

          if (response.ok) {
              alert('Feedback deleted successfully!');
              fetchFeedback(); // Refresh feedback list
          } else {
              alert('Error deleting feedback. Please try again.');
          }
      } catch (error) {
          console.error('Error deleting feedback:', error);
      }
  }
}
