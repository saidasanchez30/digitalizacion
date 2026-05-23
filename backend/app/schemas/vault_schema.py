from pydantic import BaseModel
from datetime import datetime


class VaultDocumentCreate(BaseModel):
    file_name: str
    document_type: str
    category: str
    security_status: str = "encrypted_simulated"
    ocr_status: str = "not_applied"
    storage_url: str


class VaultDocumentResponse(BaseModel):
    id: int
    order_id: int
    file_name: str
    document_type: str
    category: str
    security_status: str
    ocr_status: str
    storage_url: str
    created_at: datetime

    class Config:
        from_attributes = True