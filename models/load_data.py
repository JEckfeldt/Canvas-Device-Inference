import base64
import numpy as np
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

print('Firebase connection established')

samples = []

docs = db.collection('devices').stream()

for doc in docs:
    device = doc.to_dict()
    user_agent = device["user_agent"]
    device_id = doc.id

    print(f"Processing User Agent: {user_agent}")

    for canvas_doc in doc.reference.collection('canvases').stream():
        canvas = canvas_doc.to_dict()

        pixels = base64.b64decode(canvas['pixels'])
        img = np.frombuffer(pixels, dtype=np.uint8).reshape(
            (canvas['height'], canvas['width'], 4)
        )

        samples.append({
            "device_id": device_id,
            "user_agent": user_agent,
            "canvas_id": canvas["canvas_id"],
            "image": img
        })

print(samples[0])  # Print the first sample for verification
