import React, { useState, useEffect, useRef } from 'react';
import { LibraryAdd, Warning } from "@mui/icons-material";
import {
    Button,
    Table,
    Form,
    Dropdown,
    Space,
    Input,
    Spin
} from "antd";
import Highlighter from 'react-highlight-words';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SearchOutlined, LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuthUser } from "react-auth-kit";
import { useToastError, useToastSuccess } from "../../utils/toastSettings";
import { publicRequest, userRequest } from "../../requestMethods";
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { WarningModal } from '../warningModal/WarningModal';
import CustomizedMenus from '../adminCRUD/CustomizedMenus';
import {
    ref,
    getDownloadURL,
    listAll,
} from "firebase/storage";
import { storage } from '../../firebase';
import axios from "axios";
import CreateVocab from '../../pages/admin/createVocab/CreateVocab';
import CreateListening from '../../pages/admin/createLevel/CreateListening';
import CreateReading from '../../pages/admin/createLevel/CreateReading';

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


export const VocabTable = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const authUser = useAuthUser();
    const [data, setData] = useState([]);
    const [partState, setPartState] = useState('');
    const testCode = useLocation().pathname.split("/")[2];
    const navigate = useNavigate();
    const dataCol = [];
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
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

    const getProducts = async () => {
        try {
            let res = await publicRequest.get(
                `/${testCode}`
            );
            console.log(res);
            if (res.status === 200) {
                setData(res.data);
                // setPage(currentPage);
            } else return useToastError("Something went wrong!");
        } catch (error) {
            console.log(error);
        }

    };

    useEffect(() => {
        getProducts();
        setPartState(props.itemKey)
        console.log(props.itemKey);
    }, [props.itemKey]);

    const handleOpenChange = (newValue) => {
        setIsOpen(newValue);
    };
    const columns = [
        {
            title: 'Số thứ tự',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Tên Topic',
            dataIndex: 'topicName',
            key: 'topicName',
            width: '30%',
            ...getColumnSearchProps('answer'),
        },
        {
            dataIndex: "action",
            width: "20%",
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
                                onClick={() => navigate(`/admin/${props.itemKey}/${record.topicName}`)}
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




    return (
        <div>
            <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 50 }}>{testCode}</div>

            <CreateListening
                dataTest={data}
                testName={partState}
                style={{ textAlign: "center" }}
                isOpenModal={isOpen}
                handleOpenChange={handleOpenChange}
            />



            <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'flex-end' }} className="uploadExcelBtn">
                <CustomizedMenus
                    handleOpenChange={handleOpenChange}
                    isOpenModal={isOpen}
                />
            </div>
            <Table
                rowKey={(record) => record + Math.floor(Math.random() * 10000)}
                bordered
                dataSource={data}
                columns={columns}
                pagination={{
                    //pageSize: pageSize,
                    //current: page,
                    //total: totalCount,
                    //onChange: (page) => {
                    //getProducts(page);
                    //},
                }}
            />
        </div>


    );
};
