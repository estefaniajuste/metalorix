export interface RSIResult {
  values: number[];
  timestamps: string[];
}

export interface MACDResult {
  macd: number[];
  signal: number[];
  histogram: number[];
  timestamps: string[];
}

export interface BollingerResult {
  upper: number[];
  middle: number[];
  lower: number[];
  timestamps: string[];
}

export function calculateRSI(
  prices: number[],
  timestamps: string[],
  period: number = 14
): RSIResult {
  const values: number[] = [];
  const ts: string[] = [];

  if (prices.length < period + 1) return { values, timestamps: ts };

  let gainSum = 0;
  let lossSum = 0;

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gainSum += diff;
    else lossSum += Math.abs(diff);
  }

  let avgGain = gainSum / period;
  let avgLoss = lossSum / period;

  const rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  values.push(rsi);
  ts.push(timestamps[period]);

  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const val = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    values.push(val);
    ts.push(timestamps[i]);
  }

  return { values, timestamps: ts };
}

export function calculateMACD(
  prices: number[],
  timestamps: string[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDResult {
  const result: MACDResult = { macd: [], signal: [], histogram: [], timestamps: [] };

  if (prices.length < slowPeriod + signalPeriod) return result;

  const ema = (data: number[], period: number): number[] => {
    const k = 2 / (period + 1);
    const emas: number[] = [data[0]];
    for (let i = 1; i < data.length; i++) {
      emas.push(data[i] * k + emas[i - 1] * (1 - k));
    }
    return emas;
  };

  const fastEma = ema(prices, fastPeriod);
  const slowEma = ema(prices, slowPeriod);

  const macdLine: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    macdLine.push(fastEma[i] - slowEma[i]);
  }

  const signalLine = ema(macdLine, signalPeriod);

  const startIdx = slowPeriod - 1;
  for (let i = startIdx; i < prices.length; i++) {
    result.macd.push(macdLine[i]);
    result.signal.push(signalLine[i]);
    result.histogram.push(macdLine[i] - signalLine[i]);
    result.timestamps.push(timestamps[i]);
  }

  return result;
}

export function calculateBollinger(
  prices: number[],
  timestamps: string[],
  period: number = 20,
  stdDevMult: number = 2
): BollingerResult {
  const result: BollingerResult = { upper: [], middle: [], lower: [], timestamps: [] };

  if (prices.length < period) return result;

  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period;
    const stdDev = Math.sqrt(variance);

    result.middle.push(mean);
    result.upper.push(mean + stdDevMult * stdDev);
    result.lower.push(mean - stdDevMult * stdDev);
    result.timestamps.push(timestamps[i]);
  }

  return result;
}

/** Periodos MACD según longitud: estándar (35+) o compactos para series más cortas. */
export function pickMacdPeriods(
  len: number
): { fast: number; slow: number; signal: number } | null {
  if (len < 20) return null;
  if (len >= 35) return { fast: 12, slow: 26, signal: 9 };
  if (len >= 28) return { fast: 8, slow: 21, signal: 5 };
  if (len >= 24) return { fast: 6, slow: 17, signal: 4 };
  return { fast: 5, slow: 12, signal: 3 };
}

/** Periodo Bollinger: 20 por defecto; más corto si hay menos velas (mín. 7). */
export function pickBollingerPeriod(len: number): number {
  if (len >= 21) return 20;
  return Math.max(7, Math.min(14, len - 2));
}
