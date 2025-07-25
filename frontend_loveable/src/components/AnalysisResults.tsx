import { CheckCircle, AlertCircle, Clock, Download, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface AnalysisResultsProps {
  analysisData: {
    response: string;
    status: string;
  };
  onStartChat: () => void;
}

interface HealthMetric {
  name: string;
  value: string;
  range: string;
  status: 'normal' | 'elevated' | 'high' | 'low';
  description: string;
}

// Mock data parser - in real app this would parse the AI response
const parseAnalysisResponse = (response: string): {
  overallAssessment: string;
  metrics: HealthMetric[];
  keyFindings: string[];
  recommendations: string[];
} => {
  // This is a simplified parser - you'd implement proper parsing based on your AI response format
  return {
    overallAssessment: "Your blood work shows mostly normal results with a few areas that need attention. Your cholesterol levels are slightly elevated, which is common and manageable with lifestyle changes.",
    metrics: [
      {
        name: "Total Cholesterol",
        value: "245 mg/dL",
        range: "< 200 mg/dL",
        status: "elevated",
        description: "Your cholesterol is moderately elevated. This increases your risk of heart disease, but it's very manageable with diet changes, exercise, and possibly medication if your doctor recommends it."
      },
      {
        name: "HDL (Good) Cholesterol", 
        value: "52 mg/dL",
        range: "> 40 mg/dL (men), > 50 mg/dL (women)",
        status: "normal",
        description: "Your 'good' cholesterol is in a healthy range. HDL helps remove bad cholesterol from your arteries, so this is protective for your heart health."
      },
      {
        name: "LDL (Bad) Cholesterol",
        value: "165 mg/dL", 
        range: "< 100 mg/dL",
        status: "high",
        description: "Your 'bad' cholesterol is elevated. This is the type that can build up in your arteries. Your doctor may recommend lifestyle changes or medication to bring this down."
      }
    ],
    keyFindings: [
      "Your kidney function is excellent with normal creatinine levels",
      "Liver enzymes are within normal range, indicating good liver health",
      "Blood sugar levels are normal, showing good glucose control",
      "HDL (good) cholesterol is at a protective level"
    ],
    recommendations: [
      "Discuss cholesterol management with your doctor",
      "Consider dietary changes (reduce saturated fats)",
      "Increase physical activity if possible", 
      "Follow up in 3-6 months to monitor progress"
    ]
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal': return 'text-success';
    case 'elevated': return 'text-warning';
    case 'high': return 'text-destructive';
    case 'low': return 'text-destructive';
    default: return 'text-muted-foreground';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'normal': return 'bg-success/20 text-success';
    case 'elevated': return 'bg-warning/20 text-warning';
    case 'high': return 'bg-destructive/20 text-destructive';
    case 'low': return 'bg-destructive/20 text-destructive';
    default: return 'bg-muted/20 text-muted-foreground';
  }
};

export const AnalysisResults = ({ analysisData, onStartChat }: AnalysisResultsProps) => {
  const parsedData = parseAnalysisResponse(analysisData.response);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-700">
      {/* Analysis Complete Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Analysis Complete • Report processed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Processing time: 2.3s
        </p>
      </div>

      {/* Main Title */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Your Medical Report Analysis</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Here's a comprehensive breakdown of your medical report in easy-to-understand language.
        </p>
      </div>

      {/* Overall Assessment */}
      <Card className="bg-gradient-card p-6 border-primary/20">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground mb-3">Overall Health Assessment</h2>
            <p className="text-foreground leading-relaxed">{parsedData.overallAssessment}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 bg-success/20 text-success rounded-full text-sm">Kidney Function: Normal</span>
              <span className="px-3 py-1 bg-success/20 text-success rounded-full text-sm">Liver Function: Normal</span>
              <span className="px-3 py-1 bg-warning/20 text-warning rounded-full text-sm">Cholesterol: Elevated</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Health Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        {parsedData.metrics.map((metric, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{metric.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(metric.status)}`}>
                  {metric.status === 'normal' ? 'Normal' : metric.status === 'elevated' ? 'Elevated' : metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Your Value:</span>
                  <span className={`font-semibold ${getStatusColor(metric.status)}`}>{metric.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Normal Range:</span>
                  <span className="text-sm text-foreground">{metric.range}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">{metric.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Important Findings */}
      <Card className="p-6 bg-gradient-to-br from-destructive/5 to-warning/5 border-destructive/20">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-destructive/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground mb-3">Important Findings</h2>
            <div className="bg-destructive/10 rounded-xl p-4 mb-4">
              <h3 className="font-medium text-destructive mb-2">Elevated Cholesterol Levels</h3>
              <p className="text-foreground text-sm">
                Your total cholesterol (245 mg/dL) and LDL cholesterol (165 mg/dL) are both above recommended levels. 
                This increases your cardiovascular risk but is very manageable with proper treatment.
              </p>
            </div>
            <div className="bg-warning/10 rounded-xl p-4">
              <h3 className="font-medium text-warning mb-2">Recommended Actions</h3>
              <ul className="space-y-1 text-sm text-foreground">
                {parsedData.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-warning mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-success" />
          <span>What's Going Well</span>
        </h2>
        <div className="grid gap-3">
          {parsedData.keyFindings.map((finding, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-foreground">{finding}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Section */}
      <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 text-center">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Have Questions About Your Results?</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Our AI medical assistant is ready to answer any specific questions you have about your report. 
            Get personalized explanations and guidance based on your results.
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <Button onClick={onStartChat} size="lg" className="shadow-glow-primary">
              Start Chat for Questions
            </Button>
            <Button variant="outline" size="lg">
              Download Report
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Available 24/7 • Instant responses • Personalized to your report
          </p>
        </div>
      </Card>

      {/* Medical Disclaimer */}
      <Card className="p-6 bg-warning/5 border-warning/20">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-warning mb-2">Medical Disclaimer</h3>
            <p className="text-sm text-foreground leading-relaxed">
              This AI analysis is for informational purposes only and should not replace professional medical advice. 
              Always consult with qualified healthcare providers for medical decisions and treatment plans. 
              The interpretations provided are based on general medical knowledge and may not account for your complete medical history.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};