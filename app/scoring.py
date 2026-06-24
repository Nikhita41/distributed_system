from datetime import datetime

def calculate_score(task):

    wait_hours = (
        datetime.now() - task.created_at
    ).total_seconds() / 3600

    score = (
        (task.priority * 0.4)
        +
        ((24 - task.deadline_hours) * 0.4)
        +
        (wait_hours + 0.5)
    )

    return score