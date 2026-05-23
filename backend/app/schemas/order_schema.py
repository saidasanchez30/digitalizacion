from pydantic import BaseModel
from datetime import datetime


class OrderCreate(BaseModel):
    quotation_id: int
    payment_method: str


class OrderStatusUpdate(BaseModel):
    order_status: str


class OrderResponse(BaseModel):
    id: int
    quotation_id: int
    payment_method: str
    payment_status: str
    order_status: str
    created_at: datetime

    class Config:
        from_attributes = True