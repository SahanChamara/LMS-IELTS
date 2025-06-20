const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.error('Mongoose connection error:', {
    message: error.message,
    code: error.code,
  });
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB. Attempting to reconnect...');
  connectDB();
});

module.exports = connectDB;