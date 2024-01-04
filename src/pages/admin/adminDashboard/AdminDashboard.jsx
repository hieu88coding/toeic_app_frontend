import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { AdminHeader } from '../../../components/adminHeader/AdminHeader';
import { AdminCRUD } from '../../../components/adminCRUD/AdminCRUD';
//import { AdminAddItem } from '../../../components/adminCRUD/AdminAddItem';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem('Dashboard', 's1', <PieChartOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Mock Tests', 'mockTests', <DesktopOutlined />),
    getItem('Listenings', 'listenings', <DesktopOutlined />),
    getItem('Readings', 'readings', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Grammars', 'grammars', <FileOutlined />),
    getItem('Vocabularys', 'vocabularys', <FileOutlined />),
    getItem('Blogs', 'blogs', <FileOutlined />),
];
const AdminDashboard = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedMenuItem, setSelectedMenuItem] = useState('s1');

    const handleMenuSelect = ({ key }) => {
        console.log(key);
        setSelectedMenuItem(key);
    };
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider>
                <div className="demo-logo-vertical" />
                <Menu onSelect={handleMenuSelect} theme="dark" defaultSelectedKeys={['s1']} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        marginBottom: 50
                    }}
                >

                    <AdminHeader />
                </Header>
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {selectedMenuItem !== 's1' &&
                            <div>
                                <AdminCRUD itemKey={selectedMenuItem} />
                            </div>

                        }

                    </div>
                </Content>

            </Layout>
        </Layout>
    );
};
export default AdminDashboard;