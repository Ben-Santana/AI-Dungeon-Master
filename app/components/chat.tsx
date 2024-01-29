'use client';
import { Adventurer } from "../../types/adventurer";
import Image from "next/image";
import { useState } from "react";

function ChatInput() {
  return (
    <div className="bg-white border-gray-300 border-2 p-2 rounded-lg flex">
      <input
        className="w-full py-2 px-2 text-gray-800 rounded-lg focus:outline-none"
        type="text"
        placeholder="Embark" />
    </div>
  )
}

//maybe put in types
interface Message {
  text: string,
  owner: Adventurer //need to figure out what to do for GPT messages
}

function ChatMessage({ text, owner }: Message) {
  return (
    <div>

    </div>
  )
}

export default function GameChat({ adventurers }: { adventurers: Adventurer[] }) {

  const [chats, setChat] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [party, setParty] = useState(["dm", ...adventurers]);
  const [messages, setMessages] = useState<Message[]>([]);


  return (
    <main className="relative bg-gray-200 max-w-2xl mx-auto h-full p-5 rounded-lg">
      <div className="w-full h-96 border-gray-300 bg-white border-2 p-2 rounded-lg">

      </div>
      <div className="w-full">
        <ChatInput />
      </div>
    </main>
  );
}