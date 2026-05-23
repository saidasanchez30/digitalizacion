from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date, datetime


class QuotationCreate(BaseModel):
    company_name: str
    contact_name: str
    email: EmailStr
    phone: str
    service_id: int
    estimated_pages: int
    delivery_method: str
    pickup_date: date
    extra_ids: List[int] = []


class QuotationExtraResponse(BaseModel):
    id: int
    extra_id: int

    class Config:
        from_attributes = True


class QuotationResponse(BaseModel):
    id: int
    company_name: str
    contact_name: str
    email: str
    phone: str
    service_id: int
    estimated_pages: int
    delivery_method: str
    pickup_date: date
    estimated_delivery_date: date
    subtotal: float
    extras_total: float
    total: float
    status: str
    created_at: datetime
    extras: List[QuotationExtraResponse] = []

    class Config:
        from_attributes = True