import { Upload, Scan, MessageSquare, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Report",
    description: "Simply drag and drop your medical report PDF or imaging files. We support PDF, JPG, PNG, and DICOM formats.",
    step: "01",
  },
  {
    icon: Scan,
    title: "AI Analysis",
    description: "Our advanced AI instantly analyzes your report, extracting key information and medical insights.",
    step: "02",
  },
  {
    icon: MessageSquare,
    title: "Ask Questions",
    description: "Chat with our AI to get clarifications, ask follow-up questions, and understand complex medical terms.",
    step: "03",
  },
  {
    icon: CheckCircle,
    title: "Get Insights",
    description: "Receive comprehensive, easy-to-understand explanations in plain English to make informed decisions.",
    step: "04",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            How <span className="gradient-text">Meddy Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get medical insights in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="relative group">
                {/* Step number */}
                <div className="text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors mb-4">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-glow p-0.5 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                      <step.icon className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;