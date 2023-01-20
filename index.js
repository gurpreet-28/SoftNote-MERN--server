const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoute = require("./routes/auth");
const noteRoute = require("./routes/notes");

const app = express();
const port = process.env.PORT || 5000;

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, () => {
  console.log("Successfully connected with MongoDB");
});

app.use(express.json());
app.use(cors());

// Available Routes
app.use("/api/auth", authRoute);
app.use("/api/notes", noteRoute);

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
