# This file just loads the data from the firestore database and returns it as a list of samples.
# each canvas sample is a dictionary with the pixel value, the user agent it belongs to, the canvas id, and some other info.

import base64
import numpy as np
import firebase_admin
from firebase_admin import credentials, firestore


def load_samples():
    # only initialize once
    if not firebase_admin._apps:
        cred = credentials.Certificate(
            r"C:\Users\jeckf\OneDrive\Desktop\Code\keys\serviceAccountKey.json"
        )
        firebase_admin.initialize_app(cred)

    db = firestore.client()

    samples = []

    docs = db.collection('devices').stream()

    for doc in docs:
        device = doc.to_dict()

        if "user_agent" not in device:
            continue

        user_agent = device["user_agent"]
        device_id = doc.id

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

    return samples