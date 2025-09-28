"use client";

import { useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
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
  baseChartOptions,
  createGradient,
  animationConfig,
} from "@/lib/chart-styles";
import type { Company } from "@/lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface EmissionsOverviewChartProps {
  companies: Company[];
}

export function EmissionsOverviewChart({
  companies,
}: EmissionsOverviewChartProps) {
  const chartRef = useRef<any>(null);

  const chartData = useMemo(() => {
    const monthlyData: Record<string, number> = {};
    const months: string[] = [];

    // 모든 월별 데이터 수집
    companies.forEach((company) => {
      company.emissions.forEach((emission) => {
        if (!months.includes(emission.yearMonth)) {
          months.push(emission.yearMonth);
        }
        if (!monthlyData[emission.yearMonth]) {
          monthlyData[emission.yearMonth] = 0;
        }
        monthlyData[emission.yearMonth] += emission.emissions;
      });
    });

    // 월 정렬
    months.sort();

    return {
      labels: months.map((month) => {
        const [year, monthNum] = month.split("-");
        return `${year}년 ${monthNum}월`;
      }),
      datasets: [
        {
          label: "총 배출량 (톤 CO₂)",
          data: months.map((month) => monthlyData[month] || 0),
          fill: true,
          backgroundColor: (context: any) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return chartColors.primary.gradient.start;

            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );
            gradient.addColorStop(0, chartColors.primary.gradient.start);
            gradient.addColorStop(0.6, "rgba(34, 197, 94, 0.3)");
            gradient.addColorStop(1, chartColors.primary.gradient.end);
            return gradient;
          },
          borderColor: chartColors.primary.solid,
          borderWidth: 3,
          pointBackgroundColor: chartColors.primary.solid,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 10,
          pointHoverBackgroundColor: chartColors.primary.solid,
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 4,
          tension: 0.4,
          shadowColor: chartColors.primary.glow,
          shadowBlur: 15,
          shadowOffsetX: 0,
          shadowOffsetY: 5,
        },
      ],
    };
  }, [companies]);

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
          borderColor: chartColors.primary.glow,
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
              return `총 배출량: ${context.parsed.y.toLocaleString()}톤 CO₂`;
            },
            afterLabel: (context: any) => {
              // 추가 컨텍스트 정보
              const total = context.dataset.data.reduce(
                (a: number, b: number) => a + b,
                0
              );
              const percentage = ((context.parsed.y / total) * 100).toFixed(1);
              return `전체 대비: ${percentage}%`;
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
          title: {
            display: true,
            text: "기간",
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
          beginAtZero: true,
        },
      },
      animation: {
        duration: 1500,
        easing: "easeInOutQuart" as const,
        onComplete: function (animation: any) {
          // 애니메이션 완료 후 글로우 효과
          const canvas = animation.chart.canvas;
          canvas.style.filter =
            "drop-shadow(0 8px 32px rgba(34, 197, 94, 0.15))";
        },
      },
    }),
    []
  );

  // 차트가 마운트될 때 글로우 효과 추가
  useEffect(() => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      canvas.style.filter = "drop-shadow(0 4px 20px rgba(34, 197, 94, 0.1))";
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 },
      }}
    >
      <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <FloatingParticles count={8} className="opacity-30" />

        <CardHeader className="relative">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            월별 배출량 추이
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            전체 기업의 월별 탄소 배출량 변화를 추적합니다
          </CardDescription>
        </CardHeader>

        <CardContent className="relative">
          <div style={{ height: "350px", position: "relative" }}>
            <Line ref={chartRef} data={chartData} options={chartOptions} />
          </div>

          {/* 하단 통계 요약 */}
          <motion.div
            className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-border/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {chartData.datasets[0]?.data.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">데이터 포인트</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {Math.max(
                  ...(chartData.datasets[0]?.data || [0])
                ).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">최대 배출량</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {(
                  chartData.datasets[0]?.data.reduce(
                    (a: number, b: number) => a + b,
                    0
                  ) / chartData.datasets[0]?.data.length || 0
                ).toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">평균 배출량</div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
