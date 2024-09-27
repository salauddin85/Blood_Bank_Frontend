fetch("navbar.html")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok " + res.statusText);
    }
    return res.text();
  })
  .then((data) => {
    document.getElementById("navbar").innerHTML = data;
    
    // Get the token from localStorage
    const token = localStorage.getItem("authToken");
    const navElement = document.getElementById("auth-element");

    if (token && token !== "undefined") {  // Check if token is not null and not the string "undefined"
      navElement.innerHTML += `
                <li class="nav-item">
                    <a class="nav-link" onclick="handleLogout()" href="#" id="handleLogout">Logout</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-t" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Profile
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="profileDropdown">
                        <li><a class="dropdown-item" href="#">My Account</a></li>
                        <li><a class="dropdown-item" href="#">Settings</a></li>
                        <li><a class="dropdown-item" href="#">Logout</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="btn btn-donate" href="#">Donate Now</a>
                </li>
      `;
    } else {
      navElement.innerHTML += `
                <li class="nav-item">
                    <a class="nav-link" href="./login.html" id="login-btn">Login</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-t" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Profile
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="profileDropdown">
                        <li><a class="dropdown-item" href="#">My Account</a></li>
                        <li><a class="dropdown-item" href="#">Settings</a></li>
                        <li><a class="dropdown-item" href="#">Logout</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="btn btn-donate" href="#">Donate Now</a>
                </li>
      `;
    }
  })
  .catch((error) => {
    console.error("Error loading navbar:", error);
  });
