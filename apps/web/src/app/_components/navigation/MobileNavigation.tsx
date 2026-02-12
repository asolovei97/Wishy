"use client";

import { motion, AnimatePresence } from "framer-motion";
import { links, profileLink } from "./config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/_lib";
import { useRef } from "react";
import { useClickOutside, useOutsideClick } from "@/app/_hooks/useOutsideClick";


interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  toggleRef: React.RefObject<HTMLElement | null>;
  isAuthenticated?: boolean;
}

export const MobileNavigation = ({ 
  isOpen, 
  onClose, 
  toggleRef,
  isAuthenticated = false 
}: MobileNavigationProps) => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside([containerRef, toggleRef], onClose, isOpen);

  const allLinks = [...links, ...(isAuthenticated ? [profileLink] : [])];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, height: 0, scale: 0.95 }}
          animate={{ opacity: 1, height: "auto", scale: 1 }}
          exit={{ opacity: 0, height: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="absolute top-full right-0 mt-4 bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden z-[100] py-2 flex flex-col gap-1 min-w-[56px] items-center"
        >

          {allLinks.map((link, index) => {
            const isActive = pathname === link.href;

            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "relative size-10 flex items-center justify-center rounded-full transition-colors",
                    isActive ? "bg-primary-500 text-white" : "text-stone-500 hover:text-stone-900"
                  )}
                >
                  {link.icon}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
