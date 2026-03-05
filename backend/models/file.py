from sqlalchemy import Column, Integer, String, BigInteger, DateTime
from sqlalchemy.sql import func
from database import Base

class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    size = Column(BigInteger, nullable=False)
    minio_object_key = Column(String, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())