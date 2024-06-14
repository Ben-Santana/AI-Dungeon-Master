import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import UserModel from '@/lib/mongo/user.model';
import { connectToDatabase } from '@/lib/mongo/connectToDatabase';
import { Adventurer } from '@/types/adventurer';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId, characterIndex, updateData, newCharacterIndex }: {userId: string, characterIndex?: number, updateData?: Adventurer, newCharacterIndex?: number} = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'Invalid request' });
    }


    try {
        await connectToDatabase();

        //get user
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(characterIndex !== undefined) {
            //get character to modify
            const character = user.characters[characterIndex];

            //check for valid character
            if (!character) {
                return res.status(404).json({ message: 'Character not found' });
            }
 
            //update character values
            Object.assign(character.adventurer, updateData);
        }


        if(newCharacterIndex !== undefined) {
            //check for valid character
            if (!user.characters[newCharacterIndex]) {
                return res.status(404).json({ message: 'New character not found' });
            }

            //update selected character
            user.currentCharacterIndex = newCharacterIndex;
        }

        await user.save();

        res.status(200).json({ message: 'Character updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    } finally {
        mongoose.connection.close();
    }
};

export default handler;