import React, { useState } from 'react';

const TextToSpeech = () => {
    const [text, setText] = useState('');

    const handleInputChange = (event) => {
        setText(event.target.value);
    };

    const handleTextToSpeech = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();

        // Tìm giọng nói tiếng Anh Mỹ (US)
        const usVoice = voices.find((voice) => voice.lang === 'en-US');
        if (usVoice) {
            utterance.voice = usVoice;
        }

        // Tìm giọng nói tiếng Anh Anh (UK)
        const ukVoice = voices.find((voice) => voice.lang === 'en-GB');
        if (ukVoice) {
            utterance.voice = ukVoice;
        }

        window.speechSynthesis.speak(utterance);
    };

    return (
        <div>
            <input type="text" value={text} onChange={handleInputChange} />
            <button onClick={handleTextToSpeech}>Text to Speech</button>
        </div>
    );
};

export default TextToSpeech;