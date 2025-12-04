import { DataPoint } from '../types';

/**
 * Generates data points for f(x) = 1 / x^p
 * Handles asymptotes by inserting nulls and clamping extremely large values for display purposes.
 */
export const generateFunctionData = (
  p: number, 
  xMin: number, 
  xMax: number, 
  resolution: number = 400,
  integralMode: 'infinite' | 'zero' = 'infinite',
  limitA: number = 1
): DataPoint[] => {
  const data: DataPoint[] = [];
  const step = (xMax - xMin) / resolution;
  
  for (let i = 0; i <= resolution; i++) {
    const x = xMin + i * step;
    
    // Floating point correction
    const cleanX = Math.round(x * 1000) / 1000;

    // Handle the singularity/asymptote at x=0
    // If p > 0, 1/x^p is undefined/infinite at 0 -> Asymptote
    // If p <= 0, 1/x^p becomes x^(-p) (positive power) -> Defined at 0 (usually 0, or 1 if p=0)
    if (Math.abs(cleanX) < 1e-9) { 
      if (p > 0) {
        // Asymptote behavior: break the line
        data.push({ x: 0, y: null, areaY: null });
      } else {
        // Defined behavior for p <= 0
        // If p=0, 1/x^0 = 1. If p < 0 (e.g. -2), 1/x^-2 = x^2, at 0 it is 0.
        const val = (p === 0) ? 1 : 0;
        
        // Determine area shading at x=0
        let areaY: number | null = null;
        // For Type II (0 to a), we include 0 if a >= 0
        if (integralMode === 'zero' && limitA >= 0) {
            areaY = val;
        }
        // For Type I (a to inf), we include 0 only if a <= 0 (uncommon context but possible)
        else if (integralMode === 'infinite' && limitA <= 0) {
            areaY = val;
        }

        data.push({ x: 0, y: val, areaY });
      }
      continue;
    }

    let y: number | null = null;
    let areaY: number | null = null;
    
    try {
       // Calculate y = 1/x^p
       // Note: if x < 0 and p is fractional, Math.pow returns NaN, which is correct (undefined domain)
       const denominator = Math.pow(cleanX, p);
       
       if (!isNaN(denominator) && denominator !== 0) {
         y = 1 / denominator;
       }
       
       // If y became Infinity or NaN, set to null
       if (!isFinite(y as number)) {
         y = null;
       }

       // --- Area Shading Logic ---
       // Generally we visualize the integral on positive x-axis for this problem context
       if (cleanX > 0) {
         if (integralMode === 'infinite') {
           // Integral from a to Infinity
           if (cleanX >= limitA && y !== null) {
             areaY = y;
           }
         } else {
           // Integral from 0 to a
           if (cleanX <= limitA && y !== null) {
             areaY = y;
           }
         }
       }
       
       // Cleanup area if calculation failed
       if (y === null) areaY = null;

    } catch (e) {
      y = null;
      areaY = null;
    }
    
    data.push({ x: cleanX, y, areaY });
  }

  return data;
};