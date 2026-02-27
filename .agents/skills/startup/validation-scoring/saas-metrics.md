# SaaS Metrics Deep Dive

## Revenue Composition

**New MRR** — New customers x ARPU
**Expansion MRR** — Upsells and cross-sells from existing customers
**Contraction MRR** — Downgrades from existing customers
**Churned MRR** — Lost customers

```
Net New MRR = New MRR + Expansion MRR - Contraction MRR - Churned MRR
```

## Retention Metrics

### Logo Retention

```
Logo Retention = (Customers End - New Customers) / Customers Start
```

### Net Dollar Retention (NDR)

```
NDR = (ARR Start + Expansion - Contraction - Churn) / ARR Start
```

| NDR | Rating |
|-----|--------|
| > 120% | Best-in-class |
| 100-120% | Good |
| < 100% | Needs work |

### Gross Retention

```
Gross Retention = (ARR Start - Churn - Contraction) / ARR Start
```

| Gross Retention | Rating |
|-----------------|--------|
| > 90% | Excellent |
| 85-90% | Good |
| < 85% | Concerning |

## SaaS Efficiency Metrics

### Magic Number

```
Magic Number = Net New ARR (quarter) / S&M Spend (prior quarter)
```

| Magic Number | Interpretation |
|-------------|---------------|
| > 0.75 | Efficient, ready to scale |
| 0.5-0.75 | Moderate efficiency |
| < 0.5 | Inefficient, don't scale yet |

### Burn Multiple

```
Burn Multiple = Net Burn / Net New ARR
```

| Burn Multiple | Rating |
|--------------|--------|
| < 1.0 | Exceptional |
| 1.0-1.5 | Good |
| 1.5-2.0 | Acceptable |
| > 2.0 | Inefficient |

## Stage-Specific SaaS Focus

### Seed ($500K-$2M ARR)

1. MRR growth rate (15-20% MoM)
2. CAC and LTV (establish baseline)
3. Gross retention (> 85%)
4. Core product engagement

### Series A ($2M-$10M ARR)

1. ARR growth (3-5x YoY)
2. Unit economics (LTV:CAC > 3, payback < 18 months)
3. Net dollar retention (> 100%)
4. Burn multiple (< 2.0)
5. Magic number (> 0.5)

### Series B+

- Rule of 40 > 40%
- Sales efficiency (magic number)
- Path to profitability
- Market leadership metrics

## Investor Metrics by Round

### What VCs Want

**Seed:** MRR growth, retention, early unit economics, engagement
**Series A:** ARR + growth, CAC payback < 18mo, LTV:CAC > 3, NDR > 100%, burn multiple < 2
**Series B+:** Rule of 40 > 40%, efficient growth, path to profitability

### Dashboard Format

```
Current MRR: $250K (↑ 18% MoM)
ARR: $3.0M (↑ 280% YoY)
CAC: $1,200 | LTV: $4,800 | LTV:CAC = 4.0x
NDR: 112% | Logo Retention: 92%
Burn: $180K/mo | Runway: 18 months
```
