 const mongoose = require('mongoose');

 const connectDB = async () => {
   try {
     await mongoose.connect(process.env.MONGO_URI, {});
     console.log('MongoDB Connected...🟢');
   } catch (error) {
     console.error(`Error connecting to MongoDB 🔴: ${error.message}`);
     process.exit(1);
   }
 }
 module.exports = connectDB;

 // mongodb error-> Error connecting to MongoDB 🔴: connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
// fixed-> cmd->net start MongoDB