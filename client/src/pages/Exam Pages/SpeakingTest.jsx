import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Play,
  Square,
  RotateCcw,
} from "lucide-react";

const SpeakingTest = ({ onComplete, onBack }) => {
  const [currentPart, setCurrentPart] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [preparationTime, setPreparationTime] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaStream, setMediaStream] = useState(null);
  const [recordings, setRecordings] = useState({});
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  // Custom toast function as a replacement for useToast
  const showToast = (title, description, variant) => {
    const toastElement = document.createElement("div");
    toastElement.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      variant === "destructive" ? "bg-red-500 text-white" : "bg-green-500 text-white"
    }`;
    toastElement.innerHTML = `<strong>${title}</strong><br>${description}`;
    document.body.appendChild(toastElement);
    setTimeout(() => document.body.removeChild(toastElement), 3000);
  };

  const speakingParts = [
    {
      id: "part1",
      title: "Part 1: Introduction and Interview",
      duration: 300, // 5 minutes
      questions: [
        "What is your full name?",
        "Can I see your identification?",
        "Where are you from?",
        "Do you work or study?",
        "What do you like about your job/studies?",
        "What are your hobbies?",
      ],
      instructions:
        "The examiner will ask you general questions about yourself and familiar topics.",
    },
    {
      id: "part2",
      title: "Part 2: Long Turn",
      duration: 120, // 2 minutes
      preparationTime: 60, // 1 minute
      questions: [
        "Describe a place you have visited that you particularly enjoyed.",
        "You should say:",
        "• Where it was",
        "• When you went there",
        "• What you did there",
        "• And explain why you particularly enjoyed it",
      ],
      instructions: "You will have 1 minute to prepare and then speak for 2 minutes.",
    },
    {
      id: "part3",
      title: "Part 3: Discussion",
      duration: 300, // 5 minutes
      questions: [
        "How important is tourism for your country?",
        "What are the benefits of traveling?",
        "How has tourism changed in recent years?",
        "What problems can tourism cause?",
        "How can these problems be solved?",
      ],
      instructions: "The examiner will ask you questions related to the topic in Part 2.",
    },
  ];

  useEffect(() => {
    setupMediaStream();
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval;

    if (isPreparing && preparationTime > 0) {
      interval = setInterval(() => {
        setPreparationTime((prev) => {
          if (prev <= 1) {
            setIsPreparing(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPreparing, isRecording, preparationTime]);

  const setupMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      showToast(
        "Media Access Error",
        "Could not access camera or microphone. Please check permissions.",
        "destructive"
      );
    }
  };

  const startPreparation = () => {
    const part = speakingParts[currentPart];
    if (part.preparationTime) {
      setPreparationTime(part.preparationTime);
      setIsPreparing(true);
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    if (!mediaStream) return;

    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      setRecordings((prev) => ({
        ...prev,
        [speakingParts[currentPart].id]: blob,
      }));
    };

    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const retakeRecording = () => {
    setRecordings((prev) => {
      const newRecordings = { ...prev };
      delete newRecordings[speakingParts[currentPart].id];
      return newRecordings;
    });
    setRecordingTime(0);
  };

  const nextPart = () => {
    if (currentPart < speakingParts.length - 1) {
      setCurrentPart((prev) => prev + 1);
      setRecordingTime(0);
    } else {
      onComplete(recordings);
    }
  };

  const toggleCamera = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraEnabled;
        setCameraEnabled(!cameraEnabled);
      }
    }
  };

  const toggleMic = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micEnabled;
        setMicEnabled(!micEnabled);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentSpeakingPart = speakingParts[currentPart];
  const hasRecording = recordings[currentSpeakingPart.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IELTS Speaking Test</h1>
              <p className="text-gray-600">{currentSpeakingPart.title}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Part {currentPart + 1} of {speakingParts.length}
              </div>
              {isPreparing && (
                <div className="text-lg font-mono text-orange-600">
                  Preparation: {formatTime(preparationTime)}
                </div>
              )}
              {isRecording && (
                <div className="text-lg font-mono text-red-600">
                  Recording: {formatTime(recordingTime)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Preview */}
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg shadow">
            <div className="p-4">
              <h3 className="text-lg font-semibold">Video Preview</h3>
            </div>
            <div className="p-4">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-64 object-cover"
                />
                {!cameraEnabled && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <CameraOff className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={toggleCamera}
                  className={`px-3 py-1 rounded-lg ${
                    cameraEnabled
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {cameraEnabled ? (
                    <Camera className="h-4 w-4" />
                  ) : (
                    <CameraOff className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={toggleMic}
                  className={`px-3 py-1 rounded-lg ${
                    micEnabled
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Instructions and Questions */}
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg shadow">
            <div className="p-4">
              <h3 className="text-lg font-semibold">Instructions</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-700 mb-4">{currentSpeakingPart.instructions}</p>

              <h4 className="font-semibold mb-3">Questions:</h4>
              <ul className="space-y-2">
                {currentSpeakingPart.questions.map((question, index) => (
                  <li key={index} className="text-gray-700">
                    {question.startsWith("•") ? (
                      <span className="ml-4 text-blue-600">{question}</span>
                    ) : (
                      question
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="bg-white/80 backdrop-blur-sm border border-blue-200 mt-6 rounded-lg shadow p-6">
          <div className="flex justify-center space-x-4">
            {!isPreparing &&
              !isRecording &&
              !hasRecording && (
                <button
                  onClick={startPreparation}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
                >
                  {currentSpeakingPart.preparationTime
                    ? "Start Preparation"
                    : "Start Recording"}
                </button>
              )}

            {isRecording && (
              <button
                onClick={stopRecording}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg flex items-center"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Recording
              </button>
            )}

            {hasRecording && (
              <>
                <button
                  onClick={retakeRecording}
                  className="px-8 py-3 border border-gray-300 text-gray-800 hover:bg-gray-100 rounded-lg flex items-center"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake
                </button>
                <button
                  onClick={nextPart}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
                >
                  {currentPart < speakingParts.length - 1
                    ? "Next Part"
                    : "Complete Test"}
                </button>
              </>
            )}

            <button
              onClick={onBack}
              className="px-8 py-3 border border-gray-300 text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingTest;