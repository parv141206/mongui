"use client";
import React, { useEffect } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import Particles from "@/components/ui/particles";
import SimpleCard from "@/components/SimpleCard";

export default function Home() {
  useEffect(() => {
    // GSAP animations for title
    gsap.fromTo(
      ".title",
      { y: -50, opacity: 0 },
      { duration: 1, y: 0, opacity: 1, delay: 1 },
    );

    // GSAP animation for description
    gsap.fromTo(
      ".description",
      { y: 50, opacity: 0 },
      { duration: 1, y: 0, opacity: 1, delay: 1.5 },
    );

    // GSAP animation for button
    gsap.fromTo(
      ".button",
      { y: 0, opacity: 0 }, // Start slightly below its final position
      {
        duration: 1,
        y: 0, // Move to the original position
        opacity: 1, // Fade in
        delay: 3,
        stagger: 0.1,
        ease: "elastic.out(1, 0.3)", // Elastic easing for a bouncy effect
      },
    );

    // GSAP animation for features section
    gsap.fromTo(
      ".features",
      { y: 50, opacity: 0 },
      { duration: 1, y: 0, opacity: 1, delay: 1.5 },
    );
  }, []);

  return (
    <div className="relative overflow-hidden bg-black text-white">
      {/* Parallax Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/path/to/your/image.jpg')" }}
      >
        <div className="h-full bg-black opacity-50"></div>
      </div>

      <div className="relative z-10 flex h-screen flex-col p-10">
        {/* Navbar */}
        <nav className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <svg
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
            </svg>
          </div>

          <button className="text-white hover:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="12" cy="8" r="4" /> {/* Head */}
              <path d="M16 20c0-2-4-3-4-3s-4 1-4 3" /> {/* Shoulders */}
            </svg>
          </button>
        </nav>

        <div className="mt-8 flex flex-grow flex-col items-center justify-center">
          <h1 className="title text-6xl font-extrabold text-white drop-shadow-lg">
            Welcome to{" "}
            <span className="text-6xl font-extrabold text-green-600 drop-shadow-lg">
              MongUi
            </span>
          </h1>
          <p className="description mt-4 max-w-md text-center text-lg leading-relaxed text-gray-400">
            Generate Mongoose queries effortlessly with{" "}
            <span className="text-white">MongUi</span>.
          </p>
          <button className="button mt-6 rounded-md bg-white px-6 py-3 text-black transition hover:bg-gray-200">
            Get Started
          </button>

          {/* Features Section */}
          <div className="features mt-10 grid grid-cols-1 gap-6 text-center text-gray-400 opacity-0 sm:grid-cols-2 lg:grid-cols-3">
            <SimpleCard
              doodle="assets/Coding 7.svg"
              title="Easy Query Generation"
              description="Create Mongoose queries quickly with minimal effort."
            />
            <SimpleCard
              doodle="assets/Settings 2.svg"
              title="Customizable Templates"
              description="Tailor your queries to fit your project needs."
            />
            <SimpleCard
              doodle="assets/Searching 3.svg"
              title="Real-time Syntax Checking"
              description="Ensure your queries are correct before running them."
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-xs font-light text-gray-500">
          &copy; {new Date().getFullYear()} MongUi. All rights reserved.
        </footer>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
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
