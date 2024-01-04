import * as React from "react";
import { useState, useEffect, useRef, forwardRef, useContext, useMemo } from "react";
import "./homePage.scss";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import StepsBar from "../../../components/stepsBar/StepsBar";
import GrammarPractice from "../../../components/grammarPractice/GrammarPractice";
import { Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate, useLocation } from "react-router-dom";


const HomePage = () => {
    const [listening, setListening] = useState([]);
    const [reading, setReading] = useState([])
    const navigate = useNavigate();
    const getListening = async () => {
        try {
            const res = await publicRequest.get(`/listenings`);
            console.log('listenings:', res);
            setListening(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    };
    const getReading = async () => {
        try {
            const res = await publicRequest.get(`/readings`);
            console.log('reading:', res);
            setReading(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    };
    useEffect(() => {
        getListening();
        getReading();
    }, []);
    return (
        <div>
            <Topbar></Topbar>
            <TopMenu active={" "}></TopMenu>
            <div className="homePageContainer">
                <StepsBar />
                <div className="homePageContent">
                    <Card title="Các bài học cần hoàn thành" style={{ width: "65%", marginTop: 20, marginRight: 30 }}>
                        <p style={{ paddingBottom: 20 }}>Bạn đang làm rất tốt, cố gắng hoàn thành bài tập chúng tôi đề xuất nhé</p>
                        <GrammarPractice data={listening} partName="Listening" type="listening" passPercent={60} status="success" />
                        <GrammarPractice data={reading} partName="Reading" type="reading" passPercent={60} status="success" />

                    </Card>
                    <Card title="Bao Hieu" extra={<UserOutlined />} style={{ width: "35%", marginTop: 20 }} >
                        <div className="text-content" style={{ backgroundColor: "#f1f2f4", borderRadius: 15, padding: 15 }}>
                            <p>I can accept failure, everyone fails at something. But I can’t accept not trying.</p
                            ><p>Tôi có thể chấp nhận thất bại, mọi người đều thất bại ở một việc gì đó. Nhưng tôi không chấp nhận việc không cố gắng.</p>
                            <p className="text-right">– Michael Jordan</p>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default HomePage; 