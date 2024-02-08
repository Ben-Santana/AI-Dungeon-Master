import { Adventurer } from "@/types/adventurer";
import GameChat from "./chat";

export default function Home() {
    const players: Adventurer[] = [];

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

