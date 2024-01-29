import { Adventurer, Coins } from "@/types/adventurer";
import GameChat from "./chat";

export default function Home() {
    const players: Adventurer[] = [];

    return (
        <GameChat {...{ adventurers: players }}></GameChat>
    );
}

