// Import React and necessary hooks
'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NavBar = () => {
    // State variables to replace AlpineJS functionality
    const [profileOpen, setProfileOpen] = useState(false);
    const [asideOpen, setAsideOpen] = useState(true);

    return (
        <main className="min-h-screen w-full bg-white text-gray-700">
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
                </div>
            </div>
        </main>
    );
};

export default NavBar;
