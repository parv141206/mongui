import React from "react";
import Image from "next/image";

export default function SimpleCard({
  title,
  description,
  doodle,
}: {
  title: string;
  description: string;
  doodle?: string;
}) {
  return (
    <div className="transform rounded-xl border border-white/50 p-6 backdrop-blur-lg transition-transform hover:scale-105">
      {doodle && (
        <div className="relative mb-4 h-40 w-full rounded-lg bg-white/10 p-2">
          <Image
            src={"/assets/CardImg.jpeg"} // Local image path from the public folder
            alt={title}
            layout="fill"
            objectFit="contain"
            className="rounded-lg" // Optional: round the corners for aesthetics
          />
        </div>
      )}
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-gray-300">{description}</p>
    </div>
  );
}
