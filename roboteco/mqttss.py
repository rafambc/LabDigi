from fastapi import FastAPI, HTTPException
from paho.mqtt.client import Client
from typing import List, Dict
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# MQTT Configuration
BROKER = "192.168.248.171"  # Replace with your MQTT broker address
PORT = 1883

# Initialize FastAPI app
app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store to keep messages per topic
messages_by_topic: Dict[str, List[str]] = {}

# MQTT Setup
mqtt_client = Client()

def connect_mqtt():
    try:
        mqtt_client.connect(BROKER, PORT, 7200)
        print("Connected to MQTT broker!")
    except Exception as e:
        print(f"Failed to connect to MQTT broker: {e}")
        raise e

# Data Model for POST requests
class MessagePayload(BaseModel):
    topic: str
    message: str

# Route to fetch messages for a specific topic
@app.get("/messages/{topic}", response_model=List[str])
async def get_messages(topic: str):
    """
    Fetch all messages for a specific MQTT topic.
    """
    if topic not in messages_by_topic:
        return []
    return messages_by_topic[topic]

# Route to post a message to a specific topic
@app.post("/messages")
async def post_message(payload: MessagePayload):
    """
    Publish a message to a specific MQTT topic.
    """
    print(payload)
    try:
        mqtt_client.publish(payload.topic, payload.message)
        # Save the message in the in-memory store
        if payload.topic not in messages_by_topic:
            messages_by_topic[payload.topic] = []
        messages_by_topic[payload.topic].append(payload.message)
        return {"message": f"Message published to topic {payload.topic}: {payload.message}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to publish message: {e}")

# Start MQTT connection
try:
    connect_mqtt()
except Exception:
    pass
