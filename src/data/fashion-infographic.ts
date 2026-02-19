export const fashionInfographicData = {
  slide01: {
    section_title: "Fashion's $2 Trillion Crossroads",
    primary_stat: 2.0,
    primary_stat_target: 2.4,
    primary_stat_suffix: "T",
    primary_stat_label: "by 2030",
    supporting_stats: [
      { value: "46%", label: "execs expect conditions to worsen" },
      { value: "76%", label: "cite tariffs as #1 factor" },
      { value: "Low single-digit", label: "growth forecast" },
    ],
    chart: [
      { label: "Improve 2024", value: 20, type: "improve" },
      { label: "Improve 2025", value: 20, type: "improve" },
      { label: "Improve 2026", value: 25, type: "improve" },
      { label: "Worsen 2024", value: 33, type: "worsen" },
      { label: "Worsen 2025", value: 39, type: "worsen" },
      { label: "Worsen 2026", value: 46, type: "worsen" },
    ],
    source: "BoF × McKinsey State of Fashion 2026; Fashion Validation Report 2026",
  },
  slide02: {
    section_title: "The $27B Tariff Tax on Fashion",
    primary_stat: "$27B",
    primary_stat_label: "incremental duties on US apparel imports",
    supporting_stats: [
      { value: "13% → 54%", label: "Tariffs spiked in April 2025" },
      { value: "55%", label: "of brands plan to raise prices" },
      { value: "-30%", label: "China imports since 2019" },
    ],
    chart: [
      { label: "China", value: 76 },
      { label: "Vietnam", value: 58 },
      { label: "India", value: 61 },
      { label: "Bangladesh", value: 45 },
      { label: "Cambodia", value: 58 },
      { label: "Indonesia", value: 47 },
      { label: "EU", value: 33 },
      { label: "Pakistan", value: 46 },
    ],
    diagram: `graph LR
    A[Tariff Shock] -->|55%| B[Price Increases]
    A -->|35%| C[Sourcing Shifts]
    A -->|27%| D[SKU Reduction]`,
    source: "BoF × McKinsey State of Fashion 2026; Strategic Intelligence Report",
  },
};
