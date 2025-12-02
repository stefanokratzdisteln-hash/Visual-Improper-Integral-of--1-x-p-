import { DataPoint } from '../types';

/**
 * Generates data points for f(x) = 1 / x^p
 * Handles asymptotes by inserting nulls and clamping extremely large values for display purposes.
 */
export const generateFunctionData = (
  p: number, 
  xMin: number, 
  xMax: number, 
  resolution: number = 200
): DataPoint[] => {
  const data: DataPoint[] = [];
  const step = (xMax - xMin) / resolution;
  
  for (let i = 0; i <= resolution; i++) {
    const x = xMin + i * step;
    
    // Floating point correction
    const cleanX = Math.round(x * 1000) / 1000;

    // Handle the asymptote at x=0
    if (Math.abs(cleanX) < step / 2) {
      data.push({ x: 0, y: null, areaY: null });
      continue;
    }

    let y: number | null = null;
    let areaY: number | null = null;
    
    try {
       const denominator = Math.pow(cleanX, p);
       
       if (!isNaN(denominator) && denominator !== 0) {
         y = 1 / denominator;
       }
       
       // If y became Infinity or NaN (e.g. imaginary), set to null
       if (!isFinite(y as number)) {
         y = null;
       }

       // For the integral visualization from 1 to infinity (or max X)
       // We only populate areaY if x >= 1 and y is valid
       if (cleanX >= 1 && y !== null) {
         areaY = y;
       } else if (cleanX >= 1 && y === null) {
         // Keep area null if y is null
         areaY = null;
       } else {
         // Force area to 0 or null below 1 to prevent shading
         // Using null ensures the area chart doesn't draw a line to 0
         areaY = null;
       }

    } catch (e) {
      y = null;
      areaY = null;
    }

    // Special case: Ensure strictly x=1 starts the area cleanly if the step skipped it slightly
    // but resolution is high enough that this is usually handled by the loop range.
    
    data.push({ x: cleanX, y, areaY });
  }

  return data;
};