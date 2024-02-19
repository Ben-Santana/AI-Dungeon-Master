import { Adventurer, Item, Spell } from "../../../types/adventurer";

const SideBarSpells = ({ players }: { players: Adventurer[] }) => {
    return <div className="custom_bg-gray rounded-sm p-3 m-1 text-left" >
        {players[0].spells.map((spell: Spell) =>
            <div className="rounded-md p-3 m-1">
                <strong className="text-white text-base">{spell.name}</strong>
                <p className="text-white indent-3 text-sm">{spell.description}</p>
            </div>)}
    </div>
}

const SideBarInventory = ({ players }: { players: Adventurer[] }) => {
    return <div className="custom_bg-gray rounded-sm p-3 m-1 text-left" >

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
                    }
                </div>

            </div>)}
    </div>
}

const SideBarStats = ({ players }: { players: Adventurer[] }) => {
    let player: Adventurer = players[0];
    return <div className="custom_bg-gray rounded-sm p-3 m-1 text-center grid grid-flow-row-dense md:grid-cols-2 md:grid-rows-4 lg:grid-cols-4 lg:grid-rows-2 justify-content items-center text-white gap-x-0.5">
        <div className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-3">
            <strong className="row-span-1">STRN</strong>
            <p className="row-span-2 text-xl custom_dungeon-font">{player.stats.strength}</p>
        </div>
        <div className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-3">
            <strong>DXT</strong>
            <p className="row-span-2 text-xl custom_dungeon-font">{player.stats.dexterity}</p>
        </div>
        <div className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-3">
            <strong>CONST</strong>
            <p className="row-span-2 text-xl custom_dungeon-font">{player.stats.constitution}</p>
        </div>
        <div className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-3">
            <strong>INTG</strong>
            <p className="row-span-2 text-xl custom_dungeon-font">{player.stats.intelligence}</p>
        </div>
        <div className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-3">
            <strong>WSDM</strong>
            <p className="row-span-2 text-xl custom_dungeon-font">{player.stats.wisdom}</p>
        </div>
        <div className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-3">
            <strong>CHRS</strong>
            <p className="row-span-2 text-xl custom_dungeon-font">{player.stats.charisma}</p>
        </div>
        <div className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-3">
            <strong>INIT</strong>
            <p className="row-span-2 text-xl custom_dungeon-font">{player.vigor.initiative}</p>
        </div>
        <div className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-3">
            <strong>SPD</strong>
            <p className="row-span-2 text-xl custom_dungeon-font">{player.vigor.speed}</p>
        </div>
    </div>
}

const SideBarHealth = ({ players }: { players: Adventurer[] }) => {
    let player: Adventurer = players[0];
    return <div className="custom_bg-gray h-full rounded-sm p-3 m-1 text-center grid grid-flow-row-dense grid-cols-2 grid-rows-1 justify-content items-center text-white gap-x-0.5">
        <div className="col-span-1 row-span-1">
            <strong>HP</strong>
            <p className=" custom_dungeon-font">{player.hitPoints.currentHp}/{player.hitPoints.maxHp}</p>
        </div>
        <div className="col-span-1 row-span-1">
            <strong>ARMCL</strong>
            <p className=" custom_dungeon-font">{player.vigor.armorClass}</p>
        </div>
    </div>
}

const SideBarCoins = ({ players }: { players: Adventurer[] }) => {
    let player: Adventurer = players[0];
    return <div className="custom_bg-gray h-full rounded-sm p-3 m-1 text-center grid grid-flow-row-dense grid-cols-1 grid-rows-3 justify-content items-center text-white gap-x-0.5">
        <div className="col-span-1 row-span-1">
            <strong>Gold</strong>
            {(player.coins.gold <= 0)
                ? <p className=" custom_dungeon-font">{player.coins.gold}</p>
                : <p className=" custom_dungeon-font">0</p>
            }
        </div>
        <div className="col-span-1 row-span-1">
            <strong>Silver</strong>
            {(player.coins.silver <= 0)
                ? <p className=" custom_dungeon-font">{player.coins.silver}</p>
                : <p className=" custom_dungeon-font">0</p>
            }
        </div>
        <div className="col-span-1 row-span-1">
            <strong>Copper</strong>
            {(player.coins.copper <= 0)
                ? <p className=" custom_dungeon-font">{player.coins.copper}</p>
                : <p className=" custom_dungeon-font">0</p>
            }
        </div>
    </div>
}

export default function SideBar({ players }: { players: Adventurer[] }) {
    return <div className="text-center overflow-auto overscroll-auto scrollbar-thumb:!rounded h-full no-scrollbar">
        <strong className="text-white text-2xl">Spells</strong>
        <SideBarSpells players={players}></SideBarSpells>
        <br />
        <strong className="text-white text-2xl">Inventory</strong>
        <SideBarInventory players={players}></SideBarInventory>
        <br />
        <strong className="text-white text-2xl">Stats</strong>
        <SideBarStats players={players}></SideBarStats>
        <br />
        <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-1">
            <div className="col-span-2 row-span-1">
                <SideBarHealth players={players}></SideBarHealth>
            </div>
            <div className="col-span-1 row-span-2">
                <SideBarCoins players={players}></SideBarCoins>
            </div>
        </div>
    </div>
}
