// lib/mongo/user.mongo.ts

import mongoose from 'mongoose';
import { User, Character } from '@/types/user';
import { Adventurer, Stats, HitPoints, Vigor, Spell, Skill, Coins, Item } from '@/types/adventurer'

const SpellSchema = new mongoose.Schema<Spell>({
    name: { type: String, required: true },
    castTime: { type: Number, required: true },
    description: { type: String, required: true },
});

const SkillSchema = new mongoose.Schema<Skill>({
    name: { type: String, required: true },
    description: { type: String, required: true },
});

const StatsSchema = new mongoose.Schema<Stats>({
    strength: { type: Number, required: true },
    dexterity: { type: Number, required: true },
    constitution: { type: Number, required: true },
    intelligence: { type: Number, required: true },
    wisdom: { type: Number, required: true },
    charisma: { type: Number, required: true },
});

const HitPointsSchema = new mongoose.Schema<HitPoints>({
    maxHp: { type: Number, required: true },
    currentHp: { type: Number, required: true },
});

const VigorSchema = new mongoose.Schema<Vigor>({
    armorClass: { type: Number, required: true },
    initiative: { type: Number, required: true },
    speed: { type: Number, required: true },
});

const CoinsSchema = new mongoose.Schema<Coins>({
    gold: { type: Number, required: true },
    silver: { type: Number, required: true },
    copper: { type: Number, required: true },
});

const ItemSchema = new mongoose.Schema<Item>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    uses: { type: Number, required: true },
});

const GptMessageMemorySchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "system", "assistant"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});

const AdventurerSchema = new mongoose.Schema<Adventurer>({
    name: { type: String, required: true },
    race: { type: String, required: true },
    class: { type: String, enum: ["wizard", "knight", "artificer", ""], required: true },
    level: { type: Number, required: true },
    stats: { type: StatsSchema, required: true },
    hitPoints: { type: HitPointsSchema, required: true },
    vigor: { type: VigorSchema, required: true },
    spells: { type: [SpellSchema], required: true },
    skills: { type: [SkillSchema], required: true },
    coins: { type: CoinsSchema, required: true },
    inventory: { type: [ItemSchema], required: true },
});

const CharacterSchema = new mongoose.Schema<Character>({
    adventurer: { type: AdventurerSchema, required: true },
    chatHistory: { type: [GptMessageMemorySchema], required: true },
});

const UserSchema = new mongoose.Schema<User>({
    characters: { type: [CharacterSchema], required: true },
    currentCharacterIndex: { type: Number, required: true },
});

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;
