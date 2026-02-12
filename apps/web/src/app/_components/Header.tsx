"use client";

import { useState } from "react";
import { Logo } from "./Logo";
import { Navigation } from "./navigation";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

interface HeaderProps {}

export const Header = ({}: HeaderProps) => {
  const { scrollY } = useScroll();
  
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
      <Navigation isMinimized={isMinimized} />
    </motion.header>
  );
};
