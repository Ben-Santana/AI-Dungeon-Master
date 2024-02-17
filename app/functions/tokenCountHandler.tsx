import GPT3Tokenizer from 'gpt3-tokenizer';
import { GptMessageMemory, gptMessageMemories } from './gptMemoryHandler';

const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
//total amount of tokens used
let totalTokens = 0;
//current amount of tokens in gpts memory
let memoryTokens = 0;

export const updateTokenCount = () => {
    memoryTokens = 0;
    gptMessageMemories.map((msg: GptMessageMemory) => {
        const encoded: { bpe: number[]; text: string[] } = tokenizer.encode(msg.content);
        memoryTokens += encoded.text.length;
    });

    totalTokens += memoryTokens + totalTokens;
}