'use client';
import { Adventurer } from "../../types/adventurer";
import Image from "next/image";
import { useState } from "react";

export default function GameChat({ adventurers }: { adventurers: Adventurer[] }) {

  const [chats, setChat] = useState("");
  const [isLoading, setLoading] = useState(false);
  //const [party, setParty] = useState(["dm", ...adventurers]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button></button>
    </main>
  );
}