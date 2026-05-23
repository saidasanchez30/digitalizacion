from sqlalchemy import Column, Integer, String, Float, Boolean, Text

from app.database import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    price_per_1000_pages = Column(Float, nullable=False)
    estimated_days = Column(Integer, nullable=False)
    is_premium = Column(Boolean, default=False)