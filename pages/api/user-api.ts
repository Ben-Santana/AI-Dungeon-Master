import clientPromise from '@/lib/mongo';
import UserModel from '@/lib/mongo/user.model';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await clientPromise; // Ensure MongoDB is connected

        const user = new UserModel({
            characters: [],
            currentCharacterIndex: 0
        });

        await user.save();

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
