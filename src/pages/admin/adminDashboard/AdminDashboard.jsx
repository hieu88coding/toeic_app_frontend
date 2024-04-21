import React, { useState } from 'react';
import {
    AudioOutlined,
    BulbOutlined,
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { AdminHeader } from '../../../components/adminHeader/AdminHeader';
import { AdminCRUD } from '../../../components/adminCRUD/AdminCRUD';
import { MessageOutlined } from '@mui/icons-material';
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
    getItem('User', 'sub1', <UserOutlined />),
    getItem('Mock Tests', 'mockTests', <DesktopOutlined />),
    getItem('Listenings', 'listenings', <AudioOutlined />),
    getItem('Readings', 'readings', <TeamOutlined />),
    getItem('Grammars', 'grammars', <FileOutlined />),
    getItem('Vocabularys', 'vocabularys', <MessageOutlined />),
    getItem('Blogs', 'blogs', <BulbOutlined />),
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