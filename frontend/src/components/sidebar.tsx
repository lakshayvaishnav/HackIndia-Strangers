"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  HomeOutlinedIcon,
  MedalOutlinedIcon,
  PlusOutlinedIcon,
  SearchOutlinedIcon,
  UserCircleOutlinedIcon,
} from "@/icons";
import { CurrencyIcon } from "@/icons/currency-icon";

interface Menu {
  label: string;
  href: string;
  icon: JSX.Element;
  iconActive?: JSX.Element;
}

export default function Sidebar() {
  const pathname = usePathname();

  const menu: Menu[] = [
    {
      label: "Home",
      href: "/dashboard/home",
      icon: <HomeOutlinedIcon color="#a78bfa" />,
      iconActive: <HomeOutlinedIcon color="#d8b4fe" />,
    },
    {
      label: "Create bounty",
      href: "/dashboard/create-bounty",
      icon: <PlusOutlinedIcon color="#a78bfa" />,
      iconActive: <PlusOutlinedIcon color="#d8b4fe" />,
    },
    {
      label: "Explore bounty",
      href: "/dashboard/explore-bounty",
      icon: <SearchOutlinedIcon color="#a78bfa" />,
      iconActive: <SearchOutlinedIcon color="#d8b4fe" />,
    },
    {
      label: "Leaderboard",
      href: "/dashboard/leaderboard",
      icon: <MedalOutlinedIcon color="#a78bfa" />,
      iconActive: <MedalOutlinedIcon color="#d8b4fe" />,
    },
    {
      label: "Transactions",
      href: "/dashboard/transactions",
      icon: <CurrencyIcon color="#a78bfa" />,
      iconActive: <CurrencyIcon color="#d8b4fe" />,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <UserCircleOutlinedIcon color="#a78bfa" />,
      iconActive: <UserCircleOutlinedIcon color="#d8b4fe" />,
    },
  ];

  return (
    <div className="fixed flex flex-col top-0 left-0 bottom-0 z-10 h-screen w-[250px] lg:w-[350px] bg-gradient-to-b from-black to-purple-950 p-10 pt-[110px] pb-5 ">
      <div>
        <p className="text-xs text-purple-400 py-1.5 px-2">menu</p>
        <div className="mt-1 flex flex-col gap-1">
          {menu.map((item, index) => (
            <Link href={item.href} key={index}>
              <div
                className={cn(
                  "flex items-center gap-2.5 py-1.5 px-2 text-sm border border-transparent hover:bg-purple-900/50 transition-all 0.2s ease-in-out rounded-lg",
                  pathname === item.href
                    ? "text-purple-200 border-purple-700 bg-purple-900/50"
                    : "font-normal text-purple-400"
                )}
              >
                {pathname === item.href ? item.iconActive : item.icon}
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
