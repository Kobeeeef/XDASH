# Use an official Python runtime as a base image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory (including the Python script) into the container
COPY . .
# Install any necessary Python dependencies (none in this case)
# RUN pip install --no-cache-dir -r requirements.txt
RUN pip install opencv-python
# Command to run the Python script
CMD ["python", "test.py"]
