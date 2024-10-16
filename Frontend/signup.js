const Confirmpasswordd = document.getElementById("confirm-password");
const fullname = document.getElementById("fullname").value;
const email = document.getElementById("email").value;
const username = document.getElementById("username").value;
const password = document.getElementById("password").value;
const confirmPassword = document.getElementById("confirm-password").value;
const message = document.getElementById("message");

Confirmpasswordd.addEventListener("blur", () => {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  if (password !== confirmPassword) {
    message.textContent = "enter same password";
    message.style.color = "red";
  }
});

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const passwordPattern =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$/;

  // Password validation
  if (!passwordPattern.test(password)) {
    message.textContent =
      "Password must contain at least 1 special character, 1 number, and be at least 7 characters long.";
    message.style.color = "red";
    return;
  }

  // Confirm password validation
  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    message.style.color = "red";
    return;
  }

  message.textContent = ""; // Clear the message if everything is valid

  try {
    const response = await fetch("http://localhost:7070/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname,
        email,
        username,
        password,
        repeatPassword: confirmPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Registration successful:", data.token);
      message.style.color = "red";

      // Save the token in localStorage for authentication
      localStorage.setItem("token", data.token);

      // Redirect to the dashboard page (protected route)
      window.location.href = "dashboard.html";
    } else {
      message.textContent = data.message || "Registration failed.";
      message.style.color = "red";
    }
  } catch (error) {
    console.error("Error:", error);
    message.textContent = "An error occurred. Please try again.";
    message.style.color = "red";
  }
});
