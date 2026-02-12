"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavigationLink } from "../buttons";
import { ButtonLink } from "../buttons/Button";
import { cn } from "@/app/_lib";
import { links, profileLink } from "./config.tsx";

interface NavigationProps {
  activePage?: string;
  isAuthenticated?: boolean;
  isMinimized?: boolean;
}

export const Navigation = ({ activePage = "/", isAuthenticated = false, isMinimized = false }: NavigationProps) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // The pill is either on the hovered tab or the active page
  const activePillTab = hoveredTab || activePage;

  return (
    <div className="flex items-center gap-3">
      <motion.nav 
        layout
        className={cn(
          "relative flex items-center py-1.5 bg-white backdrop-blur-md rounded-full border border-stone-200 shadow-sm transition-all duration-500",
          isMinimized ? "px-1.5 gap-0.5" : "px-6 gap-4"
        )}
        onMouseLeave={() => setHoveredTab(null)}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      >
        {links.map((tab, idx) => {
          const isHighlighted = activePillTab === tab.href;
          
          return (
            <div
              key={tab.href}
              className="relative"
              onMouseEnter={() => setHoveredTab(tab.href)}
            >
              {isHighlighted && (
                <motion.div
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 bg-primary-500 rounded-full shadow-sm z-0"
                  transition={{
                    type: "spring",
                    bounce: 0.15,
                    duration: 0.5
                  }}
                />
              )}
              
              <NavigationLink
                href={tab.href}
                isActive={isHighlighted}
                isCurrentPage={tab.href === activePage}
                isMinimized={isMinimized}
                index={idx}
                Icon={tab.icon}
                className={cn(
                  "relative z-10 transition-colors duration-300",
                  isHighlighted ? "text-white" : "text-stone-500",
                  isMinimized && "px-1 w-8 h-8"
                )}
              >
                {tab.label}
              </NavigationLink>
            </div>
          );
        })}

        {/* Auth-related link merged into the bar when authenticated */}
        {isAuthenticated && (
          <div
            className="relative"
            onMouseEnter={() => setHoveredTab(profileLink.href)}
          >
             {activePillTab === profileLink.href && (
              <motion.div
                layoutId="nav-hover-pill"
                className="absolute inset-0 bg-primary-500 rounded-full shadow-sm z-0"
                transition={{
                  type: "spring",
                  bounce: 0.15,
                  duration: 0.5
                }}
              />
            )}
            <NavigationLink
              href={profileLink.href}
              isActive={activePillTab === profileLink.href}
              isCurrentPage={activePage === profileLink.href}
              isMinimized={isMinimized}
              index={99}
              Icon={profileLink.icon}
              className={cn(
                "relative z-10 transition-colors duration-300",
                activePillTab === profileLink.href ? "text-white" : "text-stone-500",
                isMinimized && "px-1 w-8 h-8"
              )}
            >
              Profile
            </NavigationLink>
          </div>
        )}
      </motion.nav>

      {!isAuthenticated && (
        <ButtonLink 
          href="/login" 
          variant="primary" 
          size="sm"
          className={cn(
            "rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 whitespace-nowrap",
            isMinimized ? "px-3 h-8 text-xs" : "px-6 h-10"
          )}
        >
          Sign In
        </ButtonLink>
      )}
    </div>
  );
};


