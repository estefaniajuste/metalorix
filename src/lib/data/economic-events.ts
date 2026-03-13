export interface EconomicEvent {
  id: string;
  name: string;
  nameShort: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "monetary-policy" | "inflation" | "employment" | "gdp" | "trade" | "sentiment";
  region: "US" | "EU" | "Global";
  metalImpact: string;
  frequency: string;
  dates2026: string[];
}

export const ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: "fomc",
    name: "Reunión FOMC (Reserva Federal)",
    nameShort: "FOMC",
    description:
      "El Comité Federal de Mercado Abierto decide sobre los tipos de interés en EE.UU. Es el evento más importante para los metales preciosos.",
    impact: "high",
    category: "monetary-policy",
    region: "US",
    metalImpact: "Tipos más altos → oro baja. Tipos más bajos o pausa → oro sube.",
    frequency: "8 veces al año",
    dates2026: [
      "2026-01-28",
      "2026-03-18",
      "2026-05-06",
      "2026-06-17",
      "2026-07-29",
      "2026-09-16",
      "2026-11-04",
      "2026-12-16",
    ],
  },
  {
    id: "ecb",
    name: "Decisión BCE (Banco Central Europeo)",
    nameShort: "BCE",
    description:
      "El BCE decide los tipos de interés para la zona euro. Afecta al EUR/USD y por tanto al precio del oro en euros.",
    impact: "high",
    category: "monetary-policy",
    region: "EU",
    metalImpact: "Tipos más altos en UE → EUR sube → oro en EUR baja (y viceversa).",
    frequency: "6 veces al año",
    dates2026: [
      "2026-01-30",
      "2026-03-06",
      "2026-04-17",
      "2026-06-05",
      "2026-07-17",
      "2026-09-11",
      "2026-10-29",
      "2026-12-17",
    ],
  },
  {
    id: "cpi-us",
    name: "IPC EE.UU. (Inflación)",
    nameShort: "IPC USA",
    description:
      "El Índice de Precios al Consumidor mide la inflación. El oro es tradicionalmente una cobertura contra la inflación.",
    impact: "high",
    category: "inflation",
    region: "US",
    metalImpact: "Inflación más alta de lo esperado → oro sube (cobertura). Inflación baja → oro baja.",
    frequency: "Mensual",
    dates2026: [
      "2026-01-14",
      "2026-02-12",
      "2026-03-12",
      "2026-04-10",
      "2026-05-13",
      "2026-06-11",
      "2026-07-15",
      "2026-08-12",
      "2026-09-10",
      "2026-10-13",
      "2026-11-12",
      "2026-12-10",
    ],
  },
  {
    id: "nfp",
    name: "Nóminas no agrícolas (NFP)",
    nameShort: "NFP",
    description:
      "Datos de empleo de EE.UU. Un mercado laboral fuerte puede llevar a tipos más altos, lo que presiona al oro a la baja.",
    impact: "high",
    category: "employment",
    region: "US",
    metalImpact: "Empleo fuerte → USD sube → oro baja. Empleo débil → oro sube.",
    frequency: "Primer viernes de cada mes",
    dates2026: [
      "2026-01-10",
      "2026-02-06",
      "2026-03-06",
      "2026-04-03",
      "2026-05-01",
      "2026-06-05",
      "2026-07-02",
      "2026-08-07",
      "2026-09-04",
      "2026-10-02",
      "2026-11-06",
      "2026-12-04",
    ],
  },
  {
    id: "pce",
    name: "Deflactor PCE (medida favorita de la Fed)",
    nameShort: "PCE",
    description:
      "El índice PCE es la medida de inflación preferida por la Reserva Federal para tomar decisiones de política monetaria.",
    impact: "high",
    category: "inflation",
    region: "US",
    metalImpact: "PCE alto → la Fed podría subir tipos → presión bajista sobre oro.",
    frequency: "Mensual",
    dates2026: [
      "2026-01-31",
      "2026-02-28",
      "2026-03-27",
      "2026-04-30",
      "2026-05-29",
      "2026-06-26",
      "2026-07-31",
      "2026-08-28",
      "2026-09-25",
      "2026-10-30",
      "2026-11-25",
      "2026-12-23",
    ],
  },
  {
    id: "gdp-us",
    name: "PIB EE.UU.",
    nameShort: "PIB USA",
    description:
      "El Producto Interior Bruto mide el crecimiento económico. Una recesión suele ser alcista para el oro.",
    impact: "medium",
    category: "gdp",
    region: "US",
    metalImpact: "PIB débil → miedo a recesión → oro como refugio sube.",
    frequency: "Trimestral",
    dates2026: [
      "2026-01-30",
      "2026-04-29",
      "2026-07-30",
      "2026-10-29",
    ],
  },
  {
    id: "pmi",
    name: "PMI Manufacturero (ISM)",
    nameShort: "PMI",
    description:
      "El índice PMI mide la actividad del sector manufacturero. Un PMI por debajo de 50 indica contracción.",
    impact: "medium",
    category: "sentiment",
    region: "US",
    metalImpact: "PMI bajo → economía se debilita → oro sube como refugio.",
    frequency: "Mensual",
    dates2026: [
      "2026-01-03",
      "2026-02-03",
      "2026-03-02",
      "2026-04-01",
      "2026-05-01",
      "2026-06-01",
      "2026-07-01",
      "2026-08-03",
      "2026-09-01",
      "2026-10-01",
      "2026-11-02",
      "2026-12-01",
    ],
  },
  {
    id: "dxy",
    name: "Índice del Dólar (DXY)",
    nameShort: "DXY",
    description:
      "El índice DXY mide la fortaleza del dólar frente a 6 divisas principales. Tiene correlación inversa con el oro.",
    impact: "medium",
    category: "trade",
    region: "Global",
    metalImpact: "DXY sube → oro baja. DXY baja → oro sube. Correlación inversa.",
    frequency: "Continuo (referencia)",
    dates2026: [],
  },
];

export function getUpcomingEvents(days: number = 30): Array<EconomicEvent & { nextDate: string; daysUntil: number }> {
  const now = new Date();
  const cutoff = new Date(now.getTime() + days * 86400000);

  const upcoming: Array<EconomicEvent & { nextDate: string; daysUntil: number }> = [];

  for (const event of ECONOMIC_EVENTS) {
    for (const dateStr of event.dates2026) {
      const d = new Date(dateStr + "T00:00:00Z");
      if (d >= now && d <= cutoff) {
        const daysUntil = Math.ceil((d.getTime() - now.getTime()) / 86400000);
        upcoming.push({ ...event, nextDate: dateStr, daysUntil });
        break;
      }
    }
  }

  upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
  return upcoming;
}
