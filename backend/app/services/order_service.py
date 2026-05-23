from sqlalchemy.orm import Session

from app.models.order_model import Order
from app.models.quotation_model import Quotation
from app.schemas.order_schema import OrderCreate


def create_order(db: Session, order_data: OrderCreate):
    """
    Crea una orden a partir de una cotización existente.
    El pago se simula como confirmado.
    """

    quotation = db.query(Quotation).filter(
        Quotation.id == order_data.quotation_id
    ).first()

    if quotation is None:
        raise ValueError("La cotización seleccionada no existe")

    if quotation.status == "cancelled":
        raise ValueError("No se puede crear una orden de una cotización cancelada")

    existing_order = db.query(Order).filter(
        Order.quotation_id == order_data.quotation_id
    ).first()

    if existing_order is not None:
        raise ValueError("Ya existe una orden para esta cotización")

    new_order = Order(
        quotation_id=order_data.quotation_id,
        payment_method=order_data.payment_method,
        payment_status="payment_confirmed",
        order_status="pickup_scheduled"
    )

    quotation.status = "payment_confirmed"

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order


def get_orders(db: Session):
    return db.query(Order).all()


def get_order_by_id(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()

def cancel_order(db: Session, order_id: int):
    """
    Cancela una orden solo si todavía no se han recolectado
    los documentos físicos.
    """

    order = db.query(Order).filter(Order.id == order_id).first()

    if order is None:
        raise ValueError("La orden no existe")

    if order.order_status == "cancelled":
        raise ValueError("La orden ya está cancelada")

    if order.order_status != "pickup_scheduled":
        raise ValueError(
            "No se puede cancelar la orden porque el servicio ya inició"
        )

    order.order_status = "cancelled"
    order.payment_status = "refund_pending"

    if order.quotation:
        order.quotation.status = "cancelled"

    db.commit()
    db.refresh(order)

    return order

def update_order_status(db: Session, order_id: int, new_status: str):
    """
    Actualiza el estado de una orden para ver
    el avance del servicio de digitalización.
    """

    valid_statuses = [
        "pickup_scheduled",
        "documents_collected",
        "digitizing",
        "quality_review",
        "preparing_delivery",
        "delivered",
        "cancelled",
        "available_in_vault"
    ]

    if new_status not in valid_statuses:
        raise ValueError("Estado de orden no válido")

    order = db.query(Order).filter(Order.id == order_id).first()

    if order is None:
        raise ValueError("La orden no existe")

    if order.order_status == "cancelled":
        raise ValueError("No se puede actualizar una orden cancelada")

    if order.order_status == "delivered":
        raise ValueError("No se puede actualizar una orden ya entregada")

    order.order_status = new_status

    db.commit()
    db.refresh(order)

    return order