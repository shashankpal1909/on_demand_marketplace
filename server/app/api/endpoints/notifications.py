import json
import uuid
from datetime import datetime

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.socket import manager

router = APIRouter()


@router.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await manager.connect(websocket, username)
    try:
        while True:
            data = await websocket.receive_text()
            # await manager.send_personal_message(
            #     f"Message from {username}: {data}", username
            # )
    except WebSocketDisconnect:
        manager.disconnect(websocket, username)


@router.get("")
async def get_all_notifications(limit: int = 10):
    return [{
           "id": str(uuid.uuid4()),
           "title": "New booking request",
           "description": "A customer has requested a booking with you.A customer has requested a booking with you.A customer has requested a booking with you.A customer has requested a booking with you.A customer has requested a booking with you.",
           "created_at": datetime.now().isoformat(),
           "read": False
       }, {
           "id": "1",
           "title": "New booking request",
           "description": "A customer has requested a booking with you.",
           "created_at": "2021-01-01T12:00:00Z",
           "read": False
       }, {
            "id": "2",
            "title": "Service update",
            "description": "A provider has updated their service information.",
            "created_at": "2021-01-02T12:00:00Z",
            "read": True
        }, {
            "id": "3",
            "title": "New review",
            "description": "A customer has left a review for you.",
            "created_at": "2021-01-03T12:00:00Z",
            "read": False
        }, {
            "id": "4",
            "title": "Service cancellation",
            "description": "A booking has been cancelled by a customer.",
            "created_at": "2021-01-04T12:00:00Z",
            "read": False
        }, {
            "id": "5",
            "title": "New booking request",
            "description": "A customer has requested a booking with you.",
            "created_at": "2021-01-05T12:00:00Z",
            "read": False
        }, {
            "id": "6",
            "title": "Service update",
            "description": "A provider has updated their service information.",
            "created_at": "2021-01-06T12:00:00Z",
            "read": True
        }, {
            "id": "7",
            "title": "New review",
            "description": "A customer has left a review for you.",
            "created_at": "2021-01-07T12:00:00Z",
            "read": False
        }, {
            "id": "8",
            "title": "Service cancellation",
            "description": "A booking has been cancelled by a customer.",
            "created_at": "2021-01-08T12:00:00Z",
            "read": False
        }, {
            "id": "9",
            "title": "New booking request",
            "description": "A customer has requested a booking with you.",
            "created_at": "2021-01-09T12:00:00Z",
            "read": False
        }, {
            "id": "10",
            "title": "Service update",
            "description": "A provider has updated their service information.",
            "created_at": "2021-01-10T12:00:00Z",
            "read": True
        }][:limit]


@router.post("/send-notification/{username}")
async def send_notification(username: str, message: str):
    await manager.send_personal_message(json.dumps({
        "id": str(uuid.uuid4()),
        "title": "New notification",
        "description": message,
        "created_at": datetime.now().isoformat(),
        "read": False,
    }), username)
    return {"message": f"Notification sent to {username}"}


@router.post("/broadcast")
async def broadcast(message: str):
    await manager.broadcast(message)
    return {"message": "Broadcast sent"}
