import mongoose from 'mongoose';

const SpellSchema = new mongoose.Schema({
    name: String,
    castTime: Number,
    description: String,
});

const AbilitySchema = new mongoose.Schema({
    name: String,
    description: String,
});

// ... Define other sub-schemas like Stats, HitPoints, etc.


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

const StatsSchema = new mongoose.Schema({
    strength: Number,
    dexterity: Number,
    constitution: Number,
    intelligence: Number,
    wisdom: Number,
    charisma: Number,
});

const HitPointsSchema = new mongoose.Schema({
    maxHp: Number,
    currentHp: Number,
});

const VigorSchema = new mongoose.Schema({
    armorClass: Number,
    initiative: Number,
    speed: Number,
});

const SkillSchema = new mongoose.Schema({
    name: String,
    description: String,
});

const CoinsSchema = new mongoose.Schema({
    gold: Number,
    silver: Number,
    copper: Number,
});

const ItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    uses: Number,
});

const AdventurerSchema = new mongoose.Schema({
    name: String,
    race: String,
    class: {
        type: String,
        enum: ["wizard", "knight", "artificer", ""],
    },
    level: Number,
    stats: StatsSchema,
    hitPoints: HitPointsSchema,
    vigor: VigorSchema,
    spells: [SpellSchema],
    abilities: [AbilitySchema],
    coins: CoinsSchema,
    inventory: [ItemSchema],
});

const CharacterSchema = new mongoose.Schema({
    adventurer: AdventurerSchema,
    chatHistory: [GptMessageMemorySchema], // Define GptMessageMemorySchema according to its structure
});

const UserSchema = new mongoose.Schema({
    characters: [CharacterSchema],
    currentCharacterIndex: Number,
});

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;
