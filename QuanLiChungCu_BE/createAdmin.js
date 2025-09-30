
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs'); // Import bcrypt
const User = require('./src/models/User');
const Role = require('./src/models/Role'); // Import Role model

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const createAdmin = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // --- Role Handling ---
    let adminRole = await Role.findOne({ name: 'admin' });

    if (!adminRole) {
      console.log('Admin role not found, creating one...');
      adminRole = new Role({ name: 'admin' });
      await adminRole.save();
      console.log('Admin role created successfully.');
    }

    // --- Admin User Handling ---
    const adminEmail = 'at@gmail.com';
    const adminPassword = 'abc';
    const adminName = 'Admin';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user with this email already exists.');
      mongoose.connection.close();
      return;
    }

    // Hash the password before creating the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword, // Save the hashed password
      roles: [adminRole._id] // Assign the role's ObjectId
    });

    await adminUser.save();

    console.log('Admin user created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log('Password: abc');

  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

createAdmin();