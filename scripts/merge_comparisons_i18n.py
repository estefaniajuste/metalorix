#!/usr/bin/env python3
"""Merge scripts/comparisons.bundle.json into messages/{locale}.json under key \"comparisons\"."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BUNDLE = Path(__file__).resolve().parent / "comparisons.bundle.json"
MESSAGES = ROOT / "messages"


def main() -> None:
    bundle = json.loads(BUNDLE.read_text(encoding="utf-8"))
    for locale, comparisons in bundle.items():
        path = MESSAGES / f"{locale}.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        data["comparisons"] = comparisons
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"merged comparisons -> {path.name}")


if __name__ == "__main__":
    main()
