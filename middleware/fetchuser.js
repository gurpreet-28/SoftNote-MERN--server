const jwt = require("jsonwebtoken");
const env = require("dotenv");

env.config();

const fetchuser = (req, res, next) => {
  // Get the user from the JWT Token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Access Denied" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_KEY);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Access Denied" });
  }
};

module.exports = fetchuser;
