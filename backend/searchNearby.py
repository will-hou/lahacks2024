import requests

def searchNearby(location, keywords, open_now=True):
    api_key = 'YOUR_API_KEY'
    url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
    
    params = {
        'location': location,
        'radius': 1000,  # Adjust the radius as needed
        'type': 'restaurant',
        'keyword': '|'.join(keywords),  # Join keywords with '|'
        'opennow': open_now,
        'key': api_key
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    if 'results' in data:
        print(data['results'])
        return [x['place_id'] for x in data['results']]
    else:
        return None


if __name__ == '__main__':
    # Example usage
    location = '34.0722,-118.4441'  # Coordinates of Pauley Pavilion
    keywords = ['chicken', 'cheap']  # List of keywords
    restaurants = searchNearby(location, keywords)

    print(type(restaurants))
    if restaurants:
            print(restaurants)
    else:
        print("No restaurants found.")
