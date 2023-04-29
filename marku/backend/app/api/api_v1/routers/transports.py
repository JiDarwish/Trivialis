from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.auth import get_current_active_user
from app.db.models import Transport, Package
from app.db.schemas.transport import (
    TransportCreate,
    TransportUpdate,
    TransportOut,
)

transports_router = r = APIRouter()


@r.get("/transports/{transport_id}", response_model=TransportOut)
def get_transport_by_id(
        transport_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_active_user),
):
    """
    Retrieve transport by ID.
    """
    transport = db.query(Transport).filter(Transport.id == transport_id).first()
    if not transport:
        raise HTTPException(status_code=404, detail="Transport not found")
    if transport.package.plan.preferences.filter_by(
            user_id=current_user.id).first() is None and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="You do not have access to this transport")
    return transport


@r.post("/packages/{package_id}/transports", response_model=TransportOut)
def create_transport_for_package(
        package_id: int,
        transport_in: TransportCreate,
        db: Session = Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    """
    Create a new transport for a given package.
    """
    package = db.query(Package).filter(Package.id == package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    if package.plan.preferences.filter_by(user_id=current_user.id).first() is None and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="You do not have access to create a transport for this package")

    transport = Transport(**transport_in.dict(exclude_unset=True), package_id=package_id)
    db.add(transport)
    db.commit()
    db.refresh(transport)
    return transport


@r.put("/transports/{transport_id}", response_model=TransportOut)
def update_transport_by_id(
        transport_id: int,
        transport_in: TransportUpdate,
        db: Session = Depends(get_db),
        current_user=Depends(get_current_active_user),
):
    """
    Update a transport by ID.
    """
    transport = db.query(Transport).filter(Transport.id == transport_id).first()
    if not transport:
        raise HTTPException(status_code=404, detail="Transport not found")
    if transport.package.plan.preferences.filter_by(
            user_id=current_user.id).first() is None and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="You do not have access to update this transport")

    transport_data = transport_in.dict(exclude_unset=True)
    for key, value in transport_data.items():
        setattr(transport, key, value)
    db.commit()
    db.refresh(transport)
    return transport


@r.delete("/transports/{transport_id}", response_class=Response)
def delete_transport_by_id(
        transport_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_active_user),
):
    """
    Delete a transport by ID.
    """
    transport = db.query(Transport).filter(Transport.id == transport_id).first()
    if not transport:
        raise HTTPException(status_code=404, detail="Transport not found")
    if transport.package.plan.preferences.filter_by(
            user_id=current_user.id).first() is None and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="You do not have access to delete this transport")

    db.delete(transport)
    db.commit()
    return Response(status_code=204)
