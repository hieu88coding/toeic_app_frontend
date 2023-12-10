import * as React from "react";
import { useState, useEffect, useRef, forwardRef, createRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./examPage.scss";
import { usePlyr } from "plyr-react";
import Countdown from 'react-countdown';
import "plyr-react/plyr.css";
import { Modal } from "antd";
import { CloseOutlined, CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import AnswerSheet from "../../../components/answerSheet/AnswerSheet";
import ExamSheet from "../../../components/examSheet/ExamSheet";

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

const audioSource = {
    type: "audio",
    sources: [
        {
            type: "audio/mp3",
            src: "https://firebasestorage.googleapis.com/v0/b/hieu88toeicapp.appspot.com/o/keyboard-153960.mp3?alt=media&token=5a41cbce-7bb1-4896-96a4-75d08f84840a",
        },
    ],
};

const CustomPlyrInstance = forwardRef((props, ref) => {
    const { source, options = null } = props;
    const raptorRef = usePlyr(ref, { options, source });
    useEffect(() => {
        const { current } = ref;
        if (current.plyr.source === null) return;

        const api = current;
        api.plyr.on("ready", () => console.log("I'm ready"));
        api.plyr.on("canplay", () => {
            // api.plyr.play();
            console.log("duration of audio is", api.plyr.duration);
        });
        api.plyr.on("ended", () => console.log("I'm Ended"));
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
const ExamPage = () => {
    const ref = useRef(null);
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const hideModal = () => {
        setOpen(false);
    };

    const notReady = () => {
        navigate("/");
    }

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
            <div className="examPageContainer" style={{ overflow: 'hidden' }}>
                <Link to={'/'} className="closeBtn">
                    <div >
                        <CloseOutlined style={{ paddingRight: 10 }} /> Đóng
                    </div>
                </Link>

                <div className="middleHeader">
                    <div className="middleTitle">ETS TOEIC Test 1</div>
                    <div className="middleMp3">
                        {audioSource && (
                            <CustomPlyrInstance ref={ref} type="audio" source={audioSource} options={audioOptions} />
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
                    <Link to={'/'} className="finish">
                        <div >
                            <CheckOutlined style={{ paddingRight: 10 }} />
                            Nộp bài
                        </div>
                    </Link>}


            </div>
            <div className="mainExamContainer" style={{ overflow: 'hidden' }}>
                <ExamSheet />
                <AnswerSheet questionCount={100} startedQuestionNumber={1} />
            </div>

        </div>
    );
};

export default ExamPage; 