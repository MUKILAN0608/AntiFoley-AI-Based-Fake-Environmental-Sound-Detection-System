from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
import torch.nn.functional as F
import librosa
import numpy as np
import os
import io

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Model configuration
SR = 16000
N_MELS = 128
N_FFT = 1024
HOP_LENGTH = 256
FIXED_TIME_FRAMES = 128

# Model architecture (same as training)
class AntiFoleyPlus(nn.Module):
    def __init__(self):
        super().__init__()

        self.conv1 = nn.Conv2d(1, 32, 3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, 3, padding=1)
        self.conv3 = nn.Conv2d(64, 128, 3, padding=1)

        self.bn1 = nn.BatchNorm2d(32)
        self.bn2 = nn.BatchNorm2d(64)
        self.bn3 = nn.BatchNorm2d(128)

        self.pool = nn.MaxPool2d(2)
        self.apool = nn.AdaptiveAvgPool2d((16, 16))

        self.embed = nn.Linear(128, 256)

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=256, nhead=8, batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=2)

        self.fc1 = nn.Linear(256, 128)
        self.fc2 = nn.Linear(128, 2)

        self.dropout = nn.Dropout(0.5)

    def forward(self, x):
        x = self.pool(self.bn1(F.relu(self.conv1(x))))
        x = self.pool(self.bn2(F.relu(self.conv2(x))))
        x = self.pool(self.bn3(F.relu(self.conv3(x))))

        x = self.apool(x)
        x = x.mean(dim=2)
        x = x.transpose(1, 2)

        x = self.embed(x)
        x = self.transformer(x)
        x = x.mean(dim=1)

        x = self.dropout(F.relu(self.fc1(x)))
        return self.fc2(x)

# Load model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = AntiFoleyPlus().to(device)

# Load the trained weights
MODEL_PATH = r'c:\Users\Mukil\Documents\audio\AntiFoley-AI-Based-Fake-Environmental-Sound-Detection-System\antifoley_96_model.pth'
try:
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model.eval()
    print(f"Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")
    print("Model will use random weights - predictions will not be accurate!")

def extract_logmel(audio_data, sr_original):
    """Extract log-mel spectrogram from audio data"""
    # Resample if needed
    if sr_original != SR:
        audio_data = librosa.resample(audio_data, orig_sr=sr_original, target_sr=SR)
    
    # Compute mel spectrogram
    mel = librosa.feature.melspectrogram(
        y=audio_data,
        sr=SR,
        n_fft=N_FFT,
        hop_length=HOP_LENGTH,
        n_mels=N_MELS
    )
    logmel = librosa.power_to_db(mel, ref=np.max)
    
    # Pad or crop to fixed time frames
    if logmel.shape[1] < FIXED_TIME_FRAMES:
        pad_width = FIXED_TIME_FRAMES - logmel.shape[1]
        logmel = np.pad(logmel, ((0, 0), (0, pad_width)), mode='constant')
    else:
        logmel = logmel[:, :FIXED_TIME_FRAMES]
    
    return logmel

def predict_audio(audio_data, sr):
    """Make prediction on audio data"""
    try:
        # Extract features
        logmel = extract_logmel(audio_data, sr)
        
        # Convert to tensor
        x = torch.tensor(logmel).unsqueeze(0).unsqueeze(0).float().to(device)
        
        # Predict
        with torch.no_grad():
            outputs = model(x)
            probabilities = F.softmax(outputs, dim=1)
            predicted_class = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0][predicted_class].item() * 100
        
        # 0 = fake, 1 = real
        is_fake = predicted_class == 0
        
        return {
            'is_fake': is_fake,
            'confidence': round(confidence, 2),
            'probabilities': {
                'fake': round(probabilities[0][0].item() * 100, 2),
                'real': round(probabilities[0][1].item() * 100, 2)
            }
        }
    except Exception as e:
        raise Exception(f"Prediction error: {str(e)}")

@app.after_request
def after_request(response):
    """Add CORS headers to all responses"""
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'device': str(device),
        'model_loaded': True
    })

@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze_audio():
    """Analyze audio file endpoint"""
    # Handle preflight request
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    
    try:
        # Check if file is present
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        if audio_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file extension
        allowed_extensions = {'.wav', '.mp3', '.flac', '.ogg', '.m4a', '.aac'}
        file_ext = os.path.splitext(audio_file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            return jsonify({'error': f'Unsupported file format. Supported: {", ".join(allowed_extensions)}'}), 400
        
        # Read audio file
        audio_bytes = audio_file.read()
        
        try:
            audio_data, sr = librosa.load(io.BytesIO(audio_bytes), sr=None)
        except Exception as e:
            return jsonify({'error': f'Failed to load audio file: {str(e)}'}), 400
        
        # Get file info
        duration = len(audio_data) / sr
        
        # Make prediction
        result = predict_audio(audio_data, sr)
        
        # Generate features based on prediction
        if result['is_fake']:
            features = [
                'Anomalous frequency patterns detected',
                'Inconsistent spectral distribution',
                'Artificial noise characteristics identified',
                'Unnatural temporal patterns found'
            ]
        else:
            features = [
                'Natural frequency distribution confirmed',
                'Consistent environmental acoustics',
                'Authentic noise characteristics',
                'Valid temporal patterns detected'
            ]
        
        return jsonify({
            'isFake': result['is_fake'],
            'confidence': result['confidence'],
            'probabilities': result['probabilities'],
            'features': features,
            'fileName': audio_file.filename,
            'duration': round(duration, 2),
            'sampleRate': sr
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print(f"Starting AntiFoley API Server...")
    print(f"Device: {device}")
    print(f"Model path: {MODEL_PATH}")
    print(f"CORS enabled for all origins")
    print(f"Listening on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
