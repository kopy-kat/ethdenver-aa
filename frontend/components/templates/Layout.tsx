import { Header } from "../organisms/Header";
import { Footer } from "../organisms/Footer";
import { TiWarningOutline } from "react-icons/ti";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../atoms/Button";
import { RiUserAddFill } from "react-icons/ri";
import Head from "next/head";

interface LayoutProps {
  children: React.ReactNode;
  headerColor?: string;
  headerTextColor?: string;
  footerColor?: string;
  footerTextColor?: string;
}

export function Layout({
  children,
  outsideOfBoxChildren,
}: {
  children: React.ReactNode;
  outsideOfBoxChildren?: React.ReactNode;
}) {
  return (
    <main className="">
      <Head>
        <title>rhinestone</title>
        <meta name="description" content="modular account abstraction" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <div className="pt-14 transition-position max-w-screen min-h-screen bg-gray-50 hidden md:flex flex-row">
        <main className="w-[100vw] flex flex-col">
          <section className="container flex-grow mx-auto">
            <section className="mx-auto">
              <Header />
            </section>
            <section className="bg-white rounded-3xl py-2 mt-8">
              <div className="mx-auto">{children}</div>
            </section>
            <section>{outsideOfBoxChildren}</section>
          </section>
          <section className="container">
            <Footer />
          </section>
        </main>
      </div> */}
      <div className="h-screen w-screen flex justify-center items-center bg-gray-100 text-xl lowercase">
        Coming soon
      </div>
      <div className="md:hidden h-screen w-screen flex justify-center items-center bg-gray-100 text-xl lowercase">
        No mobile support yet
      </div>
    </main>
  );
}
