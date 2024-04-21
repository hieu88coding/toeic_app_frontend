import * as React from "react";
import { useState, useEffect } from "react";
import "./vocabulary.scss";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import { Card, Button } from "antd";
import { CloseOutlined, SoundOutlined } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate, useLocation } from "react-router-dom";




const { Meta } = Card;
const Vocabulary = () => {
    const [stats, setStats] = useState([]);
    const navigate = useNavigate();
    const testCode = decodeURIComponent(useLocation().pathname.split("/")[2]);
    const getStats = async () => {
        try {
            const res = await publicRequest.get(`/vocabularys/${testCode}`);
            console.log(res);
            setStats(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    };
    useEffect(() => {
        getStats();

    }, []);

    const handleSound = (type, text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();

        const usVoice = voices.find((voice) => voice.lang === type);
        if (usVoice) {
            utterance.voice = usVoice;
        }
        window.speechSynthesis.speak(utterance);
    }
    return (
        <div>
            <div className="vocabPageContainer" style={{ marginBottom: 50 }}>
                <Link to={'/vocabulary'} className="closeBtn">
                    <div >
                        <CloseOutlined style={{ paddingRight: 10 }} /> Đóng
                    </div>
                </Link>

                <div className="middleHeader">
                    <div className="middleTitle">Từ vựng theo chủ đề: {testCode}</div>
                </div>



            </div>
            <div className="vocabularyContent">

                {stats && stats.map((stat, index) => (

                    <Card key={stat.id} hoverable={true} title={`${stat.word} (${stat.type}) ${stat.transcribe}`} style={{ marginBottom: 20 }} >
                        <div className="vocabularyItem" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className="sound" style={{ display: 'flex', flexDirection: 'row', marginBottom: 20 }}>
                                    <div style={{ fontSize: 20, marginRight: 20, fontWeight: 'bold' }}>
                                        <SoundOutlined onClick={() => handleSound('en-US', stat.word)} /> <span>US</span>
                                    </div>
                                    <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                                        <SoundOutlined onClick={() => handleSound('en-GB', stat.word)} /> <span>UK</span>
                                    </div>

                                </div>

                                <div className="vocabCard">
                                    <div style={{ fontSize: 18, fontWeight: '500' }}>Định nghĩa:</div>
                                    <div>{stat.meaning}</div>
                                </div>

                            </div>

                            <img style={{ width: 150 }} src={stat.image} />
                        </div>
                    </Card>

                ))}



            </div>
        </div>
    );
};

export default Vocabulary; 