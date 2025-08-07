import React, { useState } from 'react';
import MeddyLogo from './MeddyLogo';
import Navigation from './Navigation';
import UploadSection from './UploadSection';
import AnalysisResults from './AnalysisResults';
import ChatInterface from './ChatInterface';

type ActiveTab = 'upload' | 'analysis' | 'chat';

// Move ChatMessage type here for sharing with ChatInterface
export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const MeddyApp = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('upload');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Persist chat messages across tab switches
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    type: 'ai',
    content: "Hello! I've analyzed your blood test results. I can help explain your findings, answer questions about specific values, or discuss next steps. What would you like to know?",
    timestamp: new Date(),
  }]);

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
    setActiveTab('analysis');
  };

  const handleStartChat = () => {
    setActiveTab('chat');
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  const handleNewAnalysis = () => {
    setAnalysisData(null);
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen w-full bg-background font-inter overflow-hidden">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <MeddyLogo />
            <Navigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
              analysisComplete={!!analysisData}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8 overflow-hidden">
        {activeTab === 'upload' && (
          <UploadSection
            onAnalysisComplete={handleAnalysisComplete}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
        
        {activeTab === 'analysis' && analysisData && (
          <AnalysisResults
            analysisData={analysisData}
            onStartChat={handleStartChat}
            onNewAnalysis={handleNewAnalysis}
          />
        )}
        
        {activeTab === 'chat' && analysisData && (
          <ChatInterface
            analysisData={analysisData}
            messages={messages}
            setMessages={setMessages}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-text-muted">
            <a href="https://webosmotic.com/?referral=meddy_tool" target="_blank" rel="noopener noreferrer" className="footer-link">
              @2025 WebOsmotic Private Limited. All Rights Reserved.
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MeddyApp;