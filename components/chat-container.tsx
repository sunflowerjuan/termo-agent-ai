"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/language-context";
import { ChatHeader } from "./chat-header";
import { WelcomePanel } from "./welcome-panel";
import { MessageBubble, type Message } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { ChatInput } from "./chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content,
            language,
          }),
        });

        const data = await res.json();

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Agent error:", error);

        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Oops! Something went wrong. Try again please.",
        };

        setMessages((prev) => [...prev, errorMessage]);
      }

      setIsTyping(false);
    },
    [language],
  );

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
  }, []);

  return (
    <div className="flex flex-col h-dvh bg-background">
      <ChatHeader onNewChat={handleNewChat} />

      <div className="flex-1 min-h-0">
        {messages.length === 0 ? (
          <ScrollArea className="h-full">
            <WelcomePanel onSuggestionClick={handleSend} />
          </ScrollArea>
        ) : (
          <ScrollArea ref={scrollRef} className="h-full">
            <div className="py-3 sm:py-4 space-y-0.5 sm:space-y-1 max-w-3xl mx-auto">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          </ScrollArea>
        )}
      </div>

      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
}
