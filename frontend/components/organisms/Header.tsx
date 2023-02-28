import React from "react";
import { useState } from "react";
import Link from "next/link";
import { TiWarningOutline } from "react-icons/ti";
import { useSession, signIn, signOut } from "next-auth/react";
import { AiOutlineUser } from "react-icons/ai";
import { RiLogoutCircleRLine } from "react-icons/ri";

export function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const { data: session } = useSession();
  return (
    <nav className="">
      <div className="mx-auto px-2 md:px-4 xl:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-1 flex justify-start items-center">
            <Link href="/" className="font-bold text-2xl">
              AA
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/create-wallet" className="text-lg font-semibold mx-4">
              Create wallet
            </Link>
            <Link href="/create-plugin" className="text-lg font-semibold mx-4">
              Create plugin
            </Link>
          </div>

          <div className="flex items-center">
            {session && session.user ? (
              <>
              <Link
                className="bg-zinc-800 rounded-full w-10 h-10 font-bold flex justify-center items-center text-white ml-4 shadow-lg shadow-gray-500/30 hover:cursor-pointer button"
                href="/profile"
              ><AiOutlineUser size={20} /></Link> <button
              onClick={() => signOut()}
              className="bg-zinc-800 rounded-full w-10 h-10 font-bold flex justify-center items-center text-white ml-4 shadow-lg shadow-gray-500/30 hover:cursor-pointer button"
            >
              <RiLogoutCircleRLine size={20} />
            </button></>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-zinc-800 rounded-full w-10 h-10 font-bold flex justify-center items-center text-white ml-4 shadow-lg shadow-gray-500/30 hover:cursor-pointer button"
              >
                <AiOutlineUser size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
