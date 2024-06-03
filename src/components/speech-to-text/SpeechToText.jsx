import React, { useState, useRef } from 'react';
import axios from 'axios';
import RecordRTC from 'recordrtc';
const SpeechToText = () => {
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioRef = useRef(null);

    function convertToBlob(value) {
        const recorder = new RecordRTC([value], {
            type: 'audio',
            mimeType: 'audio/wav',
        });

        recorder.getBlob((blob) => {
            setAudioBlob(blob);
        });
    }

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.start();
                setRecording(true);
            })
            .catch(error => {
                console.error('Error starting recording:', error);
            });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.ondataavailable = (event) => {
                //convertToBlob(event.data);
                setAudioBlob(event.data);
            };
            setRecording(false);
        }

    };

    const transcribeAudio = async () => {
        if (!audioBlob) {
            console.error('No audio recorded');
            return;
        } else {
            const formData = new FormData();
            formData.append('file', audioBlob);
            console.log(audioBlob);
            for (var key of formData.entries()) {
                console.log(key[0] + ', ' + key[1]);
            }
            const options = {
                method: "POST",
                url: "http://localhost:8080/transcribe",
                headers: {
                    "Accept": "application/json",
                    "Content-type": "multipart/form-data"
                },
                data: formData
            };

            // Make the request
            const response = await axios(options);

            // Check the response status
            if (response.status === 200) {
                // The request was successful, return the transcript
                console.log(response);
            } else {
                // The request failed, throw an error
                throw new Error("Request failed");
            }
        }


    };

    return (
        <div>
            <button onClick={recording ? stopRecording : startRecording}>
                {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <button onClick={() => transcribeAudio()} disabled={!audioBlob}>
                Transcribe
            </button>
            {audioBlob && (
                <div>
                    <audio ref={audioRef} controls src={URL.createObjectURL(audioBlob)} />
                </div>
            )}
        </div>
    );
};

export default SpeechToText;