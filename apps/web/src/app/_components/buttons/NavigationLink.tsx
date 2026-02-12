"use client";

import { cn } from "@/app/_lib";
import Link from "next/link";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  isActive?: boolean;
  isCurrentPage?: boolean;
  isMinimized?: boolean;
  index?: number;
  Icon?: ReactNode;
}

export const NavigationLink = ({
  className,
  children,
  Icon,
  href,
  isActive = false,
  isCurrentPage = false,
  isMinimized = false,
  index = 0,
  ...props
}: NavigationLinkProps) => {
  const baseClasses = "relative flex items-center justify-center gap-2 h-10 px-4 py-2 text-sm font-medium transition-all z-10 rounded-full";
  const activeClasses = isActive ? "text-white" : "text-stone-500 hover:text-stone-900";

  return (
    <Link
      href={href}
      className={cn(baseClasses, activeClasses, className)}
      onClick={(e) => {
        if (isCurrentPage) e.preventDefault();
      }}
      {...props}
    >
      <AnimatePresence initial={false} mode="wait">
        {isMinimized ? (
          <motion.span
            key="icon"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="w-4 h-4 flex items-center justify-center text-xs font-bold"
          >
            {Icon}
          </motion.span>
        ) : (
          <motion.div
            key="text"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="flex items-center gap-2"
          >
             {Icon}
             {children}
          </motion.div>
        )}
      </AnimatePresence>

    </Link>
  );
};