import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { DataPoint } from '../types';

interface FunctionGraphProps {
  data: DataPoint[];
  domainX: [number, number];
  domainY: [number, number];
  showIntegral: boolean;
}

export const FunctionGraph: React.FC<FunctionGraphProps> = ({ data, domainX, domainY, showIntegral }) => {
  
  // Custom Tick for Axes to look more like scientific software
  const CustomTick = (props: any) => {
    const { x, y, payload, vertical } = props;
    if (payload.value === 0) return null; // Don't show 0 on axis to avoid overlap with origin

    return (
      <text 
        x={x} 
        y={y} 
        dy={vertical ? 0 : 16} 
        dx={vertical ? -10 : 0} 
        textAnchor={vertical ? "end" : "middle"} 
        fill="#94a3b8" 
        fontSize={12}
        fontFamily="sans-serif"
      >
        {payload.value}
      </text>
    );
  };

  return (
    <div className="w-full h-full select-none cursor-crosshair bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          
          {/* Main Axes Lines (Visual only, to emphasize x=0 and y=0) */}
          <ReferenceLine x={0} stroke="#334155" strokeWidth={2} />
          <ReferenceLine y={0} stroke="#334155" strokeWidth={2} />

          {/* Integral Start Line */}
          {showIntegral && (
            <ReferenceLine x={1} stroke="#10b981" strokeDasharray="3 3" label={{ value: "x=1", fill: "#10b981", fontSize: 12, position: 'insideTopLeft' }} />
          )}

          <XAxis 
            type="number" 
            dataKey="x" 
            domain={domainX} 
            allowDataOverflow={true}
            tickCount={11}
            stroke="transparent" // Hide the default bounding box line
            tick={(props) => <CustomTick {...props} vertical={false} />}
          />
          <YAxis 
            type="number" 
            domain={domainY} 
            allowDataOverflow={true}
            tickCount={11}
            stroke="transparent"
            tick={(props) => <CustomTick {...props} vertical={true} />}
          />
          
          <Tooltip 
            cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                // Find the y payload
                const yPayload = payload.find(p => p.dataKey === 'y');
                const val = yPayload?.value;
                
                if (val === null || val === undefined) return null;
                return (
                  <div className="bg-slate-800 text-white text-xs p-2 rounded shadow-lg opacity-90 font-mono">
                    <div>x: {Number(label).toFixed(3)}</div>
                    <div>y: {Number(val).toFixed(3)}</div>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Area under curve for integral visualization */}
          {showIntegral && (
            <Area
              type="monotone"
              dataKey="areaY"
              fill="#10b981" // Greenish
              fillOpacity={0.2}
              stroke="transparent"
              isAnimationActive={false}
              connectNulls={false}
            />
          )}

          <Line
            type="monotone" // smooth curve
            dataKey="y"
            stroke="#615efc" // GeoBlue
            strokeWidth={3}
            dot={false}
            isAnimationActive={false} // Performance for slider
            connectNulls={false} // Crucial: Don't connect lines across the asymptote
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};