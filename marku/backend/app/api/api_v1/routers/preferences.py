from fastapi import APIRouter, Request, Depends, Response, HTTPException
from typing import List, Union
from app.db.session import get_db
from app.db.crud.preference import (
    get_preferences,
    get_preference,
    get_preferences_by_user,
    get_preferences_by_plan,
    create_preference,
    update_preference,
    delete_preference,
)
from app.db.schemas.preference import (
    PreferenceCreate,
    PreferenceUpdate,
    PreferenceOut, PreferenceBase,
)
from app.core.auth import (
    get_current_active_user,
    get_current_user,
)

preferences_router = r = APIRouter()


@r.get(
    "/preferences",
    response_model=List[PreferenceOut],
    response_model_exclude_none=True,
)
async def preferences_list(
        response: Response,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
) -> List[PreferenceOut]:
    """
    Get all preferences
    """
    preferences = get_preferences(db)
    # This is necessary for react-admin to work
    response.headers["Content-Range"] = f"0-9/{len(preferences)}"
    return preferences


@r.get(
    "/preferences/user/{user_id}",
    response_model=List[PreferenceOut],
    response_model_exclude_none=True,
)
async def preferences_by_user(
        user_id: int,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
) -> List[PreferenceOut]:
    """
    Get preferences for a user
    """
    return get_preferences_by_user(db, user_id)


@r.get(
    "/preferences/plan/{plan_id}",
    response_model=List[PreferenceOut],
    response_model_exclude_none=True,
)
async def preferences_by_plan(
        plan_id: int,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
) -> List[PreferenceOut]:
    """
    Get preferences for a user
    """
    return get_preferences_by_plan(db, plan_id)


@r.get(
    "/preferences/{user_id}/{plan_id}",
    response_model=PreferenceOut,
    response_model_exclude_none=True,
)
async def preference_details(
        request: Request,
        user_id: int,
        plan_id: int,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
) -> PreferenceOut:
    """
    Get preference details by user ID and plan ID
    """
    preference = get_preference(db, user_id, plan_id)
    if not preference:
        raise HTTPException(status_code=404, detail="Preference not found")
    return preference


@r.post(
    "/preferences/{user_id}/{plan_id}",
    response_model=PreferenceOut,
    response_model_exclude_none=True,
)
async def preference_create(
        request: Request,
        user_id: int,
        plan_id: int,
        preference: PreferenceBase,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
) -> PreferenceOut:
    """
    Create a new preference for a user and plan
    """
    print(preference)

    pref_create = PreferenceCreate(**preference.dict(), user_id=user_id, plan_id=plan_id)
    preference = create_preference(db, preference=pref_create)
    return preference


@r.put(
    "/preferences/{user_id}/{plan_id}",
    response_model=PreferenceOut,
    response_model_exclude_none=True,
)
async def preference_update(
        request: Request,
        user_id: int,
        plan_id: int,
        preference: PreferenceUpdate,
        db=Depends(get_db),
        current_user=Depends(get_current_user),
) -> Union[PreferenceOut, HTTPException]:
    """
    Update an existing preference by user ID and plan ID
    """
    old_preference = get_preference(db, user_id, plan_id)
    if not old_preference:
        raise HTTPException(status_code=404, detail="Preference not found")
    if old_preference.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    preference = update_preference(db, user_id, plan_id, preference)
    return preference


@r.delete(
    "/preferences/{user_id}/{plan_id}",
    response_model=PreferenceOut,
    response_model_exclude_none=True,
)
async def preference_delete(
        request: Request,
        user_id: int,
        plan_id: int,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
) -> Union[PreferenceOut, HTTPException]:
    """
    Delete an existing preference by user ID
    """
    preference = get_preference(db, user_id, plan_id)
    if not preference:
        raise HTTPException(
            status_code=404, detail="Preference not found"
        )
    if not current_user.is_superuser and preference.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not enough permissions"
        )
    return delete_preference(db, user_id, plan_id)
