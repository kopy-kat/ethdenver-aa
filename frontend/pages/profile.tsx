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
      <div className="py-3 px-2 flex flex-row justify-between items-center bg-white rounded-2xl shadow-md md:my-2 xl:my-4 py-4 px-6 mx-4 button border border-gray-100 w-[340px]">
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
              Deployed to {wallet.chains.map((chain: any, index:number) => (chain.name + (index == wallet.chains.length - 1 ? "":", ")))}
            </p>
          ) : (
            <p className="text-sm text-zinc-600">Not deployed</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Profile() {
  const [emojis, setEmojis] = useState<any[]>([]);
  const { data: session } = useSession();
  const { data: wallets } = useSWR(
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
            <h3 className="text-2xl font-semibold text-zinc-900 mb-6">
              Manage Wallets
            </h3>
            <div
              className={
                "grid md:grid-cols-1" +
                (wallets?.length ? " xl:grid-cols-2" : " xl:grid-cols-1")
              }
            >
              {wallets?.length ? (
                wallets.map((wallet: any, index: number) => (
                  <WalletCard wallet={wallet} emojis={emojis} index={index} key={index} />
                ))
              ) : (
                <p className="text-center text-lg text-zinc-300 font-bold">
                  No wallets yet
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <h4 className="text-2xl font-bold text-zinc-600">Not signed in</h4>
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
