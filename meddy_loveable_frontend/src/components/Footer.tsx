import { Heart } from "lucide-react";

const Footer = () => {
  const links = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Pricing", href: "#pricing" },
      { name: "FAQ", href: "#faq" },
    ],
    company: [
      { name: "About", href: "#about" },
      { name: "Blog", href: "#blog" },
      { name: "Careers", href: "#careers" },
      { name: "Contact", href: "#contact" },
    ],
    legal: [
      { name: "Privacy", href: "#privacy" },
      { name: "Terms", href: "#terms" },
      { name: "Security", href: "#security" },
      { name: "HIPAA", href: "#hipaa" },
    ],
  };

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Full-width disclaimer row */}
          <div className="md:col-span-2 lg:col-span-4">
            <div className="rounded-xl border border-border/50 bg-card/30 px-5 py-4 text-sm text-muted-foreground shadow-sm w-full">
              <span className="font-semibold text-yellow-400">Medical Disclaimer:</span>
              <span>
                {" "}Meddy provides AI-generated analysis for informational purposes only and may contain inaccuracies.
                It should not be considered a substitute for professional medical advice, diagnosis, or treatment.
                Always consult a qualified healthcare provider for medical decisions and treatment plans. 
                The interpretations provided are based on general medical knowledge and image data alone,
                and may not reflect your full medical history, clinical findings, or context.
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 grid grid-cols-1 md:grid-cols-3 items-start md:items-center gap-4">
          <a
            href="https://webosmotic.com/?referral=meddy_tool"
            target="_blank"
            rel="noopener noreferrer"
            title="Custom Website And Mobile Application Development Company - WebOsmotic"
            className="flex items-center gap-1 text-sm text-muted-foreground"
          >
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> by WebOsmotic
          </a>
          <p className="text-sm text-muted-foreground md:justify-self-center md:mt-1">
            <a
              href="https://webosmotic.com/?referral=meddy_tool" 
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link underline decoration-primary underline-offset-4 hover:underline-offset-6 text-primary hover:text-primary-glow transition-colors"
            >
              @2025 WebOsmotic Private Limited. All Rights Reserved.
            </a>
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground md:justify-self-end">
            <span>Educational tool</span>
            <span className="mx-1 text-primary">•</span>
            <span>Not a medical device</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;