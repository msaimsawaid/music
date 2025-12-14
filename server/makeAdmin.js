
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const User = require('./models/User');
    
    // Find user by email and make admin (change email to yours)
    const user = await User.findOneAndUpdate(
      { email: 'saim@gmail.com' }, // CHANGE THIS TO YOUR EMAIL
      { role: 'admin' },
      { new: true }
    );
    
    if (user) {
      console.log('✅ User updated to admin:', user.username, '-', user.email);
    } else {
      console.log('❌ User not found with that email');
    }
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });