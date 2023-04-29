from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class PlanBase(BaseModel):
    name: str


class PlanCreate(PlanBase):
    pass


class PlanUpdate(PlanBase):
    pass


class Plan(PlanBase):
    id: int

    class Config:
        orm_mode = True


class PlanOut(Plan):
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True


class InviteCodeOut(BaseModel):
    plan_id: int
    id: int
    code: str
    expires_at: Optional[datetime]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
