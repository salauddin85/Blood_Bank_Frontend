const notificationShow = () => {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem("authToken");
  
    // Fetch the notifications
    fetch("https://blood-bank-deploy-vercel.vercel.app/events/notifications/", {
        method: "GET"
        
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then((data) => {
            // console.log("All notifications:", data);
  
            // Check if there are any notifications to display
            if (data.results.length === 0) {
                return; // Exit if there are no notifications
            }
  
            // Get only the first notification
            const notification = data.results[0]; // Fetch only the first notification
            // console.log(notification)
  
            // Find the existing elements in the card
            const cardTitle = document.querySelector(".card-title");
            const cardText = document.querySelector(".card-text");
  
            // Update the title and text with notification details
            cardTitle.innerHTML = `Urgent! Donors Needed, Especially Type ${notification.blood_group}.`;
            cardText.innerHTML = `Find a Location (${notification.location}) or drive near you. Same day event available. <strong class=""><a href="./donate_blood.html" class="text-decoration-none text-dark opacity-100">Give blood Now</a></strong>`;
        })
        .catch((error) => {
            console.error("Error fetching notifications:", error);
        });
  };
  
  // Call the function to fetch and display notifications
  notificationShow();
  
  
  
  
  // --------------------------------------------
  const notificationShows = () => {
    const notificationSection = document.getElementById("notification-list");
    
    const token = localStorage.getItem("authToken");
    
    fetch("https://blood-bank-deploy-vercel.vercel.app/events/notifications/", {
      method: "GET"
      
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        // Console log full response to check data
        // console.log("Full response:", data);
        
        if (data && data.results) {
          // console.log("All notifications:", data.results);
  
          notificationSection.innerHTML = "";
  
          // Slice to get only the first 4 notifications
          data.results.slice(0, 4).forEach((notification) => {
            // console.log("Notification:", notification);
            
            const notificationDiv = document.createElement("div");
            notificationDiv.className = "notification-card"; // Updated class name
  
            notificationDiv.innerHTML = `
              <p><strong>From:</strong> ${notification.sender}</p>
              <p><strong>Message:</strong> ${notification.message}</p>
              <p><strong>Location:</strong> ${notification.location}</p>
              <p><strong>Blood Group:</strong> ${notification.blood_group}</p>
              <p><strong>Created At:</strong> ${new Date(
                notification.created_at
              ).toLocaleString()}</p>
            `;
  
            notificationSection.appendChild(notificationDiv);
          });
        } else {
          console.warn("No results found in data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  };
  
  notificationShows();
  
  // Bloog post
  // ------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function() {
  const apiUrl = 'https://blood-bank-deploy-vercel.vercel.app/blood_bank_releted/blog/';
  const blogContainer = document.getElementById('blog-container');
  const viewMoreBtn = document.getElementById('view-more');
  let blogData = [];
  let displayedBlogs = 4;
  
  // Fetch blogs from API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      blogData = data.results.slice(0, displayedBlogs);  // Slice to get the first set of blogs
      displayBlogs(blogData);
    })
    .catch(error => console.error('Error fetching data:', error));
  
  // Function to display blogs
  function displayBlogs(blogs) {
    blogContainer.innerHTML = ''; // Clear the container before rendering
    blogs.forEach(blog => {
      const img_url = blog.image.replace("image/upload/", "");
  
      // console.log(blog.image)
      const blogCard = `
        <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
          <div class="blog-cardblock h-100">
            <div class="blog-cardbody text-center">
              <img src="${img_url}" class="blog-imageimg img-fluid" alt="${blog.title}">
              <div class="blog-textblock mt-3">
                <h5 class="blog-cardhead">${blog.title}</h5>
                <p class="blog-contentp">${blog.content.slice(0, 80)}...</p>
                <a href="./blog.html" class="btn btn-danger rounded-0 blog-buttonbtn">Read More</a>
              </div>
            </div>
          </div>
        </div>`;
      blogContainer.innerHTML += blogCard;
    });
  }
  
  // View More button click event to show more blogs
  viewMoreBtn.addEventListener('click', function() {
    const newBlogs = blogData.length < 5 ? blogData.concat(data.results.slice(4)) : blogData;
    displayBlogs(newBlogs);
  });
  });
  
  
  // DOnation History
  // --------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = 'https://blood-bank-deploy-vercel.vercel.app/events/dashboard/donation_history/'; // Replace with your actual API endpoint
  const container = document.getElementById('donationHistoryContainer'); // Corrected ID here
  
  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const donations = data.donation_history.slice(0, 3); // First 4 donations
        console.log(donations, "Showing first 4 donations");
  
        donations.forEach(donation => {
          const col = document.createElement('div');
          col.className = 'col-lg-4 col-md-6 col-sm-12 pb-5'; // Responsive column sizes
  
          col.innerHTML = `
              <div class="card h-100 mt-3 px-4 py-4 rounded-4">
                  <div class="card-body py-4">
                        <h5 class="card-title">Event: ${donation.event.event_name}</h5>
                        <h5 class="card-title">User: ${donation.user}</h5>
                        <p class="card-text"><strong>Recipient:</strong> ${donation.event.recipient}</p>
                        <p class="card-text"><strong>Blood Group:</strong> ${donation.event.blood_group}</p>
                        <p class="card-text"><strong>Donation Date:</strong> ${new Date(donation.event.date).toLocaleString()}</p>
                        <p class="card-text"><strong>Accepted On:</strong> ${new Date(donation.accepted_on).toLocaleString()}</p>
                        <p class="card-text"><strong>Created By:</strong> ${donation.event.created_by}</p>
                        <p class="card-text"><strong>Status:</strong> ${donation.event.status}</p>
                        <p class="card-text"><strong>Blood Donation Count:</strong> ${donation.blood_donation_count}</p>
                        <p class="card-text"><strong>Is Canceled:</strong> ${donation.is_canceled ? 'Yes' : 'No'}</p>
                        <p class="card-text"><strong>Is Active:</strong> ${donation.event.is_active ? 'Yes' : 'No'}</p>
                    </div>
              </div>
          `;
          container.appendChild(col);
        });
      })
      .catch(error => console.error('Error fetching donation history:', error));
  });
  
  
  
  
  
  // ----------------------------------------
  // feedback section 
  
  const apiUrl = 'https://blood-bank-deploy-vercel.vercel.app/blood_bank_releted/all_feedback/';
  let feedbackData = [];
  
  function fetchFeedback() {
      fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
              feedbackData = data.results.slice(0, 4); // Show only the first 4 feedbacks
              displayFeedback();
          })
          .catch(error => console.error('Error fetching feedback:', error));
  }
  function displayFeedback() {
    const feedbackSection = document.getElementById('feedbackSection');
    feedbackSection.innerHTML = ''; // Clear existing feedback
  
    feedbackData.forEach(feedback => {
        console.log(feedback)
        const createdAt = new Date(feedback.created_at);
        const formattedDate = createdAt.toLocaleDateString(); // Format date
        const formattedTime = createdAt.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}); // Format time
  
        const feedbackCard = `
            <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
                <div class="custom-user-feedback-large-interactive-card-wrapper-styled-dimension h-100">
                    <div class="custom-user-feedback-content-layout-with-extra-space">
                        <h5 class="pt-2">${feedback.donor}</h5>
                        <h5 class="pt-2">${feedback.feedback}</h5>
                        <h5 class="pt-2"><strong>Rating:</strong> ${feedback.rating}</h5>
                        <h5 class="pt-2">
                            Created on: ${formattedDate} at ${formattedTime}
                        </h5>
                    </div>
                </div>
            </div>
        `;
        feedbackSection.innerHTML += feedbackCard;
    });
  }
  
  
  // Initial fetch and display
  fetchFeedback();
  