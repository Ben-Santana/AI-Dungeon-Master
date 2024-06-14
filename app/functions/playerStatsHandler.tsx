import { Adventurer, Coins, HitPoints, Item, Skill, Spell } from "@/types/adventurer";
import { User } from "@/types/user";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

export const updatePlayerStats = async (adventurers: Adventurer[], statChanges: string, setErrorMsg: React.Dispatch<React.SetStateAction<string>>, setPlayers: React.Dispatch<React.SetStateAction<Adventurer[]>>, user: User, characterIndex: number) => {
    let updatedAdventurers: Adventurer[] = [];
    try {
        let parsedStatChanges = JSON.parse(statChanges);
        console.log(statChanges)
        parsedStatChanges.forEach((stats: GptStatChanges) => {
            adventurers.forEach((advent: Adventurer) => {
                //check to see that stat changes and player name match
                if (stats.name == advent.name) {
                    console.log(advent);
                    //check if there were any changes to array properties, if there were, create replacements
                    let newPlayerItems: Item[] = [...advent.inventory];
                    let newPlayerSpells: Spell[] = [...advent.spells];
                    let newPlayerSkills: Skill[] = [...advent.skills];
                    let newCoins: Coins = {
                        gold: advent.coins.gold + stats.changeInGold,
                        silver: advent.coins.silver + stats.changeInSilver,
                        copper: advent.coins.copper + stats.changeInCopper,
                    }
                    let newPlayerHealth: HitPoints = {
                        currentHp: Math.min(advent.hitPoints.currentHp + stats.changeInHeath, advent.hitPoints.maxHp),
                        maxHp: advent.hitPoints.maxHp
                    }
                    if (stats.newSpells) {
                        if (stats.newSpells.length == 1) {
                            newPlayerSpells = [...advent.spells, stats.newSpells[0]];
                        } else {
                            newPlayerSpells = [...advent.spells, ...stats.newSpells];
                        }
                    }
                    if (stats.newItems) {
                        if (stats.newItems.length == 1) {
                            newPlayerItems = [...advent.inventory, stats.newItems[0]];
                        } else {
                            newPlayerItems = [...advent.inventory, ...stats.newItems];
                        }
                    }
                    if (stats.newSkills) {
                        if (stats.newSkills.length == 1) {
                            newPlayerSkills = [...advent.skills, stats.newSkills[0]];
                        } else {
                            newPlayerSkills = [...advent.skills, ...stats.newSkills];
                        }
                    }

                    let updatedPlayer: Adventurer = {
                        ...advent,
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
                    updatedAdventurers.push(updatedPlayer);
                    setPlayers(updatedAdventurers);
                }
            });
        });

        // Make API call to update player stats in the database
        if(user) {
            try {
                
                await axios.put('/api/update-character', {
                    userId: user._id, // Pass the appropriate user ID
                    characterIndex: characterIndex, // Pass the appropriate character index
                    updateData: updatedAdventurers[0] // Pass the updated adventurers data
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
