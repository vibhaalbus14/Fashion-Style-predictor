from fastapi import FastAPI, HTTPException
from typing import Optional
from pydantic import BaseModel
from pymongo import MongoClient
from keys import mongoDB

# MongoDB connection details
MONGO_URI = mongoDB
DATABASE_NAME = "fashion_Analysis"


# app=FastAPI()
# Dependency to get the database connection
# @app.get("/")
def getDB():
    try:
        client = MongoClient(MONGO_URI)
        db = client[DATABASE_NAME]
        # Test the connection by attempting to fetch server info
        client.server_info()  # This raises an exception if the connection is not successful
        # print(db)
        # print(db.list_collection_names())
        # print(list(db.userDetails.find()))
        return db
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {e}")
