from sqlalchemy.orm import Session

from app.models.order_model import Order
from app.models.vault_document_model import VaultDocument
from app.schemas.vault_schema import VaultDocumentCreate


def validate_premium_order(order: Order):
    """
    Valida que la orden pertenezca a un Plan Premium.
    La relación es:
    Order -> Quotation -> Service
    """

    if order is None:
        raise ValueError("La orden no existe")

    if order.quotation is None:
        raise ValueError("La orden no tiene cotización asociada")

    if order.quotation.service is None:
        raise ValueError("La cotización no tiene servicio asociado")

    if not order.quotation.service.is_premium:
        raise ValueError("La bóveda digital solo está disponible para el Plan Premium")


def add_vault_document(
    db: Session,
    order_id: int,
    document_data: VaultDocumentCreate
):
    """
    Agrega un documento simulado a la bóveda digital
    de una orden Premium.
    """

    order = db.query(Order).filter(Order.id == order_id).first()

    validate_premium_order(order)

    if order.order_status == "cancelled":
        raise ValueError("No se pueden agregar documentos a una orden cancelada")

    vault_document = VaultDocument(
        order_id=order_id,
        file_name=document_data.file_name,
        document_type=document_data.document_type,
        category=document_data.category,
        security_status=document_data.security_status,
        ocr_status=document_data.ocr_status,
        storage_url=document_data.storage_url
    )

    db.add(vault_document)

    # Para el demo, cuando agregamos documentos a la bóveda,
    # marcamos la orden como disponible en bóveda digital.
    order.order_status = "available_in_vault"

    db.commit()
    db.refresh(vault_document)

    return vault_document


def get_vault_documents(db: Session, order_id: int):
    """
    Obtiene los documentos simulados de la bóveda
    para una orden Premium.
    """

    order = db.query(Order).filter(Order.id == order_id).first()

    validate_premium_order(order)

    documents = db.query(VaultDocument).filter(
        VaultDocument.order_id == order_id
    ).all()

    return documents