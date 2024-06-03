import * as React from "react";
import { useState, useEffect } from "react";
import "./allSelfLearn.scss";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import { Card, Row, Col, Avatar } from "antd";
import { UserOutlined, DownOutlined, SettingOutlined, EditOutlined, EllipsisOutlined } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate } from "react-router-dom";



const { Meta } = Card;
const AllSelfLearn = () => {
    const [stats, setStats] = useState([]);
    const navigate = useNavigate();
    const handleClick = (stat) => {
        navigate(`/vocabulary/${stat.topicName}`);
    };
    const getStats = async () => {
        try {
            const res = await publicRequest.get(`/vocabularys`);
            console.log(res);
            setStats(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    };
    useEffect(() => {
        getStats();
    }, []);
    return (
        <div>
            <Topbar></Topbar>
            <TopMenu active={"vocabulary"}></TopMenu>
            <div className="allSelfLearnContainer">
                <Card title={"Kho từ vựng theo chủ đề"} style={{ width: "100%", marginTop: 20, marginRight: 'auto', marginLeft: 'auto' }}>

                    <div className="mocksContent">
                        <Row
                            gutter={[24, 24]}
                        >
                            {stats && stats.map((stat, index) => (
                                <Col className="gutter-row" span={8} key={index} style={{ width: '100%' }}>

                                    <Card
                                        onClick={() => handleClick(stat)} style={{ cursor: 'pointer' }}
                                        hoverable={true}
                                        className="hoverable-card"
                                        cover={
                                            <img
                                                alt="example"
                                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                            />
                                        }
                                    >
                                        <Meta
                                            title={stat.topicName}
                                            description={`20 Từ vựng chủ đề ${stat.topicName}`}
                                        />
                                    </Card>


                                </Col>
                            ))}
                        </Row>
                    </div>


                </Card>
            </div>

        </div>
    );
};

export default AllSelfLearn; 