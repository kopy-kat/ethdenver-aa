import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useEffect } from "react";
import { motion } from "framer-motion";

const dropIn = {
  hidden: {
    y: "-2vh",
    opacity: 0.8,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "5vh",
    opacity: 0,
  },
};

export function GenericModal({
  children,
  closeModal,
  title,
  backgroundColor = "bg-white",
  hideCloseButton = false,
}: {
  children: React.ReactNode;
  closeModal: () => void;
  title: string | React.ReactNode;
  backgroundColor?: string;
  hideCloseButton?: boolean;
}) {
  useEffect(() => {
    const keyDownHandler = (e: any) => {
      if (e.code == "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);
  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-4 backdrop-blur-sm"
        onClick={closeModal}
      >
        <div
          className="relative w-auto my-6 mx-auto max-w-7xl max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className={`border-0 rounded-3xl shadow-lg relative flex flex-col w-full ${backgroundColor} text-black outline-none focus:outline-none mb-8`}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-start justify-between px-5 py-5">
              <h3 className="text-3xl font-semibold">{title}</h3>
              {!hideCloseButton && (
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={closeModal}
              >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none ml-20">
                  <AiOutlineCloseCircle size={30} className="text-zinc-800" />
                </span>
              </button>)}
            </div>
            <div className="">{children}</div>
          </motion.div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
