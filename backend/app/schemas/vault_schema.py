from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional


class VaultDocumentCreate(BaseModel):
    file_name: str
    document_type: str
    category: str

    department: Optional[str] = None
    description: Optional[str] = None
    keywords: Optional[str] = None
    document_date: Optional[date] = None
    confidentiality_level: Optional[str] = None
    retention_years: Optional[int] = None

    security_status: str = "encrypted"
    ocr_status: str = "not_applied"
    storage_url: str


class VaultDocumentResponse(BaseModel):
    id: int
    order_id: int

    file_name: str
    document_type: str
    category: str

    department: Optional[str] = None
    description: Optional[str] = None
    keywords: Optional[str] = None
    document_date: Optional[date] = None
    confidentiality_level: Optional[str] = None
    retention_years: Optional[int] = None

    security_status: str
    ocr_status: str
    storage_url: str
    created_at: datetime

    class Config:
        from_attributes = True