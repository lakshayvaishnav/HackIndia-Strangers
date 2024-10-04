"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Button from "@/components/button";
import ConnectWallet from "@/components/connect-wallet";
import SolanaLogo from "@/components/img/SolanaLogo";
import { WalletOutlinedIcon } from "@/icons";
import { API_URL } from "@/lib/constants";
import { coromorantGaramond } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Avatar, Snippet } from "@nextui-org/react";

// @ts-ignore
const Star = ({ top, left, size, delay }) => (
  <motion.div
    className="absolute bg-white rounded-full"
    style={{ top, left, width: size, height: size }}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 2, repeat: Infinity, delay }}
  />
);

export default function Profile() {
  const { connect, disconnect, connected, publicKey, wallet, signMessage } =
    useWallet();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [updateWallet, setUpdateWallet] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    try {
      const res = await axios.get(`${API_URL}/v1/user/`, {
        withCredentials: true,
      });
      const userData = res.data.data;
      setUserProfile(userData);
    } catch (err) {
      console.error(err);
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
      setSignature(signature);
      return { signature, message };
    } catch (error) {
      console.error("error signing transaction: ", error);
      return null;
    }
  };

  const handleUpdateWallet = async () => {
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
      await axios.post(
        `${API_URL}/v1/user/update`,
        {
          pubKey: publicKey ? publicKey.toBase58() : userProfile?.account_addr,
          signature,
          message,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("updated wallet successfully!");
      setUpdateWallet(false);
    } catch (err) {
      console.error(err);
      toast.error("error updating wallet");
    } finally {
      setIsLoading(false);
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
          Profile
        </h1>
        <p className="mt-2 text-purple-300">{"It's all about you :)"}</p>

        <div className="mt-10 flex flex-col gap-5">
          <div className="flex items-center gap-5">
            <Avatar src={userProfile?.avatar_url} size="lg" />
            <div>
              <p className="text-xl font-medium tracking-tight">
                {userProfile?.name
                  ? userProfile?.name
                  : userProfile?.github_username}
              </p>
              {userProfile?.name && (
                <p className="text-base text-purple-300">
                  {userProfile?.github_username}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm text-purple-300 mb-2 ml-1">Wallet Address</p>
            <Snippet
              size="lg"
              hideSymbol
              tooltipProps={{
                placement: "top",
                content: "Copy address",
              }}
              classNames={{
                base: "bg-purple-900/50 border border-purple-700",
                pre: "text-white",
              }}
            >
              {publicKey ? publicKey.toBase58() : userProfile?.account_addr}
            </Snippet>
          </div>

          {updateWallet ? (
            <>
              <div suppressHydrationWarning>
                <ConnectWallet />
              </div>

              <Button
                color="purple"
                onClick={handleUpdateWallet}
                className={cn(
                  "w-fit flex items-center gap-2 bg-purple-600 hover:bg-purple-700",
                  publicKey
                    ? ""
                    : "pointer-events-none cursor-not-allowed opacity-70"
                )}
                disabled={isLoading}
              >
                <WalletOutlinedIcon color="white" size={18} />
                {isLoading ? "Verifying..." : "Verify & Update"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setUpdateWallet(true)}
              className="w-fit flex items-center gap-2 bg-purple-600 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-purple-700 active:scale-95 animate-pulse"
            >
              <WalletOutlinedIcon color="white" size={18} />
              Update Wallet
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
