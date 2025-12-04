import React, { useState, useMemo } from 'react';
import { FunctionGraph } from './components/FunctionGraph';
import { DraggablePanel } from './components/DraggablePanel';
import { MathFormula } from './components/MathFormula';
import { generateFunctionData } from './utils/mathUtils';

type IntegralMode = 'infinite' | 'zero';

const App: React.FC = () => {
  // --- State ---
  const [p, setP] = useState<number>(0.5); 
  const [limitA, setLimitA] = useState<number>(1);
  const [mode, setMode] = useState<IntegralMode>('infinite');
  const [showIntegral, setShowIntegral] = useState<boolean>(true); // Default to on for this view
  const [zoom, setZoom] = useState<number>(10); 

  // --- Calculations ---
  
  // Memoize graph data calculation
  const data = useMemo(() => {
    return generateFunctionData(p, -zoom, zoom, 500, mode, limitA);
  }, [p, zoom, mode, limitA]);

  const domainX: [number, number] = [-2, 10]; // Adjusted for better view of integrals
  const domainY: [number, number] = [-2, 10];

  // Calculate Integral Value
  const integralResult = useMemo(() => {
    const a = limitA;
    if (mode === 'infinite') {
      // Integral from a to Infinity
      // Converges if p > 1
      if (p <= 1) return { val: "Diverges (∞)", isConvergent: false };
      const val = Math.pow(a, 1 - p) / (p - 1);
      return { val: val.toFixed(4), isConvergent: true };
    } else {
      // Integral from 0 to a
      // Converges if p < 1 (including negative p)
      if (p >= 1) return { val: "Diverges (∞)", isConvergent: false };
      // Formula works for p < 1
      const val = Math.pow(a, 1 - p) / (1 - p);
      return { val: val.toFixed(4), isConvergent: true };
    }
  }, [p, limitA, mode]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-50">
      
      {/* Graph Area */}
      <div className="absolute inset-0">
        <FunctionGraph 
          data={data} 
          domainX={domainX} 
          domainY={domainY}
          limitA={limitA}
          mode={mode}
          showIntegral={showIntegral}
        />
      </div>

      {/* Floating UI Panel */}
      <DraggablePanel initialX={40} initialY={40} title="Improper Integral">
        
        {/* Mode Switcher Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
          <button
            onClick={() => setMode('infinite')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'infinite' 
                ? 'bg-white text-geoBlue shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Type I: ∫ a to ∞
          </button>
          <button
            onClick={() => setMode('zero')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'zero' 
                ? 'bg-white text-geoBlue shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Type II: ∫ 0 to a
          </button>
        </div>

        <MathFormula p={p} limitA={limitA} mode={mode} />
        
        <div className="space-y-6">
          
          {/* Slider for P */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-gray-600 font-medium">
              <label htmlFor="p-slider">Exponent (p)</label>
              <span className="font-mono bg-blue-50 text-geoBlue px-2 py-0.5 rounded border border-blue-100 min-w-[3rem] text-center">
                {p.toFixed(2)}
              </span>
            </div>
            <input
              id="p-slider"
              type="range"
              min="-2"
              max="3"
              step="0.1"
              value={p}
              onChange={(e) => setP(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-geoBlue focus:outline-none"
            />
          </div>

          {/* Slider for A */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-gray-600 font-medium">
              <label htmlFor="a-slider">Limit (a)</label>
              <span className="font-mono bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200 min-w-[3rem] text-center">
                {limitA.toFixed(1)}
              </span>
            </div>
            <input
              id="a-slider"
              type="range"
              min="0.1"
              max="8"
              step="0.1"
              value={limitA}
              onChange={(e) => setLimitA(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-500 focus:outline-none"
            />
          </div>

          <div className="border-t border-gray-100 my-2"></div>

          {/* Result Display */}
          <div className={`rounded-lg p-3 border transition-colors ${
              integralResult.isConvergent 
              ? 'bg-emerald-50 border-emerald-100' 
              : 'bg-orange-50 border-orange-100'
            }`}>
            <div className="flex justify-between items-center mb-1">
               <span className={`font-serif italic text-sm ${integralResult.isConvergent ? 'text-emerald-800' : 'text-orange-800'}`}>
                 Area = 
               </span>
               <span className={`font-bold font-mono ${integralResult.isConvergent ? 'text-emerald-700' : 'text-orange-700'}`}>
                 {integralResult.val}
               </span>
            </div>
            
            <p className={`text-xs mt-2 ${integralResult.isConvergent ? 'text-emerald-600' : 'text-orange-600'}`}>
              {mode === 'infinite' 
                ? (integralResult.isConvergent 
                    ? "Converges because p > 1." 
                    : "Diverges because p ≤ 1 (Tail is too thick).")
                : (integralResult.isConvergent 
                    ? "Converges because p < 1." 
                    : "Diverges because p ≥ 1 (Blows up too fast at 0).")
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
             <input 
               type="checkbox" 
               id="show-area" 
               checked={showIntegral} 
               onChange={(e) => setShowIntegral(e.target.checked)}
               className="rounded text-geoBlue focus:ring-geoBlue"
             />
             <label htmlFor="show-area" className="text-xs text-gray-500 select-none">Show shading region</label>
          </div>

        </div>

      </DraggablePanel>
    </div>
  );
};

export default App;