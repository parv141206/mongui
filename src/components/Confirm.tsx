import React from "react";

export default function Confirm({ message }: { message: string }) {
  return (
    <div className="absolute z-20 flex h-screen w-screen items-center justify-center bg-black/50">
      <div className="rounded-lg bg-white p-5">
        <p className="text-black">{message}</p>
      </div>
    </div>
  );
}
