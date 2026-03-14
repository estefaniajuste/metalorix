export const TROY_OZ_IN_GRAMS = 31.1035;
export const TROY_OZ_IN_KG = TROY_OZ_IN_GRAMS / 1000;
export const LB_IN_GRAMS = 453.592;

export type PriceUnit = "oz" | "g" | "kg" | "lb";
export type BaseUnit = "oz" | "lb";
export type Currency = "USD" | "EUR";

export interface UnitConfig {
  label: string;
  shortLabel: string;
  multiplier: number;
}

export const UNITS: Record<PriceUnit, UnitConfig> = {
  oz: { label: "Onza troy", shortLabel: "oz", multiplier: 1 },
  g: { label: "Gramo", shortLabel: "g", multiplier: 1 / TROY_OZ_IN_GRAMS },
  kg: { label: "Kilogramo", shortLabel: "kg", multiplier: 1000 / TROY_OZ_IN_GRAMS },
  lb: { label: "Libra", shortLabel: "lb", multiplier: 1 },
};

const LB_MULTIPLIERS: Record<PriceUnit, number> = {
  lb: 1,
  g: 1 / LB_IN_GRAMS,
  kg: 1000 / LB_IN_GRAMS,
  oz: LB_IN_GRAMS / TROY_OZ_IN_GRAMS,
};

export function convertPrice(
  pricePerBaseUnit: number,
  unit: PriceUnit,
  currency: Currency,
  eurUsdRate: number,
  baseUnit: BaseUnit = "oz"
): number {
  const multiplier = baseUnit === "lb" ? LB_MULTIPLIERS[unit] : UNITS[unit].multiplier;
  let price = pricePerBaseUnit * multiplier;
  if (currency === "EUR" && eurUsdRate > 0) {
    price = price / eurUsdRate;
  }
  return price;
}

export function getUnitsForMetal(baseUnit: BaseUnit): PriceUnit[] {
  return baseUnit === "lb" ? ["lb", "g", "kg"] : ["oz", "g", "kg"];
}

export function formatConvertedPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (price >= 1) {
    return price.toFixed(2);
  }
  return price.toFixed(4);
}

export function currencySymbol(currency: Currency): string {
  return currency === "EUR" ? "€" : "$";
}
