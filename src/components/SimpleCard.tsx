import React from "react";

export default function SimpleCard({
  title,
  description,
  doodle,
}: {
  title: string;
  description: string;
  doodle?: string | JSX.Element; // Allow string or JSX Element
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-white/50 p-6 backdrop-blur-lg transition-transform hover:scale-105 md:flex-row">
      {/* Doodle/Image Section */}
      {doodle && (
        <div className="mb-4 flex h-32 w-32 flex-shrink-0 items-center justify-center md:mb-0 md:mr-6">
          {typeof doodle === "string" ? (
            <img
              src={doodle}
              alt={title}
              className="h-full w-full object-contain"
            />
          ) : (
            doodle // Render the SVG directly if it's a JSX Element
          )}
        </div>
      )}

      {/* Text Section */}
      <div className="flex-grow">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-gray-300">{description}</p>
      </div>
    </div>
  );
}
