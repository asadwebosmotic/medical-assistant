import { FileText, Image, MessageSquare, Heart, Shield, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "PDF Report Analysis",
    description: "Upload any medical report in PDF format and get instant, comprehensive AI-powered explanations.",
    color: "from-primary to-primary-glow",
  },
  {
    icon: Image,
    title: "Medical Imaging",
    description: "Analyze X-rays, MRIs, CT scans in JPG, PNG, or DICOM format with advanced AI vision technology.",
    color: "from-accent to-primary",
  },
  {
    icon: MessageSquare,
    title: "Interactive Chat",
    description: "Ask follow-up questions and get personalized responses about your medical reports in real-time.",
    color: "from-primary-glow to-accent",
  },
  {
    icon: Heart,
    title: "Cardio Analysis",
    description: "Specialized cardiovascular analysis with detailed insights into heart health and related metrics.",
    color: "from-destructive/80 to-primary",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your medical data is encrypted and protected with enterprise-grade security standards.",
    color: "from-primary to-secondary",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get comprehensive analysis in seconds, not days. No waiting, no appointments needed.",
    color: "from-accent to-primary-glow",
  },
];

const Features = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Powerful Features for{" "}
            <span className="gradient-text">Better Healthcare</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to understand your medical reports and make informed health decisions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-card cursor-pointer animate-scale-in p-6"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10 space-y-4">
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} p-0.5`}>
                  <div className="w-full h-full rounded-lg bg-card flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;