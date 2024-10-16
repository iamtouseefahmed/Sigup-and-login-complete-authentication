document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById("username").value; // Get the email input value
    const messageDiv = document.getElementById("message");

    try {
      // Send POST request to the API
      const response = await fetch("http://localhost:7070/api/checkemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }), // Send email as JSON
      });

      // Parse the response
      const data = await response.json();

      // Handle success
      if (response.ok) {
        messageDiv.innerHTML = `<p style="color: green;">${data.msg}</p>`;
      } else {
        // Handle error
        messageDiv.innerHTML = `<p style="color: red;">${data.msg}</p>`;
      }
    } catch (error) {
      console.error("Error:", error);
      messageDiv.innerHTML = `<p style="color: red;">Something went wrong. Please try again.</p>`;
    }
  });
