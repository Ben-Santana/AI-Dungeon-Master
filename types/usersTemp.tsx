import { useState } from "react";
import { User } from "./user";
import { Adventurer } from "./adventurer";
import { GptMessageMemory } from "@/app/functions/gptMemoryHandler";
import { Content } from "next/font/google";
import { systemPrompt } from "@/app/functions/systemPrompt";

export let tempAdventurer1: Adventurer = {
    name: "Sir Gawain",
    race: "Human",
    class: "knight",
    level: 1,
    stats: {
        strength: 5,
        dexterity: 5,
        constitution: 5,
        intelligence: 5,
        wisdom: 5,
        charisma: 5
    },
    hitPoints: {
        maxHp: 20,
        currentHp: 20
    },
    vigor: {
        armorClass: 5,
        initiative: 5,
        speed: 5
    },
    coins: {
        gold: 5,
        silver: 5,
        copper: 5
    },
    inventory: [{ name: "Green steel sword", description: "Strong and adorned sword given to me by the queen of Eldoria", uses: -1 }],
    skills: [],
    spells: []
}


let tempAdventurer2: Adventurer = {
    name: "Magicus Benicus",
    race: "Elf",
    class: "wizard",
    level: 1,
    stats: {
        strength: 5,
        dexterity: 5,
        constitution: 5,
        intelligence: 5,
        wisdom: 5,
        charisma: 5
    },
    hitPoints: {
        maxHp: 15,
        currentHp: 15
    },
    vigor: {
        armorClass: 5,
        initiative: 5,
        speed: 5
    },
    coins: {
        gold: 5,
        silver: 5,
        copper: 5
    },
    inventory: [{ name: "Green Spell Book", description: "Strong and adorned spell book given to me by the queen of Eldoria", uses: -1 }],
    skills: [],
    spells: [{ name: "Fireball", description: "Hurls a flaming ball towards enemies", castTime: 1 }]
}

let tempChatHistory: GptMessageMemory[] = [{ role: "system", content: systemPrompt }];
export default function usersTemp() {
    const [user, setUser] = useState<User>({
        characters: [{
            adventurer: tempAdventurer1,
            chatHistory: tempChatHistory
        },
        {
            adventurer: tempAdventurer2,
            chatHistory: tempChatHistory
        }],
        currentCharacterIndex: 0
    });

}
