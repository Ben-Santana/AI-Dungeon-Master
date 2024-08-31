import { User } from "@/types/user";
import { systemPrompt } from "./systemPrompt";
import axios from "axios";

export interface GptMessageMemory {
    role: "user" | "system" | "assistant";
    content: string;
}

// export let gptMessageMemories: GptMessageMemory[] = ([{ role: "system", content: systemPrompt }]);

export const addToGptMemory = async (user: User, characterIndex: number, playerText: string, botText: string) => {
    const chatMsgMemory: GptMessageMemory = {
        role: "user",
        content: playerText
    }

    const botMessageMemory: GptMessageMemory = {
        role: "assistant",
        content: botText
    }

    // Make API call to update player stats in the database
    if(user) {
        try {
            
            await axios.put('/api/update-character', {
                userId: user._id, // Pass the appropriate user ID
                characterIndex: characterIndex, // Pass the appropriate character index
                newMessages: [chatMsgMemory, botMessageMemory]
            }); 
        } catch(error) {
            console.error("Unable to update character: ", error);
        }
    } else {
        console.error("Unable to find user to update");
    }
}