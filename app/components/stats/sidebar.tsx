import { Adventurer, Spell } from "../../../types/adventurer";

const SideBarSpells = ({ players }: { players: Adventurer[] }) => {
    {
        return players[0].spells.map((spell: Spell) =>
            <div>
                <h1 className="text-white text-base">{spell.name}</h1>
                <p className="text-white indent-3 text-sm">{spell.description}</p>
            </div>
        )
    }
}

export default function SideBar({ players }: { players: Adventurer[] }) {
    return <div>
        <SideBarSpells players={players}></SideBarSpells>
    </div>
}
