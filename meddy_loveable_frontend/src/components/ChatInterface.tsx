import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from './MeddyApp';

interface ChatInterfaceProps {
  analysisData: any;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ analysisData, messages, setMessages }) => {
  // Remove local messages state
  // const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Remove initial greeting useEffect
  // useEffect(() => { ... }, []);


  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('user_input', inputValue);

      const response = await fetch(`${import.meta.env.RENDER_BACKEND_URL}/followup/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.response) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
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

  const generateSuggestedQuestions = () => {
    const baseQuestions = [
      "Should I be concerned about these results?",
      "What lifestyle changes do you recommend?",
      "When should I follow up with my doctor?",
    ];

    const dynamicQuestions = [];

    // Generate dynamic questions based on abnormal parameters
    if (analysisData?.abnormalParameters && analysisData.abnormalParameters.length > 0) {
      const params = analysisData.abnormalParameters;
      
      // Add questions for specific abnormal values
      params.slice(0, 2).forEach((param: any) => {
        if (param.status === 'high' || param.status === 'elevated') {
          dynamicQuestions.push(`What does my ${param.name.toLowerCase()} level mean? Should I be worried?`);
          dynamicQuestions.push(`How can I improve my ${param.name.toLowerCase()} levels?`);
        } else if (param.status === 'low') {
          dynamicQuestions.push(`Why is my ${param.name.toLowerCase()} low and how can I improve it?`);
        }
      });
    }

    // Combine dynamic and base questions, prioritizing dynamic ones
    const allQuestions = [...dynamicQuestions, ...baseQuestions];
    return allQuestions.slice(0, 3); // Show 3 suggested questions
  };

  return (
    <div className="w-full h-[calc(100vh-150px)] bg-background font-inter">
      <div className="max-w-7xl mx-auto h-[85vh] flex">
      {/* Sidebar - Report Summary */}
      <div className="w-80 bg-card rounded-2xl p-6 mr-6 overflow-y-auto custom-scrollbar">
        <h3 className="font-semibold text-text-primary mb-4">Report Summary</h3>
        <p className="text-sm text-text-muted mb-4">
          Reference your analyzed report during the conversation
        </p>
        
        {/* Key Values */}
        <div className="space-y-3">
          <div className="bg-card-hover rounded-lg p-3">
            <h4 className="text-sm font-medium text-text-primary mb-2">Blood Test Results</h4>
            <div className="text-xs text-text-secondary">July 20, 2025</div>
          </div>
          
          {analysisData?.abnormalParameters && (
            <div className="space-y-2">
              {analysisData.abnormalParameters.slice(0, 4).map((param: any, index: number) => (
                <div key={index} className="bg-card-hover rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-text-primary">{param.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      param.status === 'high' ? 'bg-status-high/10 text-status-high' :
                      param.status === 'low' ? 'bg-status-low/10 text-status-low' :
                      'bg-status-elevated/10 text-status-elevated'
                    }`}>
                      {param.status === 'high' ? 'High' : param.status === 'low' ? 'Low' : 'Elevated'}
                    </span>
                  </div>
                  <div className="text-xs text-text-secondary">
                    <div>Your Value: {param.value}</div>
                    <div>Normal: {param.range}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Report summary text */}
          <div className="bg-card-hover rounded-lg p-3">
            <p className="text-xs text-text-secondary leading-relaxed">
              Your report shows elevated cholesterol and low hemoglobin levels 
              that may require attention.
            </p>
          </div>
          
          {/* Suggested questions */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-text-primary">Suggested Questions</h4>
            {generateSuggestedQuestions().map((question, index) => (
              <button
                key={index}
                onClick={() => setInputValue(question)}
                className="w-full text-left text-xs text-text-secondary hover:text-text-primary bg-card-hover hover:bg-medical-primary/10 rounded-lg p-2 transition-colors"
              >
                💡 {question}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-card rounded-2xl flex flex-col">
        {/* Chat Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-medical-primary rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-text-primary">Medical AI Assistant</h2>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="w-2 h-2 bg-medical-success rounded-full"></div>
                Online
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-medical-primary' 
                  : 'bg-card-hover'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-medical-primary" />
                )}
              </div>
              
              <div className={`max-w-lg ${message.type === 'user' ? 'text-right' : ''}`}> 
                <div className={`inline-block p-4 rounded-2xl ${
                  message.type === 'user' 
                    ? 'chat-user' 
                    : 'chat-ai'
                }`}>
                  <p className="text-text-primary whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className="text-xs text-text-muted mt-1">
                  {formatTime(message.timestamp)}
                  {message.type === 'ai' && (
                    <span className="ml-2 text-medical-success"></span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-card-hover rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-medical-primary" />
              </div>
              <div className="chat-ai p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-medical-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-medical-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-medical-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-text-secondary text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-border">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your report..."
              className="flex-1 px-4 py-3 bg-input rounded-xl border border-input-border focus:border-input-focus focus:ring-2 focus:ring-medical-primary/20 text-text-primary placeholder-text-muted"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              variant="medical"
              size="icon"
              className="px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-text-muted mt-2">
            Available 24/7 • Instant responses • Personalized to your report
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ChatInterface;