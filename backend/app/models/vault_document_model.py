from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
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

    security_status = Column(String(100), default="encrypted_simulated")
    ocr_status = Column(String(100), default="not_applied")

    storage_url = Column(String(255), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order")