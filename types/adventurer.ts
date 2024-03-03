export interface Adventurer {
    name: string;
    race: string;
    class: "wizard" | "knight" | "artificer" | "";
    level: number;
    stats: Stats;
    hitPoints: HitPoints;
    vigor: Vigor;
    spells: Spell[];
    skills: Skill[];
    coins: Coins;
    inventory: Item[];
}

export interface Stats {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
}

export interface HitPoints {
    maxHp: number;
    currentHp: number;
}

export interface Vigor {
    armorClass: number;
    initiative: number;
    speed: number;
}

export interface Spell {
    name: String;
    castTime: number;
    description: String;
}

export interface Skill {
    name: String;
    description: String;
}

export interface Coins {
    gold: number;
    silver: number;
    copper: number;
}

export interface Item {
    name: String;
    description: String;
    uses: number;
}
