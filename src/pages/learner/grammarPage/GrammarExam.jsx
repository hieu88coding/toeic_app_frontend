import * as React from "react";
import { useState, useEffect } from "react";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import { Card, Button, Progress, Divider, Modal } from "antd";
import { CloseOutlined, SoundOutlined, CloseCircleTwoTone, CheckCircleTwoTone } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    ref,
    getDownloadURL,
    listAll,
} from "firebase/storage";
import { storage } from '../../../firebase';
import axios from "axios";
import * as XLSX from "xlsx";
const GrammarExam = () => {
    const [stats, setStats] = useState([]);
    const [wordSelected, setWordSelected] = useState(0);
    const [data, setData] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState('')
    const [checkState, setCheckState] = useState({
        status: null,
        checked: false,
    });
    const navigate = useNavigate();
    const testCode = decodeURIComponent(useLocation().pathname.split("/")[2]);
    const [checkIndex, setCheckIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        navigate('/grammars')
    };
    const handleCancel = () => {
        navigate('/grammars')
    };
    const fetchData = async () => {
        let exelRefs = await listAll(ref(storage, `Grammars/exel/${testCode}`));
        let exelUrls = await Promise.all(
            exelRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let answerRefs = await listAll(ref(storage, `Grammars/json/${testCode}`));
        let answerUrls = await Promise.all(
            answerRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let temp1 = [];
        let temp2 = [];
        if (exelUrls.length !== 0) {
            try {
                const response = await axios.get(`${exelUrls}`, {
                    responseType: 'arraybuffer',
                });
                const data = new Uint8Array(response.data);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                let formattedData = [];
                formattedData = jsonData.slice(1).map((item, index) => ({
                    key: String(index + 1),
                    number: item[0],
                    question: item[1],
                    answerA: item[2],
                    answerB: item[3],
                    answerC: item[4],
                    answerD: item[5],
                }));
                temp1.push(formattedData);
            } catch (error) {
                console.error('Error fetching Excel data:', error);
            }
        }
        if (answerUrls.length !== 0) {
            try {
                const response = await axios.get(`${answerUrls}`, {
                    responseType: 'arraybuffer',
                });
                const data = new Uint8Array(response.data);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                let formattedData2 = [];
                formattedData2 = jsonData.slice(1).map((item, index) => ({
                    key: String(index + 1),
                    number: item[0],
                    correctAnswer: item[1],
                    explanation: item[2],
                }));
                temp2.push(formattedData2);
            } catch (error) {
                console.error('Error fetching Excel data:', error);
            }
        }
        console.log(temp1);
        console.log(temp2);
        setData({
            exel: temp1,
            answer: temp2,
        });


    };
    useEffect(() => {
        fetchData();
        console.log(data);
    }, []);


    const handleCheckWord = () => {
        const letter = data.answer[0][wordSelected].correctAnswer.charAt(0);
        if (letter === selectedAnswer) {
            setCheckState({
                status: true,
                checked: true,
            });
        } else {
            setCheckState({
                status: false,
                checked: true,
            });
        }
    }
    const handleRedo = () => {
        setSelectedAnswer('');
        setCheckState({
            status: null,
            checked: false,
        });
    }
    const handleSkip = () => {
        setSelectedAnswer('');
        setCheckState({
            status: null,
            checked: false,
        });
        if (wordSelected === data.exel[0].length - 1) {
            showModal();
        } else {
            setWordSelected((prevState) => (
                prevState + 1
            ))
        }
    }

    const handleContinue = () => {
        setSelectedAnswer('');
        setCheckState({
            status: null,
            checked: false,
        });
        if (wordSelected === data.exel[0].length - 1) {
            showModal();
        } else {
            setWordSelected((prevState) => (
                prevState + 1
            ))
        }
    }
    return (
        <div>
            <Modal title="Thông báo" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Chúc mừng bạn đã hoàn thành luyện tập !!</p>
            </Modal>
            <div className="vocabPageContainer" style={{ marginBottom: 50 }}>
                <Link to={'/grammars'} className="closeBtn">
                    <div >
                        <CloseOutlined style={{ paddingRight: 10 }} /> Đóng
                    </div>
                </Link>

                <div className="middleHeader">
                    <div className="middleTitle">Luyện tập ngữ pháp: {testCode}</div>
                </div>



            </div>
            {data && data.length !== 0 &&
                <div className="grammarExamContent">
                    <Card style={{ width: '70%', marginBottom: 50, marginLeft: 'auto', marginRight: 'auto' }} hoverable={true} title={"Ôn tập"}>
                        <Progress percent={Math.round(wordSelected / data.exel[0].length * 100)} />
                        <div className="vocabularyItem" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 50, marginTop: 20 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: 'fit-content', margin: '0 auto' }}>
                                <div className="vocabCard">
                                    <div style={{ fontSize: 18, fontWeight: '500' }}>Câu hỏi {wordSelected + 1}:</div>
                                    <div style={{ fontSize: 18, fontWeight: '500' }} dangerouslySetInnerHTML={{ __html: `${data.exel[0][wordSelected].question}` }}></div>
                                </div>

                            </div>
                        </div>
                        <div className="vocabularyKey" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', fontWeight: 500, justifyContent: 'space-around' }}>
                                <Card style={{ width: 200, backgroundColor: checkState.checked ? (selectedAnswer === 'A' ? (checkState.status === false ? '#ff4d4f' : '#52c41a') : '') : (selectedAnswer === 'A' ? '#1677ff' : ''), color: selectedAnswer === 'A' ? 'white' : '' }} onClick={() => setSelectedAnswer('A')} hoverable title={null}>{data.exel[0][wordSelected].answerA}</Card>
                                <Card style={{ width: 200, backgroundColor: checkState.checked ? (selectedAnswer === 'B' ? (checkState.status === false ? '#ff4d4f' : '#52c41a') : '') : (selectedAnswer === 'B' ? '#1677ff' : ''), color: selectedAnswer === 'B' ? 'white' : '' }} onClick={() => setSelectedAnswer('B')} hoverable title={null}>{data.exel[0][wordSelected].answerB}</Card>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'row', fontWeight: 500, justifyContent: 'space-around', marginTop: 30 }}>
                                <Card style={{ width: 200, backgroundColor: checkState.checked ? (selectedAnswer === 'C' ? (checkState.status === false ? '#ff4d4f' : '#52c41a') : '') : (selectedAnswer === 'C' ? '#1677ff' : ''), color: selectedAnswer === 'C' ? 'white' : '' }} onClick={() => setSelectedAnswer('C')} hoverable title={null}>{data.exel[0][wordSelected].answerC}</Card>
                                <Card style={{ width: 200, backgroundColor: checkState.checked ? (selectedAnswer === 'D' ? (checkState.status === false ? '#ff4d4f' : '#52c41a') : '') : (selectedAnswer === 'D' ? '#1677ff' : ''), color: selectedAnswer === 'D' ? 'white' : '' }} onClick={() => setSelectedAnswer('D')} hoverable title={null}>{data.exel[0][wordSelected].answerD}</Card>
                            </div>

                            {checkState.checked === true && checkState.status === true &&
                                <div style={{ marginTop: 30 }}>
                                    <div style={{ fontSize: 20, color: '#52c41a', fontWeight: 700 }}>Giải thích: </div>
                                    <div style={{ fontSize: 18, fontStyle: 'italic', color: '#52c41a', fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: `${data.answer[0][wordSelected].explanation}` }}></div>
                                </div>
                            }
                            {checkState.status === null &&
                                <div style={{ marginTop: 30 }}>
                                </div>
                            }

                            {checkState.checked === false &&
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                                    <Button disabled={checkIndex === data.exel[0].length - 1 ? true : false} onClick={() => handleSkip()}>Bỏ qua</Button>
                                    <Button type="primary" disabled={selectedAnswer.length === 0 ? true : false} onClick={() => handleCheckWord()}>Kiểm tra</Button>
                                </div>
                            }

                            {
                                checkState.checked === true && checkState.status === true &&

                                <Card style={{ backgroundColor: '#95de64', marginTop: 30 }} title={null}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <div style={{ fontSize: 20, color: 'white', fontWeight: 500 }}><CheckCircleTwoTone twoToneColor="#52c41a" /> Chính xác</div>
                                        <Button onClick={() => handleContinue()}>Tiếp theo</Button>
                                    </div>
                                </Card>


                            }
                            {checkState.checked === true && checkState.status === false &&

                                <Card style={{ backgroundColor: '#ff4d4f', marginTop: 30 }} title={null}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <div style={{ fontSize: 20, color: 'white', fontWeight: 500 }}><CloseCircleTwoTone twoToneColor="#eb2f96" /> Chưa chính xác</div>
                                        <Button danger onClick={() => handleRedo()}>Làm lại</Button>
                                    </div>
                                </Card>
                            }






                        </div>
                    </Card>
                </div >
            }

        </div >
    );
};

export default GrammarExam; 