from searchNearby import searchNearby
from getSite import getSite
from getSiteContent import getSiteContent, getPlaceIds
from getLocation import getLocation
from getDetails import getDetails
from gemini import geminiKeywords

def getReccomendations(api_key: str, place_id: str, room_id: int):

    #print("\nPART1\n")

    # 1) generate the coordinates for our input place_id
    coordinates = getLocation(api_key,place_id)
    #print("COORDINATES:", coordinates)

    #print("\nPART2\n")

    # 2) get the currently selected restaurants and 

    restaurantIds = getPlaceIds(room_id)

    allText = ''.join([getSiteContent(getSite(api_key, i)) for i in restaurantIds])

    keywords = geminiKeywords(allText)
    #print("KEYWORDS:", keywords)

    # 3) get the info (place_ids) of nearby restaurants that fit keywords
    #keywords = ['chicken', 'cheap']
    nearbyPlaces = searchNearby(api_key, coordinates, keywords)
    #print("NEARBY PLACES:", nearbyPlaces)

    #print("\nPART3\n")
    
    # 4) get the specific information we need from each restaurant for the rec. cards!
    info = [getDetails(api_key,x) for x in nearbyPlaces]
    #print("INFO:", info)

    #print("\nPART4\n")



    return info

if __name__ == '__main__':
    # Replace 'YOUR_API_KEY' with your actual API key
    api_key = 'YOUR_API_KEY'

    # Place ID of the location you want to retrieve the website URL for
    place_id = 'ChIJI9teAIa8woARLWI6Uft_8KA' #set to Pauley Pavillion

    cards = getReccomendations(api_key, place_id, 1000)
    for card in cards:
        print(card)
        print()