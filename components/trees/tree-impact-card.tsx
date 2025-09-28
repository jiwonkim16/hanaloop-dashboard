"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TreePine, Leaf, Wind, Droplets } from "lucide-react";

interface TreeImpactCardProps {
  treeCount: number;
  emissions: number;
}

export function TreeImpactCard({ treeCount, emissions }: TreeImpactCardProps) {
  // Environmental impact calculations
  const oxygenProduced = Math.round(treeCount * 260); // pounds per year per tree
  const co2Absorbed = Math.round(emissions * 1000); // convert tons to pounds
  const airFiltered = Math.round(treeCount * 27); // pounds of air pollutants per year
  const waterFiltered = Math.round(treeCount * 10); // gallons per day per tree

  const impactItems = [
    {
      icon: TreePine,
      label: "필요한 나무",
      value: treeCount.toLocaleString(),
      unit: "그루",
      color: "text-chart-2",
    },
    {
      icon: Wind,
      label: "산소 생산량",
      value: oxygenProduced.toLocaleString(),
      unit: "파운드/년",
      color: "text-blue-400",
    },
    {
      icon: Leaf,
      label: "CO₂ 흡수량",
      value: co2Absorbed.toLocaleString(),
      unit: "파운드/년",
      color: "text-chart-2",
    },
    {
      icon: Droplets,
      label: "정수 처리량",
      value: waterFiltered.toLocaleString(),
      unit: "갤런/일",
      color: "text-blue-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TreePine className="w-5 h-5 text-chart-2" />
          환경 영향 분석
        </CardTitle>
        <CardDescription>
          {emissions.toFixed(1)} 톤의 CO₂를 상쇄했을 때의 환경적 효과
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {impactItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted/30 rounded-lg p-4 text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex justify-center mb-2"
                >
                  <Icon className={`w-8 h-8 ${item.color}`} />
                </motion.div>
                <p className="text-2xl font-bold text-foreground">
                  {item.value}
                </p>
                <p className="text-xs text-muted-foreground">{item.unit}</p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {item.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
