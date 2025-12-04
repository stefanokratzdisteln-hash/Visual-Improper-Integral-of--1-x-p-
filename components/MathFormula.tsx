import React from 'react';

interface MathFormulaProps {
  p: number;
  limitA: number;
  mode: 'infinite' | 'zero';
}

export const MathFormula: React.FC<MathFormulaProps> = ({ p, limitA, mode }) => {
  return (
    <div className="flex justify-center items-center py-4 bg-gray-50 rounded-lg mb-4 border border-gray-100 select-none">
      <div className="text-2xl font-serif text-gray-800 flex items-center">
        {/* Integral Symbol */}
        <div className="relative mx-2 h-12 flex items-center justify-center">
           <span className="text-4xl italic font-light font-serif">∫</span>
           {/* Limits */}
           <div className="absolute top-[-0.2rem] right-[-0.8rem] text-xs font-sans font-bold text-gray-600">
             {mode === 'infinite' ? '∞' : limitA}
           </div>
           <div className="absolute bottom-[-0.2rem] right-[-0.6rem] text-xs font-sans font-bold text-gray-600">
             {mode === 'infinite' ? limitA : '0'}
           </div>
        </div>

        {/* Integrand */}
        <div className="flex items-center ml-3">
          <span className="italic mr-2">x</span>
          <sup className="text-sm -ml-1 text-geoBlue font-bold">{-p.toFixed(2)}</sup>
        </div>
        
        <span className="italic ml-2 text-lg">dx</span>
      </div>
    </div>
  );
};