import google.generativeai as genai

def geminiKeywords(text):
  genai.configure(api_key='YOUR_API_KEY')

  # for m in genai.list_models():
  #   if 'generateContent' in m.supported_generation_methods:
  #     print(m.name)

  model = genai.GenerativeModel('gemini-1.5-pro-latest')
  response = model.generate_content(f"You will be given a large string containing the webpage content for various restaurants. Your job is to provide a comma seperated steing of keywords relating to the type of food and restaurant can be found at these restaurants. Here is the large string: {text}")
  #print(response.text)
  my_list = response.text.split(",")
  return my_list

