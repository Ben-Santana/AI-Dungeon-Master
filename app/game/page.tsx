'use client';
import { Character, User } from "@/types/user";
import Game from "./game";
import { tempAdventurer1 } from "@/types/usersTemp";

export default function GamePage() {

    return (
        <Game adventurer={tempAdventurer1} />
    );
}
