import * as React from "react";
import { useState, useEffect, useRef, forwardRef, useContext, useMemo } from "react";
import "./homePage.scss";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import StepsBar from "../../../components/stepsBar/StepsBar";
import GrammarPractice from "../../../components/grammarPractice/GrammarPractice";
import { Card, Radio, Button, Progress } from "antd";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    FileTextTwoTone, FileTwoTone, QuestionCircleTwoTone, LeftOutlined, RightOutlined
} from "@ant-design/icons";
import part1_img from '../../../assets/60167825.webp';
import part2_lis from '../../../assets/part2_lis.webp';
import part3_lis from '../../../assets/part3_lis.webp';
import part4_lis from '../../../assets/part4_lis.webp';
import part5_read from '../../../assets/part5_read.webp';
import part6_read from '../../../assets/part6_read.webp';
import part71_read from '../../../assets/part71_read.webp';
import part72_read from '../../../assets/part72_read.webp';
import part73_read from '../../../assets/part73_read.webp';
import quest6wr from '../../../assets/quest6wr.webp'
import quest8_wr from '../../../assets/quest8_wr.webp'
import quest8 from '../../../assets/quest8.webp'
import quest11 from '../../../assets/quest11.webp'
import quest12 from '../../../assets/quest12.webp'
import quest15_wr from '../../../assets/quest15_wr.webp'
import quest34 from '../../../assets/quest34.webp'
import quest56 from '../../../assets/quest56.webp'
import { htmlDesc } from '../../../../html/toeicDesc.js';
import Cookies from 'js-cookie';


const HomePage = () => {
    const [listening, setListening] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [reading, setReading] = useState([])
    const [tab, setTab] = useState('a');
    const truncatedContent = htmlDesc.slice(0, 400);
    const shouldTruncate = htmlDesc.length > 400;
    const [user, setUser] = useState(null);
    const [latestMock, setLatestMock] = useState([]);
    const [latestPart, setLatestPart] = useState([]);
    const [partEnglishName, setPartEnglishName] = useState('');
    const partSetter = (partName) => {
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
    const fetchProfile = async () => {
        try {
            const token = Cookies.get('x-auth-token');
            console.log(token);
            if (token) {
                const response = await publicRequest.get('http://localhost:8080/login/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(response.data.user);
                setUser(response.data.user);
                localStorage.setItem('userInfo', JSON.stringify(response.data.user))
            }
        } catch (error) {
            console.log(error);
        }
    };
    const navigate = useNavigate();
    const getListenings = async () => {
        try {
            let res = await publicRequest.get(
                `/listenings`
            );
            console.log(res);
            if (res.status === 200) {
                let arr = res.data;
                let categorizedArr = {};
                for (let i = 0; i < arr.length; i++) {
                    let partName = arr[i].partName;

                    if (!categorizedArr[partName]) {
                        categorizedArr[partName] = [];
                    }

                    categorizedArr[partName].push(arr[i]);
                }
                let resultArr = Object.values(categorizedArr);
                console.log(resultArr);
                setListening(resultArr);
            } else return useToastError("Something went wrong!");
        } catch (error) {
            console.log(error);
        }

    };
    const getReadings = async () => {
        try {
            let res = await publicRequest.get(
                `/readings`
            );
            console.log(res);
            if (res.status === 200) {
                let arr = res.data;
                let categorizedArr = {};
                for (let i = 0; i < arr.length; i++) {
                    let partName = arr[i].partName;

                    if (!categorizedArr[partName]) {
                        categorizedArr[partName] = [];
                    }

                    categorizedArr[partName].push(arr[i]);
                }
                let resultArr = Object.values(categorizedArr);
                console.log(resultArr);
                setReading(resultArr);
            } else return useToastError("Something went wrong!");
        } catch (error) {
            console.log(error);
        }

    };
    const getRecentResult = async () => {
        try {
            let res = await publicRequest.get(
                `/results/mocksLatest`
            );
            console.log(res);
            if (res.status === 200) {
                setLatestMock(res.data);
            } else return useToastError("Something went wrong!");
        } catch (error) {
            console.log(error);
        }
        try {
            let res = await publicRequest.get(
                `/results/latest`
            );
            console.log(res);
            if (res.status === 200) {
                partSetter(res.data.partName)
                setLatestPart(res.data);
            } else return useToastError("Something went wrong!");
        } catch (error) {
            console.log(error);
        }


    };

    const handleReview = () => {
        const number = parseInt(latestPart.partName.slice(4));
        if (number <= 4) {
            navigate(`/review/listenings/${latestPart.testName}/${latestPart.partName}/${latestPart.id}`)
        } else {
            navigate(`/review/readings/${latestPart.testName}/${latestPart.partName}/${latestPart.id}`)
        }
    }
    const handleReviewMock = () => {
        const number = parseInt(latestPart.partName.slice(4));
        if (number <= 4) {
            navigate(`/review/listenings/${latestPart.testName}/${latestPart.partName}/${latestPart.id}`)
        } else {
            navigate(`/review/readings/${latestPart.testName}/${latestPart.partName}/${latestPart.id}`)
        }
    }

    useEffect(() => {
        fetchProfile();
        getListenings();
        getReadings();
        getRecentResult();
    }, []);
    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const changeTab = (tab) => {
        setTab(tab)
    }

    return (
        <div>
            <Topbar></Topbar>
            <TopMenu active={" "}></TopMenu>
            <div className="homePageContainer">
                <div className="recentTab">
                    <Card hoverable style={{ width: '48%' }} title={null}>
                        <div className="recentCard">
                            <div className="recentTitle">Bài tập gần đây</div>
                            <div className="recentPart">TOEIC: Listening & Reading</div>
                            <div className="recentExercise">{partEnglishName}</div>
                            <div className="partNumber">
                                <div className="partCircle">01</div>
                                <div className="partName">{latestPart.testName}</div>
                            </div>
                            <div className="recentFooter">
                                <Button onClick={() => handleReview()} size="large" style={{ marginRight: 20 }} icon={<LeftOutlined />}>Xem lại</Button>
                                <Button onClick={() => navigate('/listenings/practice/part1')} size="large" icon={<RightOutlined />} type="primary">Tiếp tục</Button>
                            </div>
                        </div>
                    </Card>
                    <Card hoverable style={{ width: '48%' }} title={null}>
                        <div className="recentCard">
                            <div className="recentTitle">Bài thi gần đây</div>
                            <div className="recentPart">TOEIC: Mock Test</div>
                            <div className="recentExercise" style={{ visibility: 'hidden' }}>_</div>
                            <div className="partNumber">
                                <div className="partCircle">01</div>
                                <div className="partName">{latestMock.testName}</div>
                            </div>
                            <div className="recentFooter">
                                <Button onClick={() => navigate(`/review/${latestMock.testName}/${latestMock.id}`)} size="large" style={{ marginRight: 20 }} icon={<LeftOutlined />}>Xem lại</Button>
                                <Button onClick={() => navigate(`/mocks`)} size="large" icon={<RightOutlined />} type="primary">Tiếp tục</Button>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="homePageHeader">
                    <h1 className="homePageTitle-h1">Luyện thi thử TOEIC®online 2024 </h1>
                    <div className="homePageDesc" style={{ width: '80%' }}>
                        <p>
                            <span style={{ fontWeight: 400 }}>Chào mừng đến với </span><strong><em>TOEIC®Test Pro by TOEIC88</em></strong>
                            <span style={{ fontWeight: 400 }}>,</span><strong> </strong>
                            <span style={{ fontWeight: 400 }}>trang web/ ứng dụng TOEIC® cung cấp cho người học các bài luyện tập theo từng part,
                                đề thi thử cũng như các bài tập về từ vựng và ngữ pháp. Bắt đầu hành trình chinh phục chứng chỉ TOEIC® với các bài luyện tập
                                trên trang web/ứng dụng của chúng tôi ngay hôm nay!</span>
                        </p>
                    </div>
                </div>

                <div className="homePageSkillTabs">
                    <div className="homePageSkillNav">
                        <Radio.Group size="large" defaultValue="a" buttonStyle="solid">
                            <Radio.Button onClick={() => changeTab('a')} value="a"><span>Nghe & Đọc</span></Radio.Button>
                            <Radio.Button onClick={() => changeTab('B')} value="b"><span>Nói & Viết</span></Radio.Button>
                        </Radio.Group>
                    </div>
                    <div className="homePageSkillCards">
                        <div className="skillCardContainer" style={{ transform: tab === 'a' ? 'translateX(0px)' : 'translateX(-1100px)' }}>
                            <div className="skillCardList">
                                <div className="skillCardItem">
                                    <div className="skillCardTitle">Luyện nghe</div>
                                    <div className="skillCard">
                                        <Card
                                            onClick={() => navigate('/listenings/practice/part1')}
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={part1_img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Mô tả tranh</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{listening[0]?.length}</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{(listening[0]?.length) * 6}</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                        <Card
                                            onClick={() => navigate('/listenings/practice/part2')}
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={part2_lis} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Hỏi đáp</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{listening[1]?.length}</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{(listening[1]?.length) * 25}</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                        <Card
                                            onClick={() => navigate('/listenings/practice/part3')}
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={part3_lis} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Đoạn hội thoại</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{listening[2]?.length}</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{(listening[2]?.length) * 39}</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                        <Card
                                            onClick={() => navigate('/listenings/practice/part4')}
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={part4_lis} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Bài nói ngắn</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{listening[3]?.length}</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{(listening[0]?.length) * 30}</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                    </div>

                                </div>
                                <div className="skillCardItem" style={{ marginTop: 30 }}>
                                    <div className="skillCardTitle">Luyện Đọc</div>
                                    <div className="skillCard">
                                        <Card
                                            onClick={() => navigate('/readings/practice/part5')}
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={part5_read} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Hoàn thành câu</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{reading[0]?.length}</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{(reading[0]?.length) * 30}</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                        <Card
                                            onClick={() => navigate('/readings/practice/part6')}
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={part6_read} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Hoàn thành đoạn văn</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{reading[1]?.length}</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{(reading[1]?.length) * 16}</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                        <Card
                                            onClick={() => navigate('/readings/practice/part71')}
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={part71_read} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Đoạn đơn</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{reading[2]?.length}</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{(reading[2]?.length) * 29}</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                        <Card
                                            onClick={() => navigate('/readings/practice/part72')}
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={part72_read} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Đoạn kép</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{reading[3]?.length}</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{(reading[3]?.length) * 10}</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                        <Card
                                            onClick={() => navigate('/readings/practice/part73')}
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={part73_read} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Đoạn ba</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{reading[4]?.length}</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">{(reading[4]?.length) * 15}</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                </div>
                            </div>
                            <div className="skillCardList">
                                <div className="skillCardItem">
                                    <div className="skillCardTitle">Luyện Nói</div>
                                    <div className="skillCard">
                                        <Card
                                            onClick={() => navigate('/speakings/practice/part1')}
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={quest12} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Đọc thành tiếng một đoạn văn</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">22</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">174</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <QuestionCircleTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">4</div>
                                                                <div className="text toeic">bài học</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                        <Card
                                            onClick={() => navigate('/speakings/practice/part2')}
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={quest34} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Miêu tả một bức tranh</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">22</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">174</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <QuestionCircleTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">4</div>
                                                                <div className="text toeic">bài học</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                        <Card
                                            onClick={() => navigate('/speakings/practice/part3')}
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={quest56} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '50px' }}>Trả lời câu hỏi</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">22</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">174</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <QuestionCircleTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">4</div>
                                                                <div className="text toeic">bài học</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                        <Card
                                            onClick={() => navigate('/speakings/practice/part4')}
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={quest11} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Trình bày quan điểm</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">22</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">174</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <QuestionCircleTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">4</div>
                                                                <div className="text toeic">bài học</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                </div>
                                <div className="skillCardItem" style={{ marginTop: 30 }}>
                                    <div className="skillCardTitle">Luyện Viết</div>
                                    <div className="skillCard">
                                        <Card
                                            onClick={() => navigate('/writtings/practice/part1')}
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={quest15_wr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Viết câu theo một bức tranh cho sẵn</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">22</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">174</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <QuestionCircleTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">4</div>
                                                                <div className="text toeic">bài học</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card
                                            onClick={() => navigate('/writtings/practice/part2')}
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={quest8_wr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Viết bài luận trình bày quan điểm</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">22</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">174</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <QuestionCircleTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">4</div>
                                                                <div className="text toeic">bài học</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                        <Card
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30,
                                                visibility: 'hidden'
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={part1_img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Mô tả tranh</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">22</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">174</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <QuestionCircleTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">4</div>
                                                                <div className="text toeic">bài học</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                        <Card
                                            hoverable
                                            style={{
                                                width: 240,
                                                marginTop: 30,
                                                visibility: 'hidden'
                                            }}
                                            cover={
                                                <div style={{ width: 240, height: 150, overflow: 'hidden' }}>
                                                    <img src={part1_img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>

                                            }
                                        >
                                            <div className="topic-item-content">
                                                <div className="topic-item-name" style={{ marginBottom: '20px' }}>Mô tả tranh</div>
                                                <div >
                                                    <div className="topic-item-detail">
                                                        <div className="detail-item-box">
                                                            <div className="num-question-box">
                                                                <FileTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">22</div>
                                                                <div className="text toeic">bài tập</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <FileTextTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">174</div>
                                                                <div className="text toeic">câu hỏi</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-item-box topic-item__detail_item">
                                                            <div className="num-question-box">
                                                                <QuestionCircleTwoTone twoToneColor="#1677ff" />
                                                                <div className="num-question">4</div>
                                                                <div className="text toeic">bài học</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="topic-item__footer">
                                                        <Progress percent={30} />
                                                        <div className="topic-item__footer--completed-test">
                                                            <span className="total">4/26 </span>
                                                            <span className="text">bài hoàn thành</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="toeicDescription">
                    <Card hoverable title={null}>
                        {expanded ? (
                            <div dangerouslySetInnerHTML={{ __html: `${htmlDesc}` }} />
                        ) : (
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: `${truncatedContent}` }} />
                            </div>
                        )}
                        {shouldTruncate && (
                            <div style={{
                                textDecoration: 'underline',
                                textAlign: 'center', fontSize: 22, fontWeight: 600,
                                color: '#1677ff', cursor: 'pointer'
                            }} onClick={toggleExpand}>
                                {expanded ? 'Ẩn bớt' : 'Xem thêm'}
                            </div>
                        )}
                    </Card>

                </div>
            </div>

        </div>
    );
};

export default HomePage; 