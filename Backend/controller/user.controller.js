const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model"); // Requiring user model
const router = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// Use JWT_SECRET from environment variables
const JWT_SECRET = "your_jwt_secret_key_here";
// Replace with a secure secret key
router.post("/register", async (req, res) => {
  try {
    const { fullname, email, username, password, repeatPassword } = req.body;

    // Check if passwords match
    if (password !== repeatPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullname,
      email,
      username,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    // Create and sign JWT token
    const payload = {
      user: {
        id: newUser.id,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: "1h" }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const payload = {
      user: {
        id: user.id,
        username: user.username,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
    res.json({ token }); // Send the token to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/checkemail", async (req, res) => {
  try {
    const { email } = req.body;

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(400).json({ msg: "Email is not registered" });
    }

    // Encode the email for use in the URL
    const encodedEmail = encodeURIComponent(email);

    // Define the reset password link with email parameter
    const resetLink = `http://127.0.0.1:5500/Frontend/changepassword.html?email=${encodedEmail}`;

    // Configure nodemailer transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "iamtouseefahmed91@gmail.com",
        pass: "xgrx mbjd aczj gczg",
      },
    });

    // Email options
    const mailOptions = {
      from: "iamtouseefahmed91@gmail.com",
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error sending email" });
      }
      console.log("Email sent: " + info.response);
      res.status(200).json({ msg: "Password reset email sent" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

//update

router.post("/changepassword", async (req, res) => {
  const { password, repeatPassword } = req.body;
  const { email } = req.query; // Get email from URL query parameters

  try {
    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if passwords match
    if (password !== repeatPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check password strength (you may want to add more robust checks)
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the password" });
  }
});

// Protect the dashboard route

module.exports = router;

//practice
// router.post('register ', (req , res)=>{
//  const {name , email , firstname , password} = req.body;

//  if (password !== repeatPassword ){
//    res.status(500).send({msg : " Enter same Password"});
//  }

//  const existinguser = User.findOne({
//   ${email },
//   ${password}
//  });

//  const salt = bcrypt.getSalt(10);
//  const hashedpassword  = bcrypt.hash(password , salt );

//  jwt.sign(payload , JWT_SECRET , {expiresIn  : " 1h "} , (err , token )=>{
//   if(err){
//     throw new Error("Error");

//   }
//   else {
//     console.log(token);
//   }
//  })
// })
