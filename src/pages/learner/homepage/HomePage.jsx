import * as React from "react";
import { useState } from "react";
import "./homePage.scss";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import StepsBar from "../../../components/stepsBar/StepsBar";
import LevelContent from "../../../components/levelContent/LevelContent";
import GrammarPractice from "../../../components/grammarPractice/GrammarPractice";
import { Card, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";


const HomePage = () => {
    const [current, setCurrent] = useState(0);
    const onChange = (value) => {
        console.log('onChange:', value);
        setCurrent(value);
    };
    const description = 'This is a description.';
    return (
        <div>
            <Topbar></Topbar>
            <TopMenu></TopMenu>
            <div className="homePageContainer">
                <StepsBar />
                <div className="homePageContent">
                    <Card title="Các bài học cần hoàn thành" style={{ width: "65%", marginTop: 20, marginRight: 30 }}>
                        <p style={{ paddingBottom: 20 }}>Bạn đang làm rất tốt, cố gắng hoàn thành bài tập chúng tôi đề xuất nhé</p>
                        <LevelContent passPercent={60} partNumber="Part 1" />
                        <LevelContent passPercent={40} partNumber="Part 2" />
                        <LevelContent passPercent={40} partNumber="Part 3" />
                        <LevelContent passPercent={60} partNumber="Part 4" />
                        <LevelContent passPercent={40} partNumber="Part 5" />
                        <LevelContent passPercent={60} partNumber="Part 6" />
                        <LevelContent passPercent={40} partNumber="Part 7" />
                        <GrammarPractice status="success" />
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