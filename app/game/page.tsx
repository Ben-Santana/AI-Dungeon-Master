'use client';
import { Character, User } from "@/types/user";
import Game from "./game";
import { tempAdventurer1 } from "@/types/usersTemp";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from "../components/loading";


export default function GamePage() {
    const searchParams = useSearchParams();
    const characterIndex: number = Number(searchParams?.get('characterIndex') ?? null);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

    useEffect(() => {
        if (characterIndex === -1) return;

        fetch('/api/user-api')
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);
                const user = data[0];
                if (user && user.characters[Number(characterIndex)]) {
                    setSelectedCharacter(user.characters[Number(characterIndex)]);
                }
            });
    }, [characterIndex]);

    if (!selectedCharacter) {
        return <Loading></Loading>
    }

    return (
        <Game adventurer={selectedCharacter.adventurer} />
    );
}
