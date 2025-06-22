import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

export async function summarizeIdea(text: string): Promise<string> {
	const prompt = `Your task is to analyze the following patent document text and extract its core inventive concept. Formulate this concept as a single, technically precise sentence, removing any extraneous information or context. Focus solely on the mechanism, process, or structure described in the text. The sentence should be concise and devoid of any introductory phrases or explanations.

    The response must contain only this sentence. Omit any preambles, conclusions, or discussions regarding the invention's purpose, novelty, or potential applications. Focus exclusively on describing the mechanism, process, or structure of the invention.

    Document Text:
    ---
    ${text}
    ---
    Core Inventive Concept:`;

	const result = await model.generateContent(prompt);
	const response = result.response;

	return response.text();
}
