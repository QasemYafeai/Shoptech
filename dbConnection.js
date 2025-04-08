// dbConnection.js
const mongoose = require('mongoose');
require('dotenv').config(); 

async function connectToDB() {
  try {
    const uri = process.env.MONGODB_URI;


    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = { connectToDB };
