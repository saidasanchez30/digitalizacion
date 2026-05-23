from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.order_schema import OrderCreate, OrderResponse, OrderStatusUpdate
from app.services.order_service import (
    create_order,
    get_orders,
    get_order_by_id,
    cancel_order,
    update_order_status
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.post("/", response_model=OrderResponse)
def create_new_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):
    try:
        return create_order(db, order)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/", response_model=list[OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    return get_orders(db)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = get_order_by_id(db, order_id)

    if order is None:
        raise HTTPException(status_code=404, detail="Orden no encontrada")

    return order

@router.post("/{order_id}/cancel", response_model=OrderResponse)
def cancel_existing_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    try:
        return cancel_order(db, order_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    
@router.put("/{order_id}/status", response_model=OrderResponse)
def update_existing_order_status(
    order_id: int,
    status_data: OrderStatusUpdate,
    db: Session = Depends(get_db)
):
    try:
        return update_order_status(
            db=db,
            order_id=order_id,
            new_status=status_data.order_status
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))