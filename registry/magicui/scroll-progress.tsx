import { motion, useScroll, type MotionProps } from "motion/react";
import React from "react";
import { cn } from "@/lib/utils";

export interface ScrollProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof MotionProps> {
  ref?: React.Ref<HTMLDivElement>;
}

export function ScrollProgress({
  className,
  ref,
  ...props
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-neutral-900 dark:bg-white dark:shadow-[0_0_8px_rgba(255,255,255,0.4)]",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  );
}

export default ScrollProgress;
