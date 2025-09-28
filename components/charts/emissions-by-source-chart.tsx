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
import type { Company } from "@/lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EmissionsBySourceChartProps {
  companies: Company[];
}

export function EmissionsBySourceChart({
  companies,
}: EmissionsBySourceChartProps) {
  const chartRef = useRef<any>(null);

  const chartData = useMemo(() => {
    const sourceMap: Record<string, string> = {
      gasoline: "가솔린",
      diesel: "디젤",
      natural_gas: "천연가스",
      electricity: "전기",
      lpg: "LPG",
      coal: "석탄",
      biomass: "바이오매스",
    };

    const sourceData: Record<string, number> = {};

    companies.forEach((company) => {
      company.emissions.forEach((emission) => {
        sourceData[emission.source] =
          (sourceData[emission.source] || 0) + emission.emissions;
      });
    });

    return Object.entries(sourceData)
      .map(([source, emissions]) => ({
        source:
          sourceMap[source] ||
          source.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        emissions,
      }))
      .sort((a, b) => b.emissions - a.emissions);
  }, [companies]);

  const chartData2 = useMemo(() => {
    return {
      labels: chartData.map((item) => item.source),
      datasets: [
        {
          label: "배출량 (톤 CO₂)",
          data: chartData.map((item) => item.emissions),
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
    };
  }, [chartData]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y" as const,
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
              const total = chartData.reduce(
                (sum, item) => sum + item.emissions,
                0
              );
              const percentage = ((context.parsed.x / total) * 100).toFixed(1);
              return [
                `배출량: ${context.parsed.x.toLocaleString()}톤 CO₂`,
                `전체 대비: ${percentage}%`,
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
        y: {
          border: {
            color: "rgba(148, 163, 184, 0.2)",
            width: 1,
          },
          grid: {
            display: false, // y축 격자선 숨김으로 더 깔끔하게
          },
          ticks: {
            color: "#cbd5e1",
            font: {
              size: 13,
              weight: 500,
            },
            padding: 16,
          },
          title: {
            display: true,
            text: "에너지원",
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
        easing: "easeInOutQuart" as const,
        delay: (context: any) => {
          return context.type === "data" && context.mode === "default"
            ? context.dataIndex * 100
            : 0;
        },
        onComplete: function (animation: any) {
          // 애니메이션 완료 후 글로우 효과
          const canvas = animation.chart.canvas;
          canvas.style.filter =
            "drop-shadow(0 8px 32px rgba(168, 85, 247, 0.15))";
        },
      },
    }),
    [chartData]
  );

  // 차트가 마운트될 때 글로우 효과 추가
  useEffect(() => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      canvas.style.filter = "drop-shadow(0 4px 20px rgba(168, 85, 247, 0.1))";
    }
  }, []);

  const totalEmissions = chartData.reduce(
    (sum, item) => sum + item.emissions,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 },
      }}
    >
      <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-warning/5" />
        <FloatingParticles count={6} className="opacity-25" />

        <CardHeader className="relative">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
            에너지원별 배출량
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            에너지원별 탄소 배출량 분포 및 비중 분석
          </CardDescription>
        </CardHeader>

        <CardContent className="relative">
          <div style={{ height: "350px", position: "relative" }}>
            <Bar ref={chartRef} data={chartData2} options={chartOptions} />
          </div>

          {/* 하단 통계 요약 */}
          <motion.div
            className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-border/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {chartData.length}
              </div>
              <div className="text-xs text-muted-foreground">에너지원 종류</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-warning text-white">
                {chartData[0]?.source || "-"}
              </div>
              <div className="text-xs text-muted-foreground">최대 배출원</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {totalEmissions.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">총 배출량</div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
