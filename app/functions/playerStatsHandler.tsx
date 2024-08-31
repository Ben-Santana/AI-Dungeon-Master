import { Adventurer, Coins, HitPoints, Item, Skill, Spell } from "@/types/adventurer";
import { User } from "@/types/user";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GptMessageMemory } from "./gptMemoryHandler";

interface GptStatChanges {
    "name": string,
    "changeInHeath": number,
    "changeInGold": number,
    "changeInSilver": number,
    "changeInCopper": number,
    "itemsUsed": [{ 'name': string }],
    "newSpells": [
        {
            "name": string,
            "description": string,
            "castTime": number //number of turns it takes to cast
        }
    ],
    "newItems": [
        {
            "name": string,
            "description": string,
            "uses": number //Number or -1 for unlimited
        }
    ],
    "newSkills": [
        {
            "name": string,
            "description": string
        }
    ]
}

export const updatePlayerStats = async (adventurer: Adventurer, statChanges: string, user: User, characterIndex: number) => {
    try {
        let updatedPlayer: Adventurer = adventurer;
        let parsedStatChanges = JSON.parse(statChanges);
        console.log("Stat changes: ", statChanges)
        parsedStatChanges.forEach((stats: GptStatChanges) => {
            //check to see that stat changes and player name match
            if (stats.name == adventurer.name) {
                console.log(adventurer);
                //check if there were any changes to array properties, if there were, create replacements
                let newPlayerItems: Item[] = [...adventurer.inventory];
                let newPlayerSpells: Spell[] = [...adventurer.spells];
                let newPlayerSkills: Skill[] = [...adventurer.skills];
                let newCoins: Coins = {
                    gold: adventurer.coins.gold + stats.changeInGold,
                    silver: adventurer.coins.silver + stats.changeInSilver,
                    copper: adventurer.coins.copper + stats.changeInCopper,
                }
                let newPlayerHealth: HitPoints = {
                    currentHp: Math.max(0, Math.min(adventurer.hitPoints.currentHp + stats.changeInHeath, adventurer.hitPoints.maxHp)),
                    maxHp: adventurer.hitPoints.maxHp
                }
                if (stats.newSpells) {
                    if (stats.newSpells.length == 1) {
                        newPlayerSpells = [...adventurer.spells, stats.newSpells[0]];
                    } else {
                        newPlayerSpells = [...adventurer.spells, ...stats.newSpells];
                    }
                }
                if (stats.newItems) {
                    if (stats.newItems.length == 1) {
                        newPlayerItems = [...adventurer.inventory, stats.newItems[0]];
                    } else {
                        newPlayerItems = [...adventurer.inventory, ...stats.newItems];
                    }
                }
                if (stats.newSkills) {
                    if (stats.newSkills.length == 1) {
                        newPlayerSkills = [...adventurer.skills, stats.newSkills[0]];
                    } else {
                        newPlayerSkills = [...adventurer.skills, ...stats.newSkills];
                    }
                }

                updatedPlayer = {
                    ...adventurer,
                    hitPoints: newPlayerHealth,
                    coins: newCoins,
                    spells: [...newPlayerSpells],
                    inventory: [...newPlayerItems],
                    skills: [...newPlayerSkills]
                }
                stats.itemsUsed.forEach((itemUsed: { "name": string }) => {
                    updatedPlayer.inventory.forEach((item: Item) => {
                        if (item.uses > 0 && itemUsed.name == item.name) {
                            item.uses--;
                            updatedPlayer.inventory = updatedPlayer.inventory.filter(item => item.uses != 0)
                        }
                    });
                });
                console.log(updatedPlayer);
            }
        });

        // Make API call to update player stats in the database
        if(user) {
            try {
                
                await axios.put('/api/update-character', {
                    userId: user._id, // Pass the appropriate user ID
                    characterIndex: characterIndex, // Pass the appropriate character index
                    updateData: updatedPlayer // Pass the updated adventurers data
                }); 
            } catch(error) {
                console.error("Unable to update character: ", error);
            }
        } else {
            console.error("Unable to find user to update");
        }
    } catch (error) {
        console.error(`Error when parsing player stats!: `, error);
    }
}
