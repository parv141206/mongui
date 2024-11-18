"use client";
import { generateController } from "@/lib/controllers/generateController";
import React from "react";

export default function CreateController() {
  console.log(generateController("insert", { modelName: "Users" }, "function"));
  return (
    <div className="flex h-screen items-center justify-center bg-black text-3xl text-white">
      <div>Work in progress, stay tuned! 🐱‍🏍</div>
    </div>
  );
}
