"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TreeIcon } from "./tree-icon";

interface TreeForestProps {
  treeCount: number;
  maxDisplay?: number;
  animated?: boolean;
}

export function TreeForest({
  treeCount,
  maxDisplay = 100,
  animated = true,
}: TreeForestProps) {
  const displayData = useMemo(() => {
    const actualDisplay = Math.min(treeCount, maxDisplay);
    const remainder = Math.max(0, treeCount - maxDisplay);

    return {
      treesToShow: actualDisplay,
      remainingCount: remainder,
      rows: Math.ceil(actualDisplay / 10),
    };
  }, [treeCount, maxDisplay]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const treeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="space-y-4">
      <motion.div
        className="grid grid-cols-10 gap-2 p-4 bg-muted/30 rounded-lg"
        variants={containerVariants}
        initial={animated ? "hidden" : "visible"}
        animate="visible"
      >
        {Array.from({ length: displayData.treesToShow }, (_, index) => (
          <motion.div
            key={index}
            variants={treeVariants}
            whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
            className="flex justify-center"
          >
            <TreeIcon size="md" isAnimated={false} />
          </motion.div>
        ))}
      </motion.div>

      {displayData.remainingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center p-4 bg-muted/20 rounded-lg"
        >
          <p className="text-lg font-semibold text-foreground">
            + {displayData.remainingCount.toLocaleString()}그루 추가
          </p>
          <p className="text-sm text-muted-foreground">
            총합: 탄소 상쇄를 위해 {treeCount.toLocaleString()}그루의 나무가
            필요합니다
          </p>
        </motion.div>
      )}
    </div>
  );
}
