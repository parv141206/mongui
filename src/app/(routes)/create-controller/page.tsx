"use client";
import InputControllerOptionsForDeleting from "@/components/InputControllerOptionsForDeleting";
import InputControllerOptionsForFetching from "@/components/InputControllerOptionsForFetching";
import InputControllerOptionsForInserting from "@/components/InputControllerOptionsForInserting";
import { generateController } from "@/lib/controllers/generateController";
import gsap from "gsap";
import React, { useEffect, useState } from "react";

export default function CreateController() {
  const [step, setStep] = useState(0);
  const [code, setCode] = useState("");
  console.log(
    generateController(
      "delete",
      { modelName: "User", query: [`name: "parv"`] },
      "function",
    ),
  );
  //console.log(
  //  generateController(
  //    "fetch",
  //    {
  //      modelName: "User",
  //      // findOne: true,
  //      query: { name: "meriMamiTeriMasi" },
  //      // sort: { createdAt: -1 },
  //    },
  //    "function",
  //  ),
  //);
  const [modelName, setModelName] = useState("");
  const [operationType, setOperationType] = useState("");
  useEffect(() => {
    if (step === 1) {
      gsap.fromTo(
        ".operation-type",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
      );
    }
    if (step === 2) {
      gsap.fromTo(
        ".options",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
      );
    }
  }, [step]);

  const chooseModel = () => {
    gsap.to(".input-model", { x: 300, opacity: 0, duration: 0.5 });
    setTimeout(() => setStep(1), 1000);
  };
  const chooseOperation = () => {
    gsap.to(".operation-type", { x: 300, opacity: 0, duration: 0.5 });
    setTimeout(() => setStep(2), 1000);
  };
  return (
    <div className="flex min-h-screen bg-black py-16 text-white">
      <div className="container mx-auto flex flex-col gap-3 p-5">
        <div className="greetings text-6xl">
          Create <span className="text-green-400"> Controllers</span>
        </div>
        <hr className="border border-white" />
        <div className="flex">
          <div className="flex h-full flex-col gap-3 py-5 text-2xl">
            <div
              className={`rounded border-s border-green-800 p-3 ${step === 0 ? "bg-green-400/45" : ""}`}
            >
              Model Name
            </div>
            <div
              className={`rounded border-s border-green-800 p-3 ${step === 1 ? "bg-green-400/45" : ""}`}
            >
              Operation Type
            </div>
            <div
              className={`rounded border-s border-green-800 p-3 ${step === 2 ? "bg-green-400/45" : ""}`}
            >
              Custom Options
            </div>
          </div>
          {step === 0 && (
            <div className="input-model container mx-auto flex w-2/3 cursor-pointer flex-col gap-5 p-10">
              <div className="text-4xl">
                Please enter the name of your model:
              </div>
              <input
                onChange={(e) => setModelName(e.target.value)}
                type="text"
                className="controller-input"
                placeholder="Name"
              />
              <div onClick={chooseModel} className="button">
                Submit
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="operation-type container mx-auto flex w-2/3 flex-col gap-5 p-10">
              <div className="text-4xl">
                Please choose which operation controller do you want:
              </div>
              <div className="flex gap-3 text-2xl">
                <div
                  onClick={() => setOperationType("fetch")}
                  className={` ${operationType === "fetch" ? "rounded-md bg-white text-black" : "hover:text-green-400"} cursor-pointer p-2`}
                >
                  Fetch
                </div>
                <div
                  onClick={() => setOperationType("insert")}
                  className={` ${operationType === "insert" ? "rounded-md bg-white text-black" : "hover:text-green-400"} cursor-pointer p-2`}
                >
                  Insert
                </div>
                <div
                  onClick={() => setOperationType("delete")}
                  className={` ${operationType === "delete" ? "rounded-md bg-white text-black" : "hover:text-green-400"} cursor-pointer p-2`}
                >
                  Delete
                </div>
              </div>
              <button onClick={chooseOperation} className="button">
                Continue
              </button>
            </div>
          )}
          {step === 2 && operationType === "fetch" && (
            <div className="options container mx-auto flex w-2/3 flex-col gap-5 p-10">
              <div className="text-5xl">Customisation</div>

              <InputControllerOptionsForFetching
                setCode={setCode}
                modelName={modelName}
              />

              {code && (
                <div className="rounded-md border border-white/10 bg-slate-900 p-5 text-white">
                  <pre className="code">{code}</pre>
                </div>
              )}
            </div>
          )}
          {step === 2 && operationType === "insert" && (
            <div className="options container mx-auto flex w-2/3 flex-col gap-5 p-10">
              <div className="text-5xl">Customisation</div>

              <InputControllerOptionsForInserting
                setCode={setCode}
                modelName={modelName}
              />

              {code && (
                <div className="rounded-md border border-white/10 bg-black p-5 text-white">
                  <pre className="code">{code}</pre>
                </div>
              )}
            </div>
          )}
          {step === 2 && operationType === "delete" && (
            <div className="options container mx-auto flex w-2/3 flex-col gap-5 p-10">
              <div className="text-5xl">Customisation</div>

              <InputControllerOptionsForDeleting
                setCode={setCode}
                modelName={modelName}
              />

              {code && (
                <div className="rounded-md border border-white/10 bg-black p-5 text-white">
                  <pre className="code">{code}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
