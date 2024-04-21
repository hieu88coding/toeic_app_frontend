import * as React from "react";
import { useState, useEffect, useRef, forwardRef, useContext, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./examPage.scss";
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

const ExamPage = () => {
    const refAudio = useRef(null);
    const [open, setOpen] = useState(true);
    const [stats, setStats] = useState([]);
    const [media, setMedia] = useState([]);
    const testCode = useLocation().pathname.split("/")[2];
    const partName = useLocation().pathname.split("/")[3];
    const navigate = useNavigate();

    const hideModal = () => {
        setOpen(false);
    };

    const notReady = () => {
        navigate("/mocks");
    }



    const getStats = async () => {
        try {
            const res = await publicRequest.get(`/mockTests/${testCode}`);
            console.log(res.data);
            const { testName, audiomp3, correctAnswer, pdf, images } = res.data;
            const answerList = await axios.get(`${correctAnswer}`);
            setMedia({
                testName: testName,
                pdf: pdf,
                audio: audiomp3,
                answer: answerList,
                images: images
            });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    };
    useEffect(() => {
        getStats();
    }, []);


    const topExamBar = useMemo(
        () => (
            <div className="examPageContainer" style={{ overflow: 'hidden' }}>
                <Link to={'/mocks'} className="closeBtn">
                    <div >
                        <CloseOutlined style={{ paddingRight: 10 }} /> Đóng
                    </div>
                </Link>

                <div className="middleHeader">
                    <div className="middleTitle">ETS TOEIC {media && media.testName}</div>
                    <div className="middleMp3">

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

            </div>
        ),
        [open] // Rỗng để chỉ render một lần duy nhất
    );
    const mainContent = useMemo(
        () => (
            <div className="mainExamContainer" style={{ overflow: 'hidden' }}>
                <ExamSheet typeSheet="exam" data={stats} testName={testCode} />
                <AnswerSheet typeSheet="exam" rightAnswer={media.answer} />
            </div>
        ), [stats]
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

export default ExamPage; 