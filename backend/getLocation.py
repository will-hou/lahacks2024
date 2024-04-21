import requests

'''
getLocation is a function which takes in a valid Google Maps API Key and
a valid Google Maps Place ID and, if it exists, returns the location coordinates
associated with the place.
'''

def getLocation(api_key: str, place_id: str ) -> str:
    # URL for the Place Details API
    api_url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=geometry&key={api_key}'

    try:
        # Send a GET request to the API
        response = requests.get(api_url)

        # Check if the request was successful
        if response.status_code == 200:
            # Parse the JSON response
            data = response.json()
            #print(data)

            # Check if the response contains the location 
            if 'result' in data and 'geometry' in data['result'] and 'location' in data['result']['geometry']:
                location = data['result']['geometry']['location']
                #print("Location Coordinates:", location)
                return f"{location['lat']},{location['lng']}"
            else:
                print("location coordinates not found for this location.")
                return None
        else:
            print("Error:", response.status_code)

    except requests.RequestException as e:
        print("Error fetching data:", e)
        return None
    
if __name__ == '__main__':
    # Replace 'YOUR_API_KEY' with your actual API key
    api_key = 'YOUR_API_KEY'

    # Place ID of the location you want to retrieve the website URL for
    place_id = 'ChIJuQFwNo68woARC7sp3N5RWKs' #set to BCD Tofu House in Irvine for example

    coordinates = getLocation(api_key, place_id)
    print(coordinates)