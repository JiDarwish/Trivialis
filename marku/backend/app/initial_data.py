#!/usr/bin/env python3
from app.db.crud.package import create_package
from app.db.crud.plan import create_plan
from app.db.schemas.package import PackageCreate
from app.db.schemas.plan import PlanCreate
from app.db.crud.user import create_user
from app.db.schemas.user import UserCreate
from app.db.session import SessionLocal


def create_superuser() -> None:
    print("Creating superuser admin@meedle.com")
    db = SessionLocal()

    create_user(
        db,
        UserCreate(
            email="admin@meedle.com",
            password="password",
            is_active=True,
            is_superuser=True,
        ),
    )
    print("Superuser created")


def create_db_plan() -> int:
    db = SessionLocal()
    db_plan = create_plan(db, PlanCreate(name="Plan ABC"))
    print(f"Plan {db_plan.id} created")
    return db_plan.id


def create_db_package(plan_id) -> None:
    db = SessionLocal()
    db_package = create_package(
        db,
        PackageCreate(
            plan_id=plan_id,
            name="Package ABC",
        ),
    )
    print(f"Package {db_package.id} created")


# if run with argument "packages", create packages
if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "populate":
        plan_id = create_db_plan()
        create_db_package(plan_id)
    else:
        create_superuser()

    # Write the code you have to run to create the packages here, as you need to run this inside a docker container
    # You can run this file with the command: docker-compose run --rm app python app/initial_data.py packages
