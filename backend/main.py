from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Restaurant(BaseModel):
    place_id: str
    name: str
    photo_reference: str
    price_level: int # 0 - 4
    rating: float # 1.0 - 5.0


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/add-restaurant")
async def add_restaurant(restaurant : Restaurant):

    # TODO: Add restaurant to MongoDB

    return {"message": "Ok"}

@app.get("/get-pair")
async def get_pair():
    restaurant_one : Restaurant = ""
    restaurant_two : Restaurant = ""
    new_pair = {"restaurant_one": restaurant_one, 
                "restaurant_two": restaurant_two}

    # TODO: Get pair from MongoDB

    return new_pair

@app.put("/vote")
async def vote(restaurant : Restaurant):

    # TODO: Add vote for restaurant to MongoDB

    return {"message": "Ok"}