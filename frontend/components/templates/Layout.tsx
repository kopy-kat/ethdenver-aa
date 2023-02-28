import { Header } from "../organisms/Header";
import { Footer } from "../organisms/Footer";
import { TiWarningOutline } from "react-icons/ti";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../atoms/Button";
import { RiUserAddFill } from "react-icons/ri";

interface LayoutProps {
  children: React.ReactNode;
  headerColor?: string;
  headerTextColor?: string;
  footerColor?: string;
  footerTextColor?: string;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [emailError, setEmailError] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<boolean>(false);
  const [signupLoading, setSignupLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  function resetForm() {
    setEmailError(false);
    setSubmissionError(false);
  }

  return (
    <main className="">
      <div className="pt-14 transition-position max-w-screen min-h-screen bg-gray-50 hidden md:flex flex-row">
        <main className="w-[100vw] flex flex-col">
          <section className="container flex-grow mx-auto">
            <section className="mx-auto">
              <Header />
            </section>
            <section className="bg-white rounded-3xl py-2 mt-8 md:mr-2 lg:mr-3 xl:mr-6">
              <div className="mx-auto">{children}</div>
            </section>
          </section>
          <section className="container">
            <Footer />
          </section>
        </main>
      </div>
      <div className="md:hidden h-screen w-screen flex justify-center items-center bg-gray-100 text-xl">
        No mobile support yet
      </div>
    </main>
  );
}
