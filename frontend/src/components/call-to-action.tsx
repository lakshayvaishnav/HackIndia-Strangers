"use client";

import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CallToAction() {
  const { isLoggedIn } = useAuth();

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        yoyo: Infinity,
      },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 mt-5">
      <Link href={isLoggedIn ? "/dashboard" : "/login"}>
        <motion.button
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-full shadow-lg"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Try now →
        </motion.button>
      </Link>
      <motion.button
        className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-full shadow-lg flex items-center gap-2 border border-gray-700"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <img
          className="h-5 w-5 object-contain"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/480px-Google_Chrome_icon_%28February_2022%29.svg.png"
          alt="Chrome logo"
        />
        Download for Chrome
      </motion.button>
    </div>
  );
}
