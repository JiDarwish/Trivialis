from celery import Celery

celery_app = Celery("worker", broker_url='redis://redis:6380/0')

celery_app.conf.task_routes = {"app.tasks.*": "main-queue"}
