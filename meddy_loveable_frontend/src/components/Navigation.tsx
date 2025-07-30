import React from 'react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: 'upload' | 'analysis' | 'chat';
  onTabChange: (tab: 'upload' | 'analysis' | 'chat') => void;
  analysisComplete: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, analysisComplete }) => {
  const tabs = [
    { id: 'upload', label: 'Upload', enabled: true },
    { id: 'analysis', label: 'Analysis', enabled: analysisComplete },
    { id: 'chat', label: 'Chat', enabled: analysisComplete },
  ] as const;

  return (
    <nav className="flex space-x-1 bg-card rounded-xl p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => tab.enabled && onTabChange(tab.id)}
          disabled={!tab.enabled}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-medium transition-all",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            activeTab === tab.id
              ? "bg-medical-primary text-medical-primary-foreground shadow-lg"
              : "text-text-secondary hover:text-text-primary hover:bg-card-hover"
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;