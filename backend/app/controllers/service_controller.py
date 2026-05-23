from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.service_model import Service
from app.schemas.service_schema import ServiceResponse

router = APIRouter(
    prefix="/services",
    tags=["Services"]
)


@router.get("/", response_model=list[ServiceResponse])
def get_services(db: Session = Depends(get_db)):
    services = db.query(Service).all()
    return services