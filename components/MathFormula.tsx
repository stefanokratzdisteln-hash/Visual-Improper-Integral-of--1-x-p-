import React from 'react';

interface MathFormulaProps {
  p: number;
}

export const MathFormula: React.FC<MathFormulaProps> = ({ p }) => {
  return (
    <div className="flex justify-center items-center py-4 bg-gray-50 rounded-lg mb-4 border border-gray-100">
      <div className="text-2xl font-serif italic text-gray-800">
        f(x) = 
        <span className="inline-flex flex-col items-center align-middle mx-2 relative top-[-4px]">
          <span className="border-b border-gray-800 w-full text-center block px-1">1</span>
          <span className="block text-center">x<sup className="text-sm ml-0.5 not-italic text-geoBlue font-bold">{p.toFixed(2)}</sup></span>
        </span>
      </div>
    </div>
  );
};
