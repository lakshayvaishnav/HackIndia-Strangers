"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import { Avatar, Skeleton } from "@nextui-org/react";
import { cn } from "@/lib/utils";
import { coromorantGaramond } from "@/lib/fonts";
import { MedalOutlinedIcon, PlusOutlinedIcon } from "@/icons";
import { API_URL } from "@/lib/constants";
import SolanaLogo from "@/components/img/SolanaLogo";

const Star = ({ top, left, size, delay }) => (
  <motion.div
    className="absolute bg-white rounded-full"
    style={{ top, left, width: size, height: size }}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 2, repeat: Infinity, delay }}
  />
);

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<any>([]);

  useEffect(() => {
    getProfileData();
    getAllTransactions();
  }, []);

  const getProfileData = async () => {
    try {
      const res = await axios.get(`${API_URL}/v1/user/profile`, {
        withCredentials: true,
      });
      const userData = res.data.data;
      setProfile(userData);
    } catch (err) {
      console.error(err);
    }
  };

  const getAllTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/v1/transaction/all`, {
        withCredentials: true,
      });
      setTransactions(response.data.data);
      console.log("transactions are here: ", response.data.data);
    } catch (err) {
      console.error("error fetching transactions", err);
      setTransactions([]);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Twinkling stars background */}
      {[...Array(50)].map((_, i) => (
        <Star
          key={i}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          size={`${Math.random() * 2 + 1}px`}
          delay={Math.random() * 2}
        />
      ))}

      <div className="relative z-10 p-8">
        <h1
          className={cn(
            "text-4xl font-semibold tracking-tight",
            coromorantGaramond.className
          )}
        >
          Welcome back
          {profile
            ? profile?.name
              ? `, ${profile.name.split(" ")[0]}`
              : `, ${profile.login}`
            : ""}
        </h1>
        <p className="mt-2 text-purple-300">
          create new bounties or explore all open bounties.
        </p>

        <div className="grid grid-cols-1 gap-5 mt-10 sm:grid-cols-2 lg:grid-cols-3">
          <Link href={"/dashboard/create-bounty"}>
            <div className="border border-purple-700 rounded-[13px] cursor-pointer outline outline-transparent hover:outline-4 hover:outline-purple-600 transition-all 0.2s ease-in-out">
              <div className="p-7 space-y-5 bg-purple-900/30 rounded-xl text-start">
                <PlusOutlinedIcon color="#d8b4fe" size={45} />
                <div className="flex flex-col gap-1 w-full">
                  <h2 className="text-lg font-semibold text-purple-200">
                    Create a new bounty
                  </h2>
                  <p className="text-purple-300 text-sm">
                    create a new bounty and get it listed on the GitHub.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href={"/dashboard/explore-bounty"}>
            <div className="border border-purple-700 rounded-[13px] cursor-pointer outline outline-transparent hover:outline-4 hover:outline-purple-600 transition-all 0.2s ease-in-out">
              <div className="p-7 space-y-5 bg-purple-900/30 rounded-xl text-start">
                <MedalOutlinedIcon color="#d8b4fe" size={45} />
                <div className="flex flex-col gap-1 w-full">
                  <h2 className="text-lg font-semibold text-purple-200">
                    Explore all bounties
                  </h2>
                  <p className="text-purple-300 text-sm">
                    explore all community bounties and start working on them.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-10 gap-5 max-w-[66%]">
          <div className="flex items-center justify-between">
            <p className="text-lg text-purple-300">Recent earners</p>
            <Link href={"/dashboard/leaderboard"}>
              <p className="text-sm text-purple-400 font-medium hover:text-purple-300 transition-colors">
                {"Leaderboard ->"}
              </p>
            </Link>
          </div>

          {!transactions.length ? (
            <div className="mt-5 flex flex-col gap-5">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="rounded-full w-8 h-8 bg-purple-700" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="rounded-lg w-32 h-4 bg-purple-700" />
                      <Skeleton className="rounded-lg w-44 h-4 bg-purple-700" />
                    </div>
                  </div>
                  <Skeleton className="rounded-lg w-20 h-6 bg-purple-700" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 pb-10 flex flex-col gap-5">
              {transactions.map((transaction: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={transaction.to.avatar_url}
                      className="h-8 w-8"
                    />
                    <div className="flex flex-col gap-1.5">
                      <a
                        target="_blank"
                        href={`https://github.com/${transaction.to.github_username}`}
                        className="text-base font-medium text-purple-200 leading-none hover:underline cursor-pointer"
                      >
                        {transaction.to.name
                          ? transaction.to.name
                          : transaction.to.github_username}
                      </a>
                      <a
                        target="_blank"
                        href={transaction.pr_detail.url}
                        className="text-sm text-purple-400 leading-none hover:underline cursor-pointer"
                      >
                        {transaction.pr_detail.title} #
                        {transaction.pr_detail.number}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {transaction.token === "SOL" ? (
                      <SolanaLogo height="12" />
                    ) : (
                      ""
                    )}
                    <p className="text-purple-200 font-medium text-base flex items-center gap-1">
                      {transaction.amount}
                      <span className="text-purple-400">
                        {transaction.token}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
