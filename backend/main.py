import logging
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pymongo import MongoClient

app = FastAPI()

app.next_room_index = 1000

logger = logging.getLogger("uvicorn")
logger.setLevel(logging.DEBUG)

mclient = MongoClient("mongodb+srv://yasper:29DVVkQOa9IAKamB@lahacks2024.dcnfecn.mongodb.net/?retryWrites=true&w=majority&appName=lahacks2024")



class Restaurant(BaseModel):
    place_id: str
    name: str
    photo_reference: str
    price_level: int # 0 - 4
    rating: float # 1.0 - 5.0


@app.get("/")
async def root():

    room_id = app.next_room_index
    app.next_room_index += 1

    # Create new room and new database in MongoDB for the room
    room_db = mclient[str(room_id)]
    restaurants_collection = room_db["restaurants"]
    individuals_collection = room_db["individuals"]

    # Also create an individual in the DB and tell the room creator their ID
    indiv_id = individuals_collection.insert_one({
        "restaurants_seen" : [],
        "finished_voting" : False,
    }).inserted_id

    response = JSONResponse(content={"message": "Room created", "room_id": room_id, "individual_id": indiv_id})

    return response

@app.get("/room/{room_id}")
async def join_room(room_id):
    
    # Validate room ID
    if str(room_id) not in mclient.list_database_names():
        return {"message": "Room does not exist"}

    # Create new individual with an incremental ID
    room_db = mclient[str(room_id)]
    individuals_collection = room_db["individuals"]

    indiv_id = individuals_collection.insert_one({
        "restaurants_seen" : [],
        "finished_voting" : False,
    }).inserted_id

    response = JSONResponse(content={"message": "Room created", "room_id": room_id, "individual_id": indiv_id})

    return response


@app.post("/add-restaurant")
async def add_restaurant(restaurant : Restaurant, room_id : int, individual_id : str):

    # TODO: Add restaurant to MongoDB

    # Validate individual_id is a real id?

    # Add restaurant to DB w/ room_id

    return {"message": "Added restaurant"}

@app.get("/get-pair")
async def get_pair(room_id : int, individual_id : str):

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
async def vote(restaurant : Restaurant, room_id : int, individual_id : str):

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
async def winner(room_id : int, individual_id : str):
    # Get the winner from MongoDB and return
    winner : Restaurant = ""
    return {"winner" : winner}