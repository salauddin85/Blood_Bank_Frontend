fetch("footer.html")
  .then((res) => {
    if (!res.ok) {
      throw new Error('Network response was not ok ' + res.statusText);
    }
    return res.text();
  })
  .then((data) => {
    // console.log(data)
    document.getElementById("footer").innerHTML = data;
  })
  .catch((error) => {
    console.error('Error loading navbar:', error);
  });
 

  const subscribeForm = (event) => {
    event.preventDefault();
  
    const token = localStorage.getItem("authToken"); // Get token from localStorage
    const SubscribeForm = document.getElementById("SubscribeForm");
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
  