#!/usr/bin/env python3
"""
Deterministic Scoring Math — Python equivalent of scoring-math.ts
CLI tool for computing validator scores from raw LLM dimension outputs.

Usage:
    python scoring_math.py '{"problemClarity":75,"solutionStrength":60,...}'
    python scoring_math.py input.json
"""

import json
import sys
from typing import Dict, List, Any, Optional

# Single source of truth: dimension weights (matches DIMENSION_CONFIG)
DIMENSION_WEIGHTS: Dict[str, int] = {
    "problemClarity": 15,
    "solutionStrength": 15,
    "marketSize": 15,
    "competition": 10,
    "businessModel": 15,
    "teamFit": 15,
    "timing": 15,
}

DIMENSION_NAMES: Dict[str, str] = {
    "problemClarity": "Problem Clarity",
    "solutionStrength": "Solution Strength",
    "marketSize": "Market Size",
    "competition": "Competition",
    "businessModel": "Business Model",
    "teamFit": "Team Fit",
    "timing": "Timing",
}


def clamp(value: Any, min_val: float, max_val: float) -> float:
    """Clamp a number to [min, max]. Non-numeric -> min."""
    try:
        v = float(value)
        if v != v:  # NaN check
            return min_val
        return max(min_val, min(max_val, v))
    except (TypeError, ValueError):
        return min_val


def derive_factor_status(score: float) -> str:
    """Derive factor status from score (1-10 scale)."""
    if score >= 7:
        return "strong"
    if score >= 4:
        return "moderate"
    return "weak"


def derive_verdict(score: int) -> str:
    """Derive verdict from overall score."""
    if score >= 75:
        return "go"
    if score >= 50:
        return "caution"
    return "no_go"


def compute_score(
    raw_dimensions: Dict[str, Any],
    raw_market_factors: Optional[List[Dict[str, Any]]] = None,
    raw_execution_factors: Optional[List[Dict[str, Any]]] = None,
    bias_correction: float = 0,
) -> Dict[str, Any]:
    """
    Compute deterministic scoring results from LLM-provided raw scores.

    Steps:
    1. Clamp dimension scores to [0, 100]
    2. Compute weighted average: sum(score * weight/100)
    3. Apply bias correction (0 initially)
    4. Clamp to [0, 100], round to integer
    5. Derive verdict from thresholds (75+ GO, 50+ CAUTION, <50 NO-GO)
    6. Derive factor statuses from scores (7+=strong, 4-6=moderate, <4=weak)
    7. Build scores_matrix for frontend
    """
    raw_market_factors = raw_market_factors or []
    raw_execution_factors = raw_execution_factors or []

    # 1. Clamp dimension scores to [0, 100]
    clamped = {}
    for key in DIMENSION_WEIGHTS:
        raw = raw_dimensions.get(key, 0)
        clamped[key] = clamp(raw, 0, 100)

    # 2. Compute weighted average
    raw_weighted_average = sum(
        clamped[key] * (weight / 100)
        for key, weight in DIMENSION_WEIGHTS.items()
    )

    # 3. Apply bias correction
    corrected = raw_weighted_average + bias_correction

    # 4. Clamp to [0, 100], round to integer
    overall_score = round(clamp(corrected, 0, 100))

    # 5. Derive verdict
    verdict = derive_verdict(overall_score)

    # 6. Derive factor statuses
    market_factors = []
    for f in raw_market_factors:
        score = clamp(f.get("score", 1), 1, 10)
        market_factors.append({
            "name": f.get("name", ""),
            "score": score,
            "description": f.get("description", ""),
            "status": derive_factor_status(score),
        })

    execution_factors = []
    for f in raw_execution_factors:
        score = clamp(f.get("score", 1), 1, 10)
        execution_factors.append({
            "name": f.get("name", ""),
            "score": score,
            "description": f.get("description", ""),
            "status": derive_factor_status(score),
        })

    # 7. Build scores_matrix
    dimensions = [
        {"name": DIMENSION_NAMES.get(key, key), "score": clamped[key], "weight": weight}
        for key, weight in DIMENSION_WEIGHTS.items()
    ]

    return {
        "overall_score": overall_score,
        "verdict": verdict,
        "market_factors": market_factors,
        "execution_factors": execution_factors,
        "scores_matrix": {
            "dimensions": dimensions,
            "overall_weighted": overall_score,
        },
        "metadata": {
            "raw_weighted_average": round(raw_weighted_average * 100) / 100,
            "bias_correction": bias_correction,
            "clamped_dimensions": clamped,
        },
    }


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("Usage: python scoring_math.py '<json>' | python scoring_math.py input.json")
        print("\nExample:")
        print('  python scoring_math.py \'{"problemClarity":75,"solutionStrength":60,"marketSize":70,"competition":55,"businessModel":65,"teamFit":80,"timing":70}\'')
        sys.exit(1)

    arg = sys.argv[1]

    # Accept either inline JSON or a file path
    if arg.startswith("{"):
        data = json.loads(arg)
    else:
        with open(arg, "r") as f:
            data = json.load(f)

    # Support both flat dimensions and nested format
    if "dimension_scores" in data:
        dimensions = data["dimension_scores"]
        market_factors = data.get("market_factors", [])
        execution_factors = data.get("execution_factors", [])
    else:
        dimensions = data
        market_factors = []
        execution_factors = []

    result = compute_score(dimensions, market_factors, execution_factors)

    print(f"overall_score={result['overall_score']}, verdict={result['verdict']}")
    print(f"\nDimensions:")
    for d in result["scores_matrix"]["dimensions"]:
        print(f"  {d['name']:20s} score={d['score']:3.0f}  weight={d['weight']}%")

    if result["market_factors"]:
        print(f"\nMarket Factors:")
        for f in result["market_factors"]:
            print(f"  {f['name']:20s} score={f['score']:3.0f}  status={f['status']}")

    if result["execution_factors"]:
        print(f"\nExecution Factors:")
        for f in result["execution_factors"]:
            print(f"  {f['name']:20s} score={f['score']:3.0f}  status={f['status']}")

    print(f"\nMetadata: raw_weighted_avg={result['metadata']['raw_weighted_average']}")

    # Also output as JSON for piping
    print(f"\n--- JSON ---")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
