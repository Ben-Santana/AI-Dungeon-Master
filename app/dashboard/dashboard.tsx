'use client'
import WizardIcon from '../components/icons/WizardIcon';
import ArtificerIcon from '../components/icons/ArtificerIcon';
import KnightIcon from '../components/icons/KnightIcon';
import { Character, User } from '@/types/user';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import React, { MouseEvent } from 'react';
import axios from 'axios';

const CharacterCards = ({ users, currentCharacterIndex, setCurrentCharacterIndex, loadingIndex, setLoadingIndex}: { users: User[], currentCharacterIndex: number | null, setCurrentCharacterIndex: (index: number) => void , loadingIndex: number | null, setLoadingIndex: (index: number | null) => void}) => {

    if (users[0]) {
        return (
            <div className='flex gap-3 h-52'>
                {users[0].characters.map((c, index) => (
                    <div key={c.adventurer.name} className='flex-1 hover:flex-5 transition-transform h-full'>
                        <CharacterCard
                            character={c}
                            user={users[0]}
                            currentCharacterIndex={currentCharacterIndex}
                            setCurrentCharacterIndex={setCurrentCharacterIndex}
                            index={index}
                            loadingIndex={loadingIndex}
                            setLoadingIndex={setLoadingIndex}
                        />
                    </div>
                ))}
            </div>
        );
    }

    return null;
};
const CharacterCard = ({ user, character, currentCharacterIndex, setCurrentCharacterIndex, index, loadingIndex, setLoadingIndex}: 
                        { user: User, character: Character, currentCharacterIndex: number | null, setCurrentCharacterIndex: (index: number) => void, index: number, loadingIndex: number | null, setLoadingIndex: (index: number | null) => void}) => {

    const handleButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoadingIndex(index);
        await SelectCharacter(user, character, setCurrentCharacterIndex, index, setLoadingIndex);
        //router.push(`/game?characterIndex=${index}`);
    };

    const buttonClass = `${currentCharacterIndex === index ? 'text-white shadow-2xl shadow-white border-4 border-orange-500 custom_bg-dark-gray hover:shadow-white' : 'text-gray-300 hover:text-gray-100 custom_bg-gray'} 
                            p-2 m-2 rounded-md transition-all shadow-md hover:shadow-xl w-full h-full text-2xl hover:text-3xl grid grid-flow-row-dense grid-cols-1 grid-rows-4
                            ${loadingIndex === index ? 'animate-pulse' : ''}`;

    return (
        <button className={buttonClass} onClick={handleButtonClick}>
            <strong className='col-span-1 row-span-1'>{character.adventurer.name}</strong>
            <div className={`col-span-1 row-span-3 h-full w-full custom_bg-gray custom_shadow-inner rounded-md`}>
                {character.adventurer.class === 'wizard' ? <WizardIcon></WizardIcon>: 
                 character.adventurer.class === 'knight' ? <KnightIcon></KnightIcon>:
                 character.adventurer.class === 'artificer' ? <ArtificerIcon></ArtificerIcon>:
                 ''}
            </div>
        </button>
    );
}

const SelectCharacter = async (user: User, character: Character, setCurrentCharacterIndex: (index: number) => void, index: number, setLoadingIndex: (index: number | null) => void) => {
    const characterIndex = user.characters.findIndex(c => c.adventurer.name === character.adventurer.name);
    if (characterIndex !== -1) {
        user.currentCharacterIndex = characterIndex;

        try {
            await axios.put('/api/update-character', {
                userId: user._id,
                characterIndex: characterIndex
            });
            setCurrentCharacterIndex(characterIndex);  // Update local state after successful API call
            console.log('Character updated successfully');
        } catch (error) {
            console.error('Error updating character:', error);
        } finally {
            setLoadingIndex(null); // Reset loading state
        }
    }
};
export default function Dashboard() {
    // State variables to replace AlpineJS functionality
    const [profileOpen, setProfileOpen] = useState(false);
    const [asideOpen, setAsideOpen] = useState(true);

    const [users, setUsers] = useState<User[]>([]);

    const [currentCharacterIndex, setCurrentCharacterIndex] = useState<number | null>(users[0]?.currentCharacterIndex ?? null);
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

    useEffect(() => {
      fetch('/api/user-api')
      .then((response) => response.json())
      .then((data) => {
                setUsers(data);
                setCurrentCharacterIndex(data[0]?.currentCharacterIndex ?? null);
            }
        );
    }, []);

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
                        <Link href={`/game?characterIndex=${currentCharacterIndex}`} className='text-white text-center custom_bg-dark-gray rounded-md p-3 text-xl hover:text-orange-300'><p className="text-3xl">Play</p></Link>
                        <Link href="/" className='text-white text-center custom_bg-dark-gray rounded-md hover:text-orange-300'><p className="text-lg">Back</p></Link>
                    </aside>
                )}

                {/* Main content */}
                <div className="w-full p-4">
                    <div>
                        <CharacterCards users={users} currentCharacterIndex={currentCharacterIndex} setCurrentCharacterIndex={setCurrentCharacterIndex} loadingIndex={loadingIndex} setLoadingIndex={setLoadingIndex}></CharacterCards>
                    </div>
                </div>
            </div>
        </main>
    );
}