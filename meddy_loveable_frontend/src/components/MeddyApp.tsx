import React, { useState } from 'react';
import MeddyLogo from './MeddyLogo';
import Navigation from './Navigation';
import UploadSection from './UploadSection';
import AnalysisResults from './AnalysisResults';
import ChatInterface from './ChatInterface';
import CardioView from './CardioView';

type ActiveTab = 'upload' | 'analysis' | 'chat' | 'cardio';

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
  const [cardioComplete, setCardioComplete] = useState(false);

  // Extract patient name from analysis data
  const getPatientName = () => {
    const greeting = analysisData?.greeting || "";
    const match = greeting.match(/Hello\s+(Mr\.|Ms\.|Mrs\.)?\s*([A-Za-z\s]+),/i);
    return match ? match[0].replace('Hello ', '').replace(',', '') : "Patient";
  };

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

  const handleOpenCardio = async () => {
    setIsLoading(true);
    try {
      console.log('Making request to:', `${import.meta.env.VITE_RENDER_BACKEND_URL}/cardio_view`);
      
      const response = await fetch(`${import.meta.env.VITE_RENDER_BACKEND_URL}/cardio_view`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to load cardio view: ${response.status}`);
      }
      
      const json = await response.json();
      console.log('Cardio response:', json);
      
      const cardioData = json?.structured_data || json;
      setAnalysisData((prev: any) => ({ ...prev, cardio: cardioData }));
      setCardioComplete(true);
      setActiveTab('cardio');
    } catch (error) {
      console.error('Cardio view error:', error);
      // Navigate to cardio; component will self-fetch
      setAnalysisData((prev: any) => ({ ...prev, cardio: null }));
      setActiveTab('cardio');
    } finally {
      setIsLoading(false);
    }
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
              cardioComplete={cardioComplete}
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
            onOpenCardio={handleOpenCardio}
            isLoading={isLoading}
          />
        )}
        
        {activeTab === 'chat' && analysisData && (
          <ChatInterface
            analysisData={analysisData}
            messages={messages}
            setMessages={setMessages}
          />
        )}

        {activeTab === 'cardio' && (
          <CardioView 
            initialData={analysisData?.cardio} 
            loading={isLoading} 
            patientName={getPatientName()}
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