from fastapi import FastAPI, Cookie
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

class Restaurant(BaseModel):
    place_id: str
    name: str
    photo_reference: str
    price_level: int # 0 - 4
    rating: float # 1.0 - 5.0

next_room_index = 1000

@app.get("/")
async def root():

    room_id = next_room_index
    next_room_index += 1

    # Create new room and new database in MongoDB for the room

    # Also create an individual in the DB and tell the room creator their ID
    indiv_id = 1

    response = JSONResponse(content={"message": "Room created"})
    response.set_cookie(key="room_id", value=room_id)
    response.set_cookie(key="individual_id", value=indiv_id)

    return {"room_id": 1234, "individual_id": 1}

@app.get("/room/{room_id}")
async def join_room(room_id):
    
    # Create new individual with an incremental ID

    indiv_id = 42

    response = JSONResponse(content={"message": "Room joined"})
    response.set_cookie(key="room_id", value=room_id)
    response.set_cookie(key="individual_id", value=indiv_id)

    return response


@app.post("/add-restaurant")
async def add_restaurant(restaurant : Restaurant, room_id : int = Cookie(None), individual_id : int = Cookie(None)):

    # TODO: Add restaurant to MongoDB

    # Validate individual_id is a real id?

    # Add restaurant to DB w/ room_id

    return {"message": "Added restaurant"}

@app.get("/get-pair")
async def get_pair(room_id : int = Cookie(None), individual_id : int = Cookie(None)):

    # Get list of restaurants already visited by individual_id
    visited_restaurants = []
        
    # Get a pair of restaurants from MongoDB that have not already been visited
    restaurant_one : Restaurant = ""
    restaurant_two : Restaurant = ""
    new_pair = {"restaurant_one": restaurant_one, 
                "restaurant_two": restaurant_two}

    # Set the new pair of restaurants as visited by the indiv id

    return new_pair

@app.post("/vote")
async def vote(restaurant : Restaurant, room_id : int = Cookie(None), individual_id : int = Cookie(None)):

    # TODO: Add vote for restaurant to MongoDB

    num_visited_restaurants = 0
    total_restaurants = 10
    if num_visited_restaurants == total_restaurants:
        # Set finished voting under individual in MongoDB

        # Check if everyone has finished voting

        # If everyone is finished voting, calculate winner and set that entry to have is_winner = true
        return {"finished_voting": True}

    return {"message": "Vote successful"}

@app.get("/winner")
async def winner(room_id : int = Cookie(None), individual_id : int = Cookie(None)):
    # Get the winner from MongoDB and return
    winner : Restaurant = ""
    return {"winner" : winner}