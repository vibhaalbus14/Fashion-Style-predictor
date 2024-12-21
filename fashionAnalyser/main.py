from fastapi import FastAPI,HTTPException
from typing import Optional
from pydantic import BaseModel
from routers import userLogin,userSignUp,call_to_model1,call_to_model2,admin_functions,final_model
from pymongo import MongoClient
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

# Allow requests from the frontend (React) running on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:3000/admin"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(admin_functions.router)
app.include_router(userLogin.router)
app.include_router(userSignUp.router)
app.include_router(call_to_model1.router)
app.include_router(call_to_model2.router)
app.include_router(final_model.router)


    

    
