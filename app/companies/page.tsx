"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  fetchCompanies,
  fetchCountries,
  calculateTotalEmissions,
} from "@/lib/api";
import type { Company, Country } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  TrendingUp,
  MapPin,
  Zap,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Link from "next/link";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [companiesData, countriesData] = await Promise.all([
          fetchCompanies(),
          fetchCountries(),
        ]);
        setCompanies(companiesData);
        setCountries(countriesData);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // 기업별 데이터 계산
  const companiesWithMetrics = companies.map((company) => {
    const totalEmissions = calculateTotalEmissions(company);
    const country = countries.find((c) => c.code === company.country);
    const carbonTax = country ? totalEmissions * country.carbonTaxRate : 0;

    // 월별 트렌드 계산 (최근 3개월)
    const monthlyData: Record<string, number> = {};
    company.emissions.forEach((emission) => {
      if (!monthlyData[emission.yearMonth]) {
        monthlyData[emission.yearMonth] = 0;
      }
      monthlyData[emission.yearMonth] += emission.emissions;
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    const recentMonths = sortedMonths.slice(-3);
    const trend =
      recentMonths.length >= 2
        ? monthlyData[recentMonths[recentMonths.length - 1]] -
          monthlyData[recentMonths[0]]
        : 0;

    return {
      ...company,
      totalEmissions,
      carbonTax,
      country: country?.name || company.country,
      carbonTaxRate: country?.carbonTaxRate || 0,
      trend,
      monthlyData,
    };
  });

  // 배출량 순으로 정렬
  const sortedCompanies = companiesWithMetrics.sort(
    (a, b) => b.totalEmissions - a.totalEmissions
  );

  // 비교 차트 데이터
  const comparisonChartData = {
    labels: sortedCompanies.map((company) => company.name),
    datasets: [
      {
        label: "총 배출량 (톤 CO₂)",
        data: sortedCompanies.map((company) => company.totalEmissions),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
      },
      {
        label: "탄소세 부담액 ($)",
        data: sortedCompanies.map((company) => company.carbonTax / 1000), // 천 단위로 조정
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
        yAxisID: "y1",
      },
    ],
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUpRight className="w-4 h-4 text-red-500" />;
    if (trend < 0) return <ArrowDownRight className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-red-500";
    if (trend < 0) return "text-green-500";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-20" />
          <Skeleton className="h-[400px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
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
              <Building2 className="w-8 h-8 text-chart-3" />
              기업 배출량 현황
            </h1>
            <p className="text-muted-foreground mt-2">
              등록된 기업들의 탄소 배출량을 비교하고 분석합니다
            </p>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{companies.length}</div>
              <p className="text-xs text-muted-foreground">등록 기업 수</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {sortedCompanies
                  .reduce((sum, company) => sum + company.totalEmissions, 0)
                  .toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                총 배출량 (톤 CO₂)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                $
                {sortedCompanies
                  .reduce((sum, company) => sum + company.carbonTax, 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">총 탄소세 부담액</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {new Set(companies.map((c) => c.country)).size}
              </div>
              <p className="text-xs text-muted-foreground">참여 국가 수</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                기업별 배출량 및 탄소세 비교
              </CardTitle>
              <CardDescription>
                모든 기업의 총 배출량과 탄소세 부담액을 한눈에 비교
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: "400px" }}>
                                  <Bar
                    data={comparisonChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        mode: "index" as const,
                        intersect: false,
                      },
                      plugins: {
                        legend: {
                          position: "top" as const,
                        },
                      },
                      scales: {
                        x: {
                          display: true,
                          title: {
                            display: true,
                            text: "기업명",
                          },
                        },
                        y: {
                          type: "linear" as const,
                          display: true,
                          position: "left" as const,
                          title: {
                            display: true,
                            text: "배출량 (톤 CO₂)",
                          },
                        },
                        y1: {
                          type: "linear" as const,
                          display: true,
                          position: "right" as const,
                          title: {
                            display: true,
                            text: "탄소세 (천달러)",
                          },
                          grid: {
                            drawOnChartArea: false,
                          },
                        },
                      },
                    }}
                  />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Company Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {company.country}
                      </CardDescription>
                    </div>
                    <Badge variant={index < 3 ? "destructive" : "secondary"}>
                      #{index + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Zap className="w-3 h-3" />총 배출량
                      </div>
                      <div className="font-bold">
                        {company.totalEmissions.toFixed(1)} 톤
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <DollarSign className="w-3 h-3" />
                        탄소세
                      </div>
                      <div className="font-bold text-red-600">
                        ${company.carbonTax.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Trend */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      3개월 트렌드
                    </span>
                    <div
                      className={`flex items-center gap-1 ${getTrendColor(
                        company.trend
                      )}`}
                    >
                      {getTrendIcon(company.trend)}
                      <span className="text-sm font-medium">
                        {company.trend > 0 ? "+" : ""}
                        {company.trend.toFixed(1)} 톤
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2">
                    <Link href={`/emissions?company=${company.id}`}>
                      <Button variant="outline" className="w-full">
                        상세 분석 보기
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
