-- supabase/seeds/31-industry-expert-batch-2.sql
-- Industries: Logistics & Supply Chain, Retail & E-commerce, Fashion & Apparel, Travel & Hospitality, E-commerce Pure

BEGIN;

-- 1. Logistics & Supply Chain (logistics_supply_chain)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "inventory_turnover_ratio": "> 6.0",
        "order_fulfillment_cycle_time": "< 48 hours",
        "transportation_cost_ratio": "< 10% of revenue",
        "on_time_delivery_rate": "> 95%",
        "warehouse_utilization": "> 85%",
        "gross_margin": "> 40% (Services) / > 70% (SaaS)"
    }'::jsonb,
    warning_signs = '[
        "High rates of empty miles (deadhead) in transportation fleets.",
        "Lack of real-time visibility (tracking updates taking >4 hours).",
        "Heavy reliance on a single port or carrier for >50% of volume.",
        "Manual reconciliation of BOL (Bill of Lading) and invoices.",
        "High percentage of obsolete inventory (>10%)."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Fragile Chain",
            "description": "Failing to build redundancy into the supply chain, leading to total collapse during a single geopolitical or weather event."
        },
        {
            "pattern": "The Asset-Heavy Anchor",
            "description": "Investing too early in physical trucks or warehouses instead of a light-weight coordination layer, leading to high fixed costs."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Unique access to carrier/shipper data; working beta; initial logistics partners.",
        "Seed": "$500k GMV or $50k MRR; visibility into 100+ nodes; initial automation data.",
        "Series A": "$5M+ GMV; proven cost reduction for shippers; global expansion plan."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'logistics_supply_chain';

-- 2. Retail & E-commerce (retail_ecommerce)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "average_order_value_aov": "> $75",
        "customer_acquisition_cost_cac": "< 25% of AOV",
        "repeat_purchase_rate": "> 30% (Annual)",
        "conversion_rate": "> 2.5%",
        "inventory_holding_cost": "< 20% of value",
        "gross_margin": "> 50%"
    }'::jsonb,
    warning_signs = '[
        "Paid CAC is higher than the first-order contribution margin.",
        "Significant portion of sales driven by deep discounts (>30%).",
        "High return rates (>20%) indicating product-expectation mismatch.",
        "Lack of omnichannel integration (online vs offline data silos).",
        "Slow site load times (>3s) leading to high bounce rates."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Performance Marketing Trap",
            "description": "Growing revenue purely through Facebook/Google ads while losing money on every transaction, waiting for a retention that never comes."
        },
        {
            "pattern": "The Inventory Bloat",
            "description": "Miscalculating seasonal demand and being left with millions in unsold stock, killing cash flow."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Identified niche; unique product sourcing; working storefront.",
        "Seed": "$50k - $100k Monthly Revenue; LTV/CAC > 2x; positive unit economics.",
        "Series A": "$5M+ Yearly Revenue; 40%+ organic traffic; clear brand authority."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'retail_ecommerce';

-- 3. Fashion & Apparel (fashion_apparel)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "sell_through_rate": "> 70% for full price",
        "weeks_of_supply": "< 12 weeks",
        "return_rate": "< 15%",
        "conversion_share_organic": "> 50%",
        "contribution_margin": "> 30%",
        "gross_margin": "> 65%"
    }'::jsonb,
    warning_signs = '[
        "Over-dependence on a single seasonal trend (one-hit wonder risk).",
        "Negative feedback regarding sizing consistency on social media.",
        "Lead times from design to shelf exceeding 6 months.",
        "High percentage of stock remaining after week 8 of a drop.",
        "Unclear sustainability or ethical sourcing documentation (becoming a liability)."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Trend Lag",
            "description": "Being too slow to capitalize on a cultural trend, leading to highly specific inventory that is irrelevant by the time it arrives."
        },
        {
            "pattern": "The Sizing Nightmare",
            "description": "Poor fit consistency leading to return rates >30%, which wipes out all margins and destroys brand reputation."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Strong brand identity; viral initial growth; identified manufacturing partners.",
        "Seed": "$1M+ Runrate; high repeat purchase rate; influencer/earned media strategy.",
        "Series A": "$10M+ ARR; expansion into new categories; efficient distribution (wholesale vs D2C mix)."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'fashion_apparel';

-- 4. Travel & Hospitality (travel_hospitality)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "revpar": "> $100 (Occupancy x ADR)",
        "occupancy_rate": "> 70%",
        "net_promoter_score": "> 50",
        "ota_commission_ratio": "< 15% of total bookings",
        "repeat_guest_rate": "> 20%",
        "gross_margin": "> 25% (Operations) / > 75% (SaaS)"
    }'::jsonb,
    warning_signs = '[
        "Over-reliance on Online Travel Agencies (Expedia, Airbnb) for >80% of bookings.",
        "Decline in organic brand search volume year-over-year.",
        "High staff turnover (>50% annual) leading to service degradation.",
        "Poor responses to negative reviews on TripAdvisor or Google Maps.",
        "Lack of dynamic pricing logic (fixed rates during peak seasons)."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Aggregator Squeeze",
            "description": "Building a hospitality brand that cannot generate direct traffic, leading to all profit being eaten by platform fees."
        },
        {
            "pattern": "The Capital Exhaustion",
            "description": "Underestimating the maintenance and renovation costs (Capex) required to keep physical properties competitive."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Unique inventory or tech layer; initial traction/bookings; clear differentiation.",
        "Seed": "500+ units or $100k+ Monthly Booking Value; high direct booking ratio.",
        "Series A": "$10M+ GMV; proven unit profitability; multi-market expansion."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'travel_hospitality';

-- 5. E-commerce Pure (ecommerce_pure)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "days_to_ship": "< 1 day",
        "cart_abandonment_rate": "< 65%",
        "customer_lifetime_value": "> 3x CAC",
        "referral_rate": "> 5%",
        "stockout_rate": "< 2%",
        "gross_margin": "> 55%"
    }'::jsonb,
    warning_signs = '[
        "Rising CAC combined with falling repeat purchase rates.",
        "Lack of automated email/SMS sequences for abandoned carts.",
        "Limited payment options (missing Buy Now Pay Later or Digital Wallets).",
        "High reliance on a single SKU for >70% of revenue.",
        "Unfavorable terms with 3PL providers leading to shipping losses."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Single-Product Ceiling",
            "description": "Mastering one product but failing to expand into a category, leading to a growth plateau once the niche is saturated."
        },
        {
            "pattern": "The Ad Spend Spiral",
            "description": "Buying revenue at any cost to show growth for investors, while the fundamental business model remains unprofitable."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Product-market fit evidence; initial SEO/organic loop; unique supply chain.",
        "Seed": "$100k Monthly Revenue; LTV/CAC > 3x; established 3PL/fulfillment.",
        "Series A": "$1M Monthly Revenue; 50%+ Gross Margin; proprietary data/brand moat."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'ecommerce_pure';

COMMIT;
