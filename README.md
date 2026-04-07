# Device Identification via Canvas Fingerprinting (Variational Inference)

Probabilistic model for identifying device identity from JavaScript canvas fingerprint data using variational inference.

## Overview

This project explores whether a device can be identified just from the way it renders images.  
Given high-dimensional RGBA pixel data generated from deterministic browser rendering, we model the **device identity as a latent variable** and infer:

P (Image | Device)

The goal is to reverse the rendering process probabilistically and determine which device most likely produced a given image.

## Key Features

- Variational inference framework for device identification
- High-dimensional RGBA pixel input from canvas rendering
- Latent variable modeling of device identity
- Designed to handle cross-device rendering variability and noise

## Methodology

1. Collect labeled canvas fingerprint data (image → device)
2. Represent each image as a flattened RGBA pixel vector
3. Train a probabilistic model where:
   - Observed variable: image data
   - Latent variable: device identity
4. Perform inference to predict device given new image input

## Results

- Demonstrates feasibility of probabilistic device identification from rendering artifacts
- Captures uncertainty in predictions across similar device fingerprints
- Highlights challenges in distinguishing devices with near-identical outputs

## Instructions

- Run "pip install -r requirements.txt"
- To run the frontend collection website run:

```
npm install -g firebase-tools
firebase login
firebase serve
```

- To run the variational inference model
```
python train.py
```

- The backend is hosted on firebase so not available immediately from the repo

