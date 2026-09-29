# ml-service/app/utils/constants.py

STATUS_PROTOTYPE = "Prototype estimation"

PERISHABILITY_MAP = {
    "tomato": {"level": "High (2-4 days)", "spoilage_rate_daily": 0.007, "base_price": 2700},
    "onion": {"level": "Medium (2-3 months)", "spoilage_rate_daily": 0.002, "base_price": 1600},
    "potato": {"level": "Medium (1-2 months)", "spoilage_rate_daily": 0.0015, "base_price": 1200},
    "wheat": {"level": "Low (12+ months)", "spoilage_rate_daily": 0.0001, "base_price": 2200},
    "bajra": {"level": "Low (12+ months)", "spoilage_rate_daily": 0.0001, "base_price": 2050},
    "soybean": {"level": "Low (12+ months)", "spoilage_rate_daily": 0.0001, "base_price": 4000},
    "maize": {"level": "Low (12+ months)", "spoilage_rate_daily": 0.0001, "base_price": 1850},
}

GRADE_DISCOUNT_RATES = {
    "grade a": 0.0,
    "grade a+": -0.04,  # Premium price bonus
    "grade b": 0.06,
    "grade c": 0.14,
}

MANDI_CESS_RATE = 0.005  # 0.5% statutory APMC market cess
FREIGHT_BASE_FEE = 300.0  # Base loading/dispatch handling fee in INR
FREIGHT_PER_KM_PER_TON = 16.0  # INR per km per metric ton
