import React from 'react';

const MeddyLogo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-medical-primary rounded-lg flex items-center justify-center glow-effect">
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-medical-primary rounded-full"></div>
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold text-text-primary">Meddy</h1>
        <p className="text-xs text-text-secondary">AI Medical Analysis</p>
      </div>
    </div>
  );
};

export default MeddyLogo;