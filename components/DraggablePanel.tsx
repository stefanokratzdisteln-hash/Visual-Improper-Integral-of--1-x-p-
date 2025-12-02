import React, { useState, useEffect, useRef } from 'react';

interface DraggablePanelProps {
  children: React.ReactNode;
  initialX?: number;
  initialY?: number;
  title?: string;
}

export const DraggablePanel: React.FC<DraggablePanelProps> = ({ 
  children, 
  initialX = 20, 
  initialY = 20,
  title = "Control"
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only drag if clicking the header
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      
      // Simple bounds checking (keep mostly on screen)
      const maxX = window.innerWidth - 50;
      const maxY = window.innerHeight - 50;
      
      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  return (
    <div 
      ref={panelRef}
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 50
      }}
      className="w-80 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-shadow duration-200"
    >
      {/* Draggable Header */}
      <div 
        onMouseDown={handleMouseDown}
        className={`bg-gray-100/50 px-4 py-3 border-b border-gray-200 cursor-move flex items-center justify-between select-none ${isDragging ? 'cursor-grabbing' : ''}`}
      >
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};
