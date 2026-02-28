from fastapi import WebSocket
from typing import Dict, List

class ConnectionManager:

    def __init__(self):
        # user_id -> list of active sockets
        self.connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.connections.setdefault(user_id, []).append(websocket)
        print(f"🟢 Connected user {user_id}")

    def disconnect(self, websocket: WebSocket, user_id: int):
        if user_id in self.connections:
            if websocket in self.connections[user_id]:
                self.connections[user_id].remove(websocket)

            if not self.connections[user_id]:
                del self.connections[user_id]

        print(f"🔴 Disconnected user {user_id}")

    async def send_to_user(self, user_id: int, message: dict):
        if user_id not in self.connections:
            return

        dead_connections = []

        for ws in self.connections[user_id]:
            try:
                await ws.send_json(message)
            except Exception:
                dead_connections.append(ws)

        # remove dead sockets safely
        for ws in dead_connections:
            self.disconnect(ws, user_id)

    async def broadcast_all(self, message: dict):
        for user_id in list(self.connections.keys()):
            await self.send_to_user(user_id, message)


# 🔥 SINGLE GLOBAL INSTANCE
manager = ConnectionManager()