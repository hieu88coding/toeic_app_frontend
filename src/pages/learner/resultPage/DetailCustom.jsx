import * as React from "react";
import { useState, useEffect, useRef, forwardRef, createRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Anchor, Card, Button, Table } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";
import Scrollbar from "react-perfect-scrollbar";
import axios from "axios";
import PartDetailModal from "./PartDetailModal";


const DetailCustom = (props) => {
    const data = props.data;
    console.log(props.data);
    const result = props.result;
    const start = props.start;
    const end = props.end;
    let rightCount = 0;
    let wrongCount = 0;
    let skip = 0;
    const [open, setOpen] = useState(false);
    const [questionNumber, setQuestionNumber] = useState(1);
    const showModal = () => {
        setOpen(true);
    };
    const hideModal = () => {
        setOpen(false);
    };
    if (result.length !== 0) {
        for (let i = start; i < end; i++) {
            if (result[i].result !== 'true' && result[i].result !== 'skip') {
                wrongCount++;
            } else if (result[i].result !== 'skip' && result[i].result !== 'wrong') {
                rightCount++;
            } else {
                skip++;
            }
        }
    }

    const handleQuestionSelect = (index) => {
        console.log(index);
        setQuestionNumber(index);
        showModal();
    }
    const dataSource = [
        {
            key: '1',
            rightCount: rightCount,
            wrongCount: wrongCount,
            skip: skip,
            rate: `${parseFloat((rightCount / (rightCount + wrongCount)) * 100).toFixed(1)}%`,
            listQ: props.result.slice(start, end)
        }
    ]

    const columns = [
        {
            title: 'Số câu đúng',
            dataIndex: 'rightCount',
            key: 'rightCount',
        },
        {
            title: 'Số câu sai',
            dataIndex: 'wrongCount',
            key: 'wrongCount',
        },
        {
            title: 'Số câu bỏ qua',
            dataIndex: 'skip',
            key: 'skip',
        },
        {
            title: 'Tỷ lệ chính xác',
            dataIndex: 'rate',
            key: 'rate',
        },
        {
            title: 'Danh sách câu hỏi',
            dataIndex: 'listQ',
            key: 'listQ',
            render: (result) => {
                return (
                    <div>
                        {result.map((resultExam, index) => (
                            <Button onClick={() => handleQuestionSelect(resultExam.key)}
                                key={index} shape="circle"
                                style={{ marginRight: 10, marginBottom: 10, borderColor: resultExam.color, color: resultExam.color }}
                            >{resultExam.key}</Button>
                        ))}
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <div className="detailCustomContainer">
                <div className="anchor" style={{ width: '100%' }}>
                    <Table pagination={false} dataSource={dataSource} columns={columns} />
                    <PartDetailModal open={open} hideModal={hideModal} data={data} questionNumber={questionNumber} part={props.part} userAnswer={props.userAnswer} result={result} />
                </div>

            </div>
        </div>
    );
};

export default DetailCustom; 