const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoURI || mongoURI.includes("<username>") || mongoURI.includes("<password>") || mongoURI.includes("<cluster-name>")) {
      console.error("Error: MongoDB connection URI contains placeholder values or is not defined. Please update your MONGODB_URI environment variable.");
      // Do not exit the process immediately, allow server to start for debugging
      return;
    }

    await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    // Do not exit the process immediately, allow server to start for debugging
  }
};

module.exports = connectDB;
