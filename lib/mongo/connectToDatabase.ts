// lib/mongo/connectToDatabase.ts
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

export const connectToDatabase = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    //check for connection
    mongoose.connection.on('connected', () => console.log('connected'));

    return mongoose.connect(MONGO_URI, {
        dbName: 'Users',
    });
};