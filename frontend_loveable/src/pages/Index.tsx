import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { AnalysisResults } from '@/components/AnalysisResults';
import { ChatInterface } from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Stethoscope, Loader2, Brain } from 'lucide-react';

type AppState = 'upload' | 'analysis' | 'chat';

interface AnalysisData {
  response: string;
  status: string;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userInput, setUserInput] = useState('Please explain this report.');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "File Required",
        description: "Please upload a medical report PDF first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('user_input', userInput);
      formData.append('medical_history', medicalHistory);

      const response = await fetch('http://localhost:8000/chat/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === 'success') {
        setAnalysisData(data);
        setAppState('analysis');
        toast({
          title: "Analysis Complete",
          description: "Your medical report has been successfully analyzed.",
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed", 
        description: "Unable to analyze your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartChat = () => {
    setAppState('chat');
  };

  const handleSendChatMessage = async (message: string): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('user_input', message);

      const response = await fetch('http://localhost:8000/followup/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === 'success') {
        return data.response;
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  };

  const renderUploadSection = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Stethoscope className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to <span className="text-primary">Meddy</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI Medical Analysis
          </p>
        </div>
      </div>

      {/* Upload Form */}
      <Card className="p-8 bg-gradient-card border-primary/20">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">
            Upload Your Medical Report
          </h2>
          
          <FileUpload 
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onRemoveFile={handleRemoveFile}
          />

          <div className="space-y-4">
            <div>
              <label className="text-foreground font-medium mb-2 block">
                What would you like to know? <span className="text-destructive">*</span>
              </label>
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Please explain this report."
                className="min-h-[60px] bg-background border-border"
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can edit this default question or ask something specific
              </p>
            </div>

            <div>
              <label className="text-foreground font-medium mb-2 block">
                Medical History (Optional)
              </label>
              <Textarea
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="Share any relevant medical history, current medications, or symptoms that might help with the analysis..."
                className="min-h-[100px] bg-background border-border"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Additional context helps provide more personalized insights
              </p>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!selectedFile || !userInput.trim() || isAnalyzing}
            size="lg"
            className="w-full shadow-glow-primary"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Analyzing Report...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                Analyze Report
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">AI-Powered Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Advanced AI interprets your medical reports with high accuracy
          </p>
        </Card>
        
        <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-6 h-6 text-success" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Easy to Understand</h3>
          <p className="text-sm text-muted-foreground">
            Complex medical terms explained in simple, clear language
          </p>
        </Card>
        
        <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Interactive Q&A</h3>
          <p className="text-sm text-muted-foreground">
            Ask follow-up questions and get personalized explanations
          </p>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">Meddy</span>
            <span className="text-sm text-muted-foreground">AI Medical Analysis</span>
          </div>
          
          {appState !== 'upload' && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setAppState('upload')}
                size="sm"
              >
                Upload
              </Button>
              {analysisData && (
                <Button
                  variant="outline"
                  onClick={() => setAppState('analysis')}
                  size="sm"
                >
                  Analysis
                </Button>
              )}
              {appState === 'chat' && (
                <Button
                  variant="outline"
                  onClick={() => setAppState('chat')}
                  size="sm"
                >
                  Chat
                </Button>
              )}
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main>
          {appState === 'upload' && renderUploadSection()}
          {appState === 'analysis' && analysisData && (
            <AnalysisResults
              analysisData={analysisData}
              onStartChat={handleStartChat}
            />
          )}
          {appState === 'chat' && (
            <div className="max-w-4xl mx-auto">
              <ChatInterface onSendMessage={handleSendChatMessage} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;