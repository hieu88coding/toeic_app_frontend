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
            console.log("target", target);
            if (target) {
                const key = target.getAttribute('data-menu-id');
                const path = target.getAttribute('path');
                if (key && path) {
                    navigate(path);
                }
            }
        };

        const menuElements = document.querySelectorAll('.ant-space-item .ant-menu-item');
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
                    onClick={onMegaMenuItemClick}
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
                            path: '/mocks',
                        },
                        {
                            label: "Học theo lộ trình",
                            key: "mg2",
                            icon: <CheckOutlined />,
                            path: '/'
                        },
                        {
                            label: "Học từ vựng",
                            key: "mg3",
                            icon: <SortAscendingOutlined />,
                            path: '/vocabulary'
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
                            label: "Học bổ trợ",
                            key: "mg4",
                            icon: <HighlightOutlined />,
                        },
                        {
                            label: "Lịch sử học",
                            key: "mg5",
                            icon: <HistoryOutlined />
                        },
                        {
                            label: "Tips làm bài",
                            key: "mg6",
                            icon: <PlusCircleOutlined />
                        },
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
        key: 'mocks',
        icon: <HighlightOutlined />,
    },
    {
        label: 'Học theo lộ trình',
        key: '',
        icon: <CheckOutlined />,
    },
    {
        label: "Học từ vựng",
        key: 'vocabulary',
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

export const TopMenu = (props) => {
    const [current, setCurrent] = useState(props.active);
    const navigate = useNavigate();
    const onClick = (e) => {
        setCurrent(e.key);
        if (e.key !== 'm1' && e.key !== 'MegaMenu') {
            navigate(`/${e.key}`);
        }
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