'use client'
import { Character } from '@/types/user';
import Link from 'next/link'
import { useState } from 'react';
import React, { MouseEvent } from 'react';

// const CharacterCards = () => {
//     return <div className='grid grid-flow-row-dense grid-cols-3 grid-rows-2'>
//         {user.characters.map((character: Character) => {
//             let tempSelect = false
//             if (character.adventurer.name == user.characters[user.currentCharacterIndex].adventurer.name) tempSelect = true;
//             return <div className='col-span-1 row-span-1'>
//                 <CharacterCard character={character} selected={tempSelect}></CharacterCard>
//             </div>
//         })}
//     </div>
// }

// const CharacterCard = ({ character, selected }: { character: Character, selected: boolean }) => {

//     const handleButtonClick = ((e: MouseEvent<HTMLButtonElement>) => {
//         e.preventDefault();
//         SelectCharacter(character);
//     });

//     const buttonClass = selected ?
//         'custom_bg-light-beige p-2 m-2 rounded-md text-gray-800 border-2 border-white w-full' :
//         'custom_bg-light-beige p-2 m-2 rounded-md text-gray-600 hover:text-gray-800 w-full';

//     return (
//         <button className={buttonClass} onClick={handleButtonClick}>
//             <strong className='text-2xl'>{character.adventurer.name}</strong>
//         </button>
//     );

// }

// const SelectCharacter = (character: Character) => {
//     const index = user.characters.findIndex(c => c.adventurer.name === character.adventurer.name);
//     if (index !== -1) user.currentCharacterIndex = index;
// };


export default function Dashboard() {
    // State variables to replace AlpineJS functionality
    const [profileOpen, setProfileOpen] = useState(false);
    const [asideOpen, setAsideOpen] = useState(true);

    return (
        <main className="min-h-screen w-full custom_bg-beige text-gray-700">
            <header className="flex w-full items-center justify-between custom_bg-dark-gray p-2">
                {/* Rest of the header code */}
                <div className="flex items-center space-x-2">
                    <button type="button" className="text-3xl" onClick={() => setAsideOpen(!asideOpen)}>
                        {/* Icon */}
                    </button>
                    <div className='text-white'>Logo</div>
                </div>

                {/* Profile button and dropdown */}
                <div>
                    <button type="button" onClick={() => setProfileOpen(!profileOpen)} className="h-9 w-9 overflow-hidden rounded-full custom_bg-gray">
                    </button>

                    {profileOpen && (
                        <div className="absolute right-2 mt-1 w-48 divide-y divide-gray-200 rounded-md border border-gray-200 bg-white shadow-md">
                            {/* Profile dropdown content */}
                        </div>
                    )}
                </div>
            </header>

            <div className="flex">
                {/* Aside menu */}
                {asideOpen && (
                    <aside className="flex w-72 flex-col space-y-2 custom_bg-gray p-2" style={{ height: '90.5vh' }}>
                        {/* Navigation links */}
                        <Link href="/game" className='text-white text-center custom_bg-dark-gray rounded-md p-3 text-lg hover:text-orange-300'>Play</Link>
                        <Link href="/" className='text-white text-center custom_bg-dark-gray rounded-md hover:text-orange-300'>Back</Link>
                    </aside>
                )}

                {/* Main content */}
                <div className="w-full p-4">
                    {/* Content goes here */}
                    {/* <CharacterCards></CharacterCards> */}
                </div>
            </div>
        </main>
    );
}