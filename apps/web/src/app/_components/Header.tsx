"use client";

import { useState, useRef } from "react";

import { Logo } from "./Logo";
import { Navigation, MobileNavigation } from "./navigation";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { cn } from "@/app/_lib";

interface HeaderProps {}

export const Header = ({}: HeaderProps) => {
  const { scrollY } = useScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  
  const paddingY = useTransform(scrollY, [0, 100], ["24px", "4px"]);
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.9)"]
  );

  const [isMinimized, setIsMinimized] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsMinimized(latest > 50);
  });

  return (
    <motion.header 
      layout
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 border-b border-stone-200/60 backdrop-blur-md transition-shadow duration-500"
      style={{
        paddingTop: paddingY,
        paddingBottom: paddingY,
        backgroundColor,
      }}
    >
      <Logo isMinimized={isMinimized} />
      
      <div className="hidden md:flex">
        <Navigation isMinimized={isMinimized} />
      </div>

      <div className="flex md:hidden relative items-center">
        <button
          ref={toggleRef}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={cn(
            "size-10 flex items-center justify-center rounded-full transition-all text-stone-900 border border-stone-200",
            isMobileMenuOpen ? "bg-stone-100" : "bg-white"
          )}
        >
          {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <MobileNavigation 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          toggleRef={toggleRef}
        />
      </div>
    </motion.header>
  );
};


