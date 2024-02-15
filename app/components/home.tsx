'use client';
import { Adventurer, Spell } from "@/types/adventurer";
import GameChat from "./chat";
import { memo, useState } from "react";

export default function Home() {
    const [players, setPlayers] = useState<Adventurer[]>([{
        name: "Sir Gawain",
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
        inventory: [{ name: "Green steel sword", description: "Strong and adorned sword given to me by the queen of Eldoria", uses: -1 }],
        abilities: [],
        spells: [{ name: "Heal", description: "Heals for 10 points of health", castTime: 1 }]
    }]);

    return (
        <div className="h-full flex flex-row">
            <div className="basis-1/4 custom_bg-beige p-3">
                {players[0].spells.map((spell: Spell) =>
                    <div>
                        <h1 className="text-white text-base">{spell.name}</h1>
                        <p className="text-white indent-3 text-sm">{spell.description}</p>
                    </div>
                )}
            </div>
            <div className="basis-3/4 px-12 py-6 custom_bg-light-beige">
                <GameChat adventurers={players} setPlayers={setPlayers} ></GameChat>
            </div>
        </div>
    );
}

