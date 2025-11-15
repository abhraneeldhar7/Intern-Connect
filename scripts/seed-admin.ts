import bcrypt from 'bcryptjs';
import connectDB from '../lib/db';

async function seedAdmin() {
  try {
    console.log('Connecting to database...');
    const { db } = await connectDB();
    console.log('Connected to database');

    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@example.com');
      console.log('To reset password, delete the user from database first.');
      process.exit(0);
    }

    // Default admin credentials
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123'; // Change this in production!
    const adminName = 'Admin User';

    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    const now = new Date();

    const result = await db.collection('users').insertOne({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      bookmarks: [],
      createdAt: now,
      updatedAt: now,
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('⚠️  IMPORTANT: Update the password in this script for production!');
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

seedAdmin();

