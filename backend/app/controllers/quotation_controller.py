from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.quotation_schema import QuotationCreate, QuotationResponse
from app.services.quotation_service import (
    create_quotation,
    get_quotation_by_id,
    get_quotations
)

router = APIRouter(
    prefix="/quotations",
    tags=["Quotations"]
)


@router.post("/", response_model=QuotationResponse)
def create_new_quotation(
    quotation: QuotationCreate,
    db: Session = Depends(get_db)
):
    try:
        return create_quotation(db, quotation)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/", response_model=list[QuotationResponse])
def list_quotations(db: Session = Depends(get_db)):
    return get_quotations(db)


@router.get("/{quotation_id}", response_model=QuotationResponse)
def get_quotation(
    quotation_id: int,
    db: Session = Depends(get_db)
):
    quotation = get_quotation_by_id(db, quotation_id)

    if quotation is None:
        raise HTTPException(status_code=404, detail="Cotización no encontrada")

    return quotation