import { addToGptMemory, gptMessageMemories } from "./gptMemoryHandler";
import { updatePlayerStats } from "./playerStatsHandler";
import { Adventurer } from "@/types/adventurer";
import { updateTokenCount } from "./tokenCountHandler";
import { FormattedInput } from "../components/chat/chat";

interface Message {
    role: "user" | "system" | "assistant";
    name: string,
    content: string; //might need to change String to some DungeonMaster type / Adventurer type if needed
    key: number;
}

let totalInput: FormattedInput = ({ dialogue: [], playerStats: [], d20: 1 });

export const callGptApi = async (playerInput: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrorMsg: React.Dispatch<React.SetStateAction<string>>,
    adventurers: Adventurer[],
    setPlayers: React.Dispatch<React.SetStateAction<Adventurer[]>>,
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {

    const setTotalInput = (chatInput: string) => {
        totalInput.dialogue = [{ player: (adventurers[0].name), text: chatInput }];
        totalInput.playerStats = adventurers;
        totalInput.d20 = Math.floor(Math.random() * 20) + 1
    }

    const playerMsg: Message = {
        content: playerInput,
        role: "user",
        name: "Player",
        key: (messages.length + 1)
    }

    //disable chat while waiting for api call
    setLoading(true);

    //
    setTotalInput(playerMsg.content);

    //try for api call
    try {
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

        if (response.text) {
            //attempt to parse
            try {
                let parsedResponse = JSON.parse(response.text);
                let dialogueResponse = parsedResponse.dialogue;

                //if there are any stat changes, update player stats
                if (parsedResponse.statChanges) {
                    updatePlayerStats(adventurers, JSON.stringify(parsedResponse.statChanges), setErrorMsg, setPlayers);
                }

                //Message for chat history / visual
                const botMessage: Message = {
                    role: "assistant",
                    content: dialogueResponse,
                    name: "Dungeon Master",
                    key: (messages.length + 2)
                }

                //add to chat history
                setMessages([...messages, playerMsg, botMessage]);
                console.log(response.text)
                addToGptMemory(playerInput, response.text);

                setErrorMsg("");

                updateTokenCount();

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
