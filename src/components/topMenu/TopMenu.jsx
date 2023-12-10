import "./topMenu.scss";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    BorderlessTableOutlined, CheckOutlined, SortAscendingOutlined,
    HistoryOutlined, PlusCircleOutlined, AimOutlined,
    HighlightOutlined, BarsOutlined
} from "@ant-design/icons";
import { Menu, Space } from 'antd';

const MegaMenu = () => {
    const navigate = useNavigate();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const onMegaMenuItemClick = (item) => {
        setSelectedKeys([item.key]);
        console.log("Selected Mega item", item.key);
    };
    useEffect(() => {
        const handleClick = (e) => {
            const target = e.target.closest('[data-menu-id]');
            console.log(target);
            if (target) {
                const key = target.getAttribute('data-menu-id');
                const path = target.getAttribute('path');
                if (key && path) {
                    navigate(path);
                }
            }
        };

        const menuElements = document.querySelectorAll('.ant-space-item .ant-menu-item');
        console.log(menuElements);
        menuElements.forEach((element) => {
            element.addEventListener('click', handleClick);
        });

        return () => {
            menuElements.forEach((element) => {
                element.removeEventListener('click', handleClick);
            });
        };
    }, []); // Chạy một lần duy nhất khi component được render lần đầu


    return (
        <div style={{ backgroundColor: "white" }}>
            <Space direction="horizontal" size={"large"}>
                <Menu
                    selectedKeys={selectedKeys}
                    style={{
                        width: "15vw",
                        boxShadow: "none", border: "none",
                        color: "#6c757d",
                        fontSize: "16px",
                    }}
                    items={[
                        {
                            label: "Đề thi đầy đủ",
                            key: "mg1",
                            icon: <BorderlessTableOutlined />,
                            path: '/exam',
                        },
                        {
                            label: "Học theo lộ trình",
                            key: "mg2",
                            icon: <CheckOutlined />,
                            path: '/'
                        },
                        {
                            label: "Học ngữ pháp",
                            key: "mg3",
                            icon: <SortAscendingOutlined />
                        }
                    ]}
                />
                <Menu
                    onClick={onMegaMenuItemClick}
                    selectedKeys={selectedKeys}
                    style={{
                        width: "15vw", boxShadow: "none", border: "none", color: "#6c757d",
                        fontSize: "16px",
                    }}
                    items={[
                        {
                            label: "Lịch sử học",
                            key: "mg4",
                            icon: <HistoryOutlined />
                        },
                        {
                            label: "Tips làm bài",
                            key: "mg5",
                            icon: <PlusCircleOutlined />
                        },
                        {
                            label: "Học part 1",
                            key: "mg6",
                            icon: <HighlightOutlined />
                        }
                    ]}
                />
                <Menu
                    onClick={onMegaMenuItemClick}
                    selectedKeys={selectedKeys}
                    style={{
                        width: "15vw", boxShadow: "none", border: "none", color: "#6c757d",
                        fontSize: "16px",
                    }}
                    items={[
                        {
                            label: "Học part 2",
                            key: "mg7",
                            icon: <HighlightOutlined />
                        },
                        {
                            label: "Học part 3",
                            key: "mg8",
                            icon: <HighlightOutlined />
                        },
                        {
                            label: "Học part 4",
                            key: "mg9",
                            icon: <HighlightOutlined />
                        }
                    ]}
                />
                <Menu
                    onClick={onMegaMenuItemClick}
                    selectedKeys={selectedKeys}
                    style={{
                        width: "15vw", boxShadow: "none", border: "none", color: "#6c757d",
                        fontSize: "16px",
                    }}
                    items={[
                        {
                            label: "Học part 5",
                            key: "mg10",
                            icon: <HighlightOutlined />
                        },
                        {
                            label: "Học part 6",
                            key: "mg11",
                            icon: <HighlightOutlined />
                        },
                        {
                            label: "Học part 7",
                            key: "mg12",
                            icon: <HighlightOutlined />
                        }
                    ]}
                />
            </Space>

        </div>
    )
}


const items = [
    {
        label: 'Truy cập nhanh',
        key: 'm1',
        icon: <BarsOutlined />,
        children: [
            {
                label: <MegaMenu />,
                key: "MegaMenu",
                style: {
                    height: "fit-content",
                    padding: 0,
                    backgroundColor: "white",

                }
            }
        ],
    },
    {
        label: 'Thi thử',
        key: 'm2',
        icon: <HighlightOutlined />,
    },
    {
        label: 'Học theo lộ trình',
        key: 'm3',
        icon: <CheckOutlined />,
    },
    {
        label: "Tự học TOEIC",
        key: 'm4',
        icon: <AimOutlined />
    },
    {
        label: "Học bổ trợ",
        key: 'm5',
        icon: <SortAscendingOutlined />
    },
    {
        label: "Tips làm bài",
        key: 'm6',
        icon: <PlusCircleOutlined />
    }
];

export const TopMenu = () => {
    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
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