from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel


# Schema for creating a new package
class PackageCreate(BaseModel):
    plan_id: int
    name: str
    destination: Optional[str]
    total_price: Optional[float]


# Schema for updating an existing package
class PackageUpdate(BaseModel):
    name: Optional[str] = None
    # Other fields you want to include in the update schema


# Schema for a package as stored in the database
class Package(BaseModel):
    id: int
    name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Schema for a package returned in API responses
class PackageOut(BaseModel):
    id: int
    name: str
    total_price: Optional[str]

    destination: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    transports: Optional[list] = None

    class Config:
        orm_mode = True
