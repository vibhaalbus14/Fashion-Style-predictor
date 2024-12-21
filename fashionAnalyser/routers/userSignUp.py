from fastapi import APIRouter,Depends
from pydantic import BaseModel,EmailStr
from typing import Optional
from pymongo import MongoClient
from passlib.context import CryptContext
from routers.database import getDB
from fastapi.responses import RedirectResponse

router=APIRouter()
bcrypt_context=CryptContext(schemes=['bcrypt'],deprecated='auto')
class CreateUser(BaseModel):#data validation
    name:str
    password:str
    email:EmailStr
    age:int
    role:str

class User():
    def __init__(self,name:str,email:EmailStr,age:int,hashedPassword:str,role:str):
        self.name=name
        self.password=hashedPassword
        self.email=email
        self.age=age
        self.role=role
    
    def to_dict(self):
        return {"name":self.name,
                "password": self.password,
                "email":self.email,
                "age":self.age,
                "role":self.role}
    
@router.get("/showLoginPage")
def showLoginPage():
    return {"login":"here"}

@router.get("/showSignupPage")
def signuppage():
    return {"sign up":"here"}

#user  creation
@router.post("/userSignUp/")
def verifyUser(user:CreateUser,db=Depends(getDB)):

     # Check if a user with the same email (case-insensitive) already exists
    existing_user = db.userDetails.find_one({"email": {"$regex": f"^{user.email}$", "$options": "i"}})
    
    if existing_user:
        return {"error": "Email is already registered, please use a different email."}
    
    newUser=User(
        name=user.name,
        hashedPassword=bcrypt_context.hash(user.password),
        email=user.email,
        age=user.age,
        role=user.role)
        
    #newUser created
    #add to collection
    db.userDetails.insert_one(newUser.to_dict())#no model_dump as it is available only for pydantic model
    #redirect to login page again
    
    return {"obj":newUser.to_dict()}
    #return RedirectResponse("/showLoginPage")
    
    

