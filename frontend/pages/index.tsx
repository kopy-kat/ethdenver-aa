import { Button } from "@/components/atoms/Button";
import Head from "next/head";
import { useState } from "react";
import { Link } from "react-scroll";
import Image from "next/image";
import { default as Wojak } from "@/public/wojak.png";
import { default as Rhinestone } from "@/public/rhinestone.png";

export default function Home() {
  const [signedUp, setSignedUp] = useState<boolean>(false);
  const [signupLoading, setSignupLoading] = useState<boolean>(false);
  async function waitlistSignup(e: any) {
    e.preventDefault();
    setSignupLoading(true);
    const email = e.target.email.value;
    await fetch("/api/join-waitlist", {
      method: "POST",
      body: JSON.stringify({ email: email }),
    });
    setSignedUp(true);
    setSignupLoading(false);
  }
  return (
    <>
      <Head>
        <title>rhinestone</title>
        <meta name="description" content="modular account abstraction" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-zinc-800">
        {/* <nav className="bg-transparent fixed h-[50px] w-[100vw] z-[60] flex justify-center mt-8">
          <div className="w-1/2">
            <div className="bg-white w-full border border-zinc-200 rounded-3xl px-8 py-2 flex flex-row items-center justify-between">
              <h5 className="text-xl font-bold">0xAA</h5>
              <div className="">
                <Button
                  onClick={() => {}}
                  backgroundColor="bg-blue-600"
                  textColor="text-white"
                  additionalClasses=""
                >
                  Join the waitlist
                </Button>
              </div>
            </div>
            <div></div>
          </div>
        </nav> */}
        <section className="h-[90vh] lg:h-[110vh] bg-zinc-800 rounded-b-[3rem] lg:rounded-b-[8rem] z-30 relative">
          <div className="flex flex-col justify-center items-center h-[80vh] lg:h-[100vh]">
            <Image
              src={Rhinestone}
              width={200}
              height={200}
              alt=""
              className="rounded-2xl w-20 h-20"
              placeholder="blur"
            />
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold mt-6 text-zinc-300 text-center">
              rhinestone
            </p>
            <p className="text-lg md:text-xl lg:text-2xl mt-2 lg:mt-4 text-zinc-400 text-center">
              plug-and-play account abstraction
            </p>
            <Link
              to="waitlist"
              smooth={true}
              duration={1500}
              className="mt-12 md:mt-20 lg:mt-24 xl:mt-24 w-1/2 lg:w-1/5"
            >
              <Button
                onClick={() => {}}
                backgroundColor="bg-blue-600/10"
                textColor="text-zinc-200"
                additionalClasses="border border-zinc-300 w-full px-12 py-2"
              >
                join the waitlist
              </Button>
            </Link>
          </div>
        </section>
        <section className="2xl:h-[160vh] bg-[#f7f1e3] z-40 rounded-[3rem] lg:rounded-[8rem] py-20 relative">
          <div className="2xl:h-[140vh] bg-[#f7f1e3] flex flex-col justify-center items-center rounded-[3rem] lg:rounded-b-[8rem] py-20 md:py-40 lg:py-64">
            <p className="text-lg md:text-xl lg:text-2xl mb-12 text-zinc-700 font-semibold text-center mx-4">
              create a wallet with all the features you want
            </p>
            <div className="flex justify-center items-center flex-wrap gap-x-8 gap-y-4 2xl:h-[100vh] w-[90vw] md:w-[90vw] xl:w-[80vw] 2xl:w-[70vw]">
              <div className="bg-blue-600/10 border border-zinc-300 h-[140px] w-[200px] rounded-2xl shadow-md hover:rotate-3 hover:scale-90 transition duration-300 hover:cursor-pointer">
                <div className="flex flex-col justify-center items-center h-full py-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-600 mb-4"></div>
                  <p className="text-xl font-semibold text-zinc-600">
                    webauthn
                  </p>
                  <p className="text-sm text-zinc-500 font-bold">interface</p>
                </div>
              </div>
              <div className="bg-green-400/10 border border-zinc-300 h-[200px] w-[300px] rounded-2xl shadow-md hover:rotate-3 hover:scale-105 transition duration-300 hover:cursor-pointer">
                <div className="flex flex-col justify-center items-center h-full py-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-600 mb-4"></div>
                  <p className="text-xl font-semibold text-zinc-600">
                    session keys
                  </p>
                  <p className="text-sm text-zinc-500 font-bold">gaming</p>
                </div>
              </div>
              <div className="bg-orange-600/10 border border-zinc-300 h-[200px] w-[400px] rounded-2xl shadow-md hover:rotate-3 hover:scale-90 transition duration-300 hover:cursor-pointer">
                <div className="flex flex-col justify-center items-center h-full py-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-600 mb-4"></div>
                  <p className="text-xl font-semibold text-zinc-600">
                    bundle transactions
                  </p>
                  <p className="text-sm text-zinc-500 font-bold">trading</p>
                </div>
              </div>
              <div className="bg-red-600/10 border border-zinc-300 h-[200px] w-[140px] rounded-2xl shadow-md hover:rotate-3 hover:scale-105 transition duration-300 hover:cursor-pointer">
                <div className="flex flex-col justify-center items-center h-full py-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-600 mb-4"></div>
                  <p className="text-base font-semibold text-zinc-600 text-center">
                    deadman switch
                  </p>
                  <p className="text-sm text-zinc-500 font-bold text-center">
                    security
                  </p>
                </div>
              </div>
              <div className="bg-blue-600/10 border border-zinc-300 h-[300px] w-[300px] rounded-2xl shadow-md hover:rotate-3 hover:scale-90 transition duration-300 hover:cursor-pointer">
                <div className="flex flex-col justify-center items-center h-full py-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-600 mb-4"></div>
                  <p className="text-xl font-semibold text-zinc-600">
                    metamask snap
                  </p>
                  <p className="text-sm text-zinc-500 font-bold">interface</p>
                </div>
              </div>
              <div className="bg-purple-600/10 border border-zinc-300 h-[200px] w-[200px] rounded-2xl shadow-md hover:rotate-3 hover:scale-105 transition duration-300 hover:cursor-pointer">
                <div className="flex flex-col justify-center items-center h-full py-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-600 mb-4"></div>
                  <p className="text-xl font-semibold text-zinc-600">
                    credit card
                  </p>
                  <p className="text-sm text-zinc-500 font-bold">banking</p>
                </div>
              </div>
              <div className="bg-green-400/10 border border-zinc-300 h-[300px] w-[200px] rounded-2xl shadow-md hover:rotate-3 hover:scale-90 transition duration-300 hover:cursor-pointer">
                <div className="flex flex-col justify-center items-center h-full py-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-600 mb-4"></div>
                  <p className="text-xl font-semibold text-zinc-600">
                    nft lending
                  </p>
                  <p className="text-sm text-zinc-500 font-bold">gaming</p>
                </div>
              </div>
              <div className="bg-red-600/10 border border-zinc-300 h-[200px] w-[300px] rounded-2xl shadow-md hover:rotate-3 hover:scale-105 transition duration-300 hover:cursor-pointer">
                <div className="flex flex-col justify-center items-center h-full py-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-600 mb-4"></div>
                  <p className="text-xl font-semibold text-zinc-600">
                    multi-factor authentification
                  </p>
                  <p className="text-sm text-zinc-500 font-bold">security</p>
                </div>
              </div>
              <div className="bg-yellow-600/10 border border-zinc-300 h-[200px] w-[140px] rounded-2xl shadow-md hover:rotate-3 hover:scale-90 transition duration-300 hover:cursor-pointer">
                <div className="flex flex-col justify-center items-center h-full py-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-600 mb-4"></div>
                  <p className="text-base font-semibold text-zinc-600 text-center">
                    social recovery
                  </p>
                  <p className="text-sm text-zinc-500 font-bold text-center">
                    recovery
                  </p>
                </div>
              </div>
              <div className="bg-lime-700/10 border border-zinc-300 h-[300px] w-[300px] rounded-2xl shadow-md hover:rotate-3 hover:scale-105 transition duration-300 hover:cursor-pointer">
                <div className="flex flex-col justify-center items-center h-full py-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-600 mb-4"></div>
                  <p className="text-xl font-semibold text-zinc-600">
                    nist p-256 curve
                  </p>
                  <p className="text-sm text-zinc-500 font-bold">advanced</p>
                </div>
              </div>
              <div className="bg-purple-600/10 border border-zinc-300 h-[140px] w-[200px] rounded-2xl shadow-md hover:rotate-3 hover:scale-90 transition duration-300 hover:cursor-pointer">
                <div className="flex flex-col justify-center items-center h-full py-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-600 mb-4"></div>
                  <p className="text-xl font-semibold text-zinc-600">
                    retirement scheme
                  </p>
                  <p className="text-sm text-zinc-500 font-bold">banking</p>
                </div>
              </div>
            </div>
            <p className="text-lg md:text-xl lg:text-2xl mt-12 text-zinc-700 font-semibold">
              and many more coming soon
            </p>
          </div>
        </section>
        <section className="h-[90vh] lg:h-[170vh] z-30 py-20 relative">
          {/* <div className="lg:h-[20vh] bg-[#f7f1e3] rounded-b-[3rem] lg:rounded-b-[8rem] z-40 relative"></div> */}
          <div className="h-[60vh] lg:h-[140vh] bg-zinc-800 flex flex-col justify-center items-center z-30 relative">
            <div
              className="mt-[20vh] lg:mt-[40vh] flex flex-col items-center"
              id="waitlist"
            >
              <p className="text-lg md:text-xl lg:text-2xl mb-12 text-zinc-200 font-semibold">
                join the waitlist
              </p>
              <div className="w-[90vw] md:w-[80vw] xl:w-[60vw] 2xl:w-[40vw] h-[400px] bg-transparent border border-zinc-200 rounded-3xl">
                <form
                  className="w-full h-full rounded-3xl flex flex-col justify-center items-center"
                  onSubmit={waitlistSignup}
                >
                  {signedUp ? (
                    <>
                      <Image
                        src={Wojak}
                        width={200}
                        height={200}
                        alt=""
                        placeholder="blur"
                      />
                      <p className="text-base lg:text-lg text-zinc-200 font-semibold mt-2">
                        gm abstractooor
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-base lg:text-lg text-zinc-200 font-semibold">
                        enter your email to join the waitlist
                      </p>
                      <div className="mt-4 w-[70%] sm:w-[60%] md:w-[40%] lg:w-[40%] xl:w-[40%]">
                        <input
                          type="email"
                          className="w-full h-12 px-4 rounded-2xl border border-zinc-300 bg-transparent focus:outline-none focus:ring-0 text-zinc-200"
                          placeholder="abstractooor@bigbrain.vc"
                          name="email"
                          required
                        />
                      </div>
                      <div className="mt-4 w-[70%] sm:w-[60%] md:w-[40%] lg:w-[40%] xl:w-[40%]">
                        <Button
                          onClick={() => {}}
                          backgroundColor="bg-transparent"
                          textColor="text-zinc-200"
                          additionalClasses="w-full px-12 py-2 border border-zinc-300 mt-1"
                          type="submit"
                          loading={signupLoading}
                        >
                          join the waitlist
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
        <footer className={`mb-0 bottom px-12`}>
          <div className="flex items-center justify-between px-12 py-10">
            <div className="font-semibold text-zinc-900">
              <div className="text-sm md:text-base text-zinc-200 text-center">
                made with 💎 by the oxford abstractooors
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
