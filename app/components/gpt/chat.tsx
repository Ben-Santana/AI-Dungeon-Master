'use client';
import { Adventurer } from "../../../types/adventurer";
import { useState } from "react";
import { callGptApi } from "../../functions/apiCallHandler";

interface Message {
  role: "user" | "system" | "assistant";
  name: string,
  content: string; //might need to change String to some DungeonMaster type / Adventurer type if needed
  key: number;
}

export interface FormattedInput {
  dialogue: playerInput[];
  playerStats: Adventurer[];
  d20: number;
}

interface playerInput {
  player: string; ///could be an int
  text: string
}

function ChatMessage({ name, content }: Message) {
  return (
    <div className="border border-black-300 shadow rounded-md p-4 m-2">
      <strong>{name}</strong>
      <p>{content}</p>
    </div>
  )
}

const LoadingMessage = () => {
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

export default function GameChat({ adventurers, setPlayers }: { adventurers: Adventurer[], setPlayers: React.Dispatch<React.SetStateAction<Adventurer[]>> }) {
  //interface
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInputText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [party, setParty] = useState(adventurers);

  const submitText = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const chatMsg: Message = {
      content: input,
      role: "user",
      name: "Player",
      key: (messages.length + 1)
    }

    setInputText("");

    //add inputed message to chat screen / history
    setMessages([...messages, chatMsg]);

    //call api, input both types of msg
    callGptApi(input, setLoading, setErrorMsg, adventurers, setPlayers, messages, setMessages);
  }

  const handleInputChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setInputText(e.currentTarget.value);
  }

  return (
    <main className="h-full p-5 relative bg-gray-200 rounded-lg">
      <div className="h-full flex flex-wrap flex-col gap-3">
        <div className="flex-auto border-gray-300 bg-white border-2 rounded-lg overflow-auto overscroll-auto scrollbar-thumb:!rounded">
          {messages.map((msg: Message) =>
            <ChatMessage content={msg.content} role={msg.role} name={msg.name} key={msg.key} />
          )}
          {loading
            ? <LoadingMessage />
            : <></>
          }

        </div>
          <div className="h-full max-h-20 bg-white border-gray-300 border-2 p-1 rounded-lg flex items-center">
            <form className="w-full h-full flex items-center" onSubmit={submitText}>

              <textarea
                id="inputBox"
                rows={3}
                style={{resize: 'none', padding: 10}}
                className="h-full w-11/12 text-gray-900 text-wrap indent-3 rounded-lg focus:outline-none p-0 justify-self-center"
                value={input}
                placeholder={"Embark on your journey"}
                onChange={handleInputChange}
                disabled={loading}
              />

              <input className="h-full w-1/12 min-w-20 text-center hover:cursor-pointer custom_submit-bg" type="submit" value="" />

            </form>
            <p>
              {/* {errorMsg} Reminder to add an error handler that adds an error alert to the page */}
            </p>
          </div>
      </div>
    </main >
  );
}
