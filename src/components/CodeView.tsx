import { createAllModels } from "@/lib/models/createAllModels";
import { Model } from "@/types/Models";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import "prismjs/themes/prism-tomorrow.css";
import "dracula-prism/dist/css/dracula-prism.css";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

function CreateAllModelsOutput({ models }: { models: Model[] }) {
  useEffect(() => {
    Prism.highlightAll();
  }, [models]);

  return (
    <div className="w-full">
      <pre className="rounded-lg bg-[#282a36] px-4 font-mono">
        <code className="language-typescript">
          {createAllModels(models, "cjs").join("")}
        </code>
      </pre>
    </div>
  );
}

export default function CodeView({
  models,
  setIsCodeViewOpen,
}: {
  models: Model[];
  setIsCodeViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [copy, setCopy] = useState(false);
  useEffect(() => {
    // Highlight code when models change
    // Prism.highlightAll();
  }, [models]);

  return (
    <>
      <div className="absolute top-0 z-20 flex h-screen w-screen items-center justify-center bg-[#282a3655] p-3 backdrop-blur-sm">
        <div className="relative h-[80%] overflow-y-scroll scroll-smooth rounded-sm border border-white/20 bg-[#282a36]">
          <div className="sticky top-0 flex justify-between bg-[#282a36]">
            <h1 className="mt-2 p-3 text-4xl text-[#50fa7b]">
              Here's your code!
            </h1>
            <div className="flex items-center justify-center gap-3">
              <button
                className={`rounded border-2 border-[#6272a4] px-3 py-1 transition-all duration-300 hover:bg-[#6272a4] hover:text-[#f8f8f2] ${copy ? "text-[#f8f8f2]" : "text-[#6272a4]"}`}
                onClick={() => {
                  // @ts-ignore
                  navigator.clipboard.writeText(createAllModels(models, "cjs"));
                  setCopy(true);
                  setTimeout(() => {
                    setCopy(false);
                  }, 2000);
                }}
              >
                {copy ? "Copied!" : "Copy"}
              </button>
              <button
                className="pr-3 text-xl font-bold text-[#ff5555] hover:text-[#ff79c6]"
                onClick={() => setIsCodeViewOpen(false)}
              >
                <IoMdClose />
              </button>
            </div>
          </div>
          <hr className="mx-2 border border-[#6272a4]" />
          <div className="h-auto overflow-y-scroll">
            <CreateAllModelsOutput models={models} />
          </div>
          <div className="mt-4 flex justify-between px-4 pb-4">
            <button
              className="rounded-sm border border-[#50fa7b] bg-[#50fa7b] px-3 py-2 text-[#282a36] transition-all duration-300 hover:bg-[#282a36] hover:text-[#50fa7b]"
              onClick={() => setIsCodeViewOpen(false)}
            >
              Looks good!
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// function CreateAllModelsOutput({ models }: { models: Model[] }) {
//   return (
//     <div className="flex w-fit flex-col rounded-lg px-7">
//       <pre className="draculaTheme">
//         <code>{createAllModels(models, "cjs")}</code>
//       </pre>
//     </div>
//   );
// }
