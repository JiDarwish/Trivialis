import datetime

from amadeus import Client, ResponseError
import json
import webbrowser
import pandas as pd
from typing import List
import os
from app.core.celery_app import celery_app
import concurrent.futures


def get_amadeus_client_object():
    amadeus = Client(
        client_id="1SATcUHMGgygOanNs5IkRIW4xEXbCibq",
        client_secret="VhmswAHFuHWb7YND",
    )
    return amadeus


def pretty_print(response, json_body=True):
    """
    Args:
        response (_type_): json body
        json_body (bool, optional): Set to false if you want to pretty print a dict
    """

    json_object = json.loads(response.body) if json_body else response
    json_formatted_str = json.dumps(json_object, indent=2)
    print('Json object')
    print(json_formatted_str)


# sandbox for API's


def convert_airport_name_to_code(airport_name: str) -> str:
    # check if file exists
    filename = 'app/data/airport_codes.csv' if os.path.exists('app/data/airport_codes.csv') else 'airport_codes.csv'
    airport_codes_df = pd.read_csv(filename)
    result = airport_codes_df[airport_codes_df['Airport'].str.contains(airport_name)]

    if len(result) > 0:  # note if there is more than 1, it will just take the 1st one
        airport_code = result['Code'].values[0]

        print('INFO: Origin Airport code: ', airport_code)
        return airport_code

    else:  # TODO: turn into try exception
        print("ERROR: no airport code found for: '", airport_name, "'")
        return {"no airport found"}


def get_destinations_from_airport(airport_code: str) -> dict:
    """Given an airport code, (AMS, MAD, LHR) returns a list of destinations this airport travels to.
    
    The idea is to use these destinations to find an overlap between the two starting points,
    for the given starting date.

    TODO: FOR NOW WE ONLY LOOK AT EUROPE

    Args:
        airport_code (str): _description_

    Returns:
        dict: {origin_code: [destination_codes]}
    """

    amadeus = get_amadeus_client_object()
    response = amadeus.airport.direct_destinations.get(
        departureAirportCode=airport_code)
    destination_codes = [d['iataCode'] for d in response.data]

    return {airport_code: destination_codes}
    # TODO: finish


def create_google_flights_link(origin, destination, start_date, end_date, duration=None):
    flight_url = "https://www.google.com/travel/flights?q=Flights%20to%20" + str(destination) + \
                 "%20from%20" + str(origin) + "%20on%20" + str(start_date) + "%20through%20" + str(end_date)
    return flight_url


def get_flights_task(airport, origin_code, start_date, end_date):
    """
    Task wrapper for getting flights
    """
    try:
        return get_flights_from_origin_to_destination(origin_code, airport, start_date, end_date)
    except:
        print("ERROR: could not get flights from ", origin_code, " to ", airport)
        return None


def get_flights_for_airport(airport, origin_code_1, origin_code_2, start_date, end_date):
    # each call returns 2 flights, a outbound from origin to dest and an inbound from dest to origin
    origin_1_flights = get_flights_task(origin_code_1, airport, start_date, end_date)
    origin_2_flights = get_flights_task(origin_code_2, airport, start_date, end_date)

    # if either of the flights is None, then we return None
    if origin_1_flights is None or origin_2_flights is None:
        return (airport, [])
    return (
        airport,
        {"outbound_transports": [origin_1_flights["outbound_transports"], origin_2_flights["outbound_transports"]],
         "inbound_transports": [origin_1_flights["inbound_transports"], origin_2_flights["inbound_transports"]]})


def get_best_flights_to_mutual_airport(origin_code_1: str, origin_code_2: str,
                                       mutual_airports: list,
                                       start_date: str,
                                       end_date: str, duration=6):
    """
    Finds best flights from both origin to every mutual airport. Every entry contains 4 flights. An inbound and outbound flight from each origin

    Args:
        origin_code_1 (str): origin airport code
        origin_code_2 (str): origin airport code
        mutual_airports (list): list of mutual airports to which both origins fly
        start_date (str): departure date to use in  flight search (e.g "2023-08-01")
        end_date (str): return date to use in  flight search (e.g "2023-08-01")
        duration (int): max duration of flight in hours (not used in filter right now)

    Returns:
        dict : dict  of dict containing best locations (see docs at get_package_transports )
    """
    #   Confirm availability and price from origin_1 to All its destinations in

    # mutual_airports = ['PAR', 'LHR', 'BER', 'BRC', 'FRA', 'MAD', 'VIE', 'CHP', 'DUB', 'ATH', 'ZRH', 'HEL', 'BRU', 'WAW',
    #                    'IST', 'LIS', 'NCE', 'OPO', 'BUD', 'ALC', 'IBZ', 'EDI', 'FCO', 'NAP']  # limit for now
    mutual_airports = ['IBZ', 'ALC', 'HEL', 'MAD', 'EDI', 'LHR', 'WAW', 'LIS', 'FCO', 'ATH', 'ZRH']  # limit for now
    plan = {}

    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = [executor.submit(get_flights_for_airport, airport, origin_code_1, origin_code_2, start_date, end_date)
                   for airport in mutual_airports]
        plan = {airport: data for airport, data in [res.result() for res in results]}

    return plan


def get_flights_from_origin_to_destination(origin_code: str, destination_code: str, start_date: str, end_date: str):
    """
    Given origin and destination code, search whether there are AVAILABLE flights departing on this day.
    The get request gets the flights and the post requests checks whether they are still available.
    We read everything into a the appropriate format. See get_package_transports

    For more detail about return type see get_package_transports
    Args:
        origin_code (str): Ex. AMS
        destination_code (str): Ex. LHR
        startDate (str): 2023-08-01
        endDate (str): 2023-08-15

    Returns:
        dict of list of dict: {dest_code: [outbound_transports, outbound_transports]}
    """
    amadeus = get_amadeus_client_object()
    outbound_transports = {}
    inbound_transports = {}

    # if start_date == end_date:
    #     start_date = "2023-08-01"
    #     end_date = "2023-08-15"
    #     print("Date Trouble")
    #
    # start_date = "2023-08-01"
    # end_date = "2023-08-15"

    try:
        flights = amadeus.shopping.flight_offers_search.get(originLocationCode=origin_code,
                                                            destinationLocationCode=destination_code,
                                                            departureDate=start_date, returnDate=end_date,
                                                            adults=1).data

        response_one_flight = amadeus.shopping.flight_offers.pricing.post(flights[0])

        # flight to dest
        price = response_one_flight.data["flightOffers"][0]["price"]["total"]
        carrier_out = response_one_flight.data["flightOffers"][0]["itineraries"][0]["segments"][0][
            "carrierCode"]  # segment 0 = flight to dest. seg 1 flight from dest
        flight_number_out = response_one_flight.data["flightOffers"][0]["itineraries"][0]["segments"][0]["number"]
        carrier_flight_number_out = carrier_out + flight_number_out
        emmisions_out = response_one_flight.data["flightOffers"][0]["itineraries"][0]["segments"][0]["co2Emissions"][0][
            "weight"]  # im not sure how accurate this
        departure_time_out = response_one_flight.data["flightOffers"][0]["itineraries"][0]["segments"][0]["departure"][
            "at"]
        duration_out = \
            response_one_flight.data["flightOffers"][0]["itineraries"][0]["segments"][0]["duration"].split("PT")[1]
        arrival_datetime_out = response_one_flight.data["flightOffers"][0]["itineraries"][0]["segments"][0]["arrival"][
            "at"]
        link = create_google_flights_link(origin_code, destination_code, start_date, end_date)

        # flight back to origin
        carrier_in = response_one_flight.data["flightOffers"][0]["itineraries"][1]["segments"][0]["carrierCode"]
        flight_number_in = response_one_flight.data["flightOffers"][0]["itineraries"][1]["segments"][0]["number"]
        carrier_flight_number_in = carrier_in + flight_number_in
        emmisions_in = response_one_flight.data["flightOffers"][0]["itineraries"][1]["segments"][0]["co2Emissions"][0][
            "weight"]
        departure_time_in = response_one_flight.data["flightOffers"][0]["itineraries"][1]["segments"][0]["departure"][
            "at"]
        duration_in = \
            response_one_flight.data["flightOffers"][0]["itineraries"][1]["segments"][0]["duration"].split("PT")[1]
        arrival_datetime_in = response_one_flight.data["flightOffers"][0]["itineraries"][1]["segments"][0]["arrival"][
            "at"]
        # checkin_link

        outbound_transports["type_flight"] = "Outbound"
        outbound_transports["origin"] = origin_code
        outbound_transports["destination"] = destination_code
        outbound_transports["departure_date"] = departure_time_out.split("T")[0]
        outbound_transports["departure_datetime"] = departure_time_out
        outbound_transports["arrival_date"] = arrival_datetime_out.split("T")[0]
        outbound_transports["arrival_datetime"] = arrival_datetime_out
        outbound_transports["price"] = price  # this include inbound and outbound
        outbound_transports["carrier"] = carrier_out
        outbound_transports["carrier_flight_number"] = carrier_flight_number_out
        outbound_transports["emmisions"] = emmisions_out
        outbound_transports["duration"] = duration_out
        outbound_transports["link"] = link

        # inbound:
        inbound_transports["type_flight"] = "Inbound"
        inbound_transports["origin"] = destination_code
        inbound_transports["destination"] = origin_code
        inbound_transports["departure_date"] = departure_time_in.split("T")[0]
        inbound_transports["departure_datetime"] = departure_time_in
        inbound_transports["arrival_date"] = arrival_datetime_in.split("T")[0]
        inbound_transports["arrival_datetime"] = arrival_datetime_in
        inbound_transports["price"] = price
        inbound_transports["carrier"] = carrier_in
        inbound_transports["carrier_flight_number"] = carrier_flight_number_in
        inbound_transports["emmisions"] = emmisions_in
        inbound_transports["duration"] = duration_in
        inbound_transports["link"] = link


    except ResponseError as error:
        print('ERROR: ResponseError: Something bombed out - likely there are no fligths on these dates')
        raise error
    except AttributeError as error:
        print(
            'ERROR: AttributeError: Something bombed out - likely you are using the wrong keys to access the HTTP response, or the flight doesnt exist.')
        raise error

    print("INFO: Fetched outbound and inbound flights for ", origin_code, " to ", destination_code)
    return {"outbound_transports": outbound_transports, "inbound_transports": inbound_transports}


def get_flight_destinations_from_origin(origin: str, startDate: str, endDate: str, duration: int) -> dict:
    """
    NOTE: This is a preloaded cache, it is updated daily. It differs from day to day. 
    Flights today might not be on offer tomorow. We are moving away from this as it is unreliable
    
    Uses Amadeus API to get cheapest 15 flights from origin. 

    Args:
        origin (str): CityCode
        startDate (str): yyyy-mm-dd
        endDate (str): yyyy-mm-dd
        duration (int): duration of trip

    Returns:
        dict: HTTP response 

    """
    debug = True
    amadeus = get_amadeus_client_object()
    print('was able to retrieve client token')
    response = None

    # try:
    response = amadeus.shopping.flight_destinations.get(
        origin=origin,
        departureDate=startDate
        # duration=duration
    )

    if debug:
        pretty_print(response)

    # except ResponseError as error:
    # response = error
    # print('Error: ', error)
    # print(error.description)

    return response


def find_destination_intersection(origin_1: dict, origin_2: dict):
    """Finds intersection of cities to which both airlines fly to

    Args:
        origin_1 (dict): {origin_code: [destination_codes]}
        origin_2 (dict): 

    Returns:
        list: list of intersecting cities
    """
    origin_1_destinations = list(origin_1.values())[0]
    origin_2_destinations = list(origin_2.values())[0]
    list_mutual_cities = set(origin_1_destinations).intersection(origin_2_destinations)

    return list_mutual_cities


def find_mutual_cities(response_1: dict, response_2: dict) -> dict:  # cities or countries ?
    """
    from the API call we now have top 15 cheapest destination 
    cities (response) from origin airport for given start date and location.
    We now see which cities apear in both responses.

    Args:
        response_1 (dict): list of dicts containing different destinations. HTTP GET response
        response_2 (dict): ""

    Returns:
        dict: {destination city code: {detailed name,  sum of price1 and price2, return date}}
    """
    # TODO: (What to do if no intersection...?) --> tweek date, duration,
    # rn its breaking if it cant find intersection 

    intersection_cities_info = {}
    cities_1 = None  # [d["destination"] for d in response_1.result['data']]
    cities_2 = None  # [d["destination"] for d in response_2.result['data']]

    try:
        cities_1 = [d["destination"] for d in response_1.result['data']]
        cities_2 = [d["destination"] for d in response_2.result['data']]

    except AttributeError as error:
        print('AttributeError: ', 'No flights found at one of your origins. Try a different location or date.')
        return {'error': 'No flights found at one of your origins. Try a different location or date.'}

    # check if intersection (mutal cities)
    intersection_cities_1 = [city for city in cities_1 if city in cities_2]
    intersection_cities_2 = [city for city in cities_2 if
                             city in cities_1]  # we repeat because the order for each list  is importante!

    if len(intersection_cities_1) == 0:  # no intersection
        return {'Error': 'No cities intersecting cities found. Try a different location or date.'}

    i_cities_1 = [i for i, c in enumerate(cities_1) if c in intersection_cities_1]
    i_cities_2 = [i for i, c in enumerate(cities_2) if c in intersection_cities_2]

    for i, c in zip(i_cities_1, intersection_cities_1):
        price_1 = float(response_1.result['data'][i]['price']['total'])
        return_date = response_1.result['data'][i]['returnDate']
        city_name = response_1.result["dictionaries"]["locations"][c][
            "detailedName"]  # Hmm this returns airport name, might need fix
        intersection_cities_info[c] = {"price": price_1, 'return_date': return_date, "city_name": city_name}

    for i, c in zip(i_cities_2, intersection_cities_2):
        price_2 = float(response_2.result['data'][i]['price']['total'])
        intersection_cities_info[c]['price'] += price_2

    # TODO: sort dict according to price:

    return intersection_cities_info


def check_flight_availibility(origin_1, origin_2, destination):
    # check if flight still available - Work in progress
    amadeus = get_amadeus_client_object()
    flight_search = amadeus.shopping.flight_offers_search.get(originLocationCode=origin_1,
                                                              destinationLocationCode='LHR')
    # r = amadeus.shopping.availability.flight_availabilities.post(flight_search.data[0])


def get_hotels_for_city(cityCode):
    # Get hotels for city - Work in progress
    amadeus = get_amadeus_client_object()
    response = amadeus.reference_data.locations.hotels.by_city.get(
        cityCode=cityCode)  # returns a list of hotels and id's. We can the get prices and availibilty using ids.
    return response


# NOTE: I took out the async. Uncomment line below and comment line below it if you need async
# async def get_package_transports(start_date, end_date, origins) -> List[dict]:

def get_package_transports(start_date, end_date, origins) -> dict:
    """
    Gets the best destinations and transports to them from both origin airports

    Args:
        start_date (str): start date for flight ("2023-08-01")
        end_date (str): end date for flight ("2023-08-15")
        origins (list): list of origin cities (e.g. ["London", "Berlin"])

    Returns:
        dict [dict[]]: dict of dicts containing the best transports to mutual destinations
        - each dict contains the following keys:
            - destination (str): destination airport code (e.g. "LHR")
                - inbound_transports (list): list of dicts containing the transports
                - outbound_transports (list): list of dicts containing the transports
                    - each dict contains the following keys:
                        - type_flight (str): type of flight (e.g. "Outbound")
                        - origin (str): origin airport code (e.g. "LHR")
                        - destination (str): destination airport code (e.g. "LHR")
                        - departure_date (str): departure date for the flight (e.g. "2023-08-01")
                        - departure_date_time (str): departure date for the flight (e.g. "2023-08-01T17:35:00")
                        - arrival_date (str): return date for the flight (e.g. "2023-08-15")
                        - arrival_date_time (str): departure date for the flight (e.g. "2023-08-01T17:35:00")
                        - price (float): price for the transport (e.g. 100.0)
                        - carrier (str): carrier name code (e.g. "BA")
                        - carrier flight_number (str): flight number (e.g. "BA123")
                        - duration (str): duration of the flight (e.g. "2H30M")
                        - emmisions (int): the amount of CO2 emisions in kg
                        - link (str): link to the flight on google flights (e.g. "https://www.google.com/travel/flights/...")
    """

    # TODO: assume we only have 2 origins
    origin_1 = origins[0]
    # if list is len 1, then we only have one origin
    origin_2 = origins[1] if len(origins) > 1 else origins[0]

    airport_code_1 = convert_airport_name_to_code(origin_1)
    airport_code_2 = convert_airport_name_to_code(origin_2)

    destinations_from_airport_1 = get_destinations_from_airport(airport_code_1)
    destinations_from_airport_2 = get_destinations_from_airport(airport_code_2)
    mutual_airports = find_destination_intersection(destinations_from_airport_1, destinations_from_airport_2)

    transports = get_best_flights_to_mutual_airport(airport_code_1, airport_code_2, mutual_airports, start_date,
                                                    end_date)

    pretty_print(transports, False)
    return transports


def run_tester_functionality():
    start_date = "2023-08-01"
    end_date = '2023-08-15'
    origin_1 = 'Amsterdam'  # change to 'LHR' to see how it doesn't find flights
    origin_2 = 'Madrid'
    origins = [origin_1, origin_2]
    get_package_transports(start_date, end_date, origins)


if __name__ == "__main__":
    run_tester_functionality()
