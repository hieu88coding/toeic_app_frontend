import "./adminHeader.scss";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import {
    MessageOutlined, MailOutlined, PhoneOutlined, DownOutlined, UserOutlined, HeartOutlined,
    LogoutOutlined

} from "@ant-design/icons";
import { Dropdown, Space } from 'antd';
import baseAvatar from '../../assets/Sample_User_Icon.png'
import { Link, useNavigate, useLocation } from "react-router-dom";



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

export const AdminHeader = () => {
    return (
        <div className="adminHeaderContainer">
            <div className="adminHeaderBanner">
                <div className="adminHeaderLogo">
                    HieuCaoToeic88
                </div>
                <div className="adminHeaderRight">
                    <div className="adminHeaderInfo">
                        <div className="adminHeaderName">Welcome back, Bao Hieu</div>
                        <div className="adminHeaderAvatar">
                            <img src={baseAvatar} />
                        </div>
                        <div className="adminHeaderMenu">
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