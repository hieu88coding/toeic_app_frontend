import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useState, useEffect } from 'react'
import { AudioTwoTone, CustomerServiceTwoTone } from "@ant-design/icons";
import { Card, Button, Progress } from "antd";


const Dictaphone = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [result, setResult] = useState('');
    const [score, setScore] = useState(0);
    const string = `Hi. This is Myra Peters calling about my appointment with Dr. Jones. I have a three o’clock appointment scheduled for this afternoon. Unfortunately, I won’t be able to keep it because of an important meeting at work. So, I’ll need to reschedule. I was hoping to come in sometime next week. Any time Monday, Tuesday, or Wednesday afternoon would work for me. I hope the doctor has some time available on one of those days. Please call me back and let me know.`;
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const compareStrings = (string1, string2) => {
        const words1 = string1.toLowerCase().split(' ');
        const words2 = string2.toLowerCase().split(' ');

        let result = '';
        let greenCount = 0;
        for (let i = 0; i < Math.max(words1.length, words2.length); i++) {
            const word1 = words1[i] || '';
            const word2 = words2[i] || '';

            if (word1 === word2) {
                result += `<span style="color: green">${word1}</span> `;
                greenCount++;
            } else {
                result += `<span style="color: red">${word1}</span> `;
            }
        }
        setScore(Math.round(greenCount / words1.length * 100))
        return result;
    }

    const handleTurnOn = () => {
        SpeechRecognition.startListening({
            continuous: true,
            language: 'en-US'
        })
        setIsRecording(true);
    }

    const handleTurnOff = () => {
        SpeechRecognition.stopListening();
        setIsRecording(false);
    }

    const recordAgain = () => {
        resetTranscript();
    }
    const handleTryAgain = () => {
        resetTranscript();
        setIsRecording(false);
        setIsSubmit(false);
        setResult('')
        setScore(0);
    }
    const handleSubmit = () => {
        setIsSubmit(true);
    }

    useEffect(() => {
        if (isSubmit === true) {
            setResult(compareStrings(string, transcript))
        }
    }, [isSubmit]);

    return (
        <div>
            {
                !isSubmit && !isRecording &&
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
                    <AudioTwoTone style={{ fontSize: 35, margin: '0 auto' }} onClick={() => handleTurnOn()}>Start</AudioTwoTone>
                    <div style={{ color: '#3498db', marginTop: 10 }}>Start record</div>
                </div>
            }
            {
                !isSubmit && isRecording &&
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
                    <CustomerServiceTwoTone style={{ fontSize: 35, margin: '0 auto' }} onClick={() => handleTurnOff()}>Start</CustomerServiceTwoTone>
                    <div style={{ color: '#3498db', marginTop: 10 }}>Recording...</div>
                </div>
            }
            {
                !isSubmit && transcript.length !== 0 &&
                <div style={{ marginTop: 50, fontSize: 16 }}>
                    <div style={{ fontWeight: 700, marginBottom: 20 }}>Transcript: </div>
                    <Card title={null}>{transcript}</Card>
                </div>
            }

            {
                !isSubmit && !isRecording && transcript.length !== 0 &&
                <div style={{ marginTop: 50, fontSize: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button size='large' onClick={() => recordAgain()}>Record again</Button>
                    <Button size='large' onClick={() => handleSubmit()} type='primary'>Submit</Button>

                </div>
            }


            {
                isSubmit &&
                <div style={{ marginTop: 20, fontSize: 16 }}>
                    <Card title={null}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Progress type="circle" percent={score} size={80} />
                            <div style={{ display: 'flex', flexDirection: 'column', width: '60%' }}>
                                <div style={{ marginBottom: 20 }}>Don't get frustrated, keep practicing and you can get 100% too!</div>
                                <Button danger onClick={() => handleTryAgain()}>Try again</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            }

            {
                isSubmit &&
                <div style={{ marginTop: 50, fontSize: 16 }}>
                    <div style={{ fontWeight: 700, marginBottom: 20 }}>Kết quả: </div>
                    <Card title={null}><div dangerouslySetInnerHTML={{ __html: `${result}` }}></div></Card>
                </div>
            }

        </div>
    );
};
export default Dictaphone;