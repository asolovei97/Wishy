'use client'
import { motion, useScroll, useTransform } from "framer-motion";
import { ComponentPropsWithoutRef } from "react";

interface MainProps  extends ComponentPropsWithoutRef<"main">{

}

export const Main = ({ children }: MainProps) => {
  const { scrollY } = useScroll();
  
  const paddingTop = useTransform(scrollY, [0, 100], ["96px", "56px"]);

  return (
    <motion.main className="top-0 left-0 right-0 z-0 p-12" style={{ paddingTop }}>
      {children}
    </motion.main>
  )
}