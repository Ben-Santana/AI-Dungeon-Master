import clientPromise from '@/lib/mongo';
import UserModel from '@/lib/mongo/user.model';
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongo/connectToDatabase';
import { User } from '@/types/user';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase(); // Ensures that the connection is established before querying
    
    try {
        const users: User[] = await UserModel.find({});
        console.log('Fetched users:', users);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}
