"use client";

import { motion } from "framer-motion";
import { TreePine } from "lucide-react";

interface TreeIconProps {
  size?: "sm" | "md" | "lg";
  delay?: number;
  isAnimated?: boolean;
}

export function TreeIcon({
  size = "md",
  delay = 0,
  isAnimated = true,
}: TreeIconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const TreeComponent = isAnimated ? motion(TreePine) : TreePine;

  const animationProps = isAnimated
    ? {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: {
          delay: delay * 0.1,
          duration: 0.5,
          type: "spring" as const,
          stiffness: 100,
        },
        whileHover: { scale: 1.1 },
        className: `${sizeClasses[size]} text-green-600 cursor-pointer`,
      }
    : {
        className: `${sizeClasses[size]} text-green-600`,
      };

  return <TreeComponent {...animationProps} />;
}
