import { useEffect, useState, useRef, forwardRef } from "react";
import { useAuthUser } from "react-auth-kit";
import {
    MessageOutlined, MailOutlined, PhoneOutlined, DownOutlined, UserOutlined, HeartOutlined,
    LogoutOutlined

} from "@ant-design/icons";
import { Dropdown, Space, Card } from 'antd';
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

export const Part2 = (props) => {
    const array = props.audio;
    const refAudio = useRef(null);
    return (
        <div>
            <Card title={null} style={{ width: '100%', marginBottom: 60, backgroundColor: 'rgba(0, 0, 0, .03)' }}>
                <div style={{ fontSize: 16 }} className="part2-instruction">
                    <b>Part 2.</b> You will hear a question or statement and three responses spoken in English. They will not be printed in your test book and will be spoken only one time. Select the best response to the question or statement and mark the letter (A), (B), or (C) on your answer sheet.
                </div>
            </Card>
            {
                !props.isPart && array.length !== 0 && array.slice(6, 31).map((audio, index) => (
                    <div className="part2-container" style={{ marginBottom: 50 }} key={index}>
                        <div className="part2-title" style={{ fontWeight: 'bold', marginBottom: 10 }}>Question {index + 7}. Listen to the question and choose the correct response</div>
                        <div className="part2-content">
                            <div className="part2-audio" style={{ width: '100%', display: 'flex', flexDirection: `column` }}>
                                <CustomPlyrInstance key={index} ref={refAudio} type="audio" source={{
                                    type: "audio",
                                    sources: [
                                        {
                                            type: "audio/mp3",
                                            src: array[index],
                                        },
                                    ],
                                }} options={audioOptions} />
                            </div>
                        </div>
                    </div>

                ))}
            {
                props.isPart && array.length !== 0 && array.map((audio, index) => (
                    <div className="part2-container" style={{ marginBottom: 50 }} key={index + 99}>
                        <div className="part2-title" style={{ fontWeight: 'bold', marginBottom: 10 }}>Question {index + 7}. Listen to the question and choose the correct response</div>
                        <div className="part2-content">
                            <div className="part2-audio" style={{ width: '100%', display: 'flex', flexDirection: `column` }}>
                                <CustomPlyrInstance key={index} ref={refAudio} type="audio" source={{
                                    type: "audio",
                                    sources: [
                                        {
                                            type: "audio/mp3",
                                            src: array[index],
                                        },
                                    ],
                                }} options={audioOptions} />
                            </div>
                        </div>
                    </div>

                ))}

        </div>


    );
};