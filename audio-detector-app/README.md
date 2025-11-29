# AntiFoley Audio Detector

A professional full-stack application for detecting fake and real audio files using the AntiFoley AI model.

## Architecture

- **Frontend**: React 18 + Vite (Professional dark theme UI)
- **Backend**: Flask + PyTorch (AntiFoley model)
- **Model**: CNN + Transformer architecture trained on FSD50K dataset

## Features

- Audio file upload and playback
- Real-time fake/real detection using trained PyTorch model
- Confidence scoring with probability breakdown
- Professional dark theme UI
- Detailed analysis features
- Error handling and status reporting

## Project Structure

```
audio-detector-app/
├── src/                  # React frontend
│   ├── App.jsx          # Main component
│   ├── App.css          # Styling
│   └── services/
│       └── audioDetector.js  # API service
├── backend/             # Flask backend
│   ├── app.py          # Flask server with model
│   ├── requirements.txt # Python dependencies
│   └── setup.bat       # Windows setup script
├── package.json        # Node dependencies
└── vite.config.js      # Vite configuration
```

## Setup Instructions

### Backend Setup (Python/Flask)

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Ensure model file is accessible:
   - The backend expects `antifoley_96_model.pth` in:
   - `../AntiFoley-AI-Based-Fake-Environmental-Sound-Detection-System/antifoley_96_model.pth`

4. Start the Flask server:
   ```bash
   python app.py
   ```
   
   Or use the batch script (Windows):
   ```bash
   start.bat
   ```

   Backend will run on `http://localhost:5000`

### Frontend Setup (React)

1. Navigate to project root:
   ```bash
   cd audio-detector-app
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

## Running the Complete Application

**You need to run BOTH backend and frontend:**

### Terminal 1 (Backend):
```bash
cd backend
python app.py
```

### Terminal 2 (Frontend):
```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Usage

1. Ensure both backend and frontend are running
2. Open the application in your browser
3. Click "Choose Audio File" to upload an audio file
4. Listen to the preview if desired
5. Click "Analyze Audio" to detect authenticity
6. View detailed results with confidence scores and features

## Model Details

The AntiFoley model uses:
- **Input**: Log-mel spectrograms (128 mel bands, 128 time frames)
- **Architecture**: 
  - 3 CNN layers with batch normalization
  - Transformer encoder (2 layers, 8 heads)
  - Fully connected layers for classification
- **Output**: Binary classification (Real/Fake) with confidence scores

## API Endpoints

### GET /health
Check backend status and model loading

### POST /analyze
Upload audio file for analysis
- Accepts: multipart/form-data
- Returns: Detection results with confidence and features

## Tech Stack

### Frontend
- React 18
- Vite
- Modern CSS with dark theme

### Backend
- Flask 3.0
- PyTorch 2.1
- librosa 0.10
- Flask-CORS

## Troubleshooting

**Error: "Failed to analyze audio"**
- Ensure Flask backend is running on port 5000
- Check if model file exists at correct path
- Verify Python dependencies are installed

**Model not loading**
- Check backend console for error messages
- Verify `antifoley_96_model.pth` file path
- Ensure PyTorch is installed correctly

## Development

### Build for Production

```bash
npm run build
```

The build files will be in the `dist/` folder.

### Backend Production

For production deployment, use a WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## License

This project uses the AntiFoley model for educational purposes.
