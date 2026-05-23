from pydantic import BaseModel


class ExtraResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    percentage: float
    reduces_delivery_days: bool

    class Config:
        from_attributes = True