from typing import List

from sqlalchemy.orm import Session

from app.data.amadeus_api import get_package_transports, find_destination_intersection
from app.db.crud.transport import create_transport
from app.db.models import Package, Preference
from app.db.schemas.package import PackageCreate, PackageUpdate
from app.db.schemas.transport import TransportCreate


def get_package(db: Session, package_id: int):
    return db.query(Package).filter(Package.id == package_id).first()


def get_packages(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Package).offset(skip).limit(limit).all()


def get_packages_by_plan(db: Session, plan_id: int, skip: int = 0, limit: int = 100):
    # return db.query(Package).filter(Package.plan_id == plan_id).offset(skip).limit(limit).all()
    # return all packages for a plan with the sum of their transport prices as "total_price" field
    packages = db.query(Package).filter(Package.plan_id == plan_id).offset(skip).limit(limit).all()
    for package in packages:
        package.total_price = sum(
            [transport.price if isinstance(transport.price, float) else 0 for transport in package.transports])
    return packages


def create_package(db: Session, package: PackageCreate):
    db_package = Package(**package.dict())
    db.add(db_package)
    db.commit()
    db.refresh(db_package)
    return db_package


def update_package(db: Session, package_id: int, package: PackageUpdate):
    db_package = db.query(Package).filter(Package.id == package_id).first()
    for key, value in package.dict(exclude_unset=True).items():
        setattr(db_package, key, value)
    db.commit()
    db.refresh(db_package)
    return db_package


def delete_package(db: Session, package_id: int):
    db_package = db.query(Package).filter(Package.id == package_id).first()
    db.delete(db_package)
    db.commit()
    return db_package


async def generate_packages(db: Session, plan_id: int) -> List[Package]:
    # get all preferences for the plan
    preferences = db.query(Preference).filter(Preference.plan_id == plan_id).all()

    # make a combined preference dict of the preferences
    combined_preference = dict()
    # # get overlap of start and end dates
    # TODO: make this more robust and throw an error if there is no overlap
    combined_preference['start_date'] = max([preference.start_date for preference in preferences])
    combined_preference['end_date'] = min([preference.end_date for preference in preferences])
    # # make a list of start cities
    combined_preference['start_cities'] = [preference.start_city for preference in preferences]
    # # make an average of taste preferences
    combined_preference['taste_dict'] = dict()
    # TODO: Make this more robust and better for preference aggregation
    # try catch for empty preferences
    try:
        for preference in preferences:
            for key, value in preference.taste_dict.items():
                if key in combined_preference['taste_dict']:
                    combined_preference['taste_dict'][key] += value
                else:
                    combined_preference['taste_dict'][key] = value
        for key, value in combined_preference['taste_dict'].items():
            combined_preference['taste_dict'][key] = value / len(preferences)
    except:
        pass

    # call get_available_flights Hendri's code
    transport_dict: dict = get_package_transports(combined_preference['start_date'],
                                                  combined_preference['end_date'],
                                                  combined_preference['start_cities'])

    # transports is a list of dicts:
    #   [{'destination': 'AMS', 'inbound_transports': [...], 'outbound_transports': [...]}, ...]

    # for now just return a list with a dummy package
    # dummy_package = create_package(db, PackageCreate(plan_id=plan_id, name='Dummy Package'))
    #
    # db_packages = [dummy_package]
    db_packages = []

    # for each destination in transports, create a package named after the destination

    print(transport_dict)

    if not transport_dict or len(transport_dict) == 0:
        return db_packages

    for dest_code, transports in transport_dict.items():

        if len(transports) == 0:
            all_transports = []
        else:
            all_transports = transports['outbound_transports'] + transports['inbound_transports']

        if len(all_transports) == 0:
            continue

        # create the package

        price_of_all_transports = sum([float(transport['price']) for transport in all_transports])
        package = create_package(db,
                                 PackageCreate(plan_id=plan_id, name=dest_code, total_price=price_of_all_transports))
        db_packages.append(package)

        for transport in all_transports:
            await create_transport(db,
                                   TransportCreate(package_id=package.id,
                                                   name=f"Flight from {transport['origin']} to {transport['destination']}",
                                                   link=transport['link'],
                                                   price=transport['price'],
                                                   transport_mode="Flight",
                                                   transport_type=transport['type_flight'],
                                                   start_time=transport['departure_datetime'],
                                                   end_time=transport['arrival_datetime'],
                                                   start_location=transport['origin'],
                                                   end_location=transport['destination']
                                                   )
                                   )

    return db_packages


async def generate_packages2(db: Session, plan_id: int) -> List[Package]:
    # get all preferences for the plan
    preferences = db.query(Preference).filter(Preference.plan_id == plan_id).all()

    # make a combined preference dict of the preferences
    combined_preference = dict()
    # # get overlap of start and end dates
    # TODO: make this more robust and throw an error if there is no overlap
    combined_preference['start_date'] = max([preference.start_date for preference in preferences])
    combined_preference['end_date'] = min([preference.end_date for preference in preferences])
    # # make a list of start cities
    combined_preference['start_cities'] = [preference.start_city for preference in preferences]
    # # make an average of taste preferences
    combined_preference['taste_dict'] = dict()
    # TODO: Make this more robust and better for preference aggregation
    # try catch for empty preferences
    try:
        for preference in preferences:
            for key, value in preference.taste_dict.items():
                if key in combined_preference['taste_dict']:
                    combined_preference['taste_dict'][key]['value'] += value
                else:
                    combined_preference['taste_dict'][key]['value'] = value
        for key, value in combined_preference['taste_dict'].items():
            combined_preference['taste_dict'][key] = value / len(preferences)
    except:
        pass

    # codes for airports in cold countries
    cold_airports = ['HEL', 'ZRH', 'BRU', 'WAW', 'IST', 'LIS', 'NCE', 'OPO', 'BUD', 'ALC', 'IBZ', 'EDI', 'FCO', 'NAP']

    # codes for airports in warm countries
    warm_airports = ['PAR', 'LHR', 'BER', 'FRA', 'MAD', 'VIE', 'CHP', 'DUB', 'ATH']

    airports = []
    if combined_preference['taste_dict']['temperature']['value'] < 5:
        airports = cold_airports
    else:
        airports = warm_airports

    # generate packages for each airport
    db_packages = []
    for airport in airports:
        package = create_package(db, PackageCreate(plan_id=plan_id, name=airport, destination=airport, total_price=100))
        db_packages.append(package)

    return db_packages
