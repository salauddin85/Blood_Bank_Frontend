document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = 'https://blood-bank-deploy-vercel.vercel.app/events/dashboard/donation_history/'; // Replace with your actual API endpoint
    const container = document.getElementById('donationHistoryContainer'); // Corrected ID here
  
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          const donations = data.donation_history; // First 4 donations
          // console.log(donations, "Showing first 4 donations");
  
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