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

export const Part1 = (props) => {
    const refAudio = useRef(null);
    let audio = props.audio;
    let images = props.images;
    return (
        <div>
            <Card title={null} style={{ height: '100%', width: '100%', marginBottom: 60, backgroundColor: 'rgba(0, 0, 0, .03)' }}>
                <div style={{ fontSize: 16 }} className="part1-instruction">
                    <b>Part 1.</b> For each question in this part, you will hear four statements about a picture in your test book. When you hear the statements, you must select the one statement that best describes what you see in the picture. Then find the number of the question on your answer sheet and mark your answer. The statements will not be printed in your test book and will be spoken only one time.
                </div>
            </Card>
            {
                props.images && images.slice(0, 6).map((image, index) => (

                    <div className="part1-container" style={{ marginBottom: 50 }} key={index}>
                        <div className="part1-title" style={{ fontWeight: 'bold', marginBottom: 10 }}>Question {index + 1}.</div>
                        <div className="part1-content" style={{
                            display: 'flex', flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <div className="part1-images" style={{ width: '40%', maxHeight: '321px' }}>
                                <img style={{ width: '100%', height: 'auto', maxHeight: '100%' }} key={index} src={image} />
                            </div>

                            <div className="part1-audio" style={{ width: '55%', display: 'flex', flexDirection: `column` }}>
                                <CustomPlyrInstance key={index} ref={refAudio} type="audio" source={{
                                    type: "audio",
                                    sources: [
                                        {
                                            type: "audio/mp3",
                                            src: audio[index],
                                        },
                                    ],
                                }} options={audioOptions} />
                            </div>
                        </div>
                    </div>

                )


                )}

        </div>


    );
};