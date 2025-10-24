import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-card/50 to-accent/20 backdrop-blur-xl border border-primary/30 p-12 md:p-16 shadow-elegant animate-fade-in">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Start Your Free Analysis</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Ready to Understand Your{" "}
                <span className="gradient-text">Medical Reports?</span>
              </h2>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of users who trust Meddy for clear, AI-powered medical insights. 
                No credit card required.
              </p>

              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Button
                  variant="hero"
                  size="xl"
                  className="group"
                  onClick={() => navigate('/analysis')}
                >
                  Get Started For Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                {/* <Button variant="glass" size="xl"> */}
                  {/* Schedule Demo */}
                {/* </Button> */}
              </div>

              <div className="pt-8 text-sm text-muted-foreground">
                ✓ Free to start · ✓ No credit card required · ✓ HIPAA compliant
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;