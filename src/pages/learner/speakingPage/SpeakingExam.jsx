import * as React from "react";
import { useState, useEffect, useRef, forwardRef } from "react";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import { Card, Steps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Dictaphone from "../../../components/speech-to-text/SpeechRecognition";
import "plyr-react/plyr.css";
import { usePlyr } from "plyr-react";


const audioOptions = undefined;
const CustomPlyrInstance = forwardRef((props, ref) => {
    const { source, options = null } = props;
    const raptorRef = usePlyr(ref, { options, source });
    useEffect(() => {
        const { current } = ref;
        if (current.plyr.source === null) return;

        const api = current;
        api.plyr.on("ready", () => { });
        api.plyr.on("canplay", () => {
            // api.plyr.play();
        });
        api.plyr.on("ended", () => { });
    });

    const handleClick = () => {
        raptorRef.current.play();
    };

    return (
        <audio
            ref={raptorRef}
            className="plyr-react plyr"
            muted={true}
            onClick={handleClick}
        />
    );
});

const SpeakingExam = () => {
    const refAudio = useRef(null);
    const [paragraph, setParagraph] = useState('Hi. This is Myra Peters calling about my appointment with Dr. Jones. I have a three o’clock appointment scheduled for this afternoon. Unfortunately, I won’t be able to keep it because of an important meeting at work. So, I’ll need to reschedule. I was hoping to come in sometime next week. Any time Monday, Tuesday, or Wednesday afternoon would work for me. I hope the doctor has some time available on one of those days. Please call me back and let me know.')
    const navigate = useNavigate();


    return (
        <div>
            <Topbar></Topbar>
            <TopMenu active={" "}></TopMenu>
            <div className="speakingExamContainer">
                <div style={{
                    width: '70%',
                    display: 'flex', flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginLeft: 'auto', marginRight: 'auto', marginTop: '50px',
                    marginBottom: 200
                }} className="speakingExamContent">
                    <div style={{ display: 'flex', flexDirection: 'column', width: '60%', marginTop: '50px' }}>
                        <Card style={{ width: '100%', fontSize: 16 }}>
                            <div style={{ fontWeight: 700 }}>Directions:</div>
                            <div>In this part of the test, you will read aloud the text on the screen. You will have 45 seconds to prepare. Then you will have 45 seconds to read the text aloud.</div>
                        </Card>

                        <Card style={{ width: '100%', marginTop: '50px' }}>
                            <div style={{ fontWeight: 700 }}>Audio Sample</div>
                            <div className="part1-audio" style={{ width: '100%', display: 'flex', flexDirection: `column` }}>
                                <CustomPlyrInstance ref={refAudio} type="audio" source={{
                                    type: "audio",
                                    sources: [
                                        {
                                            type: "audio/mp3",
                                            //src: audio[index],
                                        },
                                    ],
                                }} options={audioOptions} />
                            </div>
                            <div style={{ marginTop: 50, fontSize: 16 }}>{paragraph}</div>
                        </Card>


                    </div>
                    <Card style={{ width: '35%', marginTop: '50px', height: 700 }}>
                        <Dictaphone />
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default SpeakingExam; 