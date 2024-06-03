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
import CustomAnswerSheet from "../../../components/answerSheet/CustomAnswerSheet";
import ListeningSheet from "../../../components/examSheet/ListeningSheet";
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

const ListeningPage = () => {
    const [open, setOpen] = useState(true);
    const [data, setData] = useState([]);
    const [media, setMedia] = useState([]);
    const testCode = useLocation().pathname.split("/")[3];
    const partName = useLocation().pathname.split("/")[4];
    const navigate = useNavigate();
    const [partEnglishName, setPartEnglishName] = useState('');
    const partDetection = () => {
        switch (testCode) {
            case 'part1':
                setPartEnglishName('Part 1 - Mô tả tranh')
                break;
            case 'part2':
                setPartEnglishName('Part 2 - Hỏi & Đáp')
                break;
            case 'part3':
                setPartEnglishName('Part 3 - Đoạn hội thoại')
                break;
            case 'part4':
                setPartEnglishName('Part 4 - Bài nói ngắn')
                break;
            case 'part5':
                setPartEnglishName('Part 5 - Hoàn thành câu')
                break;
            case 'part6':
                setPartEnglishName('Part 6 - Hoàn thành đoạn văn')
                break;
            case 'part71':
                setPartEnglishName('Part 7 - Đoạn đơn')
                break;
            case 'part72':
                setPartEnglishName('Part 7 - Đoạn kép')
                break;
            case 'part73':
                setPartEnglishName('Part 7 - Đoạn ba')
                break;

            default:
                setPartEnglishName('default')
                break;
        }
    }
    useEffect(() => {
        partDetection();
    }, []);

    const hideModal = () => {
        setOpen(false);
    };

    const notReady = () => {
        navigate("/listenings/practice/part1");
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
        let exelRefs = await listAll(ref(storage, `Listenings/exel/${partEnglishName}/${partName}`));
        let exelUrls = await Promise.all(
            exelRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        console.log(exelUrls);
        let audioRefs = await listAll(ref(storage, `Listenings/mp3/${partEnglishName}/${partName}/extractedFile`));
        let audioUrls = await Promise.all(
            audioRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let imagesRefs = await listAll(ref(storage, `Listenings/jpg/${partEnglishName}/${partName}/extractedFile`));
        let imagesUrls = await Promise.all(
            imagesRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        audioUrls.sort(compareAudioLinks);
        imagesUrls.sort(compareImagesLinks);
        let answerRefs = await listAll(ref(storage, `Listenings/json/${partEnglishName}/${partName}`));
        let answerUrls = await Promise.all(
            answerRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let temp = [];
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


                temp.push(formattedData);
            } catch (error) {
                console.error('Error fetching Excel data:', error);
            }
        }
        setData({
            exel: temp,
            audio: audioUrls,
            images: imagesUrls,
            answer: answerUrls[0],
        });
        //console.log(data);

    };
    useEffect(() => {
        fetchData();
    }, [partEnglishName]);




    const topExamBar = useMemo(
        () => (
            <div className="listeningPageContainer" style={{ overflow: 'hidden' }}>
                <Link to={'/listenings/practice/part1'} className="closeBtn">
                    <div >
                        <CloseOutlined style={{ paddingRight: 10 }} /> Đóng
                    </div>
                </Link>

                <div className="middleHeader">
                    <div className="middleTitle">ETS TOEIC {partEnglishName}</div>
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
                <ListeningSheet typeSheet="exam" data={data} testName={testCode} />
                <CustomAnswerSheet typeSheet="exam" data={data} />
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

export default ListeningPage; 