# 🎤 AI Voice Chat App

A modern, responsive voice chat application powered by Google Gemini AI. This app allows users to have natural conversations with an AI assistant using voice input and receives spoken responses.

![Voice Chat App](https://img.shields.io/badge/React-18.0+-blue) ![Node.js](https://img.shields.io/badge/Node.js-16.0+-green) ![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange)

## ✨ Features

### 🎯 Core Functionality
- **Voice Input**: Record and send voice messages to AI
- **Text Input**: Type messages as an alternative to voice
- **AI Responses**: Get intelligent responses from Google Gemini AI
- **Voice Output**: AI responses are spoken back to you
- **Real-time Interruption**: Interrupt AI while it's speaking
- **Conversation History**: View your chat history

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Beautiful Interface**: Modern gradient design with glass morphism
- **Smooth Animations**: Engaging user experience with animations
- **Dark Mode Support**: Automatic dark mode detection
- **Accessibility**: Keyboard navigation and focus states

### 🔧 Technical Features
- **Rate Limiting**: Handles API quota limits gracefully
- **Error Handling**: Comprehensive error management
- **Audio Quality**: High-quality audio recording and processing
- **Cross-platform**: Works on all modern browsers
- **Real-time Feedback**: Live recording duration and status indicators

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anuragcs/AI_VOICE_APP.git
   cd AI_VOICE_APP
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In the server directory, create a .env file
   cd ../server
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
   ```

4. **Start the application**
   ```bash
   # Start the server (from server directory)
   npm start
   
   # In a new terminal, start the client (from client directory)
   cd ../client
   npm start
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Allow microphone permissions when prompted

## 🔑 Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your `.env` file

## 📱 Usage

### Voice Chat
1. Click "Start Speaking" button
2. Speak clearly into your microphone
3. Click "Stop Recording" when done
4. Wait for AI to process and respond
5. Listen to the AI's spoken response

### Text Chat
1. Click "Text Input" button
2. Type your message
3. Press Enter or click "Send"
4. Receive AI response

### Interrupting AI
- Press **Spacebar** while AI is speaking
- Or click "Interrupt AI" button
- Add your new input immediately

### Tips for Better Voice Recognition
- Speak clearly and at a normal pace
- Reduce background noise
- Record for at least 2-3 seconds
- Position yourself close to the microphone

## 🏗️ Project Structure

```
AI_VOICE_APP/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── App.js         # Main application component
│   │   ├── App.css        # Styles
│   │   └── index.js       # Entry point
│   ├── package.json       # Frontend dependencies
│   └── README.md          # Frontend documentation
├── server/                # Node.js backend
│   ├── routes/            # API routes
│   │   └── gemini.js      # Gemini API integration
│   ├── services/          # Business logic
│   │   └── gemini.js      # Gemini service
│   ├── app.js             # Express server setup
│   └── package.json       # Backend dependencies
├── start.sh               # Quick start script
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

### API Endpoints

- `POST /api/gemini/start` - Initialize conversation
- `POST /api/gemini/process` - Process audio or text input
- `POST /api/gemini/interrupt` - Interrupt current processing
- `POST /api/gemini/test-audio` - Test audio file upload

## 🎨 Customization

### Styling
The app uses modern CSS with:
- CSS Grid and Flexbox for layout
- CSS Custom Properties for theming
- Smooth animations and transitions
- Responsive design patterns

### Voice Settings
Modify voice settings in `client/src/App.js`:
```javascript
utterance.rate = 0.95;    // Speech rate
utterance.pitch = 1.0;    // Voice pitch
utterance.volume = 1.0;   // Volume level
```

## 🚨 Rate Limiting

The free tier of Gemini API has limits:
- **50 requests per minute** for `gemini-1.5-flash`
- App automatically handles rate limiting
- 60-second cooldown when limits are exceeded
- Clear visual indicators during rate limit periods

## 🐛 Troubleshooting

### Common Issues

1. **Microphone not working**
   - Check browser permissions
   - Ensure microphone is not used by other apps
   - Try refreshing the page

2. **API errors**
   - Verify your Gemini API key is correct
   - Check if you've exceeded rate limits
   - Ensure your API key has proper permissions

3. **Audio not processing**
   - Speak clearly and for at least 2-3 seconds
   - Reduce background noise
   - Check microphone settings

4. **Server connection issues**
   - Ensure server is running on port 3001
   - Check if client is connecting to correct URL
   - Verify CORS settings

### Debug Mode
Enable debug logging by checking browser console and server logs for detailed error information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for the AI capabilities
- [React](https://reactjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for voice synthesis

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the console logs for error details

---

**Made with ❤️ by Anurag Gupta**

*This project demonstrates modern web development practices with AI integration for voice-based interactions.* 