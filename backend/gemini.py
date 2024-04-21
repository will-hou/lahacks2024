import pathlib
import textwrap

import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown


# def to_markdown(text):
#   text = text.replace('•', '  *')
#   return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

# genai.configure(api_key='AIzaSyDCiHSHTL_hU8e5ypLmL1ppRLHjoYuujHg')

# for m in genai.list_models():
#   if 'generateContent' in m.supported_generation_methods:
#     print(m.name)

# model = genai.GenerativeModel('gemini-1.5-pro-latest')
# response = model.generate_content("Give me the latest news on Taylor Swift")
# print(response.text)

import requests

# Replace 'YOUR_API_KEY' with your actual API key
api_key = 'AIzaSyATsRSz2ApiwFG5rJzNDUqxZ7U6cwySaBo'

# Place ID of the location you want to retrieve the website URL for
place_id = 'ChIJkb-SJQ7e3IAR7LfattDF-3k'

# URL for the Place Details API
api_url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=website&key={api_key}'

try:
    # Send a GET request to the API
    response = requests.get(api_url)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        print(data)

        # Check if the response contains the website URL
        if 'result' in data and 'website' in data['result']:
            website_url = data['result']['website']
            print("Website URL:", website_url)
        else:
            print("Website URL not found for this location.")
    else:
        print("Error:", response.status_code)

except requests.RequestException as e:
    print("Error fetching data:", e)
