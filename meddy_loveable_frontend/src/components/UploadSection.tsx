import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText , Activity, CheckCircle, MessageCircle} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from './ui/card';

interface UploadSectionProps {
  onAnalysisComplete: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ 
  onAnalysisComplete, 
  isLoading, 
  setIsLoading 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [userQuery, setUserQuery] = useState('Please explain this report.');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF medical report to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_input', userQuery);
    formData.append('medical_history', medicalHistory);

    try {
      const response = await fetch(`${import.meta.env.VITE_RENDER_BACKEND_URL}/chat/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.structured_data) {
        onAnalysisComplete(data.structured_data);
        toast({
          title: "Analysis Complete",
          description: "Your medical report has been successfully analyzed.",
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Error processing report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background font-inter">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-text-primary">
          Upload Your Medical Report
        </h1>
        <p className="text-lg text-text-secondary">
          Get instant AI-powered analysis of your medical reports. Upload your PDF and 
          receive comprehensive explanations in plain English.
        </p>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            Medical Report (PDF) *
          </label>

          {/* File Upload Drop Zone Container */}
          <div
            className={`relative upload-border rounded-xl p-8 text-center transition-all overflow-hidden ${
              dragActive ? 'border-medical-primary bg-medical-primary/5' : ''
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Invisible File Input - now ZONE-LIMITED */}
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {/* Visible Upload UI */}
            <div className="z-0 relative space-y-4 pointer-events-none">
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-medical-primary" />
                  <div className="text-left">
                    <p className="font-medium text-text-primary">{file.name}</p>
                    <p className="text-sm text-text-secondary">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-medical-primary mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-text-primary">
                      Drop your PDF here or click to browse
                    </p>
                    <p className="text-sm text-text-secondary">
                      Maximum file size: 10MB
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* File remove button - outside the input trap */}
            {file && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFile(null)}
                className="mt-4 relative z-20"
              >
                Remove File
              </Button>
            )}
          </div>
        </div>

        {/* User Query */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            What would you like to know? *
          </label>
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            className="w-full px-4 py-3 bg-input rounded-xl border border-input-border focus:border-input-focus focus:ring-2 focus:ring-medical-primary/20 text-text-primary placeholder-text-muted"
            placeholder="Please explain this report"
          />
          <p className="text-xs text-text-muted">
            You can edit this default question or ask something specific
          </p>
        </div>

        {/* Medical History */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            Medical History (Optional)
          </label>
          <textarea
            value={medicalHistory}
            onChange={(e) => setMedicalHistory(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-input rounded-xl border border-input-border focus:border-input-focus focus:ring-2 focus:ring-medical-primary/20 text-text-primary placeholder-text-muted resize-none"
            placeholder="Share any relevant medical history, current medications, or symptoms that might help with the analysis..."
          />
          <p className="text-xs text-text-muted">
            Additional context helps provide more personalized insights
          </p>
        </div>

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={!file || isLoading}
          className="w-full"
          variant="medical"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Analyzing Report...
            </div>
          ) : (
            'Analyze Report'
          )}
        </Button>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="p-6 bg-card border-border text-center">
          <div className="w-12 h-12 bg-medical-normal/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-medical-normal" />
          </div>
          <h3 className="font-semibold mb-2">Secure & Private</h3>
          <p className="text-sm text-muted-foreground">
            Your medical data is encrypted and processed securely with HIPAA compliance.
          </p>
        </Card>

        <Card className="p-6 bg-card border-border text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Instant Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Get comprehensive medical report explanations in seconds, not hours.
          </p>
        </Card>

        <Card className="p-6 bg-card border-border text-center">
          <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold mb-2">Ask Questions</h3>
          <p className="text-sm text-muted-foreground">
            Follow up with questions about your results through our AI chat assistant.
           </p>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default UploadSection;