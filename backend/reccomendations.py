from searchNearby import searchNearby
from getSite import getSite
from getLocation import getLocation
from getDetails import getDetails

def getReccomendations(api_key: str, place_id: str):

    # 1) generate the coordinates for our input place_id
    coordinates = getLocation(api_key,place_id)

    # 2) get the info (place_ids) of nearby restaurants that fit keywords
    keywords = ['chicken', 'cheap']
    nearbyPlaces = searchNearby(coordinates, keywords)


    return

if __name__ == '__main__':
    pass