"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { User } from "@nextui-org/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SolanaLogo from "@/components/img/SolanaLogo";
import { LoginIcon } from "@/icons";
import ConnectWallet from "@/components/connect-wallet";
import { instrumentSerif, inter, interTight } from "@/lib/fonts";
import { API_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import backgroundImage from "/public/bg.png";

const StarField = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 100; i++) {
        newStars.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          duration: Math.random() * 3 + 1,
        });
      }
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
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const { publicKey, signMessage, connected } = useWallet();
  const [pubKey, setPubKey] = useState<string>();
  const [signature, setSignature] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [status, setStatus] = useState<"authenticated" | "unauthenticated">(
    "unauthenticated"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = () => {
    setIsLoading(true);
    window.location.href = `${API_URL}/v1/auth/github`;
  };

  useEffect(() => {
    getProfileData();
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      setPubKey(publicKey.toBase58());
      console.log("public key: ", publicKey.toBase58());
    }
  }, [connected, publicKey]);

  const getProfileData = async () => {
    try {
      const res = await axios.get(`${API_URL}/v1/user/profile`, {
        withCredentials: true,
      });
      const userData = res.data.data;
      console.log(userData);
      setProfile(userData);
      setStatus("authenticated");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignTransaction = async () => {
    if (!publicKey || !signMessage) {
      console.error("no wallet connected");
      return;
    }

    const message = `${
      window.location.origin
    } wants you to sign and verify your account for ${publicKey.toBase58()}`;
    const encodedMessage = new TextEncoder().encode(message);

    try {
      const signatureBuffer = await signMessage(encodedMessage);
      const signature = Buffer.from(signatureBuffer).toString("base64");
      console.log("signature: ", signature);
      if (!signature) {
        throw new Error("no signature found");
      }
      setSignature(signature);
      return { signature, message };
    } catch (error) {
      console.error("error signing transaction: ", error);
      return null;
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);

    if (!connected || !publicKey) {
      toast.error("no wallet connected");
      return;
    }

    const response = await handleSignTransaction();
    if (!response) {
      toast.error("error signing transaction");
      return;
    }

    const { signature, message } = response;

    try {
      const res = await axios.post(
        `${API_URL}/v1/auth/register`,
        {
          pubKey,
          signature,
          message,
        },
        { withCredentials: true }
      );
      console.log("register data: ", res.data);
      toast.success("logged in successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      toast.error("error logging in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className={cn(
        inter.className,
        "min-h-screen bg-black text-white overflow-hidden relative"
      )}
    >
      <StarField />
      <div className="container mx-auto flex flex-col lg:flex-row min-h-screen relative z-10">
        <motion.div
          className="lg:w-1/2 p-10 flex flex-col justify-between"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/">
            <h1
              className={cn(
                interTight.className,
                "text-2xl font-semibold tracking-tight text-white flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text"
              )}
            >
              <SolanaLogo height="20" color="#ffffff" />
              solbounty
            </h1>
          </Link>
          <div className="hidden lg:block">
            <Image
              src={"/media/division.gif"}
              alt="background"
              className="rounded-lg object-cover ml-20 mb-20 overflow-hidden"
              style={{ objectFit: "contain" }}
              width={400}
              height={400}
            />
          </div>
        </motion.div>

        <motion.div
          className="lg:w-1/2 flex items-center justify-center p-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="w-full max-w-md bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h1
                className={cn(
                  instrumentSerif.className,
                  "text-4xl font-semibold mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 text-transparent bg-clip-text"
                )}
              >
                fork it.
              </h1>
              {status === "unauthenticated" && (
                <div>
                  <p className="text-gray-400 text-center mb-6">
                    Login to your account to continue.
                  </p>
                  <Button
                    onClick={handleClick}
                    className="w-full bg-white text-black hover:bg-gray-200 transition-colors"
                    disabled={isLoading}
                  >
                    <GitHubLogoIcon className="mr-2" />
                    {isLoading ? "Loading..." : "Sign in with GitHub"}
                  </Button>
                </div>
              )}

              {status === "authenticated" && (
                <div className="space-y-6">
                  {profile && (
                    <User
                      name={profile?.name}
                      description={profile?.login}
                      avatarProps={{
                        src: profile?.avatar_url as string,
                      }}
                    />
                  )}

                  <hr className="border-t border-gray-700" />

                  <div>
                    {!publicKey && (
                      <p className="text-gray-400 mb-4">
                        Connect wallet to continue.
                      </p>
                    )}
                    <ConnectWallet />
                  </div>

                  <Button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors"
                    disabled={isLoading}
                  >
                    <LoginIcon color="#fff" className="mr-2" />
                    {isLoading ? "Loading..." : "Sign in"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
