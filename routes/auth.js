const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const { body, validationResult } = require("express-validator");

const fetchuser = require("../middleware/fetchuser");
const User = require("../models/User");

env.config();
const router = express.Router();

// Create a user using POST: "/api/auth/signup"
router.post(
  "/signup",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      success = false;
      // If error occurs throw the error with bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
      }

      // Check whether the user exist already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry, user with this email already exists",
        });
      }

      // ceating password hash
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Otherwise create the user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      //   JWT Token
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, process.env.JWT_KEY);

      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
  }
);

// Authenticate a user using POST: "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // If error occurs throw the error with bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // Finding user
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid Login Credentials" });
      }

      // Checking password
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Invalid Login Credentials" });
      }

      //   JWT Token
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, process.env.JWT_KEY);

      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
  }
);

// Get loggedin user details GET: "/api/auth/getuser" Login required
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured in geting user");
  }
});

module.exports = router;
