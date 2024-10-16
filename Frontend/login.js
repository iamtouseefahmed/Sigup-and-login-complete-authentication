document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const messageDiv = document.getElementById("message");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Construct the login URL
    const url = "http://localhost:7070/api/login"; // Adjust this to your actual login route

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          console.log("Login successful", data.token);

          // Store the token in localStorage
          localStorage.setItem("token", data.token);

          // Redirect to the dashboard page
          window.location.href = "dashboard.html"; // Adjust this to your actual dashboard page
        } else {
          // Handle login failure
          messageDiv.textContent =
            data.message || "Login failed. Please try again.";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        messageDiv.textContent = "An error occurred during login.";
      });
  });
});
