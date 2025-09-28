"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CarbonTaxCalculator } from "@/components/calculator/carbon-tax-calculator";
import { fetchCountries } from "@/lib/api";
import type { Country } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalculatorPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCountries() {
      try {
        const countriesData = await fetchCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error("국가 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCountries();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[600px]" />
            <Skeleton className="h-[600px]" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">탄소세 계산기</h1>
          <p className="text-muted-foreground mt-2">
            배출원과 세율을 기반으로 예상 탄소세 부담액을 계산하세요
          </p>
        </div>

        <CarbonTaxCalculator countries={countries} />
      </div>
    </DashboardLayout>
  );
}
