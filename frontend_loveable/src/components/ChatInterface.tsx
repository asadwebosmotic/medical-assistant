import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: 'high' | 'medium' | 'low';
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<string>;
}

export const ChatInterface = ({ onSendMessage }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I've analyzed your blood test results. I can help explain your findings, answer questions about specific values, or discuss next steps. What would you like to know?",
      timestamp: new Date(),
      confidence: 'high'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await onSendMessage(input.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        confidence: 'high'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        confidence: 'low'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Medical AI Assistant</h2>
        <p className="text-muted-foreground">Ask me anything about your report</p>
        <div className="flex items-center justify-center space-x-2 text-sm text-success">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span>Online</span>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="bg-gradient-card border-primary/20">
        <div className="h-96 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-primary/20' 
                    : 'bg-accent/20'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-primary" />
                  ) : (
                    <Bot className="w-4 h-4 text-accent" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <div className={`flex items-center justify-between mt-2 text-xs ${
                    message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.type === 'assistant' && message.confidence && (
                      <span className={`px-2 py-1 rounded-full ${
                        message.confidence === 'high' ? 'text-success' : 
                        message.confidence === 'medium' ? 'text-warning' : 'text-destructive'
                      }`}>
                        {message.confidence === 'high' ? 'High confidence' : 
                         message.confidence === 'medium' ? 'Medium confidence' : 'Low confidence'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading Message */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-[85%]">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-card border border-border rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex space-x-3">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your report..."
                className="min-h-[50px] max-h-32 resize-none bg-background border-border"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="lg"
              className="px-6 shadow-glow-primary"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </Card>

      {/* Quick Questions */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Quick Questions:</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "What does my high cholesterol level mean?",
            "Should I be concerned about these results?",
            "What lifestyle changes do you recommend?",
            "When should I schedule a follow-up?"
          ].map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setInput(question)}
              className="text-xs hover:bg-primary/10 hover:border-primary/30"
              disabled={isLoading}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};