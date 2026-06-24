from pydantic import BaseModel
from datetime import datetime

class TaskCreate(BaseModel):
    task_type: str
    payload: str
    priority: int
    deadline_hours: int