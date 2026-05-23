from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(Integer, primary_key=True, index=True)

    company_name = Column(String(150), nullable=False)
    contact_name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(30), nullable=False)

    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)

    estimated_pages = Column(Integer, nullable=False)
    delivery_method = Column(String(100), nullable=False)

    pickup_date = Column(Date, nullable=False)
    estimated_delivery_date = Column(Date, nullable=False)

    subtotal = Column(Float, nullable=False)
    extras_total = Column(Float, nullable=False)
    total = Column(Float, nullable=False)

    status = Column(String(50), default="quotation_generated")
    created_at = Column(DateTime, default=datetime.utcnow)

    service = relationship("Service")
    extras = relationship(
        "QuotationExtra",
        back_populates="quotation",
        cascade="all, delete-orphan"
    )


class QuotationExtra(Base):
    __tablename__ = "quotation_extras"

    id = Column(Integer, primary_key=True, index=True)

    quotation_id = Column(Integer, ForeignKey("quotations.id"), nullable=False)
    extra_id = Column(Integer, ForeignKey("extras.id"), nullable=False)

    quotation = relationship("Quotation", back_populates="extras")
    extra = relationship("Extra")