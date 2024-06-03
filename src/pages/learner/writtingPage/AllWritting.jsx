import * as React from "react";
import { useState, useEffect } from "react";
import "./allWritting.scss";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import { Card, Space, Dropdown, Collapse, Divider } from "antd";
import { UserOutlined, DownOutlined, ReadFilled } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PartMenu from "../../../components/partMenu/PartMenu";

const AllWritting = () => {
    const [stats, setStats] = useState({});
    const navigate = useNavigate();
    const testCode = useLocation().pathname?.split("/")[3];
    const testType = useLocation().pathname?.split("/")[1];
    const [partEnglishName, setPartEnglishName] = useState('');
    const [divsItem, setDivsItem] = useState([]);
    const [codeState, setCodeState] = useState(testCode);
    const partDetection = () => {
        switch (testCode) {
            case 'part1':
                setPartEnglishName('Part 1 - Trả lời yêu cầu')
                break;
            case 'part2':
                setPartEnglishName('Part 2 - Trình bày quan điểm')
                break;

            default:
                setPartEnglishName('default')
                break;
        }
    }
    const getStats = async () => {
        try {
            const res = await publicRequest.get(`/${testType}/${partEnglishName}`);
            console.log(res);
            setStats(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    };
    useEffect(() => {
        getStats();
    }, [partEnglishName]);
    useEffect(() => {
        partDetection();
    }, [codeState]);
    useEffect(() => {
        setCodeState(testCode);
    }, [testCode]);
    useEffect(() => {
        setDivsItem(generateDivs());
    }, [stats]);

    const onClick = ({ key }) => {
        console.log(key);
        navigate(`/exam/${stats[0].testName}/${key}`)
    };
    const generateDivs = () => {
        const divs = [];

        for (let i = 0; i < stats.length; i++) {
            const div = <div onClick={() => navigate(`/${testType}/practice/${testCode}/Test${i + 1}`)} style={{ cursor: 'pointer' }} className="statsContainer" key={i}>
                <div className="statsNumber"><span className="statsIndex">0{i + 1}</span></div>
                <div className="statsIcon"><ReadFilled /></div>
                <div className="statsTestName">{stats[i].testName}</div>
                <div className="statsPercent">0%</div>
            </div>;
            divs.push(div);
        }

        return divs;
    }
    return (
        <div>
            <Topbar></Topbar>
            <TopMenu active={"sw"}></TopMenu>
            <div className="allWrittingContainer">
                <Collapse
                    style={{ width: '70%', backgroundColor: 'white', border: 'none' }}
                    defaultActiveKey="1"
                    size="large"
                    items={[
                        {
                            key: '1',
                            label: 'Bài luyện tập',
                            children: <div>{divsItem}</div>,
                        },
                    ]}
                />
                <PartMenu selected={testCode} />

            </div>

        </div>
    );
};

export default AllWritting; 