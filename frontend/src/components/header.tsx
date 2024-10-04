"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Avatar } from "@nextui-org/react";
import SolanaLogo from "./img/SolanaLogo";
import DynamicBreadcrumbs from "./dynamic-breadcrumbs";
import { API_URL } from "@/lib/constants";

export default function Header() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getProfileData();
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

  return (
    <header className="fixed left-0 top-0 right-0 z-30 w-full h-[70px] border-b border-black bg-gradient-to-r from-black to-black backdrop-blur-md">
      <div className="flex items-center h-full">
        <div className="flex items-center px-10 gap-2 w-[250px] lg:w-[350px] h-full bg-gradient-to-b from-black to-black border-r  border-black">
          <Link href={"/"}>
            <div className="flex items-center gap-2">
              <SolanaLogo height="18" monoChrome={true} />
              <h1 className="text-lg font-medium tracking-tight text-purple-300">
                SolPayout
              </h1>
            </div>
          </Link>
        </div>

        <div className="p-5 px-10 flex items-center justify-between w-[calc(100vw-250px)] lg:w-[calc(100vw-350px)]">
          <DynamicBreadcrumbs />
          <Link href={"/dashboard/profile"}>
            <Avatar
              className="cursor-pointer hover:ring-2 hover:ring-purple-600 transition-all duration-200 ease-in-out"
              name={profile?.name || "User"}
              src={profile?.avatar_url}
              size="sm"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
