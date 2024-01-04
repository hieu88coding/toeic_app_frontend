import * as React from "react";
import { useState, useEffect, useRef, forwardRef, useContext, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./listeningPage.scss";
import { usePlyr } from "plyr-react";
import Countdown from 'react-countdown';
import "plyr-react/plyr.css";
import { Modal, Button } from "antd";
import { CloseOutlined, CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import {
    ref,
    getDownloadURL,
    listAll,
} from "firebase/storage";
import { storage } from '../../../firebase';
import AnswerSheet from "../../../components/answerSheet/AnswerSheet";
import ExamSheet from "../../../components/examSheet/ExamSheet";
import axios from "axios";


const Timer = ({ hours, minutes, seconds, completed }) => {
    // Hàm để thêm chữ số 0 vào đầu chuỗi nếu độ dài chuỗi < 2
    const addLeadingZero = (value) => {
        return value.toString().padStart(2, '0');
    };

    if (completed) {
        return <span>00:00:00</span>;
    } else {
        // Render a countdown
        return (
            <span>
                {addLeadingZero(hours)}:{addLeadingZero(minutes)}:{addLeadingZero(seconds)}
            </span>
        );
    }
};
const audioOptions = undefined;
const CustomPlyrInstance = forwardRef((props, ref) => {
    const { source, options = null } = props;
    const raptorRef = usePlyr(ref, { options, source });
    useEffect(() => {
        const { current } = ref;
        if (current.plyr.source === null) return;

        const api = current;
        api.plyr.on("ready", () => { });
        api.plyr.on("canplay", () => {
            // api.plyr.play();
        });
        api.plyr.on("ended", () => { });
    });

    const handleClick = () => {
        raptorRef.current.play();
    };

    return (
        <audio
            ref={raptorRef}
            className="plyr-react plyr"
            muted={true}
            onClick={handleClick}
        />
    );
});

const ListeningPage = () => {
    const refAudio = useRef(null);
    const [open, setOpen] = useState(true);
    const [stats, setStats] = useState([]);
    const [media, setMedia] = useState([]);
    const testCode = useLocation().pathname.split("/")[2];
    const level = useLocation().pathname.split("/")[3];
    const navigate = useNavigate();
    const [userAnswer, setUserAnswer] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const updateSelectedAnswers = (questionNumber, answer) => {
        setUserAnswer((prevUserAnswers) => {
            if (prevUserAnswers[questionNumber] === answer) {
                const newSelectedAnswers = { ...prevUserAnswers };
                delete newSelectedAnswers[questionNumber];
                return newSelectedAnswers;
            } else {
                return {
                    ...prevUserAnswers,
                    [questionNumber]: answer,
                };
            }
        });
    };

    const handleAnswerSubmit = () => {
        if (isSubmit) {
            console.log("Da submit", userAnswer);
            const data = {
                pdf: media.pdf,
                rightAnswer: media.answer,
                userAnswer: userAnswer
            }
            localStorage.setItem('userExamResult', JSON.stringify(data));
            navigate(`/result/${testCode}/0`);
        }
    };
    const handleSubmit = () => {
        setIsSubmit(true);
    }
    const hideModal = () => {
        setOpen(false);
    };

    const notReady = () => {
        navigate("/");
    }

    const getStats = async () => {
        try {
            const res = await publicRequest.get(`/listenings/${testCode}/${level}`);
            console.log(res.data);
            const { testName, audiomp3, correctAnswer, pdf } = res.data;
            const answerList = await axios.get(`${correctAnswer}`);
            const imageRefs = await listAll(ref(storage, res.data.images)); // Lấy danh sách các file trong thư mục
            const imageUrls = await Promise.all(
                imageRefs.items.map(async (imageRef) => {
                    const url = await getDownloadURL(imageRef); // Tải xuống từng ảnh
                    return url;
                })
            );
            const stats = imageUrls.map((url, index) => ({
                name: imageRefs.items[index].name,
                url: url,
            }));
            stats.sort((a, b) => {
                const indexA = parseInt(a.name.split('_')[1]);
                const indexB = parseInt(b.name.split('_')[1]);
                return indexA - indexB;
            });
            setStats(stats);
            setMedia({
                testName: testName,
                pdf: pdf,
                audio: audiomp3,
                answer: answerList.data,
            });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    };
    useEffect(() => {
        getStats();
    }, []);

    useEffect(() => {
        if (isSubmit) {
            handleAnswerSubmit();
        }
    }, [isSubmit]);

    const topExamBar = useMemo(
        () => (
            <div className="listeningPageContainer" style={{ overflow: 'hidden' }}>
                <Link to={'/'} className="closeBtn">
                    <div >
                        <CloseOutlined style={{ paddingRight: 10 }} /> Đóng
                    </div>
                </Link>

                <div className="middleHeader">
                    <div className="middleTitle">ETS TOEIC {media && media.testName}</div>
                    <div className="middleMp3">
                        {(
                            <CustomPlyrInstance ref={refAudio} type="audio" source={{
                                type: "audio",
                                sources: [
                                    {
                                        type: "audio/mp3",
                                        src: media.audio,
                                    },
                                ],
                            }} options={audioOptions} />
                        )}
                    </div>
                </div>


                {!open &&
                    <div className="timer">
                        <div className="timerTitle">Thời gian còn lại</div>
                        <div className="timerTime">
                            <Countdown
                                date={Date.now() + 7200000}
                                intervalDelay={0}
                                renderer={Timer}
                                autoStart={true}
                            />

                        </div>
                    </div>
                }

                {!open &&
                    <div>
                        <Button
                            style={{
                                width: '103%', height: '100%',
                                borderBottom: 'none !important',
                                borderTop: 'none !important'
                            }}
                            onClick={handleSubmit}
                            icon={<CheckOutlined />}>Nộp bài</Button>
                    </div>
                }


            </div>
        ),
        [open] // Rỗng để chỉ render một lần duy nhất
    );
    const mainContent = useMemo(
        () => (
            <div className="mainExamContainer" style={{ overflow: 'hidden' }}>
                <ExamSheet typeSheet="listening" data={stats} />
                <AnswerSheet typeSheet="listening" userAnswers={userAnswer} updateSelectedAnswers={updateSelectedAnswers} />
            </div>
        ), [stats, userAnswer]
    );
    return (
        <div style={{ overflowY: 'hidden' }}>
            <Modal
                title="Bạn đã sẵn sàng làm bài thi chưa ?"
                open={open}
                onOk={hideModal}
                onCancel={notReady}
                okText="Sẵn sàng"
                cancelText="Quay lại"
            >
                <p><ExclamationCircleOutlined />  Hãy đảm bảo chuẩn bị đủ tai nghe, loa để bắt đầu làm bài</p>
                <p>Good luck !</p>
            </Modal>
            {topExamBar}
            {mainContent}

        </div>
    );
};

export default ListeningPage; 