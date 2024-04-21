import * as React from "react";
import { useState, useEffect, useRef, forwardRef, createRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./examSheet.scss";
import { Anchor, Card, Button } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";
import Scrollbar from "react-perfect-scrollbar";
import axios from "axios";
import * as XLSX from "xlsx";
import { Table } from "antd";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { storage } from '../../firebase';
import { Part1 } from "../examParts/part1";
import { Part2 } from "../examParts/Part2";
import { Part3 } from "../examParts/Part3";
import { Part4 } from "../examParts/Part4";
import { Part5 } from "../examParts/Part5";
import { Part6 } from "../examParts/Part6";
import { Part7 } from "../examParts/Part7";

const ExamSheet = (props) => {
    const [currentPart, setCurrentPart] = useState('part1');
    const [data, setData] = useState([]);
    const partName = useLocation().pathname.split("/")[3];

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

    const handlePartChange = (part) => {
        setCurrentPart(part);
    };

    const handleNextPart = () => {
        if (currentPart !== 'part7') {
            const lastChar = currentPart.charAt(currentPart.length - 1);
            const intValue = parseInt(lastChar) + 1;
            setCurrentPart(`part${intValue}`)
        }
    }

    const fetchData = async () => {
        let exelRefs = await listAll(ref(storage, `exel/${props.testName}`));
        let exelUrls = await Promise.all(
            exelRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let audioRefs = await listAll(ref(storage, `mp3/${props.testName}`));
        let audioUrls = await Promise.all(
            audioRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let imagesRefs = await listAll(ref(storage, `jpg/${props.testName}`));
        let imagesUrls = await Promise.all(
            imagesRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        audioUrls.sort(compareAudioLinks);
        imagesUrls.sort(compareImagesLinks);
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
                images: imagesUrls
            });
        }

    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleAnchorClick = (e, link) => {
        e.stopPropagation();
    };

    const columns = [
        {
            title: 'Số thứ tự',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Câu hỏi',
            dataIndex: 'question',
            key: 'question',
        },
        {
            title: 'Đáp án A',
            dataIndex: 'answerA',
            key: 'answerA',
        },
        {
            title: 'Đáp án B',
            dataIndex: 'answerB',
            key: 'answerB',
        },
        {
            title: 'Đáp án C',
            dataIndex: 'answerC',
            key: 'answerC',
        },
        {
            title: 'Đáp án D',
            dataIndex: 'answerD',
            key: 'answerD',
        },
    ];

    return (
        <div>
            <div className="examSheetContainer" style={props.typeSheet === "exam" ? {} : { marginTop: 40 }}>
                {props.typeSheet === "exam" &&
                    <div className="anchor" style={{ width: '100%' }}>
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
                }

                <Card title={null}>
                    <Scrollbar options={{
                        suppressScrollX: true
                    }} style={{ maxHeight: 560 }}>
                        <div id="scrollContent">
                            {data && currentPart === 'part1' && <Part1 audio={data.audio} images={data.images} />}
                            {data && currentPart === 'part2' && <Part2 audio={data.audio} />}
                            {data && currentPart === 'part3' && <Part3 audio={data.audio} images={data.images} exel={data.exel[0]} />}
                            {data && currentPart === 'part4' && <Part4 audio={data.audio} images={data.images} exel={data.exel[1]} />}
                            {data && currentPart === 'part5' && <Part5 exel={data.exel[2]} />}
                            {data && currentPart === 'part6' && <Part6 exel={data.exel[3]} />}
                            {data && currentPart === 'part7' && <Part7 exel={data.exel[4]} />}
                        </div>
                    </Scrollbar>
                </Card>
                <div style={{ display: currentPart === 'part7' ? 'none' : 'flex', justifyContent: `flex-end` }}>
                    <Button icon={<DoubleRightOutlined />} onClick={() => handleNextPart()} type="primary" size="large" style={{ marginTop: 10, marginBottom: 50 }}>
                        Next Part
                    </Button>
                </div>


            </div>
        </div>
    );
};

export default ExamSheet; 