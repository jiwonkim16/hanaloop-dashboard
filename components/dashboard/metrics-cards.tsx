"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Leaf,
} from "lucide-react";
import type { Company, Country } from "@/lib/types";
import {
  calculateTotalEmissions,
  calculateCarbonTax,
  convertEmissionsToTrees,
} from "@/lib/api";

interface MetricsCardsProps {
  companies: Company[];
  countries: Country[];
}

export function MetricsCards({ companies, countries }: MetricsCardsProps) {
  const metrics = useMemo(() => {
    const totalEmissions = companies.reduce(
      (sum, company) => sum + calculateTotalEmissions(company),
      0
    );
    const totalTax = companies.reduce(
      (sum, company) => sum + calculateCarbonTax(company, countries),
      0
    );
    const totalTrees = convertEmissionsToTrees(totalEmissions);

    // Calculate month-over-month change (simplified)
    const currentMonth = companies.reduce((sum, company) => {
      const latestEmissions = company.emissions
        .filter((e) => e.yearMonth === "2024-06")
        .reduce((s, e) => s + e.emissions, 0);
      return sum + latestEmissions;
    }, 0);

    const previousMonth = companies.reduce((sum, company) => {
      const prevEmissions = company.emissions
        .filter((e) => e.yearMonth === "2024-05")
        .reduce((s, e) => s + e.emissions, 0);
      return sum + prevEmissions;
    }, 0);

    const changePercent =
      previousMonth > 0
        ? ((currentMonth - previousMonth) / previousMonth) * 100
        : 0;

    return {
      totalEmissions,
      totalTax,
      totalTrees,
      changePercent,
      isIncrease: changePercent > 0,
    };
  }, [companies, countries]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  const iconVariants = {
    hover: {
      rotate: [0, -10, 10, 0],
      scale: 1.1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{ delay: 0 }}
      >
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 기업 수</CardTitle>
            <motion.div variants={iconVariants} whileHover="hover">
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={companies.length} duration={1} />
            </div>
            <p className="text-xs text-muted-foreground">
              {new Set(companies.map((c) => c.country)).size}개국에 걸쳐
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{ delay: 0.1 }}
      >
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 배출량</CardTitle>
            <motion.div variants={iconVariants} whileHover="hover">
              {metrics.isIncrease ? (
                <TrendingUp className="h-4 w-4 text-destructive" />
              ) : (
                <TrendingDown className="h-4 w-4 text-chart-2" />
              )}
            </motion.div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={metrics.totalEmissions} duration={1.5} />
            </div>
            <p className="text-xs text-muted-foreground">
              <motion.span
                className={
                  metrics.isIncrease ? "text-destructive" : "text-chart-2"
                }
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {metrics.isIncrease ? "+" : ""}
                {metrics.changePercent.toFixed(1)}%
              </motion.span>
              전월 대비
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{ delay: 0.2 }}
      >
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">탄소세</CardTitle>
            <motion.div variants={iconVariants} whileHover="hover">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter
                value={metrics.totalTax}
                duration={2}
                prefix="$"
              />
            </div>
            <p className="text-xs text-muted-foreground">현재 세율 기준</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{ delay: 0.3 }}
      >
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              필요한 나무 수
            </CardTitle>
            <motion.div variants={iconVariants} whileHover="hover">
              <Leaf className="h-4 w-4 text-chart-2" />
            </motion.div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={metrics.totalTrees} duration={2.5} />
            </div>
            <p className="text-xs text-muted-foreground">
              상쇄에 필요한 나무 수
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
