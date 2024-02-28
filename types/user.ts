import { GptMessageMemory } from "@/app/functions/gptMemoryHandler";
import { Adventurer } from "./adventurer";

export interface User {
    characters: Character[],
    currentCharacterIndex: number
}

export interface Character {
    adventurer: Adventurer,
    chatHistory: GptMessageMemory[],
}