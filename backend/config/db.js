const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/MOCK';
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
    }};
    module.exports = connectDB;
