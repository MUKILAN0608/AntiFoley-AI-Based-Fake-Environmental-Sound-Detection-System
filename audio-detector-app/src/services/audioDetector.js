/**
 * Audio Detection Service
 * Connects to Flask backend with PyTorch AntiFoley model
 */

const API_URL = 'http://localhost:5000';

export const analyzeAudio = async (audioFile) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('audio', audioFile);

    // Send to backend
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Analysis failed');
    }

    const result = await response.json();

    return {
      isFake: result.isFake,
      confidence: result.confidence,
      features: result.features,
      fileName: result.fileName,
      fileSize: (audioFile.size / 1024 / 1024).toFixed(2) + ' MB',
      duration: result.duration,
      sampleRate: result.sampleRate,
      probabilities: result.probabilities,
      analysisTime: new Date().toLocaleTimeString()
    };
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error(`Failed to analyze audio: ${error.message}`);
  }
};

/**
 * Check backend health
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};
