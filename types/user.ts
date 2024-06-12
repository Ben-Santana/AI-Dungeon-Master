import { GptMessageMemory } from "@/app/functions/gptMemoryHandler";
import { Adventurer } from "./adventurer";
import { ObjectId } from "mongodb";

export interface User {
    _id: ObjectId,
    characters: Character[],
    currentCharacterIndex: number
}

export interface Character {
    adventurer: Adventurer,
    chatHistory: GptMessageMemory[],
}