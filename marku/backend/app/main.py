from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
import uvicorn

from app.api.api_v1.routers.plans import plans_router
from app.api.api_v1.routers.preferences import preferences_router
from app.api.api_v1.routers.users import users_router
from app.api.api_v1.routers.packages import packages_router
from app.api.api_v1.routers.transports import transports_router
from app.api.api_v1.routers.auth import auth_router
from app.core import config
from app.db.session import SessionLocal
from app.core.auth import get_current_active_user
from app.core.celery_app import celery_app

app = FastAPI(
    title=config.PROJECT_NAME, docs_url="/api/docs", openapi_url="/api"
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = SessionLocal()
    response = await call_next(request)
    request.state.db.close()
    return response


@app.get("/api/v1")
async def root():
    return {"message": "Hello World"}


@app.get("/api/v1/task")
async def example_task():
    celery_app.send_task("app.tasks.example_task", args=["Hello World"])

    return {"message": "success"}


# Routers
app.include_router(
    users_router,
    prefix="/api/v1",
    tags=["users"],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(
    plans_router,
    prefix="/api/v1",
    tags=["plans"],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(
    packages_router,
    prefix="/api/v1",
    tags=["packages"],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(
    preferences_router,
    prefix="/api/v1",
    tags=["preferences"],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(
    transports_router,
    prefix="/api/v1",
    tags=["transports"],
    dependencies=[Depends(get_current_active_user)],
)

app.include_router(auth_router, prefix="/api", tags=["auth"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888)
