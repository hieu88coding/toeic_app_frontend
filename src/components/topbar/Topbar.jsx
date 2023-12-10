import "./topbar.scss";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import {
    MessageOutlined, MailOutlined, PhoneOutlined, DownOutlined, UserOutlined, HeartOutlined,
    LogoutOutlined

} from "@ant-design/icons";
import { Dropdown, Space } from 'antd';
import baseAvatar from '../../assets/Sample_User_Icon.png'



const items = [
    {
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                1st menu item
            </a>
        ),
        icon: <UserOutlined />,
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                2nd menu item (disabled)
            </a>
        ),
        icon: <HeartOutlined />,
    },
    {
        type: 'divider',
    },
    {
        key: '3',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                2nd menu item (disabled)
            </a>
        ),
        icon: <LogoutOutlined />
    },
];

export const Topbar = () => {
    return (
        <div className="topbarContainer">
            <div className="topBarBanner">
                <div className="topBarLogo">
                    HieuCaoToeic88
                </div>
                <div className="topBarRight">
                    <div className="topBarContact">
                        <MailOutlined />
                        <MessageOutlined />
                        <PhoneOutlined />
                    </div>
                    <div className="topBarInfo">
                        <div className="topBarName">Bao Hieu</div>
                        <div className="topBarAvatar">
                            <img src={baseAvatar} />
                        </div>
                        <div className="topBarMenu">
                            <Dropdown
                                menu={{
                                    items,
                                }}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <DownOutlined />
                                    </Space>
                                </a>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};