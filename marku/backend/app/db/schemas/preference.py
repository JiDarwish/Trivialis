from typing import Optional
from datetime import date
from pydantic import BaseModel


class PreferenceBase(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    start_city: Optional[str] = None
    taste_dict: Optional[dict] = None


class PreferenceCreate(PreferenceBase):
    user_id: int
    plan_id: int


class PreferenceUpdate(PreferenceBase):
    pass


class PreferenceOut(PreferenceBase):
    user_id: int
    plan_id: int

    class Config:
        orm_mode = True
