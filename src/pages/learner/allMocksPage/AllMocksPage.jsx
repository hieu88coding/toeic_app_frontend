import * as React from "react";
import { useState, useEffect } from "react";
import "./allMocksPage.scss";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import StepsBar from "../../../components/stepsBar/StepsBar";
import GrammarPractice from "../../../components/grammarPractice/GrammarPractice";
import { Card, Space, Dropdown } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate } from "react-router-dom";


const items = [
    {
        label: 'Làm full đề',
        key: '0',
    },
    {
        type: 'divider',
    },
    {
        label: 'Part 1',
        key: '1',
    },
    {
        label: 'Part 2',
        key: '2',
    },
    {
        label: 'Part 3',
        key: '3',
    },
    {
        label: 'Part 4',
        key: '4',
    },
    {
        label: 'Part 5',
        key: '5',
    },
    {
        label: 'Part 6',
        key: '6',
    },
    {
        label: 'Part 7',
        key: '7',
    },
];


const AllMocksPage = () => {
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
    useEffect(() => {
        getStats();
    }, []);
    const onClick = ({ key }) => {
        console.log(key);
        navigate(`/exam/${stats[0].testName}/${key}`)
    };
    console.log(stats);
    return (
        <div>
            <Topbar></Topbar>
            <TopMenu active={"mocks"}></TopMenu>
            <div className="allMocksPageContainer">
                <Card title={"Kho đề thi thử"} style={{ width: "65%", marginTop: 20, marginRight: 30 }}>
                    <Dropdown
                        menu={{
                            items,
                            onClick,
                        }}
                    >
                        <div className="mocksContent">
                            <a onClick={(e) => e.preventDefault()}>
                                <Space style={{ fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                                    {stats[0] && stats[0].testName}
                                </Space>
                            </a>
                        </div>

                    </Dropdown>
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

export default AllMocksPage; 