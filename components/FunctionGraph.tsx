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
  limitA: number;
  mode: 'infinite' | 'zero';
  showIntegral: boolean;
}

export const FunctionGraph: React.FC<FunctionGraphProps> = ({ data, domainX, domainY, limitA, mode, showIntegral }) => {
  
  // Custom Tick for Axes
  const CustomTick = (props: any) => {
    const { x, y, payload, vertical } = props;
    if (payload.value === 0) return null;

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

  // Determine shading color based on standard "good/bad" logic implicitly handled in parent, 
  // but here we just use the GeoGebra-ish style.
  const areaColor = "#10b981"; // Emerald green

  return (
    <div className="w-full h-full select-none cursor-crosshair bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          
          <ReferenceLine x={0} stroke="#334155" strokeWidth={2} />
          <ReferenceLine y={0} stroke="#334155" strokeWidth={2} />

          {/* Limit A Line */}
          {showIntegral && (
            <ReferenceLine 
              x={limitA} 
              stroke="#64748b" 
              strokeDasharray="5 5" 
              label={{ 
                value: `a=${limitA}`, 
                fill: "#64748b", 
                fontSize: 12, 
                position: 'insideTopLeft' 
              }} 
            />
          )}

          <XAxis 
            type="number" 
            dataKey="x" 
            domain={domainX} 
            allowDataOverflow={true}
            tickCount={11}
            stroke="transparent"
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
                const yPayload = payload.find(p => p.dataKey === 'y');
                const val = yPayload?.value;
                if (val === null || val === undefined) return null;
                return (
                  <div className="bg-slate-800 text-white text-xs p-2 rounded shadow-lg opacity-90 font-mono">
                    <div>x: {Number(label).toFixed(3)}</div>
                    <div>f(x): {Number(val).toFixed(3)}</div>
                  </div>
                );
              }
              return null;
            }}
          />

          {showIntegral && (
            <Area
              type="monotone"
              dataKey="areaY"
              fill={areaColor}
              fillOpacity={0.3}
              stroke="transparent"
              isAnimationActive={false}
              connectNulls={false}
            />
          )}

          <Line
            type="monotone"
            dataKey="y"
            stroke="#615efc"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};