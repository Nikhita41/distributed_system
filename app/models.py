from sqlalchemy import Column, String, Integer
from app.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True)
    task_type = Column(String)
    payload = Column(String)
    priority = Column(Integer)
    status = Column(String)