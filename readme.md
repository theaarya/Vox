# 🎙️ Audio Chatbot with Flask and JavaScript

## 🚀 Project Overview
This project is a voice-enabled chatbot that allows users to record their speech, send it to a Flask backend for processing, and receive both text and audio responses. It integrates:

- **JavaScript** for handling audio recording in the browser 🎤
- **Flask** as the backend to process audio and generate responses 🖥️
- **Speech-to-Text (STT) API** for transcribing user speech 📝
- **Text-to-Speech (TTS) API** for generating spoken responses 🔊

## 🏗️ Project Structure
```plaintext
📂 project-folder/
├── 📄 app.py          # Flask backend
├── 📂 templates/
│   ├── 📄 index.html  # Frontend interface
├── 📂 static/
│   ├── 📄 script.js   # JavaScript for recording & sending audio
├── 📄 requirements.txt # Dependencies
└── 📄 README.md       # Documentation
```

## 🎤 How It Works
### 1️⃣ **Recording Audio**
- The user clicks the **Record** button.
- JavaScript uses `MediaRecorder` to capture microphone input.
- The audio is stored as chunks and converted into a `Blob`.

### 2️⃣ **Sending Audio to Backend**
- The recorded audio is sent to the Flask backend (`/process_audio`) using `FormData`.
- The Flask app processes the audio using an STT API to extract text.

### 3️⃣ **Generating a Response**
- The backend analyzes the transcribed text and generates a response.
- A TTS API converts the response into speech.

### 4️⃣ **Playing the Response**
- The response is displayed as a text message.
- The assistant’s voice response is played using the `<audio>` tag in JavaScript.

## 📝 API Endpoints
### 🎙️ `/process_audio`
- **Method:** `POST`
- **Input:** Audio file (OGG/WAV format)
- **Output:** JSON response containing transcribed text and a base64-encoded audio response
- **Example Response:**
```json
{
  "transcript": "Hello! How can I help you?",
  "response_text": "Hi there! I'm your AI assistant.",
  "audio_base64": "UklGRgA... (base64 encoded audio)"
}
```

## 🎨 Frontend JavaScript Highlights
- Uses `navigator.mediaDevices.getUserMedia({ audio: true })` to access the microphone.
- `MediaRecorder` captures and encodes the audio.
- Uses `fetch()` to send the audio to the Flask server.
- Dynamically updates the chat UI with messages and plays audio responses.


## 🔥 Conclusion
This project demonstrates how voice-based chat applications can be built using **Flask** and **JavaScript**. It's an excellent starting point for more advanced AI-powered conversational assistants. 🚀

---
🔗 *Happy coding! If you have any questions, feel free to ask!*

