from pydantic import BaseModel


class ServiceResponse(BaseModel):
    id: int
    name: str
    description: str
    price_per_1000_pages: float
    estimated_days: int
    is_premium: bool

    class Config:
        from_attributes = True