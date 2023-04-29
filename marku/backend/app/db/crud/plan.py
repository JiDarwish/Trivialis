import secrets

from sqlalchemy.orm import Session

from app.db.models import Plan, Preference, InviteCode
from app.db.schemas.plan import PlanCreate, PlanUpdate


def get_plan(db: Session, plan_id: int) -> Plan:
    return db.query(Plan).filter(Plan.id == plan_id).first()


def get_plans(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Plan).offset(skip).limit(limit).all()


def get_plans_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    # Get plans by user through preference linker table, specifying join conditions
    plans = (
        db.query(Plan)
        .join(Preference, Plan.id == Preference.plan_id)
        .filter(Preference.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return plans


def create_plan(db: Session, plan: PlanCreate) -> Plan:
    db_plan = Plan(**plan.dict())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan


def update_plan(db: Session, plan_id: int, plan: PlanUpdate) -> Plan:
    db_plan = get_plan(db, plan_id)
    for field, value in plan:
        setattr(db_plan, field, value)
    db.commit()
    db.refresh(db_plan)
    return db_plan


def delete_plan(db: Session, plan_id: int) -> Plan:
    db_plan = get_plan(db, plan_id)
    db.delete(db_plan)
    db.commit()
    return db_plan


def create_invite_code(db: Session, plan: Plan) -> InviteCode:
    code = secrets.token_urlsafe(10)
    db_invite_code = InviteCode(plan_id=plan.id, code=code)
    db.add(db_invite_code)
    db.commit()
    db.refresh(db_invite_code)
    return db_invite_code


def get_plan_by_invite_code(db: Session, code: str) -> Plan:
    invite_code = db.query(InviteCode).filter(InviteCode.code == code).first()
    return invite_code.plan
