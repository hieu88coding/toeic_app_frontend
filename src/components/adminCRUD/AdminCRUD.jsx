import React, { useState, useEffect } from 'react';
import { LibraryAdd, Warning } from "@mui/icons-material";
import {
    Button,
    Table,
    Form,
    Dropdown,
    Space
} from "antd";
import { DeleteOutlined, SaveOutlined, EditOutlined, RightOutlined } from "@ant-design/icons";
import { useAuthUser } from "react-auth-kit";
import { useToastError, useToastSuccess } from "../../utils/toastSettings";
import { publicRequest, userRequest } from "../../requestMethods";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { WarningModal } from '../warningModal/WarningModal';
import CustomizedMenus from './CustomizedMenus';
import CreateTest from '../../pages/admin/createTest/CreateTest'
import CreateListening from '../../pages/admin/createLevel/CreateListening';
import CreateReading from '../../pages/admin/createLevel/CreateReading';
import CreateVocab from '../../pages/admin/createVocab/CreateVocab';



const DeleteOneProductBtn = () => {
    return (
        <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            ghost
            style={{ width: '100%' }}
        >
            Xóa
        </Button>
    );
};

export const AdminCRUD = (props) => {
    console.log('admin crud');
    const [stats, setStats] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 6;
    const [totalCount, setTotalCount] = useState(1);
    const authUser = useAuthUser();
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState("");
    const isEditing = (record) => record.id === editingKey;
    const navigate = useNavigate();
    const testCode = useLocation().pathname.split("/")[2];

    const handleDeleteSingleProduct = async (data) => {
        try {
            let res = await userRequest.delete(`/mockTests/${data.id}`);
            if (res.status === 200) {
                navigate(0);
            } else return useToastError("Xóa sản phẩm thất bại");
        } catch (error) {
            console.log(error);
        }
    };


    const handleOpenChange = (newValue) => {
        setIsOpen(newValue);
    };

    const getProducts = async () => {
        try {
            let res = await publicRequest.get(
                `/${testCode}`
            );
            console.log(res);
            if (res.status === 200) {
                setProducts(res.data);
                // setPage(currentPage);
            } else return useToastError("Something went wrong!");
        } catch (error) {
            console.log(error);
        }

    };

    useEffect(() => {
        handleProps();
        getProducts();
    }, [props.itemKey]);

    const columns = [
        {
            title: "Test ID",
            dataIndex: "id",
            align: "center",
        },
        {
            title: "Tên Test",
            dataIndex: "testName",
            align: "center",
        },
        {
            dataIndex: "action",
            width: "18vw",
            align: "center",
            render: (_, record) => {
                const items = [
                    {
                        key: '1',
                        label: (
                            <Button
                                type="primary"
                                icon={<DeleteOutlined />}
                                ghost
                                onClick={() => navigate(`/admin/${props.itemKey}/${record.testName}`)}
                            >
                                Xem chi tiết
                            </Button>
                        ),
                    },
                    {
                        key: '2',
                        label: (
                            <WarningModal
                                confirmFunction={handleDeleteSingleProduct}
                                parameters={'troll'}
                                warningContent={"Bạn chắc muốn xóa sản phẩm này chứ?"}
                                InitiateComponent={DeleteOneProductBtn}
                            />
                        ),
                    },
                ];
                return (
                    <div>
                        <Dropdown
                            menu={{
                                items,
                                selectable: true,
                            }}
                            placement="bottomLeft"
                            arrow={{
                                pointAtCenter: true,
                            }}
                        >
                            <Space >
                                <Button size='large' style={{ borderColor: '#1677ff', color: '#1677ff' }}>Thao tác</Button>
                            </Space>
                        </Dropdown>
                    </div>
                )
            },
        },
    ];

    useEffect(() => {
        setData(products);
    }, [products]);
    const handleProps = () => {
        switch (props.itemKey) {
            case 'mockTests':
                setStats('Mock Tests');
                break;
            case 'listenings':
                setStats('Listenings');
                break;
            case 'readings':
                setStats('Readings');
                break;
            case 'grammars':
                setStats('Grammars');
                break;
            case 'vocabularys':
                setStats('Vocabularys');
                break;
            case 'blogs':
                setStats('Blogs');
                break;
            default:
                setStats('Errors');
                break;
        }
    }


    return (
        <div>
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>{stats}</div>
            <div>
                {(props.itemKey === 'mockTests') &&
                    <CreateTest
                        dataTest={data}
                        testName={props.itemKey}
                        style={{ textAlign: "center" }}
                        isOpenModal={isOpen}
                        handleOpenChange={handleOpenChange}
                    />
                }
                {props.itemKey === 'listenings' &&
                    <CreateListening
                        dataTest={data}
                        testName={props.itemKey}
                        style={{ textAlign: "center" }}
                        isOpenModal={isOpen}
                        handleOpenChange={handleOpenChange}
                    />

                }
                {props.itemKey === 'readings' &&
                    <CreateReading
                        dataTest={data}
                        testName={props.itemKey}
                        style={{ textAlign: "center" }}
                        isOpenModal={isOpen}
                        handleOpenChange={handleOpenChange}
                    />

                }
                {props.itemKey === 'vocabularys' &&
                    <CreateVocab
                        dataTest={data}
                        testName={props.itemKey}
                        style={{ textAlign: "center" }}
                        isOpenModal={isOpen}
                        handleOpenChange={handleOpenChange}
                    />

                }
            </div>

            <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'flex-end' }} className="uploadExcelBtn">
                <CustomizedMenus
                    handleOpenChange={handleOpenChange}
                    isOpenModal={isOpen}
                />
            </div>
            <Form form={form} component={false}>
                <Table
                    rowKey={(record) => record + Math.floor(Math.random() * 1000)}
                    bordered
                    dataSource={data}
                    columns={columns}
                    pagination={{
                        pageSize: pageSize,
                        current: page,
                        total: totalCount,
                        onChange: (page) => {
                            //getProducts(page);
                        },
                    }}
                />
            </Form>
        </div>


    );
};
