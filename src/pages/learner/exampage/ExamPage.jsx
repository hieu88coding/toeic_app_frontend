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
import * as XLSX from "xlsx";


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
    const [data, setData] = useState([]);
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
    const getAudioNumber = (link) => {
        const startIndex = link.indexOf("audio_") + 6;
        const endIndex = link.indexOf(".mp3");
        const audioNumber = link.slice(startIndex, endIndex);

        return parseInt(audioNumber);
    };
    const getImagesNumber = (link) => {
        const startIndex = link.indexOf("images_") + 6;
        const endIndex = link.indexOf(".jpg");
        const audioNumber = link.slice(startIndex, endIndex);

        return parseInt(audioNumber);
    };
    const compareAudioLinks = (link1, link2) => {
        const audioNumber1 = getAudioNumber(link1);
        const audioNumber2 = getAudioNumber(link2);

        return audioNumber1 - audioNumber2;
    };
    const compareImagesLinks = (link1, link2) => {
        const audioNumber1 = getImagesNumber(link1);
        const audioNumber2 = getImagesNumber(link2);

        return audioNumber1 - audioNumber2;
    };

    const fetchData = async () => {
        let exelRefs = await listAll(ref(storage, `exel/${testCode}`));
        let exelUrls = await Promise.all(
            exelRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let audioRefs = await listAll(ref(storage, `mp3/${testCode}`));
        let audioUrls = await Promise.all(
            audioRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let imagesRefs = await listAll(ref(storage, `jpg/${testCode}`));
        let imagesUrls = await Promise.all(
            imagesRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        audioUrls.sort(compareAudioLinks);
        imagesUrls.sort(compareImagesLinks);
        let answerRefs = await getDownloadURL(ref(storage, `json/${testCode}/${testCode}_answer.xlsx`));
        let temp = [];
        if (exelUrls.length !== 0) {
            for (let i = 0; i < exelUrls.length; i++) {
                try {
                    const response = await axios.get(`${exelUrls[i]}`, {
                        responseType: 'arraybuffer',
                    });
                    const data = new Uint8Array(response.data);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    let formattedData = [];
                    if (i === 4) {
                        formattedData = jsonData.slice(1).map((item, index) => ({
                            key: String(index + 1),
                            number: item[0],
                            para: item[1],
                            question: item[2],
                            answerA: item[3],
                            answerB: item[4],
                            answerC: item[5],
                            answerD: item[6],
                        }));
                    } else {
                        formattedData = jsonData.slice(1).map((item, index) => ({
                            key: String(index + 1),
                            number: item[0],
                            question: item[1],
                            answerA: item[2],
                            answerB: item[3],
                            answerC: item[4],
                            answerD: item[5],
                        }));
                    }

                    temp.push(formattedData);
                } catch (error) {
                    console.error('Error fetching Excel data:', error);
                }
            }
            setData({
                exel: temp,
                audio: audioUrls,
                images: imagesUrls,
                answer: answerRefs,
            });
        }

    };
    useEffect(() => {
        fetchData();
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
                    <div className="middleTitle">ETS TOEIC {testCode}</div>
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
                <ExamSheet typeSheet="exam" data={data} testName={testCode} />
                <AnswerSheet typeSheet="exam" data={data} />
            </div>
        ), [data]
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