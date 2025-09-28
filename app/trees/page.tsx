"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TreeForest } from "@/components/trees/tree-forest";
import { TreeImpactCard } from "@/components/trees/tree-impact-card";
import { TreeComparison } from "@/components/trees/tree-comparison";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchCompanies } from "@/lib/api";
import { calculateTotalEmissions, convertEmissionsToTrees } from "@/lib/api";
import type { Company } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { TreePine, RefreshCw } from "lucide-react";

export default function TreesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const companiesData = await fetchCompanies();
      setCompanies(companiesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const totalEmissions = companies.reduce(
    (sum, company) => sum + calculateTotalEmissions(company),
    0
  );
  const totalTrees = convertEmissionsToTrees(totalEmissions);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-20" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px]" />
          </div>
          <Skeleton className="h-[300px]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <TreePine className="w-8 h-8 text-chart-2" />
              탄소 중립 나무 계산기
            </h1>
            <p className="text-muted-foreground mt-2">
              배출된 탄소를 상쇄하기 위해 필요한 나무의 수를 계산하고 확인합니다
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            새로고침
          </Button>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-chart-2/10 to-chart-3/10 border-chart-2/20">
            <CardHeader>
              <CardTitle className="text-2xl">탄소 흡수 요약</CardTitle>
              <CardDescription>
                귀하 조직의 총 배출량은 상당한 식림 노력이 필요합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-chart-2">
                    {totalEmissions.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    이산화탄소 톤(당량)
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-chart-3">
                    {totalTrees.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    필요한 나무 수
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-chart-4">
                    {Math.round(totalTrees / 400)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    산림 면적(에이커)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tree Forest Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>나무 시각적 표현</CardTitle>
              <CardDescription>
                각 나무는 배출량을 상쇄하는 데 필요한 탄소 흡수 능력을
                나타냅니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TreeForest treeCount={totalTrees} maxDisplay={100} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Impact and Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TreeImpactCard treeCount={totalTrees} emissions={totalEmissions} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TreeComparison emissions={totalEmissions} treeCount={totalTrees} />
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
