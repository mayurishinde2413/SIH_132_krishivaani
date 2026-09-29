# KrishiVaani AI/ML Decision Intelligence Service

FastAPI-powered machine learning and parametric decision science service for the **KrishiVaani** agricultural marketplace.

---

## 📁 Architecture Overview

```
ml-service/
│
├── app/
│   ├── main.py                  # FastAPI Application Entrypoint & Router Registry
│   ├── routes/
│   │   ├── price_forecast.py    # POST /ml/predict-price
│   │   ├── net_realisation.py   # POST /ml/net-realisation
│   │   ├── sell_wait.py         # POST /ml/sell-wait
│   │   └── buyer_match.py       # POST /ml/buyer-match
│   ├── models/
│   │   ├── price_forecaster.py  # Ridge Regression + XGBoost Baseline Wrapper
│   │   ├── net_realisation_engine.py # APMC Cess & Logistic Waterfall Model
│   │   ├── sell_wait_engine.py  # Decision Tree & Payoff Analysis Model
│   │   └── buyer_matcher.py     # Multi-Criteria Decision Analysis (MCDA)
│   ├── services/
│   │   ├── forecast_service.py  # Price prediction orchestration
│   │   ├── realisation_service.py # Net realization waterfall calculation
│   │   ├── sell_wait_service.py # Holding vs liquidation analysis
│   │   └── match_service.py     # Buyer scoring & ranking service
│   ├── schemas/
│   │   ├── price_schema.py      # Request/response Pydantic schemas
│   │   ├── realisation_schema.py# Net realization waterfall schemas
│   │   ├── sell_wait_schema.py  # Sell Now vs Wait schemas
│   │   └── buyer_match_schema.py# Buyer matching schemas
│   └── utils/
│       ├── constants.py         # Perishability, freight & APMC cess rates
│       └── metrics.py           # Transparency disclosures & error metrics
│
├── data/
│   └── sample_mandi_prices.csv  # Historical Mandi arrivals & modal price dataset
├── requirements.txt             # Python dependencies
└── README.md                    # Service documentation
```

---

## 🔬 Core ML Functions & Endpoints

### 1. Price Forecasting (`POST /ml/predict-price`)
- **Input**: Crop, Market, Historical prices, Market arrivals, Season, Month, Weather features.
- **Algorithm**: Ridge Regression + XGBoost feature wrapper with arrival elasticity curves.
- **Output**: Point prediction, confidence interval range (`low` to `high`), and factor influence breakdown.
- **Transparency Label**: `Prototype estimation`

### 2. Net Realisation Waterfall (`POST /ml/net-realisation`)
- **Input**: Crop, Quantity (kg/Q), Grade/Quality, Market, Distance (km), Quoted Price, Transport cost, Mandi cess, Expected in-transit wastage.
- **Algorithm**: Parametric deduction waterfall subtracting real logistics, statutory 0.5% APMC market cess, distance-decay spoilage, and quality discounts.
- **Output**: Expected net take-home realization, net per kg, gross revenue, and multi-market rankings.
- **Transparency Label**: `Prototype estimation`

### 3. Sell Now / Wait Decision Engine (`POST /ml/sell-wait`)
- **Input**: Current price, Historical price trend, Weather alerts (e.g. rain/storm), Crop perishability rating, Storage daily cost, Expected future price.
- **Algorithm**: Financial payoff matrix comparing zero-storage immediate liquidation against holding risk (shrinkage loss + storage fee + transit disruption risk).
- **Output**: Structured decision recommendation (`SELL NOW` or `HOLD/WAIT`), comparison factor tables, and decision rationale.
- **Transparency Label**: `Prototype estimation`

### 4. Institutional Buyer Matching (`POST /ml/buyer-match`)
- **Input**: Crop, Quantity, Quality/Grade, Location, Asking price, Optional buyer requirements pool.
- **Algorithm**: Multi-Criteria Decision Analysis (MCDA) evaluating crop identity, batch size fit, quality tolerance, geographic proximity, and counterparty rating.
- **Output**: Ranked buyers with objective compatibility percentage (0–100%) and fit factor tags.
- **Transparency Label**: `Prototype estimation`

---

## 🚀 Running the Service

### Prerequisites
- Python 3.10+
- Dependencies installed from `requirements.txt`

### Start the Service
```bash
cd ml-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive OpenAPI documentation available at:
`http://localhost:8000/docs`
