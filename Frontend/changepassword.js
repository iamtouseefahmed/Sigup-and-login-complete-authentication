document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const messageDiv = document.getElementById("message");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const Password = document.getElementById("newpassword");
    const RepeatPassword = document.getElementById("repeatpassword");
    const password = Password.value;
    const repeatPassword = RepeatPassword.value;

    // Clear previous messages
    messageDiv.textContent = "";

    // Check if passwords match
    if (password !== repeatPassword) {
      messageDiv.textContent = "Passwords do not match!";
      return; // Stop further execution if passwords don't match
    }

    // Get email from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");

    if (!email) {
      messageDiv.textContent = "Error: Email not found in URL parameters.";
      return; // Stop further execution if email is missing
    }

    // Construct the URL with the email parameter
    const url = `http://localhost:7070/api/changepassword?email=${encodeURIComponent(
      email
    )}`;

    // Send the POST request to the server
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, repeatPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          messageDiv.textContent = data.message; // Show server's response message
        } else {
          messageDiv.textContent = "Password updated successfully.";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        messageDiv.textContent =
          "An error occurred while updating the password.";
      });
  });
});
