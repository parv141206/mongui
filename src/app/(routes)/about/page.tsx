import Ripple from "@/components/ui/ripple";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoMdHome } from "react-icons/io";

export default function About() {
  return (
    <div className="dark relative flex h-screen w-screen">
      <Link href={"/"}>
        <div className="absolute left-12 top-12 z-30 text-5xl text-white">
          <IoMdHome />
        </div>
      </Link>
      <Ripple className="absolute z-10" numCircles={5} />
      <div className="relative z-20 flex h-full w-full flex-col items-center justify-center">
        <div className="text-3xl text-white">Made with 🤍 by</div>
        <div className="text-5xl text-white">
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
        <div className="text-3xl text-white">Open source 🧐</div>
      </div>
    </div>
  );
}
