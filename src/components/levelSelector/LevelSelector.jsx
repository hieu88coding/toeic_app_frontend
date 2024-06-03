import * as React from "react";
import { useState, useEffect, useRef, forwardRef, useContext, useMemo } from "react";
import { Card, Steps, Row, Col, Button, Modal, Tooltip } from "antd";
import { FireTwoTone, CaretUpOutlined, FlagTwoTone, RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { publicRequest } from "../../requestMethods";

const LevelSelector = (props) => {
    const user = JSON.parse(localStorage.getItem('userInfo'))
    const [selected, setSelected] = useState(0);
    const [secondSelected, setSecondSelected] = useState(7);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [score, setScore] = useState();
    console.log(props.userScore);
    const handleToRoadMap = async () => {
        try {
            const res = await publicRequest.post(`/userLevels`, {
                userId: user.id,
                levelName: para[selected].title,
                levelStart: selected,
                levelEnd: secondSelected,
            });
            if (res && res.status === 200) {
                navigate('/roadmap');
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const [content, setContent] = useState({
        title: 'Foundation',
        description: 'Bạn có thể hiểu được các từ vựng dễ hiểu, các cụm từ thông dụng. Bạn có thể nắm được các cấu trúc ngữ pháp dựa trên quy tắc phổ biến nhất khi không cần phải đọc nhiều.',
        levelStart: 0,
        levelEnd: 219
    })
    const navigate = useNavigate();
    const heights = [40, 60, 80, 100, 120, 140, 160, 180];
    const para = [
        {
            title: 'Foundation',
            description: 'Bạn có thể hiểu được các từ vựng dễ hiểu, các cụm từ thông dụng. Bạn có thể nắm được các cấu trúc ngữ pháp dựa trên quy tắc phổ biến nhất khi không cần phải đọc nhiều.',
            levelStart: 0,
            levelEnd: 219
        },
        {
            title: 'Elementary 1',
            description: 'Có thể hiểu và sử dụng các cách diễn đạt quen thuộc hàng ngày. Bạn có thể tương tác một cách đơn giản nếu người kia nói chậm và rõ ràng.',
            levelStart: 220,
            levelEnd: 345
        },
        {
            title: 'Elementary 2',
            description: 'Có thể hiểu được những thông tin rất cơ bản về cá nhân và gia đình, mua sắm, địa lý địa phương, việc làm,...). Bạn có thể giao tiếp một cách đơn giản và trực tiếp.',
            levelStart: 346,
            levelEnd: 469
        },
        {
            title: 'Intermediate 1',
            description: 'Bạn có thể chủ động bắt đầu và duy trì các cuộc trò chuyện trực tiếp có thể dự đoán được và đáp ứng các nhu cầu xã hội hạn chế.',
            levelStart: 470,
            levelEnd: 600
        },
        {
            title: 'Intermediate 2',
            description: 'Bạn có thể hiểu được những ý chính trong các văn bản, tài liệu. Bạn có thể giải quyết hầu hết các tình huống khi đi du lịch. Bạn có thể tạo ra văn bản đơn giản.',
            levelStart: 601,
            levelEnd: 729
        },
        {
            title: 'Advanced 1',
            description: 'Bạn có thể đáp ứng được những yêu cầu hạn chế trong công việc và hầu hết các nhu cầu xã hội.',
            levelStart: 730,
            levelEnd: 795
        },
        {
            title: 'Advanced 2',
            description: 'Bạn có thể hiểu được các ý chính của văn bản phức tạp, bao gồm cả các thảo luận chuyên ngành. Bạn có thể tương tác với người bản xứ.',
            levelStart: 796,
            levelEnd: 990
        },
        {
            title: 'Proficiency',
            description: 'Bạn có thể diễn đạt bản thân một cách trôi chảy và tự nhiên. Bạn có thể sử dụng ngôn ngữ một cách linh hoạt và hiệu quả.',
            levelStart: 991,
            levelEnd: 1000
        },
    ]
    useEffect(() => {
        if (props.userScore !== null) {
            for (let i = 0; i < para.length - 1; i++) {
                if (props.userScore >= para[i].levelStart && props.userScore <= para[i].levelEnd) {
                    setSelected(i);
                }
            }
        }
    }, [props.userScore]);
    const handleClick = (index) => {
        setSelected(index);
        setContent({
            title: para[index].title,
            description: para[index].description
        })
    }

    const handleSecondClick = (index) => {
        if (index < props.roadmapSelected) {
            setIsModalOpen(true);
        } else {
            setSecondSelected(index);
            setContent({
                title: para[index].title,
                description: para[index].description
            })
        }

    }

    const handlePropsNextClick = (value) => {
        props.handleNextClick(value);
    }
    return (

        <div>
            {props.next === false &&
                <div className="levelSelectorContainer">
                    <div className="levelSelectorTitle" style={{ margin: '0 auto', textAlign: 'center', marginTop: 50, fontSize: 25 }}>
                        <div style={{ fontWeight: 700 }}>Thiết lập lộ trình hiện tại</div>
                        <div>Nhấn vào cột để chọn trình độ hiện tại của bạn</div>
                    </div>

                    <div className="levelSelectorContent" style={{ justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: '50px', width: '70%', display: 'flex', flexDirection: 'row' }}>
                        <Card style={{ width: '75%', }} title={null}>
                            <Row gutter={[16, 16]}>
                                {props.userScore === undefined && [...Array(7)].map((_, index) => (
                                    <Col key={index} span={3} onClick={() => handleClick(index)}>
                                        <div style={{ marginRight: 'auto', marginLeft: 'auto', fontSize: '25px', width: '50px', textAlign: 'center', marginTop: `${heights[heights.length - 1 - index]}px`, visibility: `${selected === index ? '' : 'hidden'}` }}><FireTwoTone /></div>
                                        <Card
                                            hoverable
                                            style={{ backgroundColor: `${selected === index ? '#1677ff' : 'rgb(223, 226, 242)'}`, width: '50px', height: `${heights[index]}px`, marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}
                                        >
                                        </Card>
                                    </Col>
                                ))}
                                {props.userScore !== undefined && [...Array(7)].map((_, index) => (
                                    <Tooltip title="Hãy chọn level thấp hơn">
                                        <Col key={index} span={3}>
                                            <div style={{ marginRight: 'auto', marginLeft: 'auto', fontSize: '25px', width: '50px', textAlign: 'center', marginTop: `${heights[heights.length - 1 - index]}px`, visibility: `${selected === index ? '' : 'hidden'}` }}><FireTwoTone /></div>
                                            <Card
                                                hoverable
                                                style={{ backgroundColor: `${(selected === index) ? '#1677ff' : 'rgb(223, 226, 242)'}`, width: '50px', height: `${heights[index]}px`, marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}
                                            >
                                            </Card>
                                        </Col>
                                    </Tooltip>

                                ))}
                                <Tooltip title="Hãy chọn level thấp hơn">
                                    <Col key={7} span={3}>
                                        <div style={{ marginRight: 'auto', marginLeft: 'auto', fontSize: '25px', width: '50px', textAlign: 'center', marginTop: `${heights[heights.length - 1 - 7]}px`, visibility: `${selected === 7 ? '' : 'hidden'}` }}><FireTwoTone /></div>
                                        <Card
                                            hoverable
                                            style={{ backgroundColor: 'rgb(223, 226, 242)', width: '50px', height: `${heights[7]}px`, marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}
                                        >
                                        </Card>
                                    </Col>
                                </Tooltip>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <div style={{ borderRadius: '20px', height: 20, width: '100%', marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgb(223, 226, 242)' }}>
                                    {[...Array(8)].map((_, index) => (
                                        <Col key={index} span={3}>
                                            <div style={{ marginLeft: 'auto', marginRight: 'auto', color: '#1677ff', fontSize: '20px', width: '50px', textAlign: 'center', visibility: `${selected === index ? '' : 'hidden'}` }}><CaretUpOutlined /></div>
                                        </Col>
                                    ))}
                                </div>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <div style={{ borderRadius: '20px', height: 20, width: '100%', marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    {[...Array(8)].map((_, index) => (
                                        <Col key={index} span={3}>
                                            <div style={{ fontSize: '10px', fontWeight: 'bold', marginRight: 'auto', marginLeft: 'auto', width: '70px', textAlign: 'center' }}>{para[index].title}</div>
                                        </Col>
                                    ))}
                                </div>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <div style={{ borderRadius: '20px', height: 20, width: '100%', marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    {[...Array(8)].map((_, index) => (
                                        <Col key={index} span={3}>
                                            <div style={{ fontSize: '13px', marginRight: 'auto', marginLeft: 'auto', width: '70px', textAlign: 'center' }}>{para[index].levelStart} - {para[index].levelEnd}</div>
                                        </Col>
                                    ))}
                                </div>
                            </Row>
                        </Card>
                        <Card style={{ width: '20%', fontSize: 16 }} title={null}>
                            <div style={{ textAlign: 'center', fontWeight: '700', marginBottom: '20px' }}>{content.title}</div>
                            <div style={{ height: '200px' }}>{content.description}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginTop: '50px' }}>
                                <Button icon={<RightOutlined />} style={{ marginBottom: 20 }} type="primary" onClick={() => handlePropsNextClick(selected)}>Tiếp tục</Button>
                                <Button onClick={() => props.handleEntranceClick(0)} icon={<LeftOutlined />}>Quay lại</Button>
                            </div>
                        </Card>

                    </div>

                </div >
            }
            {props.next === true &&
                <div className="levelSelectorContainer">
                    <Modal title="Lưu ý" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <p>Chọn level mong muốn cao hơn level hiện tại</p>

                    </Modal>
                    <div className="levelSelectorTitle" style={{ margin: '0 auto', textAlign: 'center', marginTop: 50, fontSize: 25 }}>
                        <div style={{ fontWeight: 700 }}>Bạn muốn đạt đến trình độ TOEIC nào?</div>
                        <div>Nhấn vào cột để chọn điểm mục tiêu của bạn</div>
                    </div>

                    <div className="levelSelectorContent" style={{ justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: '50px', width: '70%', display: 'flex', flexDirection: 'row' }}>
                        <Card style={{ width: '75%', }} title={null}>
                            <Row gutter={[16, 16]}>
                                {[...Array(8)].map((_, index) => (
                                    <Col key={index} span={3} onClick={() => handleSecondClick(index)}>
                                        {secondSelected !== index &&
                                            <div style={{ marginRight: 'auto', marginLeft: 'auto', fontSize: '25px', width: '50px', textAlign: 'center', marginTop: `${heights[heights.length - 1 - index]}px`, visibility: `${index === props.roadmapSelected ? '' : 'hidden'}` }}><FireTwoTone /></div>
                                        }
                                        {secondSelected === index &&
                                            <div style={{ marginRight: 'auto', marginLeft: 'auto', fontSize: '25px', width: '50px', textAlign: 'center', marginTop: `${heights[heights.length - 1 - index]}px`, visibility: `${index === secondSelected ? '' : 'hidden'}` }}><FlagTwoTone twoToneColor="#52c41a" /></div>
                                        }
                                        <Card

                                            hoverable
                                            style={{
                                                pointerEvents: props.roadmapSelected === index ? 'none' : '',
                                                backgroundColor: props.roadmapSelected !== index
                                                    ? (secondSelected === index ? 'green' : 'rgb(223, 226, 242)')
                                                    : '#1677ff', width: '50px', height: `${heights[index]}px`, marginTop: '20px', marginLeft: 'auto', marginRight: 'auto'
                                            }}
                                        >
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            <Row gutter={[16, 16]}>
                                <div style={{ borderRadius: '20px', height: 20, width: '100%', marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgb(223, 226, 242)' }}>
                                    {[...Array(8)].map((_, index) => (
                                        <Col key={index} span={3}>
                                            <div style={{ marginRight: 'auto', marginLeft: 'auto', color: 'green', fontSize: '20px', width: '50px', textAlign: 'center', visibility: `${secondSelected === index ? '' : 'hidden'}` }}><CaretUpOutlined /></div>
                                        </Col>
                                    ))}
                                </div>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <div style={{ borderRadius: '20px', height: 20, width: '100%', marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    {[...Array(8)].map((_, index) => (
                                        <Col key={index} span={3}>
                                            <div style={{ fontSize: '10px', fontWeight: 'bold', marginRight: 'auto', marginLeft: 'auto', width: '70px', textAlign: 'center' }}>{para[index].title}</div>
                                        </Col>
                                    ))}
                                </div>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <div style={{ borderRadius: '20px', height: 20, width: '100%', marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    {[...Array(8)].map((_, index) => (
                                        <Col key={index} span={3}>
                                            <div style={{ fontSize: '13px', marginRight: 'auto', marginLeft: 'auto', width: '70px', textAlign: 'center' }}>{para[index].levelStart} - {para[index].levelEnd}</div>
                                        </Col>
                                    ))}
                                </div>
                            </Row>
                        </Card>
                        <Card style={{ width: '20%', fontSize: 16 }} title={null}>
                            <div style={{ textAlign: 'center', fontWeight: '700', marginBottom: '20px' }}>{content.title}</div>
                            <div style={{ height: '200px' }}>{content.description}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginTop: '50px' }}>
                                <Button icon={<RightOutlined />} style={{ marginBottom: 20 }} type="primary" onClick={() => handleToRoadMap()}>Tiếp tục</Button>
                                <Button onClick={() => handlePropsNextClick(0)} icon={<LeftOutlined />}>Quay lại</Button>

                            </div>
                        </Card>

                    </div>

                </div >
            }
        </div >
    );
};

export default LevelSelector; 