"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingParticles } from "@/components/ui/floating-particles";

interface ComingSoonPageProps {
  searchParams: { feature?: string };
}

export default function ComingSoonPage({ searchParams }: ComingSoonPageProps) {
  const router = useRouter();
  const feature = searchParams.feature || "기능";

  const featureInfo = {
    companies: {
      title: "기업 관리",
      description: "기업 정보를 추가, 수정, 삭제할 수 있는 관리 시스템",
      icon: "🏢",
    },
    emissions: {
      title: "배출량 관리",
      description: "상세한 배출량 데이터를 입력하고 추적할 수 있는 도구",
      icon: "📊",
    },
    settings: {
      title: "설정",
      description: "애플리케이션 환경설정 및 사용자 맞춤 설정",
      icon: "⚙️",
    },
  };

  const currentFeature = featureInfo[feature as keyof typeof featureInfo] || {
    title: feature,
    description: "새로운 기능이 개발 중입니다",
    icon: "🚀",
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="relative overflow-hidden">
          <FloatingParticles count={12} className="opacity-20" />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardHeader className="text-center pb-6">
              <motion.div
                className="text-6xl mb-4"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut"
                }}
              >
                {currentFeature.icon}
              </motion.div>
              <CardTitle className="text-2xl mb-2">
                {currentFeature.title}
              </CardTitle>
              <p className="text-muted-foreground">
                {currentFeature.description}
              </p>
            </CardHeader>
          </motion.div>

          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-muted/50 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Wrench className="w-4 h-4 text-orange-500" />
                <span>개발 상태</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                현재 개발 진행률: 65%
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span>예상 출시일</span>
              </div>
              <p className="text-sm text-muted-foreground">
                2024년 4분기 중 출시 예정
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-3"
            >
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                돌아가기
              </Button>
              <Button
                onClick={() => router.push("/")}
                className="flex-1"
              >
                홈으로
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}