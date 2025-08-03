import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaMicrophone, FaStop, FaPlay, FaPause, FaKeyboard, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import './App.css';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const recorderRef = useRef(null);
  const speechRef = useRef(null);
  const recordingTimerRef = useRef(null);

  const API_BASE_URL = 'http://localhost:3001';

  useEffect(() => {
    // Initialize conversation
    axios.post(`${API_BASE_URL}/api/gemini/start`)
      .then(response => {
        console.log('Conversation started:', response.data);
      })
      .catch(err => {
        console.error('Error starting conversation:', err);
        setError('Failed to start conversation with AI');
      });

    // Initialize speech synthesis voices
    const initializeVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    };

    // Load voices when they become available
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = initializeVoices;
    }
    
    // Also try to initialize immediately
    initializeVoices();

    // Add keyboard shortcut for interruption (Spacebar)
    const handleKeyPress = (event) => {
      if (event.code === 'Space' && (isSpeaking || isProcessing)) {
        event.preventDefault();
        handleInterrupt();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isSpeaking, isProcessing]);

  const speakText = (text) => {
    if (!speechEnabled) return;
    
    // Stop any existing speech
    if (speechRef.current) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(true);
    
    // Auto-scroll to bottom of conversation
    setTimeout(() => {
      const conversationContainer = document.querySelector('.conversation-container');
      if (conversationContainer) {
        conversationContainer.scrollTop = conversationContainer.scrollHeight;
      }
    }, 100);
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Priority list for high-quality, consistent voices
    const preferredVoices = [
      'Samantha',           // macOS default female voice
      'Karen',              // macOS alternative female voice
      'Victoria',           // macOS newer female voice
      'Alex',               // macOS default male voice (fallback)
      'Google UK English Female', // Chrome/Edge female voice
      'Google US English Female', // Chrome/Edge female voice
      'Microsoft Zira Desktop',   // Windows female voice
      'Microsoft David Desktop'   // Windows male voice (fallback)
    ];
    
    // Find the best available voice
    let selectedVoice = null;
    
    // First, try to find a preferred voice
    for (const voiceName of preferredVoices) {
      const voice = voices.find(v => v.name.includes(voiceName));
      if (voice) {
        selectedVoice = voice;
        break;
      }
    }
    
    // If no preferred voice found, try to find any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.default
      ) || voices.find(voice => 
        voice.lang.startsWith('en')
      ) || voices[0]; // Last resort: first available voice
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log('Using voice:', selectedVoice.name);
    }
    
    // Optimize speech settings for clarity and fluency
    utterance.rate = 0.95;    // Slightly slower for better clarity
    utterance.pitch = 1.0;    // Natural pitch
    utterance.volume = 1.0;   // Full volume
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsSpeaking(false);
    };
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100, // Higher sample rate for better quality
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true, // Automatically adjust microphone gain
          latency: 0.01 // Lower latency
        } 
      });
      
      // Try to get the best available audio format
      let mimeType = 'audio/webm;codecs=opus';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else {
        mimeType = 'audio/wav';
      }
      
      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType
      });
      
      recorderRef.current = recorder;
      
      let audioChunks = [];
      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        const audioFile = new File([audioBlob], 'recording.webm', { type: mimeType });
        
        // Check if recording is too short
        if (audioBlob.size < 2000) {
          setError('Recording too short. Please speak for at least 2-3 seconds.');
          setIsListening(false);
          return;
        }
        
        const formData = new FormData();
        formData.append('audio', audioFile);

        setIsListening(false);
        setIsProcessing(true);
        
        try {
          console.log('Sending audio file:', {
            size: audioFile.size,
            type: audioFile.type,
            name: audioFile.name
          });
          
          const response = await axios.post(`${API_BASE_URL}/api/gemini/process`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          console.log('Audio processing response:', response.data);
          
          setConversation(prev => [
            ...prev,
            { speaker: 'user', text: '🎤 User audio input' },
            { speaker: 'ai', text: response.data.text }
          ]);
          
          // Auto-scroll to bottom after adding new messages
          setTimeout(() => {
            const conversationContainer = document.querySelector('.conversation-container');
            if (conversationContainer) {
              conversationContainer.scrollTop = conversationContainer.scrollHeight;
            }
          }, 100);
          
          // Speak the AI response
          speakText(response.data.text);
        } catch (error) {
          console.error('Error processing audio:', error);
          console.error('Error response:', error.response?.data);
          const errorMessage = error.response?.data?.error || error.message;
          
          // Check for rate limiting
          if (errorMessage.includes('rate limit') || errorMessage.includes('quota') || errorMessage.includes('429')) {
            handleRateLimit(60); // 60 second retry delay
            setError('API rate limit exceeded. Please wait 60 seconds before trying again.');
          } else {
            setError(`Error processing audio: ${errorMessage}`);
          }
          
          setConversation(prev => [
            ...prev,
            { speaker: 'user', text: '🎤 User audio input' },
            { speaker: 'ai', text: `❌ Error: ${errorMessage}` }
          ]);
        } finally {
          setIsProcessing(false);
        }
      };

      recorder.start();
      setIsListening(true);
      setRecordingDuration(0);
      
      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && isListening) {
      recorderRef.current.stop();
      recorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Clear recording timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingDuration(0);
    }
  };

  const handleInterrupt = async () => {
    // Stop any ongoing speech immediately
    if (isSpeaking) {
      stopSpeaking();
    }
    
    // If AI is processing, try to interrupt it
    if (isProcessing) {
      try {
        await axios.post(`${API_BASE_URL}/api/gemini/interrupt`);
        setIsProcessing(false);
      } catch (error) {
        console.error('Error interrupting:', error);
      }
    }
    
    // Add a visual indicator that the AI was interrupted
    setConversation(prev => [
      ...prev,
      { speaker: 'system', text: '🔄 AI interrupted - you can now speak or type your new input' }
    ]);
  };

  const sendTextMessage = async () => {
    if (!textInput.trim()) return;
    
    setIsProcessing(true);
    try {
      // For text input, we'll simulate the audio processing by sending a text message
      const response = await axios.post(`${API_BASE_URL}/api/gemini/process`, {
        text: textInput
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      setConversation(prev => [
        ...prev,
        { speaker: 'user', text: `💬 ${textInput}` },
        { speaker: 'ai', text: response.data.text }
      ]);
      
      // Auto-scroll to bottom after adding new messages
      setTimeout(() => {
        const conversationContainer = document.querySelector('.conversation-container');
        if (conversationContainer) {
          conversationContainer.scrollTop = conversationContainer.scrollHeight;
        }
      }, 100);
      
      // Speak the AI response
      speakText(response.data.text);
      
      setTextInput('');
      setShowTextInput(false);
    } catch (error) {
      console.error('Error sending text message:', error);
      const errorMessage = error.response?.data?.error || error.message;
      
      // Check for rate limiting
      if (errorMessage.includes('rate limit') || errorMessage.includes('quota') || errorMessage.includes('429')) {
        handleRateLimit(60); // 60 second retry delay
        setError('API rate limit exceeded. Please wait 60 seconds before trying again.');
      } else {
        setError(`Error sending message: ${errorMessage}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setError(null);
    stopSpeaking();
  };

  const handleRateLimit = (retryDelay = 60) => {
    setRateLimited(true);
    setRetryCountdown(retryDelay);
    
    const countdown = setInterval(() => {
      setRetryCountdown(prev => {
        if (prev <= 1) {
          setRateLimited(false);
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleSpeech = () => {
    if (speechEnabled) {
      stopSpeaking();
    }
    setSpeechEnabled(!speechEnabled);
  };

  const testAudioProcessing = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          latency: 0.01
        } 
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      let audioChunks = [];
      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'test.webm', { type: 'audio/webm' });
        
        const formData = new FormData();
        formData.append('audio', audioFile);

        try {
          const response = await axios.post(`${API_BASE_URL}/api/gemini/test-audio`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          console.log('Test response:', response.data);
          alert(`Audio test successful! File size: ${audioFile.size} bytes`);
        } catch (error) {
          console.error('Test error:', error);
          alert(`Test failed: ${error.response?.data?.error || error.message}`);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setTimeout(() => {
        recorder.stop();
      }, 3000); // Record for 3 seconds
      
    } catch (error) {
      console.error('Test recording error:', error);
      alert(`Recording test failed: ${error.message}`);
    }
  };

  return (
    <div className="app">
      <h1>Revolt Motors Voice Assistant</h1>
      
      <div className="main-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
              {isSpeaking && (
        <div className="speaking-indicator">
          🔊 AI is speaking... (Press Spacebar or click "Interrupt AI" to stop and add new input)
        </div>
      )}
      
      {rateLimited && (
        <div className="rate-limit-indicator">
          ⏰ Rate limit exceeded. Please wait {retryCountdown} seconds before trying again.
        </div>
      )}
        
        <div className="conversation-container">
          {conversation.length === 0 ? (
                      <div className="empty-state">
            <p>🎤 Click "Start Speaking" to begin your conversation with the AI assistant</p>
            <p>💬 Or use the text input if voice doesn't work</p>
            <p>🔊 AI will speak its responses out loud</p>
            <p>💡 <strong>Voice Tips:</strong> Speak clearly, reduce background noise, and record for at least 2-3 seconds</p>
            <p>⚠️ <strong>Free Tier Limit:</strong> Gemini API has a limit of 50 requests per minute. Use wisely!</p>
          </div>
          ) : (
            conversation.map((msg, index) => (
              <div key={index} className={`message ${msg.speaker}`}>
                <strong>
                  {msg.speaker === 'user' ? 'You:' : 
                   msg.speaker === 'ai' ? 'AI:' : 
                   msg.speaker === 'system' ? 'System:' : 'Unknown:'}
                </strong> {msg.text}
              </div>
            ))
          )}
        </div>

        {showTextInput && (
          <div className="text-input-container">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your message here..."
              onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
              className="text-input"
            />
            <button onClick={sendTextMessage} className="control-button">
              Send
            </button>
          </div>
        )}

        <div className="controls">
          {!isListening && !isProcessing && !rateLimited ? (
            <>
              <button onClick={startRecording} className="control-button">
                <FaMicrophone /> Start Speaking
              </button>
              <button onClick={() => setShowTextInput(!showTextInput)} className="control-button">
                <FaKeyboard /> {showTextInput ? 'Hide Text Input' : 'Text Input'}
              </button>
                          <button onClick={toggleSpeech} className={`control-button ${speechEnabled ? 'speech-on' : 'speech-off'}`}>
              {speechEnabled ? <FaVolumeUp /> : <FaVolumeMute />} 
              {speechEnabled ? 'Speech On' : 'Speech Off'}
            </button>
            <button onClick={testAudioProcessing} className="control-button">
              🧪 Test Audio
            </button>
            </>
                  ) : isListening ? (
          <button onClick={stopRecording} className="control-button stop">
            <FaStop /> Stop Recording ({recordingDuration}s)
          </button>
        ) : isProcessing ? (
          <button onClick={handleInterrupt} className="control-button interrupt">
            <div className="loading"></div> Processing...
          </button>
        ) : (
          <button onClick={handleInterrupt} className="control-button interrupt">
            <FaPause /> Interrupt AI
          </button>
        )}
          
          {conversation.length > 0 && (
            <button onClick={clearConversation} className="control-button clear">
              Clear Conversation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;