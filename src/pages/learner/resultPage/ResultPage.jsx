import * as React from "react";
import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./resultPage.scss";
import { Divider, Card, Tooltip, Row, Col, Table, Button } from "antd";
import { CloseOutlined, CheckCircleTwoTone, CloseCircleTwoTone, MinusCircleTwoTone, FireTwoTone, PushpinTwoTone, AudioTwoTone } from "@ant-design/icons";
import axios from "axios";
import * as XLSX from "xlsx";
import DetailPart from "./DetailPart";
import { useToastError, useToastSuccess } from "../../../utils/toastSettings";
import { publicRequest } from "../../../requestMethods";


const ResultPage = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'))
    const [data, setData] = useState([]);
    const [listening, setListening] = useState([]);
    const [reading, setReading] = useState([]);
    const [score, setScore] = useState(0);
    const testCode = useLocation().pathname.split("/")[2];
    const partName = useLocation().pathname.split("/")[3];
    const answers = useLocation().state?.submitData || [];
    const bruh = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' }
    const [detailResult, setDetailResult] = useState([]);
    const [currentPart, setCurrentPart] = useState('part1');
    const [savedScore, setSavedScore] = useState(0);
    const handlePartChange = (part) => {
        setCurrentPart(part);
    };

    const fetchData = async () => {
        let temp = [];
        if (answers.length !== 0) {
            try {
                const response = await axios.get(`${answers.testData.answer}`, {
                    responseType: 'arraybuffer',
                });
                const data = new Uint8Array(response.data);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                let formattedData = jsonData.slice(1).map((item, index) => ({
                    key: String(index + 1),
                    number: item[0],
                    correctAnswer: item[1],
                    explanation: item[2],
                    transcript: item[3],
                }));

                temp.push(formattedData);
            } catch (error) {
                console.error('Error fetching Excel data:', error);
            }

            setData({
                exel: answers.testData.exel,
                audio: answers.testData.audio,
                images: answers.testData.images,
                answer: temp
            });
        }

    };
    useEffect(() => {
        fetchData();
    }, []);
    const compareAnswers = (answers1, answers2, start, end) => {
        let correctCount = 0;
        let wrongCount = 0;
        let skip = 0;
        const temp = [];
        if (answers1.length !== 0 && answers2 !== undefined) {
            for (let i = start; i <= end; i++) {
                const key = (i + 1).toString();
                if (answers1[key] === answers2[0][i].correctAnswer[1]) {
                    correctCount++;
                    temp.push({
                        key: key,
                        result: 'true',
                        color: '#52c41a'
                    })
                } else if (answers1[key] !== undefined) {
                    wrongCount++;
                    temp.push({
                        key: key,
                        result: 'false',
                        color: '#e43a45'
                    })
                } else {
                    skip++;
                    temp.push({
                        key: key,
                        result: 'skip',
                        color: '#71869d'
                    })
                }
            }
            setDetailResult((prevState) => [...prevState, ...temp]);
            if (start === 0) {
                const score = calculateListeningScore(correctCount);
                setScore((prevState) => (
                    prevState + score
                ))
                setSavedScore((prevState) => (
                    prevState + 1
                ));
                setListening({
                    listeningScore: score,
                    rightAnswer: correctCount,
                    wrongAnswer: wrongCount,
                    skipAnswer: skip
                })
            } else {
                const score = calculateReadingScore(correctCount);
                setScore((prevState) => (
                    prevState + score
                ))
                setSavedScore((prevState) => (
                    prevState + 1
                ));
                setReading({
                    readingScore: score,
                    rightAnswer: correctCount,
                    wrongAnswer: wrongCount,
                    skipAnswer: skip
                })
            }
        } else {
            setListening({
                rightAnswer: 0,
                wrongAnswer: 0,
                skipAnswer: 100
            })
            setReading({
                rightAnswer: 0,
                wrongAnswer: 0,
                skipAnswer: 100
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
    const handleSaveResult = async () => {
        try {
            const res = await publicRequest.post(
                `/results/mocks`, {
                userId: user.id,
                testName: testCode,
                userAnswer: JSON.stringify(answers.userAnswer),
                score: score
            });
            if (res && res.status === 200) {
                console.log("Gét gô");
                useToastSuccess(res.message);
            } else {
                useToastError("Lưu lịch sử làm bài không thành công")

            }
        } catch (error) {
            useToastError("Lưu lịch sử làm bài không thành công")
            console.log(error);
        }
    }
    useEffect(() => {
        compareAnswers(answers.userAnswer, data.answer, 0, 99);
        compareAnswers(answers.userAnswer, data.answer, 100, 199);
    }, [data]);

    useEffect(() => {
        if (savedScore === 2 && user.length !== 0) {
            handleSaveResult();
        }

    }, [savedScore]);
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

                    {/* <Link onClick={handleSaveResult} to={'/result'} className="finish">
                        <div >
                            <CheckOutlined style={{ paddingRight: 10 }} />
                            Lưu kết quả
                        </div>
                    </Link> */}


                </div>

                <div className="mainResult">
                    <Card title={
                        "Test Result"
                    } style={{ marginBottom: 20 }}>
                        <div className="mainContent">
                            <div className="leftContent">
                                <Card hoverable title={null} style={{ border: '2px outset', backgroundColor: '#f8f9fa', marginBottom: 20, height: '47%' }}>
                                    <div className="row">
                                        <div className="rowItems">
                                            <div className="rowCat">Ngày làm: </div>
                                            <div className="rowData"> {new Date().toLocaleDateString()}</div>
                                        </div>

                                        <div className="rowItems">
                                            <div className="rowCat">Kết quả: </div>
                                            <div className="rowData"> {String(listening?.rightAnswer + reading?.rightAnswer)}/200</div>
                                        </div>

                                        <div className="rowItems">
                                            <div className="rowCat">Tỷ lệ chính xác: </div>
                                            <div className="rowData"> {String(parseFloat((listening?.rightAnswer + reading?.rightAnswer) / (listening?.rightAnswer + reading?.rightAnswer + listening?.wrongAnswer + reading?.wrongAnswer) * 100).toFixed(1))}%</div>
                                        </div>

                                    </div>
                                </Card>
                                <Card hoverable title={null} style={{ border: '2px outset', height: '47%' }}>
                                    <div className="cardContent">
                                        <FireTwoTone style={{ fontSize: 25, marginBottom: 10 }} twoToneColor="#ff9a00" />
                                        <div style={{ color: '#ff9a00', fontSize: 25 }}>Điểm</div>
                                        <div style={{ fontSize: 25 }}>{String(score)}</div>

                                    </div>

                                </Card>
                            </div>

                            <div className="rightContent">
                                <div className="upperContent">
                                    <Card hoverable title={null} style={{ border: '2px outset', width: '30%' }}>
                                        <div className="cardContent">
                                            <CheckCircleTwoTone style={{ fontSize: 20, marginBottom: 10 }} twoToneColor="#52c41a" />
                                            <div style={{ color: '#52c41a' }}>Trả lời đúng</div>
                                            <div>{String(listening?.rightAnswer + reading?.rightAnswer)}</div>
                                            <div>Câu hỏi</div>
                                        </div>

                                    </Card>
                                    <Card hoverable title={null} style={{ border: '2px outset', width: '30%' }}>
                                        <div className="cardContent">
                                            <CloseCircleTwoTone style={{ fontSize: 20, marginBottom: 10 }} twoToneColor="#e43a45" />
                                            <div style={{ color: '#e43a45' }}>Trả lời sai</div>
                                            <div>{String(listening?.wrongAnswer + reading?.wrongAnswer)}</div>
                                            <div>Câu hỏi</div>
                                        </div>

                                    </Card>
                                    <Card hoverable title={null} style={{ border: '2px outset', width: '30%' }}>
                                        <div className="cardContent">
                                            <MinusCircleTwoTone style={{ fontSize: 20, marginBottom: 10 }} twoToneColor="#71869d" />
                                            <div style={{ color: '#71869d' }}>Bỏ qua</div>
                                            <div>{String(listening?.skipAnswer + reading?.skipAnswer)}</div>
                                            <div>Câu hỏi</div>
                                        </div>

                                    </Card>

                                </div>
                                <div className="lowerContent">
                                    <Card hoverable title={null} style={{ border: '2px outset', width: '48%' }}>
                                        <div className="cardContent">
                                            <AudioTwoTone style={{ fontSize: 20, marginBottom: 10 }} twoToneColor="#007aff" />
                                            <div style={{ color: '#007aff' }}>Listening</div>
                                            <div>{String(listening?.listeningScore)}/495</div>
                                            <div>Trả lời đúng {String(listening?.rightAnswer)}/100</div>
                                        </div>

                                    </Card>
                                    <Card hoverable title={null} style={{ border: '2px outset', width: '48%' }}>
                                        <div className="cardContent">
                                            <PushpinTwoTone style={{ fontSize: 20, marginBottom: 10 }} twoToneColor="#007aff" />
                                            <div style={{ color: '#007aff' }}>Reading</div>
                                            <div>{String(reading?.readingScore)}/495</div>
                                            <div>Trả lời đúng {String(reading?.rightAnswer)}/100</div>
                                        </div>

                                    </Card>

                                </div>
                            </div>
                        </div>


                    </Card>
                    <Card title={"Phân tích chi tiết"}>
                        <div className="anchor" style={{ width: '100%', marginBottom: 20 }}>
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




                        <div id="scrollContent">
                            {data && detailResult && currentPart === 'part1' && <DetailPart data={data} result={detailResult} userAnswer={answers.userAnswer} start={0} end={6} part={'part1'} />}
                            {data && detailResult && currentPart === 'part2' && <DetailPart data={data} result={detailResult} userAnswer={answers.userAnswer} start={6} end={31} part={'part2'} />}
                            {data && detailResult && currentPart === 'part3' && <DetailPart data={data} result={detailResult} userAnswer={answers.userAnswer} start={31} end={70} part={'part3'} />}
                            {data && detailResult && currentPart === 'part4' && <DetailPart data={data} result={detailResult} userAnswer={answers.userAnswer} start={70} end={100} part={'part4'} />}
                            {data && detailResult && currentPart === 'part5' && <DetailPart data={data} result={detailResult} userAnswer={answers.userAnswer} start={100} end={130} part={'part5'} />}
                            {data && detailResult && currentPart === 'part6' && <DetailPart data={data} result={detailResult} userAnswer={answers.userAnswer} start={130} end={146} part={'part6'} />}
                            {data && detailResult && currentPart === 'part7' && <DetailPart data={data} result={detailResult} userAnswer={answers.userAnswer} start={146} end={200} part={'part7'} />}

                        </div>


                    </Card>
                </div>

            </div>
        </div>
    );
};

export default ResultPage; 