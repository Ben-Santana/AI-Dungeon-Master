export interface Adventurer {
    name: String;
    race: String;
    stats: Stats;
    hitPoints: HitPoints;
    vigor: Vigor;
    spells: SpellsIndex;
    abilities: Abilities;
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

export interface SpellsIndex {
    name: String;
    castTime: number;
    description: String;
}

export interface Abilities {
    name: String;
    description: String;
}
