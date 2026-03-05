from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from database import engine
from models.user import User, Base
from database import get_db
from storage import minio_client
from models.file import File as FileModel
from routers.file import router as file_router

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