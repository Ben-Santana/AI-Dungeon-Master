import { Adventurer, Coins } from "@/types/adventurer";
import GameChat from "./chat";

export default function Home() {
    const players: Adventurer[] = [];

    return (
        <div className="h-full w-full overflow:auto">
            <GameChat {...{ adventurers: players }}></GameChat>
        </div>
    );
}

