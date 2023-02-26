import { FaTwitter } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { default as Logo } from "../../../public/logo.png";

export function Footer({
  backgroundColor = "bg-transparent",
  textColor = "text-dark-zinc",
}: {
  backgroundColor?: string;
  textColor?: string;
}) {
  return (
    <footer className={`mb-0 bottom ${backgroundColor} ${textColor} px-12`}>
      <div className="flex items-center justify-between px-12 py-10">
        <div className="font-semibold text-zinc-900">
          <div className="">Made with ❤️ by the Oxford Team.</div>
        </div>
      </div>
    </footer>
  );
}
