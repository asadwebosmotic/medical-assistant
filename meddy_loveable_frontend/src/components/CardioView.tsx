import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, HeartPulse, TrendingUp, TrendingDown } from 'lucide-react';

export interface CardioData {
  overview?: string;
  abnormalParameters?: Array<{ 
    name: string; 
    value: string; 
    range: string; 
    status: string; 
    description: string; 
    insight?: string;
    patientInsight?: string;
  }>;
  theGoodNews?: string;
  clearNextSteps?: string;
  whenToWorry?: string;
  meddysTake?: string;
}

interface CardioViewProps {
  initialData?: CardioData | null;
  loading?: boolean;
  patientName?: string;
}

const renderMarkdownText = (text: string) => {
  if (!text) return null;
  return text
    .split('\n')
    .map((line, index) => {
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

const CardioView: React.FC<CardioViewProps> = ({ initialData, loading, patientName }) => {
  const [data, setData] = useState<CardioData | null>(initialData ?? null);
  const [internalLoading, setInternalLoading] = useState(false);
  const effectiveLoading = loading ?? internalLoading;

  useEffect(() => {
    if (initialData !== undefined) {
      console.log('CardioView: Received initial data:', initialData);
      setData(initialData);
      return; // parent controls data
    }
    
    // Only fetch if no initial data was provided
    const fetchCardio = async () => {
      setInternalLoading(true);
      try {
        console.log('CardioView: Fetching data from API...');
        
        const response = await fetch(`${import.meta.env.VITE_RENDER_BACKEND_URL}/cardio_view`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('CardioView: Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('CardioView: API Error:', errorText);
          throw new Error(`Failed to load cardio view: ${response.status}`);
        }
        
        const json = await response.json();
        console.log('CardioView: Response data:', json);
        
        setData(json?.structured_data || json || {});
      } catch (error) {
        console.error('CardioView: Error fetching cardio data:', error);
        setData(null);
      } finally {
        setInternalLoading(false);
      }
    };
    
    fetchCardio();
  }, [initialData]);

  if (effectiveLoading) {
    return (
      <div className="min-h-screen w-full bg-background font-inter flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-text-secondary">Loading Cardio View...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen w-full bg-background font-inter flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-text-secondary">No cardio data available.</div>
          <div className="text-sm text-text-muted">Please upload a report first and ensure it contains cardiac parameters.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background font-inter">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="bg-gradient-to-r from-medical-primary/10 to-medical-accent/10 rounded-2xl p-6 border border-medical-primary/20">
          <h1 className="text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
            <HeartPulse className="w-7 h-7 text-medical-primary" /> Cardio View
          </h1>
                      <p className="text-xl text-text-secondary">
              Hello {patientName || "Patient"}, your cardiac analysis is ready! Here's a focused breakdown of your heart-related parameters.
            </p>
        </div>

        {data.overview && (
          <div className="bg-card rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-medical-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-medical-primary" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">Cardiac Overview</h2>
            </div>
            <div className="text-text-secondary leading-relaxed">
              {renderMarkdownText(data.overview)}
            </div>
          </div>
        )}

        {data.abnormalParameters && data.abnormalParameters.length > 0 && (
          <div className="bg-card rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-medical-primary/10 rounded-lg flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-medical-primary" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">Cardiac Parameters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.abnormalParameters.map((param, index) => (
                <div key={index} className="bg-card-hover rounded-2xl p-6 shadow-md border border-border hover:border-medical-primary/30 hover:shadow-lg transition">
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
                  <p className="text-sm text-text-secondary leading-relaxed">{param.description}</p>
                  {/* Patient's Insight */}
                  {(param.insight || param.patientInsight) && (
                    <div className="mt-3 p-3 bg-medical-primary/5 rounded-lg border border-medical-primary/20">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        <strong className="font-semibold text-text-primary">Patient's Insight:</strong> {param.insight || param.patientInsight}
                      </p>
                    </div>
                  )}
                  
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-3 ${getStatusBadgeClass(param.status)}`}>
                    {param.status === 'normal' ? 'Normal' : param.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(data.theGoodNews || data.clearNextSteps || data.whenToWorry) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {data.theGoodNews && (
              <div className="bg-card rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-medical-success" />
                  <h2 className="text-xl font-semibold text-text-primary">What Looks Good</h2>
                </div>
                <div className="text-text-secondary leading-relaxed">
                  {renderMarkdownText(data.theGoodNews)}
                </div>
              </div>
            )}
            {(data.clearNextSteps || data.whenToWorry) && (
              <div className="bg-card rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-status-elevated" />
                  <h2 className="text-xl font-semibold text-text-primary">Actions & Attention</h2>
                </div>
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  {data.clearNextSteps && (
                    <div>
                      <h4 className="font-medium text-text-primary mb-2">Recommended Actions</h4>
                      {renderMarkdownText(data.clearNextSteps)}
                    </div>
                  )}
                  {data.whenToWorry && (
                    <div>
                      <h4 className="font-medium text-text-primary mb-2">When to Seek Medical Attention</h4>
                      {renderMarkdownText(data.whenToWorry)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {data.meddysTake && (
          <div className="bg-gradient-to-r from-medical-primary/5 to-medical-accent/5 rounded-2xl p-6 border border-medical-primary/20">
            <h3 className="font-semibold text-medical-primary mb-3">Meddy's Honest Take</h3>
            <div className="text-text-secondary leading-relaxed font-semibold">
              {renderMarkdownText(data.meddysTake)}
            </div>
          </div>
        )}

        {/* Medical Disclaimer - same as Analysis UI */}
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
      </div>
    </div>
  );
};

export default CardioView;