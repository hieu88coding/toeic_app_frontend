import * as React from "react";
import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../resultPage/resultPage.scss";
import { Divider, Card, Spin } from "antd";
import { CloseOutlined, CheckCircleTwoTone, CloseCircleTwoTone, MinusCircleTwoTone, FireTwoTone, PushpinTwoTone, AudioTwoTone } from "@ant-design/icons";
import axios from "axios";
import * as XLSX from "xlsx";
import DetailCustom from "../resultPage/DetailCustom";
import {
    ref,
    getDownloadURL,
    listAll,
} from "firebase/storage";
import { storage } from '../../../firebase';
import { useToastError, useToastSuccess } from "../../../utils/toastSettings";
import { publicRequest } from "../../../requestMethods";
const ReviewPart = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'))
    const [data, setData] = useState([]);
    const [listening, setListening] = useState([]);
    const [reading, setReading] = useState([]);
    const [score, setScore] = useState(0);
    const reviewId = useLocation().pathname.split("/")[5];
    const testCode = useLocation().pathname.split("/")[3];
    const partName = useLocation().pathname.split("/")[4];
    const type = useLocation().pathname.split("/")[2];
    const [answers, setAnswers] = useState([]);
    const [detailResult, setDetailResult] = useState([]);
    const [currentCounter, setCurrentCounter] = useState(0);
    const [partEnglishName, setPartEnglishName] = useState('');
    const [date, setDate] = useState('');
    const partSetter = () => {
        switch (partName) {
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
    const partDetection = () => {
        switch (partName) {
            case 'part1':
                setCurrentCounter(6)
                break;
            case 'part2':
                setCurrentCounter(25)
                break;
            case 'part3':
                setCurrentCounter(39)
                break;
            case 'part4':
                setCurrentCounter(30)
                break;
            case 'part5':
                setCurrentCounter(30)
                break;
            case 'part6':
                setCurrentCounter(16)
                break;
            case 'part71':
                setCurrentCounter(29)
                break;
            case 'part72':
                setPartEnglishName(10)
                break;
            case 'part73':
                setPartEnglishName(15)
                break;

            default:
                setPartEnglishName('default')
                break;
        }
    }

    const fetchAnswer = async () => {
        try {
            const res = await publicRequest.get(
                `/results/${reviewId}/${user.id}`);
            console.log(res.data);
            if (res && res.status === 200) {
                const date = new Date(res.data.updatedAt);
                const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                setDate(formattedDate)
                setAnswers(JSON.parse(res.data.userAnswer));

            }
        } catch (error) {
            useToastError("Không lấy được đáp án")
            console.log(error);
        }
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
        if (type === 'listenings') {
            let exelUrls = [];
            let audioUrls = [];
            let imagesUrls = [];
            if (partName !== 'part1' || partName !== 'part2') {
                let exelRefs = await listAll(ref(storage, `Listenings/exel/${partEnglishName}/${testCode}`));
                exelUrls = await Promise.all(
                    exelRefs.items.map(async (exelRef) => {
                        const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                        return url;
                    })
                );
            }
            if (partName === 'part1' || partName == 'part2' || partName == 'part3' || partName == 'part4') {
                let audioRefs = await listAll(ref(storage, `Listenings/mp3/${partEnglishName}/${testCode}/extractedFile`));
                audioUrls = await Promise.all(
                    audioRefs.items.map(async (exelRef) => {
                        const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                        return url;
                    })
                );

                let imagesRefs = await listAll(ref(storage, `Listenings/jpg/${partEnglishName}/${testCode}/extractedFile`));
                imagesUrls = await Promise.all(
                    imagesRefs.items.map(async (exelRef) => {
                        const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                        return url;
                    })
                );
                audioUrls.sort(compareAudioLinks);
                imagesUrls.sort(compareImagesLinks);
            }
            let answerRefs = await listAll(ref(storage, `Listenings/json/${partEnglishName}/${testCode}`));
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
                    const data2 = new Uint8Array(response.data);
                    const workbook = XLSX.read(data2, { type: 'array' });
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
            let temp2 = [];
            if (answerUrls.length !== 0) {
                try {
                    const response = await axios.get(`${answerUrls[0]}`, {
                        responseType: 'arraybuffer',
                    });
                    const data3 = new Uint8Array(response.data);
                    const workbook = XLSX.read(data3, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    let formattedData = jsonData.slice(1).map((item, index) => ({
                        key: String(index + 1),
                        number: item[0],
                        correctAnswer: item[1],
                        explanation: item[2],
                        transcript: item[3],
                    }));

                    temp2.push(formattedData);
                } catch (error) {
                    console.error('Error fetching Excel data:', error);
                }
                console.log(answers);
            }
            setData({
                exel: temp,
                audio: audioUrls,
                images: imagesUrls,
                answer: temp2,
            });
        } else {
            let exelRefs = await listAll(ref(storage, `Readings/exel/${partEnglishName}/${testCode}`));
            let exelUrls = await Promise.all(
                exelRefs.items.map(async (exelRef) => {
                    const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                    return url;
                })
            );
            let answerRefs = await listAll(ref(storage, `Readings/json/${partEnglishName}/${testCode}`));
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
                    if (testCode === 'part71' || testCode === 'part72' || testCode === 'part73') {
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
            let temp2 = [];
            if (answerUrls.length !== 0) {
                try {
                    const response = await axios.get(`${answerUrls[0]}`, {
                        responseType: 'arraybuffer',
                    });
                    const data3 = new Uint8Array(response.data);
                    const workbook = XLSX.read(data3, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    let formattedData = jsonData.slice(1).map((item, index) => ({
                        key: String(index + 1),
                        number: item[0],
                        correctAnswer: item[1],
                        explanation: item[2],
                        transcript: item[3],
                    }));

                    temp2.push(formattedData);
                } catch (error) {
                    console.error('Error fetching Excel data:', error);
                }
                console.log(answers);
            }
            setData({
                exel: temp,
                answer: temp2,
            });

        }

    };

    useEffect(() => {
        partDetection();
    }, []);
    useEffect(() => {
        partSetter();
    }, [currentCounter]);
    useEffect(() => {
        fetchData();
    }, [partEnglishName]);
    useEffect(() => {
        fetchAnswer();
        console.log(data);
        if (data.answer && data.answer.length !== 0) {
            compareAnswers(answers, data.answer, 0, currentCounter - 1);
        }
    }, [data]);
    const compareAnswers = (answers1, answers2, start, end) => {
        console.log(answers2);
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
            if (type === 'listenings') {
                const score = calculateListeningScore(correctCount);
                setScore((prevState) => (
                    prevState + score
                ))
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
                setReading({
                    readingScore: score,
                    rightAnswer: correctCount,
                    wrongAnswer: wrongCount,
                    skipAnswer: skip
                })
            }
        } else {
            if (type === 'listenings') {
                setListening({
                    rightAnswer: 0,
                    wrongAnswer: 0,
                    skipAnswer: currentCounter
                })
            } else {
                setReading({
                    rightAnswer: 0,
                    wrongAnswer: 0,
                    skipAnswer: currentCounter
                })
            }
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
    return (
        <div>
            <Spin spinning={data.answer && data.answer.length !== 0 ? false : true} fullscreen >
                <div className="resultPageContainer">
                    <div className="examPageContainer" style={{ overflow: 'hidden' }}>
                        <Link to={'/'} className="closeBtn">
                            <div >
                                <CloseOutlined style={{ paddingRight: 10 }} /> Đóng
                            </div>
                        </Link>

                        <div className="middleHeader">
                            <div className="middleTitle">ETS TOEIC - {partEnglishName} ({testCode})  </div>
                        </div>

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
                                                <div className="rowData"> {date}</div>
                                            </div>
                                            {type === "listenings" &&
                                                <div className="rowItems">
                                                    <div className="rowCat">Kết quả: </div>
                                                    <div className="rowData"> {String(listening?.rightAnswer)}/{currentCounter}</div>
                                                </div>
                                            }

                                            {type === "listenings" &&
                                                <div className="rowItems">
                                                    <div className="rowCat">Tỷ lệ chính xác: </div>
                                                    <div className="rowData"> {String(parseFloat((listening?.rightAnswer) / (listening?.rightAnswer + listening?.wrongAnswer) * 100).toFixed(1))}%</div>
                                                </div>
                                            }

                                            {type === "readings" &&
                                                <div className="rowItems">
                                                    <div className="rowCat">Kết quả: </div>
                                                    <div className="rowData"> {String(reading?.rightAnswer)}/{currentCounter}</div>
                                                </div>
                                            }

                                            {type === "readings" &&
                                                <div className="rowItems">
                                                    <div className="rowCat">Tỷ lệ chính xác: </div>
                                                    <div className="rowData"> {String(parseFloat((reading?.rightAnswer) / (reading?.rightAnswer + reading?.wrongAnswer) * 100).toFixed(1))}%</div>
                                                </div>
                                            }

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
                                    {type === "listenings" &&
                                        <div className="upperContent">
                                            <Card hoverable title={null} style={{ border: '2px outset', width: '30%' }}>
                                                <div className="cardContent">
                                                    <CheckCircleTwoTone style={{ fontSize: 20, marginBottom: 10 }} twoToneColor="#52c41a" />
                                                    <div style={{ color: '#52c41a' }}>Trả lời đúng</div>
                                                    <div>{String(listening?.rightAnswer)}</div>
                                                    <div>Câu hỏi</div>
                                                </div>

                                            </Card>
                                            <Card hoverable title={null} style={{ border: '2px outset', width: '30%' }}>
                                                <div className="cardContent">
                                                    <CloseCircleTwoTone style={{ fontSize: 20, marginBottom: 10 }} twoToneColor="#e43a45" />
                                                    <div style={{ color: '#e43a45' }}>Trả lời sai</div>
                                                    <div>{String(listening?.wrongAnswer)}</div>
                                                    <div>Câu hỏi</div>
                                                </div>

                                            </Card>
                                            <Card hoverable title={null} style={{ border: '2px outset', width: '30%' }}>
                                                <div className="cardContent">
                                                    <MinusCircleTwoTone style={{ fontSize: 20, marginBottom: 10 }} twoToneColor="#71869d" />
                                                    <div style={{ color: '#71869d' }}>Bỏ qua</div>
                                                    <div>{String(listening?.skipAnswer)}</div>
                                                    <div>Câu hỏi</div>
                                                </div>

                                            </Card>

                                        </div>
                                    }
                                    {type === "readings" &&
                                        <div className="upperContent">
                                            <Card hoverable title={null} style={{ border: '2px outset', width: '30%' }}>
                                                <div className="cardContent">
                                                    <CheckCircleTwoTone style={{ fontSize: 20, marginBottom: 10 }} twoToneColor="#52c41a" />
                                                    <div style={{ color: '#52c41a' }}>Trả lời đúng</div>
                                                    <div>{String(reading?.rightAnswer)}</div>
                                                    <div>Câu hỏi</div>
                                                </div>

                                            </Card>
                                            <Card hoverable title={null} style={{ border: '2px outset', width: '30%' }}>
                                                <div className="cardContent">
                                                    <CloseCircleTwoTone style={{ fontSize: 20, marginBottom: 10 }} twoToneColor="#e43a45" />
                                                    <div style={{ color: '#e43a45' }}>Trả lời sai</div>
                                                    <div>{String(reading?.wrongAnswer)}</div>
                                                    <div>Câu hỏi</div>
                                                </div>

                                            </Card>
                                            <Card hoverable title={null} style={{ border: '2px outset', width: '30%' }}>
                                                <div className="cardContent">
                                                    <MinusCircleTwoTone style={{ fontSize: 20, marginBottom: 10 }} twoToneColor="#71869d" />
                                                    <div style={{ color: '#71869d' }}>Bỏ qua</div>
                                                    <div>{String(reading?.skipAnswer)}</div>
                                                    <div>Câu hỏi</div>
                                                </div>

                                            </Card>

                                        </div>
                                    }

                                    <div className="lowerContent">
                                        {type === 'listenings' &&
                                            <Card hoverable title={null} style={{ border: '2px outset', width: '100%' }}>
                                                <div className="cardContent">
                                                    <AudioTwoTone style={{ fontSize: 20, marginBottom: 10 }} twoToneColor="#007aff" />
                                                    <div style={{ color: '#007aff' }}>Listening</div>
                                                    <div>{String(listening?.listeningScore)}/495</div>
                                                    <div>Trả lời đúng {String(listening?.rightAnswer)}/{currentCounter}</div>
                                                </div>

                                            </Card>
                                        }
                                        {type === 'readings' &&
                                            <Card hoverable title={null} style={{ border: '2px outset', width: '100%' }}>
                                                <div className="cardContent">
                                                    <PushpinTwoTone style={{ fontSize: 20, marginBottom: 10 }} twoToneColor="#007aff" />
                                                    <div style={{ color: '#007aff' }}>Reading</div>
                                                    <div>{String(reading?.readingScore)}/495</div>
                                                    <div>Trả lời đúng {String(reading?.rightAnswer)}/{currentCounter}</div>
                                                </div>

                                            </Card>
                                        }

                                    </div>
                                </div>
                            </div>


                        </Card>
                        <Card title={"Phân tích chi tiết"}>
                            <div id="scrollContent">
                                {data && detailResult && partName === 'part1' && <DetailCustom data={data} result={detailResult} userAnswer={answers} start={0} end={6} part={'part1'} />}
                                {data && detailResult && partName === 'part2' && <DetailCustom data={data} result={detailResult} userAnswer={answers} start={0} end={25} part={'part2'} />}
                                {data && detailResult && partName === 'part3' && <DetailCustom data={data} result={detailResult} userAnswer={answers} start={0} end={30} part={'part3'} />}
                                {data && detailResult && partName === 'part4' && <DetailCustom data={data} result={detailResult} userAnswer={answers} start={0} end={30} part={'part4'} />}
                                {data && detailResult && partName === 'part5' && <DetailCustom data={data} result={detailResult} userAnswer={answers} start={0} end={30} part={'part5'} />}
                                {data && detailResult && partName === 'part6' && <DetailCustom data={data} result={detailResult} userAnswer={answers} start={0} end={16} part={'part6'} />}
                                {data && detailResult && partName === 'part71' && <DetailCustom data={data} result={detailResult} userAnswer={answers} start={0} end={29} part={'part71'} />}
                                {data && detailResult && partName === 'part72' && <DetailCustom data={data} result={detailResult} userAnswer={answers} start={0} end={10} part={'part72'} />}
                                {data && detailResult && partName === 'part73' && <DetailCustom data={data} result={detailResult} userAnswer={answers} start={0} end={15} part={'part73'} />}
                            </div>


                        </Card>
                    </div>

                </div>


            </Spin>
        </div>
    );
};

export default ReviewPart; 