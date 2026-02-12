"use client";

import Link from "next/link";
import { BodyLarge } from "./Typography";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/app/_lib";


interface LogoProps {
  isMinimized?: boolean;
}

export const Logo = ({ isMinimized = false }: LogoProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="/"
      className="relative inline-flex items-center h-12 p-1 rounded-full bg-white transition-all overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute bg-primary-500 rounded-full z-0"
        initial={false}
        animate={{
          width: isHovered ? "100%" : "40px",
          height: isHovered ? "100%" : "40px",
          top: isHovered ? "0px" : "4px",
          left: isHovered ? "0px" : "4px",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      />

      <div className="relative z-10 size-10 flex justify-center items-center pointer-events-none">
        <BodyLarge color="white" className="m-0 leading-none font-bold">W</BodyLarge>
      </div>

      <AnimatePresence initial={false} mode="popLayout">
        {!isMinimized && (
          <motion.div
            key="logo-text"
            initial={{ opacity: 0, width: 0, x: -10 }}
            animate={{ opacity: 1, width: "auto", x: 0 }}
            exit={{ opacity: 0, width: 0, x: -10 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.32, 0.72, 0, 1] // Custom quint ease for premium feel
            }}
            className="overflow-hidden"
          >
            <BodyLarge
              color={isHovered ? "white" : "stone-900"}
              className="relative z-10 px-4 m-0 transition-colors duration-300 font-bold whitespace-nowrap"
            >
              Wishy
            </BodyLarge>
          </motion.div>
        )}
      </AnimatePresence>

    </Link>
  );
};





