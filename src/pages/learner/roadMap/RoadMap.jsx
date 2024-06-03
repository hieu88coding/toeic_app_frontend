import * as React from "react";
import { useState, useEffect, useRef, forwardRef, useContext, useMemo } from "react";
import "./roadMap.scss";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import StepsBar from "../../../components/stepsBar/StepsBar";
import { Card, Button, Progress, Modal } from "antd";
import { AudioFilled, LockFilled } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { publicRequest } from "../../../requestMethods";
import Cookies from 'js-cookie';
const para = [
    {
        title: 'Foundation',
        //description: 'Bạn có thể hiểu được các từ vựng dễ hiểu, các cụm từ thông dụng. Bạn có thể nắm được các cấu trúc ngữ pháp dựa trên quy tắc phổ biến nhất khi không cần phải đọc nhiều.',
        levelStart: 0,
        levelEnd: 219,
        style: {
            maxWidth: 550,
        }
    },
    {
        title: 'Elementary 1',
        //description: 'Có thể hiểu và sử dụng các cách diễn đạt quen thuộc hàng ngày. Bạn có thể tương tác một cách đơn giản nếu người kia nói chậm và rõ ràng.',
        levelStart: 220,
        levelEnd: 345,
        style: {
            maxWidth: 550,
        }
    },
    {
        title: 'Elementary 2',
        //description: 'Có thể hiểu được những thông tin rất cơ bản về cá nhân và gia đình, mua sắm, địa lý địa phương, việc làm,...). Bạn có thể giao tiếp một cách đơn giản và trực tiếp.',
        levelStart: 346,
        levelEnd: 469,
        style: {
            maxWidth: 550,
        }
    },
    {
        title: 'Intermediate 1',
        //description: 'Bạn có thể chủ động bắt đầu và duy trì các cuộc trò chuyện trực tiếp có thể dự đoán được và đáp ứng các nhu cầu xã hội hạn chế.',
        levelStart: 470,
        levelEnd: 600,
        style: {
            maxWidth: 550,
        }
    },
    {
        title: 'Intermediate 2',
        //description: 'Bạn có thể hiểu được những ý chính trong các văn bản, tài liệu. Bạn có thể giải quyết hầu hết các tình huống khi đi du lịch. Bạn có thể tạo ra văn bản đơn giản.',
        levelStart: 601,
        levelEnd: 729,
        style: {
            maxWidth: 550,
        }
    },
    {
        title: 'Advanced 1',
        //description: 'Bạn có thể đáp ứng được những yêu cầu hạn chế trong công việc và hầu hết các nhu cầu xã hội.',
        levelStart: 730,
        levelEnd: 795,
        style: {
            maxWidth: 550,
        }
    },
    {
        title: 'Advanced 2',
        //description: 'Bạn có thể hiểu được các ý chính của văn bản phức tạp, bao gồm cả các thảo luận chuyên ngành. Bạn có thể tương tác với người bản xứ.',
        levelStart: 796,
        levelEnd: 990,
        style: {
            maxWidth: 550,
        }
    },
    {
        title: 'Proficiency',
        //description: 'Bạn có thể diễn đạt bản thân một cách trôi chảy và tự nhiên. Bạn có thể sử dụng ngôn ngữ một cách linh hoạt và hiệu quả.',
        levelStart: 991,
        levelEnd: 1000,
        style: {
            maxWidth: 550,
        }
    },
]

const RoadMap = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || [];
    const [listening, setListening] = useState([]);
    const [reading, setReading] = useState([]);
    const [userLevel, setUserLevel] = useState([])
    const navigate = useNavigate();
    const [divsItem, setDivsItem] = useState([]);
    const [progress, setProgress] = useState([]);
    const partNameArray = ['part1', 'part2', 'part3', 'part4', 'part5', 'part6', 'part71', 'part72', 'part73'];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = Cookies.get('x-auth-token');
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        navigate('/login')
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const generateListenings = () => {
        const divs = [];

        for (let i = 0; i < 4; i++) {
            const div = <div className="statsContainer" key={i}>
                <Card
                    style={{ width: "100%", marginTop: 50, marginRight: 'auto', marginLeft: 'auto' }}
                    title={<div className="cardTitleFlex"><div><AudioFilled /> {listening[i].partName}</div><div>{para[userLevel.levelStart].title}</div></div>}>
                    {(() => {
                        const cardContent = [];

                        for (let index = 0; index < 5; index++) {
                            cardContent.push(
                                <div className="cardButton" key={index}>
                                    <Button
                                        type={index === 0 ? 'primary' : 'dashed'}
                                        disabled={index > 0 ? true : false}
                                        onClick={() => navigate(`/listenings/practice/part${index + 1}/Test${1}`)}
                                        style={{ width: 140 }}
                                    >{index === 0 ? 'Start' : <LockFilled />}</Button>
                                </div>
                            );
                        }

                        const temp = <div className="cardContent">
                            <div className="cardContentFlex">{cardContent}</div>
                            {/* <div className="statsPercent">0%</div> */}
                            <Progress type="circle" percent={Math.round(progress[i].score / 495 * 100)} size={50} />
                        </div>

                        return temp;
                    })()}
                </Card>
            </div>;
            divs.push(div);
        }

        return divs;
    }
    const generateReadings = () => {
        const divs = [];

        for (let i = 0; i < 5; i++) {
            const div = <div className="statsContainer" key={i + 210}>
                <Card
                    style={{ width: "100%", marginTop: 50, marginRight: 'auto', marginLeft: 'auto' }}
                    title={<div className="cardTitleFlex"><div><AudioFilled /> {reading[i].partName}</div><div>{para[userLevel.levelStart].title}</div></div>}>
                    {(() => {
                        const cardContent = [];

                        for (let index = 0; index < 2; index++) {
                            cardContent.push(
                                <div className="cardButton" key={index + 99}>
                                    <Button
                                        type={index === 0 ? 'primary' : 'dashed'}
                                        disabled={index > 0 ? true : false}
                                        onClick={() => navigate(`/readings/practice/part${index + 5}/Test${1}`)}
                                        style={{ width: 140 }}
                                    >Start</Button>
                                </div>
                            );
                        }
                        for (let index = 2; index < 5; index++) {
                            cardContent.push(
                                <div className="cardButton" key={index + 99}>
                                    <Button
                                        type={'dashed'}
                                        disabled={true}
                                        onClick={() => navigate(`/readings/practice/part7${index - 1}/Test${1}`)}
                                        style={{ width: 140 }}
                                    >Start</Button>
                                </div>
                            );
                        }

                        const temp = <div className="cardContent">
                            <div className="cardContentFlex">{cardContent}</div>
                            <Progress type="circle" percent={Math.round(progress[i + 4].score / 495 * 100)} size={50} />
                        </div>

                        return temp;
                    })()}
                </Card>
            </div>;
            divs.push(div);
        }

        return divs;
    }
    const getBestScore = async () => {
        try {
            const res = await publicRequest.get(`/results/highestPart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res.data);
            if (res && res.status === 200) {
                const elements = res.data;
                partNameArray.forEach((partName) => {
                    const existingElement = elements.find((element) => element.partName === partName);
                    if (!existingElement) {
                        elements.push({ partName: partName, score: 0 });
                    }
                });
                elements.sort((a, b) => {
                    const partNameA = a.partName.substring(4);
                    const partNameB = b.partName.substring(4);

                    return Number(partNameA) - Number(partNameB);
                });
                console.log(elements);
                setProgress(elements);
            } else {
                setProgress([]);
            }

        } catch (error) {
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    };
    const getLevel = async () => {
        try {
            const res = await publicRequest.get(`/userLevels/${user.id}`);
            console.log(res);
            console.log(res.data);
            if (res && res.status === 200) {
                setUserLevel(res.data);
            }

        } catch (error) {
            navigate('/roadmap/create')
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    };
    const getListening = async () => {
        console.log(para[userLevel.levelStart].levelStart);
        try {
            const res = await publicRequest.get(`/listenings/${para[userLevel.levelStart].levelStart}/${para[userLevel.levelStart].levelEnd}`);
            console.log('listenings:', res);
            if (res && res.status === 200) {
                setListening(res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    };
    const getReading = async () => {
        try {
            const res = await publicRequest.get(`/readings/${para[userLevel.levelStart].levelStart}/${para[userLevel.levelStart].levelEnd}`);
            console.log('reading:', res);
            if (res && res.status === 200) {
                setReading(res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    };
    useEffect(() => {
        if (user.length !== 0) {
            getLevel();
        } else {
            setIsModalOpen(true);
        }
    }, []);
    useEffect(() => {
        if (userLevel.length !== 0) {
            getListening();
            getReading();
            getBestScore();
        }

    }, [userLevel]);
    useEffect(() => {
        if (progress.length !== 0 && listening.length !== 0 && reading.length !== 0) {
            setDivsItem([generateListenings(), generateReadings()])
        }

    }, [progress]);
    return (
        <div>
            <Modal title="Thông báo" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Đăng nhập trước khi tiếp tục</p>

            </Modal>
            <Topbar></Topbar>
            <TopMenu active={"roadmap"}></TopMenu>
            {/* {
                user.length !== 0 && */}
            <div className="roadMapContainer">
                <StepsBar data={userLevel} />
                <div className="roadMapContent">
                    {divsItem}
                </div>

            </div>
            {/* } */}


        </div>
    );
};

export default RoadMap; 