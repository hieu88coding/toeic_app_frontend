import * as React from "react";
import { useState, useEffect } from "react";
//import "./ReviewVocabulary.scss";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import { Card, Button, Progress, Divider, Modal } from "antd";
import { CloseOutlined, SoundOutlined, CloseCircleTwoTone, CheckCircleTwoTone } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { fontSize } from "@mui/system";

const ReviewVocabulary = () => {
    const [wordSelected, setWordSelected] = useState([]);
    const [stats, setStats] = useState([]);
    const [keyMix, setKeyMix] = useState([]);
    const wordList = useLocation().state?.wordList || [];
    console.log(wordList);
    const navigate = useNavigate();
    const testCode = decodeURIComponent(useLocation().pathname.split("/")[3]);
    const [score, setScore] = useState();
    const [checkState, setCheckState] = useState({
        status: null,
        checked: false,
    });
    const [checkIndex, setCheckIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        navigate('/vocabulary')
    };
    const handleCancel = () => {
        navigate('/vocabulary')
    };
    const handleNewChar = (char) => {
        const index = keyMix.indexOf(char);
        if (index !== -1) {
            const updatedArray = [...keyMix];
            updatedArray.splice(index, 1);
            setKeyMix(updatedArray);
        }
        setStats((prevSelectedLetters) => [...prevSelectedLetters, char]);
    }

    const handleDeleteChar = (char) => {
        const index = stats.indexOf(char);
        if (index !== -1) {
            const updatedArray = [...stats];
            updatedArray.splice(index, 1);
            setStats(updatedArray);
        }
        setKeyMix((prevSelectedLetters) => [...prevSelectedLetters, char]);
    }

    const handleCheckWord = () => {
        const newStr = stats.join("");
        const trimmedWord = wordSelected.word.replace(/ *\([^)]*\) */g, "");
        if (newStr === trimmedWord) {
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
    const handleMix = () => {
        const trimmedWord = wordSelected.word.replace(/ *\([^)]*\) */g, "");
        const charArray = trimmedWord.split("");
        charArray.sort(() => Math.random() - 0.5);
        console.log(charArray);
        setKeyMix(charArray);
    }

    const handleRedo = () => {
        setCheckState({
            status: null,
            checked: false,
        });
    }
    const handleSkip = () => {
        setCheckState({
            status: null,
            checked: false,
        });
        setStats([]);
        if (checkIndex === wordList.exel[0].length - 1) {
            showModal();
        } else {
            setCheckIndex((prevState) => (
                prevState + 1
            ))
        }

    }

    const handleContinue = () => {
        setCheckState({
            status: null,
            checked: false,
        });
        setStats([]);
        if (checkIndex === wordList.exel[0].length - 1) {
            showModal();
        } else {
            setCheckIndex((prevState) => (
                prevState + 1
            ))
        }
    }

    useEffect(() => {
        if (wordList.exel[0].length !== 0) {
            setWordSelected(wordList.exel[0][0]);
        }

    }, []);
    useEffect(() => {
        if (wordSelected.length !== 0) {
            handleMix();
        }

    }, [wordSelected]);
    useEffect(() => {
        setWordSelected(wordList.exel[0][checkIndex]);

    }, [checkIndex]);
    const handleSound = (type, text) => {
        const trimmedWord = text.replace(/ *\([^)]*\) */g, "");
        const utterance = new SpeechSynthesisUtterance(trimmedWord);
        const voices = window.speechSynthesis.getVoices();

        const usVoice = voices.find((voice) => voice.lang === type);
        if (usVoice) {
            utterance.voice = usVoice;
        }
        window.speechSynthesis.speak(utterance);
    }
    return (
        <div>
            <Modal title="Thông báo" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Chúc mừng bạn đã hoàn thành luyện tập !!</p>
            </Modal>
            <div className="vocabPageContainer" style={{ marginBottom: 50 }}>
                <Link to={'/vocabulary'} className="closeBtn">
                    <div >
                        <CloseOutlined style={{ paddingRight: 10 }} /> Đóng
                    </div>
                </Link>

                <div className="middleHeader">
                    <div className="middleTitle">Từ vựng theo chủ đề: {testCode}</div>
                </div>



            </div>
            <div className="reviewVocabularyContent">
                <Card style={{ width: '70%', marginBottom: 50, marginLeft: 'auto', marginRight: 'auto' }} hoverable={true} title={"Ôn tập"}>
                    <Progress percent={Math.round(checkIndex / wordList.exel[0].length * 100)} />
                    <div className="vocabularyItem" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 50, marginTop: 20 }}>
                        <img style={{ width: '30%' }} src={wordList.images[checkIndex]} />
                        <div style={{ display: 'flex', flexDirection: 'column', width: '60%' }}>
                            <div className="vocabCard">
                                <div style={{ fontSize: 18, fontWeight: '500' }}>Định nghĩa: <span>{wordList.exel[0][checkIndex].meaning}</span></div>
                                {checkState.status === true &&
                                    <div style={{ fontStyle: 'italic', color: '#52c41a', fontSize: 18, fontWeight: '500' }}>Đáp án: <span>{wordList.exel[0][checkIndex].word} ({wordList.exel[0][checkIndex].transcribe})</span></div>

                                }
                                {checkState.status === true &&
                                    <div className="sound" style={{ display: 'flex', flexDirection: 'row', marginBottom: 20 }}>
                                        <div style={{ fontSize: 20, marginRight: 20, fontWeight: 'bold' }}>
                                            <SoundOutlined onClick={() => handleSound('en-US', wordList.exel[0][checkIndex].word)} /> <span>US</span>
                                        </div>
                                        <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                                            <SoundOutlined onClick={() => handleSound('en-GB', wordList.exel[0][checkIndex].word)} /> <span>UK</span>
                                        </div>

                                    </div>
                                }
                            </div>

                        </div>
                    </div>
                    <div className="vocabularyKey" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', fontWeight: 500, gap: '5px' }}>
                            {stats.map((stat, index) => (
                                <Card style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)', fontSize: 16, fontWeight: 700 }} onClick={() => handleDeleteChar(stat)} key={stat.id} hoverable={true}>
                                    {stat}
                                </Card>
                            ))}
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', flexDirection: 'row', fontWeight: 500, gap: '5px' }}>
                            {keyMix.map((stat, index) => (
                                <Card style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)', fontSize: 16, fontWeight: 700 }} onClick={() => handleNewChar(stat)} key={index + 'keyMix'} hoverable={true}>
                                    {stat}
                                </Card>
                            ))}
                        </div>
                        {checkState.checked === false &&
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                                <Button disabled={checkIndex === wordList.exel[0].length - 1 ? true : false} onClick={() => handleSkip()}>Bỏ qua</Button>
                                <Button disabled={stats.length === 0 ? true : false} onClick={() => handleCheckWord()}>Kiểm tra</Button>
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
        </div >
    );
};

export default ReviewVocabulary; 