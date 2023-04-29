from fastapi import APIRouter, Request, Depends, Response, HTTPException
import typing as t

from sqlalchemy.exc import IntegrityError

from app.db.schemas.preference import PreferenceCreate, PreferenceOut
from app.db.session import get_db
from app.db.crud.plan import (
    get_plans,
    get_plan,
    create_plan,
    update_plan,
    delete_plan,
    get_plans_by_user,
    create_invite_code,
    get_plan_by_invite_code
)
from app.db.crud.preference import create_preference
from app.db.schemas.plan import PlanCreate, PlanUpdate, PlanOut, InviteCodeOut
from app.core.auth import get_current_active_user, get_current_active_superuser

plans_router = r = APIRouter()


@r.get(
    "/plans",
    response_model=t.List[PlanOut],
    response_model_exclude_none=True,
)
async def plans_list(
        response: Response,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    """
    Get all plans (for superusers only)
    """
    # Check if user is superuser
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    plans = get_plans(db)
    # This is necessary for react-admin to work
    response.headers["Content-Range"] = f"0-9/{len(plans)}"
    return plans


# Get current user's plans
@r.get(
    "/plans/me",
    response_model=t.List[PlanOut],
    response_model_exclude_none=True,
)
async def plans_list_me(
        response: Response,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    """
    Get current user's plans
    """
    print(current_user.id)
    plans = get_plans_by_user(db, current_user.id)
    # This is necessary for react-admin to work
    response.headers["Content-Range"] = f"0-9/{len(plans)}"
    return plans


@r.get("/plans/{plan_id}", response_model=PlanOut, response_model_exclude_none=True)
async def plan_details(
        request: Request,
        plan_id: int,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    """
    Get plan details by ID
    """
    plan = get_plan(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan


@r.post("/plans", response_model=PlanOut, response_model_exclude_none=True)
async def plan_create(
        request: Request,
        plan: PlanCreate,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    """
    Create a new plan
    """
    return create_plan(db, plan)


@r.put(
    "/plans/{plan_id}", response_model=PlanOut, response_model_exclude_none=True
)
async def plan_update(
        request: Request,
        plan_id: int,
        plan: PlanUpdate,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    """
    Update an existing plan by ID
    """
    old_plan = get_plan(db, plan_id)
    if not old_plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return update_plan(db, plan_id, plan)


@r.delete(
    "/plans/{plan_id}", response_model=PlanOut, response_model_exclude_none=True
)
async def plan_delete(
        request: Request,
        plan_id: int,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    """
    Delete an existing plan by ID
    """
    plan = get_plan(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return delete_plan(db, plan_id)


# Generate invite code
@r.post("/plan/{plan_id}/invite", response_model=InviteCodeOut, response_model_exclude_none=True)
async def generate_plan_invite_code(
        plan_id: int,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    plan = get_plan(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    # check if user has access to plan through preferences or is superuser
    if not current_user.is_superuser and \
            not any(p.user_id == current_user.id for p in plan.preferences):
        raise HTTPException(status_code=404, detail="User not on this plan")

    # create new InviteCode through crud
    invite_code = create_invite_code(db, plan)

    return invite_code


# Link user to plan via invite code
@r.post("/plan/invite-user/{invite_code}", response_model=PreferenceOut, response_model_exclude_none=True)
async def link_user_to_plan(
        invite_code: str,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    # get plan from invite code
    plan = get_plan_by_invite_code(db, invite_code)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    # check if user has access to plan through preferences or is superuser
    # if not any(p.user_id == current_user.id for p in plan.preferences):
    #     raise HTTPException(status_code=404, detail="User not on this plan")

    # check if invite code is among plan's invite codes
    if not any(ic.code == invite_code for ic in plan.invite_codes):
        raise HTTPException(status_code=404, detail="Invite code not found")

    # add user to plan through preference
    try:
        pref = create_preference(db, PreferenceCreate(user_id=current_user.id, plan_id=plan.id))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="User already has a preference for this plan")

    return pref
