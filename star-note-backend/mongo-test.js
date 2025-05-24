// Test MongoDB connection
require("dotenv").config();
const mongoose = require("mongoose");

console.log("MongoDB URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 60000,
    socketTimeoutMS: 60000,
  })
  .then(() => {
    console.log("MongoDB connection successful!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("MongoDB connection test failed:", err);
  });
