import { Layout } from "../components/templates/Layout";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import { formatAddress } from "@/utils/common";
import { useState, useEffect } from "react";
import { getRandomEmoji } from "@/utils/emoji";
import useSWR from "swr";
import { fetcher } from "@/utils/common";
import { MdOutlineContentCopy } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";

function WalletCard({
  wallet,
  emojis,
  index,
}: {
  wallet: any;
  emojis: any;
  index: number;
}) {
  const [copied, setCopied] = useState(false);
  function copy(e: any) {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }
  return (
    <Link href={"/wallet/" + wallet.address} key={wallet.id}>
      <div className={"py-3 px-2 flex flex-row justify-between items-center border border-zinc-300 rounded-2xl shadow-md md:my-2 xl:my-4 py-4 px-6 mx-4 button border border-gray-100 w-[340px]" + (wallet.deployed ? " bg-green-600/10" : " bg-red-600/10")}>
        <div className="w-full">
          <div className="flex flex-row justify-between items-top">
            <div className="rounded-full w-12 h-12 border border-gray-100 bg-zinc-200 text-2xl flex justify-center items-center">
              {emojis[index]}
            </div>
          </div>
          <div
            className="flex flex-row items-center justify-start w-full mt-3 mb-1"
            onClick={copy}
          >
            <h4 className="text-base font-semibold text-zinc-600">
              {formatAddress(wallet.address)}
            </h4>
            {copied ? (
              <AiOutlineCheck className="ml-2 my-auto" size={15} />
            ) : (
              <MdOutlineContentCopy className="ml-2 my-auto" size={15} />
            )}
          </div>
          {wallet.deployed ? (
            <p className="text-sm text-zinc-600">
              Deployed to{" "}
              {wallet.chains.map(
                (chain: any, index: number) =>
                  chain.name + (index == wallet.chains.length - 1 ? "" : ", ")
              )}
            </p>
          ) : (
            <p className="text-sm text-zinc-600">Not deployed</p>
          )}
        </div>
      </div>
    </Link>
  );
}

function WalletSkeleton() {
  return (
    <div className="py-3 px-2 flex flex-row justify-between items-center bg-white rounded-2xl shadow-md md:my-2 xl:my-4 py-4 px-6 mx-4 button border border-gray-100 w-[340px]">
      <div className="w-full">
        <div className="flex flex-row justify-between items-top">
          <div className="rounded-full w-12 h-12 border border-gray-100 bg-zinc-200 text-2xl flex justify-center items-center"></div>
        </div>
        <div className="flex flex-row items-center justify-start w-full mt-3 mb-1">
          <h4 className="text-base font-semibold bg-zinc-200 text-zinc-200 rounded-2xl animate-pulse lowercase">
            0xa...b48888
          </h4>
        </div>
        <p className="text-sm bg-zinc-200 text-zinc-200 rounded-2xl animate-pulse lowercase">
          Deployed to Ethereum
        </p>
      </div>
    </div>
  );
}

export default function Profile() {
  const [emojis, setEmojis] = useState<any[]>([]);
  const { data: session } = useSession();
  const { data: wallets, isLoading } = useSWR(
    session ? "/api/get-wallets?email=" + session?.user?.email : null,
    fetcher
  );
  useEffect(() => {
    if (!wallets) return;
    const emojiArray = [];
    for (let i = 0; i < wallets.length; i++) {
      emojiArray.push(getRandomEmoji());
    }
    setEmojis(emojiArray);
  }, [wallets]);
  return (
    <Layout>
      <div className="h-[60vh] flex flex-col items-center justify-center">
        {session && session.user ? (
          <>
            <h3 className="text-2xl font-semibold text-zinc-900 mb-6 lowercase">
              Manage Wallets
            </h3>
            {isLoading ? (
              <div
                className={
                  "grid md:grid-cols-1 xl:grid-cols-2" 
                }
              >
                <WalletSkeleton />
                <WalletSkeleton />
              </div>
            ) : (
              <div
                className={
                  "grid md:grid-cols-1" +
                  (wallets?.length ? " xl:grid-cols-2" : " xl:grid-cols-1")
                }
              >
                {wallets?.length ? (
                  wallets.map((wallet: any, index: number) => (
                    <WalletCard
                      wallet={wallet}
                      emojis={emojis}
                      index={index}
                      key={index}
                    />
                  ))
                ) : (
                  <p className="text-center text-lg text-zinc-300 font-bold lowercase">
                    No wallets yet
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <h4 className="text-2xl font-bold text-zinc-600 lowercase">Not signed in</h4>
            {/* <Button
              onClick={() => signIn()}
              backgroundColor="bg-purple-700"
              textColor="text-white"
              additionalClasses="mt-4 px-6 py-1"
            >
              Sign in
            </Button> */}
          </>
        )}
      </div>
    </Layout>
  );
}
