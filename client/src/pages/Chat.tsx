import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Settings, Menu } from "lucide-react";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface ChatMessage {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  aiModel?: string;
  timestamp: Date;
}

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState(14);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user settings
  useEffect(() => {
    if (user?.id) {
      // TODO: Load user settings from database
      setFontSize(14);
    }
  }, [user?.id]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user?.id) return;

    // Add user message to UI
    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // TODO: Send message to backend for processing
      // The backend will:
      // 1. Save message to database
      // 2. Orchestrate multiple AI responses
      // 3. Apply metacognition analysis
      // 4. Return synthesized response

      // Placeholder response
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Resposta do assistente será processada aqui...",
        aiModel: "multiple",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white" style={{ fontSize: `${fontSize}px` }}>
      {/* Header */}
      <div className="bg-gray-950 border-b border-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">PCCΩ+ Assistant V7.0</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">Bem-vindo ao PCCΩ+ Assistant</p>
              <p className="text-sm">Comece uma conversa digitando sua pergunta abaixo</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-xs lg:max-w-md px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-blue-900 text-white rounded-lg rounded-tr-none"
                    : "bg-gray-900 text-gray-100 rounded-lg rounded-tl-none border border-gray-800"
                }`}
              >
                {msg.aiModel && msg.role === "assistant" && (
                  <p className="text-xs text-gray-400 mb-1">via {msg.aiModel}</p>
                )}
                <Streamdown>{msg.content}</Streamdown>
                <p className="text-xs text-gray-500 mt-2">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </Card>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-gray-900 text-gray-100 rounded-lg rounded-tl-none border border-gray-800 px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin" />
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-950 border-t border-gray-800 p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Digite sua pergunta..."
            className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
