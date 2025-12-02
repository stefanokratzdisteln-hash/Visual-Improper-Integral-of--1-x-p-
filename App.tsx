import React, { useState, useMemo } from 'react';
import { FunctionGraph } from './components/FunctionGraph';
import { DraggablePanel } from './components/DraggablePanel';
import { MathFormula } from './components/MathFormula';
import { generateFunctionData } from './utils/mathUtils';

const App: React.FC = () => {
  // State for the exponent p
  const [p, setP] = useState<number>(0.5); // Default to 0.5 to show the divergence issue
  const [showIntegral, setShowIntegral] = useState<boolean>(false);
  
  // State for zoom/domain
  const [zoom, setZoom] = useState<number>(10); 

  // Memoize data calculation
  const data = useMemo(() => {
    return generateFunctionData(p, -zoom, zoom, 400);
  }, [p, zoom]);

  const domainX: [number, number] = [-zoom, zoom];
  const domainY: [number, number] = [-zoom, zoom];

  // Calculate Integral Value for display
  const integralValue = useMemo(() => {
    if (p <= 1) return "Diverges (∞)";
    const val = 1 / (p - 1);
    return val.toFixed(4);
  }, [p]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-50">
      
      {/* Background Grid/Graph Area */}
      <div className="absolute inset-0">
        <FunctionGraph 
          data={data} 
          domainX={domainX} 
          domainY={domainY}
          showIntegral={showIntegral}
        />
      </div>

      {/* Floating UI Panel */}
      <DraggablePanel initialX={40} initialY={40} title="Function Parameters">
        
        <MathFormula p={p} />
        
        <div className="space-y-6">
          {/* Slider Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm text-gray-600 font-medium">
              <label htmlFor="p-slider">Exponent (p)</label>
              <span className="font-mono bg-blue-50 text-geoBlue px-2 py-0.5 rounded border border-blue-100">
                {p.toFixed(2)}
              </span>
            </div>
            
            <input
              id="p-slider"
              type="range"
              min="-2"
              max="4"
              step="0.1"
              value={p}
              onChange={(e) => setP(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-geoBlue focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            
            <div className="flex justify-between text-xs text-gray-400 font-mono">
              <span>-2.0</span>
              <span>1.0</span>
              <span>4.0</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Quick Sets</span>
            <div className="grid grid-cols-4 gap-2">
              {[0.5, 1, 1.5, 2].map((val) => (
                <button
                  key={val}
                  onClick={() => setP(val)}
                  className={`px-2 py-1.5 text-xs font-medium rounded border transition-colors
                    ${p === val 
                      ? 'bg-geoBlue text-white border-geoBlue shadow-sm' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 my-4"></div>

          {/* Integral Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Improper Integral</span>
              <button 
                onClick={() => setShowIntegral(!showIntegral)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${showIntegral ? 'bg-emerald-500' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showIntegral ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            {showIntegral && (
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 text-sm">
                <div className="flex justify-between items-center mb-1">
                   <span className="font-serif italic text-emerald-800">∫<sub>1</sub><sup>∞</sup> f(x) dx = </span>
                   <span className="font-bold font-mono text-emerald-700">{integralValue}</span>
                </div>
                {p <= 1 && p > 0 && (
                   <p className="text-xs text-emerald-600 mt-2">
                     For 0 &lt; p &le; 1, the "tail" of the curve is too thick, making the area infinite.
                   </p>
                )}
                {p > 1 && (
                   <p className="text-xs text-emerald-600 mt-2">
                     Converges to 1/(p-1).
                   </p>
                )}
                 {p <= 0 && (
                   <p className="text-xs text-emerald-600 mt-2">
                     Diverges rapidly as f(x) does not approach 0.
                   </p>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 leading-relaxed">
              Drag p to see how the exponent affects convergence. Notice the transition at p=1.
            </p>
          </div>
        </div>

      </DraggablePanel>
    </div>
  );
};

export default App;