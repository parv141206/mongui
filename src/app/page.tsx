"use client";
import React, { useEffect } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import Particles from "@/components/ui/particles";
import SimpleCard from "@/components/SimpleCard";
import Safari from "@/components/ui/safari";
import CodeView from "@/components/CodeView";
import SimpleCodeView from "@/components/SimpleCodeView";
import Prism from "prismjs";

import "prismjs/themes/prism-tomorrow.css";
import "dracula-prism/dist/css/dracula-prism.css";
export default function Home() {
  useEffect(() => {
    gsap.fromTo(
      ".title",
      { y: -50 },
      { duration: 1, y: 0, opacity: 1, delay: 1 },
    );

    gsap.fromTo(
      ".description",
      { y: 50 },
      { duration: 1, y: 0, opacity: 1, delay: 1.5 },
    );
    gsap.fromTo(
      ".safari",
      { y: 50 },
      { duration: 1, y: 0, opacity: 1, delay: 1.5 },
    );

    gsap.to(".button", {
      duration: 2,
      y: 0,
      opacity: 1,
      delay: 1.5,
    });
  }, []);

  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div className="relative z-10 flex flex-col gap-10 p-10">
        {/* MAIN ICON <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 100 100"
              fill="none"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 80 L50 20 L90 80" />
              <path d="M30 80 L50 50 L70 80" />
            </svg> */}
        {/* PROFILE ICON<svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M16 20c0-2-4-3-4-3s-4 1-4 3" />
            </svg> */}

        <div className="mt-8 flex min-h-[50vh] flex-grow flex-col items-center justify-center">
          <h1 className="title text-center text-7xl font-extrabold text-stone-300 opacity-0 drop-shadow-lg">
            Welcome to{" "}
            <span className="text-7xl font-extrabold text-green-600 drop-shadow-lg">
              MongUi
            </span>
          </h1>
          <p className="description mt-4 max-w-md text-center text-lg leading-relaxed text-gray-400 opacity-0">
            Generate Mongoose queries effortlessly with{" "}
            <span className="text-white">MongUi</span>.
          </p>
          <button className="button mt-6 translate-y-10 rounded-xl bg-stone-300 px-6 py-2 text-black opacity-0 transition hover:bg-gray-200">
            Get Started
          </button>
        </div>
        <section className="relative flex h-[400vh] w-full justify-center gap-3">
          <div
            style={{
              filter: "drop-shadow(0 0 40px rgba(74, 222, 128, 0.2))",
            }}
            className="safari dark absolute top-0 my-5 flex h-fit items-center justify-center opacity-0"
          >
            <Safari />
          </div>
        </section>

        <section>
          <CodeShowcase />
        </section>
        <footer className="mt-10 text-xs font-light text-gray-500">
          &copy; {new Date().getFullYear()} MongUi. All rights reserved.
        </footer>
      </div>
      <div className="absolute inset-0 z-0 h-screen">
        <Particles />
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(700px_circle_at_center,green,transparent)]",
            "inset-x-0 inset-y-[-50%] h-[200%] skew-y-12",
          )}
        />
      </div>
    </div>
  );
}
function CodeShowcase() {
  return <SimpleCodeView />;
}
