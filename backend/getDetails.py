import requests

'''
getDetails is a function which takes in a valid Google Maps API Key and
a valid Google Maps Place ID and, if it exists, returns a bunch of info :D
'''

def getDetails(api_key: str, place_id: str ) -> str:
    # URL for the Place Details API
    api_url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&key={api_key}'

    try:
        # Send a GET request to the API
        response = requests.get(api_url)

        # Check if the request was successful
        if response.status_code == 200:
            # Parse the JSON response
            data = response.json()
            # print(data)

            # Check if the response contains the location 
            if 'result' in data:
                info = dict()
                info['place_id'] = data['result']['place_id']
                info['name'] = data['result']['name']
                info['website'] = data['result']['website']
                info['photo_reference'] = data['result']['photos'][0]['photo_reference']
                info['rating'] = data['result']['rating']
                #print("Info", info)
                return info
            else:
                print("info not found for this location.")
                return None
        else:
            print("Error:", response.status_code)

    except requests.RequestException as e:
        print("Error fetching data:", e)
        return None
    
if __name__ == '__main__':
    # Replace 'YOUR_API_KEY' with your actual API key
    api_key = 'AIzaSyDnfl8r3cvSdPrTniJHCqrhRVK5dht159Q'

    # Place ID of the location you want to retrieve the website URL for
    place_id = 'ChIJuQFwNo68woARC7sp3N5RWKs' #set to BCD Tofu House in Irvine for example

    info = getDetails(api_key, place_id)
    print(info)