"use client";
import React, { useEffect, useRef, memo } from "react";
import { gsap } from "gsap";
//import { cn } from "@/lib/utils";
//import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import Particles from "@/components/ui/particles";
import Safari from "@/components/ui/safari";
import SimpleCodeView from "@/components/SimpleCodeView";
import "prismjs/themes/prism-tomorrow.css";
import "dracula-prism/dist/css/dracula-prism.css";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CodeShowcase = memo(() => <SimpleCodeView />);

export default function Home() {
  const containerRef = useRef(null);
  const childRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const commonScrollConfig = {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom center",
        scrub: true,
      };

      gsap.to(childRef.current, {
        scale: 0.5,
        x: 300,
        y: 0,
        scrollTrigger: {
          ...commonScrollConfig,
          pin: true,
        },
      });

      gsap.fromTo(
        textRef.current,
        { x: -1000, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: commonScrollConfig,
        },
      );

      gsap.fromTo(
        [".title", ".description", ".button"],
        { y: 50, opacity: 0 },
        {
          duration: 1,
          y: 0,
          opacity: 1,
          stagger: 0.3,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        [".showcase", ".ctext"],
        { x: (i) => (i === 0 ? -900 : 900), opacity: 0, scale: 0.75 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".showcase",
            start: "top 60%",
            end: "bottom 100%",
            scrub: true,
          },
        },
      );
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div className="relative z-10 mx-auto flex flex-col gap-10 p-10 md:container">
        <div className="mt-8 flex min-h-[50vh] flex-grow flex-col items-center justify-center shadow-black drop-shadow-lg">
          <h1 className="title text-center text-7xl font-extrabold text-white opacity-0 drop-shadow-lg">
            Welcome to{" "}
            <span className="text-7xl font-extrabold text-green-600 drop-shadow-lg">
              MongUi
            </span>
          </h1>
          <p className="description mt-4 max-w-md text-center text-3xl leading-relaxed text-white opacity-0">
            Generate Mongoose Models effortlessly with{" "}
            <span className="text-green-300">MongUi</span>.
          </p>
          <Link href={"/new"}>
            <button className="button mt-6 translate-y-3 rounded-xl bg-white px-6 py-2 text-black opacity-0 transition hover:bg-gray-200">
              Get Started
            </button>
          </Link>
        </div>
        <div className="block bg-red-500 p-3 text-xl md:hidden">
          This website is in development and currently doesnt support proper
          mobile view. Kindly view on desktop!
        </div>
        <section
          style={{ perspective: "1000px" }}
          ref={containerRef}
          className="safari-container relative flex h-[100vh] w-full flex-col items-center justify-center md:flex-row"
        >
          <section
            ref={textRef}
            className="stext absolute left-0 mt-32 flex h-fit w-fit flex-col items-center justify-center text-white"
          >
            <div className="huge-code-text">SKETCH</div>
            <h1 className="text-3xl text-white">
              {" "}
              Tired of writing Mongoose...{" "}
            </h1>
            <div className="border-s-4 border-s-white/15 p-3 text-xl">
              We give you easy to edit models!
              <span>
                {" "}
                <br /> This shows what{" "}
              </span>
              <span className="text-green-400"> MongUi </span> does with{" "}
              <span className="text-green-400">
                {" "}
                just the click of a button!{" "}
              </span>
            </div>
          </section>

          <div
            ref={childRef}
            style={{ filter: "drop-shadow(0 0 40px rgba(74, 222, 128, 0.2))" }}
            className="safari dark flex items-start justify-center px-5"
          >
            <Safari />
          </div>
        </section>

        <div className="mt-32 hidden w-full items-center justify-center md:flex">
          <div className="container flex flex-col justify-between gap-5 md:flex-row">
            <div className="showcase flex translate-x-[-900px] scale-75 justify-start opacity-0 md:w-1/3">
              <CodeShowcase />
            </div>
            <div className="ctext flex translate-x-[900px] flex-col items-end justify-center text-end opacity-0 md:w-1/2">
              <div className="huge-code-text text-white/15">CODE</div>
              <h1 className="text-white md:text-3xl">
                Once designing is done...
              </h1>
              <div className="border-e-4 border-e-white/15 p-3 md:text-xl">
                We provide you the code for all models! This code is in{" "}
                <span className="text-green-400">CommonJS</span> . You can
                directly just copy and paste this in your backend,{" "}
                <span className="text-green-400">
                  {" "}
                  without worrying about imports, exports, naming conventions,
                  etc.{" "}
                </span>
              </div>
              <div className="text-3xl">Its simply ready to go!</div>
            </div>
          </div>
        </div>
        <section className="hidden w-full flex-col items-center justify-center md:flex">
          <div className="flex items-center justify-center gap-5">
            <div className="flex-col items-center justify-center">
              <div className="text-center text-3xl">And guess what?</div>
              <div className="text-center text-5xl text-green-400">
                Its completely free!
              </div>
            </div>
          </div>
          {/* <div className="flex items-center justify-center gap-5">
            <iframe
              src="https://giphy.com/embed/b8RfbQFaOs1rO10ren"
              width="480"
              height="398"
              frameBorder="0"
              className="w-1/2"
              allowFullScreen
            ></iframe>
            <iframe
              src="https://giphy.com/embed/5VKbvrjxpVJCM"
              width="480"
              height="384"
              frameBorder="0"
              className="w-1/2"
              allowFullScreen
            ></iframe>
            <iframe
              src="https://giphy.com/embed/EClkor8zYeOvs9StMN"
              width="480"
              height="269"
              frameBorder="0"
              className="w-1/2"
              allowFullScreen
            ></iframe>
          </div> */}
        </section>
        <section className="relative hidden min-h-[50vh] w-full flex-col items-center justify-center md:flex">
          <div className="huge-code-text absolute top-0 z-0 text-white/15">
            LETS GO
          </div>
          <div className="relative z-10 translate-y-24 bg-black text-5xl text-white">
            So what are you waiting for?
          </div>
          <div className="flex translate-y-24 gap-3 bg-black">
            <Link href={"/new"}>
              <button className="z-10 mt-6 translate-y-10 rounded-xl bg-stone-300 px-6 py-2 text-black transition hover:bg-gray-200">
                Get Started
              </button>
            </Link>

            <Link href={"/about"}>
              <button className="z-10 mt-6 translate-y-10 rounded-xl px-6 py-2 text-stone-300 transition">
                About the Devs
              </button>
            </Link>
          </div>
        </section>
        <footer className="mt-10 flex justify-between text-xs font-light text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} MongUi. All rights reserved.
          </div>
          <div>
            Made with 🤍 by{" "}
            <Link
              href={"https://github.com/parv141206"}
              className="text-blue-300"
            >
              @parv141206
            </Link>{" "}
            and{" "}
            <Link href={"https://github.com/rudyrog"} className="text-blue-300">
              @rudyrog
            </Link>
          </div>
        </footer>
      </div>
      <div className="absolute inset-0 z-0 h-screen">
        <Particles />
        {/*  <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,green,transparent)]",
            "inset-x-0 inset-y-[-50%] h-[200%] skew-y-0",
          )}
        /> */}
      </div>
    </div>
  );
}
