import React, { useState } from 'react';
import { calculateContrastRatio } from '../../lib/contrastRatio';

export const ContrastCheckerPage: React.FC = () => {
  const [foreground, setForeground] = useState('#1A1D23');
  const [background, setBackground] = useState('#F7F7F5');

  const result = calculateContrastRatio(foreground, background);

  const getPassFailBadge = (pass: boolean) => {
    return pass ? (
      <span className="px-2 py-0.5 bg-severity-pass text-white text-[10px] font-bold rounded uppercase tracking-wider">
        Pass
      </span>
    ) : (
      <span className="px-2 py-0.5 bg-severity-critical text-white text-[10px] font-bold rounded uppercase tracking-wider">
        Fail
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12 flex flex-col gap-8">
      <div>
        <h1 className="font-sans text-3xl font-bold text-ink mb-2">Contrast Checker</h1>
        <p className="font-sans text-sm text-minor-grey">
          Verify text color contrast compliance directly using relative luminance formulas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Colors selector panel */}
        <div className="bg-white border border-border-grey rounded-md p-6 flex flex-col gap-6">
          <h2 className="font-sans text-sm font-bold text-ink uppercase tracking-wider">Configure Colors</h2>
          
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="fg-color" className="block font-sans text-xs font-bold text-ink mb-2 uppercase tracking-wide">
                Foreground Color (Text)
              </label>
              <div className="flex gap-2">
                <input
                  id="fg-color-picker"
                  type="color"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                  className="w-12 h-10 border border-border-grey rounded cursor-pointer p-0 bg-transparent"
                  aria-label="Foreground color picker"
                />
                <input
                  id="fg-color"
                  type="text"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                  placeholder="#1A1D23"
                  className="flex-grow px-3 py-2 border border-border-grey rounded bg-paper/20 focus:outline-none focus:ring-2 focus:ring-signal-blue font-mono text-sm text-ink"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bg-color" className="block font-sans text-xs font-bold text-ink mb-2 uppercase tracking-wide">
                Background Color
              </label>
              <div className="flex gap-2">
                <input
                  id="bg-color-picker"
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-12 h-10 border border-border-grey rounded cursor-pointer p-0 bg-transparent"
                  aria-label="Background color picker"
                />
                <input
                  id="bg-color"
                  type="text"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="#F7F7F5"
                  className="flex-grow px-3 py-2 border border-border-grey rounded bg-paper/20 focus:outline-none focus:ring-2 focus:ring-signal-blue font-mono text-sm text-ink"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="flex flex-col gap-6">
          {/* Big Ratio Display */}
          <div className="bg-white border border-border-grey rounded-md p-6 text-center">
            <h3 className="font-sans text-xs font-bold text-minor-grey uppercase tracking-wider mb-2">Contrast Ratio</h3>
            <div className="font-mono text-5xl font-bold text-ink">
              {result.ratio}:1
            </div>
          </div>

          {/* Pass Fail Grid */}
          <div className="bg-white border border-border-grey rounded-md p-6">
            <h3 className="font-sans text-xs font-bold text-ink uppercase tracking-wider mb-4">WCAG Compliance</h3>
            <div className="flex flex-col gap-3 font-sans text-sm">
              <div className="flex items-center justify-between border-b border-border-grey/30 pb-2">
                <span className="font-medium">Normal Text (AA) <span className="text-xs text-minor-grey font-normal">&ge;4.5:1</span></span>
                {getPassFailBadge(result.normalAA.pass)}
              </div>
              <div className="flex items-center justify-between border-b border-border-grey/30 pb-2">
                <span className="font-medium">Normal Text (AAA) <span className="text-xs text-minor-grey font-normal">&ge;7.0:1</span></span>
                {getPassFailBadge(result.normalAAA.pass)}
              </div>
              <div className="flex items-center justify-between border-b border-border-grey/30 pb-2">
                <span className="font-medium">Large Text (AA) <span className="text-xs text-minor-grey font-normal">&ge;3.0:1</span></span>
                {getPassFailBadge(result.largeAA.pass)}
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="font-medium">Large Text (AAA) <span className="text-xs text-minor-grey font-normal">&ge;4.5:1</span></span>
                {getPassFailBadge(result.largeAAA.pass)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="bg-white border border-border-grey rounded-md p-6">
        <h2 className="font-sans text-sm font-bold text-ink uppercase tracking-wider mb-4">Live Preview</h2>
        
        <div 
          className="border border-border-grey rounded p-6 flex flex-col gap-4 transition-all"
          style={{ backgroundColor: background }}
        >
          <div style={{ color: foreground }}>
            <h3 className="font-sans text-lg font-bold mb-1">Large Text Sample (Header)</h3>
            <p className="font-sans text-sm leading-relaxed">
              This is normal body text size (16px). Color contrast checker ensures readable elements for users with visual impairments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContrastCheckerPage;
