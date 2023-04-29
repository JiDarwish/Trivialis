from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TransportBase(BaseModel):
    package_id: int
    name: Optional[str] = None
    link: Optional[str] = None
    price: Optional[str] = None
    transport_type: Optional[str] = None  # inbound or outbound
    transport_mode: Optional[str] = None  # flight, train, bus, car, etc.
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    start_location: Optional[str] = None
    end_location: Optional[str] = None


class TransportCreate(TransportBase):
    pass


class TransportUpdate(TransportBase):
    id: int


class TransportOut(TransportBase):
    id: int
