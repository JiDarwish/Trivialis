from typing import List

from sqlalchemy.orm import Session

from app.db.models import Preference
from app.db.schemas.preference import PreferenceCreate, PreferenceUpdate, PreferenceOut


def get_preferences(db: Session):
    return db.query(Preference).all()


def get_preference(db: Session, user_id: int, plan_id: int):
    return db.query(Preference).filter(
        Preference.user_id == user_id,
        Preference.plan_id == plan_id
    ).first()


def get_preferences_by_user(db: Session, user_id: int) -> List[PreferenceOut]:
    return db.query(Preference).filter(Preference.user_id == user_id).all()


def get_preferences_by_plan(db: Session, plan_id: int) -> List[PreferenceOut]:
    return db.query(Preference).filter(Preference.plan_id == plan_id).all()


def create_preference(db: Session, preference: PreferenceCreate):
    db_preference = Preference(**preference.dict())
    db.add(db_preference)
    db.commit()
    db.refresh(db_preference)
    return db_preference


def update_preference(db: Session, user_id: int, plan_id: int, preference: PreferenceUpdate):
    db_preference = get_preference(db, user_id, plan_id)
    if db_preference:
        update_data = preference.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_preference, key, value)
        db.commit()
        db.refresh(db_preference)
    return db_preference


def delete_preference(db: Session, user_id: int, plan_id: int):
    db_preference = get_preference(db, user_id, plan_id)
    if db_preference:
        db.delete(db_preference)
        db.commit()
    return db_preference
