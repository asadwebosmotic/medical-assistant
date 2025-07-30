import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, TrendingUp, TrendingDown, MessageSquare } from 'lucide-react';

interface AnalysisResultsProps {
  analysisData: any;
  onStartChat: () => void;
  onNewAnalysis: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysisData, onStartChat, onNewAnalysis }) => {
  if (!analysisData) return null;

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'normal':
        return <CheckCircle className="w-4 h-4 text-status-normal" />;
      case 'elevated':
      case 'high':
        return <TrendingUp className="w-4 h-4 text-status-high" />;
      case 'low':
        return <TrendingDown className="w-4 h-4 text-status-low" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-status-elevated" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'normal':
        return 'status-normal';
      case 'elevated':
        return 'status-elevated';
      case 'high':
        return 'status-high';
      case 'low':
        return 'status-low';
      default:
        return 'status-elevated';
    }
  };

  const renderMarkdownText = (text: string) => {
    if (!text) return null;
    
    // Simple markdown parsing for bold text and line breaks
    return text
      .split('\n')
      .map((line, index) => {
        // Handle bold text
        const boldRegex = /\*\*(.*?)\*\*/g;
        const parts = line.split(boldRegex);
        
        return (
          <p key={index} className="mb-2">
            {parts.map((part, partIndex) => 
              partIndex % 2 === 1 ? (
                <strong key={partIndex} className="font-semibold text-text-primary">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      });
  };

  // Extract patient name from analysis data
  const getPatientName = () => {
    const greeting = analysisData?.greeting || "";
    const match = greeting.match(/Hello\s+(Mr\.|Ms\.|Mrs\.)?\s*([A-Za-z\s]+),/i);
    return match ? match[0].replace('Hello ', '').replace(',', '') : "Patient";
  };

  return (
    <div className="min-h-screen w-full bg-background font-inter">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Dynamic Greeting */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-medical-success" />
              <span className="text-sm font-medium text-medical-success">Analysis Complete</span>
              <span className="text-sm text-text-muted">
                Report processed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </span>
            </div>
            <Button onClick={onNewAnalysis} variant="secondary" className="font-medium">
              New Analysis
            </Button>
          </div>
          
          <div className="bg-gradient-to-r from-medical-primary/10 to-medical-accent/10 rounded-2xl p-6 border border-medical-primary/20">
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              Hello {getPatientName()},
            </h1>
            <p className="text-xl text-text-secondary">
              Your medical report analysis is ready! Here's a comprehensive breakdown in easy-to-understand language.
            </p>
          </div>
        </div>

        {/* Overall Health Assessment */}
        {analysisData.overview && (
          <div className="bg-card rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-medical-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-medical-primary" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">Overall Health Assessment</h2>
            </div>
            <div className="text-text-secondary leading-relaxed">
              {renderMarkdownText(analysisData.overview)}
            </div>
            
            {/* Status badges for key findings */}
            {analysisData.abnormalParameters && (
              <div className="flex flex-wrap gap-2 mt-4">
                {analysisData.abnormalParameters.slice(0, 3).map((param: any, index: number) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(param.status)}`}
                  >
                    {param.name}: {param.status === 'normal' ? 'Normal' : param.status}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Abnormal Parameters */}
        {analysisData.abnormalParameters && analysisData.abnormalParameters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysisData.abnormalParameters.map((param: any, index: number) => (
              <div key={index} className="bg-card rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-text-primary">{param.name}</h3>
                  {getStatusIcon(param.status)}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Your Value:</span>
                    <span className="font-medium text-text-primary">{param.value}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Normal Range:</span>
                    <span className="text-text-secondary">{param.range}</span>
                  </div>
                </div>
                
                <p className="text-sm text-text-secondary leading-relaxed">
                  {param.description}
                </p>
                
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-3 ${getStatusBadgeClass(param.status)}`}>
                  {param.status === 'normal' ? 'Normal' : param.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Key Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* What's Going Well */}
          {analysisData.theGoodNews && (
            <div className="bg-card rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-medical-success" />
                <h2 className="text-xl font-semibold text-text-primary">What's Going Well</h2>
              </div>
              <div className="text-text-secondary leading-relaxed">
                {renderMarkdownText(analysisData.theGoodNews)}
              </div>
            </div>
          )}

          {/* Areas for Attention */}
          {(analysisData.clearNextSteps || analysisData.whenToWorry) && (
            <div className="bg-card rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-status-elevated" />
                <h2 className="text-xl font-semibold text-text-primary">Areas for Attention</h2>
              </div>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                {analysisData.clearNextSteps && (
                  <div>
                    <h4 className="font-medium text-text-primary mb-2">Recommended Actions</h4>
                    {renderMarkdownText(analysisData.clearNextSteps)}
                  </div>
                )}
                {analysisData.whenToWorry && (
                  <div>
                    <h4 className="font-medium text-text-primary mb-2">When to Seek Medical Attention</h4>
                    {renderMarkdownText(analysisData.whenToWorry)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Meddy's Take - moved here after Areas for Attention */}
        {analysisData.meddysTake && (
          <div className="bg-gradient-to-r from-medical-primary/5 to-medical-accent/5 rounded-2xl p-6 border border-medical-primary/20">
            <h3 className="font-semibold text-medical-primary mb-3">Meddy's Honest Take</h3>
            <div className="text-text-secondary leading-relaxed font-semibold">
              {renderMarkdownText(analysisData.meddysTake)}
            </div>
          </div>
        )}

        {/* Medical Disclaimer - moved after Meddy's Take */}
        <div className="bg-medical-warning/5 border border-medical-warning/20 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-medical-warning mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-medical-warning mb-2">Medical Disclaimer</h3>
              <div className="text-text-secondary leading-relaxed font-semibold">
                This AI analysis is for informational purposes only and should not replace professional medical advice. 
                Always consult with qualified healthcare providers for medical decisions and treatment plans. 
                The interpretations provided are based on general medical knowledge and may not account for your complete medical history.
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section - remains at the end */}
        <div className="bg-gradient-to-r from-medical-primary/5 to-medical-accent/5 border border-medical-primary/20 rounded-2xl p-8 text-center">
          <MessageSquare className="w-12 h-12 text-medical-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Have Questions About Your Results?
          </h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Our AI medical assistant is ready to answer any specific questions you have about your 
            report. Get personalized explanations and guidance based on your results.
          </p>
          <Button onClick={onStartChat} variant="medical" size="lg">
            Start Chat for Questions
          </Button>
          <p className="text-sm text-text-muted mt-3">
            Available 24/7 • Instant responses • Personalized to your report
          </p>
        </div>

      </div>
    </div>
  );
};

export default AnalysisResults;