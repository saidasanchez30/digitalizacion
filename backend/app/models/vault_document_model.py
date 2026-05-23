from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base

class VaultDocument(Base):
    __tablename__ = "vault_documents"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)

    file_name = Column(String(150), nullable=False)
    document_type = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)

    # Campos de gestión documental
    department = Column(String(100), nullable=True)
    description = Column(String(255), nullable=True)
    keywords = Column(String(255), nullable=True)
    document_date = Column(Date, nullable=True)
    confidentiality_level = Column(String(50), nullable=True)
    retention_years = Column(Integer, nullable=True)

    # Campos de simulación tecnológica
    security_status = Column(String(100), default="encrypted")
    ocr_status = Column(String(100), default="not_applied")

    storage_url = Column(String(255), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order")