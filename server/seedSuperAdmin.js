const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const SuperAdmin = require('./models/SuperAdmin');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedSuperAdmin = async () => {
  await connectDB();
  await SuperAdmin.deleteMany({});

  const password = await bcrypt.hash('admin123', 10);
  const superAdmin = new SuperAdmin({
    name: 'Admin User',
    email: 'admin@example.com',
    password,
    role: 'superadmin',
  });

  await superAdmin.save();
  console.log('SuperAdmin created successfully');
  mongoose.connection.close();
};

seedSuperAdmin().catch((error) => {
  console.error('Error seeding SuperAdmin:', error);
  process.exit(1);
});