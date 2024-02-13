import { Adventurer } from "@/types/adventurer";
import GameChat from "./chat";

export default function Home() {
    const players: Adventurer[] = [{
        name: "Ben",
        race: "Human",
        class: "Knight",
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
        inventory: [{ name: "Steel sword", description: "Strong and adorned sword given to me by the queen of Eldoria", uses: -1 }],
        abilities: [],
        spells: [{ name: "Heal", description: "Heals for 10 points of health", castTime: 1 }]
    }];

    return (
        <div className="h-full flex flex-row">
            <div className="basis-1/4 bg-gray-800">
                ...
            </div>
            <div className="basis-3/4 bg-gray-700 px-12 py-6">
                <GameChat {...{ adventurers: players }}></GameChat>
            </div>
        </div>
    );
}

