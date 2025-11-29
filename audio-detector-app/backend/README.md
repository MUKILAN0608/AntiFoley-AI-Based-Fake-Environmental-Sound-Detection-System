# AntiFoley Backend API

Flask backend for the AntiFoley Audio Detection System using PyTorch model.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure the model file is present:
   - The backend expects `antifoley_96_model.pth` in the parent AntiFoley directory
   - Path: `../AntiFoley-AI-Based-Fake-Environmental-Sound-Detection-System/antifoley_96_model.pth`

3. Run the Flask server:
```bash
python app.py
```

The API will start on `http://localhost:5000`

## Endpoints

### GET /health
Health check endpoint to verify API status.

**Response:**
```json
{
  "status": "healthy",
  "device": "cuda" | "cpu",
  "model_loaded": true
}
```

### POST /analyze
Analyze an audio file for fake/real detection.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: audio file with key 'audio'

**Response:**
```json
{
  "isFake": boolean,
  "confidence": number,
  "probabilities": {
    "fake": number,
    "real": number
  },
  "features": string[],
  "fileName": string,
  "duration": number,
  "sampleRate": number
}
```

## Model Architecture

The backend uses the AntiFoleyPlus model:
- CNN layers with batch normalization
- Transformer encoder layers
- Log-mel spectrogram feature extraction
- Binary classification (Real/Fake)

## Requirements

- Python 3.8+
- PyTorch 2.1.0+
- Flask 3.0.0+
- librosa 0.10.1+
