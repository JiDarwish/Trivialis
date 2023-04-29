from fastapi import APIRouter, Request, Depends, Response, HTTPException, BackgroundTasks
from typing import List

from app.db.crud.preference import get_preference
from app.db.session import get_db
from app.db.crud.package import (
    get_packages_by_plan,
    get_package,
    create_package,
    update_package,
    delete_package,
    generate_packages,
    generate_packages2,
)
from app.db.crud.transport import generate_package_transports
from app.db.schemas.package import PackageCreate, PackageUpdate, PackageOut
from app.core.auth import get_current_active_user

packages_router = r = APIRouter()


@r.get(
    "/plans/{plan_id}/packages",
    response_model=List[PackageOut],
    response_model_exclude_none=True,
)
async def packages_list(
        plan_id: int,
        response: Response,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    """
    Get all packages for a given plan
    """
    print([preference.plan_id for preference in current_user.preferences])
    if not current_user.is_superuser:
        # If the current user is not a superuser, make sure they are associated with the plan through their preferences
        preferences = current_user.preferences
        print(current_user.preferences)
        plan_ids = [preference.plan_id for preference in preferences]
        if plan_id not in plan_ids:
            raise HTTPException(status_code=403, detail="You don't have access to this resource")
    packages = get_packages_by_plan(db, plan_id)
    print(list(map(lambda package: package.total_price, packages)))
    # TODO here why not returning the price?
    return packages


@r.get("/plans/{plan_id}/packages/{package_id}", response_model=PackageOut, response_model_exclude_none=True)
async def package_details(
        request: Request,
        plan_id: int,
        package_id: int,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    """
    Get package details by ID
    """
    package = get_package(db, package_id)
    if not package:
        return {'error': 'Package not found'}
    if package.plan_id != plan_id:
        return {'error': 'Package not found for given plan'}
    # if not current_user.is_superuser:
    #     # If the current user is not a superuser, make sure they are associated with the plan through their preferences
    #     preferences = current_user.preferences
    #     plan_ids = [preference.plan_id for preference in preferences]
    #     if plan_id not in plan_ids:
    #         raise HTTPException(status_code=403, detail="You don't have access to this resource")
    #     # If the current user is associated with the plan through their preferences, make sure the package belongs to the plan
    #     package_ids = [preference.package_id for preference in preferences if preference.plan_id == plan_id]
    #     if package_id not in package_ids:
    #         raise HTTPException(status_code=403, detail="You don't have access to this resource")
    return package


@r.post("/plans/{plan_id}/packages", response_model=PackageOut, response_model_exclude_none=True)
async def package_create(
        request: Request,
        plan_id: int,
        package: PackageCreate,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    """
    Create a new package for a given plan
    """
    # Check if the user has a preference for the given plan
    preference = get_preference(db, current_user.id, plan_id)
    if not preference:
        raise HTTPException(status_code=403, detail="You are not authorized to create packages for this plan.")

    package.plan_id = plan_id
    return create_package(db, package)


@r.put(
    "/plans/{plan_id}/packages/{package_id}",
    response_model=PackageOut,
    response_model_exclude_none=True
)
async def package_update(
        request: Request,
        plan_id: int,
        package_id: int,
        package: PackageUpdate,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    """
    Update an existing package by ID
    """
    existing_package = get_package(db, package_id)
    if not existing_package:
        return {'error': 'Package not found'}
    if existing_package.plan_id != plan_id:
        return {'error': 'Package not found for given plan'}

    # Check if the package belongs to the current user
    if existing_package.plan.preferences.filter_by(user_id=current_user.id).first() is None:
        return {'error': 'Package not found for current user'}

    updated_package = update_package(db, package_id, package)
    return updated_package


@r.delete(
    "/plans/{plan_id}/packages/{package_id}", response_model=PackageOut, response_model_exclude_none=True
)
async def package_delete(
        request: Request,
        plan_id: int,
        package_id: int,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    """
    Delete an existing package by ID
    """
    package = get_package(db, package_id)
    if not package:
        return {'error': 'Package not found'}
    if package.plan_id != plan_id:
        return {'error': 'Package not found for given plan'}
    if package.plan_id not in [p.plan_id for p in current_user.preferences]:
        return {'error': 'User does not have permission to delete this package'}
    return delete_package(db, package_id)


# Generate packages
@r.post("/plans/{plan_id}/packages/generate", response_model=List[PackageOut], response_model_exclude_none=True)
async def package_generate(
        request: Request,
        plan_id: int,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    """
    Generate packages for a given plan
    """
    # Check if the user has a preference for the given plan
    preference = get_preference(db, current_user.id, plan_id)
    if not preference:
        raise HTTPException(status_code=403, detail="You are not authorized to create packages for this plan.")

    # Generate packages
    packages = await generate_packages(db, plan_id)
    return packages


# Generate packages for plan 2
@r.post("/plans/{plan_id}/packages/generate2", response_model=List[PackageOut], response_model_exclude_none=True)
async def package_generate2(
        request: Request,
        background_tasks: BackgroundTasks,
        plan_id: int,
        db=Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    """
    Generate packages for a given plan
    """
    # Check if the user has a preference for the given plan
    preference = get_preference(db, current_user.id, plan_id)
    if not preference:
        raise HTTPException(status_code=403, detail="You are not authorized to create packages for this plan.")

    # Generate packages
    packages = await generate_packages2(db, plan_id)

    # trigger task here to generate transports for all packages on plan
    for package in packages:
        package_id = package.id
        background_tasks.add_task(generate_package_transports, db, package_id)
    return packages
