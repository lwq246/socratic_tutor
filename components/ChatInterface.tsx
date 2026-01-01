"use client";

import { useChat } from "ai/react";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ChatInterfaceProps {
  subjectId: string;
}

export default function ChatInterface({ subjectId }: ChatInterfaceProps) {
  const [sessionId, setSessionId] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Ref to track if we have already fetched history to prevent overwriting
  const isHistoryLoaded = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Setup Session ID on Mount
  useEffect(() => {
    setIsMounted(true);
    let id = localStorage.getItem("socratic_session_id");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("socratic_session_id", id);
    }
    setSessionId(id);
  }, []);

  // 2. The Chat Hook
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: "/api/chat",
    // Ensure these are passed in the request body
    body: { subjectId, sessionId },
    // Handle errors gracefully
    onError: (error) => {
      console.error("Stream Error:", error);
    },
  });

  // 3. Fetch History (Once)
  useEffect(() => {
    // Don't fetch if no session, or if already loaded, or if user has started typing/chatting
    if (!sessionId || isHistoryLoaded.current || messages.length > 0) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `/api/history?sessionId=${sessionId}&subjectId=${encodeURIComponent(
            subjectId
          )}`
        );
        const data = await res.json();

        if (data && Array.isArray(data) && data.length > 0) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        isHistoryLoaded.current = true;
      }
    };

    fetchHistory();
  }, [sessionId, subjectId, setMessages, messages.length]);

  // 4. Auto-Scroll logic (Runs on every new message or token)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Loading State for Hydration
  if (!isMounted || !sessionId) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Empty State */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Bot size={64} className="mb-4 text-blue-100 text-slate-200" />
            <p className="text-lg font-medium text-gray-500">
              Start asking about{" "}
              <span className="text-blue-600">{subjectId}</span>
            </p>
          </div>
        )}

        {/* Message List */}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${
              m.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-white"
              }`}
            >
              {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
            </div>

            {/* Bubble */}
            <div
              className={`p-4 rounded-2xl text-sm max-w-[85%] leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200"
              }`}
            >
              {/* Render text, handling newlines */}
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}

        {/* 🚀 VITAL FIX: Explicit "Thinking" Bubble 
            This shows immediately when you hit send, before the server responds. 
        */}
        {isLoading &&
          messages.length > 0 &&
          messages[messages.length - 1].role === "user" && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
                <Bot size={14} />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-gray-50 border border-gray-100 text-gray-400 text-sm flex items-center gap-2">
                <Loader2 className="animate-spin" size={14} />
                <span>Analyzing document...</span>
              </div>
            </div>
          )}

        {/* Invisible div to force scroll to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
          <input
            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            value={input}
            onChange={handleInputChange}
            placeholder={`Ask a question about ${subjectId}...`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl transition-colors shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
