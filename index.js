const express = require("express");
const connectToMongo = require("./db");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
connectToMongo();

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
