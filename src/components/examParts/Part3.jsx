import { useEffect, useState, useRef, forwardRef } from "react";
import { useAuthUser } from "react-auth-kit";
import {
    MessageOutlined, MailOutlined, PhoneOutlined, DownOutlined, UserOutlined, HeartOutlined,
    LogoutOutlined

} from "@ant-design/icons";
import { Divider, Card } from 'antd';
import baseAvatar from '../../assets/Sample_User_Icon.png'
import { Link, useNavigate, useLocation } from "react-router-dom";
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

export const Part3 = (props) => {
    const images = props.images;
    const audio = props.audio;
    const exel = props.exel;
    const chunks = [];
    for (let i = 0; i < exel.length; i += 3) {
        chunks.push(exel.slice(i, i + 3));
    }
    const refAudio = useRef(null);
    return (
        <div>
            <Card title={null} style={{ width: '98%', fontSize: 16, marginBottom: 60, backgroundColor: 'rgba(0, 0, 0, .03)' }}>
                <div className="part3-instruction" style={{ fontSize: 16 }}>
                    <b>Part 3.</b> You will hear some conversations between two people. You will be asked to answer three questions about what the speakers say in each conversation. Select the best response to each question and mark the letter (A), (B), (C), or (D) on your answer sheet. The conversations will not be printed in your test book and will be spoken only one time.
                </div>
            </Card>
            {
                audio.length !== 0 && audio.slice(31, 42).map((audio, index) => (
                    <div className="part3-container" style={{ marginBottom: 50, fontSize: 16 }} key={`part3${index + 99}`}>
                        <div className="part3-content">

                            <div className="part3-audio" style={{ width: '100%', display: 'flex', flexDirection: `column` }}>
                                <CustomPlyrInstance key={index} ref={refAudio} type="audio" source={{
                                    type: "audio",
                                    sources: [
                                        {
                                            type: "audio/mp3",
                                            src: audio,
                                        },
                                    ],
                                }} options={audioOptions} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', padding: 20, marginTop: 30 }}>
                                {chunks && chunks[index].map((exel, chunkIndex) => (
                                    <div className="part3-question" key={`question${exel.number}`} style={{
                                        gridColumn: chunkIndex % 2 !== 0 ? '2 / 3' : '1',
                                        marginBottom: 20
                                    }}>
                                        <div className="part3-title" style={{ maxWidth: '80%', fontWeight: 'bold', marginBottom: 10 }}>Question {exel.number}. {exel.question}</div>
                                        <div className="part3-answer" style={{ marginBottom: 10 }}>
                                            <div>{exel.answerA}</div>
                                            <div>{exel.answerB}</div>
                                            <div>{exel.answerC}</div>
                                            <div>{exel.answerD}</div>
                                        </div>

                                    </div>


                                ))}

                            </div>
                            <Divider />
                        </div>
                    </div>

                ))}
            {
                audio.length !== 0 && audio.slice(42, 44).map((audio, index) => (
                    <div className="part3-container" style={{ marginBottom: 50, fontSize: 16 }} key={`part3${index}`}>
                        <div className="part3-content">
                            <div className="part3-audio" style={{ width: '100%', display: 'flex', flexDirection: `column` }}>
                                <CustomPlyrInstance key={index} ref={refAudio} type="audio" source={{
                                    type: "audio",
                                    sources: [
                                        {
                                            type: "audio/mp3",
                                            src: audio,
                                        },
                                    ],
                                }} options={audioOptions} />
                            </div>
                            <div className="part3-images" style={{ width: '40%', maxHeight: '321px', margin: '0 auto' }}>
                                <img style={{ width: '100%', height: 'auto', maxHeight: '100%' }} key={index} src={images[6 + index]} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', padding: 20, marginTop: 30 }}>
                                {chunks && chunks[index + 11].map((exel, chunkIndex) => (
                                    <div className="part3-question" key={`question${exel.number}`} style={{
                                        gridColumn: chunkIndex % 2 !== 0 ? '2 / 3' : '1',
                                        marginBottom: 20
                                    }}>
                                        <div className="part3-title" style={{ fontWeight: 'bold', marginBottom: 10 }}>Question {exel.number}. {exel.question}</div>
                                        <div className="part3-answer" style={{ marginBottom: 10 }}>
                                            <div>{exel.answerA}</div>
                                            <div>{exel.answerB}</div>
                                            <div>{exel.answerC}</div>
                                            <div>{exel.answerD}</div>
                                        </div>

                                    </div>


                                ))}

                            </div>
                            <Divider />
                        </div>
                    </div>

                ))}

        </div>


    );
};