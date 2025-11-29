import { useState, useRef, useEffect } from 'react';
import './App.css';
import { analyzeAudio } from './services/audioDetector';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [spectrogram, setSpectrogram] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);

  const generateSpectrogram = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const width = canvas.width = 800;
      const height = canvas.height = 300;
      
      // FFT parameters
      const fftSize = 2048;
      const hopSize = 512;
      const numFrames = Math.floor((channelData.length - fftSize) / hopSize);
      
      // Create spectrogram data
      const specData = [];
      for (let i = 0; i < numFrames; i++) {
        const offset = i * hopSize;
        const frame = channelData.slice(offset, offset + fftSize);
        
        // Apply Hamming window
        const windowed = frame.map((val, idx) => 
          val * (0.54 - 0.46 * Math.cos(2 * Math.PI * idx / fftSize))
        );
        
        // Compute FFT magnitude
        const magnitudes = [];
        for (let k = 0; k < fftSize / 2; k++) {
          let real = 0, imag = 0;
          for (let n = 0; n < fftSize; n++) {
            const angle = -2 * Math.PI * k * n / fftSize;
            real += windowed[n] * Math.cos(angle);
            imag += windowed[n] * Math.sin(angle);
          }
          magnitudes.push(Math.sqrt(real * real + imag * imag));
        }
        specData.push(magnitudes);
      }
      
      // Find max for normalization
      const maxMag = Math.max(...specData.flat());
      
      // Draw spectrogram
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
      
      const xScale = width / numFrames;
      const yScale = height / (fftSize / 2);
      
      for (let x = 0; x < numFrames; x++) {
        for (let y = 0; y < fftSize / 2; y++) {
          const magnitude = specData[x][y] / maxMag;
          const db = 20 * Math.log10(magnitude + 1e-10);
          const normalized = Math.max(0, (db + 80) / 80);
          
          // Color mapping: blue -> cyan -> yellow -> red
          let r, g, b;
          if (normalized < 0.25) {
            r = 0;
            g = normalized * 4 * 100;
            b = 255;
          } else if (normalized < 0.5) {
            r = 0;
            g = 100 + (normalized - 0.25) * 4 * 155;
            b = 255 - (normalized - 0.25) * 4 * 255;
          } else if (normalized < 0.75) {
            r = (normalized - 0.5) * 4 * 255;
            g = 255;
            b = 0;
          } else {
            r = 255;
            g = 255 - (normalized - 0.75) * 4 * 255;
            b = 0;
          }
          
          ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
          ctx.fillRect(
            x * xScale,
            height - (y * yScale) - yScale,
            Math.ceil(xScale) + 1,
            Math.ceil(yScale) + 1
          );
        }
      }
      
      setSpectrogram(canvas.toDataURL());
    } catch (err) {
      console.error('Error generating spectrogram:', err);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setAudioUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
      setSpectrogram(null);
      
      // Generate spectrogram
      await generateSpectrogram(file);
    } else {
      alert('Please select a valid audio file');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const analysis = await analyzeAudio(selectedFile);
      setResult(analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAudioUrl(null);
    setResult(null);
    setIsAnalyzing(false);
    setError(null);
    setSpectrogram(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <div className="logo-container">
            <div className="logo-icon">AF</div>
            <div className="header-text">
              <h1>AntiFoley Audio Detector</h1>
              <p>AI-Based Fake Environmental Sound Detection System</p>
            </div>
          </div>
        </header>

        <div className="upload-section">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".wav,.mp3,.flac,.ogg,.m4a,.aac,audio/*"
            id="audio-input"
            className="file-input"
          />
          <label htmlFor="audio-input" className="file-label">
            Choose Audio File
          </label>
          {selectedFile && (
            <div className="file-info">
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )}
        </div>

        {audioUrl && (
          <div className="audio-section">
            <div className="audio-player">
              <audio controls src={audioUrl} className="player">
                Your browser does not support the audio element.
              </audio>
            </div>
            
            {spectrogram && (
              <div className="spectrogram-container">
                <h3 className="spectrogram-title">Audio Spectrogram</h3>
                <img src={spectrogram} alt="Audio Spectrogram" className="spectrogram" />
                <div className="spectrogram-labels">
                  <span>Time</span>
                  <span className="freq-label">Frequency</span>
                </div>
              </div>
            )}
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {selectedFile && !result && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="analyze-btn"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
          </button>
        )}

        {result && (
          <div className={`result-card ${result.isFake ? 'fake' : 'real'}`}>
            <div className="result-header">
              <h2>
                {result.isFake ? 'FAKE Audio Detected' : 'AUTHENTIC Audio'}
              </h2>
              <span className={`badge ${result.isFake ? 'fake' : 'real'}`}>
                {result.isFake ? 'FAKE' : 'REAL'}
              </span>
            </div>
            <div className="result-details">
              <div className="confidence-bar">
                <div className="confidence-label">
                  <span>Confidence:</span>
                  <span className="confidence-value">{result.confidence}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
              </div>
              <div className="analysis-info">
                <h3>Analysis Details:</h3>
                <ul>
                  {result.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
            <button onClick={handleReset} className="reset-btn">
              Analyze Another File
            </button>
          </div>
        )}

        {error && (
          <div className="error-card">
            <h3>Analysis Error</h3>
            <p>{error}</p>
            <p className="error-hint">
              Make sure the Flask backend is running on http://localhost:5000
            </p>
            <button onClick={handleReset} className="reset-btn">
              Try Again
            </button>
          </div>
        )}

        {isAnalyzing && (
          <div className="analyzing-overlay">
            <div className="spinner-container">
              <div className="spinner"></div>
              <div className="spinner-ring"></div>
            </div>
            <p className="analyzing-text">Analyzing audio patterns...</p>
            <p className="analyzing-subtext">Processing with AntiFoley AI Model</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
