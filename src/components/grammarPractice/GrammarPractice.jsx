import { useState } from "react";
import "./grammarPractice.scss";
import { Card, Tooltip, Progress, Button } from "antd";
import { UserOutlined, CheckCircleOutlined, CloseCircleOutlined, NumberOutlined, PushpinOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";



const GrammarPractice = (props) => {
    const [percent, setPercent] = useState(50);
    const navigate = useNavigate();
    const handlePractice = (testName, level) => {
        return () => {
            navigate(`/${props.type}/${testName}/${level}`);
        };
    }
    return (
        <div className="grammarPracticeContainer" style={{ marginTop: 20 }}>
            <Card title={props.partName}>
                <div className="grammarPracticeItems">
                    <div className="grammarHeader">
                        <UserOutlined style={{ width: "10%" }} />
                        <div className="progress">
                            <div className="progressPin" style={{ left: `${props.passPercent}%` }}>
                                <Tooltip title={`Tối thiểu cần hoàn thành ${props.passPercent}%`}>
                                    <PushpinOutlined />
                                </Tooltip>
                            </div>
                            <Tooltip title={`Thành tích tốt nhất: ${percent}%`}>
                                <Progress percent={percent} status={percent >= props.passPercent ? "success" : "exception"}>

                                </Progress>
                            </Tooltip>
                        </div>
                    </div>
                    {props.data && props.data.map((stats) => (
                        <div key={stats?.testName} onClick={handlePractice(stats?.testName, stats?.level)} className="practiceContainer">
                            <NumberOutlined style={{ width: "10%" }} />
                            <div className="practiceContent">
                                <div style={{ fontWeight: 'bold' }} className="practiceTitle">{stats?.testName}</div>
                                <div className="practiceLevel">{stats?.level}</div>
                            </div>
                            <Tooltip title={props.status === "success" ? "Đã hoàn thành" : "Chưa hoàn thành"}>
                                <div className="practiceStatus">
                                    {props.status === "success" ?
                                        <CheckCircleOutlined style={{ color: "green" }} /> : <CloseCircleOutlined style={{ color: "red" }} />}
                                </div>
                            </Tooltip>
                        </div>
                    ))}

                </div>
            </Card>
        </div >
    );
};

export default GrammarPractice;