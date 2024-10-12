// Fetch navbar HTML and set up event listeners
fetch("navbar.html")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok " + res.statusText);
    }
    return res.text();
  })
  .then((data) => {
    document.getElementById("navbar").innerHTML = data;

    const token = localStorage.getItem("authToken");
    const navElement = document.getElementById("auth-element");

    if (token && token !== "undefined") {
      navElement.innerHTML += `
        <li class="nav-item">
            <a class="nav-link" onclick="handleLogout()" href="#" id="handleLogout">Logout</a>
        </li>
        <li class="nav-item ">
            <a class="nav-link " href="./profile.html">
                Profile
            </a>
           
        </li>
        <li class="nav-item">
            <a class="btn btn-donate" id="donationEventModalBtn" href="#">Donate Now</a> <!-- Changed Button ID -->
        </li>
      `;
    } else {
      navElement.innerHTML += `
        <li class="nav-item">
            <a class="nav-link" href="./login.html" id="login-btn">Login</a>
        </li>
        <li class="nav-item ">
            <a class="nav-link " href="./profile.html">
                Profile
            </a>
           
        </li>
        <li class="nav-item">
            <a class="btn btn-donate" id="donationEventModalBtn" href="#">Donate Now</a> <!-- Changed Button ID -->
        </li>
      `;
    }

    // Add event listener for the "Donate Now" button
    const donateButton = document.getElementById("donationEventModalBtn");
    donateButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default action (navigation)

        // Show the modal
        var donationModal = new bootstrap.Modal(document.getElementById('donationEventModal')); // Changed Modal ID
        donationModal.show();
    });
  })
  .catch((error) => {
    console.error("Error loading navbar:", error);
  });

// Donation event form submission function
const DonationEventForm = (event) => { // Changed Function Name
    event.preventDefault(); // Prevent the default form submission

    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem("authToken");

    // Log the token value for debugging purposes
    console.log("Token:", token);
    const form = document.getElementById("createDonationEventForm"); // Changed Form ID
    const formData = new FormData(form);
    const EventData = {
        event_name: formData.get("eventName").toUpperCase(),
        recipient: formData.get("eventRecipient"),
        blood_group: formData.get("bloodGroup"),
        date: formData.get("eventDate")
    };

    console.log(EventData); // Log the EventData object

    // Check if the token is present
    if (!token) {
        alert("You are not an authenticated user. Redirecting to login page.");
        return;
    }

    // Send a POST request with blood group and location
    fetch("https://blood-bank-deploy-vercel.vercel.app/events/donation-events/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,  // Ensure the token is correctly formatted
        },
        body: JSON.stringify(EventData),
    })
    .then(res => {
        if (res.status === 201) {
            return res.json().then(data => {
                alert("Donation Event Created successfully!");
            });
        } else if (res.status === 400) {
            return res.json().then(data => {
                alert("Error: " + (data.error || "Bad request. Please check your input."));
            });
        } else {
            alert("An unexpected error occurred. Please try again.");
        }
    })
    .catch(error => {
        console.error(error);
        alert("An unexpected error occurred. Please try again.");
    });

    // Hide the modal after submission
    var modal = bootstrap.Modal.getInstance(document.getElementById('donationEventModal')); // Changed Modal ID
    modal.hide();

    return false; // Prevent any default behavior
};
