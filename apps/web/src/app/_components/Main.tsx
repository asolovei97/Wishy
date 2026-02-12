'use client'
import { motion, useScroll, useTransform } from "framer-motion";
import { ComponentPropsWithoutRef } from "react";

interface MainProps  extends ComponentPropsWithoutRef<"main">{

}

export const Main = ({ children, ...props }: MainProps) => {
  const { scrollY } = useScroll();
  
  const paddingTop = useTransform(scrollY, [0, 100], ["96px", "56px"]);

  return (
    <motion.main style={{ paddingTop, height: "200dvh" }}>
      {children}
    </motion.main>
  )
}