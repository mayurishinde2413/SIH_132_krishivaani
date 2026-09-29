# ml-service/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.price_forecast import router as price_router
from app.routes.net_realisation import router as realisation_router
from app.routes.sell_wait import router as sell_wait_router
from app.routes.buyer_match import router as buyer_match_router

app = FastAPI(
    title="KrishiVaani AI/ML Engine",
    description="Intelligent Agri-Fintech Decision Science, Price Forecasting & Realisation Service",
    version="2.0.0"
)

# ─── CORS Middleware ─────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(price_router)
app.include_router(realisation_router)
app.include_router(sell_wait_router)
app.include_router(buyer_match_router)

@app.get("/ml/health")
async def health_check():
    return {
        "status": "ok",
        "service": "KrishiVaani AI/ML Service",
        "endpoints": [
            "/ml/predict-price",
            "/ml/net-realisation",
            "/ml/sell-wait",
            "/ml/buyer-match"
        ]
    }

@app.get("/")
async def root():
    return {
        "message": "Welcome to KrishiVaani ML Service",
        "version": "2.0.0",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
