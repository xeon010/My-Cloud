from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from auth import create_token
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from database import engine, Base
from storage import minio_client
from routers.file import router as file_router
import os

app = FastAPI()
app.include_router(file_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/postgres")
def check_postgres():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"status": "ok"}

@app.get("/minio")
def check_minio():
    minio_client.list_buckets()
    return {"status": "ok"}

@app.post("/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != os.getenv("ADMIN_USERNAME") or \
       form_data.password != os.getenv("ADMIN_PASSWORD"):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(form_data.username)
    return {"access_token": token, "token_type": "bearer"}