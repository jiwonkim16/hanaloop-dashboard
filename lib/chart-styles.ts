// Dark 테마에 최적화된 차트 스타일과 색상 팔레트

// 미학적으로 우수한 색상 팔레트 (그라데이션 및 글로우 효과)
export const chartColors = {
  primary: {
    gradient: {
      start: "rgba(34, 197, 94, 0.8)",
      end: "rgba(34, 197, 94, 0.1)",
    },
    solid: "rgb(34, 197, 94)",
    glow: "rgba(34, 197, 94, 0.4)",
  },
  secondary: {
    gradient: {
      start: "rgba(59, 130, 246, 0.8)",
      end: "rgba(59, 130, 246, 0.1)",
    },
    solid: "rgb(59, 130, 246)",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  accent: {
    gradient: {
      start: "rgba(168, 85, 247, 0.8)",
      end: "rgba(168, 85, 247, 0.1)",
    },
    solid: "rgb(168, 85, 247)",
    glow: "rgba(168, 85, 247, 0.4)",
  },
  warning: {
    gradient: {
      start: "rgba(245, 158, 11, 0.8)",
      end: "rgba(245, 158, 11, 0.1)",
    },
    solid: "rgb(245, 158, 11)",
    glow: "rgba(245, 158, 11, 0.4)",
  },
  danger: {
    gradient: {
      start: "rgba(239, 68, 68, 0.8)",
      end: "rgba(239, 68, 68, 0.1)",
    },
    solid: "rgb(239, 68, 68)",
    glow: "rgba(239, 68, 68, 0.4)",
  },
  success: {
    gradient: {
      start: "rgba(16, 185, 129, 0.8)",
      end: "rgba(16, 185, 129, 0.1)",
    },
    solid: "rgb(16, 185, 129)",
    glow: "rgba(16, 185, 129, 0.4)",
  },
  neutral: {
    gradient: {
      start: "rgba(148, 163, 184, 0.8)",
      end: "rgba(148, 163, 184, 0.1)",
    },
    solid: "rgb(148, 163, 184)",
    glow: "rgba(148, 163, 184, 0.4)",
  },
};

// 다채로운 색상 팔레트 (도넛 차트 등에 사용)
export const vibrantColors = [
  "rgba(34, 197, 94, 0.8)", // 에메랄드
  "rgba(59, 130, 246, 0.8)", // 블루
  "rgba(168, 85, 247, 0.8)", // 퍼플
  "rgba(245, 158, 11, 0.8)", // 앰버
  "rgba(239, 68, 68, 0.8)", // 레드
  "rgba(16, 185, 129, 0.8)", // 틸
  "rgba(244, 63, 94, 0.8)", // 로즈
  "rgba(139, 92, 246, 0.8)", // 바이올렛
  "rgba(6, 182, 212, 0.8)", // 시안
  "rgba(251, 146, 60, 0.8)", // 오렌지
];

export const vibrantBorderColors = [
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
];

// 그라데이션 생성 함수
export const createGradient = (
  ctx: CanvasRenderingContext2D,
  color: typeof chartColors.primary
) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, color.gradient.start);
  gradient.addColorStop(1, color.gradient.end);
  return gradient;
};

// 글로우 효과를 위한 그림자 설정
export const glowShadow = {
  shadowColor: "rgba(34, 197, 94, 0.3)",
  shadowBlur: 20,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
};

// 공통 차트 옵션
export const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: "index" as const,
  },
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "#f8fafc",
        font: {
          family: "var(--font-geist-sans)",
          size: 13,
          weight: 500,
        },
        padding: 20,
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(15, 23, 42, 0.95)",
      titleColor: "#f8fafc",
      bodyColor: "#e2e8f0",
      borderColor: "rgba(34, 197, 94, 0.3)",
      borderWidth: 1,
      cornerRadius: 12,
      displayColors: true,
      padding: 16,
      titleFont: {
        size: 14,
        weight: 600,
      },
      bodyFont: {
        size: 13,
        weight: 400,
      },
      titleSpacing: 8,
      bodySpacing: 8,
      caretPadding: 8,
      mode: "index" as const,
      intersect: false,
      animation: {
        duration: 200,
      },
      external: function (context: any) {
        // 커스텀 툴팁 스타일링
        const tooltipEl = context.tooltip;
        if (tooltipEl.opacity === 0) return;

        // 글로우 효과 추가
        const canvas = context.chart.canvas;
        canvas.style.filter = "drop-shadow(0 0 10px rgba(34, 197, 94, 0.2))";
      },
    },
  },
  elements: {
    point: {
      radius: 6,
      hoverRadius: 8,
      borderWidth: 3,
      hoverBorderWidth: 4,
      backgroundColor: "rgba(34, 197, 94, 0.8)",
      borderColor: "rgb(34, 197, 94)",
      hoverBackgroundColor: "rgba(34, 197, 94, 1)",
      hoverBorderColor: "rgb(34, 197, 94)",
    },
    line: {
      tension: 0.4,
      borderWidth: 3,
      borderCapStyle: "round" as const,
      borderJoinStyle: "round" as const,
    },
    bar: {
      borderRadius: 8,
      borderSkipped: false,
      borderWidth: 1,
      hoverBorderWidth: 2,
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
      },
    },
  },
  animation: {
    duration: 1500,
    easing: "easeInOutQuart" as const,
    delay: (context: any) => {
      return context.type === "data" && context.mode === "default"
        ? context.dataIndex * 50
        : 0;
    },
  },
  hover: {
    animationDuration: 300,
  },
};

// 특별한 애니메이션 효과
export const animationConfig = {
  onComplete: function (animation: any) {
    // 애니메이션 완료 후 글로우 효과 추가
    const canvas = animation.chart.canvas;
    canvas.style.filter = "drop-shadow(0 4px 20px rgba(34, 197, 94, 0.1))";
  },
  onProgress: function (animation: any) {
    // 애니메이션 진행 중 부드러운 효과
    const canvas = animation.chart.canvas;
    const progress = animation.currentStep / animation.numSteps;
    canvas.style.opacity = Math.min(0.3 + progress * 0.7, 1).toString();
  },
};
