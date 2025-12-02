export interface DataPoint {
  x: number;
  y: number | null;
  areaY?: number | null;
}

export interface GraphBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}