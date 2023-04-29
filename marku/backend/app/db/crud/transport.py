from sqlalchemy.orm import Session

from app.db.models import Transport, Package
from app.db.schemas.transport import TransportCreate, TransportUpdate


def get_transport(db: Session, transport_id: int):
    return db.query(Transport).filter(Transport.id == transport_id).first()


def get_transports_by_package(db: Session, package_id: int):
    return db.query(Transport).filter(Transport.package_id == package_id).all()


async def create_transport(db: Session, transport: TransportCreate):
    db_transport = Transport(**transport.dict())
    db.add(db_transport)
    db.commit()
    db.refresh(db_transport)
    return db_transport


def update_transport(db: Session, transport_id: int, transport: TransportUpdate):
    db_transport = db.query(Transport).filter(Transport.id == transport_id).first()
    if not db_transport:
        return None
    update_data = transport.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_transport, key, value)
    db.add(db_transport)
    db.commit()
    db.refresh(db_transport)
    return db_transport


def delete_transport(db: Session, transport_id: int):
    db_transport = db.query(Transport).filter(Transport.id == transport_id).first()
    if not db_transport:
        return None
    db.delete(db_transport)
    db.commit()
    return db_transport


async def generate_package_transports(db: Session, package_id: int):
    package = db.query(Package).filter(Package.id == package_id).first()
    if not package:
        return None

    # call amadeus package transport generator

