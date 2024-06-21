import * as React from "react";
import { useState, useEffect, useRef, forwardRef, createRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./examSheet.scss";
import { Anchor, Card, Button } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";
import Scrollbar from "react-perfect-scrollbar";
import axios from "axios";

import { Table } from "antd";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { storage } from '../../firebase';
import { Part1 } from "../examParts/Part1";
import { Part2 } from "../examParts/Part2";
import { Part3 } from "../examParts/Part3";
import { Part4 } from "../examParts/Part4";
import { Part5 } from "../examParts/Part5";
import { Part6 } from "../examParts/Part6";
import { Part7 } from "../examParts/Part7";

const ExamSheet = (props) => {
    const [currentPart, setCurrentPart] = useState('part1');
    const data = props.data;
    const partName = useLocation().pathname.split("/")[3];



    const handlePartChange = (part) => {
        setCurrentPart(part);
    };

    const handleNextPart = () => {
        if (currentPart !== 'part7') {
            const lastChar = currentPart.charAt(currentPart.length - 1);
            const intValue = parseInt(lastChar) + 1;
            setCurrentPart(`part${intValue}`)
        }
    }


    const handleAnchorClick = (e, link) => {
        e.stopPropagation();
    };

    const columns = [
        {
            title: 'Số thứ tự',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Câu hỏi',
            dataIndex: 'question',
            key: 'question',
        },
        {
            title: 'Đáp án A',
            dataIndex: 'answerA',
            key: 'answerA',
        },
        {
            title: 'Đáp án B',
            dataIndex: 'answerB',
            key: 'answerB',
        },
        {
            title: 'Đáp án C',
            dataIndex: 'answerC',
            key: 'answerC',
        },
        {
            title: 'Đáp án D',
            dataIndex: 'answerD',
            key: 'answerD',
        },
    ];

    return (
        <div>
            <div className="examSheetContainer" style={props.typeSheet === "exam" ? {} : { marginTop: 40 }}>
                {props.typeSheet === "exam" &&
                    <div className="anchor" style={{ width: '100%' }}>
                        <Button onClick={() => handlePartChange('part1')} type={currentPart === 'part1' ? "primary" : "default"} size="large" style={{ marginRight: 20 }}>
                            Part 1
                        </Button>
                        <Button onClick={() => handlePartChange('part2')} type={currentPart === 'part2' ? "primary" : "default"} size="large" style={{ marginRight: 20 }}>
                            Part 2
                        </Button>
                        <Button onClick={() => handlePartChange('part3')} type={currentPart === 'part3' ? "primary" : "default"} size="large" style={{ marginRight: 20 }}>
                            Part 3
                        </Button>
                        <Button onClick={() => handlePartChange('part4')} type={currentPart === 'part4' ? "primary" : "default"} size="large" style={{ marginRight: 20 }}>
                            Part 4
                        </Button>
                        <Button onClick={() => handlePartChange('part5')} type={currentPart === 'part5' ? "primary" : "default"} size="large" style={{ marginRight: 20 }}>
                            Part 5
                        </Button>
                        <Button onClick={() => handlePartChange('part6')} type={currentPart === 'part6' ? "primary" : "default"} size="large" style={{ marginRight: 20 }}>
                            Part 6
                        </Button>
                        <Button onClick={() => handlePartChange('part7')} type={currentPart === 'part7' ? "primary" : "default"} size="large" style={{ marginRight: 20 }}>
                            Part 7
                        </Button>
                    </div>
                }

                <Card title={null}>
                    <Scrollbar options={{
                        suppressScrollX: true
                    }} style={{ maxHeight: 560 }}>
                        <div id="scrollContent">
                            {data && currentPart === 'part1' && <Part1 audio={data.audio} images={data.images} />}
                            {data && currentPart === 'part2' && <Part2 isPart={false} audio={data.audio} />}
                            {data && currentPart === 'part3' && <Part3 isPart={false} audio={data.audio} images={data.images} exel={data.exel[0]} />}
                            {data && currentPart === 'part4' && <Part4 isPart={false} audio={data.audio} images={data.images} exel={data.exel[1]} />}
                            {data && currentPart === 'part5' && <Part5 exel={data.exel[2]} />}
                            {data && currentPart === 'part6' && <Part6 exel={data.exel[3]} />}
                            {data && currentPart === 'part7' && <Part7 exel={data.exel[4]} />}
                        </div>
                    </Scrollbar>
                </Card>
                <div style={{ display: currentPart === 'part7' ? 'none' : 'flex', justifyContent: `flex-end` }}>
                    <Button icon={<DoubleRightOutlined />} onClick={() => handleNextPart()} type="primary" size="large" style={{ marginTop: 10, marginBottom: 50 }}>
                        Next Part
                    </Button>
                </div>


            </div>
        </div>
    );
};

export default ExamSheet; 