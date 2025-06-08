"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ChatMessage {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatResponse {
  keywords: string[]
  response: string
  emoji?: string
}

const chatResponses: ChatResponse[] = [
  {
    keywords: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"],
    response: "Hello! Welcome to UltraXas Store 👋 I'm UltraBot, your friendly assistant. How can I help you today?",
    emoji: "👋",
  },
  {
    keywords: ["download", "install", "get app", "how to download"],
    response: "You can download apps from the main Apps page 📥 Just click on any app and hit the Download button!",
    emoji: "📥",
  },
  {
    keywords: ["theme", "color", "dark mode", "appearance", "style"],
    response: "You can change your theme in Settings 🎨 We have Google Colors, Dark Mode, Orange Neon, and more!",
    emoji: "🎨",
  },
  {
    keywords: ["upload", "add app", "publish", "submit"],
    response: "To upload an app, go to the Upload tab 📤 Fill in the details and submit your APK file!",
    emoji: "📤",
  },
  {
    keywords: ["help", "support", "assistance", "guide"],
    response: "I'm here to guide you! 🤖 Ask me about downloading apps, changing themes, uploading, or anything else!",
    emoji: "🤖",
  },
  {
    keywords: ["settings", "preferences", "configuration", "options"],
    response: "Check out the Settings page ⚙️ You can customize themes, notifications, layout, and much more!",
    emoji: "⚙️",
  },
  {
    keywords: ["apps", "applications", "software", "programs"],
    response:
      "Browse our Apps section 📱 We have productivity tools, games, utilities, and more from the UltraXas team!",
    emoji: "📱",
  },
  {
    keywords: ["games", "gaming", "play", "entertainment"],
    response: "Check out our Games section 🎮 We have action, puzzle, strategy games and more!",
    emoji: "🎮",
  },
  {
    keywords: ["about", "info", "information", "what is", "ultraxas"],
    response:
      "UltraXas Store is a private app store for the UltraXas Dev team 🏢 We distribute our custom apps securely!",
    emoji: "🏢",
  },
  {
    keywords: ["bye", "goodbye", "see you", "farewell", "exit"],
    response: "See you again soon! 👋 Feel free to come back anytime you need help!",
    emoji: "👋",
  },
  {
    keywords: ["thanks", "thank you", "appreciate", "grateful"],
    response: "You're very welcome! 😊 Happy to help anytime!",
    emoji: "😊",
  },
  {
    keywords: ["problem", "issue", "error", "bug", "not working"],
    response:
      "Sorry to hear you're having issues! 🔧 Try refreshing the page or check the Settings for troubleshooting options.",
    emoji: "🔧",
  },
  {
    keywords: ["search", "find", "looking for"],
    response: "Use the search bar on any page 🔍 You can search by app name, description, or category!",
    emoji: "🔍",
  },
  {
    keywords: ["new", "latest", "recent", "updates"],
    response: "Check the home page for the latest apps! 🆕 New uploads appear in the Featured section.",
    emoji: "🆕",
  },
  {
    keywords: ["admin", "administrator", "management"],
    response: "Admin controls are available in Settings 🔐 Enter the admin password to access advanced features.",
    emoji: "🔐",
  },
  {
    keywords: ["manasseh", "ceo", "owner", "creator"],
    response:
      "Manasseh Amoako is the CEO and creator of UltraXas Store! 👨‍💻 You can support his work by buying him a coffee!",
    emoji: "👨‍💻",
  },
]

const defaultResponse = {
  response:
    "I'm not sure about that, but I'm here to help! 🤔 Try asking about downloads, themes, uploads, or settings.",
  emoji: "🤔",
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("ultraxas_chat_history")
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })))
      } catch (error) {
        console.error("Failed to load chat history:", error)
      }
    } else {
      // Show welcome message for new users
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        text: "Hi! I'm UltraBot 🤖 Welcome to UltraXas Store! How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ultraxas_chat_history", JSON.stringify(messages))
    }
  }, [messages])

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const findBestResponse = (userInput: string): ChatResponse => {
    const input = userInput.toLowerCase().trim()

    // Find the response with the most keyword matches
    let bestMatch = defaultResponse
    let maxMatches = 0

    for (const response of chatResponses) {
      const matches = response.keywords.filter((keyword) => input.includes(keyword.toLowerCase())).length

      if (matches > maxMatches) {
        maxMatches = matches
        bestMatch = response
      }
    }

    return bestMatch
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(
      () => {
        const response = findBestResponse(userMessage.text)
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          text: response.response,
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)

        // Show notification if chat is closed
        if (!isOpen) {
          setHasNewMessage(true)
        }
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setHasNewMessage(false)
    }
  }

  const clearHistory = () => {
    setMessages([])
    localStorage.removeItem("ultraxas_chat_history")

    // Add welcome message back
    const welcomeMessage: ChatMessage = {
      id: "welcome-new",
      text: "Chat history cleared! 🧹 How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-16 sm:bottom-20 right-2 sm:right-4 z-50">
        <Button
          onClick={toggleChat}
          size="icon"
          className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
          }`}
        >
          {isOpen ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <div className="relative">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              {hasNewMessage && (
                <div className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 sm:bottom-36 right-2 sm:right-4 z-50 w-[calc(100vw-1rem)] max-w-80 sm:w-80 sm:max-w-96">
          <Card className="shadow-2xl border-2 animate-in slide-in-from-bottom-5 duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-br from-google-blue to-google-green rounded-full flex items-center justify-center">
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm">UltraBot</h3>
                    <p className="text-xs text-muted-foreground hidden sm:block">Always here to help!</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  >
                    🗑️
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleChat}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Messages Area */}
              <div className="h-60 sm:h-80 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-3 bg-muted/20">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === "user" ? "bg-primary" : "bg-gradient-to-br from-google-blue to-google-green"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="h-3 w-3 text-white" />
                      ) : (
                        <Bot className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div
                      className={`max-w-[75%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-background border"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-google-blue to-google-green flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <div className="bg-background border rounded-lg p-3">
                      <div className="flex items-center gap-1">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div
                            className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">UltraBot is typing...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={!inputValue.trim() || isTyping}
                    className="flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {["Help", "Download", "Themes", "Upload"].map((action) => (
                    <Badge
                      key={action}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80 text-xs"
                      onClick={() => {
                        setInputValue(action.toLowerCase())
                        setTimeout(handleSendMessage, 100)
                      }}
                    >
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
