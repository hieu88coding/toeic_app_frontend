import * as React from "react";
import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./resultPage.scss";
import { Divider, Card, Tooltip, Row, Col, Table, Button } from "antd";
import { CloseOutlined, CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const columns = [
    {
        title: 'Câu',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
        title: 'Chọn',
        dataIndex: 'userAnswer',
        key: 'userAnswer',
        render: (text, record) => {
            const isMatch = text === record.answer;
            const color = isMatch ? 'green' : 'red';
            return <span style={{ color, fontWeight: 'bold' }}>{text}</span>;
        },
    },
    {
        title: 'Key',
        dataIndex: 'answer',
        key: 'answer',
        render: (text) => <span style={{ fontWeight: 'bold', color: 'green' }}>{text}</span>,
    },
];





const ResultPage = () => {
    const storedData = localStorage.getItem('userExamResult');
    const data = storedData ? JSON.parse(storedData) : null;
    const [listening, setListening] = useState([]);
    const [reading, setReading] = useState([]);
    const [score, setScore] = useState(0);
    const testCode = useLocation().pathname.split("/")[2];
    const partName = useLocation().pathname.split("/")[3];
    const compareAnswers = (answers1, answers2, start, end) => {
        console.log(answers2);
        let correctCount = 0;
        let wrongCount = 0;

        for (let i = start; i <= end; i++) {
            const key = i.toString();
            if (answers1[key] === answers2[key]) {
                correctCount++;
            } else if (answers2[key] !== undefined) {
                wrongCount++;
            } else {
                continue;
            }

        }
        if (start === 1) {
            const score = calculateListeningScore(correctCount);
            setScore((prevState) => (
                prevState + score
            ))
            setListening({
                rightAnswer: correctCount,
                wrongAnswer: wrongCount
            })
        } else {
            const score = calculateReadingScore(correctCount);
            setScore((prevState) => (
                prevState + score
            ))
            setReading({
                rightAnswer: correctCount,
                wrongAnswer: wrongCount
            })
        }
    }
    const calculateListeningScore = (correctAnswers) => {
        if (correctAnswers >= 93) {
            return 495; // Điểm tối đa nếu đạt từ 93 đến 100 câu đúng
        } else if ([31, 39, 45, 54, 58, 70, 75, 80, 85, 88].includes(correctAnswers)) {
            return 10 * correctAnswers; // Cộng 10 điểm cho các mốc số câu đúng 31, 39, 45, 54, 58, 70, 75, 80, 85, 88
        } else if (correctAnswers >= 7) {
            return Math.min(correctAnswers * 5, 495); // Cộng 5 điểm cho mỗi câu đúng, tối đa là 495
        } else if (correctAnswers === 0) {
            return 0;
        } else {
            return 5;
        }
    }
    const calculateReadingScore = (correctAnswers) => {
        if (correctAnswers >= 97) {
            return 495;
        } else if ([25, 28, 39, 43, 47, 52, 55, 64, 92, 94].includes(correctAnswers)) {
            return 10 * correctAnswers;
        } else if (correctAnswers >= 10) {
            return Math.min(correctAnswers * 5, 495); // Cộng 5 điểm cho mỗi câu đúng, tối đa là 495
        } else if (correctAnswers === 0) {
            return 0;
        } else {
            return 5;
        }
    }
    const handleSaveResult = () => {
        localStorage.removeItem('userExamResult');
    }
    const generateTableData = (userAnswer, answer, startQuestion, endQuestion) => {
        const dataTable = [];

        for (let i = startQuestion; i <= endQuestion; i++) {
            const dataRow = {
                key: i.toString(),
                name: i.toString(),
                userAnswer: userAnswer[i],
                answer: answer[i],
            };

            dataTable.push(dataRow);
        }

        return dataTable;
    };
    const handleOpenTest = () => {
        window.open(data.pdf, '_blank');
    }
    useEffect(() => {
        compareAnswers(data.rightAnswer, data.userAnswer, 1, 100);
        compareAnswers(data.rightAnswer, data.userAnswer, 101, 200);
    }, []);
    return (
        <div>
            <div className="resultPageContainer">
                <div className="examPageContainer" style={{ overflow: 'hidden' }}>
                    <Link to={'/mocks'} className="closeBtn">
                        <div >
                            <CloseOutlined style={{ paddingRight: 10 }} /> Đóng
                        </div>
                    </Link>

                    <div className="middleHeader">
                        <div className="middleTitle">ETS TOEIC {testCode} </div>
                    </div>

                    <Link onClick={handleSaveResult} to={'/result'} className="finish">
                        <div >
                            <CheckOutlined style={{ paddingRight: 10 }} />
                            Lưu kết quả
                        </div>
                    </Link>


                </div>

                <div className="mainResult">
                    <Card title={<div>
                        Test Result
                        <Button onClick={handleOpenTest} type="primary" style={{ marginLeft: '10px' }}>
                            Mở đề
                        </Button>
                    </div>} style={{ marginBottom: 20 }}>
                        <div className="resultTilte">
                            <div className="scoreReport">Score Report</div>
                            <div className="testName">
                                {testCode} <span style={(partName !== "0") ? { color: 'orange' } : { display: 'none' }}>(Part {partName} )</span>
                            </div>
                        </div>
                        <div className="mainContent">
                            <div className="row">
                                <div className="rowItems">
                                    <div className="rowCat">Test Date:</div>
                                    <div className="rowData">{new Date().toLocaleDateString()}</div>
                                </div>
                                <Divider />
                                <div className="rowItems">
                                    <div className="rowCat">By:</div>
                                    <div className="rowData">baohieu888@gmail.com</div>
                                </div>
                                <Divider />
                                <div className="rowItems">
                                    <div className="rowCat">Listening Section:</div>
                                    <div className="rowData">
                                        <span style={{ color: '#1e7e34' }}>
                                            <Tooltip color="#1e7e34" title="Số câu đúng">{String(listening?.rightAnswer)}/</Tooltip>
                                        </span>
                                        <span style={{ color: '#bd2130' }}>
                                            <Tooltip color="#bd2130" title="Số câu sai">{String(listening?.wrongAnswer)}</Tooltip>
                                        </span>
                                        /100
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="rowItems">
                                    <div className="rowCat">Reading Section:</div>
                                    <div className="rowData">
                                        <span style={{ color: '#1e7e34' }}>
                                            <Tooltip color="#1e7e34" title="Số câu đúng">{String(reading?.rightAnswer)}/</Tooltip>
                                        </span>
                                        <span style={{ color: '#bd2130' }}>
                                            <Tooltip color="#bd2130" title="Số câu sai">{String(reading?.wrongAnswer)}</Tooltip>
                                        </span>
                                        /100
                                    </div>
                                </div>
                                <Divider />
                                <div className="rowItems">
                                    <div className="rowCat">Total result:</div>
                                    <div className="rowData">
                                        <span style={{ color: '#1e7e34' }}>
                                            <Tooltip color="#1e7e34" title="Số câu đúng">{String(listening?.rightAnswer + reading?.rightAnswer)}/</Tooltip>
                                        </span>
                                        <span style={{ color: '#bd2130' }}>
                                            <Tooltip color="#bd2130" title="Số câu sai">{String(listening?.wrongAnswer + reading?.wrongAnswer)}</Tooltip>
                                        </span>
                                        /200
                                    </div>
                                </div>
                                <Divider />
                                <div className="rowItems">
                                    <div className="rowCat">Final Score:</div>
                                    <div className="rowData">
                                        <div style={{ width: '25px', textAlign: 'center', border: '1px solid #0078eb', padding: '5px', borderRadius: '50px' }}>
                                            {String(score)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Card>
                    <Card title={"Listening"} style={{ marginBottom: 20 }}>
                        <Row
                            gutter={[24, 24]}
                        >
                            <Col className="gutter-row" span={4}>
                                <Table columns={columns} dataSource={generateTableData(data.userAnswer, data.rightAnswer, 1, 17)} pagination={false} />
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Table columns={columns} dataSource={generateTableData(data.userAnswer, data.rightAnswer, 18, 34)} pagination={false} />
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Table columns={columns} dataSource={generateTableData(data.userAnswer, data.rightAnswer, 35, 51)} pagination={false} />
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Table columns={columns} dataSource={generateTableData(data.userAnswer, data.rightAnswer, 52, 68)} pagination={false} />
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Table columns={columns} dataSource={generateTableData(data.userAnswer, data.rightAnswer, 69, 85)} pagination={false} />
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Table columns={columns} dataSource={generateTableData(data.userAnswer, data.rightAnswer, 86, 100)} pagination={false} />
                            </Col>
                        </Row>
                    </Card>
                    <Card title={"Reading"}>
                        <Row
                            gutter={[24, 24]}
                        >
                            <Col className="gutter-row" span={4}>
                                <Table columns={columns} dataSource={generateTableData(data.userAnswer, data.rightAnswer, 101, 117)} pagination={false} />
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Table columns={columns} dataSource={generateTableData(data.userAnswer, data.rightAnswer, 118, 134)} pagination={false} />
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Table columns={columns} dataSource={generateTableData(data.userAnswer, data.rightAnswer, 135, 151)} pagination={false} />
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Table columns={columns} dataSource={generateTableData(data.userAnswer, data.rightAnswer, 152, 168)} pagination={false} />
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Table columns={columns} dataSource={generateTableData(data.userAnswer, data.rightAnswer, 169, 185)} pagination={false} />
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Table columns={columns} dataSource={generateTableData(data.userAnswer, data.rightAnswer, 186, 200)} pagination={false} />
                            </Col>
                        </Row>
                    </Card>
                </div>




            </div>
        </div>
    );
};

export default ResultPage; 