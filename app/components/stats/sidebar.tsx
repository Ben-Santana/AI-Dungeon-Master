import { Adventurer, Item, Spell } from "../../../types/adventurer";

const SideBarSpells = ({ players }: { players: Adventurer[] }) => {
<<<<<<< HEAD
    return <div className="custom_bg-gray rounded-md p-3 m-1 text-left" >
        {players[0].spells.map((spell: Spell) =>
            <div className="rounded-md p-3 m-1">
                <strong className="text-white text-base">{spell.name}</strong>
                <p className="text-white indent-3 text-sm">{spell.description}</p>
=======
    return <div className="custom_bg-light-beige rounded-md p-3 m-1 text-left" >
        {players[0].spells.map((spell: Spell) =>
            <div className="custom_bg-beige rounded-md p-3 m-1">
                <strong className="text-gray-200 text-base">{spell.name}</strong>
                <p className="text-gray-200 indent-3 text-sm">{spell.description}</p>
>>>>>>> 3381a744ad7edbfc587a461eb062a609bdf9eb90
            </div>)}
    </div>
}

const SideBarInventory = ({ players }: { players: Adventurer[] }) => {
<<<<<<< HEAD
    return <div className="custom_bg-gray rounded-md p-3 m-1 text-left" >

        {players[0].inventory.map((item: Item) =>
            <div className="custom_bg-gray rounded-md p-3 m-1 grid grid-flow-row-dense grid-cols-3 grid-rows-1 justify-content items-center">
                <div className="col-span-2">
                    <strong className="text-white text-base">{item.name}</strong>
                    <p className="text-white indent-3 text-sm">{item.description}</p>
                </div>
                <div className="col-span-1 text-center ">
                    {(item.uses == -1)
                        ? <p className="text-white text-lg">&infin;</p>
                        : <p className="text-white text-lg">{item.uses}</p>
=======
    return <div className="custom_bg-light-beige rounded-md p-3 m-1 text-left" >

        {players[0].inventory.map((item: Item) =>
            <div className="custom_bg-beige rounded-md p-3 m-1 grid grid-flow-row-dense grid-cols-3 grid-rows-1 justify-content items-center">
                <div className="col-span-2">
                    <strong className="text-gray-200 text-base">{item.name}</strong>
                    <p className="text-gray-200 indent-3 text-sm">{item.description}</p>
                </div>
                <div className="col-span-1 text-center ">
                    {(item.uses == -1)
                        ? <p className="text-gray-200 text-lg">&infin;</p>
                        : <p className="text-gray-200 text-lg">{item.uses}</p>
>>>>>>> 3381a744ad7edbfc587a461eb062a609bdf9eb90
                    }
                </div>

            </div>)}
    </div>
}

// const SideBarInventory = ({ players }: { players: Adventurer[] }) => {
//     return <>
//         {players[0].inventory.map((item: Item) =>
//                 <div className="custom_bg-beige rounded-md p-3 m-1">
//                     <strong className="text-gray-200 text-base">{item.name}</strong>
//                     <p className="text-gray-200 indent-3 text-sm">{item.description}</p>
//                 </div>)}
//     </>
// }

export default function SideBar({ players }: { players: Adventurer[] }) {
    return <div className="text-center">
        <strong className="text-white text-2xl">Spells</strong>
        <SideBarSpells players={players}></SideBarSpells>
        <br />
        <strong className="text-white text-2xl">Inventory</strong>
        <SideBarInventory players={players}></SideBarInventory>
    </div>
}
