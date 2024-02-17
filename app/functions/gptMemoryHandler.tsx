import { systemPrompt } from "./systemPrompt";

export interface GptMessageMemory {
    role: "user" | "system" | "assistant";
    content: string;
}

export let gptMessageMemories: GptMessageMemory[] = ([{ role: "system", content: systemPrompt }]);

export const addToGptMemory = (playerText: string, botText: string) => {
    const chatMsgMemory: GptMessageMemory = {
        role: "user",
        content: playerText
    }

    const botMessageMemory: GptMessageMemory = {
        role: "assistant",
        content: botText
    }

    gptMessageMemories = ([...gptMessageMemories, chatMsgMemory, botMessageMemory])
}