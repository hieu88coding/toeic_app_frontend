import { useState } from "react";
import "./LevelContent.scss";
import { Card, Tooltip, Progress, Button } from "antd";
import { UserOutlined, PushpinOutlined } from "@ant-design/icons";



const LevelContent = (props) => {
    const [percent, setPercent] = useState(50);
    return (
        <div className="levelContentContainer">
            <Card title={props.partNumber}>
                <div className="levelContentItems">
                    <UserOutlined style={{ width: "10%" }} />
                    <div className="questionInfo">
                        <div>Số câu yêu cầu: 40</div>
                        <div>Số câu đã làm: 0</div>
                        <div>Làm đúng: 0</div>
                        <div>Làm sai: 0</div>
                    </div>
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

                    <div className="practiceBtn">
                        <Button type="primary" size={"large"}>
                            Primary
                        </Button>
                    </div>
                </div>
            </Card>
        </div >
    );
};

export default LevelContent;