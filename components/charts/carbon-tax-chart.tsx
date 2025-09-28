"use client";

import { useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FloatingParticles } from "@/components/ui/floating-particles";
import {
  chartColors,
  vibrantColors,
  vibrantBorderColors,
} from "@/lib/chart-styles";
import type { Company, Country } from "@/lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CarbonTaxChartProps {
  companies: Company[];
  countries: Country[];
}

export function CarbonTaxChart({ companies, countries }: CarbonTaxChartProps) {
  const chartRef = useRef<any>(null);

  const chartData = useMemo(() => {
    // 기업별 총 배출량 계산
    const companyTotals = companies.map((company) => {
      const totalEmissions = company.emissions.reduce(
        (sum, emission) => sum + emission.emissions,
        0
      );
      const country = countries.find((c) => c.code === company.country);
      const carbonTax = country ? totalEmissions * country.carbonTaxRate : 0;

      return {
        name: company.name,
        emissions: totalEmissions,
        carbonTax: carbonTax,
        country: country?.name || company.country,
      };
    });

    // 탄소세 기준으로 정렬
    companyTotals.sort((a, b) => b.carbonTax - a.carbonTax);

    return {
      labels: companyTotals.map((company) => company.name),
      datasets: [
        {
          label: "탄소세 부담액 ($)",
          data: companyTotals.map((company) => company.carbonTax),
          backgroundColor: (context: any) => {
            const index = context.dataIndex;
            return vibrantColors[index % vibrantColors.length];
          },
          borderColor: (context: any) => {
            const index = context.dataIndex;
            return vibrantBorderColors[index % vibrantBorderColors.length];
          },
          borderWidth: 2,
          borderRadius: {
            topLeft: 8,
            topRight: 8,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: false,
          hoverBackgroundColor: (context: any) => {
            const index = context.dataIndex;
            const color = vibrantColors[index % vibrantColors.length];
            return color.replace("0.8", "1");
          },
          hoverBorderWidth: 3,
          hoverBorderColor: (context: any) => {
            const index = context.dataIndex;
            return vibrantBorderColors[index % vibrantBorderColors.length];
          },
        },
      ],
      companyData: companyTotals,
    };
  }, [companies, countries]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index" as const,
      },
      plugins: {
        legend: {
          display: false, // 단일 데이터셋이므로 범례 숨김
        },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          titleColor: "#f8fafc",
          bodyColor: "#e2e8f0",
          borderColor: "rgba(245, 158, 11, 0.4)",
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
              const company = chartData.companyData[context[0].dataIndex];
              return `${context[0].label} (${company.country})`;
            },
            label: (context: any) => {
              const company = chartData.companyData[context.dataIndex];
              return [
                `탄소세: $${context.parsed.y.toLocaleString()}`,
                `배출량: ${company.emissions.toLocaleString()}톤 CO₂`,
              ];
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
            maxRotation: 45,
            minRotation: 0,
          },
          title: {
            display: true,
            text: "기업명",
            color: "#e2e8f0",
            font: {
              size: 14,
              weight: 600,
            },
            padding: 20,
          },
        },
        y: {
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
              return `$${value.toLocaleString()}`;
            },
          },
          title: {
            display: true,
            text: "탄소세 부담액 ($)",
            color: "#e2e8f0",
            font: {
              size: 14,
              weight: 600,
            },
            padding: 20,
          },
          beginAtZero: true,
        },
      },
      animation: {
        duration: 1500,
        easing: "easeInOutQuart" as const,
        delay: (context: any) => {
          return context.type === "data" && context.mode === "default"
            ? context.dataIndex * 150
            : 0;
        },
        onComplete: function (animation: any) {
          // 애니메이션 완료 후 글로우 효과
          const canvas = animation.chart.canvas;
          canvas.style.filter =
            "drop-shadow(0 8px 32px rgba(245, 158, 11, 0.15))";
        },
      },
    }),
    [chartData]
  );

  // 차트가 마운트될 때 글로우 효과 추가
  useEffect(() => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      canvas.style.filter = "drop-shadow(0 4px 20px rgba(245, 158, 11, 0.1))";
    }
  }, []);

  const totalCarbonTax =
    chartData.companyData?.reduce(
      (sum, company) => sum + company.carbonTax,
      0
    ) || 0;
  const averageCarbonTax =
    chartData.companyData?.length > 0
      ? totalCarbonTax / chartData.companyData.length
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 },
      }}
    >
      <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-warning/5 via-transparent to-danger/5" />
        <FloatingParticles count={10} className="opacity-20" />

        <CardHeader className="relative">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-warning to-danger bg-clip-text text-transparent">
            기업별 탄소세 부담액
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            각 기업의 탄소 배출량에 따른 예상 탄소세 부담액
          </CardDescription>
        </CardHeader>

        <CardContent className="relative">
          <div style={{ height: "400px", position: "relative" }}>
            <Bar ref={chartRef} data={chartData} options={chartOptions} />
          </div>

          {/* 하단 통계 요약 */}
          <motion.div
            className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-border/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-warning">
                ${totalCarbonTax.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">총 부담액</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                ${Math.round(averageCarbonTax).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">평균 부담액</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {chartData.companyData?.[0]?.name || "-"}
              </div>
              <div className="text-xs text-muted-foreground">
                최대 부담 기업
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
