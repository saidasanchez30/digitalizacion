from sqlalchemy import Column, Integer, String, Float, Boolean, Text

from app.database import Base


class Extra(Base):
    __tablename__ = "extras"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False, default=0)
    percentage = Column(Float, nullable=False, default=0)
    reduces_delivery_days = Column(Boolean, default=False)