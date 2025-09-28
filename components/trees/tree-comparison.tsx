"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TreePine, Building, Car, Plane } from "lucide-react";

interface TreeComparisonProps {
  emissions: number;
  treeCount: number;
}

export function TreeComparison({ emissions, treeCount }: TreeComparisonProps) {
  const comparisons = useMemo(
    () => [
      {
        icon: Car,
        label: "자동차 운행",
        value: Math.round(emissions * 2204), // 1 ton CO2 ≈ 2,204 miles
        unit: "마일",
        description: "자동차 운행과 동일",
        color: "text-yellow-500",
      },
      {
        icon: Plane,
        label: "비행기 운항",
        value: Math.round(emissions * 2.3), // 1 ton CO2 ≈ 2.3 hours of flight
        unit: "시간",
        description: "항공 운항과 동일",
        color: "text-blue-500",
      },
      {
        icon: Building,
        label: "가정 에너지",
        value: Math.round(emissions * 1.2), // 1 ton CO2 ≈ 1.2 months of home energy
        unit: "개월",
        description: "가정 에너지 사용과 동일",
        color: "text-orange-500",
      },
    ],
    [emissions]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TreePine className="w-5 h-5 text-chart-2" />
          탄소 발자국 비교
        </CardTitle>
        <CardDescription>
          {emissions.toFixed(1)} 톤의 CO₂를 일상적인 활동으로 이해해보세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tree Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">상쇄 필요 나무</span>
            <span className="text-sm text-muted-foreground">
              {treeCount.toLocaleString()}그루
            </span>
          </div>
          <Progress
            value={Math.min((treeCount / 1000) * 100, 100)}
            className="h-2"
          />
          <p className="text-xs text-muted-foreground">
            {treeCount < 1000
              ? "1,000그루 미만의 나무 필요"
              : "대규모 조림이 필요합니다"}
          </p>
        </div>

        {/* Comparisons */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">동등한 활동량</h4>
          {comparisons.map((comparison, index) => {
            const Icon = comparison.icon;
            return (
              <motion.div
                key={comparison.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex-shrink-0"
                >
                  <Icon className={`w-6 h-6 ${comparison.color}`} />
                </motion.div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {comparison.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {comparison.value.toLocaleString()} {comparison.unit}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
