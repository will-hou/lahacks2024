import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from getSite import getSite

def getSiteContent(url):
    try:
        # Fetch the HTML content of the webpage
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes

        # Parse HTML using BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract text from HTML
        text = soup.get_text(separator='\n', strip=True)

        return text

    except Exception as e:
        print("An error occurred:", e)
        return None


def getPlaceIds(room_id):
    
    mclient = MongoClient("mongodb+srv://yasper:29DVVkQOa9IAKamB@lahacks2024.dcnfecn.mongodb.net/?retryWrites=true&w=majority&appName=lahacks2024")

    # Validate room ID
    if str(room_id) not in mclient.list_database_names():
        return {"message": "Room does not exist"}

    room_db = mclient[str(room_id)]

    restaurants = []
    for restaurant in room_db['restaurants'].find():
        restaurants.append(restaurant['place_id'])

    return restaurants


if __name__ == '__main__':

    restaurantIds = getPlaceIds(1000)

    # Replace 'YOUR_API_KEY' with your actual API key
    api_key = 'YOUR_API_KEY'

    for i in restaurantIds:
        url = getSite(api_key, i)
        text = getSiteContent(url)
        if text:
            print(text)
        else:
            print("Failed to extract text from the URL.")
