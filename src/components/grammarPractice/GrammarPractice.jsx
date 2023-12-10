import { useState } from "react";
import "./grammarPractice.scss";
import { Card, Tooltip, Progress, Button } from "antd";
import { UserOutlined, CheckCircleOutlined, CloseCircleOutlined, NumberOutlined } from "@ant-design/icons";



const GrammarPractice = (props) => {
    const [percent, setPercent] = useState(50);
    return (
        <div className="grammarPracticeContainer" style={{ marginTop: 20 }}>
            <Card title="Ngữ pháp">
                <div className="grammarPracticeItems">
                    <div className="grammarHeader">
                        <UserOutlined style={{ width: "10%" }} />
                        <div className="questionInfo">
                            <div>Số bài yêu cầu: 3</div>
                            <div>Số bài đã làm: 0</div>
                        </div>
                    </div>
                    <div className="practiceContainer">
                        <NumberOutlined style={{ width: "10%" }} />
                        <div className="practiceContent">
                            <div className="practiceTitle">Câu bị động</div>
                            <div className="practiceLevel">500</div>
                        </div>
                        <Tooltip title={props.status === "success" ? "Đã hoàn thành" : "Chưa hoàn thành"}>
                            <div className="practiceStatus">
                                {props.status === "success" ?
                                    <CheckCircleOutlined style={{ color: "green" }} /> : <CloseCircleOutlined style={{ color: "red" }} />}
                            </div>
                        </Tooltip>
                    </div>
                    <div className="practiceContainer">
                        <NumberOutlined style={{ width: "10%" }} />
                        <div className="practiceContent">
                            <div className="practiceTitle">Câu bị động</div>
                            <div className="practiceLevel">500</div>
                        </div>
                        <Tooltip title={props.status === "success" ? "Đã hoàn thành" : "Chưa hoàn thành"}>
                            <div className="practiceStatus">
                                {props.status === "success" ?
                                    <CheckCircleOutlined style={{ color: "green" }} /> : <CloseCircleOutlined style={{ color: "red" }} />}
                            </div>
                        </Tooltip>
                    </div>
                    <div className="practiceContainer">
                        <NumberOutlined style={{ width: "10%" }} />
                        <div className="practiceContent">
                            <div className="practiceTitle">Câu bị động</div>
                            <div className="practiceLevel">500</div>
                        </div>
                        <Tooltip title={props.status === "success" ? "Đã hoàn thành" : "Chưa hoàn thành"}>
                            <div className="practiceStatus">
                                {props.status === "success" ?
                                    <CheckCircleOutlined style={{ color: "green" }} /> : <CloseCircleOutlined style={{ color: "red" }} />}
                            </div>
                        </Tooltip>
                    </div>
                </div>
            </Card>
        </div >
    );
};

export default GrammarPractice;