"use client";

import { MicIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
export const mimeType = "audio/webm";

function Recorder({ uploadAudio }: { uploadAudio: (blob: Blob) => void }) {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [pending, setPending] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("inactive");

  useEffect(() => {
    getMicrophonePermission();
  }, []);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      alert("Your browser does not support the MediaRecorder API");
    }
  };

  const startRecording = () => {
    if (!stream || pending) return;
    setRecordingStatus("recording");

    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    media.start();

    const localAudioChunks: Blob[] = [];
    media.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        localAudioChunks.push(event.data);
      }
    };

    media.onstop = () => {
      const audioBlob = new Blob(localAudioChunks, { type: mimeType });
      uploadAudio(audioBlob);
      setAudioChunks([]); // Clear chunks for the next recording
      setPending(false); // Reset pending state after upload
    };

    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    if (mediaRecorder.current && !pending) {
      setRecordingStatus("inactive");
      mediaRecorder.current.stop();
    }
  };

  return (
    <div
      className={`flex items-center group text-blue-500 cursor-pointer border rounded-md w-fit px-3 py-2 mb-5 ${
        recordingStatus === "recording"
          ? "bg-red-500 text-white"
          : "hover:bg-[#E7F0FE]"
      }`}
    >
      <MicIcon size={20} className="group-hover:underline" />

      {!permission && (
        <button onClick={getMicrophonePermission}> Get Microphone </button>
      )}

      {recordingStatus === "recording" && pending && <p>Recording...</p>}

      {recordingStatus === "inactive" && !pending && (
        <button
          onClick={startRecording}
          className="text-sm font-medium group-hover:underline ml-2 mt-1"
        >
          Speak
        </button>
      )}

      {recordingStatus === "recording" && (
        <button
          onClick={stopRecording}
          className="text-sm font-medium group-hover:underline ml-2 mt-1"
        >
          Stop
        </button>
      )}
    </div>
  );
}

export default Recorder;
