# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y netcat gcc

# Install python dependencies
COPY ./requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project
COPY . /app

# Add and install Python modules
RUN pip install uvicorn

# CMD command to start your applications
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]