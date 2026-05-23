from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.extra_model import Extra
from app.schemas.extra_schema import ExtraResponse

router = APIRouter(
    prefix="/extras",
    tags=["Extras"]
)


@router.get("/", response_model=list[ExtraResponse])
def get_extras(db: Session = Depends(get_db)):
    extras = db.query(Extra).all()
    return extras