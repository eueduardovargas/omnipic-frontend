'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeSrc?: string;
  afterSrc?: string;
  beforeLabel?: string;
  afterLabel?: string;
  height?: string;
  hideLabels?: boolean;
}

export default function BeforeAfterSlider({
  beforeSrc = 'https://placehold.co/800x600/141414/666666?text=Antes',
  afterSrc = 'https://placehold.co/800x600/141414/7C3AED?text=Depois',
  beforeLabel = 'Antes',
  afterLabel = 'Depois',
  height = 'h-[400px]',
  hideLabels = false,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    },
    [updatePosition]
  );

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      isDragging.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    },
    [updatePosition]
  );

  const handleEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${height} w-full overflow-hidden rounded-card select-none cursor-ew-resize`}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* After image (full width background) */}
      <div className="absolute inset-0">
        <img src={afterSrc} alt={afterLabel} className="w-full h-full object-cover" draggable={false} />
      </div>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={beforeSrc} alt={beforeLabel} className="w-full h-full object-cover" draggable={false} />
      </div>

      {/* Labels */}
      {!hideLabels && (
        <>
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
            {beforeLabel}
          </div>
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
            {afterLabel}
          </div>
        </>
      )}

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
          <GripVertical className="w-5 h-5 text-gray-800" />
        </div>
      </div>
    </motion.div>
  );
}
