from searchNearby import searchNearby
from getSite import getSite
from getLocation import getLocation
from getDetails import getDetails

def getReccomendations(api_key: str, place_id: str):

    # 1) generate the coordinates for our input place_id
    coordinates = getLocation(api_key,place_id)
    #print("COORDINATES:", coordinates)

    # 2) get the info (place_ids) of nearby restaurants that fit keywords
    keywords = ['chicken', 'cheap']
    nearbyPlaces = searchNearby(api_key, coordinates, keywords)
    #print("NEARBY PLACES:", nearbyPlaces)
    
    # 3) get the specific information we need from each restaurant for the rec. cards!
    info = [getDetails(api_key,x) for x in nearbyPlaces]
    #print("INFO:", info)



    return info

if __name__ == '__main__':
    print("\n\nTESTING\n\n")
    # Replace 'YOUR_API_KEY' with your actual API key
    api_key = 'AIzaSyDnfl8r3cvSdPrTniJHCqrhRVK5dht159Q'

    # Place ID of the location you want to retrieve the website URL for
    place_id = 'ChIJI9teAIa8woARLWI6Uft_8KA' #set to Pauley Pavillion

    cards = getReccomendations(api_key, place_id)
    print(cards)