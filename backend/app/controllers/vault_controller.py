from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.vault_schema import VaultDocumentCreate, VaultDocumentResponse
from app.services.vault_service import add_vault_document, get_vault_documents

router = APIRouter(
    prefix="/orders",
    tags=["Vault"]
)


@router.post("/{order_id}/vault/documents", response_model=VaultDocumentResponse)
def create_vault_document(
    order_id: int,
    document: VaultDocumentCreate,
    db: Session = Depends(get_db)
):
    try:
        return add_vault_document(
            db=db,
            order_id=order_id,
            document_data=document
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get("/{order_id}/vault", response_model=list[VaultDocumentResponse])
def list_vault_documents(
    order_id: int,
    db: Session = Depends(get_db)
):
    try:
        return get_vault_documents(db=db, order_id=order_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))