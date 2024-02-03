'use client';
import { Adventurer } from "../../types/adventurer";
import Image from "next/image";
import { useState } from "react";

//maybe put in types
interface Message {
  text: string;
  source: string; //might need to change String to some DungeonMaster type / Adventurer type if needed
  key: number;
}

function ChatMessage({ text, source }: Message) {
  return (
    <div className="rounded-lg bg-gray-100 p-3 m-3">
      <strong>{source}</strong>
      <p>{text}</p>
    </div>
  )
}

export default function GameChat({ adventurers }: { adventurers: Adventurer[] }) {

  const [loading, setLoading] = useState(false);
  const [party, setParty] = useState(["dm", ...adventurers]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInputText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  //keep track of message keys / index
  const [chatIndex, setChatIndex] = useState(0)


  //increment keys each time  
  const newChatIndex = () => {
    const tempKey = chatIndex;
    setChatIndex(chatIndex + 1);
    return tempKey;
  }

  const submitText = async (e: React.FormEvent<HTMLFormElement>) => {
    //prevents default
    e.preventDefault();

    const myMessage: Message = {
      text: input,
      source: "player",
      key: newChatIndex()
    }

    //add message to array
    setMessages([...messages, myMessage]);

    //reset input field
    setInputText("");

    //disable chat while waiting for api call
    setLoading(true);
    //try for api call
    try {
      const response = await fetch('/api/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: input
        })
      }).then((response) => response.json());

      if (response.text) {
        const botMessage: Message = {
          text: response.text,
          source: "bot",
          key: newChatIndex()
        }
        setMessages([...messages, botMessage]);
        setErrorMsg("");
      }

    } catch (error) {
      setErrorMsg(`Error when calling API! : ${error}`);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  }


  //TESTING -----------------------

  //-------------------------------


  return (
    <main className="relative bg-gray-200 max-w-2xl mx-auto h-full p-5 rounded-lg">
      <div className="w-full h-96 border-gray-300 bg-white border-2 p-2 rounded-lg overflow-auto overscroll-auto scrollbar-thumb:!rounded">
        {messages.map((msg: Message) => (
          <ChatMessage text={msg.text} source={msg.source} key={msg.key} />
        ))}
      </div>
      <div className="w-full">
        <div className="bg-white border-gray-300 border-2 p-2 rounded-lg flex">
          <form className="w-full" onSubmit={submitText}>
            <input
              className="w-4/5 py-2 px-2 text-gray-800 rounded-lg focus:outline-none"
              type="text"
              placeholder="Embark"
              value={input}
              onChange={handleInputChange}
              disabled={loading}
            />
            <input className="w-1/5 h-4/5 bg-gray-100 text-center" type="submit" />
          </form>
        </div>
      </div>
      <p className="error"> {errorMsg} </p>
    </main >
  );
}