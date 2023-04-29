from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta

from .session import Base


class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Plan(TimestampMixin, Base):
    __tablename__ = 'plan'
    id = Column(Integer, primary_key=True, index=True, unique=True, autoincrement=True)
    name = Column(String)

    # Relationships
    preferences = relationship("Preference", back_populates="plan", foreign_keys="[Preference.plan_id]",
                               cascade="all, delete-orphan")
    packages = relationship("Package", back_populates="plan", foreign_keys="[Package.plan_id]",
                            cascade="all, delete-orphan")
    invite_codes = relationship("InviteCode", back_populates="plan", foreign_keys="[InviteCode.plan_id]",
                                cascade="all, delete-orphan")


class Package(TimestampMixin, Base):
    __tablename__ = 'package'
    id = Column(Integer, primary_key=True, index=True, unique=True, autoincrement=True)
    plan_id = Column(Integer, ForeignKey('plan.id'), primary_key=True, index=True)
    name = Column(String)

    destination = Column(String, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    description = Column(String, nullable=True)
    total_price = Column(Float, nullable=True) 

    # Relationships
    plan = relationship("Plan", back_populates="packages", foreign_keys=[plan_id])
    transports = relationship("Transport", back_populates="package", cascade="all, delete-orphan")
    accommodations = relationship("Accommodation", back_populates="package", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="package", cascade="all, delete-orphan")


class Preference(TimestampMixin, Base):
    __tablename__ = 'preference'
    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    plan_id = Column(Integer, ForeignKey('plan.id'), primary_key=True)
    start_date = Column(Date)
    end_date = Column(Date)
    start_city = Column(String)
    taste_dict = Column(JSON)

    # Relationships
    user = relationship("User", back_populates="preferences", foreign_keys=[user_id])
    plan = relationship("Plan", back_populates="preferences", foreign_keys=[plan_id])


class User(TimestampMixin, Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True, index=True, unique=True, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean)
    is_superuser = Column(Boolean)

    # Relationships
    preferences = relationship("Preference", back_populates="user", foreign_keys="[Preference.user_id]",
                               cascade="all, delete-orphan")


class Transport(TimestampMixin, Base):
    __tablename__ = 'transport'
    package_id = Column(Integer, ForeignKey('package.id'), primary_key=True)
    id = Column(Integer, primary_key=True, index=True, unique=True, autoincrement=True)
    name = Column(String)
    link = Column(String)
    transport_mode = Column(String)  # flight, train, bus, car, etc.
    transport_type = Column(String)  # inbound or outbound
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    start_location = Column(String)
    end_location = Column(String)
    price = Column(String)
    description = Column(String)

    # Relationships
    package = relationship("Package", back_populates="transports", foreign_keys=[package_id])


class Accommodation(TimestampMixin, Base):
    __tablename__ = 'accommodation'
    package_id = Column(Integer, ForeignKey('package.id'), primary_key=True)
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String)
    link = Column(String)
    check_in_date = Column(Date)
    check_out_date = Column(Date)

    # Relationships
    package = relationship("Package", back_populates="accommodations", foreign_keys=[package_id])


class Activity(TimestampMixin, Base):
    __tablename__ = 'activity'
    package_id = Column(Integer, ForeignKey('package.id'), primary_key=True)
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String)
    link = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime)

    # Relationships
    package = relationship("Package", back_populates="activities", foreign_keys=[package_id])


class InviteCode(TimestampMixin, Base):
    __tablename__ = 'invite_code'
    plan_id = Column(Integer, ForeignKey('plan.id'), primary_key=True)
    id = Column(Integer, primary_key=True, index=True, unique=True, autoincrement=True)
    code = Column(String, max_length=10, unique=True)

    # defaults to one week after creation
    expires_at = Column(DateTime, default=(datetime.utcnow() + timedelta(days=7)))

    # Relationships
    plan = relationship("Plan", back_populates="invite_codes", foreign_keys=[plan_id])
