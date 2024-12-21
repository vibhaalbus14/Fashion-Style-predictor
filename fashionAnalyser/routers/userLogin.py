from fastapi import APIRouter,HTTPException,Depends,Header
from pydantic import BaseModel,EmailStr
from typing import Optional
from passlib.context import CryptContext
from pymongo import MongoClient
from fastapi.security import OAuth2PasswordRequestForm,OAuth2PasswordBearer
#from routers.database import getDB
from jose import jwt
from datetime import timedelta,datetime,timezone

SECRET_KEY="JKDNCUH8U39I93BJHDWMKLhjgdyedj0328"
ALGORITHM="HS256"
verify_token=OAuth2PasswordBearer(tokenUrl="token")#to extract token from user request header

MONGO_URI = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.2"
DATABASE_NAME = "fashion_Analysis"
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

router=APIRouter()
# client=MongoClient("")
# db=client["dbname"]
# userCollection=db["collection name"]
bcrypt_context=CryptContext(schemes=['bcrypt'],deprecated='auto')#encrypt the password

class Token(BaseModel):#to validate reponse body
    access_token:str
    type:str
    role:str

class LoginForm(BaseModel):
    email: str
    password: str

#userLogin verification
def verifyUser_exists(email:str,password:str,db=getDB()):
    print(db)
    obj=db.userDetails.find_one({"email":email})
    if obj==None:
        return False
        #redirect to sign up
    else:
        if not bcrypt_context.verify(password,obj["password"]):
            return False
        #redirect to home page
        else:
            return obj

def createToken(email:str,role:str,expiryTime=timedelta(minutes=30)):
    expires=datetime.now(timezone.utc)+expiryTime
    encode={"sub":email,"role":role,"exp":expires}#forms the payload
    return jwt.encode(encode,SECRET_KEY,algorithm=ALGORITHM) #return the (header.payload.signature)

@router.post("/token", response_model=Token)
async def jwtToken(formData: LoginForm):
    # Check user existence using email
    user = verifyUser_exists(formData.email, formData.password)
    if user:
        # Create token for the user
        token = createToken(user["name"], user["role"])
        return {"access_token": token, "type": "jwt", "role": user["role"]}
    else:
        raise HTTPException(status_code=404, detail="Incorrect information. Sign up or enter the correct password.")


async def secure_protection(authorization: str = Header(...)):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid token format")

        token = authorization.split(" ")[1]
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
        