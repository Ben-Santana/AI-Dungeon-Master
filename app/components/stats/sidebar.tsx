import Link from "next/link";
import { Adventurer, Item, Skill, Spell } from "../../../types/adventurer";

const SideBarSpells = ({ players }: { players: Adventurer[] }) => {
    return <div className="custom_bg-gray rounded-sm p-3 m-1 text-left" >
        {players[0].spells.map((spell: Spell) =>
            <div className="rounded-md p-3 m-1">
                <strong className="text-gray-100 text-2xl">{spell.name}</strong>
                <p className="text-gray-300 indent-3 text-xl" title={spell.description.toString()}>{spell.description}</p>
            </div>)}
    </div>
}

const Title = ({ players }: { players: Adventurer[] }) => {
    const styles: string = `${ players[0].class === 'knight' ? 'bg-zinc-600': ''}
                            ${ players[0].class === 'wizard' ? 'bg-violet-950': ''}
                            ${ players[0].class === 'artificer' ? 'bg-amber-900': ''}`;
    

    return <div className={`${styles} rounded-md p-3 m-1 text-left text-center custom_shadow-inner`} >
        <strong className="text-white text-3xl">{players[0].name}</strong>
    </div>
}

const SideBarSkills = ({ players }: { players: Adventurer[] }) => {
    return <div className="custom_bg-gray rounded-sm p-3 m-1 text-left" >
        {players[0].skills.map((skill: Skill) =>
            <div className="rounded-md p-3 m-1">
                <strong className="text-gray-100 text-2xl">{skill.name}</strong>
                <p className="text-gray-300 indent-3 text-xl" title={skill.description.toString()}>{skill.description}</p>
            </div>)}
    </div>
}


const SideBarInventory = ({ players }: { players: Adventurer[] }) => {
    return <div className="custom_bg-gray rounded-sm p-3 m-1 text-left" >

        {players[0].inventory.map((item: Item) =>
            <div className="custom_bg-gray rounded-md p-3 m-1 grid grid-flow-row-dense grid-cols-3 grid-rows-1 justify-content items-center">
                {(item.uses != -1)
                    ? <div className="col-span-3 grid grid-flow-row-dense grid-cols-3 grid-rows-1">
                        <div className="col-span-2">
                            <strong className="text-gray-100 text-2xl">{item.name}</strong>
                            <p className="text-gray-300 indent-3 text-xl" title={item.description.toString()}>{item.description}</p>
                        </div>
                        <div className="col-span-1 text-center h-full justify-content items-center"><p className="text-white text-lg col-span-1">{item.uses}</p></div>
                    </div>
                    : <div className="col-span-3">
                        <strong className="text-gray-100 text-2xl">{item.name}</strong>
                        <p className="text-gray-300 indent-3 text-xl" title={item.description.toString()}>{item.description}</p>
                    </div>
                }

            </div>)
        }
    </div >
}

const SideBarStats = ({ players }: { players: Adventurer[] }) => {
    let player: Adventurer = players[0];
    return <div className="custom_bg-gray rounded-sm p-3 m-1 text-center grid grid-flow-row-dense md:grid-cols-2 md:grid-rows-4 lg:grid-cols-4 lg:grid-rows-2 justify-content items-center text-white gap-x-0.5">
        <div title="Strength" className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-2">
            <strong className="custom_enchanted-font text-gray-100">STRN</strong>
            <p className="row-span-2 text-xl custom_dungeon-font text-gray-400">{player.stats.strength}</p>
        </div>
        <div title="Dexterity" className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-2">
            <strong className="custom_enchanted-font text-gray-100">DXT</strong>
            <p className="row-span-2 text-xl custom_dungeon-font text-gray-400">{player.stats.dexterity}</p>
        </div>
        <div title="Constitution" className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-2">
            <strong className="custom_enchanted-font text-gray-100">CONST</strong>
            <p className="row-span-2 text-xl custom_dungeon-font text-gray-400">{player.stats.constitution}</p>
        </div>
        <div title="Intelligence" className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-2">
            <strong className="custom_enchanted-font text-gray-100">INTG</strong>
            <p className="row-span-2 text-xl custom_dungeon-font text-gray-400">{player.stats.intelligence}</p>
        </div>
        <div title="Wisdom" className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-2">
            <strong className="custom_enchanted-font text-gray-100">WSDM</strong>
            <p className="row-span-2 text-xl custom_dungeon-font text-gray-400">{player.stats.wisdom}</p>
        </div>
        <div title="Charisma" className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-2">
            <strong className="custom_enchanted-font text-gray-100">CHRS</strong>
            <p className="row-span-2 text-xl custom_dungeon-font text-gray-400">{player.stats.charisma}</p>
        </div>
        <div title="Initiative" className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-2">
            <strong className="custom_enchanted-font text-gray-100">INIT</strong>
            <p className="row-span-2 text-xl custom_dungeon-font text-gray-400">{player.vigor.initiative}</p>
        </div>
        <div title="Speed" className="col-span-1 row-span-1 grid grid-flow-row-dense grid-cols-1 grid-rows-2">
            <strong className="custom_enchanted-font text-gray-100">SPD</strong>
            <p className="row-span-2 text-xl custom_dungeon-font text-gray-400">{player.vigor.speed}</p>
        </div>
    </div>
}

const SideBarHealth = ({ players }: { players: Adventurer[] }) => {
    let player: Adventurer = players[0];
    document.documentElement.style.setProperty('--healthbar-width', `${100 * player.hitPoints.currentHp / player.hitPoints.maxHp}` + '%');
    return <div className="relative custom_bg-gray rounded-md p-1 text-center text-white grid grid-flow-row-dense grid-cols-6 grid-rows-1">
        <strong className="z-20 text-2xl text-gray-100 h-full col-span-1">{player.hitPoints.currentHp}/{player.hitPoints.maxHp}</strong>
        <div className="w-full relative col-span-5 row-span-1">
            <div className='z-0 absolute top-1 left-0 h-4/5 w-full custom_bg-dark-gray rounded-lg'></div>
            <div className='z-0 absolute top-1 left-0 h-4/5 custom_healthbar-width custom_bg-red custom_shadow-inner rounded-lg'></div>
        </div>
    </div >
}

const SideBarCoins = ({ players }: { players: Adventurer[] }) => {
    let player: Adventurer = players[0];
    return <div className="custom_bg-gray rounded-sm p-3 m-1 text-center grid grid-flow-row-dense grid-cols-3 grid-rows-1 justify-content items-center text-white gap-x-0.5">
        <div className="col-span-1 row-span-1">
            <strong className="text-xl">Gold</strong>
            {(player.coins.gold >= 0)
                ? <p className=" custom_dungeon-font text-gray-400">{player.coins.gold}</p>
                : <p className=" custom_dungeon-font text-gray-400">0</p>
            }
        </div>
        <div className="col-span-1 row-span-1">
            <strong className="text-xl">Silver</strong>
            {(player.coins.silver >= 0)
                ? <p className=" custom_dungeon-font text-gray-400">{player.coins.silver}</p>
                : <p className=" custom_dungeon-font text-gray-400">0</p>
            }
        </div>
        <div className="col-span-1 row-span-1">
            <strong className="text-xl">Copper</strong>
            {(player.coins.copper >= 0)
                ? <p className=" custom_dungeon-font text-gray-400">{player.coins.copper}</p>
                : <p className=" custom_dungeon-font text-gray-400">0</p>
            }
        </div>
    </div>
}

const SideBarNav = () => {
    return <div className="custom_bg-gray m-2 rounded-lg">
        <Link href="/dashboard" className="text-white text-xl">Back to dashboard</Link>
    </div>
}

export default function SideBar({ players }: { players: Adventurer[] }) {
    return <div className="text-center overflow-auto overscroll-auto scrollbar-thumb:!rounded h-full no-scrollbar custom_enchanted-font ">
        <Title players={players}></Title>
        <SideBarHealth players={players}></SideBarHealth>
        <strong className="text-white text-3xl">Spells</strong>
        <SideBarSpells players={players}></SideBarSpells>
        <br />
        <strong className="text-white text-3xl">Skills</strong>
        <SideBarSkills players={players}></SideBarSkills>
        <br />
        <strong className="text-white text-3xl">Inventory</strong>
        <SideBarInventory players={players}></SideBarInventory>
        <br />
        <strong className="text-white text-3xl">Stats</strong>
        <SideBarStats players={players}></SideBarStats>
        <br />
        <SideBarCoins players={players}></SideBarCoins>
        <br />
        <SideBarNav></SideBarNav>
    </div>
}
