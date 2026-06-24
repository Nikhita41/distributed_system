from app.database import SessionLocal
from app.models import Task
from app.redis_client import r
from app.scoring import calculate_score

import time

print("Score updater started...")

while True:

    db = SessionLocal()

    try:

        pending_tasks = (
            db.query(Task)
            .filter(Task.status == "PENDING")
            .all()
        )

        for task in pending_tasks:

            score = calculate_score(task)

            r.zadd(
                "task_queue",
                {task.id: score}
            )

        print(
            f"Updated scores for "
            f"{len(pending_tasks)} tasks"
        )

    finally:

        db.close()

    time.sleep(60)