# Quick Start Guide

## Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- pip (Python package manager)

## Step-by-Step Setup

### 1. Install Backend Dependencies

Open a terminal and navigate to the backend folder:

```powershell
cd audio-detector-app\backend
pip install -r requirements.txt
```

This will install:
- Flask (web server)
- PyTorch (deep learning framework)
- librosa (audio processing)
- Other dependencies

### 2. Verify Model File

Ensure the model file exists:
- Path: `c:\Users\Mukil\Documents\audio\AntiFoley-AI-Based-Fake-Environmental-Sound-Detection-System\antifoley_96_model.pth`
- The backend will automatically load this model

### 3. Start the Backend Server

In the same terminal:

```powershell
python app.py
```

You should see:
```
Starting AntiFoley API Server...
Device: cuda  (or cpu)
Model path: ...
* Running on http://0.0.0.0:5000
```

**Keep this terminal open!**

### 4. Install Frontend Dependencies

Open a NEW terminal and navigate to the project root:

```powershell
cd audio-detector-app
npm install
```

### 5. Start the Frontend

In the same terminal:

```powershell
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 6. Open the Application

Open your browser and go to: **http://localhost:5173**

## Testing the Application

1. The UI should load with a dark professional theme
2. Click "Choose Audio File" and select any audio file
3. Click "Analyze Audio"
4. Wait for the results (takes a few seconds)
5. View the detection result: REAL or FAKE with confidence score

## Common Issues

### Backend Issues

**"Model not found"**
- Check the model file path in backend console
- Verify the file `antifoley_96_model.pth` exists

**"Port 5000 already in use"**
- Stop any other applications using port 5000
- Or change the port in `backend/app.py`

**"CUDA error"**
- If you don't have NVIDIA GPU, the model will use CPU (slower but works)
- This is normal and expected

### Frontend Issues

**"Failed to analyze audio"**
- Make sure backend is running (check Terminal 1)
- Verify backend is on http://localhost:5000
- Check browser console for errors (F12)

**"Connection refused"**
- Backend is not running
- Start the backend first (Step 3)

## Architecture

```
Browser (localhost:5173)
    ↓
React Frontend
    ↓ HTTP POST /analyze
Flask Backend (localhost:5000)
    ↓
PyTorch Model (antifoley_96_model.pth)
    ↓
Prediction Result
    ↓
Display in UI
```

## What's Happening?

1. **Frontend**: User uploads audio → sends to backend API
2. **Backend**: Receives audio → extracts features → runs through model
3. **Model**: Processes log-mel spectrogram → predicts Real/Fake
4. **Backend**: Returns prediction + confidence → Frontend displays results

## Production Deployment

This is a development setup. For production:

### Backend
- Use Gunicorn or uWSGI
- Add authentication
- Use HTTPS
- Deploy on cloud (AWS, Azure, etc.)

### Frontend
- Build: `npm run build`
- Serve static files
- Use environment variables for API URL
- Deploy on Vercel, Netlify, etc.

## Support

If you encounter issues:
1. Check both terminal outputs for errors
2. Verify all dependencies are installed
3. Ensure model file is in correct location
4. Try restarting both servers
