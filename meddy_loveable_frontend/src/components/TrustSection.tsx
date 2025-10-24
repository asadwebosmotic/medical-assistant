import { Shield, Lock, Clock, Users } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    title: "Medical Grade Security",
    description: "HIPAA compliant with end-to-end encryption",
  },
  {
    icon: Lock,
    title: "Private & Confidential",
    description: "Your data is never shared or sold",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access your reports anytime, anywhere",
  },
  {
    icon: Users,
    title: "Trusted by Thousands",
    description: "Join 10,000+ users worldwide",
  },
];

const TrustSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Your Health Data is{" "}
              <span className="gradient-text">Safe & Secure</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We take your privacy seriously with enterprise-level security and compliance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPoints.map((point, index) => (
              <div
                key={index}
                className="text-center space-y-4 p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
                  <point.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{point.title}</h3>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;