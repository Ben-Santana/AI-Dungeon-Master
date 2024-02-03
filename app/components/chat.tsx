'use client';
import { Adventurer } from "../../types/adventurer";
import { useState } from "react";

//maybe put in types
interface Message {
  text: string;
  source: string; //might need to change String to some DungeonMaster type / Adventurer type if needed
  key: number;
}

function ChatMessage({ text, source }: Message) {
  return (
    <div className="border border-black-300 shadow rounded-md p-4">
  <div className="animate-pulse flex space-x-4">
    <div className="rounded-full bg-slate-700 h-10 w-10"></div>
    <div className="flex-1 space-y-6 py-1">
      <div className="h-2 bg-slate-700 rounded"></div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-2 bg-slate-700 rounded col-span-2"></div>
          <div className="h-2 bg-slate-700 rounded col-span-1"></div>
        </div>
        <div className="h-2 bg-slate-700 rounded"></div>
      </div>
    </div>
  </div>
</div>
  )
}

const LoadingMessage = () => {
  return (
    <div className="rounded-lg bg-gray-100 p-3">
      <strong>Bot</strong>
      <p>...</p>
    </div>
  )
}

export default function GameChat({ adventurers }: { adventurers: Adventurer[] }) {

  //interface
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInputText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  //
  const [party, setParty] = useState(["dm", ...adventurers]);

  const submitText = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const myMessage: Message = {
      text: input,
      source: "player",
      key: (messages.length + 1)
    }

    setMessages([...messages, myMessage]);
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
          key: (messages.length + 2)
        }
        setMessages([...messages, myMessage, botMessage]);
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


  return (
    <main className="h-full p-5 relative bg-gray-200 rounded-lg">
      <div className="h-full grid grid-cols-1 grid-rows-12 grid-flow-col gap-3">
      <div className="row-span-11 border-gray-300 bg-white border-2 rounded-lg overflow-auto overscroll-auto scrollbar-thumb:!rounded">
        {messages.map((msg: Message) =>
        <ChatMessage text={msg.text} source={msg.source} key={msg.key} />
        )}

            {loading
              ? <LoadingMessage/>
              : <></>
            }

      </div>
      <div className="row-span-1">
        <div className="h-full bg-white border-gray-300 border-2 p-2 rounded-lg flex">
          <form className="w-full" onSubmit={submitText}>
            <input
              className="h-full w-11/12 py-2 px-2 text-gray-800 rounded-lg focus:outline-none"
              type="text"
              placeholder="Embark"
              value={input}
              onChange={handleInputChange}
              disabled={loading}
            />
            <label>
            <input className="h-19 w-1/12 bg-gray-800 text-center hover:cursor-pointer bg-[url('../../public/svg/d20-dice.svg')]" type="submit" value="">
            </input>
            </label>
          </form>
        </div>
      </div>
      </div>
    </main >
  );
}
