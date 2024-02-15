'use client';
import { Adventurer } from "../../types/adventurer";
import { Item } from "../../types/adventurer";
import { Spell } from "../../types/adventurer";
import { memo, useState } from "react";
import GPT3Tokenizer from 'gpt3-tokenizer';

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
  d20: number;
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
const systemPrompt = `You are a well-spoken and descriptive Dungeon Master for a Dungeons & Dragons game. Your task is to write the game's story and progression, as well as describe the outcomes of the players' actions. After each narrative or dialogue you provide, you must also update the game's statistics for each player in a structured JSON format. Remember to include changes in health, gold, items used, new spells, and new items, following the players' actions and the game's events. Every message the player sends will be formatted in the following manner, do NOT respond in this format, and only respond in the JSON format that I will provide below:
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
  ],
  d20: number // what the player rolled on their d20 dice. You must never ask the player to roll d20 or any dice, just use this number if needed.
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

const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
let totalTokens = 0;
let memoryTokens = 0;

let gptMessageMemories: GptMessageMemory[] = ([{ role: "system", content: systemPrompt }]);

let totalInput: FormattedInput = ({ dialogue: [], playerStats: [], d20: 1 });

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

  //
  const [party, setParty] = useState(adventurers);

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
      //print out what we are inputting into chatGPT
      console.log("Input:==================")
      console.log(totalInput);

      console.log(totalTokens);

      //call api and wait for response
      const response = await fetch('/api/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: [...gptMessageMemories, { role: "user", content: JSON.stringify(totalInput) }]
        })
      }).then((response) => response.json());

      //if response is valid...
      if (response.text) {
        //print it out
        console.log("Response:==================");
        console.log(response.text);

        //attempt to parse
        try {
          let parsedResponse = JSON.parse(response.text);
          let dialogueResponse = parsedResponse.dialogue;

          if (parsedResponse.statChanges) {
            console.log(`Stat Changes: ${JSON.stringify(parsedResponse.statChanges)}`);
            updatePlayerStats(JSON.stringify(parsedResponse.statChanges));
          }

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

          //set memoryTokens to number of tokens in gptMessageMemories
          memoryTokens = 0;
          gptMessageMemories.map((msg: GptMessageMemory) => {
            const encoded: { bpe: number[]; text: string[] } = tokenizer.encode(msg.content);
            memoryTokens += encoded.text.length;
          });

          totalTokens += memoryTokens + totalTokens;
          console.log("Total tokens used:==================");
          console.log(totalTokens);


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
    totalInput.d20 = Math.floor(Math.random() * 20) + 1
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  }

  const updatePlayerStats = (statChanges: string) => {
    let updatedAdventurers: Adventurer[] = [];
    try {
      let parsedStatChanges = JSON.parse(statChanges);
      parsedStatChanges.forEach((stats: GptStatChanges) => {
        adventurers.forEach((advent: Adventurer) => {
          //check to see that stat changes and player name match
          if (stats.name == advent.name) {

            //check if there were any changes to array properties, if there were create replacements
            let newPlayerItems = [...advent.inventory];
            let newPlayerSpells: Spell[] = [...advent.spells];
            if (stats.newSpells) {
              if (stats.newSpells.length == 1) {
                newPlayerSpells = [...advent.spells, stats.newSpells[0]];
              } else {
                newPlayerSpells = [...advent.spells, ...stats.newSpells];
              }
            }
            if (stats.newItems) {
              if (stats.newItems.length == 1) {
                newPlayerItems = [...advent.inventory, stats.newItems[0]];
              } else {
                newPlayerItems = [...advent.inventory, ...stats.newItems];
              }
            }

            let updatedPlayer: Adventurer = {
              ...advent,
              coins: {
                gold: advent.coins.gold + stats.changeInGold,
                silver: advent.coins.silver + stats.changeInSilver,
                copper: advent.coins.copper += stats.changeInCopper
              },
              spells: [...newPlayerSpells],
              inventory: [...newPlayerItems]
            }
            stats.itemsUsed.forEach((itemUsed: { "name": string }) => {
              updatedPlayer.inventory.forEach((item: Item) => {
                if (item.uses > 0 && itemUsed.name == item.name) {
                  item.uses--;
                  updatedPlayer.inventory = updatedPlayer.inventory.filter(item => item.uses > 0)
                }
              });
            })
            console.log(updatedPlayer);
            updatedAdventurers.push(updatedPlayer);

            console.log("Updated Adventurers:=================")
            console.log(updatedAdventurers)
            setPlayers(updatedAdventurers);
          } else {
            console.log("NO MATCH");
          }
        });
      });
    } catch (error) {
      setErrorMsg(`Error when parsing player stats!`);
      console.log(error);
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
