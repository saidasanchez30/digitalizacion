from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    quotation_id = Column(Integer, ForeignKey("quotations.id"), nullable=False)

    payment_method = Column(String(50), nullable=False)
    payment_status = Column(String(50), default="payment_confirmed")
    order_status = Column(String(50), default="pickup_scheduled")

    created_at = Column(DateTime, default=datetime.utcnow)

    quotation = relationship("Quotation")