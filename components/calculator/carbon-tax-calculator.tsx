"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, DollarSign, Zap } from "lucide-react";
import type { Country } from "@/lib/types";

interface CarbonTaxCalculatorProps {
  countries: Country[];
}

interface EmissionInput {
  source: string;
  amount: number;
  unit: string;
}

const emissionSources = [
  { value: "gasoline", label: "가솔린", factor: 2.31 }, // kg CO2 per liter
  { value: "diesel", label: "디젤", factor: 2.68 },
  { value: "natural_gas", label: "천연가스", factor: 1.93 }, // kg CO2 per m³
  { value: "electricity", label: "전기", factor: 0.45 }, // kg CO2 per kWh (average)
  { value: "lpg", label: "LPG", factor: 1.51 },
  { value: "coal", label: "석탄", factor: 2.42 }, // kg CO2 per kg
  { value: "biomass", label: "바이오매스", factor: 0.39 },
];

export function CarbonTaxCalculator({ countries }: CarbonTaxCalculatorProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [emissionInputs, setEmissionInputs] = useState<EmissionInput[]>([
    { source: "", amount: 0, unit: "단위" },
  ]);
  const [timeframe, setTimeframe] = useState<string>("monthly");
  const [isCalculating, setIsCalculating] = useState(false);

  // 계산이 시작될 때 애니메이션 효과
  useEffect(() => {
    if (
      selectedCountry &&
      emissionInputs.some((input) => input.source && input.amount > 0)
    ) {
      setIsCalculating(true);
      const timer = setTimeout(() => setIsCalculating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [selectedCountry, emissionInputs, timeframe]);

  const calculations = useMemo(() => {
    const country = countries.find((c) => c.code === selectedCountry);

    if (!country) return { totalEmissions: 0, totalTax: 0, breakdown: [] };

    const validInputs = emissionInputs.filter(
      (input) => input.source && input.amount > 0
    );

    const breakdown = validInputs.map((input) => {
      const source = emissionSources.find((s) => s.value === input.source);

      if (!source)
        return {
          source: input.source,
          emissions: 0,
          tax: 0,
          amount: input.amount,
          unit: input.unit,
        };

      const emissions = (input.amount * source.factor) / 1000; // Convert to tons
      const tax = emissions * country.carbonTaxRate;

      return {
        source: source.label,
        emissions,
        tax,
        amount: input.amount,
        unit: input.unit,
      };
    });

    const totalEmissions = breakdown.reduce(
      (sum, item) => sum + item.emissions,
      0
    );
    const totalTax = breakdown.reduce((sum, item) => sum + item.tax, 0);

    // Multiply by timeframe
    const multiplier = timeframe === "yearly" ? 12 : 1;

    return {
      totalEmissions: totalEmissions * multiplier,
      totalTax: totalTax * multiplier,
      breakdown: breakdown.map((item) => ({
        ...item,
        emissions: item.emissions * multiplier,
        tax: item.tax * multiplier,
      })),
    };
  }, [selectedCountry, emissionInputs, timeframe, countries]);

  const addEmissionInput = () => {
    setEmissionInputs([
      ...emissionInputs,
      { source: "", amount: 0, unit: "단위" },
    ]);
  };

  const updateEmissionInput = (
    index: number,
    field: keyof EmissionInput,
    value: string | number
  ) => {
    const updated = [...emissionInputs];
    updated[index] = { ...updated[index], [field]: value };
    setEmissionInputs(updated);
  };

  const removeEmissionInput = (index: number) => {
    if (emissionInputs.length > 1) {
      setEmissionInputs(emissionInputs.filter((_, i) => i !== index));
    }
  };

  const getUnitForSource = (source: string) => {
    const sourceData = emissionSources.find((s) => s.value === source);
    if (!sourceData) return "units";

    switch (source) {
      case "gasoline":
      case "diesel":
      case "lpg":
        return "리터";
      case "natural_gas":
        return "m³";
      case "electricity":
        return "kWh";
      case "coal":
      case "biomass":
        return "kg";
      default:
        return "단위";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calculator Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            탄소세 계산기
          </CardTitle>
          <CardDescription>
            배출원과 세율을 기반으로 예상 탄소세를 계산하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Country Selection */}
          <div className="space-y-2">
            <Label htmlFor="country">국가</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="국가를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name} (${country.carbonTaxRate}/ton CO₂)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe Selection */}
          <div className="space-y-2">
            <Label htmlFor="timeframe">기간</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">월별</SelectItem>
                <SelectItem value="yearly">연별</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Emission Inputs */}
          <div className="space-y-4">
            <Label>배출원</Label>
            {emissionInputs.map((input, index) => (
              <div
                key={`emission-${index}`}
                className="grid grid-cols-12 gap-2 items-end"
              >
                <div className="col-span-5">
                  <Select
                    value={input.source || undefined}
                    onValueChange={(value) => {
                      const newUnit = getUnitForSource(value);
                      const updated = [...emissionInputs];
                      updated[index] = {
                        ...updated[index],
                        source: value,
                        unit: newUnit,
                      };
                      setEmissionInputs(updated);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="배출원" />
                    </SelectTrigger>
                    <SelectContent>
                      {emissionSources.map((source) => (
                        <SelectItem key={source.value} value={source.value}>
                          {source.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-4">
                  <Input
                    type="number"
                    placeholder="값"
                    value={input.amount || ""}
                    onChange={(e) =>
                      updateEmissionInput(
                        index,
                        "amount",
                        Number.parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Input value={input.unit} readOnly className="text-xs" />
                </div>
                <div className="col-span-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeEmissionInput(index)}
                    disabled={emissionInputs.length === 1}
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addEmissionInput}
              className="w-full bg-transparent"
            >
              배출원 추가
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            계산 결과
          </CardTitle>
          <CardDescription>
            {timeframe === "yearly" ? "연간" : "월간"} 탄소세 예상액
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              className="bg-muted rounded-lg p-4"
              animate={isCalculating ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">총 배출량</span>
              </div>
              <motion.p
                className="text-2xl font-bold"
                key={calculations.totalEmissions}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {calculations.totalEmissions.toFixed(2)}
              </motion.p>
              <p className="text-xs text-muted-foreground">톤 CO₂ 환산</p>
            </motion.div>
            <motion.div
              className="bg-muted rounded-lg p-4"
              animate={isCalculating ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">탄소세</span>
              </div>
              <motion.p
                className="text-2xl font-bold text-primary"
                key={calculations.totalTax}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                ${calculations.totalTax.toFixed(2)}
              </motion.p>
              <p className="text-xs text-muted-foreground">
                {timeframe === "yearly" ? "연간" : "월간"} 예상액
              </p>
            </motion.div>
          </div>

          {/* Breakdown */}
          <AnimatePresence>
            {calculations.breakdown.length > 0 && (
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-sm font-medium">배출원별 세부내역</h4>
                {calculations.breakdown.map((item, index) => (
                  <motion.div
                    key={`${item.source}-${index}`}
                    className="flex justify-between items-center p-3 bg-muted rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div>
                      <p className="text-sm font-medium">{item.source}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.amount} {item.unit} → {item.emissions.toFixed(2)}{" "}
                        tons CO₂
                      </p>
                    </div>
                    <div className="text-right">
                      <motion.p
                        className="text-sm font-bold"
                        key={item.tax}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        ${item.tax.toFixed(2)}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedCountry && (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>계산을 시작하려면 국가를 선택하세요</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
