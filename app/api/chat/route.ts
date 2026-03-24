import { runAgent } from "@/lib/agent/agent"

export async function POST(req: Request) {
    try {
        const { message } = await req.json()

        const response = await runAgent(message)

        return Response.json({
            response
        })

    } catch (error) {
        console.error(error)

        return Response.json(
            { error: "Error" },
            { status: 500 }
        )
    }
}