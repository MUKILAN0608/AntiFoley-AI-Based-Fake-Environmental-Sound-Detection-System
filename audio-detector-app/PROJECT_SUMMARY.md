# AntiFoley Audio Detector - Complete Application

## What's Been Built

A professional full-stack application for detecting fake/real audio using your trained AntiFoley PyTorch model.

### Frontend (React)
- **Professional dark theme UI** - No emojis, clean design
- **Audio upload and playback**
- **Real-time analysis** with loading states
- **Results display** with confidence scores
- **Error handling** and status messages
- Located in: `src/`

### Backend (Flask + PyTorch)
- **Flask REST API** with CORS support
- **Model loading** - Uses your `antifoley_96_model.pth`
- **Audio processing** - Log-mel spectrogram extraction
- **Prediction endpoint** - Returns fake/real classification
- Located in: `backend/`

## File Structure

```
audio-detector-app/
│
├── src/                          # React Frontend
│   ├── App.jsx                   # Main component (NO emojis)
│   ├── App.css                   # Dark professional theme
│   ├── main.jsx                  # React entry point
│   ├── index.css                 # Base styles
│   └── services/
│       └── audioDetector.js      # API service (connects to Flask)
│
├── backend/                      # Flask Backend
│   ├── app.py                    # Flask server + PyTorch model
│   ├── requirements.txt          # Python dependencies
│   ├── setup.bat                 # Install dependencies
│   ├── start.bat                 # Start backend
│   └── README.md                 # Backend documentation
│
├── index.html                    # HTML template
├── vite.config.js                # Vite configuration
├── package.json                  # Node dependencies
│
├── setup-all.bat                 # Install everything
├── start-all.bat                 # Start both servers
├── start-backend.bat             # Start backend only
├── start-frontend.bat            # Start frontend only
│
├── README.md                     # Main documentation
└── QUICKSTART.md                 # Quick start guide
```

## How to Run (3 Simple Steps)

### Option 1: Automatic (Recommended)

1. **Setup** (first time only):
   ```bash
   setup-all.bat
   ```

2. **Run**:
   ```bash
   start-all.bat
   ```

3. **Open**: http://localhost:5173

### Option 2: Manual

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

**Browser:**
Open http://localhost:5173

## Features Implemented

### UI Design (Professional)
✅ Dark theme (#0f172a background)
✅ Clean typography (no emojis)
✅ Professional color scheme
✅ Smooth animations
✅ Responsive design
✅ Error handling UI
✅ Loading states

### Backend Integration
✅ Flask REST API
✅ CORS enabled
✅ PyTorch model loading
✅ Log-mel spectrogram extraction
✅ Real-time prediction
✅ Error handling
✅ Health check endpoint

### Model Integration
✅ Loads `antifoley_96_model.pth`
✅ AntiFoleyPlus architecture (CNN + Transformer)
✅ Proper feature extraction (128 mel bands, 128 frames)
✅ Binary classification (Real/Fake)
✅ Confidence scoring
✅ GPU/CPU support

## API Endpoints

### GET /health
Check if backend is running and model is loaded
```json
{
  "status": "healthy",
  "device": "cuda",
  "model_loaded": true
}
```

### POST /analyze
Analyze audio file
- Input: multipart/form-data with 'audio' file
- Output:
```json
{
  "isFake": false,
  "confidence": 92.45,
  "probabilities": {
    "fake": 7.55,
    "real": 92.45
  },
  "features": ["Natural frequency distribution", "..."],
  "fileName": "audio.wav",
  "duration": 5.2,
  "sampleRate": 16000
}
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **CSS3** - Styling (no frameworks)

### Backend
- **Flask 3.0** - Web framework
- **PyTorch 2.1** - Deep learning
- **librosa 0.10** - Audio processing
- **NumPy** - Numerical operations

### Model
- **Architecture**: CNN + Transformer
- **Input**: Log-mel spectrograms
- **Output**: Binary classification
- **Classes**: 0 = Fake, 1 = Real

## What Happens When You Analyze

1. User uploads audio file → Frontend
2. Frontend sends file → Backend API (POST /analyze)
3. Backend loads audio with librosa
4. Extract log-mel spectrogram (128×128)
5. Pass through PyTorch model
6. Model predicts: Fake (0) or Real (1)
7. Calculate confidence score
8. Return results → Frontend
9. Display results with features

## Model Requirements

The backend expects the model at:
```
../AntiFoley-AI-Based-Fake-Environmental-Sound-Detection-System/antifoley_96_model.pth
```

Make sure this file exists before running!

## Dependencies

### Python (Backend)
```
flask==3.0.0
flask-cors==4.0.0
torch==2.1.0
librosa==0.10.1
numpy==1.24.3
soundfile==0.12.1
```

### Node.js (Frontend)
```
react: ^18.2.0
react-dom: ^18.2.0
vite: ^5.0.0
@vitejs/plugin-react: ^4.2.1
```

## Testing

1. Start both servers
2. Open http://localhost:5173
3. Upload an audio file (any format)
4. Click "Analyze Audio"
5. Wait for results (3-5 seconds)
6. Check prediction and confidence

## Troubleshooting

**"Failed to analyze audio"**
→ Backend not running. Start with `start-backend.bat`

**"Model not found"**
→ Check model file path in backend console

**"Port already in use"**
→ Close other apps using port 5000 or 5173

**Slow predictions**
→ Normal on CPU. Use GPU for faster inference

## Future Enhancements

Possible improvements:
- [ ] Batch processing
- [ ] Audio visualization (waveform/spectrogram)
- [ ] History of analyses
- [ ] Export reports
- [ ] API authentication
- [ ] Docker deployment
- [ ] Model fine-tuning interface

## Credits

- Model: AntiFoley (CNN + Transformer)
- Dataset: FSD50K
- Framework: PyTorch + React + Flask

---

**You now have a complete, professional audio detection application!**

Run `start-all.bat` and open http://localhost:5173 to test it.
