from datetime import timedelta
from sqlalchemy.orm import Session

from app.models.service_model import Service
from app.models.extra_model import Extra
from app.models.quotation_model import Quotation, QuotationExtra
from app.schemas.quotation_schema import QuotationCreate


def calculate_estimated_delivery_date(pickup_date, base_days, urgent_selected):
    """
    Calcula la fecha estimada de entrega.
    Si el cliente selecciona digitalización urgente,
    se reducen los días estimados.
    """

    if urgent_selected:
        reduced_days = max(1, base_days - 3)
        return pickup_date + timedelta(days=reduced_days)

    return pickup_date + timedelta(days=base_days)


def create_quotation(db: Session, quotation_data: QuotationCreate):
    """
    Crea una cotización calculando subtotal, extras,
    total y fecha estimada de entrega.
    """

    service = db.query(Service).filter(Service.id == quotation_data.service_id).first()

    if service is None:
        raise ValueError("El servicio seleccionado no existe")

    selected_extras = db.query(Extra).filter(
        Extra.id.in_(quotation_data.extra_ids)
    ).all()

    pages_blocks = quotation_data.estimated_pages / 1000

    subtotal = pages_blocks * service.price_per_1000_pages

    extras_total = 0
    urgent_selected = False

    for extra in selected_extras:
        if extra.percentage > 0:
            extras_total += subtotal * (extra.percentage / 100)

        if extra.price > 0:
            extras_total += extra.price

        if extra.reduces_delivery_days:
            urgent_selected = True

    total = subtotal + extras_total

    estimated_delivery_date = calculate_estimated_delivery_date(
        pickup_date=quotation_data.pickup_date,
        base_days=service.estimated_days,
        urgent_selected=urgent_selected
    )

    new_quotation = Quotation(
        company_name=quotation_data.company_name,
        contact_name=quotation_data.contact_name,
        email=quotation_data.email,
        phone=quotation_data.phone,
        service_id=quotation_data.service_id,
        estimated_pages=quotation_data.estimated_pages,
        delivery_method=quotation_data.delivery_method,
        pickup_date=quotation_data.pickup_date,
        estimated_delivery_date=estimated_delivery_date,
        subtotal=subtotal,
        extras_total=extras_total,
        total=total,
        status="quotation_generated"
    )

    db.add(new_quotation)
    db.commit()
    db.refresh(new_quotation)

    for extra in selected_extras:
        quotation_extra = QuotationExtra(
            quotation_id=new_quotation.id,
            extra_id=extra.id
        )
        db.add(quotation_extra)

    db.commit()
    db.refresh(new_quotation)

    return new_quotation


def get_quotation_by_id(db: Session, quotation_id: int):
    return db.query(Quotation).filter(Quotation.id == quotation_id).first()


def get_quotations(db: Session):
    return db.query(Quotation).all()