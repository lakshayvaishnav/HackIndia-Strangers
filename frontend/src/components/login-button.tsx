"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { LogIn } from "lucide-react";

export default function LoginButton() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex items-center gap-4">
      {isLoggedIn ? (
        <Link
          href="/dashboard"
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-800 to-blue-900 p-0.5 text-sm font-medium text-gray-300 hover:text-white focus:outline-none focus:ring-4 focus:ring-purple-800"
        >
          <span className="relative rounded-md bg-gray-900 px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
            Dashboard
          </span>
        </Link>
      ) : (
        <Link
          href="/login"
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-800 to-blue-900 p-0.5 text-sm font-medium text-gray-300 hover:text-white focus:outline-none focus:ring-4 focus:ring-purple-800"
        >
          <span className="relative flex items-center gap-2 rounded-md bg-gray-900 px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
            <LogIn size={18} />
            Login
          </span>
        </Link>
      )}
    </div>
  );
}
