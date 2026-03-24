import { deepseek } from "./deepseek"
import { SYSTEM_PROMPT } from "./system-prompt"

export async function runAgent(message: string) {
    const response = await deepseek.chat.completions.create({
        model: "deepseek-reasoner",
        messages: [
            {
                role: "system",
                content: SYSTEM_PROMPT
            },
            {
                role: "user",
                content: message
            }
        ],
        temperature: 0.1
    })

    return response.choices[0].message.content
}