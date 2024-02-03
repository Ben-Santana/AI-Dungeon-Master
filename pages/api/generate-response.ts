import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from 'openai';
export const config = { runtime: 'edge' }

type ResponseData = {
    text: string;
};

interface GenerateNextApiRequest extends NextApiRequest {
    body: {
        prompt: string;
    };
}

const openai = new OpenAI({
    apiKey: process.env['OPEN_API_KEY']
});

export default async function handler(
    req: GenerateNextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const prompt = req.body.prompt;

    if (!prompt || prompt == '') {
        console.log(prompt);
        return new Response('Please send your prompt', { status: 400 });
    }


    const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1000,
    });

    const response = (completion.choices[0].message.content) || 'Sorry, there was a problem!';
    return res.status(200).json({ text: response });
}
