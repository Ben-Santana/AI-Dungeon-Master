'use client';
import { Adventurer } from "../../types/adventurer";
import { Item } from "../../types/adventurer";
import { Spell } from "../../types/adventurer";
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

interface GptStatChanges {
  "name": string,
  "changeInHeath": number,
  "changeInGold": number,
  "changeInSilver": number,
  "changeInCopper": number,
  "itemsUsed": [{ 'name': string }],
  "newSpells": [
    {
      "name": string,
      "description": string,
      "castTime": number //number of turns it takes to cast
    }
  ],
  "newItems": [
    {
      "name": string,
      "description": string,
      "uses": number //Number or -1 for unlimited
    }
  ]
}
//temporary system prompt
const systemPrompt = `You are an AI Dungeon Master for a Dungeons & Dragons game. Your task is to narrate the game's progression, describe the outcomes of the players' actions, and manage the changes in game statistics such as health, gold, items, and spells. After each narrative or dialogue you provide, you must also update the game's statistics for each player in a structured JSON format. Remember to include changes in health, gold, items used, new spells, and new items, following the players' actions and the game's events. Every message the player sends will be formatted in the following manner, do NOT respond in this format, and only respond in the JSON format that I will provide below:
{
	“dialogue” : [
			“player": "examplePlayerName1",
      "text": "players text"
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
   	 	}
  ]
}

Your response to the players text should only be in "dialogue" in the following JSON structure and no where else:

{
"dialogue": 'Your text response describing the scenario, actions, and outcomes',
"statChanges": [
  {
    "name": 'Player Name',
    "changeInHeath": number,
    "changeInGold": number,
    "changeInSilver": number,
    "changeInCopper": number,
    "itemsUsed": [{'name': string}],
    "newSpells": [
      {
        "name": 'Spell Name',
        "description": 'Concise Description',
        "castTime": 1 //number of turns it takes to cast
      }
    ],
    "newItems": [
      {
        "name": 'Item Name',
        "description": 'Concise Description',
        "uses": 2 //Number or -1 for unlimited
      }
    ]
  }
]
}
ONLY respond in the provided JSON format and don't respond in any other way. Do not write anything outside the JSON object.
Please narrate the next part of the adventure, focusing on the outcome of the players' actions, and update their stats accordingly in the given JSON format.
Follow the JSON format no matter what and do not respond with anything else or in any other manner.
When players find coins, or a pouch of coins, never state it as an item, only add the amount to changeInGold, changeInSilver and changeInCopper
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
      console.log("Input:---------")
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
        console.log("Response:--------");
        console.log(response.text);
        try {
          let parsedResponse = JSON.parse(response.text);
          let dialogueResponse = parsedResponse.dialogue;
          let statChangesResponse = parsedResponse.statChanges;

          updatePlayerStats(JSON.stringify(parsedResponse.statChanges));

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
            content: response.text
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

  const updatePlayerStats = (statChanges: string) => {
    try {
      let parsedStatChanges = JSON.parse(statChanges);
      parsedStatChanges.forEach((stats: GptStatChanges) => {
        adventurers.forEach((advent: Adventurer) => {
          if (stats.name == (advent.name)) {
            advent.coins.gold += stats.changeInGold;
            advent.coins.silver += stats.changeInSilver;
            advent.coins.copper += stats.changeInCopper;
            stats.itemsUsed.forEach((itemUsed: { "name": string }) => {
              advent.inventory.forEach((item: Item) => {
                if (item.uses > 0 && itemUsed.name == item.name) {
                  item.uses--;
                  advent.inventory = advent.inventory.filter(item => item.uses > 0)
                }
              });
            })
            stats.newItems.forEach((newItem: Item) => {
              advent.inventory.push(newItem)
            });
            stats.newSpells.forEach((newSpell: Spell) => {
              advent.spells.push(newSpell);
            });
          }
        });
      });
    } catch (error) {
      setErrorMsg(`Error when parsing player stats!`)
    }
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
            <p>{errorMsg}</p>
          </div>
        </div>
      </div>
    </main >
  );
}
