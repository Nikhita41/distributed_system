from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import uuid
from app.redis_client import r
from app.database import engine, get_db
from app.models import Task
from app.schemas import TaskCreate
from app.scoring import calculate_score
from datetime import datetime
app = FastAPI()

Task.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Distributed Task Queue Running"}

@app.post("/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):

    task_id = str(uuid.uuid4())

    new_task = Task(
        id=task_id,
        task_type=task.task_type,
        payload=task.payload,
        priority=task.priority,
        deadline_hours=task.deadline_hours,
        status="PENDING"
    )

    db.add(new_task)
    db.commit()
    score = calculate_score(new_task)


    r.zadd(
        "task_queue",
        {task_id: score}
    )
    return {
    "task_id": task_id,
    "status": "PENDING"
    }
@app.get("/tasks/{task_id}")
def get_task(task_id: str, db: Session = Depends(get_db)):

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    return {
    "id": task.id,
    "task_type": task.task_type,
    "priority": task.priority,
    "status": task.status,
    "result": task.result,
    "created_at": task.created_at,
    "updated_at": task.updated_at
}
  
@app.get("/queue-status")
def queue_status(db: Session = Depends(get_db)):

    pending = (
        db.query(Task)
        .filter(Task.status == "PENDING")
        .count()
    )

    processing = (
        db.query(Task)
        .filter(Task.status == "PROCESSING")
        .count()
    )

    completed = (
        db.query(Task)
        .filter(Task.status == "COMPLETED")
        .count()
    )

    failed = (
        db.query(Task)
        .filter(Task.status == "FAILED")
        .count()
    )

    return {
        "redis_queue_size": r.zcard("task_queue"),
        "dead_letter_queue": r.llen("dead_letter_queue"),
        "pending_tasks": pending,
        "processing_tasks": processing,
        "completed_tasks": completed,
        "failed_tasks": failed
    }
    
@app.post("/dlq/replay/{task_id}")
def replay_task(task_id: str, db: Session = Depends(get_db)):

    task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not task:
        return {"error": "Task not found"}

    task.retry_count = 0
    task.status = "PENDING"
    score = calculate_score(task)

    r.zadd(
        "task_queue",
        {task.id: score}
    )

    db.commit()

    return {
        "message": "Task replayed",
        "task_id": task.id
    }
@app.get("/worker-health")
def worker_health():

    heartbeat = r.get("worker_heartbeat")

    if not heartbeat:
        return {
            "status": "OFFLINE"
        }

    heartbeat = datetime.fromisoformat(
        heartbeat.decode()
    )

    diff = (
        datetime.now() - heartbeat
    ).total_seconds()

    if diff < 30:
        return {
            "status": "HEALTHY"
        }

    return {
        "status": "OFFLINE"
    }