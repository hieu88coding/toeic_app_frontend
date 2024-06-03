import * as React from "react";
import { useState, useEffect } from "react";
import "./vocabulary.scss";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import { Card, Button } from "antd";
import { CloseOutlined, SoundOutlined } from "@ant-design/icons";
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


const { Meta } = Card;
const Vocabulary = () => {
    const [data, setData] = useState([]);
    const [stats, setStats] = useState([]);
    const navigate = useNavigate();
    const testCode = useLocation().pathname.split("/")[2];

    const fetchData = async () => {
        console.log('chạy vô đây');
        let exelRefs = await listAll(ref(storage, `Vocabularys/exel/${testCode}`));
        let exelUrls = await Promise.all(
            exelRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let imageRefs = await listAll(ref(storage, `Vocabularys/jpg/Ảnh/${testCode}/extractedFile`));
        imageRefs.items.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
        let imagesUrls = await Promise.all(
            imageRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let temp1 = [];
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
                    word: item[1],
                    transcribe: item[2],
                    meaning: item[3],
                }));
                temp1.push(formattedData);
                temp1[0].sort((a, b) => {
                    const wordA = a.word.toLowerCase();
                    const wordB = b.word.toLowerCase();
                    if (wordA < wordB) return -1;
                    if (wordA > wordB) return 1;
                    return 0;
                });
                console.log(temp1);
            } catch (error) {
                console.error('Error fetching Excel data:', error);
            }
        }
        console.log(temp1);
        console.log(imagesUrls);
        setData({
            exel: temp1,
            images: imagesUrls
        });


    };
    useEffect(() => {
        fetchData();
        console.log(data);
    }, []);
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
            <div className="vocabularyContent">
                <div style={{ marginRight: 'auto', marginLeft: 'auto', marginBottom: 50, display: 'flex', justifyContent: 'center' }}>
                    <Button type="primary" style={{ width: 300, }} onClick={() => navigate(`/vocabulary/review/${testCode}`, {
                        state: {
                            wordList: data,
                        }
                    })} >Luyện tập</Button>
                </div>
                {data && data.length !== 0 && data.exel[0].map((stat, index) => (

                    <Card key={stat.id} hoverable={true} title={`${stat.word} ${stat.transcribe}`} style={{ marginBottom: 20 }} >
                        <div className="vocabularyItem" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className="sound" style={{ display: 'flex', flexDirection: 'row', marginBottom: 20 }}>
                                    <div style={{ fontSize: 20, marginRight: 20, fontWeight: 'bold' }}>
                                        <SoundOutlined onClick={() => handleSound('en-US', stat.word)} /> <span>US</span>
                                    </div>
                                    <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                                        <SoundOutlined onClick={() => handleSound('en-GB', stat.word)} /> <span>UK</span>
                                    </div>

                                </div>

                                <div className="vocabCard">
                                    <div style={{ fontSize: 18, fontWeight: '500' }}>Định nghĩa:</div>
                                    <div>{stat.meaning}</div>
                                </div>

                            </div>

                            <img style={{ width: 200, maxHeight: 150 }} src={data.images[index]} />
                        </div>
                    </Card>

                ))}



            </div>
        </div>
    );
};

export default Vocabulary; 