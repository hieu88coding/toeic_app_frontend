import "./topMenu.scss";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    BorderlessTableOutlined, CheckOutlined, SortAscendingOutlined,
    HistoryOutlined, PlusCircleOutlined, AimOutlined,
    HighlightOutlined, BarsOutlined, FireOutlined
} from "@ant-design/icons";
import { Menu, Space } from 'antd';



const items = [
    {
        label: 'Lộ trình',
        key: 'roadmap',
        icon: <HighlightOutlined />,
    },

    {
        label: 'Luyện L&R',
        key: 'lr',
        icon: <BarsOutlined />,
        // children: [
        //     {
        //         label: <MegaMenu />,
        //         key: "MegaMenu",
        //         style: {
        //             height: "fit-content",
        //             padding: 0,
        //             backgroundColor: "white",

        //         }
        //     }
        // ],
        children: [
            {
                type: 'group',
                children: [
                    {
                        label: 'Phần 1: Mô tả tranh',
                        key: 'listenings/practice/part1',
                    },
                    {
                        label: 'Phần 2: Hỏi & Đáp',
                        key: 'listenings/practice/part2',
                    },
                    {
                        label: 'Phần 3: Đoạn hội thoại',
                        key: 'listenings/practice/part3',
                    },
                    {
                        label: 'Phần 4: Bài nói ngắn',
                        key: 'listenings/practice/part4',
                    },
                    {
                        label: 'Phần 5: Hoàn thành câu',
                        key: 'readings/practice/part5',
                    },
                    {
                        label: 'Phần 6: Hoàn thành đoạn văn',
                        key: 'readings/practice/part6',
                    },
                    {
                        label: 'Phần 7: Đọc hiểu đoạn đơn',
                        key: 'readings/practice/part71',
                    },
                    {
                        label: 'Phần 7: Đọc hiểu đoạn kép',
                        key: 'readings/practice/part72',
                    },
                    {
                        label: 'Phần 2: Đọc hiểu đoạn ba',
                        key: 'readings/practice/part73',
                    },
                ],
            }
        ],
    },
    {
        label: 'Luyện S&W',
        key: 'sw',
        icon: <CheckOutlined />,
    },
    {
        label: 'Thi thử',
        key: 'mocks',
        icon: <FireOutlined />,
    },
    {
        label: "Ngữ pháp",
        key: 'grammars',
        icon: <SortAscendingOutlined />
    },
    {
        label: "Học từ vựng",
        key: 'vocabulary',
        icon: <AimOutlined />
    },
    {
        label: "Blog",
        key: 'blog',
        icon: <PlusCircleOutlined />
    }
];

export const TopMenu = (props) => {
    const [current, setCurrent] = useState(props.active);
    const navigate = useNavigate();
    const onClick = (e) => {
        setCurrent(e.key);
        navigate(`/${e.key}`);
    };
    console.log(props.active);
    return (
        <div className="topMenuContainer">
            <div className="topMenuOptions">
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="horizontal"
                    items={items}
                >

                </Menu>
            </div>
        </div>
    );
}