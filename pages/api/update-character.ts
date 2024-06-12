import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import UserModel from '@/lib/mongo/user.model';
import { connectToDatabase } from '@/lib/mongo/connectToDatabase';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId, characterIndex } = req.body;

    if (!userId || characterIndex === undefined) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        await connectToDatabase();

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.currentCharacterIndex = characterIndex;
        await user.save();

        res.status(200).json({ message: 'Character updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    } finally {
        mongoose.connection.close();
    }
};

export default handler;