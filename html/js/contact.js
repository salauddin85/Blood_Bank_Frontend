const contactForm = (event) => {
    event.preventDefault();  // Form submission prevent kora hoise.
    const contactForm = document.getElementById("contactForm");

    // FormData object theke data collect kora
    const contactData = new FormData(contactForm);

    // Form data object theke shomoshta data collect kore ekta contact object banano
    const contact = {
        name: contactData.get("name"),
        email: contactData.get("email"),
        message: contactData.get("message")
    };

    console.log(contact);
    const token = localStorage.getItem("authToken");
    
    // Aikhane form data API ba server-e sen
  fetch("https://blood-bank-deploy-vercel.vercel.app/blood_bank_releted/contact/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
       Authorization: `Token ${token}`,
    },
    body: JSON.stringify(contact),
  })
    .then((res) => {
      if (!res.ok) {
        // Check if response is not okay (status 2xx)
        return res.json().then((data) => {
          // If there is a bad request or other error, return it
          const errorMessage =
            data.error || "Please Login then Contact us !";
          alert(errorMessage); // Alert the user with the error message
          throw new Error(errorMessage); // Throw an error to be caught in catch block
        });
      }
      return res.json(); // Return the parsed JSON if response is okay
    })
    .then((data) => {
      console.log(data)
      alert("Thank for contact us");
    })
   

};