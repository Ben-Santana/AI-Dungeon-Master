'use client';
import { Adventurer } from "../../types/adventurer";
import { useState } from "react";

//maybe put in types
interface Message {
  role: "user" | "system" | "assistant";
  name: string,
  content: string; //might need to change String to some DungeonMaster type / Adventurer type if needed
  key: number;
}

interface GptMessageMemory {
  role: "user" | "system" | "assistant";
  content: string;
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

export default function GameChat({ adventurers }: { adventurers: Adventurer[] }) {

  //temporary system prompt
  const systemPrompt = "You are William Shakespeare, write everything in the form of poems that are three to five lines long";

  //interface
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [gptMessageMemories, setGptMessageMemories] = useState<GptMessageMemory[]>([{ role: "system", content: systemPrompt }]);
  const [input, setInputText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  //
  const [party, setParty] = useState(["dm", ...adventurers]);

  const submitText = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const myMessage: Message = {
      content: input,
      role: "user",
      name: "Player 1",
      key: (messages.length + 1)
    }

    const myMessageMemory: GptMessageMemory = {
      role: "user",
      content: input
    }

    setInputText("");

    setMessages([...messages, myMessage]);

    callGptApi(myMessageMemory, myMessage);
  }

  const callGptApi = async (gptMsg: GptMessageMemory, chatMsg: Message) => {

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
          prompt: [...gptMessageMemories, gptMsg]
        })
      }).then((response) => response.json());

      if (response.text) {
        const botMessage: Message = {
          content: response.text,
          role: "assistant",
          name: "Dungeon Master",
          key: (messages.length + 2)
        }

        const botMessageMemory: GptMessageMemory = {
          content: response.text,
          role: "assistant",
        }

        //add bot messages to memory and chat history
        setMessages([...messages, chatMsg, botMessage]);
        let tempMemoryArray = messages.map(({ role, content }) => ({ role, content }));
        setGptMessageMemories([...tempMemoryArray, gptMsg, botMessageMemory])
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
            <ChatMessage content={msg.content} role={msg.role} name={msg.name} key={msg.key} />
          )}

          {loading
            ? <LoadingMessage />
            : <></>
          }

        </div>
        <div className="row-span-1">
          <div className="h-full bg-white border-gray-300 border-2 p-1 rounded-lg flex items-center">
            <form className="w-full h-full flex items-center" onSubmit={submitText}>

              <input
                className="h-full w-11/12 text-gray-900 indent-3 rounded-lg focus:outline-none p-0 justify-self-center"
                type="text"
                placeholder="Embark"
                value={input}
                onChange={handleInputChange}
                disabled={loading}
              />

              <input className="h-full w-1/12 text-center hover:cursor-pointer custom_submit-bg" type="submit" value="" />

            </form>
          </div>
        </div>
      </div>
    </main >
  );
}
