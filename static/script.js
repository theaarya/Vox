let mediaRecorder;
let audioChunks = [];
let isRecording = false;

const recordButton = document.getElementById("record-button");
const chatContainer = document.getElementById("chat-container");

// Toggle recording on button click
recordButton.addEventListener("click", async () => {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
});

async function startRecording() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("getUserMedia not supported in this browser.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    isRecording = true;
    recordButton.classList.add("recording");
    audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/ogg" });
      // Show a status bubble for "Processing..."
      const statusElem = addStatusBubble("Processing your audio...");
      // Send audio to backend
      sendAudio(audioBlob, statusElem);
    });
  } catch (error) {
    console.error("Error accessing microphone", error);
    alert("Error accessing microphone.");
  }
}

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
    recordButton.classList.remove("recording");
    isRecording = false;
  }
}

/* 
  Add a user or assistant message bubble to the chat. 
  role: "user" or "assistant"
*/
function addMessageBubble(text, role) {
  const row = document.createElement("div");
  row.classList.add("message-row", role === "user" ? "message-user" : "message-assistant");

  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble");
  bubble.classList.add(role === "user" ? "user-bubble" : "assistant-bubble");
  bubble.textContent = text;

  row.appendChild(bubble);
  chatContainer.appendChild(row);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return row;
}

/*
  Add a "status" bubble in the center for things like "Processing..."
*/
function addStatusBubble(text) {
  const div = document.createElement("div");
  div.classList.add("status-bubble");
  div.textContent = text;
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return div;
}

async function sendAudio(audioBlob, statusElem) {
  const formData = new FormData();
  formData.append("audio_data", audioBlob, "recording.ogg");

  try {
    const response = await fetch("/process_audio", {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    // Remove the "Processing..." status bubble
    if (statusElem && statusElem.parentNode) {
      statusElem.parentNode.removeChild(statusElem);
    }
    // Display the actual transcript as the user's message
    addMessageBubble(data.transcript, "user");
    // Display the assistant's response
    addMessageBubble(data.response_text, "assistant");
    
    // Play TTS audio (OGG or WAV from backend)
    if (data.audio_base64) {
      // If your backend returns WAV, update the mime type to "audio/wav"
      // If your backend returns OGG, keep "audio/ogg"
      const audio = new Audio("data:audio/ogg;base64," + data.audio_base64);
      audio.play();
    }
  } catch (error) {
    console.error("Error processing audio", error);
    if (statusElem && statusElem.parentNode) {
      statusElem.parentNode.removeChild(statusElem);
    }
    addMessageBubble("Error processing your audio.", "assistant");
  }
}
