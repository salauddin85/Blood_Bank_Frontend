let currentPage = 1; // Current page to track pagination
let nextPageUrl = null;
let prevPageUrl = null;

const notificationShows = (page = 1) => {
  const notificationSection = document.getElementById("notification-list");

  const token = localStorage.getItem("authToken");

  fetch(`https://blood-bank-deploy-vercel.vercel.app/events/notifications/?page=${page}`, {
    method: "GET",
    // headers: {
    //   "Content-Type": "application/json",
    //   Authorization: `Token ${token}`,
    // },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      notificationSection.innerHTML = ""; // Clear previous notifications

      if (data && data.results.length > 0) {
        data.results.forEach((notification) => {
          const notificationDiv = document.createElement("div");
          // Using Bootstrap grid system: col-lg-3 (4 per row), col-md-6 (2 per row), col-sm-12 (1 per row)
          notificationDiv.className = "col-lg-3 col-md-6 col-sm-12 mb-4";

          notificationDiv.innerHTML = `
            <div class="notification-card h-100 p-3 border rounded">
              <p><strong>From:</strong> ${notification.sender}</p>
              <p><strong>Message:</strong> ${notification.message}</p>
              <p><strong>Location:</strong> ${notification.location}</p>
              <p><strong>Blood Group:</strong> ${notification.blood_group}</p>
              <p><strong>Created At:</strong> ${new Date(notification.created_at).toLocaleString()}</p>
            </div>
          `;
          notificationSection.appendChild(notificationDiv);
        });

        // Set the next and previous page URLs for pagination
        nextPageUrl = data.next;
        prevPageUrl = data.previous;

        // Enable/disable pagination buttons based on next and previous availability
        document.getElementById("next-page").disabled = !nextPageUrl;
        document.getElementById("prev-page").disabled = !prevPageUrl;
      } else {
        notificationSection.innerHTML = "<p>No notifications available.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching notifications:", error);
    });
};

// Event listeners for pagination buttons
document.getElementById("next-page").addEventListener("click", () => {
  if (nextPageUrl) {
    currentPage++;
    notificationShows(currentPage);
  }
});

document.getElementById("prev-page").addEventListener("click", () => {
  if (prevPageUrl) {
    currentPage--;
    notificationShows(currentPage);
  }
});

// Initial call to fetch notifications
notificationShows();
