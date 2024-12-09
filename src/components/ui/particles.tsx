"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

interface MousePosition {
  x: number;
  y: number;
}

// Memoized hook to track mouse position
function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
}

// Optimize hex to RGB conversion
const hexToRgb = (hex: string): number[] => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : [255, 255, 255];
};

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const circlesRef = useRef<any>([]);
  const mousePosition = useMousePosition();
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  
  // Memoize device pixel ratio
  const dpr = useMemo(() => 
    typeof window !== "undefined" ? window.devicePixelRatio : 1, 
  []);

  // Memoize RGB color
  const rgbColor = useMemo(() => hexToRgb(color), [color]);

  // Optimize circle parameter generation
  const circleParams = useCallback(() => {
    const { w, h } = canvasSizeRef.current;
    return {
      x: Math.floor(Math.random() * w),
      y: Math.floor(Math.random() * h),
      translateX: 0,
      translateY: 0,
      size: Math.floor(Math.random() * 2) + size,
      alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
    };
  }, [size]);

  // Optimize canvas initialization
  const initCanvas = useCallback(() => {
    if (!canvasContainerRef.current || !canvasRef.current) return;

    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;
    
    // Reset circles
    circlesRef.current = [];

    // Update canvas size
    canvasSizeRef.current = {
      w: container.offsetWidth,
      h: container.offsetHeight
    };

    // Configure canvas
    canvas.width = canvasSizeRef.current.w * dpr;
    canvas.height = canvasSizeRef.current.h * dpr;
    canvas.style.width = `${canvasSizeRef.current.w}px`;
    canvas.style.height = `${canvasSizeRef.current.h}px`;

    // Get and scale context
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      contextRef.current = ctx;
      
      // Initial particle draw
      for (let i = 0; i < quantity; i++) {
        const circle = circleParams();
        drawCircle(ctx, circle);
        circlesRef.current.push(circle);
      }
    }
  }, [dpr, quantity, circleParams]);

  
  // Optimize drawing and animation
  const animate = useCallback(() => {
    const ctx = contextRef.current;
    const { w, h } = canvasSizeRef.current;

    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Update and draw circles
    circlesRef.current.forEach((circle, i) => {
      // Alpha and edge handling
      const edge = [
        circle.x + circle.translateX - circle.size,
        w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        h - circle.y - circle.translateY - circle.size
      ];

      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = Math.max(0, 
        ((closestEdge - 0) * (1 - 0)) / (20 - 0)
      );

      // Update circle properties
      circle.alpha = remapClosestEdge > 1 
        ? Math.min(circle.alpha + 0.02, circle.targetAlpha)
        : circle.targetAlpha * remapClosestEdge;

      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX += 
        (mouseRef.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
      circle.translateY += 
        (mouseRef.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;

      // Draw circle
      drawCircle(ctx, circle, true);

      // Regenerate out-of-bounds circles
      if (
        circle.x < -circle.size || circle.x > w + circle.size ||
        circle.y < -circle.size || circle.y > h + circle.size
      ) {
        circlesRef.current.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(ctx, newCircle);
        circlesRef.current.push(newCircle);
      }
    });

    window.requestAnimationFrame(animate);
  }, [ease, staticity, vx, vy, circleParams]);

  const drawCircle = useCallback((
    ctx: CanvasRenderingContext2D, 
    circle: any, 
    update = false
  ) => {
    const { x, y, translateX, translateY, size, alpha } = circle;
    
    ctx.save();
    ctx.translate(translateX, translateY);
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(${rgbColor.join(", ")}, ${alpha})`;
    ctx.fill();
    ctx.restore();

    if (!update) {
      circlesRef.current.push(circle);
    }
  }, [rgbColor]);

  useEffect(() => {
    initCanvas();
    const animationFrame = animate();

    const resizeHandler = () => initCanvas();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
            // @ts-ignore
      window.cancelAnimationFrame(animationFrame);
    };
  }, [initCanvas, animate]);


  useEffect(() => {
    initCanvas();
  }, [refresh, initCanvas]);

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};

export default React.memo(Particles);
