'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
  const [isHovering, setIsHovering] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Detect if device is desktop or mobile
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  // Desktop: Hover movement
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDesktop || !isHovering) return;
      updatePosition(e.clientX);
    },
    [isDesktop, isHovering, updatePosition]
  );

  const handleMouseEnter = useCallback(() => {
    if (isDesktop) {
      setIsHovering(true);
    }
  }, [isDesktop]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // Mobile: Touch drag
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isDesktop) return;
      setIsTouching(true);
      isDragging.current = true;
      const clientX = e.touches[0].clientX;
      updatePosition(clientX);
    },
    [isDesktop, updatePosition]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current || isDesktop) return;
      const clientX = e.touches[0].clientX;
      updatePosition(clientX);
    },
    [isDesktop, updatePosition]
  );

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    setIsTouching(false);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${height} w-full overflow-hidden rounded-card select-none ${
        isDesktop ? 'cursor-ew-resize' : 'cursor-grab active:cursor-grabbing'
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        animate={{ scale: isHovering || isTouching ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl"
          animate={{ scale: isHovering || isTouching ? 1.2 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <GripVertical className="w-5 h-5 text-gray-800" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
