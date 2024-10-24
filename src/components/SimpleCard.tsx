import React from "react";
import Image from "next/image";

export default function SimpleCard({
  title,
  description,
  doodle,
}: {
  title: string;
  description: string;
  doodle?: string | JSX.Element;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-white/50 p-6 backdrop-blur-lg transition-transform hover:scale-105 md:flex-row">
      {doodle && (
        <div className="relative mb-4 h-32 w-32 flex-shrink-0 md:mb-0 md:mr-6">
          {typeof doodle === "string" ? (
            <Image
              src={doodle}
              alt={title}
              width={128}
              height={128}
              className="object-contain"
              priority
            />
          ) : (
            doodle
          )}
        </div>
      )}

      <div className="flex-grow text-center md:text-left">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-gray-300">{description}</p>
      </div>
    </div>
  );
}
