"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";

const quickReplies = [
  "What services do you offer?",
  "How long does a project take?",
  "What are your pricing options?",
  "How can I track my project?",
];

const botResponses: Record<string, string> = {
  "what services do you offer?": "We offer Website Development, Mobile App Development, SaaS Development, and Business Automation services. Each can be customized with additional features to match your needs!",
  "how long does a project take?": "Project timelines vary based on complexity. Website Development starts at 7 days, Mobile Apps at 14 days, SaaS at 21 days, and Automation at 10 days. Adding features may extend these timelines slightly.",
  "what are your pricing options?": "Our pricing is transparent! Website Development starts at ₹1 Lakh, Mobile Apps at ₹2 Lakh, SaaS at ₹3 Lakh, and Automation at ₹1.5 Lakh. Add-on features range from ₹4,000 to ₹10,000 each.",
  "how can i track my project?": "Once you submit a booking, you'll get a unique tracking ID. Visit your dashboard to see real-time progress, timeline updates, and communicate with our team!",
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string; time: Date }[]>([
    { role: "bot", text: "Hi! 👋 I'm TechFlow Assistant. How can I help you today?", time: new Date() }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAppStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text?: string) => {
    const msgText = text || message;
    if (!msgText.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: msgText, time: new Date() }]);
    setMessage("");

    setTimeout(() => {
      const lowerText = msgText.toLowerCase();
      let response = "Thanks for your message! Our team will get back to you soon. For immediate assistance, please email support@techflow.com";
      
      for (const [key, value] of Object.entries(botResponses)) {
        if (lowerText.includes(key.split(" ").slice(0, 3).join(" "))) {
          response = value;
          break;
        }
      }

      if (lowerText.includes("hello") || lowerText.includes("hi")) {
        response = `Hello${currentUser ? `, ${currentUser.name}` : ""}! How can I assist you today?`;
      }

      setMessages((prev) => [...prev, { role: "bot", text: response, time: new Date() }]);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">TechFlow Assistant</h3>
                  <p className="text-white/80 text-xs">Always here to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "user" 
                        ? "bg-indigo-100" 
                        : "bg-gradient-to-br from-indigo-500 to-purple-600"
                    }`}>
                      {msg.role === "user" 
                        ? <User className="w-4 h-4 text-indigo-600" />
                        : <Bot className="w-4 h-4 text-white" />
                      }
                    </div>
                    <div className={`rounded-2xl px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-md"
                        : "bg-white shadow-sm rounded-bl-md"
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.role === "user" ? "text-indigo-200" : "text-muted-foreground"}`}>
                        {format(msg.time, "h:mm a")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t bg-white">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSend()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-6 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg flex items-center justify-center z-50 hover:shadow-xl transition-shadow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
