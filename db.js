const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const mongoURI =
  "mongodb://127.0.0.1:27017/softDB?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4";

const connectToMongo = () => {
  mongoose.connect(
    mongoURI,
    () => {
      console.log("Successfully connected with MongoDB");
    },
    { newUrlParser: true }
  );
};

module.exports = connectToMongo;
