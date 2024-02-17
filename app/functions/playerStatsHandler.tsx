import { Adventurer, Item, Spell } from "@/types/adventurer";

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
    ]
}

export const updatePlayerStats = (adventurers: Adventurer[], statChanges: string, setErrorMsg: React.Dispatch<React.SetStateAction<string>>, setPlayers: React.Dispatch<React.SetStateAction<Adventurer[]>>) => {
    let updatedAdventurers: Adventurer[] = [];
    try {
        let parsedStatChanges = JSON.parse(statChanges);
        parsedStatChanges.forEach((stats: GptStatChanges) => {
            adventurers.forEach((advent: Adventurer) => {
                //check to see that stat changes and player name match
                if (stats.name == advent.name) {

                    //check if there were any changes to array properties, if there were create replacements
                    let newPlayerItems = [...advent.inventory];
                    let newPlayerSpells: Spell[] = [...advent.spells];
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

                    let updatedPlayer: Adventurer = {
                        ...advent,
                        coins: {
                            gold: advent.coins.gold + stats.changeInGold,
                            silver: advent.coins.silver + stats.changeInSilver,
                            copper: advent.coins.copper += stats.changeInCopper
                        },
                        spells: [...newPlayerSpells],
                        inventory: [...newPlayerItems]
                    }
                    stats.itemsUsed.forEach((itemUsed: { "name": string }) => {
                        updatedPlayer.inventory.forEach((item: Item) => {
                            if (item.uses > 0 && itemUsed.name == item.name) {
                                item.uses--;
                                updatedPlayer.inventory = updatedPlayer.inventory.filter(item => item.uses > 0)
                            }
                        });
                    })
                    updatedAdventurers.push(updatedPlayer);
                    setPlayers(updatedAdventurers);
                }
            });
        });
    } catch (error) {
        setErrorMsg(`Error when parsing player stats!`);
    }
}