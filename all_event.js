
    document.addEventListener("DOMContentLoaded", function() {
        const eventSection = document.getElementById("all-events-list");
        const searchButton = document.getElementById("search-btn");
        const searchInput = document.getElementById("search-event");
        const notFoundMessage = document.getElementById("not-found-message");
        const refreshButton = document.getElementById("refresh");
        const token = localStorage.getItem("authToken");
        const defaultUrl = "https://blood-bank-backend-c7w8.onrender.com/events/dashboard/";
        let selectedBloodGroup = '';  // Variable to store selected blood group

        // Function to fetch events based on blood group and event name
        function fetchallEvents(eventName = "") {
            let url = defaultUrl;  // Default URL to show all events

            // If blood group is selected, use it in the URL
            if (selectedBloodGroup) {
                url = "https://blood-bank-backend-c7w8.onrender.com/events/donation-event-filter/?blood_group=" + encodeURIComponent(selectedBloodGroup);
            }

            // If there is an event name, use the search URL
            if (eventName) {
                url = "https://blood-bank-backend-c7w8.onrender.com/events/donation-event-filter/?event_name=" + encodeURIComponent(eventName);
            }

            fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                console.log("Fetched event data:", data);

                // Clear the existing events if any
                eventSection.innerHTML = '';
                notFoundMessage.style.display = 'none';  // Hide the not found message

                if (data.results.length === 0) {
                    notFoundMessage.style.display = 'block';  // Show not found message if no results
                } else {
                    // Loop through the events and inject them into the HTML
                    data.results.forEach(event => {
                        const eventCard = document.createElement("div");
                        eventCard.classList.add("col-lg-3", "col-md-6", "col-sm-12", "mb-4");

                        eventCard.innerHTML = `
                            <div class="event-card p-4 border rounded shadow-sm">
                                <h6 class="fw-bold"><strong>Event:</strong> ${event.event_name.toUpperCase()}</h6>
                                <div class="event-details mt-2">
                                    <p><strong>Recipient:</strong> ${event.recipient}</p>
                                    <p><strong>Blood Group:</strong> ${event.blood_group}</p>
                                    <p><strong>Date:</strong> ${event.date ? new Date(event.date).toLocaleDateString() : 'Not Provided'}</p>
                                    <p><strong>Status:</strong> ${event.status}</p>
                                    <p><strong>Created by:</strong> ${event.created_by}</p>
                                    <button type="submit" class="btn btn-danger rounded-0" id=${event.id} onclick="AcceptDonation(${event.id})">Accept</button>
                                </div>
                            </div>
                        `;

                        eventSection.appendChild(eventCard);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching event data:', error);
                alert('Failed to load events. Please try again later.');
            });
        }

        // Fetch all events on page load (default behavior)
        fetchallEvents();

        // Add event listener for the dropdown items
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function() {
                selectedBloodGroup = this.getAttribute('data-value');
                console.log('Selected Blood Group:', selectedBloodGroup);
                fetchallEvents(); // Fetch events based on selected blood group
            });
        });

        // Add event listener for the search button
        searchButton.addEventListener("click", function() {
            const eventName = searchInput.value.trim();
            console.log("Event name:", eventName);
            fetchallEvents(eventName);  // Fetch events based on the input value
        });

        refreshButton.addEventListener("click", function() {
            location.reload();  // Reload the current page
        });
    });



    
function AcceptDonation(eventId) {
    console.log("Accepted Donation for Event ID:", eventId);
    console.log("Token:", localStorage.getItem("authToken"));
  
    const encodedEventId = encodeURIComponent(eventId);
    console.log("Encoded Event ID:", encodedEventId);
  
    fetch(`https://blood-bank-backend-c7w8.onrender.com/events/acceptdonation/${encodedEventId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken")}`,
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
  