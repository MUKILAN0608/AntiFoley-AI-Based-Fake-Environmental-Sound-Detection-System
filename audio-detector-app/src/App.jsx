import { useState, useRef } from 'react';
import './App.css';
import { analyzeAudio } from './services/audioDetector';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setAudioUrl(URL.createObjectURL(file));
      setResult(null);
    } else {
      alert('Please select a valid audio file');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setResult(null);

    // Simulate analysis time
    setTimeout(async () => {
      const analysis = await analyzeAudio(selectedFile);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAudioUrl(null);
    setResult(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>AntiFoley Audio Detector</h1>
          <p>AI-Based Fake Environmental Sound Detection System</p>
        </header>

        <div className="info-section">
          <div className="info-card">
            <h3>About Real Audio</h3>
            <p>Authentic audio shows natural frequency balance, coherent timing and organic environmental noise without artificial repetition.</p>
          </div>
          <div className="info-card">
            <h3>About Fake Audio</h3>
            <p>Synthetic audio often contains spectral anomalies, repetitive artifacts or inconsistent background noise patterns indicating manipulation.</p>
          </div>
        </div>

        <div className="upload-section">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="audio/*"
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
          <div className="audio-player">
            <audio controls src={audioUrl} className="player">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

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
                {result.isFake ? 'FAKE Audio Detected' : 'REAL Audio'}
              </h2>
              <span className={`status-badge ${result.isFake ? 'fake-badge' : 'real-badge'}`}>
                {result.isFake ? 'FAKE' : 'AUTHENTIC'}
              </span>
            </div>
            <div className="result-details">
                            <div className="stats-grid">
                              <div className="stat-item">
                                <span className="stat-label">Confidence Score</span>
                                <span className="stat-value">{result.confidence}%</span>
                              </div>
                              <div className="stat-item">
                                <span className="stat-label">Analysis Time</span>
                                <span className="stat-value">{result.analysisTime}</span>
                              </div>
                              <div className="stat-item">
                                <span className="stat-label">File Size</span>
                                <span className="stat-value">{result.fileSize}</span>
                              </div>
                              <div className="stat-item">
                                <span className="stat-label">Classification</span>
                                <span className="stat-value">{result.isFake ? 'Synthetic' : 'Authentic'}</span>
                              </div>
                            </div>
              <div className="confidence-bar">
                <div className="confidence-label">
                  <span>Detection Confidence</span>
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
                <h3>Detected Features:</h3>
                <ul>
                  {result.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                            <div className="analysis-info">
                              <h3>Technical Analysis:</h3>
                              <div className="tech-details">
                                <p><strong>Spectral:</strong> {result.isFake ? 'Frequency anomalies suggesting synthesis/manipulation.' : 'Balanced spectrum typical of authentic recording.'}</p>
                                <p><strong>Temporal:</strong> {result.isFake ? 'Rhythmic/phase irregularities detected.' : 'Stable temporal structure.'}</p>
                                <p><strong>Noise:</strong> {result.isFake ? 'Background lacks organic variation.' : 'Natural environmental noise variation.'}</p>
                              </div>
                            </div>
              </div>
            </div>
            <button onClick={handleReset} className="reset-btn">
              Analyze Another File
            </button>
          </div>
        )}

        {isAnalyzing && (
          <div className="analyzing-overlay">
            <div className="spinner"></div>
            <p>Analyzing audio patterns...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
