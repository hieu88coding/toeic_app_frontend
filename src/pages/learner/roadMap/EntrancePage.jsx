import * as React from "react";
import { useState, useEffect, useRef, forwardRef, useContext, useMemo } from "react";

import { Card, Steps, Button } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate, useLocation } from "react-router-dom";
import EntryImage from '../../../assets/learning-path-entry-test.png'

const EntrancePage = (props) => {
    const [listening, setListening] = useState([]);
    const [reading, setReading] = useState([]);
    const [next, setNext] = useState(false);
    const [selected, setSelected] = useState(0);
    const navigate = useNavigate();

    const handleNextClick = (value) => {
        props.handleEntranceClick(value)
    }

    return (

        <div>
            <div className="entrancePageContainer">
                <div className="entrancePageContent">
                    <Card style={{ width: '70%', marginLeft: 'auto', marginRight: 'auto', marginTop: '50px', marginBottom: 50 }} title={null}>
                        <div className="levelSelectorTitle" style={{ margin: '0 auto', textAlign: 'center', marginTop: 50, fontSize: 25 }}>
                            <div style={{ fontWeight: 700, marginBottom: 50 }}>Kiểm tra đầu vào</div>
                            <img style={{ marginBottom: 50 }} src={EntryImage} />
                            <div style={{ width: 400, margin: '0 auto', fontSize: 20, fontWeight: 600 }}>Đánh giá chính xác trình độ TOEIC của bạn với bài kiểm tra thử theo format TOEIC để cá nhân hóa lộ trình học tập</div>
                            <div style={{ width: 400, marginRight: 'auto', marginLeft: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 50 }}>
                                <Button onClick={() => handleNextClick(1)} size="large" >Thiết lập lộ trình hiện tại</Button>
                                <Button onClick={() => navigate('/entrance/EntranceTest')} size="large" style={{ marginBottom: 20 }} type="primary">Bắt đầu kiểm tra</Button>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default EntrancePage; 