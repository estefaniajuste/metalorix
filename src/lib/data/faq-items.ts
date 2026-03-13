export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿Es mejor comprar oro físico o invertir en un ETF?",
    answer:
      "Depende de tu objetivo. El oro físico te da control total y elimina el riesgo de contraparte, pero implica costes de custodia y menor liquidez. Los ETFs son más baratos, líquidos y fáciles de gestionar, pero no posees el metal directamente. Muchos inversores combinan ambos: una base de oro físico y ETFs para el trading o la gestión activa de la cartera.",
  },
  {
    question: "¿Qué ventajas tiene guardar oro en Suiza?",
    answer:
      "Suiza ofrece estabilidad política y jurídica, un sistema bancario sólido y una larga tradición en custodia de metales preciosos. Almacenar fuera de tu país diversifica el riesgo jurisdiccional (protección ante confiscaciones o restricciones). Servicios como BullionVault o PAMP ofrecen bóvedas auditadas con oro asignado individualmente.",
  },
  {
    question: "¿Qué es el TER de un ETF y por qué importa?",
    answer:
      "El TER (Total Expense Ratio) es el coste anual que cobra la gestora, expresado como porcentaje del valor invertido. Un TER de 0,12 % significa que por cada 10.000 € invertidos, pagas 12 € al año en comisiones. A largo plazo, la diferencia entre un TER de 0,12 % y 0,49 % puede ser significativa por el efecto del interés compuesto.",
  },
  {
    question: "¿El oro físico tributa de forma diferente que un ETF?",
    answer:
      "Sí, en la mayoría de países europeos el tratamiento fiscal difiere. En España, por ejemplo, la compraventa de oro de inversión (lingotes >99,5 % y monedas reconocidas) está exenta de IVA. Las plusvalías tributan como ganancias patrimoniales. Los ETFs tributan como productos financieros y pueden tener retención en origen. Consulta siempre con un asesor fiscal.",
  },
  {
    question: "¿Qué diferencia hay entre un ETF y un ETC?",
    answer:
      "Un ETF (Exchange-Traded Fund) es un fondo de inversión cotizado, regulado bajo normativa UCITS en Europa, que debe estar diversificado. Un ETC (Exchange-Traded Commodity) es un título de deuda respaldado por una materia prima. Como la normativa UCITS no permite fondos de un solo activo, los productos de oro en Europa suelen ser ETCs, no ETFs técnicamente, aunque se usen ambos términos coloquialmente.",
  },
  {
    question: "¿Cuánto oro debería tener en mi cartera?",
    answer:
      "No hay una cifra universal, pero las recomendaciones habituales oscilan entre el 5 % y el 15 % de una cartera diversificada. El oro actúa como cobertura contra la inflación y la incertidumbre. Ray Dalio sugiere un 7,5 % en su All Weather Portfolio. La cantidad ideal depende de tu tolerancia al riesgo, horizonte temporal y situación financiera global.",
  },
];
