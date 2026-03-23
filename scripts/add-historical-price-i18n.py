#!/usr/bin/env python3
"""Insert historicalPrice namespace into messages/*.json (targeted, preserves order)."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MESSAGES = ROOT / "messages"

TRANSLATIONS: dict[str, dict[str, str]] = {
    "es": {
        "title": "Histórico del precio de {metal}",
        "description": "Evolución histórica del precio de {metal}. Datos anuales, gráficos interactivos y rendimiento por año.",
        "breadcrumb": "Histórico",
        "yearlyPerformance": "Rendimiento por año",
        "yearlyTableDisclaimer": "Cifras anuales orientativas (referencia de mercado). Para series detalladas usa el gráfico.",
        "year": "Año",
        "open": "Apertura",
        "close": "Cierre",
        "high": "Máximo",
        "low": "Mínimo",
        "change": "Cambio",
        "factorsTitle": "Factores clave en el precio histórico de {metal}",
        "factorsText": "El precio de {metal} ha sido influenciado por las decisiones de los bancos centrales, la inflación global, las crisis geopolíticas y la demanda industrial. Analizar el rendimiento pasado ayuda a entender los ciclos del mercado, aunque no garantiza resultados futuros.",
        "livePrice": "— precio en vivo",
        "roiTool": "ROI — {metal}",
    },
    "en": {
        "title": "{metal} Price History",
        "description": "Historical {metal} price data. Yearly performance, interactive charts and annual returns.",
        "breadcrumb": "History",
        "yearlyPerformance": "Yearly performance",
        "yearlyTableDisclaimer": "Annual figures are indicative (market reference). Use the chart for detailed series.",
        "year": "Year",
        "open": "Open",
        "close": "Close",
        "high": "High",
        "low": "Low",
        "change": "Change",
        "factorsTitle": "Key factors in {metal} price history",
        "factorsText": "The price of {metal} has been influenced by central bank decisions, global inflation, geopolitical crises and industrial demand. Analyzing past performance helps understand market cycles, though it does not guarantee future results.",
        "livePrice": "— live price",
        "roiTool": "ROI — {metal}",
    },
    "de": {
        "title": "{metal} Preisverlauf",
        "description": "Historische {metal}-Preisdaten. Jahresperformance, interaktive Charts und jährliche Renditen.",
        "breadcrumb": "Verlauf",
        "yearlyPerformance": "Jahresperformance",
        "yearlyTableDisclaimer": "Jahreszahlen sind indikativ (Marktreferenz). Für Details siehe Chart.",
        "year": "Jahr",
        "open": "Eröffnung",
        "close": "Schluss",
        "high": "Hoch",
        "low": "Tief",
        "change": "Veränderung",
        "factorsTitle": "Schlüsselfaktoren im {metal}-Preisverlauf",
        "factorsText": "Der Preis von {metal} wurde von Zentralbankentscheidungen, globaler Inflation, geopolitischen Krisen und industrieller Nachfrage beeinflusst. Die Analyse vergangener Performance hilft Marktzyklen zu verstehen, garantiert aber keine zukünftigen Ergebnisse.",
        "livePrice": "— Echtzeitpreis",
        "roiTool": "ROI — {metal}",
    },
    "zh": {
        "title": "{metal}历史价格",
        "description": "{metal}历史价格数据。年度表现、互动图表和年度收益。",
        "breadcrumb": "历史",
        "yearlyPerformance": "年度表现",
        "yearlyTableDisclaimer": "年度数据为参考性（市场参考），详细序列请查看图表。",
        "year": "年份",
        "open": "开盘",
        "close": "收盘",
        "high": "最高",
        "low": "最低",
        "change": "变化",
        "factorsTitle": "{metal}历史价格的关键因素",
        "factorsText": "{metal}价格受央行决策、全球通胀、地缘政治危机和工业需求影响。分析过去的表现有助于理解市场周期，但不能保证未来的结果。",
        "livePrice": "— 实时价格",
        "roiTool": "ROI — {metal}",
    },
    "ar": {
        "title": "تاريخ سعر {metal}",
        "description": "بيانات سعر {metal} التاريخية. الأداء السنوي، الرسوم البيانية التفاعلية والعوائد السنوية.",
        "breadcrumb": "تاريخي",
        "yearlyPerformance": "الأداء السنوي",
        "yearlyTableDisclaimer": "الأرقام السنوية إرشادية (مرجع السوق). استخدم الرسم البياني للتفاصيل.",
        "year": "السنة",
        "open": "الافتتاح",
        "close": "الإغلاق",
        "high": "الأعلى",
        "low": "الأدنى",
        "change": "التغيير",
        "factorsTitle": "العوامل الرئيسية في تاريخ سعر {metal}",
        "factorsText": "تأثر سعر {metal} بقرارات البنوك المركزية والتضخم العالمي والأزمات الجيوسياسية والطلب الصناعي. يساعد تحليل الأداء السابق على فهم دورات السوق، لكنه لا يضمن النتائج المستقبلية.",
        "livePrice": "— السعر المباشر",
        "roiTool": "عائد الاستثمار — {metal}",
    },
    "tr": {
        "title": "{metal} Fiyat Geçmişi",
        "description": "Tarihsel {metal} fiyat verileri. Yıllık performans, interaktif grafikler ve yıllık getiriler.",
        "breadcrumb": "Geçmiş",
        "yearlyPerformance": "Yıllık performans",
        "yearlyTableDisclaimer": "Yıllık rakamlar gösterim amaçlıdır (piyasa referansı). Ayrıntılar için grafiği kullanın.",
        "year": "Yıl",
        "open": "Açılış",
        "close": "Kapanış",
        "high": "En yüksek",
        "low": "En düşük",
        "change": "Değişim",
        "factorsTitle": "{metal} fiyat geçmişindeki temel faktörler",
        "factorsText": "{metal} fiyatı merkez bankası kararları, küresel enflasyon, jeopolitik krizler ve endüstriyel talep tarafından etkilenmiştir. Geçmiş performansı analiz etmek piyasa döngülerini anlamaya yardımcı olur, ancak gelecekteki sonuçları garanti etmez.",
        "livePrice": "— canlı fiyat",
        "roiTool": "ROI — {metal}",
    },
    "hi": {
        "title": "{metal} मूल्य इतिहास",
        "description": "{metal} ऐतिहासिक मूल्य डेटा। वार्षिक प्रदर्शन, इंटरैक्टिव चार्ट और वार्षिक रिटर्न।",
        "breadcrumb": "इतिहास",
        "yearlyPerformance": "वार्षिक प्रदर्शन",
        "yearlyTableDisclaimer": "वार्षिक आंकड़े संकेतक हैं (बाजार संदर्भ)। विस्तार के लिए चार्ट देखें।",
        "year": "वर्ष",
        "open": "शुरुआती",
        "close": "समापन",
        "high": "उच्चतम",
        "low": "न्यूनतम",
        "change": "परिवर्तन",
        "factorsTitle": "{metal} मूल्य इतिहास के प्रमुख कारक",
        "factorsText": "{metal} की कीमत केंद्रीय बैंक निर्णयों, वैश्विक मुद्रास्फीति, भू-राजनीतिक संकटों और औद्योगिक मांग से प्रभावित रही है। पिछले प्रदर्शन का विश्लेषण बाजार चक्रों को समझने में मदद करता है, हालांकि यह भविष्य के परिणामों की गारंटी नहीं देता।",
        "livePrice": "— लाइव मूल्य",
        "roiTool": "ROI — {metal}",
    },
}


def insert_block(path: Path, data: dict[str, str]) -> None:
    text = path.read_text(encoding="utf-8")
    if '"historicalPrice"' in text:
        print(f"skip (already present): {path.name}")
        return
    marker = '\n  "panel":'
    idx = text.find(marker)
    if idx == -1:
        raise SystemExit(f"marker not found in {path}")
    chunk = json.dumps({"historicalPrice": data}, ensure_ascii=False, indent=2)
    inner = "\n".join(chunk.split("\n")[1:-1])
    insert = "\n" + inner + ","
    path.write_text(text[:idx] + insert + text[idx:], encoding="utf-8")
    print(f"updated: {path.name}")


def main() -> None:
    for loc, payload in TRANSLATIONS.items():
        insert_block(MESSAGES / f"{loc}.json", payload)


if __name__ == "__main__":
    main()
