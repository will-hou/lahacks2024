import logging
from fastapi import FastAPI, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from typing import Annotated
from bson.objectid import ObjectId
import random


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger("uvicorn")
logger.setLevel(logging.DEBUG)

mclient = MongoClient("mongodb+srv://yasper:29DVVkQOa9IAKamB@lahacks2024.dcnfecn.mongodb.net/?retryWrites=true&w=majority&appName=lahacks2024")



class Restaurant(BaseModel):
    place_id: str
    name: str
    link: str
    photo_reference: str
    price_level: int # 0 - 4
    rating: float # 1.0 - 5.0


@app.get("/")
async def root():

    room_id = 1000
    while str(room_id) in mclient.list_database_names():
        room_id += 1

    # Create new room and new database in MongoDB for the room
    room_db = mclient[str(room_id)]
    restaurants_collection = room_db["restaurants"]
    individuals_collection = room_db["individuals"]

    # Also create an individual in the DB and tell the room creator their ID
    indiv_id = individuals_collection.insert_one({
        "restaurants_seen" : {},
        "finished_voting" : False,
    }).inserted_id

    response = JSONResponse(content={"message": "Room created", "room_id": room_id, "individual_id": str(indiv_id)})

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
        "restaurants_seen" : {},
        "finished_voting" : False,
    }).inserted_id

    for restaurant in room_db['restaurants'].find():
        individuals_collection.update_one( { '_id': indiv_id }, 
                                { '$set': {"restaurants_seen."+restaurant['place_id'] : 0}})

    response = JSONResponse(content={"message": "Room joined", "room_id": int(room_id), "individual_id": str(indiv_id)})

    return response


@app.post("/add-restaurant")
async def add_restaurant(restaurant : Restaurant, room_id : Annotated[int, Body()], individual_id : Annotated[str, Body()]):

    # Validate room ID
    if str(room_id) not in mclient.list_database_names():
        return {"message": "Room does not exist"}

    room_db = mclient[str(room_id)]

    # Validate individual ID
    individuals_collection = room_db["individuals"]
    # Validate individual_id is a real id?
    if individuals_collection.count_documents({'_id' : ObjectId(individual_id)}, limit = 1) == 0:
        return {"message": "Individual does not exist"} 

    # Add restaurant to DB w/ room_id
    restaurants_collection = room_db["restaurants"]
    restaurants_collection.insert_one({
        "place_id" : restaurant.place_id,
        "name" : restaurant.name, 
        "link" : restaurant.link,
        "photo_reference" : restaurant.photo_reference,
        "price_level" : restaurant.price_level,
        "rating" : restaurant.rating,
        "votes" : 0,
        "appearances" : 0,
        "is_winner": False
    })

    for individual in individuals_collection.find():
        individuals_collection.update_one( { '_id': individual['_id'] }, 
                                { '$set': {"restaurants_seen."+restaurant.place_id : 0}})

    return {"message": "Added restaurant"}

@app.get("/get-pair")
async def get_pair(room_id : int, individual_id : str):

    # Validate room ID
    if str(room_id) not in mclient.list_database_names():
        return {"message": "Room does not exist"}

    room_db = mclient[str(room_id)]

    # Validate individual ID
    individuals_collection = room_db["individuals"]
    # Validate individual_id is a real id?
    if individuals_collection.count_documents({'_id' : ObjectId(individual_id)}, limit=1) == 0:
        return {"message": "Individual does not exist"}

    restaurants_with_weighting = {}
    visited_restaurants = individuals_collection.find_one({'_id' : ObjectId(individual_id)})['restaurants_seen']
    # Get list of restaurants already visited by individual_id
    average_occurrence = 0
    for restaurant in room_db['restaurants'].find():
        average_occurrence += visited_restaurants[restaurant['place_id']]
    average_occurrence /= room_db['restaurants'].estimated_document_count()
    # 10 + (avg_occ - num_occ)*2
    for restaurant in room_db['restaurants'].find():
        restaurants_with_weighting[restaurant["place_id"]] = 10 + (average_occurrence - visited_restaurants[restaurant['place_id']])*2

        
    rnd_one = room_db['restaurants'].find_one({"place_id" : random.choices(list(restaurants_with_weighting.keys()), weights=list(restaurants_with_weighting.values()), k=1)[0]})
    del restaurants_with_weighting[rnd_one['place_id']]
    rnd_two = room_db['restaurants'].find_one({"place_id" : random.choices(list(restaurants_with_weighting.keys()), weights=list(restaurants_with_weighting.values()), k=1)[0]})

    # Get a pair of restaurants from MongoDB that have not already been visited
    restaurant_one : Restaurant = Restaurant(place_id=rnd_one['place_id'], name=rnd_one['name'], 
                        link=rnd_one['link'], photo_reference=rnd_one['photo_reference'],
                        price_level=rnd_one['price_level'], rating=rnd_one['rating'])
    restaurant_two : Restaurant = Restaurant(place_id=rnd_two['place_id'], name=rnd_two['name'], 
                        link=rnd_one['link'], photo_reference=rnd_two['photo_reference'],
                        price_level=rnd_two['price_level'], rating=rnd_two['rating'])
    new_pair = {"restaurant_one": restaurant_one, 
                "restaurant_two": restaurant_two}

    # Set the new pair of restaurants as visited by the indiv id

    individuals_collection.update_one( { '_id': ObjectId(individual_id) }, 
                                { '$inc': {"restaurants_seen."+rnd_one['place_id'] : 1}})

    individuals_collection.update_one( { '_id': ObjectId(individual_id) }, 
                                { '$inc': {"restaurants_seen."+rnd_two['place_id'] : 1}})

    room_db['restaurants'].update_one( {"place_id" : rnd_one['place_id']} ,
                                { '$inc': {"appearances" : 1}})
    room_db['restaurants'].update_one( {"place_id" : rnd_two['place_id']} ,
                                { '$inc': {"appearances" : 1}})


    return new_pair

@app.post("/vote")
async def vote(restaurant : Restaurant, room_id : Annotated[int, Body()], individual_id : Annotated[str, Body()]):

    # Validate room ID
    if str(room_id) not in mclient.list_database_names():
        return {"message": "Room does not exist"}

    room_db = mclient[str(room_id)]

    # Validate individual ID
    individuals_collection = room_db["individuals"]
    # Validate individual_id is a real id?
    if individuals_collection.count_documents({'_id' : ObjectId(individual_id)}, limit=1) == 0:
        return {"message": "Individual does not exist"}

    # TODO: Add vote for restaurant to MongoDB
    restaurants_collection = room_db['restaurants']
    restaurants_collection.update_one( {"place_id" : restaurant.place_id} ,
                                { '$inc': {"votes" : 1}})

    num_visited_restaurants = 0
    for key, value in individuals_collection.find_one({"_id" : ObjectId(individual_id)})['restaurants_seen'].items():
        if value >= 1:
            num_visited_restaurants += 1

    total_restaurants = 0
    for restaurant in restaurants_collection.find():
        total_restaurants += 1
    if num_visited_restaurants == total_restaurants:
        # Set finished voting under individual in MongoDB
        individuals_collection.update_one({"_id" : individual_id}, {'$set' : {'finished_voting' : True}})

        # Check if everyone has finished voting
        everyone_done = True
        for individual in individuals_collection.find():
            if individual['finished_voting'] == False:
                everyone_done = False
                break
        
        if everyone_done == True:
            # If everyone is finished voting, calculate winner and set that entry to have is_winner = true
            final_results = {}
            for restaurant in restaurants_collection.find():
                final_results[restaurant['place_id']] = restaurant['votes'] / restaurant['appearances']

            winner = None
            for prospect, winrate in final_results.items():
                if winner == None:
                    winner = prospect, winrate
                elif winner[1] < winrate:
                    winner = prospect, winrate

            restaurants_collection.update_one({"place_id" : winner[0]}, {'$set' : {'is_winner' : True}})

        return {"finished_voting": True}

    return {"message": "Vote successful", "finished_voting" : False}

@app.get("/winner")
async def winner(room_id : Annotated[int, Body()], individual_id : Annotated[str, Body()]):
    # Validate room ID
    if str(room_id) not in mclient.list_database_names():
        return {"message": "Room does not exist"}

    room_db = mclient[str(room_id)]
    
    # Get the winner from MongoDB and return
    for restaurant in room_db['restaurants']:
        if restaurant['is_winner'] == True:
            winner : Restaurant = Restaurant(place_id=restaurant['place_id'], name=restaurant['name'], 
                        link=restaurant['link'], photo_reference=restaurant['photo_reference'],
                        price_level=restaurant['price_level'], rating=restaurant['rating'])
            return {"ready": True, "winner": winner}

    return {"ready": False}

@app.get("/numindividuals")
async def num_individuals(room_id : int):
    count = 0
    for individual in mclient[str(room_id)]['individuals'].find():
        count += 1
    return count