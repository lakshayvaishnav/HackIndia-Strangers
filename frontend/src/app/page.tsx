"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/button";
import CallToAction from "@/components/call-to-action";
import GitHubLogo from "@/components/img/GitHubLogo";
import SolanaLogo from "@/components/img/SolanaLogo";
import LoginButton from "@/components/login-button";
import { interTight } from "@/lib/fonts";
import solanaLogo from "/public/solana.svg";

const StarField = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 200; i++) {
        newStars.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          duration: Math.random() * 3 + 1,
        });
      }
      // @ts-ignore
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {stars.map((star, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-white"
          style={{
            // @ts-ignore
            left: `${star.x}%`,
            // @ts-ignore
            top: `${star.y}%`,
            // @ts-ignore
            width: star.size,
            // @ts-ignore
            height: star.size,
          }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            // @ts-ignore
            duration: star.duration,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <StarField />
      <div className="relative z-10">
        <header className="flex items-center justify-between p-5 px-14 h-20">
          <h1
            className={`${interTight.className} text-xl font-semibold tracking-tight flex items-center gap-2`}
          >
            <SolanaLogo color="#ffffff" />
            SolPayout
          </h1>
          <LoginButton />
        </header>

        <div className="flex flex-col px-10">
          <div className="text-center rounded-3xl p-10 py-20 flex flex-col items-center gap-5">
            <h1
              className={`${interTight.className} pointer-events-none text-6xl md:text-8xl font-medium tracking-tight flex flex-wrap items-center justify-center gap-5 max-w-[1000px]`}
            >
              Bounties on
              <span className="flex items-center gap-3 w-fit">
                <GitHubLogo monoChrome={true} color="#ffffff" height="75" />{" "}
                GitHub
              </span>
              with{" "}
              <span className="flex items-center gap-3">
                <Image src={solanaLogo} height={72} width={72} alt="" />
                <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-300 text-transparent bg-clip-text">
                  Solana
                </span>
              </span>
            </h1>
            <p className="text-gray-300 max-w-96 mt-3">
              Reward contributors with bounties instantly on Solana right from
              GitHub.
            </p>
            <CallToAction />
          </div>
        </div>
      </div>
    </main>
  );
}
