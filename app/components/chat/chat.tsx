'use client';
import { Adventurer } from "../../../types/adventurer";
import { useRef, useState } from "react";
import { callGptApi } from "../../functions/apiCallHandler";
import useAutosizeTextArea from "./useAutosizeTextArea";

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

  const submitText = (e: React.FormEvent) => {

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

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, input);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target?.value;
    setInputText(val);
  }

  return (
    <div className="h-full w-full p-5 relative bg-gray-200 rounded-lg">
      <div className="h-full flex flex-col flex-col-reverse gap-3">
        <div className="flex-auto p-1 rounded-lg">
          <div className="w-full h-max-12 flex flex-row flex-row-reverse bg-white border-gray-300 border-2 rounded-lg gap-3 p-5 items-end">
          <div className="flex-none h-12">
              <button className="h-12 w-auto hover:cursor-pointer" type="submit" onClick={submitText}>
                <svg className="h-12 w-auto" viewBox="-16 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M106.75 215.06L1.2 370.95c-3.08 5 .1 11.5 5.93 12.14l208.26 22.07-108.64-190.1zM7.41 315.43L82.7 193.08 6.06 147.1c-2.67-1.6-6.06.32-6.06 3.43v162.81c0 4.03 5.29 5.53 7.41 2.09zM18.25 423.6l194.4 87.66c5.3 2.45 11.35-1.43 11.35-7.26v-65.67l-203.55-22.3c-4.45-.5-6.23 5.59-2.2 7.57zm81.22-257.78L179.4 22.88c4.34-7.06-3.59-15.25-10.78-11.14L17.81 110.35c-2.47 1.62-2.39 5.26.13 6.78l81.53 48.69zM240 176h109.21L253.63 7.62C250.5 2.54 245.25 0 240 0s-10.5 2.54-13.63 7.62L130.79 176H240zm233.94-28.9l-76.64 45.99 75.29 122.35c2.11 3.44 7.41 1.94 7.41-2.1V150.53c0-3.11-3.39-5.03-6.06-3.43zm-93.41 18.72l81.53-48.7c2.53-1.52 2.6-5.16.13-6.78l-150.81-98.6c-7.19-4.11-15.12 4.08-10.78 11.14l79.93 142.94zm79.02 250.21L256 438.32v65.67c0 5.84 6.05 9.71 11.35 7.26l194.4-87.66c4.03-1.97 2.25-8.06-2.2-7.56zm-86.3-200.97l-108.63 190.1 208.26-22.07c5.83-.65 9.01-7.14 5.93-12.14L373.25 215.06zM240 208H139.57L240 383.75 340.43 208H240z"/>
                </svg>
              </button>
            </div>
          <div className="self-center w-full h-full">
            <textarea
              className="w-full text-gray-900 text-balance focus:outline-none"
              rows={2}
              ref={textAreaRef}
              onChange={handleInputChange}
              placeholder={"Embark on your great adventure"}
              value={input}
            />
          </div>
            </div>
          </div>
        <div className="flex-initial h-full border-gray-300 bg-white border-2 rounded-lg overflow-auto overscroll-auto scrollbar-thumb:!rounded">
          {messages.map((msg: Message) =>
            <ChatMessage content={msg.content} role={msg.role} name={msg.name} key={msg.key} />
          )}
          {loading
            ? <LoadingMessage />
            : <></>
          }

        </div>
      </div>
    </div >
  );
}