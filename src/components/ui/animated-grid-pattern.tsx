"use client";
import React, {
  useEffect,
  useId,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: any;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}: GridPatternProps) {
  const id = useId();
  const containerRef = useRef<HTMLElement | null>(null);

  // Memoized state for dimensions to prevent unnecessary re-renders
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Memoized position generator to avoid recreation on every render
  const getPos = useCallback(() => {
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ];
  }, [dimensions, width, height]);

  // Optimized square generation with memoization
  const initialSquares = useMemo(
    () =>
      Array.from({ length: numSquares }, (_, i) => ({
        id: i,
        pos: getPos(),
      })),
    [numSquares, getPos],
  );

  const [squares, setSquares] = useState(initialSquares);

  // Memoized square position update function
  const updateSquarePosition = useCallback(
    (id: number) => {
      setSquares((currentSquares) =>
        currentSquares.map((sq) =>
          sq.id === id ? { ...sq, pos: getPos() } : sq,
        ),
      );
    },
    [getPos],
  );

  // Optimized resize observer effect
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Regenerate squares when dimensions change
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(initialSquares);
    }
  }, [dimensions, initialSquares]);

  return (
    <svg
      // @ts-ignore
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-green-500 stroke-green-300/40",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [x, y], id }, index) => (
          <motion.rect
            key={`${id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              delay: index * 0.1,
              repeatType: "reverse",
            }}
            onAnimationComplete={() => updateSquarePosition(id)}
            width={width - 1}
            height={height - 1}
            x={x * width + 1}
            y={y * height + 1}
            fill="currentColor"
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  );
}

export default GridPattern;
