"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { EmissionsOverviewChart } from "@/components/charts/emissions-overview-chart";
import { EmissionsBySourceChart } from "@/components/charts/emissions-by-source-chart";
import { CarbonTaxChart } from "@/components/charts/carbon-tax-chart";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { fetchCompanies, fetchCountries } from "@/lib/api";
import type { Company, Country } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function HomePage() {
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

  if (loading) {
    return (
      <DashboardLayout>
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Skeleton className="h-32" />
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Skeleton className="h-[400px]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Skeleton className="h-[400px]" />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Skeleton className="h-[400px]" />
          </motion.div>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="relative">
        <FloatingParticles count={15} className="opacity-20" />
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Metrics Cards */}
          <motion.div variants={itemVariants}>
            <MetricsCards companies={companies} countries={countries} />
          </motion.div>

          {/* Charts Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            variants={itemVariants}
          >
            <EmissionsOverviewChart companies={companies} />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.01 }}
            >
              <EmissionsBySourceChart companies={companies} />
            </motion.div>
          </motion.div>

          {/* Carbon Tax Chart */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.005 }}>
            <CarbonTaxChart companies={companies} countries={countries} />
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
