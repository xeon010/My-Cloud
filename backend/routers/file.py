from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from models.file import File as FileModel
from storage import minio_client, BUCKET_NAME
from urllib.parse import quote
import uuid
import io

router = APIRouter(prefix="/files", tags=["files"])

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    object_key = f"{uuid.uuid4()}_{file.filename}"

    minio_client.put_object(
        BUCKET_NAME,
        object_key,
        io.BytesIO(contents),
        length=len(contents),
        content_type=file.content_type
    )

    db_file = FileModel(
        name=file.filename,
        size=len(contents),
        minio_object_key=object_key
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

@router.get("/")
def list_files(db: Session = Depends(get_db)):
    return db.query(FileModel).all()

@router.delete("/{file_id}")
def delete_file(file_id: int, db: Session = Depends(get_db)):
    db_file = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    minio_client.remove_object(BUCKET_NAME, db_file.minio_object_key)
    db.delete(db_file)
    db.commit()
    return {"status": "deleted"}

@router.get("/download/{file_id}")
def download_file(file_id: int, db: Session = Depends(get_db)):
    db_file = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
    
    response = minio_client.get_object(BUCKET_NAME, db_file.minio_object_key)
    return StreamingResponse(
        response,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename*=UTF-8''{quote(db_file.name)}"}
        )