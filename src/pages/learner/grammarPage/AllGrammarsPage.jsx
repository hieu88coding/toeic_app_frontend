import * as React from "react";
import { useState, useEffect } from "react";
import "./allGrammarsPage.scss";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import { Card, Space, Dropdown, Collapse, Divider } from "antd";
import { UserOutlined, DownOutlined, ReadFilled } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PartMenu from "../../../components/partMenu/PartMenu";

const AllGrammarsPage = () => {
    const [stats, setStats] = useState({});
    const navigate = useNavigate();
    const testCode = useLocation().pathname?.split("/")[3];
    const testType = useLocation().pathname?.split("/")[1];
    const [partEnglishName, setPartEnglishName] = useState('');
    const [divsItem, setDivsItem] = useState([]);
    const [codeState, setCodeState] = useState(testCode);
    // const partDetection = () => {
    //     switch (testCode) {
    //         case 'part1':
    //             setPartEnglishName('Part 1 - Mô tả tranh')
    //             break;
    //         case 'part2':
    //             setPartEnglishName('Part 2 - Hỏi & Đáp')
    //             break;
    //         case 'part3':
    //             setPartEnglishName('Part 3 - Đoạn hội thoại')
    //             break;
    //         case 'part4':
    //             setPartEnglishName('Part 4 - Bài nói ngắn')
    //             break;
    //         case 'part5':
    //             setPartEnglishName('Part 5 - Hoàn thành câu')
    //             break;
    //         case 'part6':
    //             setPartEnglishName('Part 6 - Hoàn thành đoạn văn')
    //             break;
    //         case 'part71':
    //             setPartEnglishName('Part 7 - Đoạn đơn')
    //             break;
    //         case 'part72':
    //             setPartEnglishName('Part 7 - Đoạn kép')
    //             break;
    //         case 'part73':
    //             setPartEnglishName('Part 7 - Đoạn ba')
    //             break;

    //         default:
    //             setPartEnglishName('default')
    //             break;
    //     }
    // }
    const getStats = async () => {
        try {
            const res = await publicRequest.get(`/grammars`);
            console.log(res);
            setStats(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    };
    useEffect(() => {
        getStats();
    }, []);
    useEffect(() => {
        setDivsItem(generateDivs());
    }, [stats]);

    const onClick = ({ key }) => {
        console.log(key);
        navigate(`/grammar/${stats[0].testName}`)
    };
    const generateDivs = () => {
        const divs = [];

        for (let i = 0; i < stats.length; i++) {
            const div = <div onClick={() => navigate(`/grammars/Test${i + 1}`)} style={{ cursor: 'pointer' }} className="statsContainer" key={i}>
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
            <TopMenu active={"grammars"}></TopMenu>
            <div className="allGrammarsPageContainer">
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

export default AllGrammarsPage; 