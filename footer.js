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
  
    const token = localStorage.getItem("authToken"); // Corrected localStorage method
    const SubscribeForm = document.getElementById("SubscribeForm");
    const form = new FormData(SubscribeForm);
   console.log(token)
   if (!token) {
    alert("You must be logged in to subscribe.");
    return;
  }
  
    // Correct formData creation
    const formData = {
      email: form.get("email"), // FormData from the form
    };
    console.log(formData);
  
    // Correct fetch syntax and added body for sending form data
    fetch("http://127.0.0.1:8000/blood_bank_releted/subscriptions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`, // Ensure the token is correctly formatted
      },
      body: JSON.stringify(formData), // Send the form data in the request body
    })
      .then((res) => {
        if (!res.ok) {
          // Check if response is not okay (status 2xx)
          return res.json().then((data) => {
            const errorMessage = data.error;
            alert(errorMessage); // Alert the user with the error message
            throw new Error(errorMessage); // Throw an error to be caught in catch block
          });
        }
        return res.json(); // Return the parsed JSON if response is okay
      })
      .then((data) => {
        console.log("set data", data);
        alert("Thank you for subscribing!");
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  