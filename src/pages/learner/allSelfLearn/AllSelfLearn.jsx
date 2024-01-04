import * as React from "react";
import { useState, useEffect } from "react";
import "./allSelfLearn.scss";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import { Card, Row, Col } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate } from "react-router-dom";




const AllSelfLearn = () => {
    const [stats, setStats] = useState({});
    const navigate = useNavigate();
    const getStats = async () => {
        try {
            const res = await publicRequest.get(`/mockTests`);
            console.log(res);
            setStats(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    };
    // useEffect(() => {
    //     getStats();
    // }, []);
    console.log(stats);
    return (
        <div>
            <Topbar></Topbar>
            <TopMenu active={"vocabulary"}></TopMenu>
            <div className="allSelfLearnContainer">
                <Card title={"Kho từ vựng theo chủ đề"} style={{ width: "65%", marginTop: 20, marginRight: 30 }}>
                    <Link>
                        <div className="mocksContent">
                            <Row
                                gutter={[24, 24]}
                            >
                                <Col className="gutter-row" span={6}>
                                    <Card title={null}>
                                        <div>lul</div>
                                    </Card>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Card title={null}>
                                        <div>lul</div>
                                    </Card>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Card title={null}>
                                        <div>lul</div>
                                    </Card>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Card title={null}>
                                        <div>lul</div>
                                    </Card>
                                </Col>
                            </Row>
                        </div>

                    </Link>
                </Card>
                <Card title="Bao Hieu" extra={<UserOutlined />} style={{ width: "35%", marginTop: 20 }} >
                    <div className="text-content" style={{ backgroundColor: "#f1f2f4", borderRadius: 15, padding: 15 }}>
                        <p>I can accept failure, everyone fails at something. But I can’t accept not trying.</p
                        ><p>Tôi có thể chấp nhận thất bại, mọi người đều thất bại ở một việc gì đó. Nhưng tôi không chấp nhận việc không cố gắng.</p>
                        <p className="text-right">– Michael Jordan</p>
                    </div>
                </Card>
            </div>

        </div>
    );
};

export default AllSelfLearn; 