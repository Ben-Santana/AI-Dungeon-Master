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

interface FormattedInput {
  dialogue: playerInput[];
  playerStats: Adventurer[];
}

interface playerInput {
  player: string; ///could be an int
  text: string
}

//temporary system prompt
const systemPrompt = `You are a Dungeon Master for a game of Dungeons and Dragons and your job is to write a unique story for the adventures to embark on. Your core job is to create an engaging campaign for the adventurers to have the opportunity to explore. You will adhere to the following set of rules:
You will follow the rules of Dungeons and Dragons, however you will not use dice rolls and will make decisions on the success of each players turn based on their stats
Every time a player sends a message, the message will come in the format of a JSON object:
{
	“dialogue” : [
			{player: "player1's name", text:"player1's message"}
       ]
	“playerStats” : [{
       		 name: "examplePlayerName1",
      		  race: "Human",
      		  class: "Knight",
      		  level: 1,
      		  stats: {
   		         strength: 5,
  		          dexterity: 5,
  		          constitution: 5,
  		          intelligence: 5,
  		          wisdom: 5,
  		          charisma: 5
  		      },
 		       hitPoints: {
 		           maxHp: 20,
            currentHp: 20
 		       },
  		      vigor: {
  		          armorClass: 5,
  		          initiative: 5,
 		           speed: 5
  		      },
  		      coins: {
 		           gold: 5,
  		          silver: 5,
  		          copper: 5
       		       }
   	 	},
		{
			“name”: “examplePlayerName2”
			//etc…
		}]
}

You will always respond in the format of the following JSON file and from now on never respond with anything other than only a JSON object:
{
	“dialogue”: //your text response
	“statChanges”: [
		{
			“name”: “examplePlayerName1”,
			“changeInHeath”: 0,	
      “changeInGold”: 0,
      “itemsUsed”: [],
      “newSpells”:	[
	      {
		      “name”: “name of spell”,
		      “description”: “concise description of spell”,
		      “castTime”: 1
	      },
	      {
		      “name”: “name of spell”,
		      “description”: “concise description of spell”,
		      “castTime”: 2
	      }
      ]
      “newItems”:[]
    },
    {
			“name”: “examplePlayerName2”,
			“changeInHeath”: 1,	
      “changeInGold”: -1,	
      “itemsUsed”: [{“name”: “name of item used”}],
      “newSpells”:[],
      “newItems”:[
	    {
		    “name”: “name of item”,
		    “description”: “concise description of item”,
		    “uses”: 5 //if uses are unlimited put -1
      }
      ]
    }
  ]
}
Always include all areas of the JSON file, which includes the statChanges for all players no matter what.
All item and spell descriptions should be one short sentence.
Don’t let players do anything that would be considered cheating or unfair. 
If players attempt to use a spell or item they do not own, inform them that they cannot use that spell.
`;



let gptMessageMemories: GptMessageMemory[] = ([{ role: "system", content: systemPrompt }]);

let totalInput: FormattedInput = ({ dialogue: [], playerStats: [] });

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
  //interface
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInputText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  //
  const [party, setParty] = useState(["dm", ...adventurers]);

  const submitText = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const chatMsg: Message = {
      content: input,
      role: "user",
      name: "Player",
      key: (messages.length + 1)
    }

    const chatMsgMemory: GptMessageMemory = {
      role: "user",
      content: input
    }

    setInputText("");

    //add inputed message to chat screen / history
    setMessages([...messages, chatMsg]);

    //call api, input both types of msg
    callGptApi(chatMsgMemory, chatMsg);
  }

  const callGptApi = async (chatMsgMemory: GptMessageMemory, chatMsg: Message) => {

    //disable chat while waiting for api call
    setLoading(true);

    setTotalInput(chatMsg.content);

    //try for api call
    try {
      console.log(totalInput);
      const response = await fetch('/api/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: [...gptMessageMemories, { role: "user", content: JSON.stringify(totalInput) }]
        })
      }).then((response) => response.json());

      if (response.text) {
        try {
          let parsedResponse = JSON.parse(response.text);
          let dialogueResponse = parsedResponse.dialogue;
          let statChangesResponse = parsedResponse.statChanges;


          //Message for chat history / visual
          const botMessage: Message = {
            role: "assistant",
            content: dialogueResponse,
            name: "Dungeon Master",
            key: (messages.length + 2)
          }

          //Message for GPT's memory
          const botMessageMemory: GptMessageMemory = {
            role: "assistant",
            content: dialogueResponse
          }

          //add bot messages to memory and chat history
          setMessages([...messages, chatMsg, botMessage]);
          gptMessageMemories = ([...gptMessageMemories, chatMsgMemory, botMessageMemory])
          setErrorMsg("");
        } catch (error) {
          setErrorMsg(`Error when parsing response! : ${error}`)
        }
      }
    } catch (error) {
      setErrorMsg(`Error when calling API! : ${error}`);
    } finally {
      setLoading(false);
    }
  }

  const setTotalInput = (chatInput: string) => {
    totalInput.dialogue = [{ player: (adventurers[0].name), text: chatInput }];
    totalInput.playerStats = adventurers;
    // adventurers.forEach((a: Adventurer) => {
    // for when we have multiple adventurers and messages
    // });
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
