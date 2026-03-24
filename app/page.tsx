import { Providers } from "@/components/providers"
import { ChatContainer } from "@/components/chat-container"

export default function Page() {
  return (
    <Providers>
      <main>
        <ChatContainer />
      </main>
    </Providers>
  )
}
