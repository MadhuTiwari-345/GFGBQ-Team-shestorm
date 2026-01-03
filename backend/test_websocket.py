import asyncio
import websockets
import json
import uuid

async def test_websocket():
    session_id = str(uuid.uuid4())
    uri = f"ws://localhost:8000/call/stream?session_id={session_id}"

    try:
        async with websockets.connect(uri) as websocket:
            print(f"Connected to WebSocket with session_id: {session_id}")

            # Send sample transcript data
            sample_data = {
                "transcript": "I need you to wire transfer money urgently to this account"
            }
            await websocket.send(json.dumps(sample_data))
            print("Sent sample transcript data")

            # Receive response
            response = await websocket.recv()
            print(f"Received response: {response}")

            # Send audio data (simulated)
            audio_data = {
                "audio_data": "base64_encoded_audio_data_here",  # Placeholder
                "transcript": "This is a test call for fraud detection"
            }
            await websocket.send(json.dumps(audio_data))
            print("Sent sample audio data")

            # Receive response
            response = await websocket.recv()
            print(f"Received response: {response}")

    except Exception as e:
        print(f"WebSocket test failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_websocket())
