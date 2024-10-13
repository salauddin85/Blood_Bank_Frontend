let fullname = "";
let profileId = ""; 

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem("authToken");
    const profileUrl = 'https://blood-bank-deploy-vercel.vercel.app/accounts/profile/';
    // const profileUrl = 'http://127.0.0.1:8000/accounts/profile/';

    const fetchProfileData = () => {
        fetch(profileUrl, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    // Uncomment this if you want to redirect to login on unauthorized access
                    // window.location.href = "/login"; 
                }
                throw new Error('Failed to fetch profile data');
            }
            return response.json();
        })
        .then(profileData => {
            const profile = profileData[0]; 
            const img_url = profile.image ? profile.image.replace("image/upload/", "") : null; // Check for existing image

            profileId = profile.id; // Assign profile ID

            fullname = `${profile.first_name || 'Unknown'} ${profile.last_name || 'Unknown'}`.trim();

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
            
            // Check if img_url exists before assigning to the image source
            if (img_url) {
                document.getElementById('profileImage').src = img_url; // Use existing image if available
            } else {
                document.getElementById('profileImage').src = 'default-image.jpg'; // Use default image
            }

            performAdditionalOperations(profileId);
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
const uploadPreset = 'image_upload_cildank'; // তোমার তৈরি করা upload preset এর নাম

const UpdateprofileForms = async (event) => {
  event.preventDefault();

  const imageInput = document.getElementById("image");
  const imageFile = imageInput.files[0]; // Get the selected file
  console.log(imageFile); // Check if the file is correct

  let imageUrl = null; // Variable to hold the uploaded image URL

  if (imageFile) {
    // Cloudinary এ ইমেজ আপলোড
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', imageFile); // Add file
    cloudinaryFormData.append('upload_preset', uploadPreset); // Add upload_preset

    try {
      const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/dnzqmx8nw/image/upload`, {
        method: "POST",
        body: cloudinaryFormData,
      });

      const cloudinaryData = await cloudinaryResponse.json(); // Wait for cloudinary response
      console.log(cloudinaryData, "cloudinary data");

      if (!cloudinaryResponse.ok) {
        throw new Error("Image upload failed.");
      }

      imageUrl = cloudinaryData.secure_url; // Get the secure image URL from cloudinary
    } catch (error) {
      console.error('Error during image upload:', error);
      alert("An error occurred during the image upload.");
      return; // Stop execution if the upload fails
    }
  }

  const updateProfileForm = document.getElementById("updateProfileForm");
  const data = new FormData(updateProfileForm);
  
  // Create the formdata object only with fields that have values
  const formdata = {};
  if (data.get("first_name")) formdata.first_name = data.get("first_name");
  if (data.get("last_name")) formdata.last_name = data.get("last_name");
  if (data.get("email")) formdata.email = data.get("email");
  if (data.get("age")) formdata.age = data.get("age");
  if (data.get("mobaile_no")) formdata.mobaile_no = data.get("mobaile_no");
  if (data.get("address")) formdata.address = data.get("address");
  if (imageUrl) formdata.image = imageUrl; // Include image URL if available
  if (data.get("blood_group")) formdata.blood_group = data.get("blood_group");

  console.log(formdata);

  // Determine the number of fields that have values
  const updatedFieldsCount = Object.keys(formdata).length;

  // Decide whether to send a PUT or PATCH request
  const requestMethod = updatedFieldsCount > 7 ? 'PUT' : 'PATCH';

  // Data পাঠানোর জন্য sendData ফাংশন কল করা
  await sendData(formdata, requestMethod);
};

// Data sending function
async function sendData(data, method) {
  const token = localStorage.getItem("authToken"); // Token retrieval
  if (!token) {
    alert("You are not an authenticated user. Please Login");
    return;
  }

  // Assuming profileId is available in your scope
  try {
    const response = await fetch(`https://blood-bank-deploy-vercel.vercel.app/accounts/profile/${profileId}/`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const responseData = await response.json();
    console.log('Success:', responseData);
    // Optionally close the modal or perform other actions on success
    var modal = bootstrap.Modal.getInstance(document.getElementById('updateProfileModal'));
    modal.hide();
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while updating the profile. Please try again.'); // Show error message to the user
  }
}






// --------------------------------------------------------------
// Donation History
let donationData = []; // Global variable to hold the fetched donation history data

function fetchDonationHistory() {
  const token = localStorage.getItem("authToken"); // টোকেন নিন

  fetch("https://blood-bank-deploy-vercel.vercel.app/events/donation-history/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`, // Ensure the token is correctly formatted
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





// Feedback

document.addEventListener('DOMContentLoaded', () => {
  fetchFeedback();
});

async function fetchFeedback() {
  const token = localStorage.getItem("authToken");

  try {
      const response = await fetch('https://blood-bank-deploy-vercel.vercel.app/blood_bank_releted/feedback/', {
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
      feedbackDiv.className = 'feedback-item py-5 px-5 text-white  w-75 m-auto';
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
      const response = await fetch(`https://blood-bank-deploy-vercel.vercel.app/blood_bank_releted/feedback/${feedbackId}/`, {
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
      const response = await fetch(`https://blood-bank-deploy-vercel.vercel.app/blood_bank_releted/feedback/${feedbackId}/`, {
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
          const response = await fetch(`https://blood-bank-deploy-vercel.vercel.app/blood_bank_releted/feedback/${feedbackId}/`, {
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













// ==============================================



const changePassword = async () => {
  const userId = localStorage.getItem('userId'); // ইউজার আইডি পাওয়া
  console.log(userId)
  const oldPassword = document.getElementById("oldPassword").value; // Get old password from input
  const newPassword = document.getElementById("newPassword").value; // Get new password from input
  console.log(oldPassword,newPassword)
  const token = localStorage.getItem("authToken"); // Get token from local storage
  if (!token) {
    alert("You are not an authenticated user.Please Login");

    return;
  }

  const response = await fetch('https://blood-bank-deploy-vercel.vercel.app/accounts/change_password/', {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`, // Authorization token
      },
      body: JSON.stringify({
          user_id: userId,
          old_password: oldPassword,
          new_password: newPassword,
      }),
  });

  const data = await response.json();

  if (response.ok) {
      alert(data.message); // Show success message
      // Optionally close the modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
      modal.hide();
      document.getElementById('changePasswordForm').reset(); // Reset the form
  } else {
      alert(data.error); // Show error message
  }
};

