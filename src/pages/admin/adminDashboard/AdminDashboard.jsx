import React, { useState, useEffect } from 'react';
import {
    AudioOutlined,
    BulbOutlined,
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    CommentOutlined,
    HighlightOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { AdminHeader } from '../../../components/adminHeader/AdminHeader';
import { AdminCRUD } from '../../../components/adminCRUD/AdminCRUD';
import { MessageOutlined } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MockTable } from '../../../components/adminTable/MockTable';
import { PartTable } from '../../../components/adminTable/PartTable';
import { SkillTable } from '../../../components/adminTable/SkillTable';
import { VocabTable } from '../../../components/adminTable/VocabTable';
import { BlogTable } from '../../../components/adminTable/BlogTable';
import { GrammarTable } from '../../../components/adminTable/GrammarTable';
import { ListeningsDetailTable } from '../../../components/adminTable/ListeningsDetailTable';
import { ReadingsDetailTable } from '../../../components/adminTable/ReadingsDetailTable';
import { GrammarDetailTable } from '../../../components/adminTable/GrammarDetailTable';
import { VocabDetailTable } from '../../../components/adminTable/VocabDetailTable';
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
    getItem('Dashboard', 'dashboard', <PieChartOutlined />),
    getItem('User', 'sub1', <UserOutlined />),
    getItem('Mock Tests', 'mockTests', <DesktopOutlined />),
    getItem('Listenings', 'listenings', <AudioOutlined />),
    getItem('Readings', 'readings', <TeamOutlined />),
    getItem('Speakings', 'speakings', <CommentOutlined />),
    getItem('Writtings', 'writtings', <HighlightOutlined />),
    getItem('Grammars', 'grammars', <FileOutlined />),
    getItem('Vocabularys', 'vocabularys', <MessageOutlined />),
    getItem('Blogs', 'blogs', <BulbOutlined />),
];
const AdminDashboard = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');
    const testCode = useLocation().pathname?.split("/")[2];
    const partName = useLocation().pathname?.split("/")[3];
    const navigate = useNavigate();
    const handleMenuSelect = ({ key }) => {
        setSelectedMenuItem(key);
        navigate(`/admin/${key}`);
    };
    // useEffect(() => {
    //     if (testCode) {
    //         setSelectedMenuItem(testCode)
    //     }
    // }, []);
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider>
                <div className="demo-logo-vertical" />
                <Menu onSelect={handleMenuSelect} theme="dark" defaultSelectedKeys={testCode ? [`${testCode}`] : ['dashboard']} mode="inline" items={items} />
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
                        {testCode && partName === undefined && (testCode === 'listenings' || testCode === 'readings') &&
                            // <div>
                            //     <AdminCRUD itemKey={selectedMenuItem} />
                            // </div>
                            <div>
                                <PartTable itemKey={selectedMenuItem} />
                            </div>

                        }

                        {testCode && partName === undefined && (testCode === 'speakings' || testCode === 'writtings') &&
                            // <div>
                            //     <AdminCRUD itemKey={selectedMenuItem} />
                            // </div>
                            <div>
                                <SkillTable itemKey={selectedMenuItem} />
                            </div>

                        }
                        {testCode && partName === undefined && (testCode == 'mockTests') &&
                            <div>
                                <AdminCRUD itemKey={selectedMenuItem} />
                            </div>
                        }
                        {testCode && partName === undefined && (testCode == 'vocabularys') &&
                            <div>
                                <VocabTable itemKey={selectedMenuItem} />
                            </div>
                        }
                        {testCode && partName === undefined && (testCode == 'blogs') &&
                            <div>
                                <BlogTable itemKey={selectedMenuItem} />
                            </div>
                        }
                        {testCode && partName === undefined && (testCode == 'grammars') &&
                            <div>
                                <GrammarTable itemKey={selectedMenuItem} />
                            </div>
                        }
                        {partName && (testCode == 'mockTests') &&
                            <div>
                                <MockTable itemKey={selectedMenuItem} />
                            </div>

                        }
                        {partName && (testCode == 'grammars') &&
                            <div>
                                <GrammarDetailTable itemKey={selectedMenuItem} />
                            </div>

                        }
                        {partName && (testCode == 'vocabularys') &&
                            <div>
                                <VocabDetailTable itemKey={selectedMenuItem} />
                            </div>

                        }
                        {partName && (testCode == 'listenings') &&
                            <div>
                                <ListeningsDetailTable itemKey={selectedMenuItem} />
                            </div>

                        }
                        {partName && (testCode == 'readings') &&
                            <div>
                                <ReadingsDetailTable itemKey={selectedMenuItem} />
                            </div>

                        }
                    </div>
                </Content>

            </Layout>
        </Layout>
    );
};
export default AdminDashboard;