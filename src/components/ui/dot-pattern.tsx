import { useId } from "react";
import { cn } from "@/lib/utils";

interface DotPatternProps {
  width?: number; // Use number type for width and height
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number; // Circle radius
  className?: string;
  [key: string]: any;
}

export function DotPattern({
  width = 10,
  height = 10,
  x = 0,
  y = 0,
  cx = width / 2, // Center circle horizontally
  cy = height / 2, // Center circle vertically
  cr = Math.min(width, height) / 4, // Default radius based on size
  className,
  ...props
}: DotPatternProps) {
  const id = useId();

  // Calculate the number of circles based on width and height
  const numCirclesX = Math.ceil(100 / width); // Adjust for desired density
  const numCirclesY = Math.ceil(100 / height); // Adjust for desired density

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-white/30",
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
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          {/* Render circles in a grid */}
          {Array.from({ length: numCirclesX * numCirclesY }).map((_, index) => {
            const circleX = (index % numCirclesX) * width + cx; // Calculate X position
            const circleY = Math.floor(index / numCirclesX) * height + cy; // Calculate Y position

            return <circle key={index} cx={circleX} cy={circleY} r={cr} />;
          })}
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}

export default DotPattern;
