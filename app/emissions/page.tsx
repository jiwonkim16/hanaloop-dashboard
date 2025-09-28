"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Factory,
  DollarSign,
  TrendingUp,
  Zap,
  Fuel,
} from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function EmissionsPage() {
  const searchParams = useSearchParams();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
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

        // URL 파라미터에서 기업 ID 확인
        const companyParam = searchParams.get("company");
        if (companyParam && companiesData.find((c) => c.id === companyParam)) {
          setSelectedCompanyId(companyParam);
        } else if (companiesData.length > 0) {
          setSelectedCompanyId(companiesData[0].id);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [searchParams]);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
  const selectedCountry = selectedCompany
    ? countries.find((country) => country.code === selectedCompany.country)
    : null;

  // 월별 배출량 데이터 계산
  const monthlyEmissions =
    selectedCompany?.emissions.reduce((acc, emission) => {
      const month = emission.yearMonth;
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += emission.emissions;
      return acc;
    }, {} as Record<string, number>) || {};

  // 에너지원별 배출량 데이터 계산
  const emissionsBySource =
    selectedCompany?.emissions.reduce((acc, emission) => {
      if (!acc[emission.source]) {
        acc[emission.source] = 0;
      }
      acc[emission.source] += emission.emissions;
      return acc;
    }, {} as Record<string, number>) || {};

  // 총 배출량 및 탄소세 계산
  const totalEmissions = selectedCompany
    ? calculateTotalEmissions(selectedCompany)
    : 0;
  const totalCarbonTax = selectedCountry
    ? totalEmissions * selectedCountry.carbonTaxRate
    : 0;

  // 에너지원별 한글 라벨 매핑
  const sourceLabels: Record<string, string> = {
    gasoline: "가솔린",
    diesel: "디젤",
    natural_gas: "천연가스",
    electricity: "전기",
    lpg: "LPG",
    coal: "석탄",
    biomass: "바이오매스",
  };

  // 차트 데이터 준비
  const monthlyChartData = {
    labels: Object.keys(monthlyEmissions).sort(),
    datasets: [
      {
        label: "월별 배출량 (톤 CO₂)",
        data: Object.keys(monthlyEmissions)
          .sort()
          .map((month) => monthlyEmissions[month]),
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(34, 197, 94, 0.6)";
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(34, 197, 94, 0.8)");
          gradient.addColorStop(0.6, "rgba(34, 197, 94, 0.3)");
          gradient.addColorStop(1, "rgba(34, 197, 94, 0.05)");
          return gradient;
        },
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(34, 197, 94)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "rgb(34, 197, 94)",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 4,
      },
    ],
  };

  const sourceChartData = {
    labels: Object.keys(emissionsBySource).map(
      (source) => sourceLabels[source] || source
    ),
    datasets: [
      {
        data: Object.values(emissionsBySource),
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",   // 에메랄드
          "rgba(59, 130, 246, 0.8)",  // 블루
          "rgba(168, 85, 247, 0.8)",  // 퍼플
          "rgba(245, 158, 11, 0.8)",  // 앰버
          "rgba(239, 68, 68, 0.8)",   // 레드
          "rgba(16, 185, 129, 0.8)",  // 틸
          "rgba(244, 63, 94, 0.8)",   // 로즈
          "rgba(139, 92, 246, 0.8)",  // 바이올렛
          "rgba(6, 182, 212, 0.8)",   // 시안
          "rgba(251, 146, 60, 0.8)",  // 오렌지
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(59, 130, 246)",
          "rgb(168, 85, 247)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
          "rgb(16, 185, 129)",
          "rgb(244, 63, 94)",
          "rgb(139, 92, 246)",
          "rgb(6, 182, 212)",
          "rgb(251, 146, 60)",
        ],
        borderWidth: 3,
        hoverBackgroundColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(244, 63, 94, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(6, 182, 212, 1)",
          "rgba(251, 146, 60, 1)",
        ],
        hoverBorderWidth: 4,
        spacing: 2,
      },
    ],
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-20" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px]" />
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
              <BarChart3 className="w-8 h-8 text-chart-1" />
              기업별 배출량 분석
            </h1>
            <p className="text-muted-foreground mt-2">
              개별 기업의 탄소 배출량과 탄소세 부담액을 상세 분석합니다
            </p>
          </div>
        </motion.div>

        {/* Company Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="w-5 h-5" />
                분석 대상 기업 선택
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedCompanyId}
                onValueChange={setSelectedCompanyId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="기업을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name} (
                      {countries.find((c) => c.code === company.country)?.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </motion.div>

        {selectedCompany && (
          <>
            {/* Metrics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    총 배출량
                  </CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalEmissions.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">톤 CO₂ 환산</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    탄소세 부담액
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    ${totalCarbonTax.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedCountry?.name} 기준 ($
                    {selectedCountry?.carbonTaxRate}/톤)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    주요 배출원
                  </CardTitle>
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Object.keys(emissionsBySource).length > 0
                      ? sourceLabels[
                          Object.keys(emissionsBySource).reduce((a, b) =>
                            emissionsBySource[a] > emissionsBySource[b] ? a : b
                          )
                        ]
                      : "-"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Object.keys(emissionsBySource).length}개 에너지원 사용
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Emissions Trend */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      월별 배출량 추이
                    </CardTitle>
                    <CardDescription>
                      {selectedCompany.name}의 월별 탄소 배출량 변화
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div style={{ height: "300px" }}>
                                              <Line
                          data={monthlyChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            interaction: {
                              intersect: false,
                              mode: 'index' as const,
                            },
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                enabled: true,
                                backgroundColor: "rgba(15, 23, 42, 0.95)",
                                titleColor: "#f8fafc",
                                bodyColor: "#e2e8f0",
                                borderColor: "rgba(34, 197, 94, 0.4)",
                                borderWidth: 2,
                                cornerRadius: 16,
                                displayColors: false,
                                padding: 20,
                                titleFont: {
                                  size: 16,
                                  weight: 600,
                                },
                                bodyFont: {
                                  size: 14,
                                  weight: 400,
                                },
                                callbacks: {
                                  title: (context: any) => {
                                    return context[0].label;
                                  },
                                  label: (context: any) => {
                                    return `배출량: ${context.parsed.y.toLocaleString()}톤 CO₂`;
                                  },
                                },
                              },
                            },
                            scales: {
                              x: {
                                border: {
                                  color: "rgba(148, 163, 184, 0.2)",
                                  width: 1,
                                },
                                grid: {
                                  color: "rgba(148, 163, 184, 0.1)",
                                  lineWidth: 1,
                                  drawTicks: false,
                                },
                                ticks: {
                                  color: "#cbd5e1",
                                  font: {
                                    size: 12,
                                    weight: 500,
                                  },
                                  padding: 12,
                                },
                              },
                              y: {
                                beginAtZero: true,
                                border: {
                                  color: "rgba(148, 163, 184, 0.2)",
                                  width: 1,
                                },
                                grid: {
                                  color: "rgba(148, 163, 184, 0.1)",
                                  lineWidth: 1,
                                  drawTicks: false,
                                },
                                ticks: {
                                  color: "#cbd5e1",
                                  font: {
                                    size: 12,
                                    weight: 500,
                                  },
                                  padding: 12,
                                  callback: function (value: any) {
                                    return `${value.toLocaleString()}톤`;
                                  },
                                },
                                title: {
                                  display: true,
                                  text: "배출량 (톤 CO₂)",
                                  color: "#e2e8f0",
                                  font: {
                                    size: 14,
                                    weight: 600,
                                  },
                                  padding: 20,
                                },
                              },
                            },
                            animation: {
                              duration: 1500,
                              easing: 'easeInOutQuart' as const,
                            },
                          }}
                        />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Emissions by Source */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Fuel className="w-5 h-5" />
                      에너지원별 배출량
                    </CardTitle>
                    <CardDescription>
                      전체 배출량 중 에너지원별 비중
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div style={{ height: "300px" }}>
                                              <Doughnut
                          data={sourceChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: '60%',
                            plugins: {
                              legend: {
                                position: "bottom",
                                labels: {
                                  color: "#f8fafc",
                                  font: {
                                    family: "var(--font-geist-sans)",
                                    size: 12,
                                    weight: 500,
                                  },
                                  padding: 15,
                                  usePointStyle: true,
                                  pointStyle: 'circle',
                                },
                              },
                              tooltip: {
                                enabled: true,
                                backgroundColor: "rgba(15, 23, 42, 0.95)",
                                titleColor: "#f8fafc",
                                bodyColor: "#e2e8f0",
                                borderColor: "rgba(168, 85, 247, 0.4)",
                                borderWidth: 2,
                                cornerRadius: 16,
                                displayColors: true,
                                padding: 20,
                                titleFont: {
                                  size: 16,
                                  weight: 600,
                                },
                                bodyFont: {
                                  size: 14,
                                  weight: 400,
                                },
                                callbacks: {
                                  title: (context: any) => {
                                    return context[0].label;
                                  },
                                  label: (context: any) => {
                                    const total = Object.values(emissionsBySource).reduce((a: number, b: number) => a + b, 0);
                                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                                    return [
                                      `배출량: ${context.parsed.toLocaleString()}톤 CO₂`,
                                      `비중: ${percentage}%`
                                    ];
                                  },
                                },
                              },
                            },
                            elements: {
                              arc: {
                                borderWidth: 3,
                                borderColor: '#0f172a',
                                hoverBorderWidth: 4,
                              },
                            },
                            animation: {
                              duration: 1500,
                              easing: 'easeInOutQuart' as const,
                              animateRotate: true,
                              animateScale: true,
                            },
                          }}
                        />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Detailed Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>상세 배출량 내역</CardTitle>
                  <CardDescription>
                    에너지원별 월별 배출량 및 탄소세 부담액
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(emissionsBySource).map(
                      ([source, emissions]) => {
                        const carbonTax = selectedCountry
                          ? emissions * selectedCountry.carbonTaxRate
                          : 0;
                        const percentage = (emissions / totalEmissions) * 100;

                        return (
                          <div
                            key={source}
                            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                          >
                            <div>
                              <h4 className="font-medium">
                                {sourceLabels[source] || source}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {emissions.toFixed(1)} 톤 CO₂ (
                                {percentage.toFixed(1)}%)
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-red-600">
                                ${carbonTax.toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                탄소세
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
