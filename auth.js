const registerForm = document.getElementById("registerForm");

const handleregisterForm = (event) => {
  event.preventDefault(); // Prevent form from submitting normally
  const formData = new FormData(registerForm);
  const registrationData = {
    username: formData.get("username"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    age: formData.get("age"),
    address: formData.get("address"),
    mobaile_no: formData.get("mobaile_no"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  // Output the collected data to the console
  console.log(registrationData);

  const username = registrationData.username;
  const password = registrationData.password;
  const age = registrationData.age;
  const confirm_password = registrationData.confirm_password;

  // Regex to validate the username
  const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]+$/;

  if (!usernameRegex.test(username)) {
    document.getElementById("error").innerText =
      "Username must contain both letters and numbers, cannot contain spaces, but can contain underscores.";
    return;
  } else {
    document.getElementById("error").innerText = "";
  }
  
  if (password !== confirm_password) {
    document.getElementById("error").innerText =
      "Password and confirm password do not match.";
    return;
  }

  if (
    !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
      password
    )
  ) {
    document.getElementById("error").innerText =
      "Password must contain at least eight characters, including one letter, one number, and one special character.";
    return;
  }

  // Reset the error message before making the request
  document.getElementById("error").innerText = "";

  fetch("https://blood-bank-deploy-vercel.vercel.app/accounts/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registrationData),
  })
    .then((response) =>
      response.json().then((data) => ({ status: response.status, body: data }))
    )
    .then((result) => {
      console.log(result);
      if (result.status === 200) {
        alert("Registration Successful. Please check your email for confirmation.");
      } else if (result.status === 400) {
        // Handling specific error messages from the API
        let errorMessage = "";

        // If the error is a string array from the API
        if (Array.isArray(result.body)) {
          errorMessage += result.body.join(" ") + " "; // Concatenate all error messages
        }

        if (result.body.username) {
          errorMessage += result.body.username[0] + " ";
        }

        if (result.body.email) {
          errorMessage += result.body.email[0] + " "; // Use error directly from the API
        }

        if (result.body.error) {
          errorMessage += result.body.error + " ";
        }

        if (errorMessage === "") {
          errorMessage = "An error occurred during registration.";
        }

        document.getElementById("error").innerText = errorMessage.trim();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("error").innerText =
        "An unexpected error occurred. Please try again later.";
    });
};


const handleLogin = (event) => {
  event.preventDefault();
//   const token = localStorage.getItem("authToken");



  const form = document.getElementById("handleLogin");
  const formData = new FormData(form);

  const loginData = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  console.log("login data", loginData);

  fetch("https://blood-bank-deploy-vercel.vercel.app/accounts/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((res) => {
      if (!res.ok) {
        // Check if response is not okay (status 2xx)
        return res.json().then((data) => {
          // If there is a bad request or other error, return it
          const errorMessage =
            data.error || "Login failed. Please check your credentials.";
          alert(errorMessage); // Alert the user with the error message
          throw new Error(errorMessage); // Throw an error to be caught in catch block
        });
      }
      return res.json(); // Return the parsed JSON if response is okay
    })
    .then((data) => {
      console.log("set data", data);
      localStorage.setItem('userId', data.user_id); // লগ ইন করার পর ইউজার আইডি সংরক্ষণ
      console.log("token data", data.token);
      localStorage.setItem("authToken", data.token);
      alert("Login Successful");
      window.location.href = "./index.html";
    })
   
};

  const handleLogout = () => {
  const token = localStorage.getItem("authToken");
  console.log("logout token",token);
  fetch("https://blood-bank-deploy-vercel.vercel.app/accounts/logout/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((res) => {
      console.log(res);
      if (res.ok) {
        localStorage.removeItem("authToken");
        window.location.href = "./login.html";
      }
    })
    .catch((err) => {
      console.log("Logout error", err);
    });
  };


  function togglePasswordVisibility() {
    const passwordField = document.getElementById("passwordField");
    const toggleIcon = document.getElementById("toggleIcon");
    
    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}

