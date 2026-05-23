from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models

from app.controllers.service_controller import router as service_router
from app.controllers.extra_controller import router as extra_router
from app.controllers.quotation_controller import router as quotation_router
from app.controllers.order_controller import router as order_router
from app.controllers.vault_controller import router as vault_router

app = FastAPI(
    title="API Digitalización Documental",
    description="API para cotización, compra y seguimiento de servicios de digitalización documental",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(service_router)
app.include_router(extra_router)
app.include_router(quotation_router)
app.include_router(order_router)
app.include_router(vault_router)


@app.get("/")
def home():
    return {
        "message": "API de Digitalización Documental funcionando correctamente"
    }