"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calculator,
  TreePine,
  Building2,
  TrendingUp,
  Settings,
  Menu,
  X,
  Leaf,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const activeNavigationItems = [
  {
    title: "개요",
    icon: BarChart3,
    href: "/",
    description: "대시보드 개요",
  },
  {
    title: "기업 관리",
    icon: Building2,
    href: "/companies",
    description: "기업 정보 관리",
  },
  {
    title: "배출량",
    icon: TrendingUp,
    href: "/emissions",
    description: "배출량 데이터 추적",
  },
  {
    title: "탄소세 계산기",
    icon: Calculator,
    href: "/calculator",
    description: "탄소세 예측 계산",
  },
  {
    title: "환경 영향도",
    icon: TreePine,
    href: "/trees",
    description: "환경 영향 시각화",
  },
];

const upcomingNavigationItems = [
  {
    title: "설정",
    icon: Settings,
    href: "/settings",
    description: "애플리케이션 설정",
  },
];

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 64 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border",
        className
      )}
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <div>
                <h1 className="text-lg font-semibold text-sidebar-foreground">
                  하나루프
                </h1>
                <p className="text-xs text-muted-foreground">탄소 대시보드</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {isCollapsed ? (
                <Menu className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-4">
        {/* Active Features */}
        <div className="space-y-2">
          {activeNavigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.href}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                        isCollapsed && "justify-center px-2",
                        isActive &&
                          "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                      </motion.div>
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.div
                            className="flex flex-col items-start"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className="text-sm font-medium">
                              {item.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Divider */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              className="border-t border-sidebar-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* Upcoming Features */}
        <div className="space-y-2">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                className="px-3 py-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  오픈 예정
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {upcomingNavigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{
                  delay: (activeNavigationItems.length + index) * 0.1,
                }}
              >
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors opacity-60",
                        isCollapsed && "justify-center px-2"
                      )}
                    >
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                      </motion.div>
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.div
                            className="flex flex-col items-start"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className="text-sm font-medium">
                              {item.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              className="bg-sidebar-accent rounded-lg p-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  className="w-2 h-2 bg-chart-2 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
                <span className="text-sm font-medium text-sidebar-foreground">
                  시스템 상태
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                모든 시스템 정상 작동
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
