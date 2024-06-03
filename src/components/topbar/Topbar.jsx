import "./topbar.scss";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import {
    LoginOutlined, DownOutlined, UserOutlined, HeartOutlined,
    LogoutOutlined

} from "@ant-design/icons";
import { Dropdown, Space } from 'antd';
import baseAvatar from '../../assets/Sample_User_Icon.png'
import toeic88Logo from '../../assets/toeic88Logo.png'

import { Link, useNavigate, useLocation } from "react-router-dom";





export const Topbar = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'))
    const items = user ? [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    Trang cá nhân
                </a>
            ),
            icon: <UserOutlined />,
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    Kết quả học tập
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
                <a target="_blank" rel="noopener noreferrer" href="http://localhost:5173/login">
                    Đăng xuất
                </a>
            ),
            icon: <LogoutOutlined />
        },
    ] : [
        {
            key: '99',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="http://localhost:5173/login">
                    Đăng nhập
                </a>
            ),
            icon: <LoginOutlined />
        }
    ];

    return (
        <div className="topbarContainer">
            <div className="topBarBanner">
                <Link style={{ display: 'flex', alignItems: 'center' }} to={'/'}>
                    <div className="topBarLogo">
                        <img style={{ maxWidth: '100%', height: 'auto' }} src={toeic88Logo} />
                    </div>
                </Link>
                <div className="topBarRight">
                    <div className="topBarInfo">
                        <div className="topBarName">{user ? <span>Welcome back, <span style={{ color: '#1677ff' }}>{user?.firstName} {user?.lastName}</span>  </span> : ""} </div>
                        <div className="topBarAvatar">
                            <img src={user ? user.picture : baseAvatar} />
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
        </div>
    );
};